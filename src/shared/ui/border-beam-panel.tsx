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
  /** Segundos por vuelta en reposo. Menos es más rápido. */
  speed?: number;
  /** Multiplicador de velocidad mientras el puntero está encima. */
  hoverBoost?: number;
  /** Color del haz. Por defecto, el azul de marca. */
  color?: string;
  /** Fondo del interior del panel. */
  surface?: string;
};

/**
 * Panel con un haz de luz recorriendo el borde: un `conic-gradient` que gira
 * detrás del contenido y del que solo se ve el anillo del padding, porque la
 * superficie interior lo tapa.
 *
 * El ángulo lo mueve `requestAnimationFrame`, no una animación CSS, porque
 * el haz acelera al entrar el puntero y frena al salir: `animation-duration`
 * no se puede interpolar, así que con CSS el cambio de velocidad daría un
 * salto en vez de una rampa.
 *
 * Con `prefers-reduced-motion` el haz se queda quieto en una posición fija:
 * el borde sigue viéndose iluminado, pero no gira.
 */
export function BorderBeamPanel({
  children,
  className,
  beams = 2,
  thickness = 2,
  radius = 18,
  glow = false,
  speed = 6,
  hoverBoost = 3,
  color = 'var(--primary)',
  surface = 'var(--card)',
}: BorderBeamPanelProps) {
  const beamRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);

  useEffect(() => {
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
  }, [speed, hoverBoost]);

  // Arcos brillantes repartidos en la vuelta. Cada haz es una franja corta
  // que se desvanece hacia los dos lados, y entre ellas el borde queda
  // apenas insinuado.
  const stops: string[] = [];
  const count = Math.max(1, beams);
  for (let i = 0; i < count; i += 1) {
    const center = (360 / count) * i;
    const half = 22;
    stops.push(
      `transparent ${center - half}deg`,
      `${color} ${center}deg`,
      `transparent ${center + half}deg`,
    );
  }
  const beamGradient = `conic-gradient(from var(--beam-angle, 0deg), ${stops.join(', ')})`;

  const beamStyle: CSSProperties = {
    background: beamGradient,
    // inset negativo: el degradado cónico debe cubrir el rectángulo entero
    // incluso rotando, o se verían esquinas vacías.
    inset: '-50%',
  };

  return (
    <div
      className={cn('relative', className)}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
    >
      {glow ? (
        <div
          ref={glowRef}
          aria-hidden
          className="pointer-events-none absolute -inset-2 -z-10 overflow-hidden opacity-45 blur-xl"
          style={{ borderRadius: radius + 10 }}
        >
          <div className="absolute" style={beamStyle} />
        </div>
      ) : null}

      <div
        className="relative overflow-hidden"
        style={{ borderRadius: radius, padding: thickness }}
      >
        {/* Borde tenue de base: sin esto, entre haz y haz el contorno
            desaparece del todo y el panel parece recortado. */}
        <div
          aria-hidden
          className="border-border/60 pointer-events-none absolute inset-0 border"
          style={{ borderRadius: radius, borderWidth: thickness }}
        />
        <div ref={beamRef} aria-hidden className="absolute" style={beamStyle} />

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
