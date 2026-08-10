import Link from 'next/link';
import { Clock, Facebook, Instagram, Mail, MapPin } from 'lucide-react';
import { buildWhatsAppUrl } from '@/shared/lib/whatsapp';
import { Container } from '@/shared/ui/container';
import { Logo } from '@/shared/ui/logo';
import { WhatsAppIcon } from '@/shared/ui/whatsapp-icon';
import type { ContactSettingsInput } from '@/modules/content/schema';

const navigation = [
  { label: 'Catálogo', href: '/catalogo' },
  { label: 'Cómo funciona', href: '/#como-funciona' },
  { label: 'Categorías', href: '/#categorias' },
  { label: 'Testimonios', href: '/#testimonios' },
  { label: 'Contacto', href: '/#contacto' },
];

const help = [
  { label: 'Preguntas frecuentes', href: '/#preguntas' },
  { label: 'Lista de cotización', href: '/lista-de-cotizacion' },
  { label: 'Quiénes somos', href: '/#quienes-somos' },
];

/** Formatea 50685097011 como +506 8509 7011. */
function formatPhone(raw: string) {
  const country = raw.slice(0, 3);
  const rest = raw.slice(3);
  return `+${country} ${rest.slice(0, 4)} ${rest.slice(4)}`;
}

/**
 * Cierre oscuro con cuatro columnas, línea divisoria, redes a la izquierda y
 * el nombre de la marca en contorno ocupando todo el ancho abajo.
 *
 * El nombre gigante va como `<svg><text>` con `stroke` y sin relleno, no
 * como texto normal: para que ocupe el ancho completo en cualquier pantalla
 * hace falta que escale con `viewBox`, y ningún tamaño en `rem` da eso. Va
 * `aria-hidden` porque es la misma marca que ya anuncia el logo de arriba;
 * repetirla haría que un lector de pantalla la lea dos veces.
 *
 * Las redes solo aparecen si están cargadas en el panel: `instagram` y
 * `facebook` son campos opcionales de `SiteSetting` y hoy pueden venir
 * vacíos.
 */
export function SiteFooter({ contact }: { contact: ContactSettingsInput }) {
  const whatsappHref = buildWhatsAppUrl(contact.whatsapp, 'Hola, quiero más información.');

  const socials = [
    ...(contact.instagram
      ? [{ label: 'Instagram', href: contact.instagram, icon: Instagram }]
      : []),
    ...(contact.facebook ? [{ label: 'Facebook', href: contact.facebook, icon: Facebook }] : []),
  ];

  return (
    <footer className="relative z-10 px-3 pb-3 md:px-5 md:pb-5">
      <div className="bg-navy text-navy-foreground relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem]">
        <Container className="relative grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-12 lg:py-20">
          <div className="space-y-4">
            <Logo height={26} variant="light" />
            <p className="max-w-[32ch] text-sm text-white/70">
              Personalización por sublimación{contact.location ? ` en ${contact.location}` : ''}.
              Regalos, detalles y pedidos corporativos.
            </p>
          </div>

          <nav aria-label="Navegación del pie">
            <h2 className="text-sm font-semibold">Navegación</h2>
            <ul className="mt-5 space-y-3">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Enlaces de ayuda">
            <h2 className="text-sm font-semibold">Ayuda</h2>
            <ul className="mt-5 space-y-3">
              {help.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold">Contacto</h2>
            <ul className="mt-5 space-y-3.5 text-sm text-white/70">
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-start gap-3 transition-colors hover:text-white"
                >
                  <Mail className="text-sky mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  {contact.email}
                </a>
              </li>
              <li>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 transition-colors hover:text-white"
                >
                  <WhatsAppIcon className="text-sky mt-0.5 h-4 w-4 shrink-0" />
                  <span data-numeral>{formatPhone(contact.whatsapp)}</span>
                </a>
              </li>
              {contact.location ? (
                <li className="flex items-start gap-3">
                  <MapPin className="text-sky mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  {contact.location}
                </li>
              ) : null}
              {contact.schedule ? (
                <li className="flex items-start gap-3">
                  <Clock className="text-sky mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  {contact.schedule}
                </li>
              ) : null}
            </ul>
          </div>
        </Container>

        <Container className="relative">
          <div className="flex flex-col gap-5 border-t border-white/15 py-6 sm:flex-row sm:items-center sm:justify-between">
            {socials.length > 0 ? (
              <ul className="flex items-center gap-2">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-white/50 hover:text-white"
                    >
                      <social.icon className="h-4 w-4" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <span />
            )}

            {/* Ambas líneas acá arriba, no debajo de la marca gigante: ahí
                el texto quedaba encima del trazo y no se leía ninguno. */}
            <div className="text-xs text-white/60 sm:text-right">
              <p data-numeral>© {new Date().getFullYear()} Idealo. Envíos a todo Costa Rica.</p>
              <p className="mt-1 text-white/60">
                Los precios son referenciales. La cotización final se confirma por WhatsApp.
              </p>
            </div>
          </div>
        </Container>

        {/* Marca en contorno cerrando el bloque, a todo el ancho. */}
        <svg
          viewBox="0 0 1000 190"
          preserveAspectRatio="xMidYMax meet"
          className="relative block h-auto w-full px-4 pb-2 select-none md:px-8"
          aria-hidden
        >
          <text
            x="500"
            y="170"
            textAnchor="middle"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            className="text-sky"
            style={{
              fontSize: '190px',
              fontWeight: 800,
              letterSpacing: '0.02em',
              fontFamily: 'var(--font-display)',
            }}
          >
            IDEALO
          </text>
        </svg>
      </div>
    </footer>
  );
}
