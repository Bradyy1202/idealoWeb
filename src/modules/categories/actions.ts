'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Prisma } from '@prisma/client';
import {
  createCategoryFromInput,
  updateCategoryFromInput,
  deleteCategoryById,
  CategoryDeleteBlockedError,
} from './service';

export type CategoryFormState = {
  status: 'idle' | 'error';
  message?: string;
  fieldErrors?: Record<string, string>;
};

function parseCategoryFormData(formData: FormData) {
  return {
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    parentId: formData.get('parentId') || undefined,
    sortOrder: formData.get('sortOrder'),
    isActive: formData.get('isActive'),
    metaTitle: formData.get('metaTitle'),
    metaDescription: formData.get('metaDescription'),
    attributeIds: formData.getAll('attributeIds'),
  };
}

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

export async function createCategoryAction(
  _prevState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  try {
    await createCategoryFromInput(parseCategoryFormData(formData));
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
  redirect('/admin/categorias');
}

export async function updateCategoryAction(
  id: string,
  _prevState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  try {
    await updateCategoryFromInput(id, parseCategoryFormData(formData));
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
  redirect('/admin/categorias');
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
