'use client';

import { useState, useTransition } from 'react';
import { deleteAttributeAction } from '@/modules/attributes/actions';

export function DeleteAttributeButton({
  attributeId,
  attributeName,
}: {
  attributeId: string;
  attributeName: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    if (
      !window.confirm(
        `¿Borrar "${attributeName}"? Se quita de todas las categorías y productos que lo usan.`,
      )
    ) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await deleteAttributeAction(attributeId);
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
        className="text-destructive text-sm font-medium underline-offset-2 hover:underline disabled:opacity-50"
      >
        Borrar
      </button>
    </div>
  );
}
