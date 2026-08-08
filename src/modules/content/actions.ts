'use server';

import { revalidatePath } from 'next/cache';
import {
  createFaqFromInput,
  updateFaqFromInput,
  deleteFaqById,
  createTestimonialFromInput,
  updateTestimonialFromInput,
  deleteTestimonialById,
  createGalleryItemFromInput,
  updateGalleryItemFromInput,
  deleteGalleryItemById,
  updateContactSettings,
  updateHeroSettings,
  updateAboutSettings,
} from './service';

// Las acciones de crear/editar las llama cada formulario desde un botón
// type="button" (no type="submit" dentro de un <form>): en este entorno, un
// type="submit" dentro de un <form> dispara el mecanismo de "envío de
// formulario" de Next.js para Server Actions, pensado para degradar sin JS,
// incluso si el propio <form> no tiene `action`. Ese mecanismo intenta
// preparar una respuesta de navegación completa dentro del mismo request, y
// esa segunda pasada pierde la cookie de sesión (el middleware la ve como no
// autenticada y la Server Action nunca llega a ejecutarse). Cada formulario
// arma un objeto plano a partir de su FormData y navega con router.push().

export type ContentFormState = {
  status: 'idle' | 'error' | 'success';
  message?: string;
  fieldErrors?: Record<string, string>;
  redirectTo?: string;
};

export type SettingsFormState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  fieldErrors?: Record<string, string>;
};

