# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Dos audiencias con el mismo peso: personas individuales que compran regalos personalizados por sublimación (tazas, botellas, textiles) para uso propio u ocasiones puntuales, y empresas que hacen pedidos al por mayor de artículos promocionales/corporativos (por ejemplo, botellas con logo en cantidad). Ambas navegan el mismo catálogo público y cotizan por WhatsApp; ninguna compra en línea.

La dueña del negocio es la usuaria del panel de administración: gestiona productos, categorías, atributos y contenido del sitio sin ayuda de un desarrollador.

## Product Purpose

Catálogo digital para **Idealo**, un emprendimiento real de personalización por sublimación en San Carlos, Costa Rica (botellas, tazas, textiles y accesorios). El sitio muestra el catálogo filtrable y dirige cada intención de compra a WhatsApp — no hay compra en línea. Un panel de administración le permite a la dueña del negocio autogestionar el catálogo y el contenido del sitio sin intervención técnica.

## Positioning

El catálogo no modela productos con etiquetas planas ni subcategorías rígidas: separa categorías (qué es el producto — Botellas, Tazas, Textiles) de atributos transversales (material, capacidad, uso, color, talla), así que un mismo producto se filtra por cualquier combinación de características sin duplicarse ni forzarlo a una sola rama. Ver `docs/adr/0001-categorias-vs-atributos.md`. Esa separación es también lo que permite que la dueña agregue categorías, atributos y productos nuevos desde el panel sin migraciones ni intervención de un desarrollador — algo que un catálogo estático o modelado con subcategorías no podría ofrecer.

## Operating Context

- El negocio atiende tanto pedidos individuales (regalos, uso personal) como pedidos corporativos al por mayor (artículos promocionales con logo, en cantidad).
- Ubicación real del negocio: San Carlos, Costa Rica. (El seed usa "Alajuela" como marcador de posición; debe reemplazarse antes de producción.)
- Toda conversión ocurre por WhatsApp: el cliente arma su interés en el sitio y cierra el pedido por chat. No hay carrito de compra ni pasarela de pago en esta fase.
- El plan de desarrollo (`docs/PLAN.md`) define 7 fases; el proyecto está en Fase 1 (sitio público con contenido estático) — Fase 0 (modelo de datos, migración, seed) está cerrada. El sitio público tiene sus doce secciones (hero, confianza, categorías, cómo funciona, destacados, galería, quiénes somos, testimonios, FAQ, contacto, footer, botón flotante de WhatsApp) y página 404, todas con datos mock que replican `prisma/seed.ts`. `/catalogo` y `/producto/[slug]` no existen todavía: son Fase 2, detrás de conectar Prisma.
- Fase 7 (no planificada en detalle) contempla evolucionar hacia comercio electrónico real (carrito, pagos, inventario, cuentas de cliente) reutilizando la arquitectura modular actual.

## Capabilities and Constraints

- Sin compra en línea: los precios son referenciales ("desde ₡X"), nunca transaccionales, hasta que exista una fase de e-commerce.
- Árbol de categorías de máximo 2 niveles; las características transversales (material, capacidad, uso, color, talla) son atributos combinables, nunca subcategorías (ver ADR 0001).
- El filtrado combina valores del mismo atributo con OR y atributos distintos con AND.
- Borrar un producto debe borrar también sus imágenes en Cloudinary (`ProductImage.imageId`).
- Borrar una categoría con productos está bloqueado a nivel de base de datos (`onDelete: Restrict`); el panel debe mostrarlo como un mensaje claro, no un error de servidor.
- Surtido de categorías: el seed actual (Botellas, Tazas, Textiles → Camisetas/Gorras/Bolsos, Accesorios) es un subconjunto del catálogo real — el negocio vende categorías adicionales todavía sin especificar. No inventar cuáles son; confirmar con la dueña antes de darlas por definitivas.
- Arquitectura por módulos en `src/modules/`: un módulo nunca importa de otro, para poder agregar carrito, pagos e inventario más adelante sin reescribir lo existente.

## Brand Commitments

- Nombre de marca confirmado: **Idealo**.
- Voz confirmada por la dueña, ya cargada en `prisma/seed.ts`: primera persona del plural, afirmaciones cortas terminadas en punto ("Personalizamos cada detalle para hacerlo único.", "Creamos productos que dejan huella."). Llamados a la acción en infinitivo: "Explorar catálogo", "Solicitar cotización".
- Identidad visual: **rediseño completo a pedido explícito del cliente**, reemplazando el mundo "La pieza" (fondo oscuro, campo de color por categoría, Big Shoulders + dorsal). El cliente pegó una plantilla de referencia (landing de agencia de diseño en shadcn/ui + Framer Motion, tema claro, `rounded-3xl` en todo) y pidió "reemplazo literal", incluyendo instalar shadcn/ui y framer-motion. El sistema actual: tema claro shadcn (new-york), primary azul heredado de la paleta anterior (`oklch(0.47 0.22 264)`, ~`#1447d3`), tipografía Archivo única (se dejó de usar Big Shoulders), esquinas `rounded-3xl`, verde reservado solo para WhatsApp. Componentes base en `src/shared/ui/` (shadcn: `button.tsx`, `input.tsx`, `textarea.tsx`, `label.tsx`; propios: `card.tsx`, `badge.tsx`, `section.tsx`, `container.tsx`, `empty-state.tsx`). `DESIGN.md` se escribe cuando el sitio público esté más maduro, desde lo construido.
- La plantilla de referencia mostraba logos de clientes falsos, un equipo de 4 personas inventado, y enlaces a páginas que no existen (Blog, Carreras, Política de privacidad) — todo eso se omitió o se reemplazó por contenido real (hechos verificables del negocio, sin equipo ficticio, sin páginas fantasma) siguiendo la regla de no fabricar contenido.

## Evidence on Hand

Datos reales del negocio, ya cargados en `prisma/seed.ts`:

- WhatsApp `50685097011`, correo `bradycmc1@gmail.com`.
- Ubicación: San Carlos, Costa Rica. Horario: lunes a viernes 8:00–20:00, sábados 9:00–17:00.
- Envíos a todo Costa Rica.
- Copy real del hero y de "quiénes somos" escrito por la dueña.

Siguen siendo marcadores de posición y **no deben presentarse como reales**: los tres testimonios, los enlaces de Instagram y Facebook (`instagram.com/ejemplo`), y todos los productos con sus precios y SKU. No hay fotos de producto en el repositorio todavía. No fabricar testimonios, cifras ni fotos: usar marcadores explícitos hasta que se entregue el material real.

## Product Principles

1. La conversión ocurre por WhatsApp, no por checkout: cada pantalla de producto debe facilitar el contacto, no simular un carrito de compra.
2. Categorías responden a "qué es"; atributos responden a "cómo es". Nunca modelar una característica transversal como subcategoría.
3. El panel de administración es la funcionalidad que sostiene el negocio a largo plazo: la dueña debe poder operar el catálogo completo sin depender de un desarrollador.
4. La arquitectura modular (`src/modules/`, sin imports cruzados entre módulos) existe para que carrito, pagos e inventario se agreguen después sin reescribir lo existente — ninguna decisión de hoy debe cerrarle la puerta a esa evolución.
5. Atiende por igual a compradores individuales y corporativos: ningún flujo (cotización, pedido mínimo, presentación de precios) debe asumir que uno es más importante que el otro.
