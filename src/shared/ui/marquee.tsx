import { cn } from '@/shared/lib/cn';

/**
 * Franja de texto en loop horizontal continuo, como la que usa releaf.bio
 * para frases cortas ("Rebels With a Cause ✿ Rebels With a Cause ✿ ...").
 * La animación es puramente decorativa (`aria-hidden`): el contenido real
 * va también en una lista accesible (`sr-only`) para que no dependa de la
 * animación para llegar a quien usa lector de pantalla.
 */
export function Marquee({ items, className }: { items: string[]; className?: string }) {
  const track = [...items, ...items];

  return (
    <div className={cn('overflow-hidden', className)}>
      <div className="animate-marquee flex w-max items-center gap-10" aria-hidden>
        {track.map((item, index) => (
          <span key={index} className="flex items-center gap-10 whitespace-nowrap">
            <span className="text-2xl font-semibold md:text-3xl">{item}</span>
            <span className="text-primary text-2xl md:text-3xl" aria-hidden>
              ✻
            </span>
          </span>
        ))}
      </div>
      <ul className="sr-only">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
