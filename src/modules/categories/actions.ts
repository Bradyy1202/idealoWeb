'use server';

import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import {
  createCategoryFromInput,
  updateCategoryFromInput,
  deleteCategoryById,
  CategoryDeleteBlockedError,
} from './service';

export type CategoryFormState = {
  status: 'idle' | 'error' | 'success';
  message?: string;
  fieldErrors?: Record<string, string>;
  redirectTo?: string;
};

export type CategoryFormInput = {
  name: FormDataEntryValue | null;
  slug: FormDataEntryValue | null;
  description: FormDataEntryValue | null;
  parentId: FormDataEntryValue | null | undefined;
  sortOrder: FormDataEntryValue | null;
  isActive: FormDataEntryValue | null;
  metaTitle: FormDataEntryValue | null;
  metaDescription: FormDataEntryValue | null;
  attributeIds: FormDataEntryValue[];
};

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

// Las acciones de crear/editar las llama el formulario desde un botón
// type="button" (no type="submit" dentro de un <form>): en este entorno, un
// type="submit" dentro de un <form> dispara el mecanismo de "envío de
// formulario" de Next.js para Server Actions, pensado para degradar sin JS,
// incluso si el propio <form> no tiene `action`. Ese mecanismo intenta
// preparar una respuesta de navegación completa dentro del mismo request, y
// esa segunda pasada pierde la cookie de sesión (el middleware la ve como no
// autenticada y la Server Action nunca llega a ejecutarse). El formulario
// arma un objeto plano a partir del FormData y navega con router.push().

export async function createCategoryAction(input: CategoryFormInput): Promise<CategoryFormState> {
  try {
    await createCategoryFromInput(input);
  } catch (error) {
    if (isDuplicateSlugError(error)) {
      return { status: 'error', fieldErrors: { slug: 'Ya existe una categoría con ese slug.' } };
    }
    const fieldErrors = extractZodFieldErrors(error);
    if (fieldErrors) return { status: 'error', fieldErrors };
    console.error('No se pudo crear la categoría', error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'No se pudo crear la categoría.',
    };
  }

  revalidatePath('/admin/categorias');
  revalidatePath('/catalogo');
  return { status: 'success', redirectTo: '/admin/categorias' };
}

export async function updateCategoryAction(
  id: string,
  input: CategoryFormInput,
): Promise<CategoryFormState> {
  try {
    await updateCategoryFromInput(id, input);
  } catch (error) {
    if (isDuplicateSlugError(error)) {
      return { status: 'error', fieldErrors: { slug: 'Ya existe una categoría con ese slug.' } };
    }
    const fieldErrors = extractZodFieldErrors(error);
    if (fieldErrors) return { status: 'error', fieldErrors };
    console.error('No se pudo actualizar la categoría', error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'No se pudo guardar la categoría.',
    };
  }

  revalidatePath('/admin/categorias');
  revalidatePath('/catalogo');
  return { status: 'success', redirectTo: '/admin/categorias' };
}

export async function deleteCategoryAction(id: string): Promise<{ ok: boolean; message?: string }> {
  try {
    await deleteCategoryById(id);
  } catch (error) {
    if (error instanceof CategoryDeleteBlockedError) {
      return { ok: false, message: error.message };
    }
    console.error('No se pudo borrar la categoría', error);
    return { ok: false, message: 'No se pudo borrar la categoría.' };
  }
  revalidatePath('/admin/categorias');
  revalidatePath('/catalogo');
  return { ok: true };
}
