'use client';

import { useState, useTransition } from 'react';
import { toggleProductActiveAction, deleteProductAction } from '@/modules/products/actions';

export function ProductRowActions({
  productId,
  isActive,
}: {
  productId: string;
  isActive: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleToggle() {
    setError(null);
    startTransition(async () => {
      const result = await toggleProductActiveAction(productId, !isActive);
      if (!result.ok) setError('No se pudo actualizar.');
    });
  }

  function handleDelete() {
    if (!window.confirm('¿Borrar este producto? Esta acción no se puede deshacer.')) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteProductAction(productId);
      if (!result.ok) setError(result.message ?? 'No se pudo borrar.');
    });
  }

  return (
    <div className="flex items-center justify-end gap-3">
      {error ? <span className="text-destructive text-xs">{error}</span> : null}
      <button
        type="button"
        onClick={handleToggle}
        disabled={isPending}
        className="text-muted-foreground hover:text-foreground text-xs font-medium underline-offset-2 hover:underline disabled:opacity-50"
      >
        {isActive ? 'Desactivar' : 'Activar'}
      </button>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="text-destructive text-xs font-medium underline-offset-2 hover:underline disabled:opacity-50"
      >
        Borrar
      </button>
    </div>
  );
}
