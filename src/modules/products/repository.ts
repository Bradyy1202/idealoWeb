import { Prisma } from '@prisma/client';
import { prisma } from '@/shared/lib/prisma';
import type { ProductAdminFilters, ProductFilters, ProductSort } from './schema';

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

// Para el panel (Fase 4): a diferencia de buildProductWhere(), estos SÍ
// cuentan productos inactivos a propósito. Separado de la consulta pública
// para no arriesgar que un flag mal puesto filtre productos inactivos en
// el catálogo del sitio.
export async function countAll(): Promise<number> {
  return prisma.product.count();
}

export async function countActive(): Promise<number> {
  return prisma.product.count({ where: { isActive: true } });
}

// ---------------------------------------------------------------------------
// Listado admin (tarea 4.6): a diferencia de findManyByFilters, incluye
// productos inactivos y no combina AND/OR de atributos, solo texto + estado.
// ---------------------------------------------------------------------------

const productAdminListSelect = {
  id: true,
  name: true,
  slug: true,
  sku: true,
  basePrice: true,
  isActive: true,
  isFeatured: true,
  category: { select: { id: true, name: true } },
  images: {
    orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
    take: 1,
    select: { url: true },
  },
} satisfies Prisma.ProductSelect;

export type ProductAdminListRow = Prisma.ProductGetPayload<{
  select: typeof productAdminListSelect;
}>;

function buildAdminWhere(
  filters: Pick<ProductAdminFilters, 'q' | 'status'>,
): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {};
  if (filters.status === 'active') where.isActive = true;
  if (filters.status === 'inactive') where.isActive = false;

  if (filters.q) {
    where.OR = [
      { name: { contains: filters.q, mode: 'insensitive' } },
      { sku: { contains: filters.q, mode: 'insensitive' } },
    ];
  }
  return where;
}

export async function findManyForAdmin(
  filters: ProductAdminFilters,
): Promise<ProductAdminListRow[]> {
  return prisma.product.findMany({
    where: buildAdminWhere(filters),
    select: productAdminListSelect,
    orderBy: { name: 'asc' },
    skip: filters.skip,
    take: filters.take,
  });
}

export async function countForAdmin(
  filters: Pick<ProductAdminFilters, 'q' | 'status'>,
): Promise<number> {
  return prisma.product.count({ where: buildAdminWhere(filters) });
}

// ---------------------------------------------------------------------------
// Formulario de producto (tareas 4.7-4.9)
// ---------------------------------------------------------------------------

const productEditSelect = {
  id: true,
  name: true,
  slug: true,
  sku: true,
  shortDescription: true,
  description: true,
  basePrice: true,
  priceIsFrom: true,
  currency: true,
  categoryId: true,
  isActive: true,
  isFeatured: true,
  sortOrder: true,
  customizationNotes: true,
  minOrderQuantity: true,
  metaTitle: true,
  metaDescription: true,
  images: {
    orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
    select: {
      id: true,
      url: true,
      imageId: true,
      alt: true,
      width: true,
      height: true,
      isPrimary: true,
      sortOrder: true,
    },
  },
  attributeValues: { select: { attributeValueId: true } },
} satisfies Prisma.ProductSelect;

export type ProductEditRow = Prisma.ProductGetPayload<{ select: typeof productEditSelect }>;

export async function findByIdForEdit(id: string): Promise<ProductEditRow | null> {
  return prisma.product.findUnique({ where: { id }, select: productEditSelect });
}

export type ProductWriteData = {
  name: string;
  slug: string;
  sku: string | null;
  shortDescription: string | null;
  description: string | null;
  basePrice: number | null;
  priceIsFrom: boolean;
  currency: string;
  categoryId: string;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  customizationNotes: string | null;
  minOrderQuantity: number;
  metaTitle: string | null;
  metaDescription: string | null;
};

export async function create(
  data: ProductWriteData,
  attributeValueIds: string[],
): Promise<{ id: string; slug: string }> {
  return prisma.product.create({
    data: {
      ...data,
      attributeValues: {
        create: attributeValueIds.map((attributeValueId) => ({ attributeValueId })),
      },
    },
    select: { id: true, slug: true },
  });
}

