'use client';

import { useRef, useState, useTransition, type KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  createAttributeAction,
  updateAttributeAction,
  type AttributeFormState,
} from '@/modules/attributes/actions';
import type { AttributeAdminItem } from '@/modules/attributes/service';
import { submitOnEnter } from '@/shared/lib/submit-on-enter';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

const initialState: AttributeFormState = { status: 'idle' };

export function AttributeForm({ initialValues }: { initialValues?: AttributeAdminItem }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<AttributeFormState>(initialState);
  const [isPending, startTransition] = useTransition();

  // No se usa <form onSubmit> con un botón type="submit": en este entorno,
  // el envío nativo de un <form> (incluso interceptado con
  // preventDefault()) dispara el mecanismo de Server Actions "por
  // formulario" de Next.js, que pierde la cookie de sesión (ver el
  // comentario en modules/attributes/actions.ts). Un botón type="button"
  // con onClick invoca la Server Action como una llamada de función común y
  // corriente, que sí funciona.
  function handleSubmit() {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const input = {
      name: formData.get('name'),
      slug: formData.get('slug'),
      type: formData.get('type'),
      unit: formData.get('unit'),
      isFilterable: formData.get('isFilterable'),
      sortOrder: formData.get('sortOrder'),
    };
    startTransition(async () => {
      const result = initialValues
        ? await updateAttributeAction(initialValues.id, input)
        : await createAttributeAction(input);
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
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            name="name"
            defaultValue={initialValues?.name}
            required
            className="rounded-xl"
          />
          {state.fieldErrors?.name ? (
            <p className="text-destructive text-sm">{state.fieldErrors.name}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            defaultValue={initialValues?.slug}
            required
            className="rounded-xl"
          />
          {state.fieldErrors?.slug ? (
            <p className="text-destructive text-sm">{state.fieldErrors.slug}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Tipo</Label>
          <select
            id="type"
            name="type"
            defaultValue={initialValues?.type ?? 'TEXT'}
            className="border-border bg-background w-full rounded-xl border px-3 py-2 text-sm"
          >
            <option value="TEXT">Texto</option>
            <option value="COLOR">Color</option>
            <option value="NUMBER">Número</option>
            <option value="BOOLEAN">Sí/No</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="unit">Unidad (opcional)</Label>
          <Input
            id="unit"
            name="unit"
            defaultValue={initialValues?.unit ?? ''}
            placeholder="ml, oz, cm..."
            className="rounded-xl"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isFilterable"
            defaultChecked={initialValues?.isFilterable ?? true}
            className="h-4 w-4"
          />
          Se muestra como filtro público
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
          {isPending ? 'Guardando...' : initialValues ? 'Guardar cambios' : 'Crear atributo'}
        </Button>
      </div>
    </form>
  );
}
