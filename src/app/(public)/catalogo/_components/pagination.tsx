import Link from 'next/link';

type PaginationProps = {
  page: number;
  totalPages: number;
  searchParams: Record<string, string | string[] | undefined>;
  basePath: string;
};

function buildHref(
  basePath: string,
  page: number,
  searchParams: Record<string, string | string[] | undefined>,
) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (key === 'pagina' || value === undefined) continue;
    if (Array.isArray(value)) {
      for (const item of value) params.append(key, item);
    } else {
      params.set(key, value);
    }
  }
  if (page > 1) params.set('pagina', String(page));

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

/** Enlaces reales (no botones con JS): funciona sin cliente y es rastreable por buscadores. */
export function Pagination({ page, totalPages, searchParams, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const linkClassName =
    'border-border rounded-full border px-4 py-2 text-sm transition-colors hover:bg-accent';
  const disabledClassName =
    'text-muted-foreground/50 rounded-full border border-transparent px-4 py-2 text-sm';

  return (
    <nav
      aria-label="Paginación del catálogo"
      className="flex items-center justify-center gap-4 pt-12"
    >
      {page > 1 ? (
        <Link href={buildHref(basePath, page - 1, searchParams)} className={linkClassName}>
          ← Anterior
        </Link>
      ) : (
        <span className={disabledClassName}>← Anterior</span>
      )}

      <span className="text-muted-foreground text-sm">
        Página {page} de {totalPages}
      </span>

      {page < totalPages ? (
        <Link href={buildHref(basePath, page + 1, searchParams)} className={linkClassName}>
          Siguiente →
        </Link>
      ) : (
        <span className={disabledClassName}>Siguiente →</span>
      )}
    </nav>
  );
}
