import { contact, type Product } from '@/shared/data/mock/site';
import { formatPrice, buildWhatsAppUrl } from '@/shared/lib/format-price';
import { Badge } from './badge';

/**
 * `/producto/[slug]` todavía no existe (fase 2): toda la tarjeta enlaza a
 * WhatsApp con el producto pre-armado en el mensaje, que es la única
 * conversión real disponible hoy.
 */
export function ProductCard({ product }: { product: Product }) {
  const whatsappHref = buildWhatsAppUrl(
    contact.whatsapp,
    `Hola, quiero cotizar: ${product.name} (${product.sku}).`,
  );

  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      // h-full: en una grilla, CSS Grid estira la celda a la altura de la
      // fila (la más alta), pero sin esto el <a> no la ocupa — con distintos
      // aspect-ratio de foto por producto, las tarjetas quedaban de alturas
      // dispares y los pies (precio/CTA) desalineados entre sí.
      className="group border-border bg-card flex h-full flex-col overflow-hidden rounded-2xl border transition-shadow hover:shadow-md"
    >
      {/* RANURA RESERVADA para la fotografía del producto.
          Sustituir por <Image> conservando `aspect`. */}
      <div className="bg-muted p-6">
        <div
          style={{ aspectRatio: product.aspect }}
          className="border-border text-muted-foreground mx-auto flex max-h-64 items-center justify-center rounded-2xl border border-dashed text-center"
        >
          <span className="text-[0.625rem] tracking-[0.16em] uppercase">Foto de producto</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <Badge>{product.categoryName}</Badge>

        <h3 className="text-xl font-bold">{product.name}</h3>

        <p className="text-muted-foreground line-clamp-2 text-sm">{product.shortDescription}</p>

        <div className="mt-auto flex items-baseline justify-between gap-3 pt-2">
          <p data-numeral className="text-sm font-semibold">
            Desde {formatPrice(product.basePrice)}
          </p>
          <span className="text-primary text-sm font-medium underline-offset-4 group-hover:underline">
            Cotizar →
          </span>
        </div>
      </div>
    </a>
  );
}
