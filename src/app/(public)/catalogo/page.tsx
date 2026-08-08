import type { Metadata } from 'next';
import { Container } from '@/shared/ui/container';
import { getFilteredProducts } from '@/modules/products/service';
import { DEFAULT_PAGE_SIZE, productSortSchema } from '@/modules/products/schema';
import { ProductGrid } from '@/modules/products/components/product-grid';
import { SortSelect } from './_components/sort-select';
import { Pagination } from './_components/pagination';

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
  const skip = (page - 1) * DEFAULT_PAGE_SIZE;

  const { items, total } = await getFilteredProducts({ sort, skip, take: DEFAULT_PAGE_SIZE });
  const totalPages = Math.max(1, Math.ceil(total / DEFAULT_PAGE_SIZE));

  return (
    <Container className="py-16 md:py-24">
      <div className="flex flex-col gap-4 pb-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Catálogo</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            {total} {total === 1 ? 'producto' : 'productos'}
          </p>
        </div>
        <SortSelect value={sort} />
      </div>

      <ProductGrid items={items} />

      <Pagination page={page} totalPages={totalPages} searchParams={resolvedSearchParams} />
    </Container>
  );
}
