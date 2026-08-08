'use server';

import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  setProductActive,
  addProductImage,
  removeProductImage,
  reorderProductImages,
  setProductPrimaryImage,
} from './service';
import type { AddProductImageInput } from './schema';

export type ProductFormState = {
  status: 'idle' | 'error' | 'success';
  message?: string;
  fieldErrors?: Record<string, string>;
  redirectTo?: string;
};

export type ProductFormInput = {
  name: FormDataEntryValue | null;
  slug: FormDataEntryValue | null;
  sku: FormDataEntryValue | null;
  shortDescription: FormDataEntryValue | null;
  description: FormDataEntryValue | null;
  basePrice: FormDataEntryValue | null;
  priceIsFrom: FormDataEntryValue | null;
  currency: FormDataEntryValue | null;
  categoryId: FormDataEntryValue | null;
  isActive: FormDataEntryValue | null;
  isFeatured: FormDataEntryValue | null;
  sortOrder: FormDataEntryValue | null;
  customizationNotes: FormDataEntryValue | null;
  minOrderQuantity: FormDataEntryValue | null;
  metaTitle: FormDataEntryValue | null;
  metaDescription: FormDataEntryValue | null;
  attributeValueIds: FormDataEntryValue[];
};

/** true si es el error de unicidad de Prisma sobre el slug (P2002). */
function isDuplicateSlugError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002' &&
    Array.isArray(error.meta?.target) &&
    error.meta.target.includes('slug')
  );
}

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

// createProductAction/updateProductAction las llama el formulario desde un
// botón type="button" (no type="submit" dentro de un <form>): en este
// entorno, un type="submit" dentro de un <form> dispara el mecanismo de
// "envío de formulario" de Next.js para Server Actions, pensado para
// degradar sin JS, incluso si el propio <form> no tiene `action`. Ese
// mecanismo intenta preparar una respuesta de navegación completa dentro del
// mismo request, y esa segunda pasada pierde la cookie de sesión (el
// middleware la ve como no autenticada y la Server Action nunca llega a
// ejecutarse). El formulario arma un objeto plano a partir del FormData y
// navega con router.push().

export async function createProductAction(input: ProductFormInput): Promise<ProductFormState> {
  let created: { id: string; slug: string };
  try {
    created = await createProduct(input);
  } catch (error) {
    if (isDuplicateSlugError(error)) {
      return { status: 'error', fieldErrors: { slug: 'Ya existe un producto con ese slug.' } };
    }
    const fieldErrors = extractZodFieldErrors(error);
    if (fieldErrors) return { status: 'error', fieldErrors };
    console.error('No se pudo crear el producto', error);
    return { status: 'error', message: 'No se pudo crear el producto. Intentá de nuevo.' };
  }

  revalidatePath('/admin/productos');
  revalidatePath('/catalogo');
  revalidatePath(`/producto/${created.slug}`);
  return { status: 'success', redirectTo: `/admin/productos/${created.id}/editar` };
}

export async function updateProductAction(
  id: string,
  input: ProductFormInput,
): Promise<ProductFormState> {
  let updated: { id: string; slug: string };
  try {
    updated = await updateProduct(id, input);
  } catch (error) {
    if (isDuplicateSlugError(error)) {
      return { status: 'error', fieldErrors: { slug: 'Ya existe un producto con ese slug.' } };
    }
    const fieldErrors = extractZodFieldErrors(error);
    if (fieldErrors) return { status: 'error', fieldErrors };
    console.error('No se pudo actualizar el producto', error);
    return { status: 'error', message: 'No se pudo guardar el producto. Intentá de nuevo.' };
  }

  revalidatePath('/admin/productos');
  revalidatePath('/catalogo');
  revalidatePath(`/producto/${updated.slug}`);
  return { status: 'success', redirectTo: `/admin/productos/${updated.id}/editar` };
}

export async function deleteProductAction(id: string): Promise<{ ok: boolean; message?: string }> {
  try {
    await deleteProduct(id);
  } catch (error) {
    console.error('No se pudo borrar el producto', error);
    return { ok: false, message: 'No se pudo borrar el producto.' };
  }
  revalidatePath('/admin/productos');
  revalidatePath('/catalogo');
  return { ok: true };
}

export async function toggleProductActiveAction(
  id: string,
  isActive: boolean,
): Promise<{ ok: boolean }> {
  try {
    await setProductActive(id, isActive);
  } catch (error) {
    console.error('No se pudo cambiar el estado del producto', error);
    return { ok: false };
  }
  revalidatePath('/admin/productos');
  revalidatePath('/catalogo');
  return { ok: true };
}

export async function addProductImageAction(
  input: AddProductImageInput,
): Promise<{ ok: boolean; id?: string }> {
  try {
    const { id } = await addProductImage(input);
    revalidatePath(`/admin/productos/${input.productId}/editar`);
    revalidatePath(`/producto/${input.productId}`, 'page');
    return { ok: true, id };
  } catch (error) {
    console.error('No se pudo guardar la imagen subida', error);
    return { ok: false };
  }
}

export async function removeProductImageAction(
  productId: string,
  imageId: string,
): Promise<{ ok: boolean }> {
  try {
    await removeProductImage(imageId);
  } catch (error) {
    console.error('No se pudo borrar la imagen', error);
    return { ok: false };
  }
  revalidatePath(`/admin/productos/${productId}/editar`);
  return { ok: true };
}

export async function reorderProductImagesAction(
  productId: string,
  orderedImageIds: string[],
): Promise<{ ok: boolean }> {
  try {
    await reorderProductImages({ productId, orderedImageIds });
  } catch (error) {
    console.error('No se pudo reordenar las imágenes', error);
    return { ok: false };
  }
  revalidatePath(`/admin/productos/${productId}/editar`);
  return { ok: true };
}

export async function setProductPrimaryImageAction(
  productId: string,
  imageId: string,
): Promise<{ ok: boolean }> {
  try {
    await setProductPrimaryImage(productId, imageId);
  } catch (error) {
    console.error('No se pudo marcar la imagen como principal', error);
    return { ok: false };
  }
  revalidatePath(`/admin/productos/${productId}/editar`);
  revalidatePath(`/producto/${productId}`, 'page');
  return { ok: true };
}
