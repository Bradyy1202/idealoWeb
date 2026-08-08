'use client';

import { useActionState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone } from 'lucide-react';
import { contact } from '@/shared/data/mock/site';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import { Section } from '@/shared/ui/section';
import { submitContactFormAction, type ContactFormState } from '@/modules/inquiries/actions';

const initialState: ContactFormState = { status: 'idle' };

/** Formatea 50685097011 como +506 8509 7011. */
function formatPhone(raw: string) {
  const country = raw.slice(0, 3);
  const rest = raw.slice(3);
  return `+${country} ${rest.slice(0, 4)} ${rest.slice(4)}`;
}

const contactPoints = [
  { icon: MapPin, label: 'Ubicación', value: contact.location },
  { icon: Mail, label: 'Correo', value: contact.email },
  { icon: Phone, label: 'WhatsApp', value: formatPhone(contact.whatsapp), numeral: true },
];

export function ContactSection() {
  const [state, formAction, isPending] = useActionState(submitContactFormAction, initialState);

  return (
    <Section id="contacto" className="overflow-hidden">
      <div className="grid items-center gap-8 py-4 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <span className="text-primary text-sm font-semibold tracking-wide uppercase">
            Contacto
          </span>
          <h2 className="text-3xl tracking-tight md:text-4xl">Trabajemos juntos</h2>
          <p className="text-muted-foreground max-w-[600px] text-lg">
            ¿Listo para tu próximo pedido? Escribinos y te ayudamos a convertir tu idea en un
            producto real.
          </p>

          <div className="mt-8 space-y-4">
            {contactPoints.map((point) => (
              <motion.div
                key={point.label}
                whileHover={{ x: 4 }}
                className="flex items-center gap-3"
              >
                <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl">
                  <point.icon className="text-primary h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">{point.label}</h3>
                  <p
                    data-numeral={point.numeral || undefined}
                    className="text-muted-foreground text-sm"
                  >
                    {point.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="border-border bg-card rounded-2xl border p-6"
        >
          <h3 className="text-xl font-semibold">Envianos un mensaje</h3>

          {state.status === 'success' ? (
            <div className="bg-secondary/40 mt-6 rounded-2xl p-6 text-center">
              <p className="font-semibold">¡Listo, recibimos tu mensaje!</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Te contactamos a la brevedad. Si es urgente, escribinos directo por WhatsApp.
              </p>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground text-sm">
                Completá el formulario y te contactamos a la brevedad.
              </p>
              <form action={formAction} className="mt-6 space-y-4">
                {/* Honeypot (tarea 3.7): invisible para personas, un bot que autocompleta todo lo llena. */}
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <label htmlFor="website">No completar este campo</label>
                  <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Tu nombre completo"
                    className="rounded-xl"
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
                    className="rounded-xl"
                    required
                  />
                  {state.fieldErrors?.email ? (
                    <p className="text-destructive text-sm">{state.fieldErrors.email}</p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensaje</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Contanos qué querés personalizar"
                    className="min-h-[120px] rounded-xl"
                    required
                  />
                  {state.fieldErrors?.message ? (
                    <p className="text-destructive text-sm">{state.fieldErrors.message}</p>
                  ) : null}
                </div>

                {state.status === 'error' && state.message ? (
                  <p className="text-destructive text-sm">{state.message}</p>
                ) : null}

                <Button type="submit" className="w-full rounded-full" disabled={isPending}>
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
