'use client';

import { useRef, useState, useTransition, type KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createFaqAction, updateFaqAction, type ContentFormState } from '@/modules/content/actions';
import type { FaqItem } from '@/modules/content/service';
import { submitOnEnter } from '@/shared/lib/submit-on-enter';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';

const initialState: ContentFormState = { status: 'idle' };

export function FaqForm({ initialValues }: { initialValues?: FaqItem }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<ContentFormState>(initialState);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const input = {
      question: formData.get('question'),
      answer: formData.get('answer'),
      category: formData.get('category'),
      sortOrder: formData.get('sortOrder'),
      isActive: formData.get('isActive'),
    };
    startTransition(async () => {
      const result = initialValues
        ? await updateFaqAction(initialValues.id, input)
        : await createFaqAction(input);
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
      <div className="space-y-2">
        <Label htmlFor="question">Pregunta</Label>
        <Input
          id="question"
          name="question"
          defaultValue={initialValues?.question}
          required
          className="rounded-xl"
        />
        {state.fieldErrors?.question ? (
          <p className="text-destructive text-sm">{state.fieldErrors.question}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="answer">Respuesta</Label>
        <Textarea
          id="answer"
          name="answer"
          defaultValue={initialValues?.answer}
          required
          className="min-h-[120px] rounded-xl"
        />
        {state.fieldErrors?.answer ? (
          <p className="text-destructive text-sm">{state.fieldErrors.answer}</p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Categoría (opcional)</Label>
          <Input
            id="category"
            name="category"
            defaultValue={initialValues?.category ?? ''}
            placeholder="Pedidos, Envíos, Personalización..."
            className="rounded-xl"
          />
        </div>
        <div className="flex items-end gap-6">
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
      </div>

      {state.status === 'error' && state.message ? (
        <p className="text-destructive text-sm">{state.message}</p>
      ) : null}

      <div>
        <Button type="button" onClick={handleSubmit} className="rounded-full" disabled={isPending}>
          {isPending ? 'Guardando...' : initialValues ? 'Guardar cambios' : 'Crear pregunta'}
        </Button>
      </div>
    </form>
  );
}
