'use client';

import { motion } from 'motion/react';
import { Factory, ShoppingBag, Truck, UploadCloud } from 'lucide-react';
import { howItWorks } from '@/shared/data/mock/site';
import { Section, SectionHeading } from '@/shared/ui/section';
import { staggerContainer, fadeInUp, revealOnce } from '@/shared/lib/motion-presets';

const stepIcons = [ShoppingBag, UploadCloud, Factory, Truck] as const;

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

      {/* Sin `max-w-5xl` centrado: los cuatro pasos usan todo el ancho del
          contenedor, como el resto de las secciones. Encerrados en una caja
          angosta al centro quedaban apretados con aire muerto a los lados. */}
      <div className="relative">
        {/* Línea vertical (móvil): detrás de los números, a la altura de su centro. */}
        <div className="bg-border absolute top-8 bottom-8 left-6 w-px md:hidden" aria-hidden />
        {/* Línea horizontal (desktop): un octavo de espacio a cada lado, para
            que arranque y termine bajo el primer y último número. */}
        <div
          className="bg-border absolute top-8 right-[12.5%] left-[12.5%] hidden h-px md:block"
          aria-hidden
        />

        <motion.ol
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={revealOnce}
          className="relative grid gap-5 md:grid-cols-4 md:gap-8"
        >
          {howItWorks.map((step, index) => {
            const Icon = stepIcons[index] ?? ShoppingBag;
            return (
              <motion.li
                key={step.number}
                variants={fadeInUp}
                className="group relative flex items-start gap-4 md:flex-col md:items-start md:gap-0"
              >
                {/* Sin tarjeta: los pasos van directo sobre el fondo de la
                    sección. Cuatro tarjetas más, después de categorías y
                    destacados, era la tercera grilla de tarjetas seguida. */}
                <div className="relative h-12 w-12 shrink-0 md:h-16 md:w-16">
                  <div className="bg-primary text-primary-foreground ring-secondary/60 relative z-10 flex h-full w-full items-center justify-center rounded-full text-base font-bold ring-8 transition-transform duration-300 group-hover:scale-105 md:text-xl">
                    {step.number}
                  </div>
                  <div className="bg-ink text-ink-foreground absolute -right-1 -bottom-1 z-10 flex h-6 w-6 items-center justify-center rounded-full md:h-7 md:w-7">
                    <Icon className="h-3 w-3 md:h-3.5 md:w-3.5" aria-hidden />
                  </div>
                </div>

                <div className="md:mt-6">
                  <h3 className="text-base font-bold sm:text-lg md:text-xl">{step.title}</h3>
                  <p className="text-muted-foreground mt-1.5 max-w-[34ch] text-sm">
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
