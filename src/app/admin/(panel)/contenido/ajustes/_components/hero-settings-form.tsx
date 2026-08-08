'use client';

import { useRef, useState, useTransition, type KeyboardEvent } from 'react';
import { updateHeroSettingsAction, type SettingsFormState } from '@/modules/content/actions';
import type { HeroSettingsInput } from '@/modules/content/schema';
import { submitOnEnter } from '@/shared/lib/submit-on-enter';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';

const initialState: SettingsFormState = { status: 'idle' };

export function HeroSettingsForm({ initialValues }: { initialValues: HeroSettingsInput }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<SettingsFormState>(initialState);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const input = {
      title: formData.get('title'),
      subtitle: formData.get('subtitle'),
      primaryCta: formData.get('primaryCta'),
      secondaryCta: formData.get('secondaryCta'),
    };
    startTransition(async () => {
      const result = await updateHeroSettingsAction(input);
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
        <h2 className="text-lg font-semibold">Hero</h2>
        <p className="text-muted-foreground mt-1 text-sm">La primera pantalla de la portada.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="hero-title">Título</Label>
        <Textarea
          id="hero-title"
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
        <Label htmlFor="hero-subtitle">Subtítulo</Label>
        <Textarea
          id="hero-subtitle"
          name="subtitle"
          defaultValue={initialValues.subtitle}
          required
          className="rounded-xl"
        />
        {state.fieldErrors?.subtitle ? (
          <p className="text-destructive text-sm">{state.fieldErrors.subtitle}</p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="primaryCta">Botón principal</Label>
          <Input
            id="primaryCta"
            name="primaryCta"
            defaultValue={initialValues.primaryCta}
            required
            className="rounded-xl"
          />
          {state.fieldErrors?.primaryCta ? (
            <p className="text-destructive text-sm">{state.fieldErrors.primaryCta}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="secondaryCta">Botón secundario</Label>
          <Input
            id="secondaryCta"
            name="secondaryCta"
            defaultValue={initialValues.secondaryCta}
            required
            className="rounded-xl"
          />
          {state.fieldErrors?.secondaryCta ? (
            <p className="text-destructive text-sm">{state.fieldErrors.secondaryCta}</p>
          ) : null}
        </div>
      </div>

      {state.status === 'error' && state.message ? (
        <p className="text-destructive text-sm">{state.message}</p>
      ) : null}
      {state.status === 'success' ? (
        <p className="text-primary text-sm font-medium">{state.message}</p>
      ) : null}

      <div>
        <Button type="button" onClick={handleSubmit} className="rounded-full" disabled={isPending}>
          {isPending ? 'Guardando...' : 'Guardar hero'}
        </Button>
      </div>
    </form>
  );
}
