import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';
import { Container } from './container';

type SectionProps = {
  children: ReactNode;
  id?: string;
  className?: string;
  containerClassName?: string;
};

/**
 * Sin panel bordeado envolviendo el contenido: la referencia del cliente
 * (valencianoproducciones.com) no encierra cada sección en una caja: las
 * secciones fluyen directo sobre la página, con tinte de fondo cuando hace
 * falta separarlas (pasalo por `className`, ej. `bg-secondary/40`). Encerrar
 * todo en `rounded-3xl border` fue lo que hacía sentir el sitio como
 * plantilla corporativa genérica.
 */
export function Section({ children, id, className, containerClassName }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        // Sin `w-full`: un <section> es block por defecto y ya ocupa el
        // ancho disponible con `width: auto`, que sí resta los márgenes
        // horizontales del cálculo. `width: 100%` (w-full) no los resta, así
        // que sumado a `mx-3 md:mx-5` (categorías, testimonios) desbordaba
        // el ancho de la ventana en vez de quedar centrado con margen real.
        //
        // Menos padding vertical en móvil: con ~9 secciones apiladas, el
        // py-16 fijo original sumaba más de 1000px de aire puro antes de
        // llegar a cualquier contenido — "más información visible por
        // pantalla, no menos".
        'py-10 sm:py-16 md:py-24 lg:py-28',
        // La nav es sticky (top-3/top-5 + su propia altura): sin este
        // margen, un salto por ancla deja la sección tapada detrás de ella.
        id && 'scroll-mt-24 md:scroll-mt-28',
        className,
      )}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center space-y-2 pb-8 text-center sm:space-y-3 sm:pb-12',
        className,
      )}
    >
      {eyebrow ? (
        <span className="text-primary-text text-xs font-semibold tracking-wide uppercase sm:text-sm">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-2xl tracking-tight sm:text-4xl md:text-5xl">{title}</h2>
      {description ? (
        <p className="text-muted-foreground mx-auto max-w-[640px] text-base sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
