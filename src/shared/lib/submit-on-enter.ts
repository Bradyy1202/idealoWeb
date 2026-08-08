import type { KeyboardEvent } from 'react';

/**
 * Los formularios del panel usan un botón type="button" en vez de
 * type="submit" (un type="submit" dentro de un <form> hace que Next.js
 * pierda la cookie de sesión al invocar la Server Action — ver el
 * comentario junto a cada acción de creación/edición). Sin un botón
 * type="submit", el <form> ya no envía con Enter de forma nativa; esta
 * función lo recupera, salvo en <textarea> donde Enter agrega una línea.
 *
 * Se llama desde un onKeyDown propio del componente (no se devuelve un
 * handler ya armado) para que el lint de refs no vea un cierre sobre un ref
 * invocado durante el render.
 */
export function submitOnEnter(event: KeyboardEvent<HTMLFormElement>, handleSubmit: () => void) {
  if (event.key !== 'Enter') return;
  if ((event.target as HTMLElement).tagName === 'TEXTAREA') return;
  event.preventDefault();
  handleSubmit();
}
