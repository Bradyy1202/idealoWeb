'use client';

import type { ChangeEvent } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { ProductSort } from '@/modules/products/schema';

const SORT_OPTIONS: Array<{ value: ProductSort; label: string }> = [
  { value: 'featured', label: 'Destacados' },
  { value: 'name-asc', label: 'Nombre (A-Z)' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'newest', label: 'Más recientes' },
];

export function SortSelect({ value }: { value: ProductSort }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams);
    params.set('orden', event.target.value);
    // Cambiar el orden vuelve a la primera página: los resultados cambian.
    params.delete('pagina');
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">Ordenar por</span>
      <select
        value={value}
        onChange={handleChange}
        className="border-border bg-background rounded-full border px-3 py-1.5 text-sm"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
