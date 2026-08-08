import { destroyCloudinaryImage } from '@/shared/lib/cloudinary';
import {
  faqFormSchema,
  testimonialFormSchema,
  galleryItemFormSchema,
  contactSettingsSchema,
  heroSettingsSchema,
  aboutSettingsSchema,
  type ContactSettingsInput,
  type HeroSettingsInput,
  type AboutSettingsInput,
} from './schema';
import {
  findActiveFaqs,
  findAllFaqsForAdmin,
  findFaqById,
  createFaq,
  updateFaq,
  deleteFaq,
  findActiveTestimonials,
  findAllTestimonialsForAdmin,
  findTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  findActiveGalleryItems,
  findAllGalleryItemsForAdmin,
  findGalleryItemById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  findSettingByKey,
  upsertSetting,
  type FaqRow,
  type TestimonialRow,
  type GalleryItemRow,
} from './repository';

function emptyToNull(value: string | undefined): string | null {
  return value && value.trim() !== '' ? value.trim() : null;
}

// ---------------------------------------------------------------------------
// FAQ (tarea 4.12)
// ---------------------------------------------------------------------------

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  sortOrder: number;
  isActive: boolean;
};

function toFaqItem(row: FaqRow): FaqItem {
  return row;
}

export async function getFaqs(): Promise<FaqItem[]> {
  return (await findActiveFaqs()).map(toFaqItem);
}

export async function getFaqsForAdmin(): Promise<FaqItem[]> {
  return (await findAllFaqsForAdmin()).map(toFaqItem);
}

export async function getFaqForEdit(id: string): Promise<FaqItem | null> {
  const row = await findFaqById(id);
  return row ? toFaqItem(row) : null;
}

export async function createFaqFromInput(input: unknown): Promise<{ id: string }> {
  const parsed = faqFormSchema.parse(input);
  return createFaq({
    question: parsed.question,
    answer: parsed.answer,
    category: emptyToNull(parsed.category),
    sortOrder: parsed.sortOrder,
    isActive: parsed.isActive,
  });
}

export async function updateFaqFromInput(id: string, input: unknown): Promise<{ id: string }> {
  const parsed = faqFormSchema.parse(input);
  return updateFaq(id, {
    question: parsed.question,
    answer: parsed.answer,
    category: emptyToNull(parsed.category),
    sortOrder: parsed.sortOrder,
    isActive: parsed.isActive,
  });
}

export async function deleteFaqById(id: string): Promise<void> {
  await deleteFaq(id);
}

// ---------------------------------------------------------------------------
// Testimonios (tarea 4.12)
// ---------------------------------------------------------------------------

export type TestimonialItem = {
  id: string;
  authorName: string;
  authorLocation: string | null;
  content: string;
  rating: number | null;
  avatarUrl: string | null;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
};

function toTestimonialItem(row: TestimonialRow): TestimonialItem {
  return row;
}

export async function getTestimonials(): Promise<TestimonialItem[]> {
  return (await findActiveTestimonials()).map(toTestimonialItem);
}

export async function getTestimonialsForAdmin(): Promise<TestimonialItem[]> {
  return (await findAllTestimonialsForAdmin()).map(toTestimonialItem);
}

export async function getTestimonialForEdit(id: string): Promise<TestimonialItem | null> {
  const row = await findTestimonialById(id);
  return row ? toTestimonialItem(row) : null;
}

export async function createTestimonialFromInput(input: unknown): Promise<{ id: string }> {
  const parsed = testimonialFormSchema.parse(input);
  return createTestimonial({
    authorName: parsed.authorName,
    authorLocation: emptyToNull(parsed.authorLocation),
    content: parsed.content,
    rating: parsed.rating ?? null,
    avatarUrl: emptyToNull(parsed.avatarUrl),
    isActive: parsed.isActive,
    isFeatured: parsed.isFeatured,
    sortOrder: parsed.sortOrder,
  });
}

export async function updateTestimonialFromInput(
  id: string,
  input: unknown,
): Promise<{ id: string }> {
  const parsed = testimonialFormSchema.parse(input);
  return updateTestimonial(id, {
    authorName: parsed.authorName,
    authorLocation: emptyToNull(parsed.authorLocation),
    content: parsed.content,
    rating: parsed.rating ?? null,
    avatarUrl: emptyToNull(parsed.avatarUrl),
    isActive: parsed.isActive,
    isFeatured: parsed.isFeatured,
    sortOrder: parsed.sortOrder,
  });
}

export async function deleteTestimonialById(id: string): Promise<void> {
  await deleteTestimonial(id);
}

