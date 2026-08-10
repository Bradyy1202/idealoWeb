'use client';

import { motion } from 'motion/react';
import Balancer from 'react-wrap-balancer';
import { Section } from '@/shared/ui/section';
import { easeOutExpo, revealOnce } from '@/shared/lib/motion-presets';
import type { AboutSettingsInput } from '@/modules/content/schema';

/**
 * Sin tarjeta a la derecha: el haz de hilos que ocupaba ese hueco ahora es
 * el fondo de toda la página (`PageBackdrop`), y repetirlo acá dentro de una
 * caja sería mostrar dos veces lo mismo. La sección queda como una
 * declaración a texto pleno, con el fondo animado pasando por detrás.
 *
 * Cuando exista fotografía real del taller, este es el lugar para meterla:
 * volver a la grilla de dos columnas con un <Image fill> a la derecha.
 */
export function AboutSection({ about }: { about: AboutSettingsInput }) {
  return (
    <Section id="quienes-somos">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={revealOnce}
        transition={easeOutExpo}
        className="grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-end md:gap-16"
      >
        <div>
          <span className="text-primary-text flex items-center gap-3 text-xs font-semibold tracking-[0.18em] uppercase">
            <span className="bg-primary-text h-px w-8" aria-hidden />
            Quiénes somos
          </span>
          <h2 className="mt-4 text-3xl leading-[1.05] tracking-tight sm:text-4xl md:text-5xl lg:text-[3.5rem]">
            <Balancer>{about.title}</Balancer>
          </h2>
        </div>

        <p className="text-muted-foreground max-w-[56ch] text-base sm:text-lg">{about.body}</p>
      </motion.div>
    </Section>
  );
}
