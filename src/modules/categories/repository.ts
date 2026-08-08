import { Prisma } from '@prisma/client';
import { prisma } from '@/shared/lib/prisma';

const categoryTreeSelect = {
  id: true,
  name: true,
  slug: true,
  imageUrl: true,
  children: {
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: { id: true, name: true, slug: true },
  },
} satisfies Prisma.CategorySelect;

export type CategoryTreeRow = Prisma.CategoryGetPayload<{ select: typeof categoryTreeSelect }>;

/** Categorías raíz activas con sus hijas activas, para el árbol de navegación. */
export async function findCategoryTree(): Promise<CategoryTreeRow[]> {
  return prisma.category.findMany({
    where: { isActive: true, parentId: null },
    select: categoryTreeSelect,
    orderBy: { sortOrder: 'asc' },
  });
}

const categoryDetailSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  parentId: true,
  children: {
    where: { isActive: true },
    select: { id: true },
  },
  attributes: {
    // CategoryAttribute define qué atributos son filtro EN ESTA categoría;
    // Attribute.isFilterable es un interruptor global adicional de seguridad.
    where: { attribute: { isFilterable: true } },
    orderBy: { sortOrder: 'asc' },
    select: {
      attribute: {
        select: {
          id: true,
          name: true,
          slug: true,
          type: true,
          unit: true,
          values: {
            orderBy: { sortOrder: 'asc' },
            select: { id: true, value: true, slug: true, hexColor: true },
          },
        },
      },
    },
  },
} satisfies Prisma.CategorySelect;

export type CategoryDetailRow = Prisma.CategoryGetPayload<{ select: typeof categoryDetailSelect }>;

/** Una categoría con sus hijas (solo ids) y sus atributos filtrables asociados. */
export async function findCategoryBySlugWithAttributes(
  slug: string,
): Promise<CategoryDetailRow | null> {
  return prisma.category.findUnique({
    where: { slug },
    select: categoryDetailSelect,
  });
}

/** Todas las categorías (incluye inactivas): para el panel (Fase 4). */
export async function countAll(): Promise<number> {
  return prisma.category.count();
}

const categoryAdminSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  imageUrl: true,
  parentId: true,
  sortOrder: true,
  isActive: true,
  _count: { select: { products: true, children: true } },
  // Sin el filtro por isFilterable de categoryDetailSelect: el panel asigna
  // valores de CUALQUIER atributo ligado a la categoría, no solo los que se
  // muestran como filtro público (la ficha de producto ya muestra todos los
  // specs, filtrables o no).
  attributes: {
    orderBy: { sortOrder: 'asc' },
    select: {
      attribute: {
        select: {
          id: true,
          name: true,
          slug: true,
          type: true,
          unit: true,
          values: {
            orderBy: { sortOrder: 'asc' },
            select: { id: true, value: true, slug: true, hexColor: true },
          },
        },
      },
    },
  },
} satisfies Prisma.CategorySelect;

export type CategoryAdminRow = Prisma.CategoryGetPayload<{ select: typeof categoryAdminSelect }>;

/** Todas las categorías (activas e inactivas) con sus atributos asociados, para el panel. */
export async function findAllForAdmin(): Promise<CategoryAdminRow[]> {
  return prisma.category.findMany({
    select: categoryAdminSelect,
    orderBy: [{ parentId: 'asc' }, { sortOrder: 'asc' }],
  });
}

export async function findByIdForAdmin(id: string): Promise<CategoryAdminRow | null> {
  return prisma.category.findUnique({ where: { id }, select: categoryAdminSelect });
}

export type CategoryWriteData = {
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  sortOrder: number;
  isActive: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
};

export async function createCategory(
  data: CategoryWriteData,
  attributeIds: string[],
): Promise<{ id: string }> {
  return prisma.category.create({
    data: {
      ...data,
      attributes: { create: attributeIds.map((attributeId) => ({ attributeId })) },
    },
    select: { id: true },
  });
}

export async function updateCategory(
  id: string,
  data: CategoryWriteData,
  attributeIds: string[],
): Promise<{ id: string }> {
  return prisma.$transaction(async (tx) => {
    await tx.categoryAttribute.deleteMany({ where: { categoryId: id } });
    return tx.category.update({
      where: { id },
      data: {
        ...data,
        attributes: { create: attributeIds.map((attributeId) => ({ attributeId })) },
      },
      select: { id: true },
    });
  });
}

export type CategoryDeleteBlockedReason = 'has-products' | 'has-children';

/** Chequea las dos trabas conocidas antes de intentar borrar, para devolver un mensaje claro en vez de que la base tire un error de FK. */
export async function checkCategoryDeletable(
  id: string,
): Promise<CategoryDeleteBlockedReason | null> {
  const category = await prisma.category.findUnique({
    where: { id },
    select: { _count: { select: { products: true, children: true } } },
  });
  if (!category) return null;
  if (category._count.products > 0) return 'has-products';
  if (category._count.children > 0) return 'has-children';
  return null;
}

export async function deleteCategory(id: string): Promise<void> {
  await prisma.category.delete({ where: { id } });
}
