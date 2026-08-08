'use client';

import { useRef, useState, useTransition, type KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  createTestimonialAction,
  updateTestimonialAction,
  type ContentFormState,
} from '@/modules/content/actions';
import type { TestimonialItem } from '@/modules/content/service';
import { submitOnEnter } from '@/shared/lib/submit-on-enter';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';

const initialState: ContentFormState = { status: 'idle' };

export function TestimonialForm({ initialValues }: { initialValues?: TestimonialItem }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<ContentFormState>(initialState);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const input = {
      authorName: formData.get('authorName'),
      authorLocation: formData.get('authorLocation'),
      content: formData.get('content'),
      rating: formData.get('rating'),
      avatarUrl: formData.get('avatarUrl'),
      isActive: formData.get('isActive'),
      isFeatured: formData.get('isFeatured'),
      sortOrder: formData.get('sortOrder'),
    };
    startTransition(async () => {
      const result = initialValues
        ? await updateTestimonialAction(initialValues.id, input)
        : await createTestimonialAction(input);
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
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="authorName">Nombre</Label>
          <Input
            id="authorName"
            name="authorName"
            defaultValue={initialValues?.authorName}
            required
            className="rounded-xl"
          />
          {state.fieldErrors?.authorName ? (
            <p className="text-destructive text-sm">{state.fieldErrors.authorName}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="authorLocation">Ubicación (opcional)</Label>
          <Input
            id="authorLocation"
            name="authorLocation"
            defaultValue={initialValues?.authorLocation ?? ''}
            placeholder="San Carlos, Heredia..."
            className="rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Testimonio</Label>
        <Textarea
          id="content"
          name="content"
          defaultValue={initialValues?.content}
          required
          className="min-h-[120px] rounded-xl"
        />
        {state.fieldErrors?.content ? (
          <p className="text-destructive text-sm">{state.fieldErrors.content}</p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="rating">Calificación 1-5 (opcional)</Label>
          <Input
            id="rating"
            name="rating"
            type="number"
            min={1}
            max={5}
            defaultValue={initialValues?.rating ?? ''}
            className="rounded-xl"
          />
          {state.fieldErrors?.rating ? (
            <p className="text-destructive text-sm">{state.fieldErrors.rating}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="avatarUrl">Foto (URL, opcional)</Label>
          <Input
            id="avatarUrl"
            name="avatarUrl"
            defaultValue={initialValues?.avatarUrl ?? ''}
            className="rounded-xl"
          />
          {state.fieldErrors?.avatarUrl ? (
            <p className="text-destructive text-sm">{state.fieldErrors.avatarUrl}</p>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={initialValues?.isActive ?? true}
            className="h-4 w-4"
          />
          Activo
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isFeatured"
            defaultChecked={initialValues?.isFeatured ?? false}
            className="h-4 w-4"
          />
          Destacado
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
        <Button type="button" onClick={handleSubmit} className="rounded-full" disabled={isPending}>
          {isPending ? 'Guardando...' : initialValues ? 'Guardar cambios' : 'Crear testimonio'}
        </Button>
      </div>
    </form>
  );
}
