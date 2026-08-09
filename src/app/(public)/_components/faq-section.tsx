import { Plus } from 'lucide-react';
import { Section } from '@/shared/ui/section';
import type { FaqItem } from '@/modules/content/service';

/**
 * `<details>` nativo: acordeón accesible por teclado y lector de pantalla sin
 * JavaScript ni límite de cliente. El ícono gira con el atributo `open` del
 * propio elemento, sin estado en React.
 *
 * Encabezado a la izquierda y pegajoso mientras se recorren las preguntas:
 * la sección deja de ser un bloque centrado más y usa el ancho de la
 * pantalla, que es donde estaba el problema del diseño anterior.
 */
export function FaqSection({ faqs }: { faqs: FaqItem[] }) {
  if (faqs.length === 0) return null;

  return (
    <Section className="bg-secondary/50">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <span className="text-primary-text flex items-center gap-3 text-xs font-semibold tracking-[0.18em] uppercase">
            <span className="bg-primary-text h-px w-8" aria-hidden />
            Ayuda
          </span>
          <h2 className="mt-4 text-3xl leading-[1.05] tracking-tight sm:text-4xl md:text-5xl">
            Preguntas frecuentes
          </h2>
          <p className="text-muted-foreground mt-4 max-w-[34ch]">
            Si no encontrás lo que buscabas, escribinos por WhatsApp y te respondemos el mismo día
            hábil.
          </p>
        </div>

        <div className="divide-border/70 border-border/70 divide-y border-t">
          {faqs.map((item) => (
            <details key={item.id} className="group">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="text-base font-semibold sm:text-lg">{item.question}</span>
                <span
                  aria-hidden
                  className="border-border text-muted-foreground group-hover:border-primary-text group-hover:text-primary-text mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 group-open:rotate-45"
                >
                  <Plus className="h-4 w-4" />
                </span>
              </summary>
              <p className="text-muted-foreground max-w-[62ch] pb-6 text-sm leading-relaxed sm:text-base">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}
