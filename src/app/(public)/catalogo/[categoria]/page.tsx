import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/shared/ui/container';
import { getCategoryDetailBySlug } from '@/modules/categories/service';
import { getFilteredProducts } from '@/modules/products/service';
import { DEFAULT_PAGE_SIZE, productSortSchema, type ProductSort } from '@/modules/products/schema';
import { ProductGrid } from '@/modules/products/components/product-grid';
import { ProductGridSkeleton } from '@/modules/products/components/product-grid-skeleton';
import { SortSelect } from '../_components/sort-select';
import { Pagination } from '@/shared/ui/pagination';
import { SearchInput } from '../_components/search-input';
import { AttributeFilterPanel } from './_components/attribute-filter-panel';
import { resolveAttributeFilters } from './_lib/resolve-attribute-filters';

type CategoriaPageProps = {
  params: Promise<{ categoria: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function parsePage(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Number(raw);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export async function generateMetadata({ params }: CategoriaPageProps): Promise<Metadata> {
  const { categoria } = await params;
  const category = await getCategoryDetailBySlug(categoria);
  if (!category) return {};

  return {
    title: `${category.name} | Catálogo | Idealo`,
    description: category.description ?? undefined,
  };
}

export default async function CategoriaPage({ params, searchParams }: CategoriaPageProps) {
  const { categoria } = await params;
  const category = await getCategoryDetailBySlug(categoria);
  // No agregar loading.tsx a esta ruta (ni a la carpeta padre catalogo/):
  // rompe el status 404 de notFound(). Ver el comentario equivalente en
  // producto/[slug]/page.tsx. El Suspense de abajo es de componente, no de
  // archivo, y se resuelve después de este chequeo: no tiene ese problema.
  if (!category) notFound();

  const resolvedSearchParams = await searchParams;
  const basePath = `/catalogo/${category.slug}`;

  const rawSort = resolvedSearchParams.orden;
  const sortResult = productSortSchema.safeParse(Array.isArray(rawSort) ? rawSort[0] : rawSort);
  const sort = sortResult.success ? sortResult.data : 'featured';

  const page = parsePage(resolvedSearchParams.pagina);

  const rawQuery = resolvedSearchParams.q;
  const q = Array.isArray(rawQuery) ? rawQuery[0] : rawQuery;

  const attributeValueIdsByAttribute = resolveAttributeFilters(
    resolvedSearchParams,
    category.filterableAttributes,
  );

  return (
    <Container className="py-16 md:py-24">
      <Link href="/catalogo" className="text-muted-foreground hover:text-foreground text-sm">
        ← Ver todo el catálogo
      </Link>

      <div className="mt-4 flex flex-col gap-4 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{category.name}</h1>
          {category.description ? (
            <p className="text-muted-foreground mt-2 max-w-[60ch]">{category.description}</p>
          ) : null}
        </div>
        <SortSelect value={sort} />
      </div>

      <div className="pb-6">
        <SearchInput initialValue={q ?? ''} />
      </div>

      <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
        {category.filterableAttributes.length > 0 ? (
          <AttributeFilterPanel
            attributes={category.filterableAttributes}
            searchParams={resolvedSearchParams}
            basePath={basePath}
          />
        ) : null}

        <Suspense
          key={`${sort}-${page}-${q ?? ''}-${JSON.stringify(attributeValueIdsByAttribute)}`}
          fallback={<ProductGridSkeleton />}
        >
          <CategoriaResults
            categoryIds={category.categoryIdsForFiltering}
            attributeValueIdsByAttribute={attributeValueIdsByAttribute}
            q={q}
            sort={sort}
            page={page}
            basePath={basePath}
            searchParams={resolvedSearchParams}
          />
        </Suspense>
      </div>
    </Container>
  );
}

type CategoriaResultsProps = {
  categoryIds: string[];
  attributeValueIdsByAttribute: Record<string, string[]>;
  q: string | undefined;
  sort: ProductSort;
  page: number;
  basePath: string;
  searchParams: Record<string, string | string[] | undefined>;
};

async function CategoriaResults({
  categoryIds,
  attributeValueIdsByAttribute,
  q,
  sort,
  page,
  basePath,
  searchParams,
}: CategoriaResultsProps) {
  const skip = (page - 1) * DEFAULT_PAGE_SIZE;
  const { items, total } = await getFilteredProducts({
    categoryIds,
    attributeValueIdsByAttribute,
    q,
    sort,
    skip,
    take: DEFAULT_PAGE_SIZE,
  });
  const totalPages = Math.max(1, Math.ceil(total / DEFAULT_PAGE_SIZE));

  return (
    <div>
      <p className="text-muted-foreground pb-4 text-sm">
        {total} {total === 1 ? 'producto' : 'productos'}
      </p>
      <ProductGrid items={items} />
      <Pagination
        page={page}
        totalPages={totalPages}
        searchParams={searchParams}
        basePath={basePath}
      />
    </div>
  );
}
