import type { Product } from '@/shared/data/mock/site';
import { formatPrice } from '@/shared/lib/format-price';
import { buildWhatsAppUrl } from '@/shared/lib/whatsapp';
import { ProductPlaceholder } from './product-placeholder';
import { BorderBeamPanel } from './border-beam-panel';

/**
 * `/producto/[slug]` todavía no existe (fase 2): toda la tarjeta enlaza a
 * WhatsApp con el producto pre-armado en el mensaje, que es la única
 * conversión real disponible hoy.
 *
 * La ranura de foto usa SIEMPRE `aspect-square`, sin importar la proporción
 * real del producto: con cuatro proporciones distintas por tarjeta, la
 * altura variaba y desalineaba el contenido de abajo entre tarjetas.
 * Cuando haya fotos reales, `object-fit: cover` mantiene esta misma regla.
 */
export function ProductCard({ product, whatsapp }: { product: Product; whatsapp: string }) {
  const whatsappHref = buildWhatsAppUrl(
    whatsapp,
    `Hola, quiero cotizar: ${product.name} (${product.sku}).`,
  );

  return (
    // `interactive={false}`: la grilla muestra varias tarjetas a la vez, y con
    // el modo interactivo cada una montaría su propio requestAnimationFrame.
    // El hover (levantar + sombra) va en el panel de afuera, no en el <a>:
    // adentro el `overflow-hidden` del panel recortaba la sombra y el efecto
    // se perdía. `rounded-[18px]` acompaña para que la sombra siga la forma.
    <BorderBeamPanel
      className="h-full rounded-[18px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-24px_rgba(23,34,15,0.55)]"
      beams={1}
      thickness={1}
      radius={18}
      speed={16}
      spread={55}
      interactive={false}
      color="var(--primary)"
      border="var(--border)"
    >
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        // h-full: en una grilla, CSS Grid estira la celda a la altura de la
        // fila (la más alta), pero sin esto el <a> no la ocupa.
        className="group bg-card flex h-full flex-col overflow-hidden"
      >
        {/* RANURA RESERVADA para la fotografía del producto.
          Sustituir por <Image fill className="object-cover" />. */}
        <ProductPlaceholder seed={product.slug} className="aspect-square" />

        <div className="flex flex-1 flex-col gap-1 p-3 sm:gap-1.5 sm:p-5">
          <span className="text-muted-foreground text-[0.6rem] font-medium tracking-[0.14em] uppercase sm:text-[0.7rem]">
            {product.categoryName}
          </span>

          <h3 className="text-sm leading-snug font-bold sm:text-lg">{product.name}</h3>

          <p className="text-muted-foreground mt-1 line-clamp-2 hidden text-sm sm:block">
            {product.shortDescription}
          </p>

          <div className="border-border/70 mt-auto flex items-baseline justify-between gap-3 border-t pt-3 sm:mt-4">
            {/* "Desde": el precio del catálogo es referencial, la cotización
              final se confirma por WhatsApp. Sin el prefijo se leería como
              precio cerrado. */}
            <p data-numeral className="text-sm font-semibold sm:text-base">
              <span className="text-muted-foreground text-xs font-normal">Desde </span>
              {formatPrice(product.basePrice)}
            </p>
            {/* Visible siempre, no solo en hover: en táctil no hay hover y el
              CTA quedaría invisible justo donde más se usa. */}
            <span className="text-primary-text text-[0.65rem] font-semibold tracking-wide uppercase transition-opacity duration-200 group-hover:opacity-70 sm:text-[0.7rem]">
              Cotizar
            </span>
          </div>
        </div>
      </a>
    </BorderBeamPanel>
  );
}
