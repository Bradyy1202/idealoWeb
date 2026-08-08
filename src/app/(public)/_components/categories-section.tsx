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
    <Section id="categorias">
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
        {categories.map((category) => {
          const Icon = icons[category.slug as keyof typeof icons];
          return (
            <motion.div
              key={category.slug}
              variants={itemFadeIn}
              className="border-border bg-card rounded-2xl border p-6"
            >
              <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-2xl">
                <Icon className="text-primary h-6 w-6" />
              </div>

              <h3 className="mt-4 text-xl font-semibold">{category.name}</h3>
              <p className="text-muted-foreground mt-1 text-sm">{category.description}</p>

              <ul className="mt-4 space-y-1.5">
                {category.facts.map((fact) => (
                  <li key={fact} className="flex items-center gap-2 text-sm">
                    <Check className="text-primary h-4 w-4 shrink-0" />
                    {fact}
                  </li>
                ))}
              </ul>

              <Link href="/catalogo" className="mt-5 block">
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
