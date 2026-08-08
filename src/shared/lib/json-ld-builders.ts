import { SITE_URL } from './site-url';
import { DEFAULT_OG_IMAGE } from './og-image';

export function buildBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export type ProductJsonLdInput = {
  name: string;
  slug: string;
  sku: string | null;
  shortDescription: string | null;
  description: string | null;
  basePrice: number | null;
  currency: string;
  images: Array<{ url: string }>;
  category: { name: string };
};

/**
 * `offers` se omite si no hay precio de referencia (basePrice null, "a
 * cotizar"): Offer de schema.org exige un price, y no hay uno real que
 * declarar todavía. `availability: InStock` asume que "cotizable por
 * WhatsApp" equivale a disponible — no hay control de inventario en este
 * catálogo, ver docs/PLAN.md. `image` cae a la imagen de marca por defecto
 * si el producto todavía no tiene fotos: Google exige al menos una imagen
 * para que el rich result de Product sea elegible.
 */
export function buildProductJsonLd(product: ProductJsonLdInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription ?? product.description ?? undefined,
    sku: product.sku ?? undefined,
    image:
      product.images.length > 0
        ? product.images.map((image) => image.url)
        : [`${SITE_URL}${DEFAULT_OG_IMAGE.url}`],
    category: product.category.name,
    offers:
      product.basePrice === null
        ? undefined
        : {
            '@type': 'Offer',
            url: `${SITE_URL}/producto/${product.slug}`,
            priceCurrency: product.currency,
            price: product.basePrice,
            availability: 'https://schema.org/InStock',
          },
  };
}
