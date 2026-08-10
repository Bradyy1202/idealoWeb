'use client';

import { motion } from 'motion/react';
import { ArrowUpRight, Clock, Mail, MapPin } from 'lucide-react';
import { Section } from '@/shared/ui/section';
import { WhatsAppIcon } from '@/shared/ui/whatsapp-icon';
import { AetherRibbonMesh } from '@/shared/ui/aether-ribbon-mesh';
import { BorderBeamPanel } from '@/shared/ui/border-beam-panel';
import { buildWhatsAppUrl } from '@/shared/lib/whatsapp';
import { easeOutExpo, revealOnce } from '@/shared/lib/motion-presets';
import type { ContactSettingsInput } from '@/modules/content/schema';

/** Formatea 50685097011 como +506 8509 7011. */
function formatPhone(raw: string) {
  const country = raw.slice(0, 3);
  const rest = raw.slice(3);
  return `+${country} ${rest.slice(0, 4)} ${rest.slice(4)}`;
}

/**
 * Dos bloques que llenan la sección de borde a borde: los datos sobre tinta
 * oscura y, en lugar del formulario, WhatsApp como acción única y grande.
 *
 * Sin formulario de contacto: WhatsApp es el único canal de conversión real
 * del negocio, y tener las dos vías repartía la atención entre una que
 * responde el mismo día y otra que llega a una bandeja.
 *
 * OJO: al sacarlo dejan de generarse consultas con origen `CONTACT_FORM`.
 * `submitContactFormAction` y su esquema siguen en el módulo `inquiries`
 * (no se borró nada), y la bandeja del panel mantiene ese filtro, que a
 * partir de ahora solo mostrará las consultas ya recibidas. Si el
 * formulario no va a volver, conviene quitar también el filtro.
 */
export function ContactSection({ contact }: { contact: ContactSettingsInput }) {
  const whatsappHref = buildWhatsAppUrl(
    contact.whatsapp,
    'Hola, quiero cotizar productos personalizados.',
  );

  const details = [
    ...(contact.location ? [{ icon: MapPin, label: 'Ubicación', value: contact.location }] : []),
    ...(contact.schedule ? [{ icon: Clock, label: 'Horario', value: contact.schedule }] : []),
    { icon: Mail, label: 'Correo', value: contact.email },
  ];

  return (
    <Section id="contacto">
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={revealOnce}
          transition={easeOutExpo}
          className="bg-navy text-navy-foreground relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 sm:rounded-[1.75rem] sm:p-9"
        >
          {/* Cintas reactivas al puntero y a los clics sobre el bloque.
              Recoloreadas para el fondo azul: el mismo azul de antes se
              perdía contra la superficie, así que van tonos claros y cálidos
              que contrastan (la mezcla es aditiva, suman luz). */}
          <AetherRibbonMesh
            colors={['#5fa8e8', '#dce4ea', '#c04521', '#25d366']}
            ribbons={4}
            opacity={0.4}
          />

          <div className="relative">
            <span className="text-mist flex items-center gap-3 text-xs font-semibold tracking-[0.18em] uppercase">
              <span className="bg-mist h-px w-8" aria-hidden />
              Contacto
            </span>
            <h2 className="mt-4 max-w-[14ch] text-3xl leading-[1.05] tracking-tight sm:text-4xl md:text-5xl">
              Trabajemos juntos
            </h2>
            <p className="mt-4 max-w-[42ch] text-sm text-white/75 sm:text-base">
              Contanos qué querés personalizar y te ayudamos a convertir la idea en un producto
              real.
            </p>
          </div>

          <dl className="relative mt-10 grid gap-5 border-t border-white/15 pt-7 sm:grid-cols-2">
            {details.map((detail) => (
              <div key={detail.label} className="flex items-start gap-3">
                <detail.icon className="text-mist mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <div>
                  <dt className="text-xs tracking-[0.14em] text-white/55 uppercase">
                    {detail.label}
                  </dt>
                  <dd className="mt-1 text-sm text-white/90">{detail.value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </motion.div>

        {/* El haz recorriendo el borde marca cuál es la acción principal de
            la página, y acelera al acercar el puntero. */}
        {/* Haz blanco y halo verde, a propósito distintos: el haz corre sobre
            la superficie verde de la tarjeta (en verde se perdería) y el halo
            se proyecta sobre el fondo crema de la página (en blanco sería
            invisible). Cada uno contrasta contra lo que tiene detrás. */}
        {/* Un solo haz y no dos: con dos luces opuestas, media vuelta deja
            la tarjeta igual que al empezar y el giro deja de percibirse.
            Con una sola, la luz recorre el contorno y se ve de dónde viene
            y a dónde va. */}
        <BorderBeamPanel
          beams={1}
          thickness={2}
          radius={28}
          glow
          speed={5}
          spread={26}
          color="#ffffff"
          glowColor="var(--whatsapp)"
          surface="var(--whatsapp)"
        >
          {/* Toda la tarjeta es el enlace: el bloque completo es la acción, no
              un botón chico esperando a que le apunten. */}
          <motion.a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={revealOnce}
            transition={{ ...easeOutExpo, delay: 0.1 }}
            className="group bg-whatsapp text-whatsapp-foreground relative flex h-full flex-col justify-between overflow-hidden p-6 sm:p-9"
          >
            <WhatsAppIcon
              className="pointer-events-none absolute -right-10 -bottom-12 h-56 w-56 opacity-10 transition-transform duration-500 group-hover:scale-110 sm:h-72 sm:w-72"
              aria-hidden
            />

            <div className="relative">
              <span className="flex items-center gap-2.5 text-xs font-semibold tracking-[0.18em] uppercase opacity-70">
                <WhatsAppIcon className="h-4 w-4" />
                Respuesta el mismo día hábil
              </span>
              <p className="mt-4 max-w-[16ch] text-3xl leading-[1.05] font-bold tracking-tight sm:text-4xl md:text-5xl">
                Cotizá por WhatsApp
              </p>
              <p className="mt-4 max-w-[36ch] text-sm opacity-80 sm:text-base">
                Escribinos con la idea, la cantidad y para cuándo lo necesitás. Te pasamos precio y
                tiempo de entrega.
              </p>
            </div>

            <div className="relative mt-10 flex items-center justify-between gap-4 rounded-full bg-black/10 px-5 py-4 transition-colors duration-300 group-hover:bg-black/20 sm:px-6 sm:py-5">
              <span data-numeral className="text-lg font-bold sm:text-2xl">
                {formatPhone(contact.whatsapp)}
              </span>
              <ArrowUpRight
                className="h-6 w-6 shrink-0 transition-transform duration-300 group-hover:rotate-45"
                aria-hidden
              />
            </div>
          </motion.a>
        </BorderBeamPanel>
      </div>
    </Section>
  );
}
