'use client';

import { useState, useTransition } from 'react';
import { updateInquiryNotesAction } from '@/modules/inquiries/actions';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';

export function InquiryNotesForm({
  inquiryId,
  initialNotes,
}: {
  inquiryId: string;
  initialNotes: string;
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [isPending, startTransition] = useTransition();
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSave() {
    setSavedMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await updateInquiryNotesAction(inquiryId, notes);
      if (result.ok) setSavedMessage('Nota guardada.');
      else setError(result.message ?? 'No se pudo guardar la nota.');
    });
  }

  return (
    <div className="space-y-2">
      <Textarea
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        placeholder="Notas internas (no las ve la clienta)..."
        className="min-h-[100px] rounded-xl"
      />
      <div className="flex items-center gap-3">
        <Button type="button" variant="outline" onClick={handleSave} disabled={isPending}>
          {isPending ? 'Guardando...' : 'Guardar nota'}
        </Button>
        {savedMessage ? <span className="text-primary text-sm">{savedMessage}</span> : null}
        {error ? <span className="text-destructive text-sm">{error}</span> : null}
      </div>
    </div>
  );
}
