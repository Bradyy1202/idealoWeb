import { productFiltersSchema, productSlugSchema } from './schema';
import {
  findManyByFilters,
  countByFilters,
  findBySlug,
  countAll,
  countActive,
  type ProductListRow,
  type ProductDetailRow,
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
