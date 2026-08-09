import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/shared/lib/format-price';
import { ProductPlaceholder } from '@/shared/ui/product-placeholder';
import type { ProductListItem } from '../service';

export function ProductCard({ product }: { product: ProductListItem }) {
  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group border-border/70 bg-card flex h-full flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-24px_rgba(23,34,15,0.45)] sm:rounded-[1.75rem]"
    >
      <div className="relative aspect-square overflow-hidden">
        {product.primaryImage ? (
          <Image
            src={product.primaryImage.url}
            alt={product.primaryImage.alt ?? product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          // Sin foto todavía: pieza gráfica derivada del slug, no un
          // rectángulo vacío que se lee como contenido faltante.
          <ProductPlaceholder seed={product.slug} className="h-full w-full" />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3 sm:gap-1.5 sm:p-5">
        <h3 className="text-sm leading-snug font-bold sm:text-lg">{product.name}</h3>
        {product.shortDescription ? (
          <p className="text-muted-foreground mt-1 line-clamp-2 hidden text-sm sm:block">
            {product.shortDescription}
          </p>
        ) : null}

        <div className="border-border/70 mt-auto flex items-baseline justify-between gap-3 border-t pt-3 sm:mt-4">
          <p data-numeral className="text-sm font-semibold sm:text-base">
            {product.basePrice === null ? (
              'Precio a cotizar'
            ) : (
              <>
                {product.priceIsFrom ? (
                  <span className="text-muted-foreground text-xs font-normal">Desde </span>
                ) : null}
                {formatPrice(product.basePrice)}
              </>
            )}
          </p>
          <span className="text-primary-text text-[0.65rem] font-semibold tracking-wide uppercase transition-opacity duration-200 group-hover:opacity-70 sm:text-[0.7rem]">
            Ver más
          </span>
        </div>
      </div>
    </Link>
  );
}
