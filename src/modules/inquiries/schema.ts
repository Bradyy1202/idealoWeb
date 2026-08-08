import { z } from 'zod';

// Mismos valores que el enum InquirySource de prisma/schema.prisma. No se
// importa el enum de Prisma acá: repository.ts es el único archivo del
// módulo con permiso para tocar Prisma.
export const inquirySourceSchema = z.enum([
  'WHATSAPP_PRODUCT',
  'WHATSAPP_FLOAT',
  'QUOTE_LIST',
  'CONTACT_FORM',
]);

export type InquirySourceInput = z.infer<typeof inquirySourceSchema>;

export const inquiryItemInputSchema = z.object({
  productId: z.string().cuid().optional(),
  productSnapshot: z.string().trim().min(1).max(200),
  quantity: z.coerce.number().int().min(1).max(999).default(1),
  notes: z.string().trim().max(500).optional(),
});

export const createInquirySchema = z.object({
  source: inquirySourceSchema,
  customerName: z.string().trim().min(1).max(120).optional(),
  customerPhone: z.string().trim().max(30).optional(),
  customerEmail: z.string().trim().email().max(200).optional(),
  message: z.string().trim().max(2000).optional(),
  referrer: z.string().trim().max(500).optional(),
  userAgent: z.string().trim().max(500).optional(),
  items: z.array(inquiryItemInputSchema).default([]),
});

export type CreateInquiryInput = z.infer<typeof createInquirySchema>;

// Formulario de contacto (tarea 3.5): nombre, correo y mensaje son lo único
// que la persona escribe; el resto de CreateInquiryInput lo completa el
// server action. `website` es el honeypot (tarea 3.7): un campo invisible
// para personas, irresistible para bots que autocompletan formularios.
export const contactFormSchema = z.object({
  name: z.string().trim().min(1, 'Ingresá tu nombre').max(120),
  email: z.string().trim().email('Ingresá un correo válido').max(200),
  message: z.string().trim().min(10, 'Contanos un poco más').max(2000),
  website: z.string().max(0, 'Campo inválido').optional().default(''),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

// ---------------------------------------------------------------------------
// Panel de administración (tarea 4.13): bandeja de consultas.
// ---------------------------------------------------------------------------

// Mismos valores que el enum InquiryStatus de prisma/schema.prisma.
export const inquiryStatusSchema = z.enum(['NEW', 'CONTACTED', 'QUOTED', 'WON', 'LOST']);

export type InquiryStatusInput = z.infer<typeof inquiryStatusSchema>;

const DEFAULT_INQUIRY_PAGE_SIZE = 20;
const MAX_INQUIRY_PAGE_SIZE = 60;

export const inquiryAdminFiltersSchema = z.object({
  status: z.enum(['all', 'NEW', 'CONTACTED', 'QUOTED', 'WON', 'LOST']).default('all'),
  source: z
    .enum(['all', 'WHATSAPP_PRODUCT', 'WHATSAPP_FLOAT', 'QUOTE_LIST', 'CONTACT_FORM'])
    .default('all'),
  q: z.string().trim().max(120).optional(),
  skip: z.coerce.number().int().min(0).default(0),
  take: z.coerce
    .number()
    .int()
    .min(1)
    .max(MAX_INQUIRY_PAGE_SIZE)
    .default(DEFAULT_INQUIRY_PAGE_SIZE),
});

export type InquiryAdminFilters = z.infer<typeof inquiryAdminFiltersSchema>;

export const updateInquiryStatusSchema = z.object({
  status: inquiryStatusSchema,
});

export const updateInquiryNotesSchema = z.object({
  adminNotes: z.string().trim().max(2000).optional(),
});
