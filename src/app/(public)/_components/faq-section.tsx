import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Section } from '@/shared/ui/section';
import { WhatsAppIcon } from '@/shared/ui/whatsapp-icon';
import { buildWhatsAppUrl } from '@/shared/lib/whatsapp';
import type { FaqItem } from '@/modules/content/service';

/**
 * `<details>` nativo: acordeón accesible por teclado y lector de pantalla
 * sin JavaScript ni límite de cliente. El estado abierto lo lleva el propio
 * elemento, así que todo el resaltado sale de `group-open`.
 *
 * Las preguntas van numeradas y agrupadas por categoría real (`item.category`
 * ya viene de la base), y la columna izquierda cierra con una salida a
 * WhatsApp: la duda que no está en la lista es justo donde se pierde una
 * conversión, y antes esa columna solo tenía un párrafo.
 */
export function FaqSection({ faqs, whatsapp }: { faqs: FaqItem[]; whatsapp: string }) {
  if (faqs.length === 0) return null;

  const whatsappHref = buildWhatsAppUrl(whatsapp, 'Hola, tengo una consulta sobre un pedido.');

  return (
    <Section id="preguntas" className="bg-secondary/50">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <span className="text-primary-text flex items-center gap-3 text-xs font-semibold tracking-[0.18em] uppercase">
            <span className="bg-primary-text h-px w-8" aria-hidden />
            Ayuda
          </span>
          <h2 className="mt-4 text-3xl leading-[1.05] tracking-tight sm:text-4xl md:text-5xl">
            Preguntas frecuentes
          </h2>
          <p className="text-muted-foreground mt-4 max-w-[34ch]">
            Lo que más nos consultan sobre diseños, tiempos y envíos.
          </p>

          <div className="border-border/70 bg-card mt-8 rounded-2xl border p-5 sm:rounded-[1.75rem] sm:p-6">
            <p className="font-semibold">¿No está tu pregunta?</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Escribinos y te respondemos el mismo día hábil.
            </p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-whatsapp text-whatsapp-foreground mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-transform hover:scale-105"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Preguntar por WhatsApp
            </a>
          </div>
        </div>

        <ol className="flex flex-col gap-2">
          {faqs.map((item, index) => (
            <li key={item.id}>
              <details className="group border-border/70 bg-card open:border-primary/40 rounded-2xl border transition-colors open:shadow-[0_18px_40px_-28px_rgba(23,34,15,0.5)] sm:rounded-[1.5rem]">
                <summary className="flex cursor-pointer list-none items-start gap-4 p-5 marker:content-none sm:p-6 [&::-webkit-details-marker]:hidden">
                  <span
                    data-numeral
                    className="text-muted-foreground group-open:text-primary-text mt-0.5 text-xs font-semibold transition-colors"
                    aria-hidden
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <span className="flex-1">
                    <span className="block text-base font-semibold sm:text-lg">
                      {item.question}
                    </span>
                    <span className="text-muted-foreground mt-1 block text-[0.7rem] tracking-[0.14em] uppercase">
                      {item.category}
                    </span>
                  </span>

                  <span
                    aria-hidden
                    className="border-border text-muted-foreground group-hover:border-primary group-hover:text-primary group-open:bg-primary group-open:border-primary group-open:text-primary-foreground mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 group-open:rotate-45"
                  >
                    <Plus className="h-4 w-4" />
                  </span>
                </summary>

                <p className="text-muted-foreground max-w-[62ch] px-5 pb-5 pl-[3.4rem] text-sm leading-relaxed sm:px-6 sm:pb-6 sm:pl-[3.9rem] sm:text-base">
                  {item.answer}
                </p>
              </details>
            </li>
          ))}
        </ol>
      </div>

      <p className="text-muted-foreground mt-10 text-sm">
        También podés{' '}
        <Link
          href="/catalogo"
          className="text-primary-text font-medium underline-offset-4 hover:underline"
        >
          ver el catálogo completo
        </Link>{' '}
        y consultarnos sobre un producto puntual.
      </p>
    </Section>
  );
}
