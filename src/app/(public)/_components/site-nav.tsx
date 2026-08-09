'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronRight, X } from 'lucide-react';
import { buildWhatsAppUrl } from '@/shared/lib/whatsapp';
import { cn } from '@/shared/lib/cn';
import { Container } from '@/shared/ui/container';
import { Button } from '@/shared/ui/button';
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

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemFadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/**
 * Cápsula flotante centrada arriba de la ventana, calcada de la referencia:
 * una carcasa crema que arranca con el botón "Menú" y, pegado a la derecha,
 * un bloque oscuro con los enlaces, donde la sección actual va en blanco y
 * el resto en blanco atenuado (verificado a 5.8:1 sobre `--ink`, por encima
 * del mínimo AA de 4.5:1).
 *
 * "Menú" es un botón real en todos los tamaños, no un rótulo decorativo:
 * abre el panel completo. En móvil ese panel es la única navegación y el
 * bloque oscuro se reduce a mostrar dónde está parada la persona.
 */
export function SiteNav({ contact }: { contact: ContactSettingsInput }) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Guarda junto con la ruta donde se observó: al navegar a una página sin
  // esas secciones (una ficha de producto, por ejemplo) el valor se descarta
  // al derivarlo, en vez de limpiarlo con otro setState dentro del efecto.
  const [observed, setObserved] = useState<{ path: string; id: string } | null>(null);
  const activeSection = observed?.path === pathname ? observed.id : null;
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const menuCloseRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const wasMenuOpenRef = useRef(false);
  const whatsappHref = buildWhatsAppUrl(
    contact.whatsapp,
    'Hola, quiero cotizar productos personalizados.',
  );

  // Resalta la sección visible mientras se hace scroll en la portada. En
  // /catalogo y otras rutas simplemente no hay secciones con esos ids, así
  // que activeSection se queda en null y solo "Catálogo" se marca por ruta.
  useEffect(() => {
    const sectionIds = navigation
      .map((item) => item.sectionId)
      .filter((id): id is string => id !== null);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

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
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (isMenuOpen) {
      wasMenuOpenRef.current = true;
      document.body.style.overflow = 'hidden';
      menuCloseRef.current?.focus();
    } else if (wasMenuOpenRef.current) {
      wasMenuOpenRef.current = false;
      document.body.style.overflow = '';
      menuTriggerRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        return;
      }
      if (event.key !== 'Tab' || !menuPanelRef.current) return;

      const focusable = menuPanelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  function isActive(item: (typeof navigation)[number]) {
    if (item.sectionId) return activeSection === item.sectionId;
    // "Inicio" solo se enciende arriba de la portada: `startsWith('/')` sería
    // verdadero en todas las rutas, y bajando por las secciones el activo
    // pasa a ser la sección en pantalla.
    if (item.href === '/') return pathname === '/' && activeSection === null;
    return pathname.startsWith(item.href);
  }

  // Rótulo del bloque oscuro en móvil, donde no caben los seis enlaces: dice
  // dónde está parada la persona. Las fichas de producto se cuentan como
  // catálogo (es de donde se llega y a donde se vuelve).
  const activeItem = navigation.find(isActive);
  const currentLabel =
    activeItem?.label ??
    (pathname.startsWith('/producto')
      ? 'Catálogo'
      : pathname.startsWith('/lista-de-cotizacion')
        ? 'Cotización'
        : 'Inicio');

  return (
    <>
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-3 z-50 px-3 md:top-5 md:px-5"
      >
        <Container className="flex justify-center">
          <div className="bg-card border-border/60 flex items-center gap-1 rounded-full border p-1.5 shadow-md">
            <button
              ref={menuTriggerRef}
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-expanded={isMenuOpen}
              aria-controls="menu-principal"
              className="hover:bg-accent rounded-full px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors sm:px-4"
            >
              Menú
            </button>

            <div className="bg-ink flex items-center rounded-full p-1">
              <nav aria-label="Principal" className="hidden items-center lg:flex">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive(item) ? 'page' : undefined}
                    className={cn(
                      'rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
                      isActive(item) ? 'text-white' : 'text-white/60 hover:text-white',
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <span className="px-3 py-1.5 text-sm font-medium whitespace-nowrap text-white sm:px-4 lg:hidden">
                {currentLabel}
              </span>
            </div>

            <QuoteListBadge />

            <div className="hidden items-center gap-1.5 lg:flex">
              <Link href="/catalogo">
                <Button variant="outline" size="sm" className="rounded-full">
                  Ver catálogo
                </Button>
              </Link>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <Button variant="whatsapp" size="sm" className="gap-1.5 rounded-full">
                  <WhatsAppIcon className="h-4 w-4" />
                  Cotizar
                </Button>
              </a>
            </div>
          </div>
        </Container>
      </motion.div>

      {isMenuOpen ? (
        <motion.div
          ref={menuPanelRef}
          id="menu-principal"
          role="dialog"
          aria-modal="true"
          aria-label="Menú principal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-background fixed inset-0 z-50 overflow-y-auto"
        >
          <Container className="flex h-16 items-center justify-between md:h-20">
            <span className="text-sm font-semibold tracking-wide uppercase">Menú</span>
            <button
              ref={menuCloseRef}
              type="button"
              onClick={() => setIsMenuOpen(false)}
              className="hover:bg-accent rounded-full p-2 transition-colors"
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Cerrar menú</span>
            </button>
          </Container>

          <motion.nav
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            aria-label="Menú completo"
            className="mx-auto grid max-w-2xl gap-2 px-5 pt-6 pb-10 md:gap-3 md:px-8 md:pt-12"
          >
            {navigation.map((item) => (
              <motion.div key={item.href} variants={itemFadeIn}>
                <Link
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'flex items-center justify-between rounded-2xl px-4 py-3 text-xl font-semibold transition-colors md:text-3xl',
                    isActive(item) ? 'bg-ink text-ink-foreground' : 'hover:bg-accent',
                  )}
                >
                  {item.label}
                  <ChevronRight className="h-5 w-5 shrink-0" />
                </Link>
              </motion.div>
            ))}
            <motion.div
              variants={itemFadeIn}
              className="flex flex-col gap-3 pt-6 sm:flex-row sm:justify-center"
            >
              <Link href="/catalogo" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" size="lg" className="w-full rounded-full sm:w-auto">
                  Ver catálogo
                </Button>
              </Link>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="whatsapp"
                  size="lg"
                  className="w-full gap-2 rounded-full sm:w-auto"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Cotizar por WhatsApp
                </Button>
              </a>
            </motion.div>
          </motion.nav>
        </motion.div>
      ) : null}
    </>
  );
}
