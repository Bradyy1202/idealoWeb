'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Gift, GlassWater, Shirt, UtensilsCrossed } from 'lucide-react';
import { categories } from '@/shared/data/mock/site';
import { Section, SectionHeading } from '@/shared/ui/section';
import { Button } from '@/shared/ui/button';

const icons = {
  botellas: GlassWater,
  tazas: UtensilsCrossed,
  textiles: Shirt,
  accesorios: Gift,
} as const;

/**
 * Un color de etiqueta distinto por categoría, como las tarjetas de marcas
 * asociadas de releaf.bio (Carlsberg en azul, PANGAIA en verde, LVMH en
 * rosa...): la variedad de color es la señal, no un acento único repetido
 * cuatro veces.
 */
const tagStyles = {
  botellas: 'bg-primary text-primary-foreground',
  tazas: 'bg-coral text-coral-foreground',
  textiles: 'bg-success-foreground text-card',
  accesorios: 'bg-ink text-ink-foreground',
} as const;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemFadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function CategoriesSection() {
  return (
    <Section
      id="categorias"
      className="bg-mist text-mist-foreground mx-3 rounded-[2rem] md:mx-5 md:rounded-[2.5rem]"
    >
      <SectionHeading
        eyebrow="Categorías"
        title="Qué personalizamos"
        description="Cuatro familias de productos, todas con sublimación de alta calidad."
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4"
      >
        {categories.map((category) => {
          const Icon = icons[category.slug as keyof typeof icons];
          const tag = tagStyles[category.slug as keyof typeof tagStyles];
          return (
            <motion.div
              key={category.slug}
              variants={itemFadeIn}
              whileHover={{ y: -4 }}
              className="bg-card flex h-full flex-col rounded-2xl p-4 shadow-sm transition-shadow hover:shadow-md sm:rounded-[1.75rem] sm:p-6"
            >
              <div
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full sm:h-11 sm:w-11 ${tag}`}
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>

              <h3 className="mt-3 text-base font-bold sm:mt-4 sm:text-xl">{category.name}</h3>
              <p className="text-muted-foreground mt-1 line-clamp-2 text-xs sm:text-sm">
                {category.description}
              </p>

              <ul className="mt-3 space-y-1 sm:mt-4 sm:space-y-1.5">
                {category.facts.map((fact) => (
                  <li key={fact} className="flex items-center gap-1.5 text-xs sm:gap-2 sm:text-sm">
                    <Check className="text-primary-text h-3 w-3 shrink-0 sm:h-4 sm:w-4" />
                    <span className="line-clamp-1">{fact}</span>
                  </li>
                ))}
              </ul>

              <Link href={`/catalogo/${category.slug}`} className="mt-auto block pt-3 sm:pt-5">
                <Button variant="outline" size="sm" className="w-full rounded-full sm:w-auto">
                  Ver catálogo
                </Button>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </Section>
  );
}
