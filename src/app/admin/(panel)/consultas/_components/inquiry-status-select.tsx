'use client';

import { useState, useTransition, type ChangeEvent } from 'react';
import { updateInquiryStatusAction } from '@/modules/inquiries/actions';
import { inquiryStatusLabels } from '@/modules/inquiries/service';

export function InquiryStatusSelect({ inquiryId, status }: { inquiryId: string; status: string }) {
  const [current, setCurrent] = useState(status);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const next = event.target.value;
    const previous = current;
    setCurrent(next);
    setError(null);
    startTransition(async () => {
      const result = await updateInquiryStatusAction(inquiryId, next);
      if (!result.ok) {
        setCurrent(previous);
        setError(result.message ?? 'No se pudo actualizar.');
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <select
        value={current}
        onChange={handleChange}
        disabled={isPending}
        aria-label="Estado de la consulta"
        className="border-border bg-background rounded-full border px-3 py-1.5 text-xs font-medium disabled:opacity-50"
      >
        {Object.entries(inquiryStatusLabels).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      {error ? <span className="text-destructive text-xs">{error}</span> : null}
    </div>
  );
}
