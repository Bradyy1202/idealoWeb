import type { Metadata } from 'next';
import { getContactSettings, getHeroSettings, getAboutSettings } from '@/modules/content/service';
import { ContactSettingsForm } from './_components/contact-settings-form';
import { HeroSettingsForm } from './_components/hero-settings-form';
import { AboutSettingsForm } from './_components/about-settings-form';

export const metadata: Metadata = { title: 'Ajustes del sitio | Panel' };

export default async function AjustesPage() {
  const [contact, hero, about] = await Promise.all([
    getContactSettings(),
    getHeroSettings(),
    getAboutSettings(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Ajustes del sitio</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Textos y datos que aparecen en distintas partes del sitio público.
      </p>

      <div className="mt-8 flex max-w-2xl flex-col gap-6">
        <ContactSettingsForm initialValues={contact} />
        <HeroSettingsForm initialValues={hero} />
        <AboutSettingsForm initialValues={about} />
      </div>
    </div>
  );
}
