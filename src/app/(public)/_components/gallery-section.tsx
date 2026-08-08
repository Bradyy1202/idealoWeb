'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Section, SectionHeading } from '@/shared/ui/section';
import { Badge } from '@/shared/ui/badge';
import type { GalleryPublicItem } from '@/modules/content/service';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemFadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/** Sin fotos todavía (`GalleryItem` se administra desde el panel): no hay nada real que mostrar, así que la sección no se renderiza. */
export function GallerySection({ items }: { items: GalleryPublicItem[] }) {
  if (items.length === 0) return null;

  return (
    <Section id="galeria">
      <SectionHeading
        eyebrow="Portafolio"
        title="Galería de trabajos"
        description="Pedidos reales entregados a personas y empresas."
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid gap-4 pb-12 sm:grid-cols-2 lg:grid-cols-3"
      >
        {items.map((item, index) => (
          <motion.figure
            key={item.id}
            variants={itemFadeIn}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className={
              index === 0
                ? 'group border-border bg-muted relative aspect-[16/9] overflow-hidden rounded-2xl border sm:col-span-2'
                : 'group border-border bg-muted relative aspect-square overflow-hidden rounded-2xl border'
            }
          >
            <Image
              src={item.imageUrl}
              alt={item.title ?? ''}
              fill
              sizes={
                index === 0
                  ? '(min-width: 640px) 66vw, 100vw'
                  : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'
              }
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {item.title ? (
              <figcaption className="absolute right-4 bottom-4 left-4">
                <Badge className="bg-background/90">{item.title}</Badge>
              </figcaption>
            ) : null}
          </motion.figure>
        ))}
      </motion.div>
    </Section>
  );
}
