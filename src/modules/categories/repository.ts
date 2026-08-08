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
