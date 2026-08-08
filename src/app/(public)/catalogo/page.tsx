import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Container } from '@/shared/ui/container';
import { getFilteredProducts } from '@/modules/products/service';
import { DEFAULT_PAGE_SIZE, productSortSchema, type ProductSort } from '@/modules/products/schema';
import { ProductGrid } from '@/modules/products/components/product-grid';
import { ProductGridSkeleton } from '@/modules/products/components/product-grid-skeleton';
import { SortSelect } from './_components/sort-select';
import { Pagination } from './_components/pagination';
import { SearchInput } from './_components/search-input';

export const metadata: Metadata = {
  title: 'Catálogo | Idealo',
  description: 'Explorá botellas, tazas, textiles y accesorios personalizados por sublimación.',
};

type CatalogoPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function parsePage(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Number(raw);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export default async function CatalogoPage({ searchParams }: CatalogoPageProps) {
  const resolvedSearchParams = await searchParams;

  // Parseo laxo: una URL vieja o manipulada con un valor inválido cae al
  // default en vez de tirar un error 500 en una página pública.
  const rawSort = resolvedSearchParams.orden;
  const sortResult = productSortSchema.safeParse(Array.isArray(rawSort) ? rawSort[0] : rawSort);
  const sort = sortResult.success ? sortResult.data : 'featured';

  const page = parsePage(resolvedSearchParams.pagina);

  const rawQuery = resolvedSearchParams.q;
  const q = Array.isArray(rawQuery) ? rawQuery[0] : rawQuery;

  return (
    <Container className="py-16 md:py-24">
      <div className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Catálogo</h1>
        <SortSelect value={sort} />
      </div>

      <div className="pb-6">
        <SearchInput initialValue={q ?? ''} />
      </div>

      {/*
        Suspense de componente, no `loading.tsx`: un `loading.tsx` de archivo
        en esta carpeta también envuelve a la ruta hija /catalogo/[categoria]
        (comparten el segmento `catalogo`), y ahí rompe el status 404 de
        notFound() — Next empieza a streamear el shell en 200 antes de saber
        si la categoría existe. Este Suspense es local a este componente,
        no se propaga a otras rutas.
      */}
      <Suspense key={`${sort}-${page}-${q ?? ''}`} fallback={<ProductGridSkeleton />}>
        <CatalogoResults sort={sort} page={page} q={q} searchParams={resolvedSearchParams} />
      </Suspense>
    </Container>
  );
}

type CatalogoResultsProps = {
  sort: ProductSort;
  page: number;
  q: string | undefined;
  searchParams: Record<string, string | string[] | undefined>;
};

async function CatalogoResults({ sort, page, q, searchParams }: CatalogoResultsProps) {
  const skip = (page - 1) * DEFAULT_PAGE_SIZE;
  const { items, total } = await getFilteredProducts({ q, sort, skip, take: DEFAULT_PAGE_SIZE });
  const totalPages = Math.max(1, Math.ceil(total / DEFAULT_PAGE_SIZE));

  return (
    <>
      <p className="text-muted-foreground pb-4 text-sm">
        {total} {total === 1 ? 'producto' : 'productos'}
      </p>

      <ProductGrid items={items} />

      <Pagination
        page={page}
        totalPages={totalPages}
        searchParams={searchParams}
        basePath="/catalogo"
      />
    </>
  );
}
