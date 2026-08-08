# ADR 0003 — Pruebas unitarias sobre lógica pura + dos recorridos end-to-end, sin cobertura exhaustiva

- **Estado:** aceptada
- **Fecha:** 2026-08-08

## Contexto

El proyecto llegó a la Fase 6 sin ninguna prueba automatizada. Con un solo desarrollador y un catálogo que ya no es un prototipo (produce consultas reales de clientes), el riesgo no es la ausencia total de pruebas sino gastar el tiempo disponible en el lugar equivocado: perseguir un porcentaje de cobertura no protege contra el tipo de regresión que más le costaría al negocio, que es un recorrido completo roto (por ejemplo, que el botón de WhatsApp deje de armar el mensaje, o que crear un producto en el panel no lo publique en el catálogo).

## Decisión

Dos capas, cada una con un objetivo distinto y deliberadamente acotado:

**Unitarias (Vitest)** — solo lógica pura, sin efectos secundarios ni base de datos:

- `buildProductWhere` (`src/modules/products/repository.ts`): la construcción del filtro multifaceta es la pieza más delicada del proyecto (ver [ADR 0001](0001-categorias-vs-atributos.md)) y el error clásico —aplanar todos los valores en un solo `some` en vez de un `some` por atributo— es silencioso: no rompe el build, solo devuelve resultados incorrectos. Es exactamente el tipo de bug que una prueba atrapa y una revisión visual no.
- Esquemas Zod representativos (`schema.test.ts` en `products`, `inquiries`, `content`): casos límite de coerción y validación (precio vacío tratado como "sin precio", honeypot anti-spam, límites de paginación) que son fáciles de romper sin darse cuenta al tocar un formulario.
- `buildWhatsAppUrl` (`src/shared/lib/whatsapp.ts`): formato del número y del mensaje pre-armado, el paso final de la conversión.

No se escribieron pruebas unitarias de componentes React ni de Server Actions: requieren mockear Prisma o el DOM, y ese esfuerzo rinde menos que cubrir el mismo camino con Playwright contra la aplicación real.

**End-to-end (Playwright)** — dos recorridos completos, contra una compilación de producción (`next build && next start`) y una base de datos real, sin mocks:

- **Público**: inicio → filtrar catálogo → ficha de producto → enlace de WhatsApp con el mensaje esperado.
- **Administración**: login → crear producto → verlo publicado en el catálogo. Este recorrido es también la prueba de regresión del bug documentado en [ADR 0002](0002-boton-explicito-en-formularios-del-panel.md): si alguien reintroduce un `type="submit"` en un formulario del panel, este test falla en el paso de login o de creación.

Ambos corren en CI (`.github/workflows/ci.yml`) contra un contenedor `postgres:16-alpine` descartable, migrado y sembrado antes del build — no contra una base mockeada, porque la portada (`/`) se prerrenderiza en build time leyendo `SiteSetting` real, así que una base falsa rompería el build mismo, no solo las pruebas.

No hay una meta numérica de cobertura. `test:coverage` existe para ver qué queda sin ejercitar, no como umbral que bloquee el CI.

## Consecuencias

**Positivas**

- Las pruebas existentes cubren donde de verdad se rompió algo antes (el filtrado multifaceta, la sesión del panel) en vez de perseguir cobertura por cobertura.
- El recorrido E2E de administración corre contra el build de producción real, así que valida a la vez UI, Server Actions, base de datos y el middleware de autenticación — ninguna prueba unitaria con mocks lo haría con la misma confianza.
- Añadir un tercer módulo de dominio (por ejemplo, para la Fase 7) tiene un patrón claro que seguir: función pura de filtrado → test unitario; flujo de usuario nuevo → ¿vale la pena un tercer recorrido E2E o alcanza con extender uno existente?

**Negativas**

- Los componentes React y las Server Actions no tienen pruebas unitarias propias; un bug de UI que no rompa ninguno de los dos recorridos E2E no se detecta automáticamente.
- Las pruebas E2E crean y borran datos reales en la base configurada por `DATABASE_URL` durante la ejecución. Ya causó una fuga real de datos de prueba en desarrollo (limpieza que buscaba por un campo no visible en la tabla del panel); se corrigió dando nombre y slug únicos por corrida (`Date.now()`) para que la limpieza en `afterEach` siempre encuentre lo que creó. Correr `test:e2e` contra una base que no sea desechable requiere el mismo cuidado.

## Alternativas descartadas

- **Cobertura mínima obligatoria (ej. 80 %) que bloquee el CI** — hubiera empujado a escribir pruebas triviales de componentes solo para subir el número, sin proteger los recorridos que de verdad importan.
- **Mockear Prisma en las pruebas de administración** — es el enfoque más rápido, pero el bug real que este recorrido debía atrapar (la pérdida de sesión de [ADR 0002](0002-boton-explicito-en-formularios-del-panel.md)) ocurría exactamente en la capa que un mock elimina: el middleware, la cookie de sesión y la Server Action ejecutándose de verdad. Una prueba con Prisma mockeado habría pasado igual con el bug presente. Para un recorrido tan corto como "crear producto → verlo publicado", correrlo contra la base real cuesta poco y elimina esa clase de falso positivo por completo.
