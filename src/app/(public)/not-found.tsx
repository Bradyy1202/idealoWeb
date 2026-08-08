import Link from 'next/link';
import { contact } from '@/shared/data/mock/site';
import { buildWhatsAppUrl } from '@/shared/lib/format-price';
import { buttonVariants } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';

const whatsappHref = buildWhatsAppUrl(
  contact.whatsapp,
  'Hola, buscaba algo en el sitio y no lo encontré.',
);

/**
 * Se activa cuando `notFound()` se llama desde una ruta DENTRO de (public)/
 * (ej. un producto que no existe): el layout con header y footer ya está
 * montado, así que este 404 es solo el cuerpo, sin logo propio como el de
 * src/app/not-found.tsx (ese es para URLs sin ninguna ruta coincidente,
 * donde ningún layout de (public)/ llega a montarse).
 */
export default function PublicNotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p data-numeral className="text-muted-foreground/40 font-display text-6xl sm:text-7xl">
        404
      </p>
      <h1 className="mt-4 max-w-[18ch] text-3xl font-bold tracking-tighter sm:text-4xl">
        No encontramos esta página.
      </h1>
      <p className="text-muted-foreground mt-4 max-w-[46ch] text-lg">
        Puede que el enlace esté mal escrito o que el producto ya no esté disponible. Volvé al
        catálogo o escribinos por WhatsApp si buscabas algo puntual.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link href="/catalogo" className={buttonVariants({ className: 'rounded-full' })}>
          Ver catálogo
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
