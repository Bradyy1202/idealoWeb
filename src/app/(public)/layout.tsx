import { SiteFooter } from './_components/site-footer';
import { SiteHeader } from './_components/site-header';
import { WhatsappFloatButton } from './_components/whatsapp-float-button';

/**
 * Layout del sitio público. El panel de administración tendrá el suyo, así
 * que la barra y el pie no viven en el layout raíz.
 */
export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      <WhatsappFloatButton />
    </>
  );
}
