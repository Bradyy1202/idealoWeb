'use client';

import { motion } from 'framer-motion';
import { featuredProducts } from '@/shared/data/mock/site';
import { Section, SectionHeading } from '@/shared/ui/section';
import { ProductCard } from '@/shared/ui/card';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemFadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function FeaturedProductsSection() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Destacados"
        title="Los más pedidos"
        description="Para regalo, oficina y equipos."
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid gap-6 pb-12 sm:grid-cols-2 lg:grid-cols-4"
      >
        {featuredProducts.map((product) => (
          <motion.div key={product.slug} variants={itemFadeIn}>
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
