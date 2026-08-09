import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/shared/lib/og-image';
import {
  getContactSettings,
  getHeroSettings,
  getAboutSettings,
  getFaqs,
  getTestimonials,
  getGalleryItems,
} from '@/modules/content/service';
import { AboutSection } from './_components/about-section';
import { CategoriesSection } from './_components/categories-section';
import { ContactSection } from './_components/contact-section';
import { FaqSection } from './_components/faq-section';
import { FeaturedProductsSection } from './_components/featured-products-section';
import { GallerySection } from './_components/gallery-section';
import { Hero } from './_components/hero';
import { HowItWorksSection } from './_components/how-it-works-section';
import { TestimonialsSection } from './_components/testimonials-section';
import { TrustStrip } from './_components/trust-strip';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: { url: '/', images: [DEFAULT_OG_IMAGE] },
};

export default async function Home() {
  const [contact, hero, about, faqs, testimonials, galleryItems] = await Promise.all([
    getContactSettings(),
    getHeroSettings(),
    getAboutSettings(),
    getFaqs(),
    getTestimonials(),
    getGalleryItems(),
  ]);

  return (
    <>
      <Hero hero={hero} />
      <TrustStrip />
      <CategoriesSection />
      <HowItWorksSection />
      <FeaturedProductsSection whatsapp={contact.whatsapp} />
      <GallerySection items={galleryItems} />
      <AboutSection about={about} />
      <TestimonialsSection testimonials={testimonials} />
      <FaqSection faqs={faqs} whatsapp={contact.whatsapp} />
      <ContactSection contact={contact} />
    </>
  );
}
