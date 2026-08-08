import { getContactSettings } from '@/modules/content/service';
import { SiteFooter } from './_components/site-footer';
import { SiteHeader } from './_components/site-header';
import { WhatsappFloatButton } from './_components/whatsapp-float-button';

/**
 * Layout del sitio público. El panel de administración tendrá el suyo, así
 * que la barra y el pie no viven en el layout raíz.
 */
export default async function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const contact = await getContactSettings();

  return (
    <>
      <SiteHeader contact={contact} />
      <main>{children}</main>
      <SiteFooter contact={contact} />
      <WhatsappFloatButton whatsapp={contact.whatsapp} />
    </>
  );
}
