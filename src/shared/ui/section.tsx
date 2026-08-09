import type { ReactNode } from 'react';
import Balancer from 'react-wrap-balancer';
import { cn } from '@/shared/lib/cn';
import { Container } from './container';

type SectionProps = {
  children: ReactNode;
  id?: string;
  className?: string;
  containerClassName?: string;
};

/**
 * Sin panel bordeado envolviendo el contenido: las secciones fluyen directo
 * sobre la página, con tinte de fondo cuando hace falta separarlas (pasalo
 * por `className`, ej. `bg-secondary/40`).
 */
export function Section({ children, id, className, containerClassName }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        // Sin `w-full`: un <section> es block por defecto y ya ocupa el
        // ancho disponible con `width: auto`, que sí resta los márgenes
        // horizontales del cálculo. `width: 100%` (w-full) no los resta, así
        // que sumado a `mx-3 md:mx-5` desbordaba el ancho de la ventana.
        //
        // Menos padding vertical en móvil: con ~9 secciones apiladas, el
        // py-16 fijo original sumaba más de 1000px de aire puro antes de
        // llegar a cualquier contenido.
        'py-10 sm:py-16 md:py-24 lg:py-28',
        // La nav es sticky: sin este margen, un salto por ancla deja la
        // sección tapada detrás de ella.
        id && 'scroll-mt-24 md:scroll-mt-28',
        className,
      )}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

/**
 * Encabezado editorial: rótulo con línea, título grande y descripción en
 * su propia columna, con un espacio a la derecha para una acción.
 *
 * Alineado a la izquierda por defecto, a propósito. Todo el sitio tenía el
 * mismo bloque centrado (rótulo + título + descripción) repetido en seis
 * secciones seguidas, que es justo lo que hace que una página se sienta
 * armada con plantilla. `align="center"` queda disponible para las pocas
 * secciones donde centrar sí aporta.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  align?: 'center' | 'left';
  className?: string;
}) {
  const isCenter = align === 'center';

  return (
    <div
      className={cn(
        'pb-10 sm:pb-14',
        isCenter
          ? 'flex flex-col items-center text-center'
          : 'flex flex-col gap-6 md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <div className={cn(isCenter ? 'flex flex-col items-center' : 'max-w-[22ch]')}>
        {eyebrow ? (
          <span
            className={cn(
              'text-primary-text flex items-center gap-3 text-xs font-semibold tracking-[0.18em] uppercase',
              isCenter && 'justify-center',
            )}
          >
            {!isCenter ? <span className="bg-primary-text h-px w-8" aria-hidden /> : null}
            {eyebrow}
          </span>
        ) : null}

        <h2
          className={cn(
            'mt-4 text-3xl leading-[1.05] tracking-tight sm:text-4xl md:text-5xl lg:text-[3.5rem]',
            isCenter && 'max-w-[18ch]',
          )}
        >
          <Balancer>{title}</Balancer>
        </h2>
      </div>

      {description || action ? (
        <div
          className={cn(
            isCenter ? 'mt-4 flex flex-col items-center' : 'flex flex-col gap-5 md:max-w-[38ch]',
          )}
        >
          {description ? (
            <p className="text-muted-foreground text-base sm:text-lg">
              <Balancer>{description}</Balancer>
            </p>
          ) : null}
          {action}
        </div>
      ) : null}
    </div>
  );
}
