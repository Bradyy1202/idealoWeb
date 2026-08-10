'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

type BorderBeamPanelProps = {
  children: ReactNode;
  className?: string;
  /** Cantidad de haces que recorren el borde. */
  beams?: number;
  /** Grosor del borde iluminado, en px. */
  thickness?: number;
  /** Radio de la esquina, en px. */
  radius?: number;
  /** Halo difuso alrededor del panel. */
  glow?: boolean;
  /** Segundos por vuelta en reposo. Más es más lento. */
  speed?: number;
  /**
   * Si el haz acelera al acercar el puntero. Cuando es `false` la vuelta la
   * mueve una animación CSS y el componente no monta ningún bucle de
   * JavaScript: es lo que hay que usar cuando se repite muchas veces en la
   * misma pantalla (una grilla de productos, por ejemplo).
   */
  interactive?: boolean;
  /** Multiplicador de velocidad mientras el puntero está encima. */
  hoverBoost?: number;
  /** Color del haz. */
  color?: string;
  /** Fondo del interior del panel. */
  surface?: string;
  /** Ancho del arco de cada haz, en grados. Menos es más concentrado. */
  spread?: number;
  /** Color del borde de base entre haz y haz. */
  border?: string;
};

/**
 * Panel con un haz de luz recorriendo el borde: un `conic-gradient` que gira
 * detrás del contenido y del que solo se ve el anillo del padding, porque la
 * superficie interior lo tapa.
 *
 * Lo que gira es el ángulo del degradado (`from var(--beam-angle)`), no el
 * elemento: así la capa mide exactamente lo que el panel. La primera versión
 * rotaba un elemento tres veces más grande, que multiplicaba la superficie a
 * pintar justo donde más se repite el componente.
 *
 * Con `interactive` el ángulo lo mueve `requestAnimationFrame`, porque el
 * haz acelera al entrar el puntero y frena al salir, y `animation-duration`
 * no se puede interpolar: con CSS el cambio de velocidad daría un salto.
 * Sin `interactive` lo mueve una animación CSS sobre `--beam-angle`
 * (registrada con `@property` en globals.css) y no hay JavaScript por panel.
 *
 * Con `prefers-reduced-motion` el haz queda quieto en los dos modos: el
 * borde sigue viéndose iluminado, pero no gira.
 */
export function BorderBeamPanel({
  children,
  className,
  beams = 2,
  thickness = 2,
  radius = 18,
  glow = false,
  speed = 6,
  interactive = true,
  hoverBoost = 3,
  color = 'var(--primary)',
  surface = 'var(--card)',
  spread = 22,
  border = 'var(--border)',
}: BorderBeamPanelProps) {
  const beamRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    if (!interactive) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let angle = 0;
    // Velocidad actual y objetivo, en grados por segundo. La actual persigue
    // a la objetivo: de ahí la aceleración y el frenado.
    const baseSpeed = 360 / Math.max(speed, 0.1);
    let velocity = baseSpeed;
    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const delta = Math.min((now - last) / 1000, 0.05);
      last = now;

      const target = isHoveredRef.current ? baseSpeed * hoverBoost : baseSpeed;
      velocity += (target - velocity) * Math.min(delta * 4, 1);
      angle = (angle + velocity * delta) % 360;

      const value = `${angle}deg`;
      beamRef.current?.style.setProperty('--beam-angle', value);
      glowRef.current?.style.setProperty('--beam-angle', value);

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [interactive, speed, hoverBoost]);

  // Arcos brillantes repartidos en la vuelta. Cada haz es una franja corta
  // que se desvanece hacia los dos lados, y entre ellas el borde queda
  // apenas insinuado.
  const stops: string[] = [];
  const count = Math.max(1, beams);
  for (let i = 0; i < count; i += 1) {
    const center = (360 / count) * i;
    stops.push(
      `transparent ${center - spread}deg`,
      `${color} ${center}deg`,
      `transparent ${center + spread}deg`,
    );
  }

  const beamStyle: CSSProperties = {
    background: `conic-gradient(from var(--beam-angle, 0deg), ${stops.join(', ')})`,
    ...(interactive ? {} : ({ '--beam-duration': `${speed}s` } as CSSProperties)),
  };
  const beamClass = cn('absolute inset-0', !interactive && 'border-beam-spin');

  return (
    <div
      className={cn('relative', className)}
      onMouseEnter={
        interactive
          ? () => {
              isHoveredRef.current = true;
            }
          : undefined
      }
      onMouseLeave={
        interactive
          ? () => {
              isHoveredRef.current = false;
            }
          : undefined
      }
    >
      {glow ? (
        <div
          ref={glowRef}
          aria-hidden
          className="pointer-events-none absolute -inset-2 -z-10 overflow-hidden opacity-45 blur-xl"
          style={{ borderRadius: radius + 10 }}
        >
          <div className={beamClass} style={beamStyle} />
        </div>
      ) : null}

      <div
        className="relative h-full overflow-hidden"
        style={{ borderRadius: radius, padding: thickness }}
      >
        {/* Borde tenue de base: sin esto, entre haz y haz el contorno
            desaparece del todo y el panel parece recortado. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ borderRadius: radius, border: `${thickness}px solid ${border}` }}
        />
        <div ref={beamRef} aria-hidden className={beamClass} style={beamStyle} />

        <div
          className="relative h-full w-full overflow-hidden"
          style={{ borderRadius: Math.max(radius - thickness, 0), background: surface }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
