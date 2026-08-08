import Link from 'next/link';
import { buildWhatsAppUrl } from '@/shared/lib/whatsapp';
import { Container } from '@/shared/ui/container';
import { Button } from '@/shared/ui/button';
import { Logo } from '@/shared/ui/logo';
import type { ContactSettingsInput } from '@/modules/content/schema';

const navigation = [
  { label: 'Catálogo', href: '/catalogo' },
  { label: 'Cómo funciona', href: '/#como-funciona' },
  { label: 'Categorías', href: '/#categorias' },
  { label: 'Galería', href: '/#galeria' },
  { label: 'Testimonios', href: '/#testimonios' },
];

/** Formatea 50685097011 como +506 8509 7011. */
function formatPhone(raw: string) {
  const country = raw.slice(0, 3);
  const rest = raw.slice(3);
  return `+${country} ${rest.slice(0, 4)} ${rest.slice(4)}`;
}

export function SiteFooter({ contact }: { contact: ContactSettingsInput }) {
  const whatsappHref = buildWhatsAppUrl(contact.whatsapp, 'Hola, quiero más información.');

  return (
    <footer className="border-border border-t">
      <Container className="grid gap-10 py-14 lg:grid-cols-[1.4fr_1fr_1.2fr] lg:gap-16 lg:py-20">
        <div className="space-y-3">
          <Logo height={26} />
          <p className="text-muted-foreground max-w-[34ch] text-sm">
            Personalización por sublimación{contact.location ? ` en ${contact.location}` : ''}.
            Regalos, detalles y pedidos corporativos.
          </p>
        </div>

        <nav aria-label="Pie de página">
          <h2 className="text-muted-foreground text-sm font-medium">Navegación</h2>
          <ul className="mt-4 space-y-2">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-3">
          <h2 className="text-muted-foreground text-sm font-medium">Contacto</h2>
          <ul className="text-muted-foreground space-y-2 text-sm">
            {contact.location ? <li>{contact.location}</li> : null}
            {contact.schedule ? <li>{contact.schedule}</li> : null}
            <li>
              <a
                href={`mailto:${contact.email}`}
                className="hover:text-foreground transition-colors"
              >
                {contact.email}
              </a>
            </li>
          </ul>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
            <Button variant="whatsapp" size="sm" className="rounded-full">
              WhatsApp {formatPhone(contact.whatsapp)}
            </Button>
          </a>
        </div>
      </Container>

      <div className="border-border border-t">
        {/* md:pr-52: el botón flotante de WhatsApp es `fixed` sobre esta
            esquina; sin este margen tapa "La cotización final...". */}
        <Container className="text-muted-foreground flex flex-col items-center justify-between gap-1 py-6 text-xs md:h-16 md:flex-row md:py-0 md:pr-52">
          <p data-numeral>© {new Date().getFullYear()} Idealo. Todos los derechos reservados.</p>
          <p>Los precios son referenciales. La cotización final se confirma por WhatsApp.</p>
        </Container>
      </div>
    </footer>
  );
}
