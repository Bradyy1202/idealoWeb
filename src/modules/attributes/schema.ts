import { z } from 'zod';
import { slugSchema } from '@/shared/lib/slug';

export const attributeTypeSchema = z.enum(['TEXT', 'COLOR', 'NUMBER', 'BOOLEAN']);

export const attributeFormSchema = z.object({
  name: z.string().trim().min(1, 'Ingresá el nombre').max(80),
  slug: slugSchema,
  type: attributeTypeSchema.default('TEXT'),
  unit: z.string().trim().max(20).optional(),
  isFilterable: z.coerce.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

export type AttributeFormInput = z.infer<typeof attributeFormSchema>;

export const attributeValueFormSchema = z.object({
  attributeId: z.string().cuid(),
  value: z.string().trim().min(1, 'Ingresá el valor').max(80),
  slug: slugSchema,
  hexColor: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Formato de color inválido (ej: #FF0000)')
    .optional(),
  sortOrder: z.coerce.number().int().default(0),
});

export type AttributeValueFormInput = z.infer<typeof attributeValueFormSchema>;
