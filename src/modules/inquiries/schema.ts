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
