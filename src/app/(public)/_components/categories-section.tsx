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
        className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2"
      >
        {categories.map((category, index) => {
          const Icon = icons[category.slug as keyof typeof icons];
          const tag = tagStyles[category.slug as keyof typeof tagStyles];
          return (
            <motion.div
              key={category.slug}
              variants={itemFadeIn}
              whileHover={{ rotate: index % 2 === 0 ? -1 : 1, y: -4 }}
              className="bg-card rounded-[1.75rem] p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div
                className={`inline-flex h-11 w-11 items-center justify-center rounded-full ${tag}`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <h3 className="mt-4 text-xl font-bold">{category.name}</h3>
              <p className="text-muted-foreground mt-1 text-sm">{category.description}</p>

              <ul className="mt-4 space-y-1.5">
                {category.facts.map((fact) => (
                  <li key={fact} className="flex items-center gap-2 text-sm">
                    <Check className="text-primary-text h-4 w-4 shrink-0" />
                    {fact}
                  </li>
                ))}
              </ul>

              <Link href={`/catalogo/${category.slug}`} className="mt-5 block">
                <Button variant="outline" size="sm" className="rounded-full">
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
