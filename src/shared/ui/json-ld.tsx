/**
 * Sale como <script type="application/ld+json">, no como HTML de usuario:
 * `data` siempre lo arma el propio servidor a partir de datos de la base, no
 * un formulario. El escape de "<" es una defensa extra por si algún texto
 * (nombre de producto, etc.) llegara a contener "</script>".
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
