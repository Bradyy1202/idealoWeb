'use server';

import { headers } from 'next/headers';
import { contactFormSchema, type InquirySourceInput } from './schema';
import { registerInquiry } from './service';

type WhatsAppClickInput = {
  source: Extract<InquirySourceInput, 'WHATSAPP_PRODUCT' | 'WHATSAPP_FLOAT'>;
  productId?: string;
  productSnapshot?: string;
};

/**
 * Se llama sin esperar la respuesta (fire-and-forget) desde el onClick de un
 * enlace a WhatsApp: si la escritura falla, la persona igual llega a
 * WhatsApp — el registro nunca debe bloquear esa navegación (docs/PLAN.md,
 * Fase 3, "detalle que se olvida"). Por eso traga cualquier error acá y no
 * en service.ts, que sí debe poder fallar para otros llamadores (el
 * formulario de contacto necesita saber si falló).
 */
export async function registerWhatsAppClickAction(input: WhatsAppClickInput): Promise<void> {
  try {
    const headersList = await headers();
    await registerInquiry({
      source: input.source,
      referrer: headersList.get('referer') ?? undefined,
      userAgent: headersList.get('user-agent') ?? undefined,
      items:
        input.productId && input.productSnapshot
          ? [{ productId: input.productId, productSnapshot: input.productSnapshot, quantity: 1 }]
          : [],
    });
  } catch (error) {
    console.error('No se pudo registrar el clic de WhatsApp', error);
  }
}

type QuoteListInquiryItem = {
  productId: string;
  productSnapshot: string;
  quantity: number;
  notes?: string;
};

/** Misma lógica de "no bloquear la navegación" que registerWhatsAppClickAction, para el mensaje consolidado de la lista de cotización (tarea 3.4). */
export async function registerQuoteListInquiryAction(items: QuoteListInquiryItem[]): Promise<void> {
  if (items.length === 0) return;

  try {
    const headersList = await headers();
    await registerInquiry({
      source: 'QUOTE_LIST',
      referrer: headersList.get('referer') ?? undefined,
      userAgent: headersList.get('user-agent') ?? undefined,
      items,
    });
  } catch (error) {
    console.error('No se pudo registrar la lista de cotización', error);
  }
}

export type ContactFormState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  fieldErrors?: Partial<Record<'name' | 'email' | 'message', string>>;
};

export async function submitContactFormAction(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const parsed = contactFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
    website: formData.get('website'),
  });

  if (!parsed.success) {
    // Honeypot (tarea 3.7): "website" solo lo llena un bot que autocompleta
    // todos los campos. No se distingue como error de campo para no
    // delatar la trampa; se devuelve el mismo mensaje genérico.
    const hitHoneypot = parsed.error.issues.some((issue) => issue.path[0] === 'website');
    if (hitHoneypot) {
      return { status: 'error', message: 'No pudimos procesar tu mensaje.' };
    }

    const fieldErrors: ContactFormState['fieldErrors'] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (key === 'name' || key === 'email' || key === 'message') {
        fieldErrors[key] = issue.message;
      }
    }
    return { status: 'error', fieldErrors };
  }

  try {
    const headersList = await headers();
    await registerInquiry({
      source: 'CONTACT_FORM',
      customerName: parsed.data.name,
      customerEmail: parsed.data.email,
      message: parsed.data.message,
      referrer: headersList.get('referer') ?? undefined,
      userAgent: headersList.get('user-agent') ?? undefined,
    });
  } catch (error) {
    console.error('No se pudo registrar la consulta de contacto', error);
    return {
      status: 'error',
      message: 'No pudimos guardar tu mensaje. Escribinos por WhatsApp mientras tanto.',
    };
  }

  return { status: 'success' };
}
