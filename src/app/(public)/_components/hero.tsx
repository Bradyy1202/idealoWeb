'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { buildWhatsAppUrl } from '@/shared/lib/whatsapp';
import { Button } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { Logo } from '@/shared/ui/logo';
import type { HeroSettingsInput } from '@/modules/content/schema';

/**
 * La foto (public/hero.png) es una imagen de referencia/ambiente, no una
 * foto real del taller o los productos de Idealo: reemplazar por
 * fotografía real en cuanto exista.
 *
 * El logo y el resto del contenido van superpuestos sobre la imagen, con un
 * velo claro detrás para que el texto (en la tinta oscura de siempre, no
 * blanco) siga leyéndose sobre una foto de por sí clara.
 */
export function Hero({ hero, whatsapp }: { hero: HeroSettingsInput; whatsapp: string }) {
  const whatsappHref = buildWhatsAppUrl(whatsapp, 'Hola, quiero cotizar productos personalizados.');

  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/hero.png"
          alt="Diseño personalizado aplicado a botellas, tazas, textiles y accesorios por sublimación"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Velo: blanco al centro (donde va el texto) y se abre hacia los
            bordes para que la foto siga siendo reconocible. */}
        <div className="from-background/95 via-background/80 to-background/50 absolute inset-0 bg-gradient-to-b" />
      </div>

      <Container className="relative flex min-h-[560px] flex-col items-center justify-center py-16 text-center md:min-h-[640px] md:py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Logo height={72} className="mb-6 md:mb-8" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-[16ch] text-4xl tracking-tight sm:text-5xl xl:text-6xl"
        >
          {hero.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted-foreground mt-4 max-w-[52ch] text-lg md:text-xl"
        >
          {hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <Link href="/catalogo">
            <Button size="lg" className="group w-full rounded-full sm:w-auto">
              {hero.primaryCta}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
            <Button variant="whatsapp" size="lg" className="w-full rounded-full sm:w-auto">
              {hero.secondaryCta}
            </Button>
          </a>
        </motion.div>
      </Container>
    </section>
  );
}
