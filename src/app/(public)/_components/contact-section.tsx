'use client';

import { useActionState } from 'react';
import { motion } from 'motion/react';
import { Clock, Mail, MapPin } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import { Section } from '@/shared/ui/section';
import { WhatsAppIcon } from '@/shared/ui/whatsapp-icon';
import { buildWhatsAppUrl } from '@/shared/lib/whatsapp';
import { easeOutExpo, revealOnce } from '@/shared/lib/motion-presets';
import { submitContactFormAction, type ContactFormState } from '@/modules/inquiries/actions';
import type { ContactSettingsInput } from '@/modules/content/schema';

const initialState: ContactFormState = { status: 'idle' };

/** Formatea 50685097011 como +506 8509 7011. */
function formatPhone(raw: string) {
  const country = raw.slice(0, 3);
  const rest = raw.slice(3);
  return `+${country} ${rest.slice(0, 4)} ${rest.slice(4)}`;
}

/**
 * Dos bloques que llenan la sección de borde a borde: los datos sobre
 * tinta oscura y el formulario sobre crema. Antes eran una columna de texto
 * suelto y una tarjeta chica flotando, y la mitad izquierda quedaba vacía.
 *
 * WhatsApp va primero y como botón, no como un dato más de la lista: es el
 * único canal de conversión real del negocio, y el formulario es la
 * alternativa para quien prefiere no escribir por ahí.
 */
export function ContactSection({ contact }: { contact: ContactSettingsInput }) {
  const [state, formAction, isPending] = useActionState(submitContactFormAction, initialState);
  const whatsappHref = buildWhatsAppUrl(
    contact.whatsapp,
    'Hola, quiero cotizar productos personalizados.',
  );

  const details = [
    ...(contact.location
      ? [{ icon: MapPin, label: 'Ubicación', value: contact.location, numeral: false }]
      : []),
    ...(contact.schedule
      ? [{ icon: Clock, label: 'Horario', value: contact.schedule, numeral: false }]
      : []),
    { icon: Mail, label: 'Correo', value: contact.email, numeral: false },
  ];

  return (
    <Section id="contacto">
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={revealOnce}
          transition={easeOutExpo}
          className="bg-ink text-ink-foreground relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 sm:rounded-[1.75rem] sm:p-9"
        >
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full opacity-20"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            <g stroke="currentColor" strokeWidth="0.15" fill="none">
              <path d="M0 60 Q 50 10 100 35" />
              <path d="M0 78 Q 50 34 100 62" />
              <path d="M20 100 Q 48 44 58 0" />
            </g>
          </svg>

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

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-whatsapp text-whatsapp-foreground mt-7 inline-flex items-center gap-2.5 rounded-full px-5 py-3 font-semibold transition-transform hover:scale-105"
            >
              <WhatsAppIcon className="h-5 w-5" />
              <span data-numeral>{formatPhone(contact.whatsapp)}</span>
            </a>
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

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={revealOnce}
          transition={{ ...easeOutExpo, delay: 0.1 }}
          className="border-border/70 bg-card rounded-2xl border p-6 sm:rounded-[1.75rem] sm:p-9"
        >
          {state.status === 'success' ? (
            <div className="flex h-full flex-col items-center justify-center py-10 text-center">
              <div className="bg-success text-success-foreground flex h-14 w-14 items-center justify-center rounded-full text-2xl">
                ✓
              </div>
              <p className="mt-5 text-xl font-bold">¡Listo, recibimos tu mensaje!</p>
              <p className="text-muted-foreground mt-2 max-w-[38ch] text-sm">
                Te contactamos a la brevedad. Si es urgente, escribinos directo por WhatsApp.
              </p>
            </div>
          ) : (
            <>
              <h3 className="text-xl font-bold sm:text-2xl">Envianos un mensaje</h3>
              <p className="text-muted-foreground mt-1.5 text-sm">
                Te respondemos el mismo día hábil.
              </p>

              <form action={formAction} className="mt-7 space-y-5">
                {/* Honeypot (tarea 3.7): invisible para personas, un bot que autocompleta todo lo llena. */}
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <label htmlFor="website">No completar este campo</label>
                  <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Tu nombre completo"
                      className="h-11 rounded-xl"
                      required
                    />
                    {state.fieldErrors?.name ? (
                      <p className="text-destructive text-sm">{state.fieldErrors.name}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Correo</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="tu@correo.com"
                      className="h-11 rounded-xl"
                      required
                    />
                    {state.fieldErrors?.email ? (
                      <p className="text-destructive text-sm">{state.fieldErrors.email}</p>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensaje</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Contanos qué querés personalizar, para cuándo y qué cantidad"
                    className="min-h-[150px] rounded-xl"
                    required
                  />
                  {state.fieldErrors?.message ? (
                    <p className="text-destructive text-sm">{state.fieldErrors.message}</p>
                  ) : null}
                </div>

                {state.status === 'error' && state.message ? (
                  <p className="text-destructive text-sm">{state.message}</p>
                ) : null}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-full"
                  disabled={isPending}
                >
                  {isPending ? 'Enviando...' : 'Enviar mensaje'}
                </Button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </Section>
  );
}
