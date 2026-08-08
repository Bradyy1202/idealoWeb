/**
 * Imagen de reserva para compartir en redes (Open Graph / Twitter Card),
 * usada en cualquier página que no tenga una foto propia (catálogo,
 * categoría, producto sin fotos todavía). Es un PNG estático
 * (`public/og-default.png`), no el file convention `opengraph-image.tsx` de
 * Next.js: ese convention NO se hereda a rutas hijas (cada segmento
 * necesitaría su propio archivo — confirmado probando contra el build de
 * producción), así que un archivo estático referenciado a mano en cada
 * `generateMetadata`/`metadata` es más simple y predecible que pelear con
 * esa herencia. Se generó una única vez con `ImageResponse` de `next/og`
 * (fondo `#4338ca`, texto blanco "Idealo" + tagline) y se descargó como PNG;
 * para regenerarlo tras un cambio de marca, restaurar un archivo
 * `opengraph-image.tsx` temporal con ese mismo contenido, visitar su ruta y
 * volver a guardar el PNG resultante en `public/og-default.png`.
 */
export const DEFAULT_OG_IMAGE = {
  url: '/og-default.png',
  width: 1200,
  height: 630,
  alt: 'Idealo — Regalos personalizados por sublimación',
};
