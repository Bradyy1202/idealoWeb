'use client';

import { Section, SectionHeading } from '@/shared/ui/section';
import SocialCards from '@/shared/ui/card-fan-carousel';
import type { GalleryPublicItem } from '@/modules/content/service';

/**
 * Baraja en abanico con los trabajos entregados. Sigue devolviendo `null`
 * sin fotos: `GalleryItem` se administra desde el panel y todavía no hay
 * ninguna cargada, así que no hay nada real que mostrar — un abanico de
 * marcadores vacíos sería peor que no tener sección.
 */
export function GallerySection({ items }: { items: GalleryPublicItem[] }) {
  if (items.length === 0) return null;

  return (
    <Section id="galeria">
      <SectionHeading
        eyebrow="Portafolio"
        title="Galería de trabajos"
        description="Pedidos reales entregados a personas y empresas."
      />

      <SocialCards
        cards={items.map((item) => ({
          imgUrl: item.imageUrl,
          alt: item.title ?? '',
        }))}
      />
    </Section>
  );
}
