# Registro de cambios

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).
Versionado según [SemVer](https://semver.org/lang/es/).

## [No publicado]

## [1.0.0] — Fases 1 a 6: catálogo completo, panel, SEO y pruebas

### Agregado

**Fase 1 — Sitio público con contenido estático**

- Home, catálogo, ficha de producto y páginas informativas con contenido estático inicial
- Sistema de diseño base (componentes reutilizables, tipografía, paleta)

**Fase 2 — Catálogo dinámico**

- Cliente Prisma en patrón singleton (`shared/lib/prisma.ts`)
- Filtrado multifaceta real: valores del mismo atributo combinados con OR, atributos distintos con AND (`buildProductWhere`)
- Árbol de categorías con atributos filtrables por categoría (`CategoryAttribute`)
- Estado de los filtros en la URL, para poder compartir un catálogo ya filtrado

**Fase 3 — WhatsApp y captación**

- Enlace de WhatsApp con mensaje pre-armado desde la ficha de producto
- Lista de cotización: el cliente agrupa varios productos en un solo mensaje
- Formulario de contacto con validación Zod y protección anti-spam (honeypot)

**Fase 4 — Autenticación y panel de administración**

- Autenticación con Auth.js v5 y middleware que protege `/admin/(panel)`
- CRUD completo de productos, categorías y atributos, con imágenes en Cloudinary
- Módulo de contenido editable: FAQ, testimonios, galería y ajustes del sitio (hero, contacto, quiénes somos)
- Bandeja de consultas con estado y notas internas
- Corregida la pérdida de sesión al enviar formularios del panel — ver [ADR 0002](docs/adr/0002-boton-explicito-en-formularios-del-panel.md)

**Fase 5 — SEO, rendimiento y accesibilidad**

- Metadatos por página (`generateMetadata`), `alternates.canonical`, Open Graph y Twitter Card
- `sitemap.ts`, `robots.ts` y datos estructurados (JSON-LD) en producto y categoría
- Menú móvil accesible: semántica de diálogo, trampa de foco, cierre con Escape
- `next/image` con `sizes` correcto en toda imagen de producto; `priority` solo en el hero
- Integración opcional de Google Analytics 4 y verificación de Google Search Console

**Fase 6 — Pruebas automatizadas y documentación**

- Pruebas unitarias con Vitest y cobertura: filtrado multifaceta, esquemas Zod, generación de enlaces de WhatsApp
- Pruebas end-to-end con Playwright contra una compilación de producción: recorrido público y recorrido de administración
- CI en GitHub Actions: formato, lint, tipos, pruebas unitarias con cobertura, migración y siembra contra PostgreSQL descartable, build y pruebas end-to-end
- [ADR 0002](docs/adr/0002-boton-explicito-en-formularios-del-panel.md) y [ADR 0003](docs/adr/0003-estrategia-de-pruebas.md) documentando decisiones no evidentes desde el código
- README final con diagrama de arquitectura y capturas del sitio y del panel

## [0.1.0] — Fase 0: Fundaciones

### Agregado

- Configuración inicial del proyecto con Next.js 16, TypeScript y Tailwind CSS
- Esquema de datos completo con modelo híbrido de categorías y atributos
- Seed con catálogo inicial de productos de sublimación
- Herramientas de calidad: ESLint, Prettier, Husky, commitlint
- Pipeline de integración continua en GitHub Actions
- Documentación inicial: README, plan de desarrollo y ADR 0001
