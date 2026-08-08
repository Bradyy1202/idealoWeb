import { MessageCircle } from 'lucide-react';
import { contact } from '@/shared/data/mock/site';
import { buildWhatsAppUrl } from '@/shared/lib/whatsapp';
import { WhatsappInquiryLink } from '@/modules/inquiries/components/whatsapp-inquiry-link';

const whatsappHref = buildWhatsAppUrl(contact.whatsapp, 'Hola, quiero más información.');

/**
 * Botón flotante global. Sin estado ni scroll listener: se queda fijo en
 * pantalla en vez de aparecer condicionalmente, así nunca compite con el CTA
 * de la sección de contacto por un mecanismo de aparición.
 */
export function WhatsappFloatButton() {
  return (
    <WhatsappInquiryLink
      href={whatsappHref}
      source="WHATSAPP_FLOAT"
      aria-label="Escribir por WhatsApp"
      className="bg-whatsapp text-whatsapp-foreground fixed right-5 bottom-5 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform duration-200 ease-out hover:scale-105 active:scale-95 md:h-auto md:w-auto md:gap-2.5 md:px-6 md:py-4"
    >
      <MessageCircle size={24} strokeWidth={2} aria-hidden />
      <span className="hidden text-sm font-semibold md:inline">WhatsApp</span>
    </WhatsappInquiryLink>
  );
}
