'use client';

import { useRef, useState, useTransition, type KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from 'next-cloudinary';
import { UploadCloud } from 'lucide-react';
import {
  createGalleryItemAction,
  updateGalleryItemAction,
  type ContentFormState,
} from '@/modules/content/actions';
import type { GalleryAdminItem } from '@/modules/content/service';
import { submitOnEnter } from '@/shared/lib/submit-on-enter';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';

const initialState: ContentFormState = { status: 'idle' };

// Mismo chequeo que ProductImageManager: CldUploadWidget tira en tiempo de
// ejecución si falta la variable, y se lleva de encuentro toda la página.
const isCloudinaryConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
);

type GalleryItemFormProps = {
  products: Array<{ id: string; name: string }>;
  initialValues?: GalleryAdminItem;
};

export function GalleryItemForm({ products, initialValues }: GalleryItemFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<ContentFormState>(initialState);
  const [isPending, startTransition] = useTransition();
  const [image, setImage] = useState<{ url: string; id: string } | null>(
    initialValues ? { url: initialValues.imageUrl, id: initialValues.imageId ?? '' } : null,
  );

  function handleUpload(results: CloudinaryUploadWidgetResults) {
    if (typeof results.info !== 'object' || results.info === null) return;
    const info = results.info;
    const publicId = 'public_id' in info ? String(info.public_id) : null;
    const secureUrl = 'secure_url' in info ? String(info.secure_url) : null;
    if (!publicId || !secureUrl) return;
    setImage({ url: secureUrl, id: publicId });
  }

  function handleSubmit() {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const input = {
      title: formData.get('title'),
      description: formData.get('description'),
      imageUrl: formData.get('imageUrl'),
      imageId: formData.get('imageId'),
      productId: formData.get('productId') || undefined,
      sortOrder: formData.get('sortOrder'),
      isActive: formData.get('isActive'),
    };
    startTransition(async () => {
      const result = initialValues
        ? await updateGalleryItemAction(initialValues.id, input)
        : await createGalleryItemAction(input);
      setState(result);
      if (result.status === 'success' && result.redirectTo) {
        router.push(result.redirectTo);
      }
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    submitOnEnter(event, handleSubmit);
  }

  return (
    <form ref={formRef} onKeyDown={handleKeyDown} className="flex flex-col gap-6">
      <input type="hidden" name="imageUrl" value={image?.url ?? ''} />
      <input type="hidden" name="imageId" value={image?.id ?? ''} />

      <div>
        <Label>Foto</Label>
        <div className="border-border bg-muted relative mt-2 aspect-video overflow-hidden rounded-2xl border">
          {image ? (
            <Image src={image.url} alt="" fill sizes="480px" className="object-cover" />
          ) : null}
        </div>
        {state.fieldErrors?.imageUrl ? (
          <p className="text-destructive mt-1 text-sm">{state.fieldErrors.imageUrl}</p>
        ) : null}

        {isCloudinaryConfigured ? (
          <CldUploadWidget
            signatureEndpoint="/api/cloudinary/sign"
            options={{ multiple: false, sources: ['local'], folder: 'idealo/galeria' }}
            onSuccess={handleUpload}
          >
            {({ open }) => (
              <Button
                type="button"
                variant="outline"
                className="mt-3 w-full rounded-full"
                onClick={() => open()}
              >
                <UploadCloud className="h-4 w-4" />
                {image ? 'Reemplazar foto' : 'Subir foto'}
              </Button>
            )}
          </CldUploadWidget>
        ) : (
          <p className="text-muted-foreground bg-secondary/40 mt-3 rounded-xl p-3 text-xs">
            Falta configurar Cloudinary (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME y
            NEXT_PUBLIC_CLOUDINARY_API_KEY) para subir fotos.
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Título (opcional)</Label>
          <Input
            id="title"
            name="title"
            defaultValue={initialValues?.title ?? ''}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="productId">Producto relacionado (opcional)</Label>
          <select
            id="productId"
            name="productId"
            defaultValue={initialValues?.productId ?? ''}
            className="border-border bg-background w-full rounded-xl border px-3 py-2 text-sm"
          >
            <option value="">Ninguno</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción (opcional)</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={initialValues?.description ?? ''}
          className="rounded-xl"
        />
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={initialValues?.isActive ?? true}
            className="h-4 w-4"
          />
          Activa
        </label>
        <div className="flex items-center gap-2">
          <Label htmlFor="sortOrder">Orden</Label>
          <Input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={initialValues?.sortOrder ?? 0}
            className="w-20 rounded-xl"
          />
        </div>
      </div>

      {state.status === 'error' && state.message ? (
        <p className="text-destructive text-sm">{state.message}</p>
      ) : null}

      <div>
        <Button
          type="button"
          onClick={handleSubmit}
          className="rounded-full"
          disabled={isPending || !image}
        >
          {isPending ? 'Guardando...' : initialValues ? 'Guardar cambios' : 'Agregar a la galería'}
        </Button>
      </div>
    </form>
  );
}
