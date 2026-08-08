'use client';

import { useRef, useState, useTransition, type KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  createProductAction,
  updateProductAction,
  type ProductFormState,
} from '@/modules/products/actions';
import type { ProductFormValues } from '@/modules/products/service';
import type { CategoryAdminItem } from '@/modules/categories/service';
import { submitOnEnter } from '@/shared/lib/submit-on-enter';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import { cn } from '@/shared/lib/cn';

const initialState: ProductFormState = { status: 'idle' };

type ProductFormProps = {
  categories: CategoryAdminItem[];
  initialValues?: ProductFormValues;
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-destructive text-sm">{message}</p>;
}

export function ProductForm({ categories, initialValues }: ProductFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const isEditing = Boolean(initialValues);
  const [state, setState] = useState<ProductFormState>(initialState);
  const [isPending, startTransition] = useTransition();

  const [categoryId, setCategoryId] = useState(
    initialValues?.categoryId ?? categories[0]?.id ?? '',
  );
  const [selectedAttributeValueIds, setSelectedAttributeValueIds] = useState<Set<string>>(
    () => new Set(initialValues?.attributeValueIds ?? []),
  );

  const selectedCategory = categories.find((category) => category.id === categoryId);

  function toggleAttributeValue(valueId: string) {
    setSelectedAttributeValueIds((current) => {
      const next = new Set(current);
      if (next.has(valueId)) next.delete(valueId);
      else next.add(valueId);
      return next;
    });
  }

  function handleSubmit() {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const input = {
      name: formData.get('name'),
      slug: formData.get('slug'),
      sku: formData.get('sku'),
      shortDescription: formData.get('shortDescription'),
      description: formData.get('description'),
      basePrice: formData.get('basePrice'),
      priceIsFrom: formData.get('priceIsFrom'),
      currency: formData.get('currency'),
      categoryId: formData.get('categoryId'),
      isActive: formData.get('isActive'),
      isFeatured: formData.get('isFeatured'),
      sortOrder: formData.get('sortOrder'),
      customizationNotes: formData.get('customizationNotes'),
      minOrderQuantity: formData.get('minOrderQuantity'),
      metaTitle: formData.get('metaTitle'),
      metaDescription: formData.get('metaDescription'),
      attributeValueIds: formData.getAll('attributeValueIds'),
    };
    startTransition(async () => {
      const result = initialValues
        ? await updateProductAction(initialValues.id, input)
        : await createProductAction(input);
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
    <form ref={formRef} onKeyDown={handleKeyDown} className="flex flex-col gap-8">
      <input type="hidden" name="currency" value={initialValues?.currency ?? 'CRC'} />

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            name="name"
            defaultValue={initialValues?.name}
            required
            className="rounded-xl"
          />
          <FieldError message={state.fieldErrors?.name} />
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
          <FieldError message={state.fieldErrors?.slug} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" name="sku" defaultValue={initialValues?.sku} className="rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="categoryId">Categoría</Label>
          <select
            id="categoryId"
            name="categoryId"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            required
            className="border-border bg-background w-full rounded-xl border px-3 py-2 text-sm"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.parentId ? `— ${category.name}` : category.name}
              </option>
            ))}
          </select>
          <FieldError message={state.fieldErrors?.categoryId} />
        </div>
      </section>

      <section className="space-y-2">
        <Label htmlFor="shortDescription">Descripción corta</Label>
        <Textarea
          id="shortDescription"
          name="shortDescription"
          defaultValue={initialValues?.shortDescription}
          placeholder="Se muestra en la tarjeta del catálogo"
          className="rounded-xl"
        />
      </section>

      <section className="space-y-2">
        <Label htmlFor="description">Descripción completa</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={initialValues?.description}
          className="min-h-[140px] rounded-xl"
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="basePrice">Precio (₡)</Label>
          <Input
            id="basePrice"
            name="basePrice"
            type="number"
            min="0"
            step="1"
            defaultValue={initialValues?.basePrice ?? ''}
            placeholder="Sin precio: a cotizar"
            className="rounded-xl"
          />
        </div>
        <label className="flex items-center gap-2 pt-7 text-sm">
          <input
            name="priceIsFrom"
            type="checkbox"
            defaultChecked={initialValues?.priceIsFrom ?? true}
            className="h-4 w-4"
          />
          Precio &quot;desde&quot;
        </label>
        <div className="space-y-2">
          <Label htmlFor="minOrderQuantity">Pedido mínimo</Label>
          <Input
            id="minOrderQuantity"
            name="minOrderQuantity"
            type="number"
            min="1"
            defaultValue={initialValues?.minOrderQuantity ?? 1}
            className="rounded-xl"
          />
        </div>
      </section>

      <section className="space-y-2">
        <Label htmlFor="customizationNotes">Notas de personalización</Label>
        <Textarea
          id="customizationNotes"
          name="customizationNotes"
          defaultValue={initialValues?.customizationNotes}
          className="rounded-xl"
        />
      </section>

      {selectedCategory && selectedCategory.filterableAttributes.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold">Atributos</h2>
          <div className="mt-3 flex flex-col gap-4">
            {selectedCategory.filterableAttributes.map((attribute) => (
              <div key={attribute.id}>
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  {attribute.name}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {attribute.values.map((value) => {
                    const isChecked = selectedAttributeValueIds.has(value.id);
                    return (
                      <label
                        key={value.id}
                        className={cn(
                          'inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors',
                          isChecked
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'border-border hover:bg-accent',
                        )}
                      >
                        <input
                          type="checkbox"
                          name="attributeValueIds"
                          value={value.id}
                          checked={isChecked}
                          onChange={() => toggleAttributeValue(value.id)}
                          className="sr-only"
                        />
                        {value.value}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="flex flex-wrap items-center gap-6">
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
      </section>

      <details className="border-border rounded-2xl border p-4">
        <summary className="cursor-pointer text-sm font-semibold">SEO (opcional)</summary>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Título SEO</Label>
            <Input
              id="metaTitle"
              name="metaTitle"
              defaultValue={initialValues?.metaTitle}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="metaDescription">Descripción SEO</Label>
            <Input
              id="metaDescription"
              name="metaDescription"
              defaultValue={initialValues?.metaDescription}
              className="rounded-xl"
            />
          </div>
        </div>
      </details>

      {state.status === 'error' && state.message ? (
        <p className="text-destructive text-sm">{state.message}</p>
      ) : null}

      <div className="flex items-center gap-3">
        <Button type="button" onClick={handleSubmit} className="rounded-full" disabled={isPending}>
          {isPending ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear producto'}
        </Button>
      </div>
    </form>
  );
}
