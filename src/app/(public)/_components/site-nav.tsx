'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronRight, Menu, X } from 'lucide-react';
import { buildWhatsAppUrl } from '@/shared/lib/whatsapp';
import { cn } from '@/shared/lib/cn';
import { Container } from '@/shared/ui/container';
import { Button } from '@/shared/ui/button';
import { WhatsAppIcon } from '@/shared/ui/whatsapp-icon';
import { QuoteListBadge } from '@/modules/quote-list/components/quote-list-badge';
import type { ContactSettingsInput } from '@/modules/content/schema';

const navigation = [
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
 * Reemplaza el header blanco a todo el ancho por una sola cápsula flotante
 * (idea visual de releaf.bio, secciones propias de Idealo) que queda pegada
 * arriba de la ventana al hacer scroll: el sitio necesita navegación
 * persistente para moverse entre catálogo y secciones, así que "flotante" es
 * también "sticky", no solo un adorno que aparece una vez arriba del Hero.
 */
export function SiteNav({ contact }: { contact: ContactSettingsInput }) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
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
          setActiveSection(visible[0]!.target.id);
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
    return pathname.startsWith(item.href);
  }

  return (
    <>
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-3 z-50 px-3 md:top-5 md:px-5"
      >
        <Container className="flex items-center">
          {/* Una sola cápsula (no dos separadas a los extremos): centrada,
              con los enlaces y las acciones dentro del mismo bloque, como en
              la referencia visual. */}
          <div className="bg-card/95 border-border/60 mx-auto hidden items-center gap-1 rounded-full border p-1.5 shadow-sm backdrop-blur-md lg:flex">
            <nav aria-label="Principal" className="flex items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors',
                    isActive(item)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="bg-border mx-1 h-6 w-px" aria-hidden />

            <QuoteListBadge />
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

          <div className="bg-card/95 border-border/60 ml-auto flex items-center gap-1 rounded-full border p-1.5 shadow-sm backdrop-blur-md lg:hidden">
            <QuoteListBadge />
            <button
              ref={menuTriggerRef}
              type="button"
              className="flex h-9 w-9 items-center justify-center"
              onClick={() => setIsMenuOpen(true)}
              aria-expanded={isMenuOpen}
              aria-controls="menu-movil"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menú</span>
            </button>
          </div>
        </Container>
      </motion.div>

      {isMenuOpen ? (
        <motion.div
          ref={menuPanelRef}
          id="menu-movil"
          role="dialog"
          aria-modal="true"
          aria-label="Menú principal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-background fixed inset-0 z-50 lg:hidden"
        >
          <Container className="flex h-16 items-center justify-between">
            <span className="text-sm font-semibold tracking-wide uppercase">Menú</span>
            <button ref={menuCloseRef} type="button" onClick={() => setIsMenuOpen(false)}>
              <X className="h-6 w-6" />
              <span className="sr-only">Cerrar menú</span>
            </button>
          </Container>

          <motion.nav
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            aria-label="Principal móvil"
            className="grid gap-3 px-4 pt-6 pb-8"
          >
            {navigation.map((item) => (
              <motion.div key={item.href} variants={itemFadeIn}>
                <Link
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'flex items-center justify-between rounded-2xl px-3 py-2 text-lg font-medium',
                    isActive(item) ? 'bg-primary text-primary-foreground' : 'hover:bg-accent',
                  )}
                >
                  {item.label}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ))}
            <motion.div variants={itemFadeIn} className="flex flex-col gap-3 pt-4">
              <Link href="/catalogo" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full rounded-full">
                  Ver catálogo
                </Button>
              </Link>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <Button variant="whatsapp" className="w-full gap-2 rounded-full">
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
