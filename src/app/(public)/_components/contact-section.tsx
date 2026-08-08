'use client';

import { type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone } from 'lucide-react';
import { contact } from '@/shared/data/mock/site';
import { buildWhatsAppUrl } from '@/shared/lib/format-price';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import { Section } from '@/shared/ui/section';

/** Formatea 50685097011 como +506 8509 7011. */
function formatPhone(raw: string) {
  const country = raw.slice(0, 3);
  const rest = raw.slice(3);
  return `+${country} ${rest.slice(0, 4)} ${rest.slice(4)}`;
}

/**
 * No hay backend de formularios todavía (eso es la tarea 3.5, con Zod y
 * Server Action). En vez de simular un envío que no llega a ningún lado,
 * el formulario arma el mensaje y abre WhatsApp — la única conversión real
 * disponible hoy.
 */
function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const name = `${data.get('first-name') ?? ''} ${data.get('last-name') ?? ''}`.trim();
  const email = data.get('email');
  const message = data.get('message');

  const lines = [
    name ? `Hola, soy ${name}.` : 'Hola.',
    message ? String(message) : '',
    email ? `Mi correo: ${email}` : '',
  ].filter(Boolean);

  window.open(buildWhatsAppUrl(contact.whatsapp, lines.join(' ')), '_blank', 'noopener,noreferrer');
}

const contactPoints = [
  { icon: MapPin, label: 'Ubicación', value: contact.location },
  { icon: Mail, label: 'Correo', value: contact.email },
  { icon: Phone, label: 'WhatsApp', value: formatPhone(contact.whatsapp), numeral: true },
];

export function ContactSection() {
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
          <p className="text-muted-foreground text-sm">
            Completá el formulario y se abre WhatsApp con tu mensaje ya armado.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first-name">Nombre</Label>
                <Input
                  id="first-name"
                  name="first-name"
                  placeholder="Tu nombre"
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Apellido</Label>
                <Input
                  id="last-name"
                  name="last-name"
                  placeholder="Tu apellido"
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@correo.com"
                className="rounded-xl"
              />
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
            </div>
            <Button type="submit" variant="whatsapp" className="w-full rounded-full">
              Enviar por WhatsApp
            </Button>
          </form>
        </motion.div>
      </div>
    </Section>
  );
}
