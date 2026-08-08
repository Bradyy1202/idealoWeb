import { categorySlugSchema } from './schema';
import {
  findCategoryTree,
  findCategoryBySlugWithAttributes,
  type CategoryDetailRow,
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
