import { describe, expect, it } from 'vitest';
import {
  productFormSchema,
  productFiltersSchema,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
} from './schema';

const VALID_CATEGORY_ID = 'cmsfbfbgn000gz128m4dmk5a6';

function baseProductInput(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    name: 'Botella térmica',
    slug: 'botella-termica',
    categoryId: VALID_CATEGORY_ID,
    ...overrides,
  };
}

describe('productFormSchema', () => {
  it('acepta el mínimo indispensable: nombre, slug y categoría', () => {
    const result = productFormSchema.safeParse(baseProductInput());

    expect(result.success).toBe(true);
  });

  it('rechaza un categoryId que no tiene formato de cuid', () => {
    const result = productFormSchema.safeParse(baseProductInput({ categoryId: 'no-es-un-cuid' }));

    expect(result.success).toBe(false);
  });

  it('trata basePrice vacío ("" del input) como "sin precio", no como error', () => {
    const result = productFormSchema.safeParse(baseProductInput({ basePrice: '' }));

    expect(result.success).toBe(true);
    if (result.success) expect(result.data.basePrice).toBeUndefined();
  });

  it('convierte basePrice de string (el que manda un <input>) a number', () => {
    const result = productFormSchema.safeParse(baseProductInput({ basePrice: '9500' }));

    expect(result.success).toBe(true);
    if (result.success) expect(result.data.basePrice).toBe(9500);
  });

  it('rechaza basePrice negativo', () => {
    const result = productFormSchema.safeParse(baseProductInput({ basePrice: '-100' }));

    expect(result.success).toBe(false);
  });

  it('usa CRC como moneda por defecto y admite currency ausente', () => {
    const result = productFormSchema.safeParse(baseProductInput());

    expect(result.success).toBe(true);
    if (result.success) expect(result.data.currency).toBe('CRC');
  });

  it('rechaza un nombre vacío', () => {
    const result = productFormSchema.safeParse(baseProductInput({ name: '' }));

    expect(result.success).toBe(false);
  });
});

describe('productFiltersSchema', () => {
  it('usa DEFAULT_PAGE_SIZE cuando no se manda take', () => {
    const result = productFiltersSchema.parse({});

    expect(result.take).toBe(DEFAULT_PAGE_SIZE);
    expect(result.skip).toBe(0);
    expect(result.sort).toBe('featured');
  });

  it('rechaza un take por encima de MAX_PAGE_SIZE en vez de recortarlo en silencio', () => {
    const result = productFiltersSchema.safeParse({ take: MAX_PAGE_SIZE + 1 });

    expect(result.success).toBe(false);
  });

  it('acepta take en el límite exacto de MAX_PAGE_SIZE', () => {
    const result = productFiltersSchema.safeParse({ take: MAX_PAGE_SIZE });

    expect(result.success).toBe(true);
  });

  it('un categoryIds vacío por defecto no filtra por categoría (array vacío, no ausente)', () => {
    const result = productFiltersSchema.parse({});

    expect(result.categoryIds).toEqual([]);
  });
});
