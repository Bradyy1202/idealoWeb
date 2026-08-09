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

/**
 * Bloque de cierre en coral quemado a página completa, como el footer real
 * de releaf.bio — no una franja gris con borde superior. Líneas finas
 * radiales de fondo como decoración, igual que las de la referencia.
 */
export function SiteFooter({ contact }: { contact: ContactSettingsInput }) {
  const whatsappHref = buildWhatsAppUrl(contact.whatsapp, 'Hola, quiero más información.');

  return (
    <footer className="px-3 pb-3 md:px-5 md:pb-5">
      <div className="bg-coral text-coral-foreground relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem]">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-25"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          <g stroke="currentColor" strokeWidth="0.15" fill="none">
            <path d="M0 55 Q 50 5 100 30" />
            <path d="M0 70 Q 50 30 100 55" />
            <path d="M15 100 Q 45 40 55 0" />
            <path d="M45 100 Q 60 50 85 0" />
          </g>
        </svg>

        <Container className="relative grid gap-10 py-14 lg:grid-cols-[1.3fr_1fr_1.2fr] lg:gap-16 lg:py-20">
          <div className="space-y-4">
            <Logo height={26} variant="light" />
            <p className="max-w-[34ch] text-sm text-white/80">
              Personalización por sublimación{contact.location ? ` en ${contact.location}` : ''}.
              Regalos, detalles y pedidos corporativos.
            </p>
          </div>

          <nav aria-label="Pie de página">
            <h2 className="text-sm font-medium text-white/70">Navegación</h2>
            <ul className="mt-4 space-y-3">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-xl font-semibold text-white/90 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-3">
            <h2 className="text-sm font-medium text-white/70">Contacto</h2>
            <ul className="space-y-2 text-sm text-white/85">
              {contact.location ? <li>{contact.location}</li> : null}
              {contact.schedule ? <li>{contact.schedule}</li> : null}
              <li>
                <a href={`mailto:${contact.email}`} className="transition-colors hover:text-white">
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

        <div className="relative border-t border-white/15">
          {/* md:pr-52: el botón flotante de WhatsApp es `fixed` sobre esta
              esquina; sin este margen tapa "La cotización final...". */}
          <Container className="flex flex-col items-center justify-between gap-1 py-6 text-xs text-white/70 md:h-16 md:flex-row md:py-0 md:pr-52">
            <p data-numeral>© {new Date().getFullYear()} Idealo. Todos los derechos reservados.</p>
            <p>Los precios son referenciales. La cotización final se confirma por WhatsApp.</p>
          </Container>
        </div>
      </div>
    </footer>
  );
}
