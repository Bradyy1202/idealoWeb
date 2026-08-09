import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/shared/lib/format-price';
import type { ProductListItem } from '../service';

/**
 * Enlaza a `/producto/[slug]`, que todavía no existe (tarea 2.8): hasta
 * entonces el enlace devuelve 404. Es la secuencia esperada, no un bug.
 */
export function ProductCard({ product }: { product: ProductListItem }) {
  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group bg-card flex h-full flex-col overflow-hidden rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:rounded-[1.75rem]"
    >
      <div className="bg-muted relative aspect-square overflow-hidden">
        {product.primaryImage ? (
          <Image
            src={product.primaryImage.url}
            alt={product.primaryImage.alt ?? product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="border-border text-muted-foreground flex h-full items-center justify-center border border-dashed text-center">
            <span className="text-[0.55rem] tracking-[0.16em] uppercase sm:text-[0.625rem]">
              Foto próximamente
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3 sm:gap-2 sm:p-5">
        <h3 className="text-sm font-bold sm:text-lg">{product.name}</h3>
        {product.shortDescription ? (
          <p className="text-muted-foreground line-clamp-2 hidden text-sm sm:block">
            {product.shortDescription}
          </p>
        ) : null}

        <div className="mt-auto flex items-baseline justify-between gap-3 pt-1 sm:pt-2">
          <p className="text-xs font-semibold sm:text-sm">
            {product.basePrice === null
              ? 'Precio a cotizar'
              : `${product.priceIsFrom ? 'Desde ' : ''}${formatPrice(product.basePrice)}`}
          </p>
          <span className="text-primary-text hidden text-sm font-medium underline-offset-4 group-hover:underline sm:inline">
            Ver más →
          </span>
        </div>
      </div>
    </Link>
  );
}
