import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/shared/lib/site-url';
import { getCategoryTree } from '@/modules/categories/service';
import { getAllActiveProductSlugs } from '@/modules/products/service';

/**
 * Solo rutas indexables con contenido propio: ni /admin (bloqueado en
 * robots.ts) ni /lista-de-cotizacion (personal, vive en localStorage, no
 * hay nada que rastrear).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([getCategoryTree(), getAllActiveProductSlugs()]);

  const categoryEntries: MetadataRoute.Sitemap = categories.flatMap((category) => [
    {
      url: `${SITE_URL}/catalogo/${category.slug}`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...category.children.map((child): MetadataRoute.Sitemap[number] => ({
      url: `${SITE_URL}/catalogo/${child.slug}`,
      changeFrequency: 'weekly',
      priority: 0.8,
    })),
  ]);

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/producto/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [
    { url: SITE_URL, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/catalogo`, changeFrequency: 'daily', priority: 0.9 },
    ...categoryEntries,
    ...productEntries,
  ];
}
