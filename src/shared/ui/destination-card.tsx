import * as React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

interface DestinationCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Foto de fondo. Si falta, la tarjeta se apoya solo en `themeColor` y en `motif`. */
  imageUrl?: string;
  location: string;
  /** Línea secundaria: en el original era el país, acá la descripción. */
  stats: string;
  href: string;
  /** Etiquetas cortas sobre la tarjeta. */
  tags?: readonly string[];
  /** Color de la tarjeta en HSL sin `hsl()`, ej. "150 50% 25%". */
  themeColor: string;
  /** Silueta grande de fondo, recortada por el borde. */
  motif?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  ctaLabel?: string;
}

/**
 * Tarjeta con foto, degradado teñido y botón que se ilumina al pasar el
 * mouse. Adaptada del componente original en tres puntos, porque tal cual
 * venía no servía para este catálogo:
 *
 * - `imageUrl` es opcional. Idealo todavía no tiene fotografía por
 *   categoría, y una tarjeta con `background-image: url(undefined)` queda
 *   en blanco. Sin foto, el color del tema pinta la tarjeta entera y la
 *   silueta (`motif`) hace de imagen.
 * - Sin bandera ni emoji: no aplican a categorías de producto.
 * - El `box-shadow` en línea del original pisaba al de la clase; queda uno
 *   solo, y el brillo del hover se define con la variable del tema.
 */
const DestinationCard = React.forwardRef<HTMLDivElement, DestinationCardProps>(
  (
    {
      className,
      imageUrl,
      location,
      stats,
      href,
      tags,
      themeColor,
      motif: Motif,
      ctaLabel = 'Ver catálogo',
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        style={{ '--theme-color': themeColor } as React.CSSProperties}
        className={cn('group h-full w-full', className)}
        {...props}
      >
        <a
          href={href}
          className="relative block h-full w-full overflow-hidden rounded-2xl shadow-[0_18px_40px_-24px_hsl(var(--theme-color)/0.55)] transition-all duration-500 ease-in-out group-hover:-translate-y-1 group-hover:shadow-[0_26px_60px_-24px_hsl(var(--theme-color)/0.7)] sm:rounded-[1.75rem]"
          aria-label={`Ver el catálogo de ${location}`}
        >
          <div
            className="absolute inset-0 bg-[hsl(var(--theme-color))] bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-105"
            style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
          />

          {/* Con foto hace falta oscurecer para que el texto se lea; sin
              foto el color ya es sólido y un degradado encima solo lo
              ensuciaría. */}
          {imageUrl ? (
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, hsl(var(--theme-color) / 0.95), hsl(var(--theme-color) / 0.65) 35%, hsl(var(--theme-color) / 0.15) 75%)',
              }}
            />
          ) : null}

          {Motif ? (
            <Motif
              className="pointer-events-none absolute -right-8 -bottom-10 h-48 w-48 text-white/15 transition-transform duration-500 group-hover:scale-110 sm:h-64 sm:w-64"
              strokeWidth={0.75}
            />
          ) : null}

          <div className="relative flex h-full flex-col justify-end p-5 text-white sm:p-7">
            <h3 className="text-xl font-bold tracking-tight sm:text-3xl">{location}</h3>
            <p className="mt-1.5 max-w-[32ch] text-xs text-white/85 sm:text-sm">{stats}</p>

            {tags && tags.length > 0 ? (
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-white/25 px-2.5 py-1 text-[0.65rem] font-medium text-white/85 sm:text-xs"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-5 flex items-center justify-between rounded-full border border-white/25 bg-white/10 px-4 py-2.5 backdrop-blur-md transition-colors duration-300 group-hover:border-white/40 group-hover:bg-white/20">
              <span className="text-xs font-semibold tracking-wide sm:text-sm">{ctaLabel}</span>
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              />
            </div>
          </div>
        </a>
      </div>
    );
  },
);
DestinationCard.displayName = 'DestinationCard';

export { DestinationCard };
