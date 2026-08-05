---
description: Revisar los cambios pendientes antes de abrir el PR
---

Revisá los cambios sin confirmar (`git diff` y `git status`) buscando específicamente:

- Módulos que importen de otros módulos en lugar de `shared/`
- Prisma importado fuera de un `repository.ts`
- Validación que solo exista en el cliente
- Uso de `any`
- Mutaciones sin `revalidatePath` o `revalidateTag`
- Componentes marcados como `"use client"` sin necesitarlo
- Textos visibles hardcodeados que deberían venir de la base
- Consultas de filtrado que aplanen atributos en un solo `some`

Reportá lo que encuentres ordenado por gravedad. No corrijas nada sin preguntarme primero.
