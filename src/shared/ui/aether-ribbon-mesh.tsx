'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/shared/lib/cn';

type AetherRibbonMeshProps = {
  className?: string;
  /** Colores de las cintas, de atrás hacia adelante. */
  colors?: readonly string[];
  /** Cantidad de cintas (modo `ribbons`) o de líneas (modo `lines`). */
  ribbons?: number;
  /** Opacidad general. */
  opacity?: number;
  /**
   * `ribbons`: superficies rellenas con degradado, para fondos oscuros.
   * `lines`: hilos paralelos finos que fluyen en onda, para fondos claros.
   */
  mode?: 'ribbons' | 'lines';
};

const DEFAULT_COLORS = ['#1d5fa4', '#3f5133', '#c04521', '#dce4ea'] as const;

/**
 * Malla de cintas superpuestas sobre canvas, moduladas por ruido, que
 * reaccionan al puntero y a las ondas de choque de cada clic.
 *
 * El "ruido" son tres senoidales de distinta frecuencia sumadas, no una
 * librería de Perlin: alcanza de sobra para que la ondulación no se lea
 * periódica y evita sumar una dependencia por un fondo decorativo.
 *
 * Notas de implementación que no son opcionales:
 * - El canvas se dimensiona por `devicePixelRatio` y se reajusta con
 *   `ResizeObserver`; sin eso se ve borroso en pantallas retina y no
 *   acompaña los cambios de tamaño del contenedor.
 * - Con `prefers-reduced-motion` se dibuja un solo cuadro y no se arranca el
 *   bucle: queda como una textura fija, sin movimiento ni reacción.
 * - El bucle se detiene cuando el elemento sale de pantalla
 *   (`IntersectionObserver`): es decoración, no tiene sentido gastar cuadros
 *   animando algo que nadie está viendo.
 */
