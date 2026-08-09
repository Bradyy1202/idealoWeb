'use client';

import { motion } from 'framer-motion';
import { Factory, ShoppingBag, Truck, UploadCloud } from 'lucide-react';
import { howItWorks } from '@/shared/data/mock/site';
import { Section, SectionHeading } from '@/shared/ui/section';

const stepIcons = [ShoppingBag, UploadCloud, Factory, Truck] as const;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const itemFadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/**
 * Producto → Diseño → Producción → Entrega, con una línea de progreso real
 * (no solo cuatro columnas de texto): vertical y a la izquierda del badge en
 * móvil, horizontal y centrada en desktop. El número queda como badge
 * grande (la "numeración destacada" pedida) y el ícono de la acción como
 * chip superpuesto, así ninguno de los dos compite por ser lo principal.
 */
export function HowItWorksSection() {
  return (
    <Section id="como-funciona" className="bg-secondary/60">
      <SectionHeading
        eyebrow="Proceso"
        title="Cómo funciona"
        description="De la idea al pedido en tu puerta, en cuatro pasos."
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Línea vertical (móvil): detrás de los badges, a la altura de su centro. */}
        <div
          className="bg-border absolute top-8 bottom-8 left-7 w-px sm:left-8 md:hidden"
          aria-hidden
        />
        {/* Línea horizontal (desktop): un cuarto de espacio a cada lado, para
            que quede centrada bajo la fila de badges en vez de tocar los bordes. */}
        <div
          className="bg-border absolute top-9 right-[12.5%] left-[12.5%] hidden h-px md:block"
          aria-hidden
        />

        <motion.ol
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative grid gap-6 md:grid-cols-4"
        >
          {howItWorks.map((step, index) => {
            const Icon = stepIcons[index] ?? ShoppingBag;
            return (
              <motion.li
                key={step.number}
                variants={itemFadeIn}
                whileHover={{ y: -4 }}
                className="bg-card relative flex items-start gap-4 rounded-2xl p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5 md:flex-col md:items-center md:gap-0 md:p-6 md:text-center"
              >
                <div className="relative h-14 w-14 shrink-0 sm:h-16 sm:w-16">
                  <div className="bg-primary text-primary-foreground relative z-10 flex h-full w-full items-center justify-center rounded-full text-lg font-bold sm:text-xl">
                    {step.number}
                  </div>
                  <div className="bg-ink text-ink-foreground absolute -right-1 -bottom-1 z-10 flex h-6 w-6 items-center justify-center rounded-full shadow-sm sm:h-7 sm:w-7">
                    <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </div>
                </div>

                <div className="md:mt-4">
                  <h3 className="text-base font-semibold sm:text-lg">{step.title}</h3>
                  <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
                    {step.description}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </motion.ol>
      </div>
    </Section>
  );
}
