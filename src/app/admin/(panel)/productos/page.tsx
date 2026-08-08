import Link from 'next/link';
import type { Metadata } from 'next';
import { getAdminProducts } from '@/modules/products/service';
import { DEFAULT_PAGE_SIZE } from '@/modules/products/schema';
import { Button } from '@/shared/ui/button';
import { Pagination } from '@/shared/ui/pagination';
import { ProductFilters } from './_components/product-filters';
import { ProductTable } from './_components/product-table';

export const metadata: Metadata = { title: 'Productos | Panel' };

type ProductosPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function parsePage(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Number(raw);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export default async function ProductosPage({ searchParams }: ProductosPageProps) {
  const resolvedSearchParams = await searchParams;

  const rawQ = resolvedSearchParams.q;
  const q = Array.isArray(rawQ) ? rawQ[0] : rawQ;

  const rawStatus = resolvedSearchParams.status;
  const status = Array.isArray(rawStatus) ? rawStatus[0] : rawStatus;

  const page = parsePage(resolvedSearchParams.pagina);
  const skip = (page - 1) * DEFAULT_PAGE_SIZE;

  const { items, total } = await getAdminProducts({ q, status, skip, take: DEFAULT_PAGE_SIZE });
  const totalPages = Math.max(1, Math.ceil(total / DEFAULT_PAGE_SIZE));

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Productos</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {total} {total === 1 ? 'producto' : 'productos'}
          </p>
        </div>
        <Link href="/admin/productos/nuevo">
          <Button className="rounded-full">Nuevo producto</Button>
        </Link>
      </div>

      <div className="mt-6">
        <ProductFilters initialQuery={q ?? ''} initialStatus={status ?? 'all'} />
      </div>

      <div className="mt-6">
        <ProductTable items={items} />
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        searchParams={resolvedSearchParams}
        basePath="/admin/productos"
        label="Paginación de productos"
      />
    </div>
  );
}
