import { z } from 'zod';

// Mismo patrón de slug que usan `Category.slug` y `Product.slug`.
export const categorySlugSchema = z
  .string()
  .min(1, 'El slug no puede estar vacío')
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Formato de slug inválido');
