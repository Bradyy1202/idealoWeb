'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { buildWhatsAppUrl } from '@/shared/lib/whatsapp';
import { Button } from '@/shared/ui/button';
import { Logo } from '@/shared/ui/logo';
import { WhatsAppIcon } from '@/shared/ui/whatsapp-icon';
import type { HeroSettingsInput } from '@/modules/content/schema';

/**
 * Estructura calcada de releaf.bio: foto de borde a borde con esquinas muy
 * redondeadas y margen respecto a la ventana (no un hero pegado a los
 * bordes), texto gigante centrado directamente sobre la foto (sombra de
 * texto en vez de un velo pesado) y una tarjeta de CTA que se superpone al
 * borde inferior. Ya no hay header propio: el logo de la marca vive
 * únicamente acá, en una cápsula sobre la esquina superior izquierda de la
 * foto, y la navegación es la cápsula flotante de `SiteNav`.
 *
 * La foto (public/hero.png) es una imagen de referencia/ambiente, no una
 * foto real del taller o los productos de Idealo: reemplazar por
 * fotografía real en cuanto exista.
 */
export function Hero({ hero, whatsapp }: { hero: HeroSettingsInput; whatsapp: string }) {
  const whatsappHref = buildWhatsAppUrl(whatsapp, 'Hola, quiero cotizar productos personalizados.');

  return (
    <section className="px-3 pt-3 md:px-5 md:pt-5">
      <div className="relative">
        <div className="relative min-h-[600px] overflow-hidden rounded-[2rem] md:min-h-[720px] md:rounded-[2.5rem]">
          <Image
            src="/hero.png"
            alt="Diseño personalizado aplicado a botellas, tazas, textiles y accesorios por sublimación"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Sombra suave de arriba a abajo, no un velo que tape la foto: el
              texto se apoya en text-shadow para leerse encima. */}
          <div className="from-ink/65 via-ink/10 absolute inset-0 bg-gradient-to-t to-transparent" />

          <Link
            href="/"
            aria-label="Idealo, inicio"
            className="bg-card/95 absolute top-5 left-5 z-10 rounded-full p-2.5 shadow-md backdrop-blur-md md:top-7 md:left-7 md:p-3"
          >
            <Logo height={22} className="md:h-7" />
          </Link>

          <div className="relative flex h-full min-h-[600px] flex-col items-center justify-center px-6 pb-16 text-center md:min-h-[720px] md:pb-20">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="max-w-[18ch] text-5xl font-extrabold tracking-tight text-white [text-shadow:0_4px_28px_rgba(0,0,0,0.35)] sm:text-6xl xl:text-[5.25rem] xl:leading-[0.98]"
            >
              {hero.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 max-w-[52ch] text-lg text-white/90 [text-shadow:0_2px_12px_rgba(0,0,0,0.3)] md:text-xl"
            >
              {hero.subtitle}
            </motion.p>
          </div>
        </div>

        {/* Tarjeta de CTA superpuesta al borde inferior de la foto: fuera del
            contenedor con overflow-hidden para que no se recorte. */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-card relative z-10 mx-auto -mt-12 flex w-fit max-w-[calc(100%-2rem)] flex-col items-center gap-3 rounded-[1.75rem] p-4 shadow-lg sm:-mt-8 sm:flex-row"
        >
          <Link href="/catalogo" className="w-full sm:w-auto">
            <Button size="lg" className="group w-full rounded-full sm:w-auto">
              {hero.primaryCta}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button variant="whatsapp" size="lg" className="w-full gap-2 rounded-full sm:w-auto">
              <WhatsAppIcon className="h-4 w-4" />
              {hero.secondaryCta}
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
