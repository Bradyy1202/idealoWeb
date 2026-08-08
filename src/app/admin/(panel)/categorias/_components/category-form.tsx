'use client';

import { useActionState } from 'react';
import {
  createCategoryAction,
  updateCategoryAction,
  type CategoryFormState,
} from '@/modules/categories/actions';
import type { CategoryAdminItem } from '@/modules/categories/service';
import type { AttributeAdminItem } from '@/modules/attributes/service';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';

const initialState: CategoryFormState = { status: 'idle' };

type CategoryFormProps = {
  categories: CategoryAdminItem[];
  attributes: AttributeAdminItem[];
  initialValues?: CategoryAdminItem;
};

export function CategoryForm({ categories, attributes, initialValues }: CategoryFormProps) {
  const action = initialValues
    ? updateCategoryAction.bind(null, initialValues.id)
    : createCategoryAction;
  const [state, formAction, isPending] = useActionState(action, initialState);

  // Solo categorías raíz pueden ser padre (árbol de máximo 2 niveles), y una
  // categoría nunca puede ser su propia padre.
  const parentOptions = categories.filter(
    (category) => category.parentId === null && category.id !== initialValues?.id,
  );

  const selectedAttributeIds = new Set(
    initialValues?.filterableAttributes.map((attribute) => attribute.id) ?? [],
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={initialValues?.description ?? ''}
          className="rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="parentId">Categoría padre (opcional)</Label>
        <select
          id="parentId"
          name="parentId"
          defaultValue={initialValues?.parentId ?? ''}
          className="border-border bg-background w-full rounded-xl border px-3 py-2 text-sm"
        >
          <option value="">Ninguna (categoría raíz)</option>
          {parentOptions.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {state.fieldErrors?.parentId ? (
          <p className="text-destructive text-sm">{state.fieldErrors.parentId}</p>
        ) : null}
      </div>

      {attributes.length > 0 ? (
        <div className="space-y-2">
          <Label>Atributos que se pueden asignar en esta categoría</Label>
          <div className="flex flex-wrap gap-2">
            {attributes.map((attribute) => (
              <label
                key={attribute.id}
                className="border-border has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary hover:bg-accent inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors"
              >
                <input
                  type="checkbox"
                  name="attributeIds"
                  value={attribute.id}
                  defaultChecked={selectedAttributeIds.has(attribute.id)}
                  className="sr-only"
                />
                {attribute.name}
              </label>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex items-center gap-6">
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

      <details className="border-border rounded-2xl border p-4">
        <summary className="cursor-pointer text-sm font-semibold">SEO (opcional)</summary>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Título SEO</Label>
            <Input
              id="metaTitle"
              name="metaTitle"
              defaultValue={initialValues?.metaTitle ?? ''}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="metaDescription">Descripción SEO</Label>
            <Input
              id="metaDescription"
              name="metaDescription"
              defaultValue={initialValues?.metaDescription ?? ''}
              className="rounded-xl"
            />
          </div>
        </div>
      </details>

      {state.status === 'error' && state.message ? (
        <p className="text-destructive text-sm">{state.message}</p>
      ) : null}

      <div>
        <Button type="submit" className="rounded-full" disabled={isPending}>
          {isPending ? 'Guardando...' : initialValues ? 'Guardar cambios' : 'Crear categoría'}
        </Button>
      </div>
    </form>
  );
}
