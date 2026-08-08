import { ChevronDown } from 'lucide-react';
import { faqs } from '@/shared/data/mock/site';
import { Section, SectionHeading } from '@/shared/ui/section';

/**
 * `<details>` nativo: acordeón accesible por teclado y lector de pantalla sin
 * JavaScript ni límite de cliente. El ícono gira con el atributo `open` del
 * propio elemento, sin estado en React.
 */
export function FaqSection() {
  return (
    <Section>
      <SectionHeading eyebrow="Ayuda" title="Preguntas frecuentes" />

      <div className="divide-border border-border mx-auto max-w-3xl divide-y border-t border-b pb-10">
        {faqs.map((item) => (
          <details key={item.question} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="text-base font-semibold">{item.question}</span>
              <ChevronDown
                aria-hidden
                size={20}
                strokeWidth={2}
                className="text-muted-foreground shrink-0 transition-transform duration-200 ease-out group-open:rotate-180"
              />
            </summary>
            <p className="text-muted-foreground mt-4 max-w-[64ch] text-sm">{item.answer}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
