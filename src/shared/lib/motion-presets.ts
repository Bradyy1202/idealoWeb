import type { Transition, Variants } from 'motion/react';

/**
 * Presets compartidos de animación. Antes cada sección declaraba su propio
 * `staggerContainer`/`itemFadeIn` con valores ligeramente distintos, así que
 * la página entera entraba con ritmos que no coincidían entre sí.
 *
 * El tipo explícito no es decorativo: `ease: [0.23, 1, 0.32, 1]` se infiere
 * como `number[]` sin él, y `Transition` espera una tupla de cuatro (curva
 * de Bézier), así que sin anotar no compila.
 */
export const easeOutExpo: Transition = {
  duration: 0.5,
  ease: [0.23, 1, 0.32, 1],
};

/** Contenedor que escalona la entrada de sus hijos. */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

/** Hijo de `staggerContainer`: entra desde abajo. */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: easeOutExpo },
};

/** Viewport estándar: se dispara una sola vez, un poco antes de entrar. */
export const revealOnce = { once: true, margin: '-80px' } as const;
