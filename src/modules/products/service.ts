import { destroyCloudinaryImage } from '@/shared/lib/cloudinary';
import {
  productFiltersSchema,
  productSlugSchema,
  productAdminFiltersSchema,
  productFormSchema,
  addProductImageSchema,
  reorderProductImagesSchema,
  type ProductFormInput,
} from './schema';
import {
  findManyByFilters,
  countByFilters,
  findBySlug,
  countAll,
  countActive,
  findManyForAdmin,
  countForAdmin,
  findByIdForEdit,
  create,
  update,
  remove,
  findImageIdsForProduct,
  addImage,
  removeImage,
  reorderImages,
  setPrimaryImage,
  setActive,
  findSlugById,
  type ProductListRow,
  type ProductDetailRow,
  type ProductAdminListRow,
  type ProductWriteData,
} from './repository';

export type ProductListItem = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  basePrice: number | null;
  priceIsFrom: boolean;
  currency: string;
  primaryImage: {
    url: string;
    alt: string | null;
    blurHash: string | null;
    width: number | null;
    height: number | null;
  } | null;
};

export type ProductListResult = {
  items: ProductListItem[];
  total: number;
};

function toProductListItem(row: ProductListRow): ProductListItem {
  // noUncheckedIndexedAccess: row.images[0] es `... | undefined`, no asumir que existe.
  const image = row.images[0];

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    shortDescription: row.shortDescription,
    basePrice: row.basePrice === null ? null : row.basePrice.toNumber(),
    priceIsFrom: row.priceIsFrom,
    currency: row.currency,
    primaryImage: image
      ? {
          url: image.url,
          alt: image.alt,
          blurHash: image.blurHash,
          width: image.width,
          height: image.height,
        }
      : null,
  };
}

export async function getFilteredProducts(input: unknown): Promise<ProductListResult> {
  const filters = productFiltersSchema.parse(input);
  const [rows, total] = await Promise.all([findManyByFilters(filters), countByFilters(filters)]);
  return { items: rows.map(toProductListItem), total };
}

export type ProductGalleryImage = {
  id: string;
  url: string;
  alt: string | null;
  blurHash: string | null;
  width: number | null;
  height: number | null;
};

export type ProductSpec = {
  attributeName: string;
  attributeSlug: string;
  unit: string | null;
  value: string;
  hexColor: string | null;
};

export type ProductDetail = {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  shortDescription: string | null;
  description: string | null;
  basePrice: number | null;
  priceIsFrom: boolean;
  currency: string;
  customizationNotes: string | null;
  minOrderQuantity: number;
  category: { id: string; name: string; slug: string };
  images: ProductGalleryImage[];
  specs: ProductSpec[];
};

function toProductDetail(row: ProductDetailRow): ProductDetail {
  // Orden de exhibición de las especificaciones = sortOrder del Attribute,
  // no el orden en que Prisma devuelve la tabla puente.
  const sortedAttributeValues = [...row.attributeValues].sort(
    (a, b) => a.attributeValue.attribute.sortOrder - b.attributeValue.attribute.sortOrder,
  );

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    sku: row.sku,
    shortDescription: row.shortDescription,
    description: row.description,
    basePrice: row.basePrice === null ? null : row.basePrice.toNumber(),
    priceIsFrom: row.priceIsFrom,
    currency: row.currency,
    customizationNotes: row.customizationNotes,
    minOrderQuantity: row.minOrderQuantity,
    category: row.category,
    images: row.images,
    specs: sortedAttributeValues.map(({ attributeValue }) => ({
      attributeName: attributeValue.attribute.name,
      attributeSlug: attributeValue.attribute.slug,
      unit: attributeValue.attribute.unit,
      value: attributeValue.value,
      hexColor: attributeValue.hexColor,
    })),
  };
}

export async function getProductBySlug(slugInput: unknown): Promise<ProductDetail | null> {
  const slug = productSlugSchema.parse(slugInput);
  const row = await findBySlug(slug);
  return row ? toProductDetail(row) : null;
}

export type ProductCounts = { total: number; active: number };

export async function getProductCounts(): Promise<ProductCounts> {
  const [total, active] = await Promise.all([countAll(), countActive()]);
  return { total, active };
}

/** Mismo categoryId que el producto actual, excluyéndolo. Se pide uno de más para no perder cupo cuando el propio producto aparece en la página. */
export async function getRelatedProducts(
  excludeProductId: string,
  categoryId: string,
  limit = 4,
): Promise<ProductListItem[]> {
  const { items } = await getFilteredProducts({ categoryIds: [categoryId], take: limit + 1 });
  return items.filter((item) => item.id !== excludeProductId).slice(0, limit);
}

// ---------------------------------------------------------------------------
// Panel de administración (Fase 4)
// ---------------------------------------------------------------------------

export type ProductAdminListItem = {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  basePrice: number | null;
  isActive: boolean;
  isFeatured: boolean;
  categoryName: string;
  imageUrl: string | null;
};

export type ProductAdminListResult = { items: ProductAdminListItem[]; total: number };

