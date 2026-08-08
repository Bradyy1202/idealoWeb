'use client';

import { useState, useTransition } from 'react';
import { deleteFaqAction } from '@/modules/content/actions';

export function DeleteFaqButton({ faqId, question }: { faqId: string; question: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    if (!window.confirm(`¿Borrar "${question}"?`)) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteFaqAction(faqId);
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
