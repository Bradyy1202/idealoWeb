import type { Product } from '@/shared/data/mock/site';
import { formatPrice } from '@/shared/lib/format-price';
import { buildWhatsAppUrl } from '@/shared/lib/whatsapp';
import { Badge } from './badge';

/**
 * `/producto/[slug]` todavía no existe (fase 2): toda la tarjeta enlaza a
 * WhatsApp con el producto pre-armado en el mensaje, que es la única
 * conversión real disponible hoy.
 *
 * La ranura de foto usa SIEMPRE `aspect-square`, sin importar la proporción
 * real del producto (`product.aspect`, que sí se usa en otras vistas): con
 * cuatro proporciones distintas por tarjeta (una botella no es una taza), la
 * altura de la ranura variaba de tarjeta a tarjeta y desalineaba todo el
 * contenido de abajo entre sí — la card de "Taza mágica" quedaba desproporcionada
 * frente a las demás. Una proporción fija resuelve el desalineamiento;
 * cuando haya fotos reales, `object-fit: cover` mantiene esta misma regla.
 */
export function ProductCard({ product, whatsapp }: { product: Product; whatsapp: string }) {
  const whatsappHref = buildWhatsAppUrl(
    whatsapp,
    `Hola, quiero cotizar: ${product.name} (${product.sku}).`,
  );

  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      // h-full: en una grilla, CSS Grid estira la celda a la altura de la
      // fila (la más alta), pero sin esto el <a> no la ocupa.
      className="group bg-card flex h-full flex-col overflow-hidden rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:rounded-[1.75rem]"
    >
      {/* RANURA RESERVADA para la fotografía del producto.
          Sustituir por <Image fill className="object-cover" />. */}
      <div className="bg-mist relative aspect-square">
        <div className="text-mist-foreground/70 absolute inset-0 flex items-center justify-center text-center">
          <span className="text-[0.55rem] tracking-[0.16em] uppercase sm:text-[0.625rem]">
            Foto de producto
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3 sm:gap-3 sm:p-5">
        <Badge className="w-fit text-[0.6rem] sm:text-xs">{product.categoryName}</Badge>

        <h3 className="text-sm font-bold sm:text-xl">{product.name}</h3>

        <p className="text-muted-foreground line-clamp-2 hidden text-sm sm:block">
          {product.shortDescription}
        </p>

        <div className="mt-auto flex items-baseline justify-between gap-3 pt-1 sm:pt-2">
          <p data-numeral className="text-xs font-semibold sm:text-sm">
            Desde {formatPrice(product.basePrice)}
          </p>
          <span className="text-primary-text hidden text-sm font-medium underline-offset-4 group-hover:underline sm:inline">
            Cotizar →
          </span>
        </div>
      </div>
    </a>
  );
}
