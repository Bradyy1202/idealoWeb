'use client';

import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import Balancer from 'react-wrap-balancer';
import { Section } from '@/shared/ui/section';
import { cn } from '@/shared/lib/cn';
import type { TestimonialItem } from '@/modules/content/service';
import { staggerContainer, fadeInUp, revealOnce, easeOutExpo } from '@/shared/lib/motion-presets';

function RatingStars({ rating, tone }: { rating: number; tone: 'light' | 'dark' }) {
  return (
    <>
      <div className="flex gap-0.5" aria-hidden>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={15}
            strokeWidth={0}
            className={cn(
              index < rating
                ? tone === 'light'
                  ? 'fill-primary'
                  : 'fill-primary-text'
                : tone === 'light'
                  ? 'fill-white/25'
                  : 'fill-muted',
            )}
          />
        ))}
      </div>
      <p className="sr-only">Calificación: {rating} de 5 estrellas.</p>
    </>
  );
}

/**
 * El primer testimonio se muestra como cita grande sobre bloque oscuro y los
 * demás como tarjetas al lado: tres tarjetas idénticas en fila era el mismo
 * patrón que ya usaban categorías y destacados, y repetirlo una tercera vez
 * es lo que hace que la página se lea como plantilla.
 */
export function TestimonialsSection({ testimonials }: { testimonials: TestimonialItem[] }) {
  if (testimonials.length === 0) return null;

  const [lead, ...rest] = testimonials;
  if (!lead) return null;

  return (
    <Section id="testimonios">
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-[1.15fr_1fr]">
        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={revealOnce}
          transition={easeOutExpo}
          className="bg-ink text-ink-foreground relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 sm:rounded-[1.75rem] sm:p-9"
        >
          {/* Comilla tipográfica como marca de agua: la sección no tiene foto
              y esto le da peso visual sin inventar una. */}
          <span
            className="pointer-events-none absolute -top-16 -right-4 text-[16rem] leading-none font-bold opacity-[0.07] select-none"
            aria-hidden
          >
            &rdquo;
          </span>

          <div className="relative">
            <span className="text-primary flex items-center gap-3 text-xs font-semibold tracking-[0.18em] uppercase">
              <span className="bg-primary h-px w-8" aria-hidden />
              Testimonios
            </span>
            <blockquote className="mt-6 text-xl leading-snug font-semibold sm:text-3xl sm:leading-[1.2]">
              <Balancer>&ldquo;{lead.content}&rdquo;</Balancer>
            </blockquote>
          </div>

          <figcaption className="relative mt-8 flex items-end justify-between gap-4">
            <div>
              <p className="font-semibold">{lead.authorName}</p>
              {lead.authorLocation ? (
                <p className="text-sm text-white/60">{lead.authorLocation}</p>
              ) : null}
            </div>
            {lead.rating ? <RatingStars rating={lead.rating} tone="light" /> : null}
          </figcaption>
        </motion.figure>

        {rest.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={revealOnce}
            className="grid gap-3 sm:gap-4"
          >
            {rest.map((item) => (
              <motion.figure
                key={item.id}
                variants={fadeInUp}
                className="border-border/70 bg-card flex flex-col justify-between rounded-2xl border p-5 sm:rounded-[1.75rem] sm:p-7"
              >
                <div>
                  {item.rating ? <RatingStars rating={item.rating} tone="dark" /> : null}
                  <blockquote className="mt-3 line-clamp-4 leading-relaxed">
                    &ldquo;{item.content}&rdquo;
                  </blockquote>
                </div>
                <figcaption className="mt-5 flex items-baseline gap-2">
                  <p className="text-sm font-semibold">{item.authorName}</p>
                  {item.authorLocation ? (
                    <p className="text-muted-foreground text-sm">· {item.authorLocation}</p>
                  ) : null}
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>
        ) : null}
      </div>
    </Section>
  );
}
