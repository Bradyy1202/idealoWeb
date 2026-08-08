import { Prisma } from '@prisma/client';
import { prisma } from '@/shared/lib/prisma';
import type { ProductFilters, ProductSort } from './schema';

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

type ProductFilterFields = Pick<
  ProductFilters,
  'categoryIds' | 'attributeValueIdsByAttribute' | 'q'
>;

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

  // `OR` a este nivel se combina con AND con el resto de las claves del
  // where (isActive, categoryId, AND): es una restricción más, no reemplaza
  // las demás. Adentro, coincide con cualquiera de los tres campos.
  if (filters.q) {
    where.OR = [
      { name: { contains: filters.q, mode: 'insensitive' } },
      { description: { contains: filters.q, mode: 'insensitive' } },
      { sku: { contains: filters.q, mode: 'insensitive' } },
    ];
  }

  return where;
}

const productOrderByMap: Record<ProductSort, Prisma.ProductOrderByWithRelationInput[]> = {
  featured: [{ sortOrder: 'asc' }, { name: 'asc' }],
  'name-asc': [{ name: 'asc' }],
  'price-asc': [{ basePrice: 'asc' }, { name: 'asc' }],
  'price-desc': [{ basePrice: 'desc' }, { name: 'asc' }],
  newest: [{ createdAt: 'desc' }],
};

export async function findManyByFilters(filters: ProductFilters): Promise<ProductListRow[]> {
  return prisma.product.findMany({
    where: buildProductWhere(filters),
    select: productListSelect,
    orderBy: productOrderByMap[filters.sort],
    skip: filters.skip,
    take: filters.take,
  });
}

export async function countByFilters(filters: ProductFilterFields): Promise<number> {
  return prisma.product.count({ where: buildProductWhere(filters) });
}

const productDetailSelect = {
  id: true,
  name: true,
  slug: true,
  sku: true,
  shortDescription: true,
  description: true,
  basePrice: true,
  priceIsFrom: true,
  currency: true,
  customizationNotes: true,
  minOrderQuantity: true,
  category: { select: { id: true, name: true, slug: true } },
  images: {
    orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
    select: { id: true, url: true, alt: true, blurHash: true, width: true, height: true },
  },
  attributeValues: {
    select: {
      attributeValue: {
        select: {
          value: true,
          hexColor: true,
          attribute: { select: { name: true, slug: true, unit: true, sortOrder: true } },
        },
      },
    },
  },
} satisfies Prisma.ProductSelect;

export type ProductDetailRow = Prisma.ProductGetPayload<{ select: typeof productDetailSelect }>;

/** `findFirst` (no `findUnique`) porque combina el slug único con `isActive`. */
export async function findBySlug(slug: string): Promise<ProductDetailRow | null> {
  return prisma.product.findFirst({
    where: { slug, isActive: true },
    select: productDetailSelect,
  });
}
