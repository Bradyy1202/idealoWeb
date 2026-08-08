import type { Metadata } from 'next';
import { Poppins, Righteous } from 'next/font/google';
import { DEFAULT_OG_IMAGE } from '@/shared/lib/og-image';
import { GoogleAnalytics } from '@/shared/ui/google-analytics';
import './globals.css';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? 'Idealo';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

// Títulos: redondeada y con carácter, igual que el rótulo del logo.
const righteous = Righteous({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-righteous',
  display: 'swap',
});

// Cuerpo e interfaz: geométrica y amigable.
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} · Regalos personalizados por sublimación`,
    template: `%s · ${siteName}`,
  },
  description:
    'Botellas, tazas, textiles y accesorios personalizados con tu diseño. Cotizá por WhatsApp.',
  openGraph: {
    type: 'website',
    locale: 'es_CR',
    siteName,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
  },
  // Sin variable todavía: se completa cuando la usuaria verifique el sitio en
  // Google Search Console y cargue el token en NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION.
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CR" className={`${righteous.variable} ${poppins.variable}`}>
      <body>
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
