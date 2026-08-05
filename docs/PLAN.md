# Plan de desarrollo

Siete fases. Cada una termina con algo desplegado, una etiqueta de versión y una entrada en el CHANGELOG. Ninguna fase empieza hasta que la anterior cumple su criterio de cierre.

**Regla de oro:** el sitio público se termina antes que el panel de administración. El panel es trabajo invisible; el catálogo es lo que ve el cliente y lo que muestra el portafolio.

---

## Fase 0 — Fundaciones · `v0.1.0`

**Objetivo:** que el repositorio esté listo para recibir código de negocio.

| # | Tarea | Rama |
|---|---|---|
| 0.1 | `create-next-app` con TypeScript, Tailwind, App Router, alias `@/*` | `chore/setup-proyecto` |
| 0.2 | ESLint, Prettier, Husky, lint-staged, commitlint | `chore/tooling-calidad` |
| 0.3 | Estructura de carpetas por módulos + archivos `.gitkeep` | `chore/estructura-modulos` |
| 0.4 | Prisma, `schema.prisma`, primera migración, seed | `feat/modelo-datos` |
| 0.5 | GitHub Actions: lint + typecheck + build en cada PR | `chore/ci-pipeline` |
| 0.6 | Despliegue en Vercel con base de datos de producción conectada | `chore/deploy-inicial` |
| 0.7 | README, ADR 0001, plantilla de PR, licencia | `docs/documentacion-inicial` |

**Criterio de cierre:** un `git clone` seguido de `npm install && npx prisma migrate dev && npx prisma db seed && npm run dev` funciona sin intervención manual, y la URL de Vercel responde.

---

## Fase 1 — Sitio público con contenido estático · `v0.2.0`

**Objetivo:** el diseño completo, navegable y responsive, con datos falsos. Se muestra a la dueña del negocio para recibir feedback **antes** de conectar la base de datos.

| # | Tarea |
|---|---|
| 1.1 | Sistema de diseño: tipografía, paleta, escalas de espaciado, tokens en Tailwind |
| 1.2 | Componentes base en `shared/ui`: Button, Card, Badge, Input, Container, Section |
| 1.3 | Layout público: header con navegación, menú móvil, footer |
| 1.4 | Sección Hero con imagen y dos llamadas a la acción |
| 1.5 | Sección ¿Quiénes somos? |
| 1.6 | Sección ¿Cómo funciona? (proceso de personalización en 4 pasos) |
| 1.7 | Sección Productos destacados con tarjetas |
| 1.8 | Sección Galería de trabajos |
| 1.9 | Sección FAQ con acordeón |
| 1.10 | Sección Testimonios |
| 1.11 | Sección Contacto y botón flotante de WhatsApp |
| 1.12 | Página 404 y estados vacíos |

Los datos viven en `src/shared/data/mock/*.ts` con los mismos tipos que devolverá Prisma después. Así el cambio a datos reales solo toca la capa de obtención, no los componentes.

**Criterio de cierre:** Lighthouse móvil por encima de 85 en rendimiento y accesibilidad, sin desbordes horizontales entre 320 px y 1920 px, y aprobación visual de la dueña del negocio.

---

## Fase 2 — Catálogo dinámico · `v0.3.0`

**Objetivo:** la parte con más contenido técnico del proyecto. Es la que hay que hacer bien.

| # | Tarea |
|---|---|
| 2.1 | `shared/lib/prisma.ts` con patrón singleton (evita agotar conexiones en desarrollo) |
| 2.2 | `modules/products/repository.ts` con la consulta de filtrado multifaceta |
| 2.3 | `modules/categories/repository.ts` con el árbol y sus atributos asociados |
| 2.4 | Página `/catalogo` con listado, paginación y orden |
| 2.5 | Página `/catalogo/[categoria]` con filtros específicos de la categoría |
| 2.6 | Panel de filtros sincronizado con la URL (`?material=acero&capacidad=750`) |
| 2.7 | Buscador con `debounce` sobre nombre, descripción y SKU |
| 2.8 | Página `/producto/[slug]` con galería, atributos y notas de personalización |
| 2.9 | Productos relacionados por categoría compartida |
| 2.10 | Estados de carga con Suspense y skeletons |

**La consulta clave.** El filtrado debe combinar valores del mismo atributo con OR y atributos distintos con AND. "Acero **o** aluminio, **y** de 750 ml" no es un solo `IN`: requiere una condición `AND` con un `some` por cada atributo.

```ts
const where: Prisma.ProductWhereInput = {
  isActive: true,
  categoryId: { in: categoryIds },
  AND: Object.values(filtrosPorAtributo).map((valueIds) => ({
    attributeValues: { some: { attributeValueId: { in: valueIds } } },
  })),
};
```

El error habitual es aplanar todos los valores en un único `some`, lo que devuelve productos que cumplen *cualquiera* de los filtros en vez de todos.

**Criterio de cierre:** los filtros combinados devuelven resultados correctos, el estado se comparte por URL (recargar la página mantiene los filtros), y los cambios en la base se reflejan en el sitio.

---

## Fase 3 — WhatsApp y captación · `v0.4.0`

**Objetivo:** cerrar el circuito comercial y empezar a medir.

| # | Tarea |
|---|---|
| 3.1 | Utilidad `buildWhatsAppUrl()` con mensaje pre-armado (producto, SKU, URL) |
| 3.2 | Botón de contacto en ficha de producto y botón flotante global |
| 3.3 | Lista de cotización con estado en `localStorage` y contador en el header |
| 3.4 | Página de la lista con cantidades, notas y generación del mensaje completo |
| 3.5 | Formulario de contacto con validación Zod y Server Action |
| 3.6 | Registro de cada intención de contacto en la tabla `Inquiry` |
| 3.7 | Protección contra spam en el formulario (honeypot o rate limiting) |

