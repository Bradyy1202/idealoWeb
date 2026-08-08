'use client';

import { useState, useTransition, type KeyboardEvent } from 'react';
import {
  createAttributeValueAction,
  deleteAttributeValueAction,
} from '@/modules/attributes/actions';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

type ValueItem = {
  id: string;
  value: string;
  slug: string;
  hexColor: string | null;
  productCount: number;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function AttributeValuesManager({
  attributeId,
  values: initialValues,
  isColor,
}: {
  attributeId: string;
  values: ValueItem[];
  isColor: boolean;
}) {
  const [values, setValues] = useState(initialValues);
  const [newValue, setNewValue] = useState('');
  const [newColor, setNewColor] = useState('#000000');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleAdd() {
    const trimmed = newValue.trim();
    if (!trimmed) return;
    setError(null);
    startTransition(async () => {
      const result = await createAttributeValueAction({
        attributeId,
        value: trimmed,
        slug: slugify(trimmed),
        hexColor: isColor ? newColor : undefined,
      });
      if (result.ok) {
        setValues((current) => [
          ...current,
          {
            id: `temp-${Date.now()}`,
            value: trimmed,
            slug: slugify(trimmed),
            hexColor: isColor ? newColor : null,
            productCount: 0,
          },
        ]);
        setNewValue('');
      } else {
        setError(result.message ?? 'No se pudo agregar.');
      }
    });
  }

  function handleRemove(id: string) {
    setValues((current) => current.filter((value) => value.id !== id));
    startTransition(async () => {
      await deleteAttributeValueAction(id);
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAdd();
    }
  }

  return (
    <div className="border-border h-fit rounded-2xl border p-5">
      <h2 className="text-sm font-semibold">Valores</h2>

      <ul className="mt-3 flex flex-col gap-2">
        {values.map((value) => (
          <li key={value.id} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2">
              {value.hexColor ? (
                <span
                  aria-hidden
                  className="border-border inline-block h-3 w-3 rounded-full border"
                  style={{ backgroundColor: value.hexColor }}
                />
              ) : null}
              {value.value}
              {value.productCount > 0 ? (
                <span className="text-muted-foreground text-xs">
                  ({value.productCount} productos)
                </span>
              ) : null}
            </span>
            <button
              type="button"
              onClick={() => handleRemove(value.id)}
              disabled={isPending}
              className="text-destructive text-xs underline-offset-2 hover:underline disabled:opacity-50"
            >
              Quitar
            </button>
          </li>
        ))}
        {values.length === 0 ? (
          <p className="text-muted-foreground text-sm">Todavía no hay valores.</p>
        ) : null}
      </ul>

      <div className="mt-4 flex items-center gap-2">
        {isColor ? (
          <input
            type="color"
            value={newColor}
            onChange={(event) => setNewColor(event.target.value)}
            className="h-9 w-9 shrink-0 rounded-lg border"
            aria-label="Color del nuevo valor"
          />
        ) : null}
        <Input
          value={newValue}
          onChange={(event) => setNewValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nuevo valor"
          className="rounded-xl"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleAdd}
          disabled={isPending || !newValue.trim()}
          className="shrink-0 rounded-full"
        >
          Agregar
        </Button>
      </div>
      {error ? <p className="text-destructive mt-2 text-sm">{error}</p> : null}
    </div>
  );
}
