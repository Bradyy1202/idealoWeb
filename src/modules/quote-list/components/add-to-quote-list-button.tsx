'use client';

import { Button } from '@/shared/ui/button';
import { useQuoteList } from '../hooks';
import type { QuoteListItemInput } from '../schema';

export function AddToQuoteListButton({ product }: { product: QuoteListItemInput }) {
  const { items, addItem } = useQuoteList();
  const isAdded = items.some((item) => item.productId === product.productId);

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="w-full rounded-full sm:w-auto"
      onClick={() => addItem(product)}
      disabled={isAdded}
    >
      {isAdded ? 'Ya está en tu lista' : 'Agregar a la lista de cotización'}
    </Button>
  );
}
