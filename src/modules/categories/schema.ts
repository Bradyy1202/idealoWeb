import { z } from 'zod';
import { slugSchema } from '@/shared/lib/slug';

export const categorySlugSchema = slugSchema;

/** Formulario de categoría (tarea 4.10), compartido entre cliente y servidor. */
export const categoryFormSchema = z.object({
  name: z.string().trim().min(1, 'Ingresá el nombre').max(120),
  slug: slugSchema,
  description: z.string().trim().max(500).optional(),
  // Árbol de máximo 2 niveles por decisión de diseño (ver ADR 0001): el
  // formulario no valida la profundidad acá, se resuelve en service.ts
  // porque necesita consultar si el padre elegido ya es hijo de otro.
  parentId: z.string().cuid().optional(),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean().default(true),
  metaTitle: z.string().trim().max(70).optional(),
  metaDescription: z.string().trim().max(160).optional(),
  attributeIds: z.array(z.string().cuid()).default([]),
});

export type CategoryFormInput = z.infer<typeof categoryFormSchema>;