// ---------------------------------------------------------------------------
// Galería (tarea 4.12)
// ---------------------------------------------------------------------------

export type GalleryAdminItem = {
  id: string;
  title: string | null;
  description: string | null;
  imageUrl: string;
  imageId: string | null;
  productId: string | null;
  productName: string | null;
  sortOrder: number;
  isActive: boolean;
};

function toGalleryAdminItem(row: GalleryItemRow): GalleryAdminItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    imageUrl: row.imageUrl,
    imageId: row.imageId,
    productId: row.productId,
    productName: row.product?.name ?? null,
    sortOrder: row.sortOrder,
    isActive: row.isActive,
  };
}

export type GalleryPublicItem = {
  id: string;
  title: string | null;
  description: string | null;
  imageUrl: string;
  blurHash: string | null;
};

function toGalleryPublicItem(row: GalleryItemRow): GalleryPublicItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    imageUrl: row.imageUrl,
    blurHash: row.blurHash,
  };
}

export async function getGalleryItems(): Promise<GalleryPublicItem[]> {
  return (await findActiveGalleryItems()).map(toGalleryPublicItem);
}

export async function getGalleryItemsForAdmin(): Promise<GalleryAdminItem[]> {
  return (await findAllGalleryItemsForAdmin()).map(toGalleryAdminItem);
}

export async function getGalleryItemForEdit(id: string): Promise<GalleryAdminItem | null> {
  const row = await findGalleryItemById(id);
  return row ? toGalleryAdminItem(row) : null;
}

export async function createGalleryItemFromInput(input: unknown): Promise<{ id: string }> {
  const parsed = galleryItemFormSchema.parse(input);
  return createGalleryItem({
    title: emptyToNull(parsed.title),
    description: emptyToNull(parsed.description),
    imageUrl: parsed.imageUrl,
    imageId: parsed.imageId,
    productId: parsed.productId ?? null,
    sortOrder: parsed.sortOrder,
    isActive: parsed.isActive,
  });
}

export async function updateGalleryItemFromInput(
  id: string,
  input: unknown,
): Promise<{ id: string }> {
  const parsed = galleryItemFormSchema.parse(input);
  return updateGalleryItem(id, {
    title: emptyToNull(parsed.title),
    description: emptyToNull(parsed.description),
    imageUrl: parsed.imageUrl,
    imageId: parsed.imageId,
    productId: parsed.productId ?? null,
    sortOrder: parsed.sortOrder,
    isActive: parsed.isActive,
  });
}

/**
 * Igual que borrar un producto: la fila se borra primero y recién después se
 * limpia Cloudinary (best-effort, destroyCloudinaryImage ya traga sus propios
 * errores) para no dejar la galería a medio borrar si Cloudinary falla.
 */
export async function deleteGalleryItemById(id: string): Promise<void> {
  const removed = await deleteGalleryItem(id);
  if (removed?.imageId) {
    await destroyCloudinaryImage(removed.imageId);
  }
}

// ---------------------------------------------------------------------------
// Ajustes del sitio (tarea 4.12)
// ---------------------------------------------------------------------------

/**
 * Las tres filas de `SiteSetting` las crea `prisma/seed.ts`: si falta una acá
 * es que nunca se sembró la base, no un estado que el sitio deba tolerar en
 * silencio con un valor por defecto inventado.
 */
function requireSettingValue(key: string, value: unknown): unknown {
  if (value === null) {
    throw new Error(`Falta el ajuste "${key}" del sitio. Corré npm run db:seed.`);
  }
  return value;
}

export async function getContactSettings(): Promise<ContactSettingsInput> {
  const value = requireSettingValue('contact', await findSettingByKey('contact'));
  return contactSettingsSchema.parse(value);
}

export async function getHeroSettings(): Promise<HeroSettingsInput> {
  const value = requireSettingValue('hero', await findSettingByKey('hero'));
  return heroSettingsSchema.parse(value);
}

export async function getAboutSettings(): Promise<AboutSettingsInput> {
  const value = requireSettingValue('about', await findSettingByKey('about'));
  return aboutSettingsSchema.parse(value);
}

export async function updateContactSettings(input: unknown): Promise<void> {
  const parsed = contactSettingsSchema.parse(input);
  await upsertSetting('contact', 'contacto', parsed);
}

export async function updateHeroSettings(input: unknown): Promise<void> {
  const parsed = heroSettingsSchema.parse(input);
  await upsertSetting('hero', 'hero', parsed);
}

export async function updateAboutSettings(input: unknown): Promise<void> {
  const parsed = aboutSettingsSchema.parse(input);
  await upsertSetting('about', 'sobre-nosotros', parsed);
}
