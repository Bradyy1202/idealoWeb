const formatter = new Intl.NumberFormat('es-CR', {
  style: 'currency',
  currency: 'CRC',
  maximumFractionDigits: 0,
});

/** ₡9 500, sin decimales: el colón no los usa en el uso cotidiano. */
export function formatPrice(value: number) {
  return formatter.format(value);
}

/** Mensaje pre-armado para WhatsApp. `buildWhatsAppUrl()` lo formaliza en la tarea 3.1. */
export function buildWhatsAppUrl(phone: string, message: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
