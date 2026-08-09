'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowUpRight, Gift, GlassWater, Shirt, UtensilsCrossed } from 'lucide-react';
import { categories } from '@/shared/data/mock/site';
import { Section, SectionHeading } from '@/shared/ui/section';
import { cn } from '@/shared/lib/cn';
import { staggerContainer, fadeInUp, revealOnce } from '@/shared/lib/motion-presets';

const icons = {
  botellas: GlassWater,
  tazas: UtensilsCrossed,
  textiles: Shirt,
  accesorios: Gift,
} as const;

/**
 * Un campo de color entero por categoría, no un ícono de color sobre tarjeta
 * crema: cuatro tarjetas iguales con el mismo fondo y distinto ícono era
 * exactamente lo que hacía que la sección se sintiera de plantilla. Ahora
 * cada categoría es un bloque con su propio color de marca, y la primera
 * ocupa el doble de ancho para que la grilla tenga jerarquía en vez de
 * cuatro celdas intercambiables.
 */
const fields = {
  botellas: 'bg-ink text-ink-foreground',
  tazas: 'bg-coral text-coral-foreground',
  textiles: 'bg-primary text-primary-foreground',
  accesorios: 'bg-mist text-mist-foreground',
} as const;

export function CategoriesSection() {
  return (
    <Section id="categorias">
      <SectionHeading
        eyebrow="Categorías"
        title="Qué personalizamos"
        description="Cuatro familias de productos, todas con sublimación de alta calidad y pedido por unidad."
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={revealOnce}
        className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3"
      >
        {categories.map((category, index) => {
          const Icon = icons[category.slug as keyof typeof icons];
          const field = fields[category.slug as keyof typeof fields];
          // Con 4 tarjetas en 3 columnas, la primera y la última se llevan
          // ancho doble: 2+1 arriba, 1+2 abajo. Así la grilla tiene jerarquía
          // (deja de ser cuatro celdas intercambiables) y encima cierra sin
          // dejar una celda vacía al final de la segunda fila.
          const isFeature = index === 0;
          const isWide = isFeature || index === categories.length - 1;

          return (
            <motion.div
              key={category.slug}
              variants={fadeInUp}
              // El ancho doble solo desde lg: en móvil las cuatro van iguales
              // en 2 columnas, que es lo compacto. Si acá se expandieran,
              // dos de las cuatro ocuparían el ancho entero y la sección
              // crecería justo donde hay menos pantalla.
              className={cn(isWide && 'lg:col-span-2')}
            >
              <Link
                href={`/catalogo/${category.slug}`}
                className={cn(
                  'group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-1 sm:rounded-[1.75rem] sm:p-7',
                  'min-h-[180px] sm:min-h-[240px]',
                  isFeature && 'lg:min-h-[320px]',
                  field,
                )}
              >
                {/* La silueta enorme, recortada por el borde, es el motivo de
                    la tarjeta: da escala y peso sin depender de una foto. */}
                <Icon
                  className={cn(
                    'pointer-events-none absolute -right-6 -bottom-8 opacity-20 transition-transform duration-500 group-hover:scale-110',
                    isFeature ? 'h-56 w-56 sm:h-72 sm:w-72' : 'h-40 w-40 sm:h-52 sm:w-52',
                  )}
                  strokeWidth={0.75}
                  aria-hidden
                />

                <div className="relative">
                  <h3
                    className={cn(
                      'font-bold tracking-tight',
                      isFeature ? 'text-2xl sm:text-4xl' : 'text-lg sm:text-2xl',
                    )}
                  >
                    {category.name}
                  </h3>
                  <p
                    className={cn(
                      'mt-2 max-w-[30ch] text-xs opacity-80 sm:text-sm',
                      !isFeature && 'line-clamp-2',
                    )}
                  >
                    {category.description}
                  </p>
                </div>

                <div className="relative mt-6 flex items-end justify-between gap-3">
                  <ul className="flex flex-wrap gap-1.5">
                    {category.facts.map((fact) => (
                      <li
                        key={fact}
                        className="rounded-full border border-current/25 px-2.5 py-1 text-[0.65rem] font-medium opacity-80 sm:text-xs"
                      >
                        {fact}
                      </li>
                    ))}
                  </ul>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-current/30 transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </Section>
  );
}
