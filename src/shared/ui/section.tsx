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
        'w-full py-16 md:py-24 lg:py-28',
        // El header es sticky (64px / 72px desde md): sin este margen, un
        // salto por ancla deja la sección tapada detrás de la barra.
        id && 'scroll-mt-20 md:scroll-mt-24',
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
    <div className={cn('flex flex-col items-center space-y-3 pb-12 text-center', className)}>
      {eyebrow ? (
        <span className="text-primary text-sm font-semibold tracking-wide uppercase">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-3xl tracking-tight sm:text-4xl md:text-5xl">{title}</h2>
      {description ? (
        <p className="text-muted-foreground mx-auto max-w-[640px] text-lg">{description}</p>
      ) : null}
    </div>
  );
}
