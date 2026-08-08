import { Prisma } from '@prisma/client';
import { prisma } from '@/shared/lib/prisma';

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------

const faqSelect = {
  id: true,
  question: true,
  answer: true,
  category: true,
  sortOrder: true,
  isActive: true,
} satisfies Prisma.FaqItemSelect;

export type FaqRow = Prisma.FaqItemGetPayload<{ select: typeof faqSelect }>;

export async function findActiveFaqs(): Promise<FaqRow[]> {
  return prisma.faqItem.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: faqSelect,
  });
}

export async function findAllFaqsForAdmin(): Promise<FaqRow[]> {
  return prisma.faqItem.findMany({ orderBy: { sortOrder: 'asc' }, select: faqSelect });
}

export async function findFaqById(id: string): Promise<FaqRow | null> {
  return prisma.faqItem.findUnique({ where: { id }, select: faqSelect });
}

export type FaqWriteData = {
  question: string;
  answer: string;
  category: string | null;
  sortOrder: number;
  isActive: boolean;
};

export async function createFaq(data: FaqWriteData): Promise<{ id: string }> {
  return prisma.faqItem.create({ data, select: { id: true } });
}

export async function updateFaq(id: string, data: FaqWriteData): Promise<{ id: string }> {
  return prisma.faqItem.update({ where: { id }, data, select: { id: true } });
}

export async function deleteFaq(id: string): Promise<void> {
  await prisma.faqItem.delete({ where: { id } });
}

// ---------------------------------------------------------------------------
// Testimonios
// ---------------------------------------------------------------------------

const testimonialSelect = {
  id: true,
  authorName: true,
  authorLocation: true,
  content: true,
  rating: true,
  avatarUrl: true,
  isActive: true,
  isFeatured: true,
  sortOrder: true,
} satisfies Prisma.TestimonialSelect;

export type TestimonialRow = Prisma.TestimonialGetPayload<{ select: typeof testimonialSelect }>;

export async function findActiveTestimonials(): Promise<TestimonialRow[]> {
  return prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: testimonialSelect,
  });
}

export async function findAllTestimonialsForAdmin(): Promise<TestimonialRow[]> {
  return prisma.testimonial.findMany({ orderBy: { sortOrder: 'asc' }, select: testimonialSelect });
}

export async function findTestimonialById(id: string): Promise<TestimonialRow | null> {
  return prisma.testimonial.findUnique({ where: { id }, select: testimonialSelect });
}

export type TestimonialWriteData = {
  authorName: string;
  authorLocation: string | null;
  content: string;
  rating: number | null;
  avatarUrl: string | null;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
};

export async function createTestimonial(data: TestimonialWriteData): Promise<{ id: string }> {
  return prisma.testimonial.create({ data, select: { id: true } });
}

export async function updateTestimonial(
  id: string,
  data: TestimonialWriteData,
): Promise<{ id: string }> {
  return prisma.testimonial.update({ where: { id }, data, select: { id: true } });
}

export async function deleteTestimonial(id: string): Promise<void> {
  await prisma.testimonial.delete({ where: { id } });
}

// ---------------------------------------------------------------------------
// Galería
// ---------------------------------------------------------------------------

const galleryItemSelect = {
  id: true,
  title: true,
  description: true,
  imageUrl: true,
  imageId: true,
  blurHash: true,
  productId: true,
  product: { select: { id: true, name: true } },
  sortOrder: true,
  isActive: true,
} satisfies Prisma.GalleryItemSelect;

export type GalleryItemRow = Prisma.GalleryItemGetPayload<{ select: typeof galleryItemSelect }>;

export async function findActiveGalleryItems(): Promise<GalleryItemRow[]> {
  return prisma.galleryItem.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: galleryItemSelect,
  });
}

export async function findAllGalleryItemsForAdmin(): Promise<GalleryItemRow[]> {
  return prisma.galleryItem.findMany({
    orderBy: { sortOrder: 'asc' },
    select: galleryItemSelect,
  });
}

export async function findGalleryItemById(id: string): Promise<GalleryItemRow | null> {
  return prisma.galleryItem.findUnique({ where: { id }, select: galleryItemSelect });
}

export type GalleryItemWriteData = {
  title: string | null;
  description: string | null;
  imageUrl: string;
  imageId: string;
  productId: string | null;
  sortOrder: number;
  isActive: boolean;
};

export async function createGalleryItem(data: GalleryItemWriteData): Promise<{ id: string }> {
  return prisma.galleryItem.create({ data, select: { id: true } });
}

export async function updateGalleryItem(
  id: string,
  data: GalleryItemWriteData,
): Promise<{ id: string }> {
  return prisma.galleryItem.update({ where: { id }, data, select: { id: true } });
}

/** Borra y devuelve el `imageId` en el mismo paso: service.ts lo necesita para limpiar Cloudinary. */
export async function deleteGalleryItem(id: string): Promise<{ imageId: string | null } | null> {
  return prisma.galleryItem.delete({ where: { id }, select: { imageId: true } }).catch(() => null);
}

// ---------------------------------------------------------------------------
// Ajustes del sitio: tres filas fijas (`contact`, `hero`, `about`) sembradas
// por prisma/seed.ts. Sin CRUD genérico de claves: cada una se edita con su
// propio formulario tipado en service.ts.
// ---------------------------------------------------------------------------

export async function findSettingByKey(key: string): Promise<Prisma.JsonValue | null> {
  const row = await prisma.siteSetting.findUnique({ where: { key }, select: { value: true } });
  return row?.value ?? null;
}

export async function upsertSetting(
  key: string,
  group: string,
  value: Prisma.InputJsonValue,
): Promise<void> {
  await prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, group, value },
  });
}
