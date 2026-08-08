'use client';

import { useRef, useState, useTransition, type KeyboardEvent } from 'react';
import { updateContactSettingsAction, type SettingsFormState } from '@/modules/content/actions';
import type { ContactSettingsInput } from '@/modules/content/schema';
import { submitOnEnter } from '@/shared/lib/submit-on-enter';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

const initialState: SettingsFormState = { status: 'idle' };

export function ContactSettingsForm({ initialValues }: { initialValues: ContactSettingsInput }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<SettingsFormState>(initialState);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const input = {
      whatsapp: formData.get('whatsapp'),
      email: formData.get('email'),
      instagram: formData.get('instagram'),
      facebook: formData.get('facebook'),
      schedule: formData.get('schedule'),
      location: formData.get('location'),
    };
    startTransition(async () => {
      const result = await updateContactSettingsAction(input);
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
        <h2 className="text-lg font-semibold">Contacto</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Se usa en el encabezado, el pie, el botón flotante y las fichas de producto.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp (con código de país)</Label>
          <Input
            id="whatsapp"
            name="whatsapp"
            defaultValue={initialValues.whatsapp}
            placeholder="50688887777"
            required
            className="rounded-xl"
          />
          {state.fieldErrors?.whatsapp ? (
            <p className="text-destructive text-sm">{state.fieldErrors.whatsapp}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Correo</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={initialValues.email}
            required
            className="rounded-xl"
          />
          {state.fieldErrors?.email ? (
            <p className="text-destructive text-sm">{state.fieldErrors.email}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="instagram">Instagram (URL, opcional)</Label>
          <Input
            id="instagram"
            name="instagram"
            defaultValue={initialValues.instagram ?? ''}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="facebook">Facebook (URL, opcional)</Label>
          <Input
            id="facebook"
            name="facebook"
            defaultValue={initialValues.facebook ?? ''}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="schedule">Horario (opcional)</Label>
          <Input
            id="schedule"
            name="schedule"
            defaultValue={initialValues.schedule ?? ''}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Ubicación (opcional)</Label>
          <Input
            id="location"
            name="location"
            defaultValue={initialValues.location ?? ''}
            className="rounded-xl"
          />
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
          {isPending ? 'Guardando...' : 'Guardar contacto'}
        </Button>
      </div>
    </form>
  );
}
