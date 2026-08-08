'use client';

import { motion } from 'framer-motion';
import { Section } from '@/shared/ui/section';
import type { AboutSettingsInput } from '@/modules/content/schema';

/**
 * Sin foto real del taller todavía: la ranura reservada sigue el patrón del
 * resto del sitio en vez de fabricar una imagen de stock. Tampoco hay un
 * equipo de varias personas que mostrar — no fabricamos nombres ni roles
 * que no existen.
 */
export function AboutSection({ about }: { about: AboutSettingsInput }) {
  return (
    <Section id="quienes-somos" className="overflow-hidden">
      <div className="grid gap-8 py-4 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <span className="text-primary text-sm font-semibold tracking-wide uppercase">
            Quiénes somos
          </span>
          <h2 className="text-3xl tracking-tight sm:text-4xl">{about.title}</h2>
          <p className="text-muted-foreground text-lg">{about.body}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center justify-center"
        >
          <div className="border-border bg-muted/40 flex h-[300px] w-full items-center justify-center rounded-2xl border border-dashed md:h-[380px]">
            <span className="text-muted-foreground text-xs tracking-[0.16em] uppercase">
              Foto del taller
            </span>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
