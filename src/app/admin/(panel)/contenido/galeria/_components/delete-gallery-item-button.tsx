'use client';

import { useState, useTransition } from 'react';
import { deleteGalleryItemAction } from '@/modules/content/actions';

export function DeleteGalleryItemButton({
  itemId,
  title,
}: {
  itemId: string;
  title: string | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const label = title ? `Borrar la foto "${title}"` : 'Borrar esta foto de la galería';

  function handleDelete() {
    if (!window.confirm(`¿${label}?`)) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteGalleryItemAction(itemId);
      if (!result.ok) setError(result.message ?? 'No se pudo borrar.');
    });
  }

  return (
    <div className="flex items-center gap-2">
      {error ? <span className="text-destructive text-xs">{error}</span> : null}
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        aria-label={label}
        className="text-destructive text-sm font-medium underline-offset-2 hover:underline disabled:opacity-50"
      >
        Borrar
      </button>
    </div>
  );
}
