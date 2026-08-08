'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from 'next-cloudinary';
import { Star, Trash2, UploadCloud } from 'lucide-react';
import {
  addProductImageAction,
  removeProductImageAction,
  reorderProductImagesAction,
  setProductPrimaryImageAction,
} from '@/modules/products/actions';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/cn';

type ImageItem = {
  id: string;
  url: string;
  alt: string | null;
  width: number | null;
  height: number | null;
  isPrimary: boolean;
};

// CldUploadWidget tira en tiempo de ejecución (no un error de React manejable
// con estado) si falta esta variable, y se lleva de encuentro toda la página
// de edición. Se chequea antes de montarlo para degradar con un aviso en vez
// de un error 500.
const isCloudinaryConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
);

export function ProductImageManager({
  productId,
  images: initialImages,
}: {
  productId: string;
  images: ImageItem[];
}) {
  const [images, setImages] = useState(initialImages);
  const [isPending, startTransition] = useTransition();
  const [draggedId, setDraggedId] = useState<string | null>(null);

  function handleUpload(results: CloudinaryUploadWidgetResults) {
    if (typeof results.info !== 'object' || results.info === null) return;
    const info = results.info;
    const publicId = 'public_id' in info ? String(info.public_id) : null;
    const secureUrl = 'secure_url' in info ? String(info.secure_url) : null;
    if (!publicId || !secureUrl) return;

    const width = 'width' in info ? Number(info.width) : undefined;
    const height = 'height' in info ? Number(info.height) : undefined;

    const tempId = `temp-${publicId}`;
    setImages((current) => [
      ...current,
      {
        id: tempId,
        url: secureUrl,
        alt: null,
        width: width ?? null,
        height: height ?? null,
        isPrimary: current.length === 0,
      },
    ]);

    startTransition(async () => {
      const response = await addProductImageAction({
        productId,
        url: secureUrl,
        imageId: publicId,
        width,
        height,
      });
      if (response.ok && response.id) {
        setImages((current) =>
          current.map((image) => (image.id === tempId ? { ...image, id: response.id! } : image)),
        );
      }
    });
  }

  function handleRemove(imageId: string) {
    setImages((current) => current.filter((image) => image.id !== imageId));
    startTransition(async () => {
      await removeProductImageAction(productId, imageId);
    });
  }

  function handleSetPrimary(imageId: string) {
    setImages((current) => current.map((image) => ({ ...image, isPrimary: image.id === imageId })));
    startTransition(async () => {
      await setProductPrimaryImageAction(productId, imageId);
    });
  }

  function handleDrop(targetId: string) {
    if (!draggedId || draggedId === targetId) return;
    const fromIndex = images.findIndex((image) => image.id === draggedId);
    const toIndex = images.findIndex((image) => image.id === targetId);
    if (fromIndex === -1 || toIndex === -1) return;

    const next = [...images];
    const [moved] = next.splice(fromIndex, 1);
    if (!moved) return;
    next.splice(toIndex, 0, moved);

    setImages(next);
    setDraggedId(null);
    startTransition(async () => {
      await reorderProductImagesAction(
        productId,
        next.map((image) => image.id),
      );
    });
  }

  return (
    <div className="border-border h-fit rounded-2xl border p-5">
      <h2 className="text-sm font-semibold">Fotos</h2>
      <p className="text-muted-foreground mt-1 text-xs">
        Arrastrá para reordenar. La primera es la principal.
      </p>

      {images.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {images.map((image) => (
            <div
              key={image.id}
              draggable
              onDragStart={() => setDraggedId(image.id)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => handleDrop(image.id)}
              className={cn(
                'group border-border relative aspect-square cursor-grab overflow-hidden rounded-xl border',
                image.isPrimary && 'ring-primary ring-2',
              )}
            >
              <Image
                src={image.url}
                alt={image.alt ?? ''}
                fill
                sizes="160px"
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => handleSetPrimary(image.id)}
                  aria-label="Marcar como principal"
                  className="rounded-full bg-white p-1.5"
                >
                  <Star
                    className={cn(
                      'h-4 w-4',
                      image.isPrimary ? 'fill-amber-400 text-amber-400' : 'text-foreground',
                    )}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(image.id)}
                  aria-label="Borrar foto"
                  className="rounded-full bg-white p-1.5"
                >
                  <Trash2 className="text-destructive h-4 w-4" />
                </button>
              </div>
              {image.isPrimary ? (
                <span className="bg-primary text-primary-foreground absolute top-1.5 left-1.5 rounded-full px-2 py-0.5 text-[0.625rem] font-semibold">
                  Principal
                </span>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground mt-4 text-sm">Todavía no hay fotos.</p>
      )}

      {isCloudinaryConfigured ? (
        <CldUploadWidget
          signatureEndpoint="/api/cloudinary/sign"
          options={{ multiple: true, sources: ['local'], folder: 'idealo/productos' }}
          onSuccess={handleUpload}
        >
          {({ open }) => (
            <Button
              type="button"
              variant="outline"
              className="mt-4 w-full rounded-full"
              onClick={() => open()}
              disabled={isPending}
            >
              <UploadCloud className="h-4 w-4" />
              Subir fotos
            </Button>
          )}
        </CldUploadWidget>
      ) : (
        <p className="text-muted-foreground bg-secondary/40 mt-4 rounded-xl p-3 text-xs">
          Falta configurar Cloudinary (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME y
          NEXT_PUBLIC_CLOUDINARY_API_KEY) para subir fotos.
        </p>
      )}
    </div>
  );
}
