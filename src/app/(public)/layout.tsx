import { getContactSettings } from '@/modules/content/service';
import { PageBackdrop } from './_components/page-backdrop';
import { SiteFooter } from './_components/site-footer';
import { SiteNav } from './_components/site-nav';

/**
 * Layout del sitio público. El panel de administración tendrá el suyo, así
 * que la barra y el pie no viven en el layout raíz. Sin botón flotante de
 * WhatsApp: la conversión vive en los botones de cada sección y en la
 * cápsula de navegación, no en un elemento fijo que tape contenido.
 */
export default async function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const contact = await getContactSettings();

  return (
    <>
      <PageBackdrop />
      <SiteNav contact={contact} />
      {/* relative z-10: el contenido va por delante del fondo animado. */}
      <main className="relative z-10">{children}</main>
      <SiteFooter contact={contact} />
    </>
  );
}
