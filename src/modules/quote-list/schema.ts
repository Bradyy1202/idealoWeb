import { z } from 'zod';

export const quoteListItemSchema = z.object({
  productId: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  sku: z.string().nullable(),
  basePrice: z.number().nullable(),
  priceIsFrom: z.boolean(),
  imageUrl: z.string().nullable(),
  quantity: z.number().int().min(1).max(999),
  notes: z.string().max(500),
});

export type QuoteListItem = z.infer<typeof quoteListItemSchema>;

/** Lo que agrega el llamador (la ficha de producto): sin quantity/notes, que el hook inicializa. */
export type QuoteListItemInput = Omit<QuoteListItem, 'quantity' | 'notes'>;

export const quoteListSchema = z.array(quoteListItemSchema);
