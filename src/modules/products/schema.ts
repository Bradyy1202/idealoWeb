import { z } from 'zod';
import { slugSchema } from '@/shared/lib/slug';

export const DEFAULT_PAGE_SIZE = 24;
export const MAX_PAGE_SIZE = 60;

export const productSlugSchema = slugSchema;

export const productSortSchema = z
  .enum(['featured', 'name-asc', 'price-asc', 'price-desc', 'newest'])
  .default('featured');

export type ProductSort = z.infer<typeof productSortSchema>;

export const productFiltersSchema = z.object({
  // Ids de categoría ya resueltos por el llamador (categoría + hijas si aplica).
  // Vacío = sin restricción de categoría.
  categoryIds: z.array(z.string().cuid()).default([]),
  // Clave = id del Attribute, valor = ids de AttributeValue elegidos para ese atributo.
  attributeValueIdsByAttribute: z
    .record(z.string().cuid(), z.array(z.string().cuid()).min(1))
    .default({}),
  // Buscador (tarea 2.7): coincide contra nombre, descripción y SKU.
  q: z.string().trim().min(1).max(120).optional(),
  sort: productSortSchema,
  skip: z.coerce.number().int().min(0).default(0),
  take: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
});

export type ProductFilters = z.infer<typeof productFiltersSchema>;

// ---------------------------------------------------------------------------
// Panel de administración (Fase 4)
// ---------------------------------------------------------------------------

export const productAdminStatusSchema = z.enum(['all', 'active', 'inactive']).default('all');

export const productAdminFiltersSchema = z.object({
  q: z.string().trim().max(120).optional(),
  status: productAdminStatusSchema,
  skip: z.coerce.number().int().min(0).default(0),
  take: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
});

export type ProductAdminFilters = z.infer<typeof productAdminFiltersSchema>;

/**
 * Formulario de producto (tarea 4.7), compartido entre cliente y servidor.
 * Los campos de texto opcionales llegan como '' desde un <input> vacío: se
 * normalizan a null recién en service.ts, no acá, para que el propio schema
 * quede simple y testeable.
 */
export const productFormSchema = z.object({
  name: z.string().trim().min(1, 'Ingresá el nombre').max(200),
  slug: slugSchema,
  sku: z.string().trim().max(50).optional(),
  shortDescription: z.string().trim().max(300).optional(),
  description: z.string().trim().max(5000).optional(),
  basePrice: z.preprocess(
    (val) => (val === '' || val === undefined || val === null ? undefined : val),
    z.coerce.number().min(0).optional(),
  ),
  priceIsFrom: z.coerce.boolean().default(true),
  currency: z.string().trim().length(3).default('CRC'),
  categoryId: z.string().cuid('Elegí una categoría'),
  isActive: z.coerce.boolean().default(true),
  isFeatured: z.coerce.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
  customizationNotes: z.string().trim().max(1000).optional(),
  minOrderQuantity: z.coerce.number().int().min(1).default(1),
  metaTitle: z.string().trim().max(70).optional(),
  metaDescription: z.string().trim().max(160).optional(),
  // Ids de AttributeValue elegidos, de cualquier atributo asociado a la categoría (tarea 4.9).
  attributeValueIds: z.array(z.string().cuid()).default([]),
});

export type ProductFormInput = z.infer<typeof productFormSchema>;

export const addProductImageSchema = z.object({
  productId: z.string().cuid(),
  url: z.string().url(),
  imageId: z.string().min(1),
  width: z.coerce.number().int().optional(),
  height: z.coerce.number().int().optional(),
  alt: z.string().trim().max(200).optional(),
});

export type AddProductImageInput = z.infer<typeof addProductImageSchema>;

export const reorderProductImagesSchema = z.object({
  productId: z.string().cuid(),
  // Ids de ProductImage en el orden final deseado.
  orderedImageIds: z.array(z.string().cuid()).min(1),
});

export type ReorderProductImagesInput = z.infer<typeof reorderProductImagesSchema>;
