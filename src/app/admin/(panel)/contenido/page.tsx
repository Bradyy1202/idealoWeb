import Link from 'next/link';
import type { Metadata } from 'next';
import { HelpCircle, Image as ImageIcon, Settings, Star } from 'lucide-react';
import {
  getFaqsForAdmin,
  getTestimonialsForAdmin,
  getGalleryItemsForAdmin,
} from '@/modules/content/service';

export const metadata: Metadata = { title: 'Contenido | Panel' };

export default async function ContenidoPage() {
  const [faqs, testimonials, galleryItems] = await Promise.all([
    getFaqsForAdmin(),
    getTestimonialsForAdmin(),
    getGalleryItemsForAdmin(),
  ]);

  const sections = [
    {
      href: '/admin/contenido/faq',
      icon: HelpCircle,
      title: 'Preguntas frecuentes',
      description: `${faqs.length} ${faqs.length === 1 ? 'pregunta' : 'preguntas'}`,
    },
    {
      href: '/admin/contenido/testimonios',
      icon: Star,
      title: 'Testimonios',
      description: `${testimonials.length} ${testimonials.length === 1 ? 'testimonio' : 'testimonios'}`,
    },
    {
      href: '/admin/contenido/galeria',
      icon: ImageIcon,
      title: 'Galería',
      description: `${galleryItems.length} ${galleryItems.length === 1 ? 'foto' : 'fotos'}`,
    },
    {
      href: '/admin/contenido/ajustes',
      icon: Settings,
      title: 'Ajustes del sitio',
      description: 'Contacto, hero y quiénes somos',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Contenido</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Los textos e imágenes que se muestran en el sitio público.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="border-border hover:bg-accent flex items-center gap-4 rounded-2xl border p-5 transition-colors"
          >
            <div className="bg-primary/10 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl">
              <section.icon className="text-primary h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold">{section.title}</h2>
              <p className="text-muted-foreground text-sm">{section.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
