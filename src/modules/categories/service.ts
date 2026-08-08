import { categorySlugSchema, categoryFormSchema, type CategoryFormInput } from './schema';
import {
  findCategoryTree,
  findCategoryBySlugWithAttributes,
  countAll,
  findAllForAdmin,
  findByIdForAdmin,
  createCategory,
  updateCategory,
  checkCategoryDeletable,
  deleteCategory,
  type CategoryDetailRow,
  type CategoryAdminRow,
  type CategoryWriteData,
  type CategoryDeleteBlockedReason,
} from './repository';

export type CategoryTreeNode = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  children: Array<{ id: string; name: string; slug: string }>;
};

// Derivado por acceso indexado del tipo del repository: nunca se escribe
// `import { AttributeType } from '@prisma/client'` en este archivo.
type FilterableAttributeType = CategoryDetailRow['attributes'][number]['attribute']['type'];

export type FilterableAttributeValue = {
  id: string;
  value: string;
  slug: string;
  hexColor: string | null;
};

export type FilterableAttribute = {
  id: string;
  name: string;
  slug: string;
  type: FilterableAttributeType;
  unit: string | null;
  values: FilterableAttributeValue[];
};

export type CategoryDetail = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  /** La propia categoría + sus hijas directas. Usar tal cual para filtrar productos. */
  categoryIdsForFiltering: string[];
  filterableAttributes: FilterableAttribute[];
};

export async function getCategoryTree(): Promise<CategoryTreeNode[]> {
  const categories = await findCategoryTree();
  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    imageUrl: category.imageUrl,
    children: category.children.map((child) => ({
      id: child.id,
      name: child.name,
      slug: child.slug,
    })),
  }));
}

export async function getCategoryCount(): Promise<number> {
  return countAll();
}

export async function getCategoryDetailBySlug(slugInput: unknown): Promise<CategoryDetail | null> {
  const slug = categorySlugSchema.parse(slugInput);
  const category = await findCategoryBySlugWithAttributes(slug);
  if (!category) return null;

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    parentId: category.parentId,
    categoryIdsForFiltering: [category.id, ...category.children.map((child) => child.id)],
    filterableAttributes: category.attributes.map(({ attribute }) => ({
      id: attribute.id,
      name: attribute.name,
      slug: attribute.slug,
      type: attribute.type,
      unit: attribute.unit,
      values: attribute.values.map((value) => ({
        id: value.id,
        value: value.value,
        slug: value.slug,
        hexColor: value.hexColor,
      })),
    })),
  };
}

// ---------------------------------------------------------------------------
// Panel de administración (tarea 4.10)
// ---------------------------------------------------------------------------

export type CategoryAdminItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  parentId: string | null;
  sortOrder: number;
  isActive: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  productCount: number;
  childCount: number;
  filterableAttributes: FilterableAttribute[];
};

function toCategoryAdminItem(row: CategoryAdminRow): CategoryAdminItem {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    imageUrl: row.imageUrl,
    parentId: row.parentId,
    sortOrder: row.sortOrder,
    isActive: row.isActive,
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
    productCount: row._count.products,
    childCount: row._count.children,
    filterableAttributes: row.attributes.map(({ attribute }) => ({
      id: attribute.id,
      name: attribute.name,
      slug: attribute.slug,
      type: attribute.type,
      unit: attribute.unit,
      values: attribute.values.map((value) => ({
        id: value.id,
        value: value.value,
        slug: value.slug,
        hexColor: value.hexColor,
      })),
    })),
  };
}

export async function getCategoriesForAdmin(): Promise<CategoryAdminItem[]> {
  const rows = await findAllForAdmin();
  return rows.map(toCategoryAdminItem);
}

export async function getCategoryForEdit(id: string): Promise<CategoryAdminItem | null> {
  const row = await findByIdForAdmin(id);
  return row ? toCategoryAdminItem(row) : null;
}

function emptyToNull(value: string | undefined): string | null {
  return value && value.trim() !== '' ? value.trim() : null;
}

function toCategoryWriteData(input: CategoryFormInput): CategoryWriteData {
  return {
    name: input.name,
    slug: input.slug,
    description: emptyToNull(input.description),
    parentId: input.parentId ?? null,
    sortOrder: input.sortOrder,
    isActive: input.isActive,
    metaTitle: emptyToNull(input.metaTitle),
    metaDescription: emptyToNull(input.metaDescription),
  };
}

/**
 * Árbol de máximo 2 niveles (ADR 0001): el padre elegido no puede ser, a su
 * vez, hijo de otra categoría, y la propia categoría no puede tener ya
 * subcategorías (si las tuviera, pasarían a ser nietas del nuevo padre).
 */
async function assertValidParent(parentId: string | null, ownId?: string): Promise<void> {
  if (!parentId) return;
  if (parentId === ownId) {
    throw new Error('Una categoría no puede ser su propia categoría padre.');
  }
  const parent = await findByIdForAdmin(parentId);
  if (!parent) {
    throw new Error('La categoría padre elegida no existe.');
  }
  if (parent.parentId) {
    throw new Error('El árbol admite máximo dos niveles: elegí una categoría raíz como padre.');
  }
  if (ownId) {
    const self = await findByIdForAdmin(ownId);
    if (self && self._count.children > 0) {
      throw new Error(
        'Esta categoría tiene subcategorías: no puede pasar a ser, a su vez, una subcategoría.',
      );
    }
  }
}

export async function createCategoryFromInput(input: unknown): Promise<{ id: string }> {
  const parsed = categoryFormSchema.parse(input);
  await assertValidParent(parsed.parentId ?? null);
  return createCategory(toCategoryWriteData(parsed), parsed.attributeIds);
}

export async function updateCategoryFromInput(id: string, input: unknown): Promise<{ id: string }> {
  const parsed = categoryFormSchema.parse(input);
  await assertValidParent(parsed.parentId ?? null, id);
  return updateCategory(id, toCategoryWriteData(parsed), parsed.attributeIds);
}

export class CategoryDeleteBlockedError extends Error {
  reason: CategoryDeleteBlockedReason;

  constructor(reason: CategoryDeleteBlockedReason) {
    super(
      reason === 'has-products'
        ? 'Esta categoría tiene productos asociados: movelos o borralos primero.'
        : 'Esta categoría tiene subcategorías: borralas primero.',
    );
    this.reason = reason;
  }
}

/** Chequea antes de borrar en vez de dejar que la base tire el error de FK (onDelete: Restrict): el panel necesita un mensaje claro, no un 500. */
export async function deleteCategoryById(id: string): Promise<void> {
  const blockedReason = await checkCategoryDeletable(id);
  if (blockedReason) {
    throw new CategoryDeleteBlockedError(blockedReason);
  }
  await deleteCategory(id);
}
