# ADR 0002 — Botón explícito en lugar de `type="submit"` en los formularios del panel

- **Estado:** aceptada
- **Fecha:** 2026-08-07

## Contexto

Los formularios del panel de administración (`/admin/(panel)/**`) mutan datos mediante Server Actions y están protegidos por el middleware de Auth.js, que exige una sesión válida para llegar a la ruta.

Durante la Fase 4 se detectó que enviar cualquiera de esos formularios con un `<button type="submit">` dentro de un `<form>` hacía perder la sesión de forma silenciosa: la Server Action nunca ejecutaba su cuerpo (confirmado con `console.log` dentro de la acción, que jamás se disparaba), pese a que el middleware sí veía la petición como autenticada (`isLoggedIn=true` logueado para el mismo POST). El usuario terminaba redirigido a `/admin/login` sin ningún mensaje de error.

## Investigación

Se descartaron, en orden, las siguientes hipótesis antes de aislar la causa real:

1. Que `redirect()` dentro de la Server Action interrumpiera el guardado de la cookie de sesión.
2. Que la forma de construir el `FormData` (objeto plano vs. `FormData` real) importara.
3. Que el prefetch de `<Link>` disparara una carrera con el envío del formulario.

Ninguna explicaba el patrón exacto. El factor que sí lo explicaba, aislado por eliminación con Playwright y `curl` contra una compilación de producción: el envío nativo de un `<form>` con un botón `type="submit"` combinado con el ciclo de vida de App Router en Next.js 16 y el middleware de Auth.js en este proyecto. Cambiar únicamente el tipo de botón a `"button"` y disparar la acción a mano elimina el problema por completo, sin tocar nada más.

No se abrió un issue upstream porque no se logró aislar un repro mínimo fuera de este proyecto; queda documentado aquí como conocimiento local en vez de perderse en el historial de commits.

## Decisión

Ningún formulario del panel usa `<button type="submit">`. El patrón adoptado en todos ellos (ver `src/app/admin/(panel)/categorias/_components/category-form.tsx` como referencia):

1. El botón es `type="button"` con `onClick={handleSubmit}`.
2. `handleSubmit` construye el `FormData` a mano a partir de un `formRef`, arma el input y llama a la Server Action dentro de `startTransition`.
3. La Server Action nunca llama a `redirect()`; devuelve `{ status: 'success', redirectTo }` (o `{ status: 'error', message, fieldErrors }`).
4. El componente cliente hace `router.push(result.redirectTo)` tras recibir éxito.
5. Como `type="submit"` ya no dispara el envío con Enter, `src/shared/lib/submit-on-enter.ts` engancha `onKeyDown` del `<form>` y llama a `handleSubmit` cuando el foco está en un campo de una sola línea, para no perder esa expectativa de UX.

## Consecuencias

**Positivas**

- Las sesiones del panel dejan de perderse durante mutaciones.
- El estado de error (`fieldErrors`, mensaje general) se maneja de forma explícita en el cliente en lugar de depender de una redirección con querystring.

**Negativas**

- Cada formulario del panel repite el mismo boilerplate (`formRef`, `startTransition`, `handleSubmit`, `handleKeyDown`) en vez de apoyarse en el manejo nativo de `<form action={...}>` de React 19.
- Si una futura versión de Next.js o Auth.js corrige la causa raíz, este patrón queda como complejidad heredada que valdría la pena revisar.

## Alternativas descartadas

- **Server Actions con `<form action={accion}>` nativo de React 19** — es el patrón recomendado por Next.js y el que se usa en el resto del sitio (por ejemplo, el formulario de login, que no está protegido por el middleware y no presenta el problema). Se descartó específicamente para los formularios del panel porque es la combinación exacta que dispara la pérdida de sesión.
- **Investigar más a fondo hasta reproducir el bug fuera del proyecto y reportarlo upstream** — deseable, pero no es la prioridad de un catálogo en producción; el patrón alternativo ya resuelve el problema sin riesgo.
