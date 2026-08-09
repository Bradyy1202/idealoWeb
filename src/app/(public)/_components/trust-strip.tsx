import { Marquee } from '@/shared/ui/marquee';

/**
 * La plantilla original mostraba logos de clientes (grises, en grid) — no
 * existen para Idealo, y fabricarlos sería mentir sobre el negocio. En su
 * lugar, la franja usa hechos reales y verificables del propio catálogo, en
 * una cinta continua sobre un bloque de tinta oscura — el mismo recurso que
 * usa releaf.bio para frases cortas entre secciones fotográficas.
 */
const facts = [
  'Respuesta el mismo día hábil',
  '2 a 4 días de producción',
  'Envíos a todo Costa Rica',
  'Sublimación que no se despinta',
];

export function TrustStrip() {
  return (
    <div className="px-3 py-3 md:px-5 md:py-5">
      <div className="bg-ink text-ink-foreground overflow-hidden rounded-[1.75rem] py-8 md:rounded-[2.25rem] md:py-10">
        <Marquee items={facts} />
      </div>
    </div>
  );
}