function extractZodFieldErrors(error: unknown): Record<string, string> | null {
  if (typeof error !== 'object' || error === null || !('issues' in error)) return null;
  const zodError = error as { issues: Array<{ path: (string | number)[]; message: string }> };
  const fieldErrors: Record<string, string> = {};
  for (const issue of zodError.issues) {
    const key = issue.path[0];
    if (typeof key === 'string' && !(key in fieldErrors)) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}

// ---------------------------------------------------------------------------
// FAQ (tarea 4.12): revalida '/' porque las preguntas frecuentes viven en la
// portada, no en una ruta propia.
// ---------------------------------------------------------------------------

export type FaqFormInputPayload = {
  question: FormDataEntryValue | null;
  answer: FormDataEntryValue | null;
  category: FormDataEntryValue | null;
  sortOrder: FormDataEntryValue | null;
  isActive: FormDataEntryValue | null;
};

export async function createFaqAction(input: FaqFormInputPayload): Promise<ContentFormState> {
  try {
    await createFaqFromInput(input);
  } catch (error) {
    const fieldErrors = extractZodFieldErrors(error);
    if (fieldErrors) return { status: 'error', fieldErrors };
    console.error('No se pudo crear la pregunta frecuente', error);
    return { status: 'error', message: 'No se pudo crear la pregunta frecuente.' };
  }
  revalidatePath('/admin/contenido/faq');
  revalidatePath('/');
  return { status: 'success', redirectTo: '/admin/contenido/faq' };
}

export async function updateFaqAction(
  id: string,
  input: FaqFormInputPayload,
): Promise<ContentFormState> {
  try {
    await updateFaqFromInput(id, input);
  } catch (error) {
    const fieldErrors = extractZodFieldErrors(error);
    if (fieldErrors) return { status: 'error', fieldErrors };
    console.error('No se pudo actualizar la pregunta frecuente', error);
    return { status: 'error', message: 'No se pudo guardar la pregunta frecuente.' };
  }
  revalidatePath('/admin/contenido/faq');
  revalidatePath('/');
  return { status: 'success', redirectTo: '/admin/contenido/faq' };
}

export async function deleteFaqAction(id: string): Promise<{ ok: boolean; message?: string }> {
  try {
    await deleteFaqById(id);
  } catch (error) {
    console.error('No se pudo borrar la pregunta frecuente', error);
    return { ok: false, message: 'No se pudo borrar.' };
  }
  revalidatePath('/admin/contenido/faq');
  revalidatePath('/');
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Testimonios (tarea 4.12)
// ---------------------------------------------------------------------------

export type TestimonialFormInputPayload = {
  authorName: FormDataEntryValue | null;
  authorLocation: FormDataEntryValue | null;
  content: FormDataEntryValue | null;
  rating: FormDataEntryValue | null;
  avatarUrl: FormDataEntryValue | null;
  isActive: FormDataEntryValue | null;
  isFeatured: FormDataEntryValue | null;
  sortOrder: FormDataEntryValue | null;
};

export async function createTestimonialAction(
  input: TestimonialFormInputPayload,
): Promise<ContentFormState> {
  try {
    await createTestimonialFromInput(input);
  } catch (error) {
    const fieldErrors = extractZodFieldErrors(error);
    if (fieldErrors) return { status: 'error', fieldErrors };
    console.error('No se pudo crear el testimonio', error);
    return { status: 'error', message: 'No se pudo crear el testimonio.' };
  }
  revalidatePath('/admin/contenido/testimonios');
  revalidatePath('/');
  return { status: 'success', redirectTo: '/admin/contenido/testimonios' };
}

export async function updateTestimonialAction(
  id: string,
  input: TestimonialFormInputPayload,
): Promise<ContentFormState> {
  try {
    await updateTestimonialFromInput(id, input);
  } catch (error) {
    const fieldErrors = extractZodFieldErrors(error);
    if (fieldErrors) return { status: 'error', fieldErrors };
    console.error('No se pudo actualizar el testimonio', error);
    return { status: 'error', message: 'No se pudo guardar el testimonio.' };
  }
  revalidatePath('/admin/contenido/testimonios');
  revalidatePath('/');
  return { status: 'success', redirectTo: '/admin/contenido/testimonios' };
}

export async function deleteTestimonialAction(
  id: string,
): Promise<{ ok: boolean; message?: string }> {
  try {
    await deleteTestimonialById(id);
  } catch (error) {
    console.error('No se pudo borrar el testimonio', error);
    return { ok: false, message: 'No se pudo borrar.' };
  }
  revalidatePath('/admin/contenido/testimonios');
  revalidatePath('/');
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Galería (tarea 4.12)
// ---------------------------------------------------------------------------

export type GalleryItemFormInputPayload = {
  title: FormDataEntryValue | null;
  description: FormDataEntryValue | null;
  imageUrl: FormDataEntryValue | null;
  imageId: FormDataEntryValue | null;
  productId: FormDataEntryValue | null | undefined;
  sortOrder: FormDataEntryValue | null;
  isActive: FormDataEntryValue | null;
};

export async function createGalleryItemAction(
  input: GalleryItemFormInputPayload,
): Promise<ContentFormState> {
  try {
    await createGalleryItemFromInput(input);
  } catch (error) {
    const fieldErrors = extractZodFieldErrors(error);
    if (fieldErrors) return { status: 'error', fieldErrors };
    console.error('No se pudo guardar la foto', error);
    return { status: 'error', message: 'No se pudo guardar la foto.' };
  }
  revalidatePath('/admin/contenido/galeria');
  revalidatePath('/');
  return { status: 'success', redirectTo: '/admin/contenido/galeria' };
}

export async function updateGalleryItemAction(
  id: string,
  input: GalleryItemFormInputPayload,
): Promise<ContentFormState> {
  try {
    await updateGalleryItemFromInput(id, input);
  } catch (error) {
    const fieldErrors = extractZodFieldErrors(error);
    if (fieldErrors) return { status: 'error', fieldErrors };
    console.error('No se pudo actualizar la foto', error);
    return { status: 'error', message: 'No se pudo guardar la foto.' };
  }
  revalidatePath('/admin/contenido/galeria');
  revalidatePath('/');
  return { status: 'success', redirectTo: '/admin/contenido/galeria' };
}

export async function deleteGalleryItemAction(
  id: string,
): Promise<{ ok: boolean; message?: string }> {
  try {
    await deleteGalleryItemById(id);
  } catch (error) {
    console.error('No se pudo borrar la foto', error);
    return { ok: false, message: 'No se pudo borrar.' };
  }
  revalidatePath('/admin/contenido/galeria');
  revalidatePath('/');
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Ajustes del sitio (tarea 4.12): no navegan, se quedan en /admin/contenido
// /ajustes mostrando una confirmación (conviene ver el cambio guardado sin
// salir de la página).
// ---------------------------------------------------------------------------

export type ContactSettingsFormInputPayload = {
  whatsapp: FormDataEntryValue | null;
  email: FormDataEntryValue | null;
  instagram: FormDataEntryValue | null;
  facebook: FormDataEntryValue | null;
  schedule: FormDataEntryValue | null;
  location: FormDataEntryValue | null;
};

export async function updateContactSettingsAction(
  input: ContactSettingsFormInputPayload,
): Promise<SettingsFormState> {
  try {
    await updateContactSettings(input);
  } catch (error) {
    const fieldErrors = extractZodFieldErrors(error);
    if (fieldErrors) return { status: 'error', fieldErrors };
    console.error('No se pudo guardar el contacto', error);
    return { status: 'error', message: 'No se pudo guardar.' };
  }
  // El contacto se usa en todo el sitio (header, pie, botón flotante, ficha
  // de producto, formularios de cotización): revalida el layout completo.
  revalidatePath('/', 'layout');
  return { status: 'success', message: 'Cambios guardados.' };
}

export type HeroSettingsFormInputPayload = {
  title: FormDataEntryValue | null;
  subtitle: FormDataEntryValue | null;
  primaryCta: FormDataEntryValue | null;
  secondaryCta: FormDataEntryValue | null;
};

export async function updateHeroSettingsAction(
  input: HeroSettingsFormInputPayload,
): Promise<SettingsFormState> {
  try {
    await updateHeroSettings(input);
  } catch (error) {
    const fieldErrors = extractZodFieldErrors(error);
    if (fieldErrors) return { status: 'error', fieldErrors };
    console.error('No se pudo guardar el hero', error);
    return { status: 'error', message: 'No se pudo guardar.' };
  }
  revalidatePath('/');
  return { status: 'success', message: 'Cambios guardados.' };
}

export type AboutSettingsFormInputPayload = {
  title: FormDataEntryValue | null;
  body: FormDataEntryValue | null;
};

export async function updateAboutSettingsAction(
  input: AboutSettingsFormInputPayload,
): Promise<SettingsFormState> {
  try {
    await updateAboutSettings(input);
  } catch (error) {
    const fieldErrors = extractZodFieldErrors(error);
    if (fieldErrors) return { status: 'error', fieldErrors };
    console.error('No se pudo guardar la sección "Quiénes somos"', error);
    return { status: 'error', message: 'No se pudo guardar.' };
  }
  revalidatePath('/');
  return { status: 'success', message: 'Cambios guardados.' };
}
