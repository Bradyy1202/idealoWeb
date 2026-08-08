'use client';

import { useRef, useState, useTransition, type KeyboardEvent } from 'react';
import { updateAboutSettingsAction, type SettingsFormState } from '@/modules/content/actions';
import type { AboutSettingsInput } from '@/modules/content/schema';
import { submitOnEnter } from '@/shared/lib/submit-on-enter';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';

const initialState: SettingsFormState = { status: 'idle' };

export function AboutSettingsForm({ initialValues }: { initialValues: AboutSettingsInput }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<SettingsFormState>(initialState);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const input = {
      title: formData.get('title'),
      body: formData.get('body'),
    };
    startTransition(async () => {
      const result = await updateAboutSettingsAction(input);
      setState(result);
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    submitOnEnter(event, handleSubmit);
  }

  return (
    <form
      ref={formRef}
      onKeyDown={handleKeyDown}
      className="border-border flex flex-col gap-6 rounded-2xl border p-6"
    >
      <div>
        <h2 className="text-lg font-semibold">Quiénes somos</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          La sección &quot;Quiénes somos&quot; de la portada.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="about-title">Título</Label>
        <Input
          id="about-title"
          name="title"
          defaultValue={initialValues.title}
          required
          className="rounded-xl"
        />
        {state.fieldErrors?.title ? (
          <p className="text-destructive text-sm">{state.fieldErrors.title}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="about-body">Texto</Label>
        <Textarea
          id="about-body"
          name="body"
          defaultValue={initialValues.body}
          required
          className="min-h-[120px] rounded-xl"
        />
        {state.fieldErrors?.body ? (
          <p className="text-destructive text-sm">{state.fieldErrors.body}</p>
        ) : null}
      </div>

      {state.status === 'error' && state.message ? (
        <p className="text-destructive text-sm">{state.message}</p>
      ) : null}
      {state.status === 'success' ? (
        <p className="text-primary text-sm font-medium">{state.message}</p>
      ) : null}

      <div>
        <Button type="button" onClick={handleSubmit} className="rounded-full" disabled={isPending}>
          {isPending ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
}
