'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useQuoteList } from '../hooks';

export function QuoteListBadge() {
  const { items } = useQuoteList();
  const count = items.length;

  return (
    <Link
      href="/lista-de-cotizacion"
      aria-label={count > 0 ? `Ver lista de cotización (${count})` : 'Ver lista de cotización'}
      className="hover:bg-accent text-foreground relative inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors"
    >
      <ShoppingCart className="h-[1.15rem] w-[1.15rem]" aria-hidden />
      {count > 0 ? (
        <span className="bg-coral text-coral-foreground absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[0.625rem] font-semibold">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
