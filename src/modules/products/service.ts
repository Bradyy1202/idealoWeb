import { productFiltersSchema } from './schema';
import { findManyByFilters, countByFilters, type ProductListRow } from './repository';

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