**Detalle que se olvida:** el registro en `Inquiry` debe ocurrir *antes* de abrir WhatsApp y no debe bloquear la navegación. Si la escritura falla, el usuario igual llega a WhatsApp.

**Criterio de cierre:** desde cualquier producto se llega a WhatsApp con el mensaje correcto en menos de dos toques, y cada clic queda registrado.

---

## Fase 4 — Autenticación y panel · `v0.5.0`

**Objetivo:** que la dueña del negocio pueda administrar todo sin llamar a nadie. La fase más larga.

| # | Tarea |
|---|---|
| 4.1 | Auth.js v5 con proveedor de credenciales y sesión JWT |
| 4.2 | `middleware.ts` protegiendo todo `/admin` |
| 4.3 | Página de login con manejo de errores |
| 4.4 | Layout del panel: barra lateral, navegación, cierre de sesión |
| 4.5 | Dashboard con conteos y últimas consultas recibidas |
| 4.6 | Listado de productos con búsqueda, filtro por estado y acciones rápidas |
| 4.7 | Formulario de producto (crear y editar) con validación compartida |
| 4.8 | Subida de imágenes a Cloudinary con arrastrar y soltar, reordenar y eliminar |
| 4.9 | Asignación de atributos según la categoría seleccionada |
| 4.10 | Gestión del árbol de categorías |
| 4.11 | Gestión de atributos y sus valores |
| 4.12 | Gestión de contenido: FAQ, testimonios, galería, ajustes del sitio |
| 4.13 | Bandeja de consultas con cambio de estado y notas internas |
| 4.14 | Revalidación de caché al guardar (`revalidatePath`, `revalidateTag`) |

**Trampas conocidas.** Borrar un producto debe borrar también sus imágenes en Cloudinary, por eso `ProductImage.imageId` existe. Borrar una categoría con productos está bloqueado a nivel de base (`onDelete: Restrict`): el panel debe mostrar un mensaje claro, no un error de servidor. Y toda validación de Zod se ejecuta también en el servidor, nunca solo en el cliente.

**Criterio de cierre:** la dueña del negocio carga un producto nuevo de principio a fin, sin ayuda, y aparece publicado.

---

## Fase 5 — SEO, rendimiento y accesibilidad · `v0.6.0`

| # | Tarea |
|---|---|
| 5.1 | `generateMetadata` dinámico en producto y categoría |
| 5.2 | Open Graph e imágenes de previsualización para compartir en redes |
| 5.3 | `sitemap.ts` y `robots.ts` |
| 5.4 | JSON-LD tipo `Product` y `BreadcrumbList` |
| 5.5 | Optimización de imágenes: formatos modernos, tamaños correctos, `priority` en el hero |
| 5.6 | Auditoría de accesibilidad: contraste, foco visible, navegación por teclado, etiquetas ARIA |
| 5.7 | Analítica y Google Search Console |
| 5.8 | Dominio propio y certificado |

**Criterio de cierre:** Lighthouse por encima de 90 en las cuatro categorías, y el sitio indexado en Google.

---

## Fase 6 — Pruebas y documentación · `v1.0.0`

| # | Tarea |
|---|---|
| 6.1 | Vitest configurado con cobertura |
| 6.2 | Tests unitarios de la construcción de filtros y de `buildWhatsAppUrl` |
| 6.3 | Tests de los esquemas Zod |
| 6.4 | Playwright: recorrido público completo (inicio → filtrar → producto → WhatsApp) |
| 6.5 | Playwright: recorrido de administración (login → crear producto → verlo publicado) |
| 6.6 | Tests añadidos al pipeline de CI |
| 6.7 | README final con capturas y diagrama de arquitectura |
| 6.8 | ADR restantes documentados |
| 6.9 | CHANGELOG y etiqueta `v1.0.0` |

**Criterio de cierre:** el CI corre en verde con tests incluidos y el README permite a un desconocido entender el proyecto en dos minutos.

---

## Fase 7 — Evolución a comercio electrónico

No se planifica en detalle todavía. El orden probable, según lo que pida el negocio:

1. Carrito real reutilizando el estado de la lista de cotización
2. Pasarela de pagos (ONVO o Tilopay para Costa Rica; Stripe si se internacionaliza)
3. Inventario con control de existencias
4. Cuentas de cliente e historial de pedidos
5. Cupones y promociones
6. Reportes y estadísticas de ventas

La arquitectura modular existe precisamente para que estas piezas se agreguen como módulos nuevos sin reescribir los actuales.

---

## Estimación

| Fase | Dedicación estimada |
|---|---|
| 0 | 3–5 días |
| 1 | 1–2 semanas |
| 2 | 2 semanas |
| 3 | 3–5 días |
| 4 | 2–3 semanas |
| 5 | 1 semana |
| 6 | 1 semana |

Entre 8 y 10 semanas a tiempo parcial. Si el plazo aprieta, la fase 5 puede recortarse y la 6 puede reducirse a los dos tests E2E; lo que no se recorta es la fase 2, porque es la que sostiene todo lo demás.

## Ritmo de trabajo

Una rama por tarea, un Pull Request por rama, commits en formato Conventional Commits. Aunque trabajes solo, escribí la descripción del PR como si fuera para otra persona: es el artefacto que un reclutador va a leer.

Al cerrar cada fase: etiqueta de versión, entrada en el CHANGELOG, captura de pantalla guardada en `docs/screenshots/` y actualización de las casillas del roadmap en el README.
