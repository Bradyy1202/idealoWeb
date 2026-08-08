'use client';

import { useState, useTransition } from 'react';
import { deleteTestimonialAction } from '@/modules/content/actions';

export function DeleteTestimonialButton({
  testimonialId,
  authorName,
}: {
  testimonialId: string;
  authorName: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    if (!window.confirm(`¿Borrar el testimonio de "${authorName}"?`)) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteTestimonialAction(testimonialId);
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
