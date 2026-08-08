export function buildWhatsAppUrl(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/** Mensaje pre-armado de un producto: nombre, SKU y la URL de la ficha para que quien responda vea exactamente qué se pidió. */
export function buildProductInquiryMessage(product: {
  name: string;
  sku: string | null;
  url: string;
}): string {
  const skuPart = product.sku ? ` (${product.sku})` : '';
  return `Hola, quiero cotizar: ${product.name}${skuPart}.\n${product.url}`;
}

export type QuoteListMessageItem = {
  name: string;
  sku: string | null;
  quantity: number;
  notes?: string;
};

/** Mensaje consolidado de la lista de cotización (tarea 3.4): un producto por línea, con cantidad y notas. */
export function buildQuoteListMessage(items: QuoteListMessageItem[], url: string): string {
  const lines = items.map((item) => {
    const skuPart = item.sku ? ` (${item.sku})` : '';
    const notesPart = item.notes ? ` — ${item.notes}` : '';
    return `• ${item.quantity}x ${item.name}${skuPart}${notesPart}`;
  });

  return `Hola, quiero cotizar estos productos:\n${lines.join('\n')}\n\n${url}`;
}
