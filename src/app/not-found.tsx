import Link from 'next/link';
import { contact } from '@/shared/data/mock/site';
import { buildWhatsAppUrl } from '@/shared/lib/whatsapp';
import { buttonVariants } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { Logo } from '@/shared/ui/logo';

const whatsappHref = buildWhatsAppUrl(
  contact.whatsapp,
  'Hola, buscaba algo en el sitio y no lo encontré.',
);

/**
 * Página raíz de Next.js: captura cualquier URL sin ruta coincidente. Vive
 * fuera de `(public)/`, así que no reusa header/footer (Next no monta el
 * árbol de un route group cuando no hay ruta que resolver) — se arma
 * standalone con el mismo sistema de diseño.
 */
export default function NotFound() {
  return (
    <Container className="relative flex min-h-[100dvh] flex-col justify-center py-20">
      <Link href="/" className="absolute top-6 left-5 md:top-8">
        <Logo height={26} />
      </Link>

      <p data-numeral className="text-muted-foreground/40 font-display text-6xl sm:text-7xl">
        404
      </p>
      <h1 className="mt-4 max-w-[18ch] text-3xl font-bold tracking-tighter sm:text-4xl">
        Esta página no existe.
      </h1>
      <p className="text-muted-foreground mt-4 max-w-[46ch] text-lg">
        Puede que el enlace esté mal escrito o que el producto ya no esté disponible. Volvé al
        inicio o escribinos por WhatsApp si buscabas algo puntual.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link href="/" className={buttonVariants({ className: 'rounded-full' })}>
          Volver al inicio
        </Link>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: 'whatsapp', className: 'rounded-full' })}
        >
          Escribir por WhatsApp
        </a>
      </div>
    </Container>
  );
}
