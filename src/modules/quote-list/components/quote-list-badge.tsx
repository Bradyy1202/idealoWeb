'use client';

import Link from 'next/link';
import { ClipboardList } from 'lucide-react';
import { useQuoteList } from '../hooks';

export function QuoteListBadge() {
  const { items } = useQuoteList();
  const count = items.length;

  return (
    <Link
      href="/lista-de-cotizacion"
      aria-label={count > 0 ? `Ver lista de cotización (${count})` : 'Ver lista de cotización'}
      className="hover:text-foreground text-muted-foreground relative inline-flex h-9 w-9 items-center justify-center"
    >
      <ClipboardList className="h-5 w-5" aria-hidden />
      {count > 0 ? (
        <span className="bg-primary text-primary-foreground absolute top-0 right-0 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[0.625rem] font-semibold">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
