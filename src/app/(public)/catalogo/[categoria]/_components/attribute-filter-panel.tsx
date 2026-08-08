import Link from 'next/link';
import { cn } from '@/shared/lib/cn';
import type { FilterableAttribute } from '@/modules/categories/service';
import { getSelectedSlugs } from '../_lib/resolve-attribute-filters';

type SearchParams = Record<string, string | string[] | undefined>;

function buildToggleHref(
  basePath: string,
  searchParams: SearchParams,
  attributeSlug: string,
  valueSlug: string,
  isSelected: boolean,
) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (key === 'pagina' || key === attributeSlug || value === undefined) continue;
    if (Array.isArray(value)) {
      for (const item of value) params.append(key, item);
    } else {
      params.set(key, value);
    }
  }

  const currentSlugs = getSelectedSlugs(searchParams, attributeSlug);
  const nextSlugs = isSelected
    ? currentSlugs.filter((slug) => slug !== valueSlug)
    : [...currentSlugs, valueSlug];

  if (nextSlugs.length > 0) {
    params.set(attributeSlug, nextSlugs.join(','));
  }

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

type AttributeFilterPanelProps = {
  attributes: FilterableAttribute[];
  searchParams: SearchParams;
  basePath: string;
};

/** Cada valor es un enlace que prende o apaga su propio slug: sin JS, funciona igual. */
export function AttributeFilterPanel({
  attributes,
  searchParams,
  basePath,
}: AttributeFilterPanelProps) {
  return (
    <aside aria-label="Filtros" className="flex flex-col gap-8">
      {attributes.map((attribute) => (
        <div key={attribute.id}>
          <h2 className="text-sm font-semibold">{attribute.name}</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {attribute.values.map((value) => {
              const isSelected = getSelectedSlugs(searchParams, attribute.slug).includes(
                value.slug,
              );

              return (
                <li key={value.id}>
                  <Link
                    href={buildToggleHref(
                      basePath,
                      searchParams,
                      attribute.slug,
                      value.slug,
                      isSelected,
                    )}
                    aria-pressed={isSelected}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors',
                      isSelected
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border hover:bg-accent',
                    )}
                  >
                    {value.hexColor ? (
                      <span
                        aria-hidden
                        className="inline-block h-2.5 w-2.5 rounded-full border border-white/40"
                        style={{ backgroundColor: value.hexColor }}
                      />
                    ) : null}
                    {value.value}
                    {attribute.unit ? ` ${attribute.unit}` : ''}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </aside>
  );
}
