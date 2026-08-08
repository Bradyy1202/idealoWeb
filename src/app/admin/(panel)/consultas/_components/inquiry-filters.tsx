'use client';

import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { inquirySourceLabels, inquiryStatusLabels } from '@/modules/inquiries/service';

const DEBOUNCE_MS = 400;

export function InquiryFilters({
  initialQuery,
  initialStatus,
  initialSource,
}: {
  initialQuery: string;
  initialStatus: string;
  initialSource: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  function updateParams(next: { q?: string; status?: string; source?: string }) {
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

    if (next.source !== undefined) {
      if (next.source && next.source !== 'all') params.set('source', next.source);
      else params.delete('source');
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

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <input
        type="search"
        value={query}
        onChange={handleQueryChange}
        placeholder="Buscar por nombre, correo o teléfono..."
        aria-label="Buscar consultas"
        className="border-border bg-background w-full rounded-full border px-4 py-2 text-sm sm:max-w-xs"
      />
      <select
        defaultValue={initialStatus}
        onChange={(event) => updateParams({ status: event.target.value })}
        aria-label="Filtrar por estado"
        className="border-border bg-background rounded-full border px-3 py-2 text-sm"
      >
        <option value="all">Todos los estados</option>
        {Object.entries(inquiryStatusLabels).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <select
        defaultValue={initialSource}
        onChange={(event) => updateParams({ source: event.target.value })}
        aria-label="Filtrar por origen"
        className="border-border bg-background rounded-full border px-3 py-2 text-sm"
      >
        <option value="all">Todos los orígenes</option>
        {Object.entries(inquirySourceLabels).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
