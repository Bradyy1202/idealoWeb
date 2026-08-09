import { cn } from '@/shared/lib/cn';

/**
 * Franja de texto en loop horizontal continuo.
 *
 * La animación es decorativa (`aria-hidden`): el contenido real va también
 * en una lista accesible (`sr-only`) para que no dependa del movimiento.
 *
 * La segunda copia de los ítems lleva `data-marquee-clone` para poder
 * ocultarla con `prefers-reduced-motion`: ahí la cinta no se mueve, y
 * dejarla congelada a media pasada mostraba frases cortadas por los dos
 * bordes, que se lee como algo roto y no como una decisión.
 */
export function Marquee({ items, className }: { items: string[]; className?: string }) {
  return (
    <div className={cn('overflow-hidden', className)}>
      <div className="animate-marquee flex w-max items-center gap-8 md:gap-10" aria-hidden>
        {[0, 1].map((copy) =>
          items.map((item) => (
            <span
              key={`${copy}-${item}`}
              data-marquee-clone={copy === 1 ? '' : undefined}
              className="flex items-center gap-8 whitespace-nowrap md:gap-10"
            >
              <span className="text-sm font-semibold md:text-base">{item}</span>
              {/* Separador en el mismo crema del texto, atenuado: el azul de
                  marca sobre el verde de la cinta da 1.3:1 y desaparecería. */}
              <span className="text-sm opacity-50 md:text-base" aria-hidden>
                ✻
              </span>
            </span>
          )),
        )}
      </div>
      <ul className="sr-only">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
