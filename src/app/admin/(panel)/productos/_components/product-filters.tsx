'use client';

import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const DEBOUNCE_MS = 400;

export function ProductFilters({
  initialQuery,
  initialStatus,
}: {
  initialQuery: string;
  initialStatus: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  function updateParams(next: { q?: string; status?: string }) {
    const params = new URLSearchParams(searchParams);

    if (next.q !== undefined) {
      const trimmed = next.q.trim();
      if (trimmed) params.set('q', trimmed);
      else params.delete('q');
    }

    if (next.status !== undefined) {
      if (next.status && next.status !== 'all') params.set('status', next.status);
      else params.delete('status');
    }

    params.delete('pagina');
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  }

  function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setQuery(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateParams({ q: value }), DEBOUNCE_MS);
  }

  function handleStatusChange(event: ChangeEvent<HTMLSelectElement>) {
    updateParams({ status: event.target.value });
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <input
        type="search"
        value={query}
        onChange={handleQueryChange}
        placeholder="Buscar por nombre o SKU..."
        aria-label="Buscar productos"
        className="border-border bg-background w-full rounded-full border px-4 py-2 text-sm sm:max-w-xs"
      />
      <select
        defaultValue={initialStatus}
        onChange={handleStatusChange}
        aria-label="Filtrar por estado"
        className="border-border bg-background rounded-full border px-3 py-2 text-sm"
      >
        <option value="all">Todos los estados</option>
        <option value="active">Activos</option>
        <option value="inactive">Inactivos</option>
      </select>
    </div>
  );
}
