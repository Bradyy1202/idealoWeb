# Catálogo digital de sublimación

Catálogo web para un emprendimiento real de sublimación. Sin compra en línea: la conversión ocurre por WhatsApp. Incluye panel de administración autogestionable.

El plan por fases está en `docs/PLAN.md`. Las decisiones de arquitectura están en `docs/adr/`. **Antes de empezar una tarea, leé la fase correspondiente del plan.**

## Idioma

Todo lo visible para el usuario final va en español de Costa Rica. Nombres de variables, funciones, tipos y ramas en inglés. Comentarios de código y documentación en español. Los mensajes de commit en español, en formato Conventional Commits.

## Arquitectura por módulos

El código se organiza por dominio en `src/modules/`, no por tipo de archivo. Cada módulo contiene `schema.ts`, `repository.ts`, `service.ts`, `actions.ts` y `components/`.

**Un módulo nunca importa de otro módulo.** Si dos módulos necesitan lo mismo, va en `src/shared/`. Esta regla es la que permite agregar carrito, pagos e inventario más adelante sin reescribir lo existente; si la rompés, el proyecto pierde su razón de ser.

`repository.ts` es el único archivo de cada módulo que puede importar Prisma. Los componentes y las Server Actions pasan siempre por `service.ts`.

## Modelo de datos

La decisión central: las categorías forman un árbol de máximo dos niveles que responde a *qué es* el producto (Botellas, Tazas, Textiles → Camisetas). Las características transversales —material, capacidad, uso, color, talla— son **atributos**, no subcategorías, porque se combinan libremente.

Nunca crees una subcategoría llamada "Térmicas" o "De acero inoxidable". Eso es un `AttributeValue`. Ver `docs/adr/0001-categorias-vs-atributos.md`.

`CategoryAttribute` define qué filtros se muestran en cada categoría.

## Filtrado multifaceta

Valores del mismo atributo se combinan con OR; atributos distintos con AND. "Acero **o** aluminio, **y** de 750 ml" requiere un `some` por atributo dentro de un `AND`:

```ts
AND: Object.values(filtrosPorAtributo).map((valueIds) => ({
  attributeValues: { some: { attributeValueId: { in: valueIds } } },
}))
```

Aplanar todos los valores en un solo `some` es el error clásico: devuelve productos que cumplen *cualquiera* de los filtros. Si tocás esta consulta, agregá un test.

El estado de los filtros vive en la URL como query params, nunca solo en `useState`. El usuario debe poder compartir un enlace filtrado.

## Convenciones

- Server Components por defecto. `"use client"` solo cuando haya interactividad real, y lo más abajo posible en el árbol.
- Server Actions para mutaciones. Route Handlers solo para webhooks o respuestas no HTML.
- Toda entrada se valida con Zod **en el servidor**, aunque ya se haya validado en el cliente. El mismo esquema se reutiliza en ambos lados.
- Precios con `Decimal`, nunca `Float`.
- Archivos y carpetas en `kebab-case`. Componentes en `PascalCase`. Tablas y columnas de la base en `snake_case` vía `@map`.
- Nada de `any`. Si el tipo es difícil, usá `unknown` y estrechá.
- Los textos visibles no se escriben directamente en los componentes cuando son contenido editable: vienen de la base (`SiteSetting`, `FaqItem`, etc.).

## Trampas de este proyecto

- Borrar un producto debe borrar sus imágenes en Cloudinary. Por eso existe `ProductImage.imageId`; si no lo usás, se acumula basura facturable.
- Borrar una categoría con productos está bloqueado por la base (`onDelete: Restrict`). El panel debe mostrar un mensaje claro, no un error 500.
- Tras cualquier mutación en el panel, llamá a `revalidatePath` o `revalidateTag` o los cambios no se verán en el sitio público.
- El cliente de Prisma usa patrón singleton en `shared/lib/prisma.ts`. Instanciarlo por petición agota las conexiones en desarrollo.
- Las imágenes de producto son el contenido principal del sitio: siempre `next/image` con `sizes` correcto y `priority` solo en la imagen del hero.

## Comandos

```bash
npm run dev          npm run lint         npm run test
npm run build        npm run typecheck    npm run test:e2e
npm run db:migrate   npm run db:seed      npm run db:studio
```

Antes de dar una tarea por terminada: `npm run lint && npm run typecheck && npm run build`.

## Flujo de trabajo

Una rama por tarea (`feat/`, `fix/`, `chore/`, `docs/`), un PR por rama. No trabajes directo sobre `main`.

No agregues dependencias nuevas sin preguntar. No modifiques `schema.prisma` sin generar la migración correspondiente. No toques archivos `.env`.
