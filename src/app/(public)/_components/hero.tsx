'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Logo } from '@/shared/ui/logo';
import { BorderBeamPanel } from '@/shared/ui/border-beam-panel';
import type { HeroSettingsInput } from '@/modules/content/schema';

/**
 * Foto de borde a borde con esquinas muy redondeadas y margen respecto a la
 * ventana, con el texto directamente encima (sombra de texto en vez de un
 * velo pesado). El logo de la marca vive únicamente acá, en la cápsula de la
 * esquina superior izquierda; la navegación es la cápsula flotante de
 * `SiteNav`.
 *
 * Sin botones propios: la conversión vive en la barra (Catálogo y Cotizar,
 * siempre visibles al hacer scroll) y en el resto de las secciones, así que
 * la tarjeta que se superponía al borde inferior era una tercera copia de
 * los mismos dos destinos.
 *
 * OJO: `hero.primaryCta` y `hero.secondaryCta` se siguen editando desde el
 * panel pero ya no se muestran en ningún lado. Si no van a volver, conviene
 * sacarlos también del formulario de ajustes para no ofrecer un campo que
 * no cambia nada.
 *
 * La foto (public/hero.png) es una imagen de referencia/ambiente, no una
 * foto real del taller o los productos de Idealo: reemplazar por
 * fotografía real en cuanto exista.
 */
export function Hero({ hero }: { hero: HeroSettingsInput }) {
  return (
    <section className="px-3 pt-3 md:-translate-y-9 md:px-5 md:pt-0">
      {/* Haz discreto: un solo arco muy ancho, blanco tenue, dando una vuelta
          cada 26s y sin halo. Sobre una foto a pantalla completa cualquier
          cosa más marcada compite con la imagen en vez de enmarcarla. */}
      <BorderBeamPanel
        beams={1}
        thickness={1}
        radius={32}
        speed={26}
        spread={70}
        interactive={false}
        color="rgba(255,255,255,0.9)"
        border="rgba(255,255,255,0.14)"
        surface="transparent"
        className="md:[&>div]:rounded-[2.5rem]"
      >
        <div className="relative min-h-[560px] overflow-hidden md:min-h-[720px]">
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

          {/* Sin clase de alto responsiva: `Logo` fija `style={{ height }}` en
            línea, que gana sobre cualquier `md:h-*`. El tamaño se controla
            solo con la prop. */}
          <Link
            href="/"
            aria-label="Idealo, inicio"
            className="bg-card absolute top-5 left-5 z-10 rounded-full px-4 py-3 shadow-md md:top-7 md:left-7"
          >
            <Logo height={30} />
          </Link>

          <div className="relative flex min-h-[560px] flex-col items-center justify-center px-6 text-center md:min-h-[720px]">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="max-w-[18ch] text-4xl font-extrabold tracking-tight text-white [text-shadow:0_4px_28px_rgba(0,0,0,0.35)] sm:text-6xl xl:text-[5.25rem] xl:leading-[0.98]"
            >
              {hero.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 max-w-[52ch] text-base text-white/90 [text-shadow:0_2px_12px_rgba(0,0,0,0.3)] sm:text-lg md:text-xl"
            >
              {hero.subtitle}
            </motion.p>
          </div>
        </div>
      </BorderBeamPanel>
    </section>
  );
}