function toProductAdminListItem(row: ProductAdminListRow): ProductAdminListItem {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    sku: row.sku,
    basePrice: row.basePrice === null ? null : row.basePrice.toNumber(),
    isActive: row.isActive,
    isFeatured: row.isFeatured,
    categoryName: row.category.name,
    imageUrl: row.images[0]?.url ?? null,
  };
}

export async function getAdminProducts(input: unknown): Promise<ProductAdminListResult> {
  const filters = productAdminFiltersSchema.parse(input);
  const [rows, total] = await Promise.all([findManyForAdmin(filters), countForAdmin(filters)]);
  return { items: rows.map(toProductAdminListItem), total };
}

export async function setProductActive(id: string, isActive: boolean): Promise<void> {
  await setActive(id, isActive);
}

export type ProductFormValues = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  description: string;
  basePrice: number | null;
  priceIsFrom: boolean;
  currency: string;
  categoryId: string;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  customizationNotes: string;
  minOrderQuantity: number;
  metaTitle: string;
  metaDescription: string;
  attributeValueIds: string[];
  images: Array<{
    id: string;
    url: string;
    alt: string | null;
    width: number | null;
    height: number | null;
    isPrimary: boolean;
  }>;
};

export async function getProductForEdit(id: string): Promise<ProductFormValues | null> {
  const row = await findByIdForEdit(id);
  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    sku: row.sku ?? '',
    shortDescription: row.shortDescription ?? '',
    description: row.description ?? '',
    basePrice: row.basePrice === null ? null : row.basePrice.toNumber(),
    priceIsFrom: row.priceIsFrom,
    currency: row.currency,
    categoryId: row.categoryId,
    isActive: row.isActive,
    isFeatured: row.isFeatured,
    sortOrder: row.sortOrder,
    customizationNotes: row.customizationNotes ?? '',
    minOrderQuantity: row.minOrderQuantity,
    metaTitle: row.metaTitle ?? '',
    metaDescription: row.metaDescription ?? '',
    attributeValueIds: row.attributeValues.map((attributeValue) => attributeValue.attributeValueId),
    images: row.images.map((image) => ({
      id: image.id,
      url: image.url,
      alt: image.alt,
      width: image.width,
      height: image.height,
      isPrimary: image.isPrimary,
    })),
  };
}

function emptyToNull(value: string | undefined): string | null {
  return value && value.trim() !== '' ? value.trim() : null;
}

function toProductWriteData(input: ProductFormInput): ProductWriteData {
  return {
    name: input.name,
    slug: input.slug,
    sku: emptyToNull(input.sku),
    shortDescription: emptyToNull(input.shortDescription),
    description: emptyToNull(input.description),
    basePrice: input.basePrice ?? null,
    priceIsFrom: input.priceIsFrom,
    currency: input.currency,
    categoryId: input.categoryId,
    isActive: input.isActive,
    isFeatured: input.isFeatured,
    sortOrder: input.sortOrder,
    customizationNotes: emptyToNull(input.customizationNotes),
    minOrderQuantity: input.minOrderQuantity,
    metaTitle: emptyToNull(input.metaTitle),
    metaDescription: emptyToNull(input.metaDescription),
  };
}

export async function createProduct(input: unknown): Promise<{ id: string; slug: string }> {
  const parsed = productFormSchema.parse(input);
  return create(toProductWriteData(parsed), parsed.attributeValueIds);
}

export async function updateProduct(
  id: string,
  input: unknown,
): Promise<{ id: string; slug: string }> {
  const parsed = productFormSchema.parse(input);
  return update(id, toProductWriteData(parsed), parsed.attributeValueIds);
}

/**
 * Borra el producto primero (con sus ProductImage en cascada) y recién
 * después limpia Cloudinary: si Cloudinary falla, no debe dejar el producto
 * a medio borrar. destroyCloudinaryImage() ya traga sus propios errores.
 */
export async function deleteProduct(id: string): Promise<void> {
  const imageIds = await findImageIdsForProduct(id);
  await remove(id);
  await Promise.all(imageIds.map((imageId) => destroyCloudinaryImage(imageId)));
}

export async function addProductImage(input: unknown): Promise<{ id: string }> {
  const parsed = addProductImageSchema.parse(input);
  return addImage(parsed);
}

export async function removeProductImage(imageId: string): Promise<void> {
  const removed = await removeImage(imageId);
  if (removed?.imageId) {
    await destroyCloudinaryImage(removed.imageId);
  }
}

export async function reorderProductImages(input: unknown): Promise<void> {
  const parsed = reorderProductImagesSchema.parse(input);
  await reorderImages(parsed.productId, parsed.orderedImageIds);
}

export async function setProductPrimaryImage(productId: string, imageId: string): Promise<void> {
  await setPrimaryImage(productId, imageId);
}

/** Para revalidar `/producto/[slug]` desde acciones de imagen que solo reciben el id del producto. */
export async function getProductSlugById(productId: string): Promise<string | null> {
  return findSlugById(productId);
}
