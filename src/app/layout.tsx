import type { Metadata } from 'next';
import { Poppins, Righteous } from 'next/font/google';
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
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CR" className={`${righteous.variable} ${poppins.variable}`}>
      <body>{children}</body>
    </html>
  );
}
