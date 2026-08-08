'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { testimonials } from '@/shared/data/mock/site';
import { Section, SectionHeading } from '@/shared/ui/section';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemFadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function TestimonialsSection() {
  return (
    <Section id="testimonios" className="bg-secondary/60">
      <SectionHeading eyebrow="Testimonios" title="Lo que dicen quienes ya pidieron" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mx-auto grid max-w-5xl gap-6 pb-12 md:grid-cols-3"
      >
        {testimonials.map((item) => (
          <motion.figure
            key={item.authorName}
            variants={itemFadeIn}
            whileHover={{ y: -8 }}
            className="border-border bg-background flex flex-col justify-between rounded-2xl border p-6"
          >
            <div>
              <div className="text-primary flex gap-0.5" aria-hidden>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={16}
                    strokeWidth={0}
                    className={index < item.rating ? 'fill-primary' : 'fill-muted'}
                  />
                ))}
              </div>
              <p className="sr-only">Calificación: {item.rating} de 5 estrellas.</p>
              <blockquote className="mt-4 line-clamp-4 text-base leading-relaxed font-medium">
                “{item.content}”
              </blockquote>
            </div>
            <figcaption className="mt-6">
              <p className="font-medium">{item.authorName}</p>
              <p className="text-muted-foreground text-sm">{item.authorLocation}</p>
            </figcaption>
          </motion.figure>
        ))}
      </motion.div>
    </Section>
  );
}
