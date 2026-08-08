'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Prisma } from '@prisma/client';
import {
  createAttributeFromInput,
  updateAttributeFromInput,
  deleteAttributeById,
  createAttributeValueFromInput,
  deleteAttributeValueById,
} from './service';

export type AttributeFormState = {
  status: 'idle' | 'error';
  message?: string;
  fieldErrors?: Record<string, string>;
};

function parseAttributeFormData(formData: FormData) {
  return {
    name: formData.get('name'),
    slug: formData.get('slug'),
    type: formData.get('type'),
    unit: formData.get('unit'),
    isFilterable: formData.get('isFilterable'),
    sortOrder: formData.get('sortOrder'),
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

export async function createAttributeAction(
  _prevState: AttributeFormState,
  formData: FormData,
): Promise<AttributeFormState> {
  try {
    await createAttributeFromInput(parseAttributeFormData(formData));
  } catch (error) {
    if (isDuplicateSlugError(error)) {
      return { status: 'error', fieldErrors: { slug: 'Ya existe un atributo con ese slug.' } };
    }
    const fieldErrors = extractZodFieldErrors(error);
    if (fieldErrors) return { status: 'error', fieldErrors };
    console.error('No se pudo crear el atributo', error);
    return { status: 'error', message: 'No se pudo crear el atributo.' };
  }

  revalidatePath('/admin/atributos');
  redirect('/admin/atributos');
}

export async function updateAttributeAction(
  id: string,
  _prevState: AttributeFormState,
  formData: FormData,
): Promise<AttributeFormState> {
  try {
    await updateAttributeFromInput(id, parseAttributeFormData(formData));
  } catch (error) {
    if (isDuplicateSlugError(error)) {
      return { status: 'error', fieldErrors: { slug: 'Ya existe un atributo con ese slug.' } };
    }
    const fieldErrors = extractZodFieldErrors(error);
    if (fieldErrors) return { status: 'error', fieldErrors };
    console.error('No se pudo actualizar el atributo', error);
    return { status: 'error', message: 'No se pudo guardar el atributo.' };
  }

  revalidatePath('/admin/atributos');
  revalidatePath('/admin/categorias');
  redirect('/admin/atributos');
}

export async function deleteAttributeAction(
  id: string,
): Promise<{ ok: boolean; message?: string }> {
  try {
    await deleteAttributeById(id);
  } catch (error) {
    console.error('No se pudo borrar el atributo', error);
    return { ok: false, message: 'No se pudo borrar el atributo.' };
  }
  revalidatePath('/admin/atributos');
  revalidatePath('/admin/categorias');
  return { ok: true };
}

export async function createAttributeValueAction(input: {
  attributeId: string;
  value: string;
  slug: string;
  hexColor?: string;
  sortOrder?: number;
}): Promise<{ ok: boolean; message?: string }> {
  try {
    await createAttributeValueFromInput(input);
  } catch (error) {
    if (isDuplicateSlugError(error)) {
      return { ok: false, message: 'Ya existe un valor con ese slug para este atributo.' };
    }
    console.error('No se pudo crear el valor', error);
    return { ok: false, message: 'No se pudo crear el valor.' };
  }
  revalidatePath('/admin/atributos');
  return { ok: true };
}

export async function deleteAttributeValueAction(id: string): Promise<{ ok: boolean }> {
  try {
    await deleteAttributeValueById(id);
  } catch (error) {
    console.error('No se pudo borrar el valor', error);
    return { ok: false };
  }
  revalidatePath('/admin/atributos');
  return { ok: true };
}
