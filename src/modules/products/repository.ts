import { Prisma } from '@prisma/client';
import { prisma } from '@/shared/lib/prisma';
import type { ProductFilters } from './schema';

const productListSelect = {
  id: true,
  name: true,
  slug: true,
  shortDescription: true,
  basePrice: true,
  priceIsFrom: true,
  currency: true,
  images: {
    // No confiar solo en `isPrimary`: si por error nada quedó marcado como
    // primaria, igual se muestra la primera por sortOrder en vez de nada.
    orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
    take: 1,
    select: { url: true, alt: true, blurHash: true, width: true, height: true },
  },
} satisfies Prisma.ProductSelect;

export type ProductListRow = Prisma.ProductGetPayload<{ select: typeof productListSelect }>;

type ProductFilterFields = Pick<ProductFilters, 'categoryIds' | 'attributeValueIdsByAttribute'>;

/**
 * Arma el `where` de Prisma para el filtrado multifaceta. Función pura
 * (no toca la base): así se puede testear con Vitest sin mocks cuando
 * la Fase 6 configure el runner. Ver docs/PLAN.md, sección Fase 2.
 */
export function buildProductWhere(filters: ProductFilterFields): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = { isActive: true };

  // Ojo: `categoryId: { in: [] }` no significa "todas", significa "ninguna".
  // Por eso la cláusula se omite entera cuando no hay categorías.
  if (filters.categoryIds.length > 0) {
    where.categoryId = { in: filters.categoryIds };
  }

  const attributeGroups = Object.values(filters.attributeValueIdsByAttribute).filter(
    (valueIds) => valueIds.length > 0,
  );

  // Valores del MISMO atributo → OR (un solo `some` con `in`).
  // Atributos DISTINTOS → AND (un `some` por grupo, dentro del array de AND).
  if (attributeGroups.length > 0) {
    where.AND = attributeGroups.map((valueIds) => ({
      attributeValues: { some: { attributeValueId: { in: valueIds } } },
    }));
  }

  return where;
}

export async function findManyByFilters(filters: ProductFilters): Promise<ProductListRow[]> {
  return prisma.product.findMany({
    where: buildProductWhere(filters),
    select: productListSelect,
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    skip: filters.skip,
    take: filters.take,
  });
}

export async function countByFilters(filters: ProductFilterFields): Promise<number> {
  return prisma.product.count({ where: buildProductWhere(filters) });
}
