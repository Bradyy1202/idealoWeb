'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { buildWhatsAppUrl } from '@/shared/lib/whatsapp';
import { cn } from '@/shared/lib/cn';
import { Container } from '@/shared/ui/container';
import { WhatsAppIcon } from '@/shared/ui/whatsapp-icon';
import { QuoteListBadge } from '@/modules/quote-list/components/quote-list-badge';
import type { ContactSettingsInput } from '@/modules/content/schema';

const navigation = [
  { label: 'Inicio', href: '/', sectionId: null },
  { label: 'Catálogo', href: '/catalogo', sectionId: null },
  { label: 'Cómo funciona', href: '/#como-funciona', sectionId: 'como-funciona' },
  { label: 'Categorías', href: '/#categorias', sectionId: 'categorias' },
  { label: 'Testimonios', href: '/#testimonios', sectionId: 'testimonios' },
  { label: 'Contacto', href: '/#contacto', sectionId: 'contacto' },
];

/**
 * Cápsula compacta: en reposo solo muestra el rótulo "Menú" y la sección
 * donde está parada la persona. Se despliega al pasar el mouse (escritorio)
 * o al tocarla (móvil y cualquier pantalla táctil), y se cierra sola al
 * salir, al elegir un enlace, con Escape o al tocar fuera.
 *
 * El despliegue anima el ancho del bloque oscuro, no su visibilidad: así los
 * enlaces salen "de adentro" de la píldora en vez de aparecer de golpe.
 */
export function SiteNav({ contact }: { contact: ContactSettingsInput }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  // Se guarda junto con la ruta donde se observó: al navegar a una página sin
  // esas secciones (una ficha de producto, por ejemplo) el valor se descarta
  // al derivarlo, en vez de limpiarlo con otro setState dentro del efecto.
  const [observed, setObserved] = useState<{ path: string; id: string } | null>(null);
  const activeSection = observed?.path === pathname ? observed.id : null;
  const shellRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const whatsappHref = buildWhatsAppUrl(
    contact.whatsapp,
    'Hola, quiero cotizar productos personalizados.',
  );

  // Resalta la sección visible mientras se hace scroll en la portada. En
  // /catalogo y otras rutas no hay secciones con esos ids, así que
  // activeSection queda en null y solo "Catálogo" se marca por ruta.
  useEffect(() => {
    const elements = navigation
      .map((item) => item.sectionId)
      .filter((id): id is string => id !== null)
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    // Mientras ninguna sección esté en la banda central se conserva la
    // última: al final de la página la banda cae sobre el pie, y limpiarla
    // ahí devolvía el rótulo a "Inicio" estando abajo del todo.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          setObserved({ path: pathname, id: visible[0]!.target.id });
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    elements.forEach((el) => observer.observe(el));

    // Arriba del todo sí se limpia: ahí la sección correcta es "Inicio", y
    // el observador solo no alcanza porque al volver al tope no entra
    // ninguna sección nueva que dispare el callback.
    const onScroll = () => {
      if (window.scrollY < 80) setObserved(null);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [pathname]);

  // Escape y clic fuera cierran. Sin esto, en táctil la píldora se quedaba
  // abierta para siempre: no hay evento de "salió el mouse" que la cierre.
  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }
    function onPointerDown(event: PointerEvent) {
      if (!shellRef.current?.contains(event.target as Node)) setIsOpen(false);
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  /** Margen de gracia al salir: evita que se cierre al cruzar de un enlace a otro. */
  function scheduleClose() {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setIsOpen(false), 220);
  }

  function cancelClose() {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }

  function isActive(item: (typeof navigation)[number]) {
    if (item.sectionId) return activeSection === item.sectionId;
    // "Inicio" solo se enciende arriba de la portada: `startsWith('/')` sería
    // verdadero en todas las rutas, y bajando por las secciones el activo
    // pasa a ser la sección en pantalla.
    if (item.href === '/') return pathname === '/' && activeSection === null;
    return pathname.startsWith(item.href);
  }

  // Las fichas de producto se cuentan como catálogo: es de donde se llega y
  // a donde se vuelve.
  const activeItem = navigation.find(isActive);
  const currentLabel =
    activeItem?.label ??
    (pathname.startsWith('/producto')
      ? 'Catálogo'
      : pathname.startsWith('/lista-de-cotizacion')
        ? 'Cotización'
        : 'Inicio');

  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-3 z-50 px-3 md:top-5 md:px-5"
    >
      <Container className="flex justify-center">
        <div
          ref={shellRef}
          onMouseEnter={() => {
            cancelClose();
            setIsOpen(true);
          }}
          onMouseLeave={scheduleClose}
          className="bg-card border-border/60 flex items-center gap-1 rounded-full border p-1.5 shadow-md"
        >
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            aria-controls="nav-principal"
            className="hover:bg-accent rounded-full px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors sm:px-4"
          >
            Menú
            <span className="sr-only"> de navegación</span>
          </button>

          <div className="bg-ink flex items-center rounded-full p-1">
            {/* Rótulo en reposo. Sale de la maqueta al abrir (position:
                absolute) para que el ancho lo definan los enlaces. */}
            <AnimatePresence initial={false}>
              {!isOpen ? (
                <motion.span
                  key="current"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, position: 'absolute' }}
                  transition={{ duration: 0.15 }}
                  className="px-3 py-1.5 text-sm font-medium whitespace-nowrap text-white sm:px-4"
                >
                  {currentLabel}
                </motion.span>
              ) : null}
            </AnimatePresence>

            <motion.nav
              id="nav-principal"
              aria-label="Principal"
              initial={false}
              animate={{ width: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
              transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
              className="flex items-center overflow-hidden"
              // inert mientras está cerrada: sin esto los enlaces invisibles
              // siguen siendo tabulables y el foco desaparece de la pantalla.
              inert={!isOpen}
            >
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  aria-current={isActive(item) ? 'page' : undefined}
                  // El activo lleva fondo propio, no solo texto blanco: el
                  // hover también pone el texto en blanco, y al expandirse la
                  // píldora queda un enlace cualquiera bajo el cursor, que se
                  // leía como "estás acá" sin estarlo.
                  className={cn(
                    'rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
                    isActive(item) ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white/90',
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </motion.nav>
          </div>

          <QuoteListBadge />

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Cotizar por WhatsApp"
            className="bg-whatsapp text-whatsapp-foreground flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-semibold transition-transform hover:scale-105"
          >
            <WhatsAppIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Cotizar</span>
          </a>
        </div>
      </Container>
    </motion.div>
  );
}
