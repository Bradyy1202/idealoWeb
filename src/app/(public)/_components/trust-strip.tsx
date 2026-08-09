import { Marquee } from '@/shared/ui/marquee';

/**
 * La plantilla original mostraba logos de clientes (grises, en grid) — no
 * existen para Idealo, y fabricarlos sería mentir sobre el negocio. En su
 * lugar, la franja usa hechos reales y verificables del propio catálogo.
 *
 * Todos salen del contenido ya publicado (`prisma/seed.ts` y las respuestas
 * del FAQ): tiempos de producción, cobertura de envíos, formato de archivo,
 * pedido mínimo. Nada acá es una promesa inventada — si agregás más, que
 * salgan de la misma fuente.
 */
const facts = [
  'Respuesta el mismo día hábil',
  '2 a 4 días de producción',
  'Envíos a todo Costa Rica',
  'Sublimación que no se despinta',
  'Pedidos desde una unidad',
  'Botellas, tazas, textiles y accesorios',
  'Te ayudamos con el diseño',
  'Archivos PNG o JPG a 300 dpi',
  'Pedidos corporativos',
];

export function TrustStrip() {
  return (
    <div className="px-3 py-3 md:px-5 md:py-5">
      {/* Verde profundo de marca en vez del casi-negro `--ink`: con la letra
          más chica, el bloque oscuro pesaba más que el mensaje. */}
      {/* rounded-[2rem] y no rounded-full: con `prefers-reduced-motion` la
          cinta se vuelve estática y envuelve en varias líneas, y ahí una
          cápsula perfecta se deforma. */}
      <div className="bg-success-foreground text-card overflow-hidden rounded-[2rem] py-4 md:py-5">
        <Marquee items={facts} />
      </div>
    </div>
  );
}
