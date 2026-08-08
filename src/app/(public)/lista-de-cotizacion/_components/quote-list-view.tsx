'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatPrice } from '@/shared/lib/format-price';
import { buildQuoteListMessage, buildWhatsAppUrl } from '@/shared/lib/whatsapp';
import { SITE_URL } from '@/shared/lib/site-url';
import { Button } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { EmptyState } from '@/shared/ui/empty-state';
import { Textarea } from '@/shared/ui/textarea';
import { useQuoteList } from '@/modules/quote-list/hooks';
import { registerQuoteListInquiryAction } from '@/modules/inquiries/actions';

export function QuoteListView({ whatsapp }: { whatsapp: string }) {
  const { items, removeItem, updateQuantity, updateNotes, clear } = useQuoteList();

  function handleSend() {
    const whatsappMessage = buildQuoteListMessage(
      items.map((item) => ({
        name: item.name,
        sku: item.sku,
        quantity: item.quantity,
        notes: item.notes || undefined,
      })),
      `${SITE_URL}/lista-de-cotizacion`,
    );
    window.open(buildWhatsAppUrl(whatsapp, whatsappMessage), '_blank', 'noopener,noreferrer');

    // No se espera la respuesta: si falla, la persona igual llega a WhatsApp.
    void registerQuoteListInquiryAction(
      items.map((item) => ({
        productId: item.productId,
        productSnapshot: item.name,
        quantity: item.quantity,
        notes: item.notes || undefined,
      })),
    );
  }

  if (items.length === 0) {
    return (
      <Container className="py-16 md:py-24">
        <EmptyState
          title="Tu lista de cotización está vacía"
          description="Agregá productos desde el catálogo para cotizarlos todos juntos por WhatsApp."
          action={
            <Link href="/catalogo">
              <Button className="rounded-full">Ir al catálogo</Button>
            </Link>
          }
        />
      </Container>
    );
  }

  const total = items.reduce(
    (sum, item) => (item.basePrice === null ? sum : sum + item.basePrice * item.quantity),
    0,
  );
  const hasPriceGaps = items.some((item) => item.basePrice === null);

  return (
    <Container className="py-16 md:py-24">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Lista de cotización</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        {items.length} {items.length === 1 ? 'producto' : 'productos'}
      </p>

      <ul className="mt-8 flex flex-col gap-6">
        {items.map((item) => (
          <li
            key={item.productId}
            className="border-border flex flex-col gap-4 border-b pb-6 sm:flex-row"
          >
            <div className="bg-muted relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                <div className="text-muted-foreground flex h-full items-center justify-center text-center text-[0.55rem] tracking-[0.1em] uppercase">
                  Sin foto
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link href={`/producto/${item.slug}`} className="font-semibold hover:underline">
                    {item.name}
                  </Link>
                  <p className="text-muted-foreground text-sm">
                    {item.basePrice === null
                      ? 'Precio a cotizar'
                      : `${item.priceIsFrom ? 'Desde ' : ''}${formatPrice(item.basePrice)}`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  aria-label={`Quitar ${item.name} de la lista`}
                  className="text-muted-foreground hover:text-destructive shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  aria-label="Restar una unidad"
                  className="border-border hover:bg-accent flex h-7 w-7 items-center justify-center rounded-full border transition-colors disabled:opacity-40"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span data-numeral className="w-6 text-center text-sm">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  aria-label="Sumar una unidad"
                  className="border-border hover:bg-accent flex h-7 w-7 items-center justify-center rounded-full border transition-colors"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>

              <Textarea
                value={item.notes}
                onChange={(event) => updateNotes(item.productId, event.target.value)}
                placeholder="Notas para este producto (color, talla, diseño)..."
                className="min-h-[60px] rounded-xl text-sm"
              />
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {total > 0 ? (
            <p className="text-lg font-semibold">
              Estimado: {formatPrice(total)}
              {hasPriceGaps ? (
                <span className="text-muted-foreground text-sm font-normal">
                  {' '}
                  + productos a cotizar
                </span>
              ) : null}
            </p>
          ) : (
            <p className="text-muted-foreground text-sm">Todos los productos son a cotizar.</p>
          )}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="button" variant="outline" className="rounded-full" onClick={clear}>
            Vaciar lista
          </Button>
          <Button type="button" variant="whatsapp" className="rounded-full" onClick={handleSend}>
            Enviar por WhatsApp
          </Button>
        </div>
      </div>
    </Container>
  );
}
