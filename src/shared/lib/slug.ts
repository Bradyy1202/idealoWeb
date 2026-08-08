import { z } from 'zod';

/** Formato de `Category.slug` y `Product.slug`: minúsculas, dígitos y guiones simples. */
export const slugSchema = z
  .string()
  .min(1, 'El slug no puede estar vacío')
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Formato de slug inválido');
