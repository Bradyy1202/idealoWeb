'use client';

import { motion } from 'framer-motion';
import { Clock, MapPin, PackageCheck, ShieldCheck } from 'lucide-react';
import { Section } from '@/shared/ui/section';

/**
 * La plantilla original mostraba logos de clientes (grises, en grid) — no
 * existen para Idealo, y fabricarlos sería mentir sobre el negocio. En su
 * lugar, la franja usa hechos reales y verificables del propio catálogo.
 */
const facts = [
  { icon: Clock, label: 'Respuesta el mismo día hábil' },
  { icon: PackageCheck, label: '2 a 4 días de producción' },
  { icon: MapPin, label: 'Envíos a todo Costa Rica' },
  { icon: ShieldCheck, label: 'Sublimación que no se despinta' },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemFadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function TrustStrip() {
  return (
    <Section className="py-10 md:py-14">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mx-auto grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8"
      >
        {facts.map((fact) => (
          <motion.div
            key={fact.label}
            variants={itemFadeIn}
            className="flex flex-col items-center gap-3 text-center"
          >
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-2xl">
              <fact.icon className="text-primary h-6 w-6" />
            </div>
            <p className="text-sm font-medium">{fact.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