export function AetherRibbonMesh({
  className,
  colors = DEFAULT_COLORS,
  ribbons = 4,
  opacity = 0.5,
  mode = 'ribbons',
}: AetherRibbonMeshProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;

    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, active: false };
    const shockwaves: { x: number; y: number; born: number }[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    /** Tres senoidales desfasadas: ondulación que no se lee periódica. */
    const noise = (x: number, t: number, seed: number) =>
      Math.sin(x * 1.7 + t * 0.6 + seed) * 0.55 +
      Math.sin(x * 3.1 - t * 0.9 + seed * 2.3) * 0.28 +
      Math.sin(x * 6.3 + t * 1.4 + seed * 4.1) * 0.12;

    /** Desvío de una fila por el puntero y por las ondas de choque activas. */
    const disturbance = (p: number, t: number, weight: number) => {
      if (prefersReducedMotion) return 0;

      // El puntero empuja la línea: cuanto más cerca en horizontal, más se
      // desvía hacia él.
      const dx = p - pointer.x;
      let offset = (pointer.y - 0.5) * height * 0.45 * Math.exp(-(dx * dx) / 0.02) * weight;

      // Cada onda de choque desplaza la línea en un anillo que se expande y
      // se apaga.
      for (const wave of shockwaves) {
        const age = t - wave.born;
        const radius = age * 0.9;
        const distance = Math.abs(p - wave.x);
        const ring = Math.exp(-((distance - radius) ** 2) / 0.004);
        offset -= ring * height * 0.18 * (1 - age / 1.6);
      }

      return offset;
    };

    const drawRibbons = (t: number, steps: number) => {
      // 'lighter' sobre fondo oscuro: donde dos cintas se cruzan el color se
      // suma, que es justo el efecto de superposición que se busca.
      context.globalCompositeOperation = 'lighter';

      for (let r = 0; r < ribbons; r += 1) {
        const seed = r * 12.9898;
        const depth = r / Math.max(ribbons - 1, 1);
        const baseY = height * (0.28 + depth * 0.45);
        const amplitude = height * (0.1 + depth * 0.06);
        const color = colors[r % colors.length]!;

        context.beginPath();

        for (let s = 0; s <= steps; s += 1) {
          const p = s / steps;
          const x = p * width;
          const y =
            baseY +
            noise(p * 3.2, prefersReducedMotion ? 0 : t, seed) * amplitude +
            disturbance(p, t, 0.4 + depth * 0.6);

          if (s === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }

        // Se cierra contra el borde inferior: la cinta es una superficie
        // rellena con degradado, no una línea.
        context.lineTo(width, height);
        context.lineTo(0, height);
        context.closePath();

        const gradient = context.createLinearGradient(0, baseY - amplitude, 0, height);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'transparent');
        context.fillStyle = gradient;
        context.globalAlpha = opacity * (0.35 + depth * 0.65);
        context.fill();
      }

      context.globalCompositeOperation = 'source-over';
    };

    /**
     * Hilos paralelos. Todas las líneas siguen LA MISMA onda; lo único que
     * cambia entre ellas es cuánto la amplifican, así el haz se junta y se
     * abre sin que dos hilos se crucen nunca.
     *
     * Darle a cada línea su propia semilla —que fue el primer intento— las
     * hacía cruzarse y el resultado era una maraña, no un haz.
     *
     * La diferencia de amplificación entre líneas contiguas es ~0.04 del
     * total, muy por debajo de la separación entre ellas: de ahí que no se
     * toquen ni en el punto de máxima onda.
     */
    const drawLines = (t: number, steps: number) => {
      const lines = Math.max(2, ribbons);
      const color = colors[0]!;
      const spacing = height / (lines + 2);
      const time = prefersReducedMotion ? 0 : t * 0.45;
      const amplitude = height * 0.16;

      for (let l = 0; l < lines; l += 1) {
        const depth = l / (lines - 1);
        // Más peso en el centro del haz, casi nada en los bordes.
        const weight = Math.sin(depth * Math.PI);
        const baseY = spacing * (l + 1.5);
        // Monótona con la posición: garantiza el orden vertical.
        const gain = 0.55 + depth * 0.75;

        context.beginPath();

        for (let s = 0; s <= steps; s += 1) {
          const p = s / steps;
          const x = p * width;
          const y =
            baseY +
            noise(p * 2.2, time, 0) * amplitude * gain +
            // Inclinación suave del haz completo, para que no quede
            // horizontal y muerto de lado a lado.
            (p - 0.5) * height * 0.06 * gain +
            disturbance(p, t, 0.2 + weight * 0.45);

          if (s === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }

        context.strokeStyle = color;
        context.lineWidth = 0.6 + weight * 1.2;
        context.globalAlpha = opacity * (0.1 + weight * 0.9);
        context.stroke();
      }
    };

    const draw = (time: number) => {
      const t = time / 1000;
      context.clearRect(0, 0, width, height);

      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;

      // Las ondas viven 1.6s; se descartan por el final para no reordenar.
      for (let i = shockwaves.length - 1; i >= 0; i -= 1) {
        if (t - shockwaves[i]!.born > 1.6) shockwaves.splice(i, 1);
      }

      const steps = Math.max(24, Math.round(width / 10));

      if (mode === 'lines') drawLines(t, steps);
      else drawRibbons(t, steps);

      context.globalAlpha = 1;
    };

    const loop = (time: number) => {
      draw(time);
      frame = requestAnimationFrame(loop);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.tx = (event.clientX - rect.left) / rect.width;
      pointer.ty = (event.clientY - rect.top) / rect.height;
      pointer.active = true;
    };

    const onPointerLeave = () => {
      pointer.tx = 0.5;
      pointer.ty = 0.5;
      pointer.active = false;
    };

    const onPointerDown = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      shockwaves.push({
        x: (event.clientX - rect.left) / rect.width,
        y: (event.clientY - rect.top) / rect.height,
        born: performance.now() / 1000,
      });
    };

    resize();
    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (prefersReducedMotion) draw(0);
    });
    resizeObserver.observe(canvas);

    if (prefersReducedMotion) {
      draw(0);
      return () => resizeObserver.disconnect();
    }

    const parent = canvas.parentElement;
    parent?.addEventListener('pointermove', onPointerMove);
    parent?.addEventListener('pointerleave', onPointerLeave);
    parent?.addEventListener('pointerdown', onPointerDown);

    const intersectionObserver = new IntersectionObserver((entries) => {
      const isVisible = entries[0]?.isIntersecting ?? true;
      if (isVisible === visible) return;
      visible = isVisible;
      if (visible) frame = requestAnimationFrame(loop);
      else cancelAnimationFrame(frame);
    });
    intersectionObserver.observe(canvas);

    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      parent?.removeEventListener('pointermove', onPointerMove);
      parent?.removeEventListener('pointerleave', onPointerLeave);
      parent?.removeEventListener('pointerdown', onPointerDown);
    };
  }, [colors, ribbons, opacity, mode]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
    />
  );
}
