---
description: Arrancar una tarea del plan de desarrollo
---

Leé `docs/PLAN.md` y ubicá la tarea $ARGUMENTS.

Antes de escribir código:

1. Resumí en dos o tres frases qué implica la tarea y qué archivos vas a tocar.
2. Verificá si alguna decisión en `docs/adr/` aplica.
3. Proponé el nombre de la rama siguiendo la convención del proyecto.
4. Esperá mi confirmación.

Después de implementar:

- Corré `npm run lint && npm run typecheck && npm run build`.
- Proponé el mensaje de commit en formato Conventional Commits, en español.
- Si la tarea cierra una fase, recordame actualizar el CHANGELOG y las casillas del README.
