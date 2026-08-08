'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Menu, X } from 'lucide-react';
import { buildWhatsAppUrl } from '@/shared/lib/whatsapp';
import { Container } from '@/shared/ui/container';
import { Button } from '@/shared/ui/button';
import { Logo } from '@/shared/ui/logo';
import { QuoteListBadge } from '@/modules/quote-list/components/quote-list-badge';
import type { ContactSettingsInput } from '@/modules/content/schema';

const navigation = [
  { label: 'Catálogo', href: '/catalogo' },
  { label: 'Cómo funciona', href: '/#como-funciona' },
  { label: 'Categorías', href: '/#categorias' },
  { label: 'Testimonios', href: '/#testimonios' },
  { label: 'Contacto', href: '/#contacto' },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemFadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function SiteHeader({ contact }: { contact: ContactSettingsInput }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const whatsappHref = buildWhatsAppUrl(
    contact.whatsapp,
    'Hola, quiero cotizar productos personalizados.',
  );

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`border-border bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur transition-shadow ${isScrolled ? 'shadow-md' : ''}`}
      >
        <Container className="flex h-16 items-center justify-between md:h-[72px]">
          <Link href="/" aria-label="Idealo, inicio">
            <Logo height={28} />
          </Link>

          <nav aria-label="Principal" className="hidden items-center gap-6 lg:flex">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <QuoteListBadge />
            <Link href="/catalogo">
              <Button variant="outline" size="sm" className="rounded-full">
                Ver catálogo
              </Button>
            </Link>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
              <Button variant="whatsapp" size="sm" className="rounded-full">
                Cotizar por WhatsApp
              </Button>
            </a>
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            <QuoteListBadge />
            <button
              type="button"
              className="flex"
              onClick={() => setIsMenuOpen(true)}
              aria-expanded={isMenuOpen}
              aria-controls="menu-movil"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Abrir menú</span>
            </button>
          </div>
        </Container>
      </motion.header>

      {isMenuOpen ? (
        <motion.div
          id="menu-movil"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-background fixed inset-0 z-50 lg:hidden"
        >
          <Container className="flex h-16 items-center justify-between">
            <Logo height={26} />
            <button type="button" onClick={() => setIsMenuOpen(false)}>
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
                  className="hover:bg-accent flex items-center justify-between rounded-2xl px-3 py-2 text-lg font-medium"
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
                <Button variant="whatsapp" className="w-full rounded-full">
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
