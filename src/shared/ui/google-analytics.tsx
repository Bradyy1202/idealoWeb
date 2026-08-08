import Script from 'next/script';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * No renderiza nada si falta la variable (tarea 5.7): todavía no existe una
 * propiedad de Google Analytics creada para este sitio, así que se agrega el
 * enganche listo para cuando la usuaria cree la propiedad y cargue el ID de
 * medición (formato "G-XXXXXXXXXX") en NEXT_PUBLIC_GA_MEASUREMENT_ID.
 */
export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
