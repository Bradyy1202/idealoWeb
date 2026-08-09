'use client';

import { motion } from 'motion/react';
import Balancer from 'react-wrap-balancer';
import { Section } from '@/shared/ui/section';
import type { AboutSettingsInput } from '@/modules/content/schema';

/**
 * Sin foto real del taller todavía. En vez de una caja gris con el texto
 * "Foto del taller" —que se lee como contenido faltante— el espacio lo ocupa
 * una pieza gráfica que representa el propio proceso: tintas superpuestas
 * sobre trama de medio tono, que es literalmente cómo funciona la
 * sublimación. No afirma nada falso y la sección se ve terminada.
 *
 * Cuando exista fotografía real del taller, reemplazar el contenido del
 * <figure> por un <Image fill className="object-cover" />.
 */
export function AboutSection({ about }: { about: AboutSettingsInput }) {
  return (
    <Section id="quienes-somos" className="overflow-hidden">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
          <span className="text-primary-text flex items-center gap-3 text-xs font-semibold tracking-[0.18em] uppercase">
            <span className="bg-primary-text h-px w-8" aria-hidden />
            Quiénes somos
          </span>
          <h2 className="mt-4 max-w-[16ch] text-3xl leading-[1.05] tracking-tight sm:text-4xl md:text-5xl lg:text-[3.5rem]">
            <Balancer>{about.title}</Balancer>
          </h2>
          <p className="text-muted-foreground mt-6 max-w-[52ch] text-base sm:text-lg">
            {about.body}
          </p>
        </motion.div>

        <motion.figure
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          className="bg-card border-border/70 relative aspect-[4/3] overflow-hidden rounded-2xl border sm:rounded-[1.75rem]"
        >
          <svg className="absolute inset-0 h-full w-full" aria-hidden>
            <defs>
              <pattern id="about-halftone" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" className="fill-ink/15" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#about-halftone)" />
          </svg>

          {/* Tintas superpuestas: al mezclarse muestran un color nuevo, como
              la tinta de sublimación al fijarse sobre el material. */}
          <div
            className="bg-primary absolute top-[18%] left-[14%] h-[46%] w-[46%] rounded-full mix-blend-multiply"
            aria-hidden
          />
          <div
            className="bg-coral absolute top-[32%] left-[34%] h-[46%] w-[46%] rounded-full mix-blend-multiply"
            aria-hidden
          />
          <div
            className="bg-mist absolute top-[13%] left-[42%] h-[42%] w-[42%] rounded-full mix-blend-multiply"
            aria-hidden
          />

          <figcaption className="text-muted-foreground absolute right-5 bottom-5 left-5 text-[0.65rem] tracking-[0.16em] uppercase">
            Sublimación · San Carlos, Costa Rica
          </figcaption>
        </motion.figure>
      </div>
    </Section>
  );
}
