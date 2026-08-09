'use client';

import { motion } from 'motion/react';
import { Gift, GlassWater, Shirt, UtensilsCrossed } from 'lucide-react';
import { categories } from '@/shared/data/mock/site';
import { Section, SectionHeading } from '@/shared/ui/section';
import { DestinationCard } from '@/shared/ui/destination-card';
import { cn } from '@/shared/lib/cn';
import { staggerContainer, fadeInUp, revealOnce } from '@/shared/lib/motion-presets';

const icons = {
  botellas: GlassWater,
  tazas: UtensilsCrossed,
  textiles: Shirt,
  accesorios: Gift,
} as const;

/**
 * Un color de marca por categoría, en HSL porque `DestinationCard` compone
 * opacidades a partir de él (`hsl(var(--theme-color) / 0.9)`), y para eso
 * necesita los canales sueltos, no un hex.
 *
 * Los valores son los mismos tonos de la paleta: tinta, coral, azul de
 * marca y musgo. No hay foto por categoría todavía, así que la tarjeta se
 * apoya en el color y en la silueta del producto.
 */
const themes = {
  botellas: '95 20% 10%',
  tazas: '15 71% 44%',
  textiles: '211 70% 38%',
  accesorios: '104 22% 26%',
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
          // Con 4 tarjetas en 3 columnas, la primera y la última se llevan
          // ancho doble: 2+1 arriba, 1+2 abajo. Así la grilla tiene jerarquía
          // y cierra sin dejar una celda vacía al final de la segunda fila.
          // Solo desde lg: en móvil las cuatro van iguales en 2 columnas.
          const isWide = index === 0 || index === categories.length - 1;

          return (
            <motion.div
              key={category.slug}
              variants={fadeInUp}
              className={cn(
                'min-h-[190px] sm:min-h-[260px]',
                isWide && 'lg:col-span-2 lg:min-h-[320px]',
              )}
            >
              <DestinationCard
                location={category.name}
                stats={category.description}
                tags={category.facts}
                href={`/catalogo/${category.slug}`}
                themeColor={themes[category.slug as keyof typeof themes]}
                motif={icons[category.slug as keyof typeof icons]}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </Section>
  );
}
