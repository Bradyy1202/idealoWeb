import { z } from 'zod';

// ---------------------------------------------------------------------------
// FAQ (tarea 4.12)
// ---------------------------------------------------------------------------

export const faqFormSchema = z.object({
  question: z.string().trim().min(1, 'Ingresá la pregunta').max(300),
  answer: z.string().trim().min(1, 'Ingresá la respuesta').max(2000),
  category: z.string().trim().max(60).optional(),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean().default(true),
});

export type FaqFormInput = z.infer<typeof faqFormSchema>;

// ---------------------------------------------------------------------------
// Testimonios (tarea 4.12)
// ---------------------------------------------------------------------------

export const testimonialFormSchema = z.object({
  authorName: z.string().trim().min(1, 'Ingresá el nombre').max(120),
  authorLocation: z.string().trim().max(120).optional(),
  content: z.string().trim().min(1, 'Ingresá el testimonio').max(1000),
  rating: z.preprocess(
    (val) => (val === '' || val === undefined || val === null ? undefined : val),
    z.coerce.number().int().min(1).max(5).optional(),
  ),
  avatarUrl: z.preprocess(
    (val) => (val === '' || val === undefined || val === null ? undefined : val),
    z.string().trim().url('Ingresá una URL válida').max(500).optional(),
  ),
  isActive: z.coerce.boolean().default(true),
  isFeatured: z.coerce.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
});

export type TestimonialFormInput = z.infer<typeof testimonialFormSchema>;

// ---------------------------------------------------------------------------
// Galería (tarea 4.12)
// ---------------------------------------------------------------------------

/** `imageUrl`/`imageId` los completa el widget de Cloudinary, nunca se tipean a mano (mismo patrón que `ProductImage`). */
export const galleryItemFormSchema = z.object({
  title: z.string().trim().max(150).optional(),
  description: z.string().trim().max(500).optional(),
  imageUrl: z.string().url('Subí una foto'),
  imageId: z.string().min(1, 'Subí una foto'),
  productId: z.string().cuid().optional(),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean().default(true),
});

export type GalleryItemFormInput = z.infer<typeof galleryItemFormSchema>;

// ---------------------------------------------------------------------------
// Ajustes del sitio (tarea 4.12): tres claves fijas de `SiteSetting`, no un
// editor genérico de clave/valor. Cada una tiene su propia forma porque cada
// sección del sitio necesita campos distintos.
// ---------------------------------------------------------------------------

export const contactSettingsSchema = z.object({
  whatsapp: z
    .string()
    .trim()
    .min(8, 'Ingresá un número de WhatsApp')
    .max(20)
    .regex(/^\d+$/, 'Solo dígitos, con código de país (ej. 50688887777)'),
  email: z.string().trim().email('Ingresá un correo válido').max(200),
  instagram: z.string().trim().max(300).optional(),
  facebook: z.string().trim().max(300).optional(),
  schedule: z.string().trim().max(200).optional(),
  location: z.string().trim().max(200).optional(),
});

export type ContactSettingsInput = z.infer<typeof contactSettingsSchema>;

export const heroSettingsSchema = z.object({
  title: z.string().trim().min(1, 'Ingresá el título').max(200),
  subtitle: z.string().trim().min(1, 'Ingresá el subtítulo').max(300),
  primaryCta: z.string().trim().min(1, 'Ingresá el texto del botón principal').max(60),
  secondaryCta: z.string().trim().min(1, 'Ingresá el texto del botón secundario').max(60),
});

export type HeroSettingsInput = z.infer<typeof heroSettingsSchema>;

export const aboutSettingsSchema = z.object({
  title: z.string().trim().min(1, 'Ingresá el título').max(200),
  body: z.string().trim().min(1, 'Ingresá el texto').max(2000),
});

export type AboutSettingsInput = z.infer<typeof aboutSettingsSchema>;
