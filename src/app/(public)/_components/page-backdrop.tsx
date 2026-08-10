'use client';

import { AetherRibbonMesh } from '@/shared/ui/aether-ribbon-mesh';

/**
 * Fondo de toda la página: el haz de hilos ocupa la ventana entera detrás
 * del contenido, no una tarjeta.
 *
 * `fixed` y no `absolute`: así el haz se queda quieto mientras la página se
 * desplaza, como una textura del sitio, en vez de irse hacia arriba con el
 * scroll. `pointer-events-none` evita que se coma los clics — la malla igual
 * reacciona al puntero porque escucha en `window`, no en su contenedor.
 *
 * `z-0` y no `-z-10`: con z negativo el fondo opaco del `body` se pinta
 * encima y no se ve nada. El contenido va por delante con `relative z-10`
 * desde el layout. Las secciones con color propio tapan el haz; las que son
 * transparentes lo dejan pasar.
 */
export function PageBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      {/* opacity 0.26 y no 0.4: a 0.4 los hilos cruzaban los párrafos de
          cuerpo y le comían legibilidad al texto, que es contenido y manda
          sobre la decoración. Sigue viéndose en todas las secciones claras. */}
      <AetherRibbonMesh mode="lines" ribbons={26} colors={['#1d5fa4']} opacity={0.26} />
    </div>
  );
}
