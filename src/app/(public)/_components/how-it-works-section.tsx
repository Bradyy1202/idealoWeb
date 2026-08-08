'use client';

import { motion } from 'framer-motion';
import { howItWorks } from '@/shared/data/mock/site';
import { Section, SectionHeading } from '@/shared/ui/section';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const itemFadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function HowItWorksSection() {
  return (
    <Section id="como-funciona" className="bg-secondary/60">
      <SectionHeading title="Cómo funciona" />

      <motion.ol
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2 lg:grid-cols-4"
      >
        {howItWorks.map((step) => (
          <motion.li key={step.number} variants={itemFadeIn} className="text-center">
            <div className="bg-primary text-primary-foreground mx-auto flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold">
              {Number(step.number)}
            </div>
            <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
            <p className="text-muted-foreground mt-2 text-sm">{step.description}</p>
          </motion.li>
        ))}
      </motion.ol>
    </Section>
  );
}
