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
      className="group border-border bg-card flex h-full flex-col overflow-hidden rounded-2xl border transition-shadow hover:shadow-md"
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
            <span className="text-[0.625rem] tracking-[0.16em] uppercase">Foto próximamente</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-lg font-bold">{product.name}</h3>
        {product.shortDescription ? (
          <p className="text-muted-foreground line-clamp-2 text-sm">{product.shortDescription}</p>
        ) : null}

        <div className="mt-auto flex items-baseline justify-between gap-3 pt-2">
          <p className="text-sm font-semibold">
            {product.basePrice === null
              ? 'Precio a cotizar'
              : `${product.priceIsFrom ? 'Desde ' : ''}${formatPrice(product.basePrice)}`}
          </p>
          <span className="text-primary text-sm font-medium underline-offset-4 group-hover:underline">
            Ver más →
          </span>
        </div>
      </div>
    </Link>
  );
}
