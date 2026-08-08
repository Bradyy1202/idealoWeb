'use server';

import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import {
  createAttributeFromInput,
  updateAttributeFromInput,
  deleteAttributeById,
  createAttributeValueFromInput,
  deleteAttributeValueById,
} from './service';

export type AttributeFormState = {
  status: 'idle' | 'error' | 'success';
  message?: string;
  fieldErrors?: Record<string, string>;
  redirectTo?: string;
};

export type AttributeFormInput = {
  name: FormDataEntryValue | null;
  slug: FormDataEntryValue | null;
  type: FormDataEntryValue | null;
  unit: FormDataEntryValue | null;
  isFilterable: FormDataEntryValue | null;
  sortOrder: FormDataEntryValue | null;
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

// createAttributeAction/updateAttributeAction las llama el formulario desde
// un botón type="button" (no type="submit" dentro de un <form>): en este
// entorno, un <button type="submit"> dentro de un <form> dispara el
// mecanismo de "envío de formulario" de Next.js para Server Actions —
// pensado para degradar sin JS — incluso si el propio <form> no tiene
// `action` y el envío se maneja aparte. Ese mecanismo intenta preparar una
// respuesta de navegación completa dentro del mismo request, y esa segunda
// pasada pierde la cookie de sesión (el middleware la ve como no autenticada
// y la Server Action nunca llega a ejecutarse). Con type="button" la acción
// se invoca como una llamada de función común y corriente. El formulario
// arma un objeto plano a partir del FormData antes de llamar a la acción, y
// navega con router.push() al terminar.

export async function createAttributeAction(
  input: AttributeFormInput,
): Promise<AttributeFormState> {
  try {
    await createAttributeFromInput(input);
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
  return { status: 'success', redirectTo: '/admin/atributos' };
}

export async function updateAttributeAction(
  id: string,
  input: AttributeFormInput,
): Promise<AttributeFormState> {
  try {
    await updateAttributeFromInput(id, input);
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
  return { status: 'success', redirectTo: '/admin/atributos' };
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
