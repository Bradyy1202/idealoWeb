import { Coffee, CupSoda, Gift, GlassWater, Shirt } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

/**
 * Relleno para productos sin fotografía todavía. Antes era un rectángulo
 * gris con el texto "FOTO PRÓXIMAMENTE": leía como contenido faltante, no
 * como diseño. Acá el hueco se convierte en una pieza gráfica —trama de
 * puntos tipo tramado de impresión, más la silueta del producto— así el
 * catálogo se ve terminado mientras llegan las fotos reales.
 *
 * El tono y la silueta salen de un hash del slug: cada producto se ve
 * distinto y siempre igual a sí mismo, sin inventar datos que no existen.
 */
const tones = [
  { field: 'bg-primary/15', mark: 'text-primary-text/45' },
  { field: 'bg-coral/12', mark: 'text-coral/45' },
  { field: 'bg-mist', mark: 'text-ink/25' },
  { field: 'bg-success', mark: 'text-success-foreground/40' },
] as const;

const marks = [GlassWater, Coffee, Shirt, Gift, CupSoda] as const;

function hash(seed: string) {
  let total = 0;
  for (let index = 0; index < seed.length; index += 1) {
    total = (total + seed.charCodeAt(index) * (index + 7)) % 9973;
  }
  return total;
}

export function ProductPlaceholder({ seed, className }: { seed: string; className?: string }) {
  const key = hash(seed);
  const tone = tones[key % tones.length]!;
  const Mark = marks[key % marks.length]!;
  // Desfase del patrón para que dos tarjetas contiguas no queden calcadas.
  const offset = key % 12;

  return (
    <div className={cn('relative overflow-hidden', tone.field, className)} aria-hidden>
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <pattern
            id={`halftone-${key}`}
            width="14"
            height="14"
            patternUnits="userSpaceOnUse"
            patternTransform={`translate(${offset} ${offset})`}
          >
            <circle cx="2" cy="2" r="1.4" fill="currentColor" className={tone.mark} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#halftone-${key})`} opacity="0.5" />
      </svg>

      <Mark
        className={cn(
          'absolute top-1/2 left-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2',
          tone.mark,
        )}
        strokeWidth={1}
      />
    </div>
  );
}
