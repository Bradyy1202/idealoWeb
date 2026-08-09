'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { featuredProducts } from '@/shared/data/mock/site';
import { Section, SectionHeading } from '@/shared/ui/section';
import { ProductCard } from '@/shared/ui/card';
import { staggerContainer, fadeInUp, revealOnce } from '@/shared/lib/motion-presets';

export function FeaturedProductsSection({ whatsapp }: { whatsapp: string }) {
  return (
    <Section>
      <SectionHeading
        eyebrow="Destacados"
        title="Los más pedidos"
        description="Para regalo, oficina y equipos. Todos se piden por unidad."
        action={
          <Link
            href="/catalogo"
            className="group text-primary-text inline-flex w-fit items-center gap-2 text-sm font-semibold"
          >
            Ver el catálogo completo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        }
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={revealOnce}
        className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4"
      >
        {featuredProducts.map((product) => (
          <motion.div key={product.slug} variants={fadeInUp}>
            <ProductCard product={product} whatsapp={whatsapp} />
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
