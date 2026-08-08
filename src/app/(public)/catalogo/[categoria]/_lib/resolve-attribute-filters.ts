import type { FilterableAttribute } from '@/modules/categories/service';

type SearchParams = Record<string, string | string[] | undefined>;

/** `?material=acero-inoxidable,aluminio` -> ['acero-inoxidable', 'aluminio']. */
export function getSelectedSlugs(searchParams: SearchParams, attributeSlug: string): string[] {
  const raw = searchParams[attributeSlug];
  const rawValue = Array.isArray(raw) ? raw[0] : raw;
  return rawValue ? rawValue.split(',').filter(Boolean) : [];
}

/**
 * Traduce los slugs de la URL (legibles, pensados para compartir el enlace)
 * a ids de AttributeValue (lo que pide `productFiltersSchema`). Un slug que
 * no coincide con ningún valor conocido de la categoría se ignora en
 * silencio: no hay forma de armar una URL inválida que rompa la página.
 */
export function resolveAttributeFilters(
  searchParams: SearchParams,
  filterableAttributes: FilterableAttribute[],
): Record<string, string[]> {
  const result: Record<string, string[]> = {};

  for (const attribute of filterableAttributes) {
    const selectedSlugs = new Set(getSelectedSlugs(searchParams, attribute.slug));
    if (selectedSlugs.size === 0) continue;

    const valueIds = attribute.values
      .filter((value) => selectedSlugs.has(value.slug))
      .map((value) => value.id);

    if (valueIds.length > 0) {
      result[attribute.id] = valueIds;
    }
  }

  return result;
}
