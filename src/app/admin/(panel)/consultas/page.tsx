import Link from 'next/link';
import type { Metadata } from 'next';
import { getInquiriesForAdmin, inquirySourceLabels } from '@/modules/inquiries/service';
import { Pagination } from '@/shared/ui/pagination';
import { InquiryFilters } from './_components/inquiry-filters';
import { InquiryStatusSelect } from './_components/inquiry-status-select';

export const metadata: Metadata = { title: 'Consultas | Panel' };

const PAGE_SIZE = 20;

type ConsultasPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parsePage(value: string | string[] | undefined): number {
  const page = Number(firstValue(value));
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('es-CR', { dateStyle: 'short', timeStyle: 'short' }).format(date);
}

export default async function ConsultasPage({ searchParams }: ConsultasPageProps) {
  const resolvedSearchParams = await searchParams;
  const q = firstValue(resolvedSearchParams.q);
  const status = firstValue(resolvedSearchParams.status);
  const source = firstValue(resolvedSearchParams.source);
  const page = parsePage(resolvedSearchParams.pagina);
  const skip = (page - 1) * PAGE_SIZE;

  const { items, total } = await getInquiriesForAdmin({
    q,
    status,
    source,
    skip,
    take: PAGE_SIZE,
  });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Consultas</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {total} {total === 1 ? 'consulta' : 'consultas'}
        </p>
      </div>

      <div className="mt-6">
        <InquiryFilters
          initialQuery={q ?? ''}
          initialStatus={status ?? 'all'}
          initialSource={source ?? 'all'}
        />
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {items.length === 0 ? (
          <p className="text-muted-foreground text-sm">No hay consultas con estos filtros.</p>
        ) : null}

        {items.map((inquiry) => (
          <div key={inquiry.id} className="border-border rounded-2xl border p-5">
            <div className="flex items-start justify-between gap-4">
              <Link href={`/admin/consultas/${inquiry.id}`} className="min-w-0 flex-1">
                <p className="truncate font-medium hover:underline">
                  {inquiry.customerName ??
                    inquiry.itemsSummary ??
                    inquirySourceLabels[inquiry.source]}
                </p>
                <p className="text-muted-foreground mt-1 text-sm">
                  {inquirySourceLabels[inquiry.source]} · {formatDate(inquiry.createdAt)}
                  {inquiry.customerEmail ? ` · ${inquiry.customerEmail}` : ''}
                  {inquiry.customerPhone ? ` · ${inquiry.customerPhone}` : ''}
                </p>
                {inquiry.itemsSummary ? (
                  <p className="text-muted-foreground mt-1 truncate text-xs">
                    {inquiry.itemsSummary}
                  </p>
                ) : null}
                {inquiry.message ? (
                  <p className="text-muted-foreground mt-1 line-clamp-1 text-xs">
                    {inquiry.message}
                  </p>
                ) : null}
              </Link>
              <InquiryStatusSelect inquiryId={inquiry.id} status={inquiry.status} />
            </div>
          </div>
        ))}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        searchParams={resolvedSearchParams}
        basePath="/admin/consultas"
        label="Paginación de consultas"
      />
    </div>
  );
}