/** Reemplaza todos los ProductAttributeValue en vez de diffear: más simple y el volumen por producto es chico. */
export async function update(
  id: string,
  data: ProductWriteData,
  attributeValueIds: string[],
): Promise<{ id: string; slug: string }> {
  return prisma.$transaction(async (tx) => {
    await tx.productAttributeValue.deleteMany({ where: { productId: id } });
    return tx.product.update({
      where: { id },
      data: {
        ...data,
        attributeValues: {
          create: attributeValueIds.map((attributeValueId) => ({ attributeValueId })),
        },
      },
      select: { id: true, slug: true },
    });
  });
}

/** public_id de Cloudinary de cada imagen: la llamada a Cloudinary para borrarlas vive en service.ts, no acá. */
export async function findImageIdsForProduct(productId: string): Promise<string[]> {
  const images = await prisma.productImage.findMany({
    where: { productId, imageId: { not: null } },
    select: { imageId: true },
  });
  return images.map((image) => image.imageId).filter((id): id is string => id !== null);
}

export async function remove(id: string): Promise<void> {
  await prisma.product.delete({ where: { id } });
}

// ---------------------------------------------------------------------------
// Imágenes de producto (tarea 4.8)
// ---------------------------------------------------------------------------

export async function addImage(input: {
  productId: string;
  url: string;
  imageId: string;
  width?: number;
  height?: number;
  alt?: string;
}): Promise<{ id: string }> {
  const [{ _max }, existingCount] = await Promise.all([
    prisma.productImage.aggregate({
      where: { productId: input.productId },
      _max: { sortOrder: true },
    }),
    prisma.productImage.count({ where: { productId: input.productId } }),
  ]);

  return prisma.productImage.create({
    data: {
      productId: input.productId,
      url: input.url,
      imageId: input.imageId,
      width: input.width,
      height: input.height,
      alt: input.alt,
      sortOrder: (_max.sortOrder ?? -1) + 1,
      // La primera imagen que se sube queda como primaria por defecto.
      isPrimary: existingCount === 0,
    },
    select: { id: true },
  });
}

export type RemovedImage = { imageId: string | null; productId: string };

/** Devuelve el public_id de Cloudinary (o null) para que service.ts lo borre allá también. */
export async function removeImage(imageId: string): Promise<RemovedImage | null> {
  const image = await prisma.productImage.findUnique({
    where: { id: imageId },
    select: { imageId: true, productId: true, isPrimary: true },
  });
  if (!image) return null;

  await prisma.productImage.delete({ where: { id: imageId } });

  if (image.isPrimary) {
    const next = await prisma.productImage.findFirst({
      where: { productId: image.productId },
      orderBy: { sortOrder: 'asc' },
      select: { id: true },
    });
    if (next) {
      await prisma.productImage.update({ where: { id: next.id }, data: { isPrimary: true } });
    }
  }

  return { imageId: image.imageId, productId: image.productId };
}

export async function reorderImages(productId: string, orderedImageIds: string[]): Promise<void> {
  const matchingCount = await prisma.productImage.count({
    where: { id: { in: orderedImageIds }, productId },
  });
  if (matchingCount !== orderedImageIds.length) {
    throw new Error('Alguna imagen no pertenece a este producto.');
  }

  await prisma.$transaction(
    orderedImageIds.map((id, index) =>
      prisma.productImage.update({ where: { id }, data: { sortOrder: index } }),
    ),
  );
}

export async function setPrimaryImage(productId: string, imageId: string): Promise<void> {
  await prisma.$transaction([
    prisma.productImage.updateMany({ where: { productId }, data: { isPrimary: false } }),
    prisma.productImage.update({ where: { id: imageId }, data: { isPrimary: true } }),
  ]);
}

/** Para revalidar `/producto/[slug]` tras una mutación que solo conoce el id (imágenes). */
export async function findSlugById(id: string): Promise<string | null> {
  const row = await prisma.product.findUnique({ where: { id }, select: { slug: true } });
  return row?.slug ?? null;
}

/** Acción rápida del listado (tarea 4.6): no toca atributos ni imágenes, solo el estado. */
export async function setActive(id: string, isActive: boolean): Promise<void> {
  await prisma.product.update({ where: { id }, data: { isActive } });
}
