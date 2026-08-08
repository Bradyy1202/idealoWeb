'use client';

import { motion } from 'framer-motion';
import { galleryItems } from '@/shared/data/mock/site';
import { Section, SectionHeading } from '@/shared/ui/section';
import { Badge } from '@/shared/ui/badge';

/**
 * `GalleryItem` no tiene seed todavía: no hay fotos reales de trabajos
 * entregados. La grilla reserva el ritmo bento (una celda ancha + cinco
 * normales, seis celdas para seis registros) lista para recibir contenido
 * real en vez de fabricar imágenes de stock.
 */
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemFadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function GallerySection() {
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
        {galleryItems.map((item, index) => (
          <motion.figure
            key={item.title}
            variants={itemFadeIn}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className={
              index === 0
                ? 'group border-border bg-muted/40 relative aspect-[16/9] overflow-hidden rounded-2xl border border-dashed sm:col-span-2'
                : 'group border-border bg-muted/40 relative aspect-square overflow-hidden rounded-2xl border border-dashed'
            }
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-muted-foreground text-xs tracking-[0.16em] uppercase">
                Foto pendiente
              </span>
            </div>
            <figcaption className="absolute right-4 bottom-4 left-4">
              <Badge className="bg-background/90">{item.title}</Badge>
            </figcaption>
          </motion.figure>
        ))}
      </motion.div>
    </Section>
  );
}
