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

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <CategoriesSection />
      <HowItWorksSection />
      <FeaturedProductsSection />
      <GallerySection />
      <AboutSection />
      <TestimonialsSection />
      <FaqSection />
      <ContactSection />
    </>
  );
}
