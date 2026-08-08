'use client';

import type { ComponentPropsWithoutRef } from 'react';
import { registerWhatsAppClickAction } from '../actions';

type WhatsappInquiryLinkProps = Omit<
  ComponentPropsWithoutRef<'a'>,
  'href' | 'target' | 'rel' | 'onClick'
> & {
  href: string;
  source: 'WHATSAPP_PRODUCT' | 'WHATSAPP_FLOAT';
  productId?: string;
  productSnapshot?: string;
};

/**
 * Envuelve el enlace a WhatsApp con el registro de la consulta. No espera la
 * respuesta del server action (fire-and-forget): la navegación a WhatsApp
 * nunca debe depender de que el registro termine ni de que tenga éxito.
 */
export function WhatsappInquiryLink({
  href,
  source,
  productId,
  productSnapshot,
  ...anchorProps
}: WhatsappInquiryLinkProps) {
  function handleClick() {
    void registerWhatsAppClickAction({ source, productId, productSnapshot });
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      {...anchorProps}
    />
  );
}
