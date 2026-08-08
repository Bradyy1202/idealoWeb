import { z } from 'zod';

export const DEFAULT_PAGE_SIZE = 24;
export const MAX_PAGE_SIZE = 60;

export const productFiltersSchema = z.object({
  // Ids de categoría ya resueltos por el llamador (categoría + hijas si aplica).
  // Vacío = sin restricción de categoría.
  categoryIds: z.array(z.string().cuid()).default([]),
  // Clave = id del Attribute, valor = ids de AttributeValue elegidos para ese atributo.
  attributeValueIdsByAttribute: z
    .record(z.string().cuid(), z.array(z.string().cuid()).min(1))
    .default({}),
  skip: z.coerce.number().int().min(0).default(0),
  take: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
});

export type ProductFilters = z.infer<typeof productFiltersSchema>;
