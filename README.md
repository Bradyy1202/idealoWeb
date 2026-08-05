# Catálogo digital de sublimación

Plataforma web para un emprendimiento de sublimación en funcionamiento. Sustituye la atención manual por mensajería —enviar fotos una por una, repetir precios, explicar opciones— por un catálogo navegable con panel de administración autogestionable.

**Demo:** _(pendiente)_ · **Panel admin:** _(pendiente)_

> Reemplazá esta línea por una captura o GIF del sitio funcionando. Es lo primero que mira cualquier persona que abra el repositorio.

---

## El problema

El negocio gestionaba todo su catálogo por WhatsApp: cada consulta implicaba reenviar fotografías, repetir descripciones y explicar el proceso de personalización desde cero. El tiempo invertido en consultas repetitivas crecía con las ventas y no escalaba.

## La solución

Un catálogo digital público con filtrado por características, más un panel privado desde el que la dueña actualiza productos, imágenes y contenido sin tocar código. La conversión sigue ocurriendo por WhatsApp, pero el cliente llega con el producto ya elegido y un mensaje pre-armado.

## Funcionalidades

- Catálogo con categorías, filtros por características combinables y buscador
- Ficha de producto con galería, detalles de personalización y contacto directo
- Lista de cotización: el cliente agrupa varios productos y genera un solo mensaje
- Panel de administración protegido con CRUD completo de productos, categorías e imágenes
- Contenido editable (hero, FAQ, testimonios, galería, datos de contacto) sin despliegues
- Registro de consultas para medir qué productos generan interés real
- Diseño responsive y optimizado para SEO

## Stack

| Capa          | Tecnología                                      |
| ------------- | ----------------------------------------------- |
| Framework     | Next.js 16 (App Router) · TypeScript            |
| Estilos       | Tailwind CSS · shadcn/ui                        |
| Base de datos | PostgreSQL (Neon) · Prisma ORM                  |
| Autenticación | Auth.js v5                                      |
| Imágenes      | Cloudinary                                      |
| Validación    | Zod · React Hook Form                           |
| Calidad       | ESLint · Prettier · Husky · Vitest · Playwright |
| Despliegue    | Vercel · GitHub Actions                         |

## Arquitectura

El proyecto se organiza por **módulos de dominio** en lugar de por tipo de archivo. Cada módulo es autocontenido y solo depende de `shared/`, de modo que agregar carrito, pagos o inventario no requiere tocar los módulos existentes.

```
src/
├── app/
│   ├── (public)/              # inicio, catálogo, producto, contacto
│   ├── (admin)/               # panel protegido por middleware
│   └── api/
├── modules/
│   ├── products/
│   │   ├── schema.ts          # validación con Zod
│   │   ├── repository.ts      # único punto de acceso a Prisma
│   │   ├── service.ts         # lógica de negocio
│   │   ├── actions.ts         # Server Actions
│   │   └── components/
│   ├── categories/
│   ├── media/
│   ├── inquiries/
│   ├── content/
│   └── auth/
├── shared/
│   ├── ui/                    # componentes reutilizables
│   ├── lib/                   # cliente Prisma, Cloudinary, utilidades
│   ├── hooks/
│   └── types/
└── config/
prisma/
├── schema.prisma
├── seed.ts
└── migrations/
docs/
└── adr/                       # decisiones de arquitectura documentadas
```

Las decisiones técnicas relevantes están documentadas en [`docs/adr/`](docs/adr/).

## Modelo de datos

La decisión central es el **modelo híbrido de categorías y atributos**. Las categorías forman un árbol poco profundo (Botellas, Tazas, Textiles) y las características transversales —material, capacidad, uso, color, talla— son atributos que se combinan libremente. Una botella puede ser térmica, deportiva y de acero inoxidable simultáneamente sin duplicar registros ni anidar categorías artificialmente.

`CategoryAttribute` define qué filtros se muestran en cada categoría, de modo que la vista de textiles ofrece tallas y la de botellas ofrece capacidad.

Ver [`prisma/schema.prisma`](prisma/schema.prisma) para el esquema completo.

## Instalación

Requiere Node.js 20 o superior y una base de datos PostgreSQL.

```bash
git clone https://github.com/usuario/repositorio.git
cd repositorio
npm install

cp .env.example .env.local
# completá las variables

npx prisma migrate dev
npx prisma db seed

npm run dev
```

El sitio queda en `http://localhost:3000` y el panel en `/admin`. Las credenciales iniciales son las definidas en `SEED_ADMIN_EMAIL` y `SEED_ADMIN_PASSWORD`.

## Variables de entorno

Todas están descritas en [`.env.example`](.env.example). Las imprescindibles:

| Variable                      | Descripción                                         |
| ----------------------------- | --------------------------------------------------- |
| `DATABASE_URL`                | Cadena de conexión a PostgreSQL                     |
| `DIRECT_URL`                  | Conexión sin pooling, requerida por las migraciones |
| `AUTH_SECRET`                 | Secreto de sesión (`openssl rand -base64 32`)       |
| `CLOUDINARY_*`                | Credenciales de almacenamiento de imágenes          |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número en formato internacional sin `+`             |

## Scripts

```bash
npm run dev            # servidor de desarrollo
npm run build          # compilación de producción
npm run lint           # ESLint
npm run typecheck      # verificación de tipos
npm run test           # Vitest
npm run test:e2e       # Playwright
npm run db:migrate     # aplicar migraciones
npm run db:seed        # poblar datos iniciales
npm run db:studio      # explorador visual de la base
```

## Flujo de trabajo

Se sigue GitHub Flow: `main` siempre desplegable, ramas por funcionalidad y Pull Requests con revisión antes de integrar. Los commits siguen la convención [Conventional Commits](https://www.conventionalcommits.org/), validada automáticamente por commitlint.

```
feat/catalogo-filtros
fix/imagen-movil
chore/configuracion-eslint
docs/adr-categorias
```

Cada fase del roadmap cierra con una etiqueta de versión.

## Roadmap

- [x] Fase 0 — Fundaciones: repositorio, CI, esquema de datos
- [ ] Fase 1 — Sitio público con contenido estático
- [ ] Fase 2 — Catálogo dinámico con filtros y buscador
- [ ] Fase 3 — Integración con WhatsApp y lista de cotización
- [ ] Fase 4 — Autenticación y panel de administración
- [ ] Fase 5 — SEO, rendimiento y accesibilidad
- [ ] Fase 6 — Pruebas automatizadas y documentación final
- [ ] Fase 7 — Carrito, pasarela de pagos e inventario

## Licencia

MIT
