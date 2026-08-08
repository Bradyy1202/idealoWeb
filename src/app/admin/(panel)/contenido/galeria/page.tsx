import Link from 'next/link';
import type { Metadata } from 'next';
import Image from 'next/image';
import { getGalleryItemsForAdmin } from '@/modules/content/service';
import { Button } from '@/shared/ui/button';
import { DeleteGalleryItemButton } from './_components/delete-gallery-item-button';

export const metadata: Metadata = { title: 'Galería | Panel' };

export default async function GaleriaPage() {
  const items = await getGalleryItemsForAdmin();

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Galería</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Fotos de trabajos entregados, se muestran en la portada.
          </p>
        </div>
        <Link href="/admin/contenido/galeria/nuevo">
          <Button className="rounded-full">Nueva foto</Button>
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground mt-6 text-sm">Todavía no hay fotos.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="border-border overflow-hidden rounded-2xl border">
              <div className="bg-muted relative aspect-video">
                <Image
                  src={item.imageUrl}
                  alt={item.title ?? ''}
                  fill
                  sizes="360px"
                  className="object-cover"
                />
                {!item.isActive ? (
                  <span className="bg-background/90 absolute top-2 left-2 rounded-full px-2.5 py-1 text-xs font-medium">
                    Inactiva
                  </span>
                ) : null}
              </div>
              <div className="flex items-start justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate font-medium">{item.title ?? 'Sin título'}</p>
                  {item.productName ? (
                    <p className="text-muted-foreground truncate text-xs">{item.productName}</p>
                  ) : null}
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Link
                    href={`/admin/contenido/galeria/${item.id}/editar`}
                    className="text-sm font-medium underline-offset-2 hover:underline"
                  >
                    Editar
                  </Link>
                  <DeleteGalleryItemButton itemId={item.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
