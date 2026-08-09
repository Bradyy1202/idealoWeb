import Image from 'next/image';
import { cn } from '@/shared/lib/cn';

/**
 * El SVG real de la marca solo trae un `fill` sólido para toda la marca:
 * perdió el acento azul que se ve en el logo a color. Como se carga como
 * `<img>` (vía `next/image`), no puede heredar color por CSS (`currentColor`
 * no atraviesa el límite de un documento SVG externo) — por eso existen dos
 * archivos estáticos en vez de uno solo recoloreable: `logoIdealo.svg`
 * (tinta oscura, fondos claros) y `logoIdealo-light.svg` (mismo trazo en
 * `--ink-foreground`, para fondos oscuros como el footer o el hero).
 *
 * `priority` es `false` por defecto: el logo aparece en el header, el pie,
 * la barra del panel y el login, ninguno de los cuales es la imagen del
 * hero (CLAUDE.md: "priority solo en la imagen del hero"). Solo el propio
 * Hero debe pasar `priority`.
 */
export function Logo({
  className,
  height = 32,
  priority = false,
  variant = 'dark',
}: {
  className?: string;
  height?: number;
  priority?: boolean;
  variant?: 'dark' | 'light';
}) {
  const width = Math.round(height * (6399 / 2131));
  return (
    <Image
      src={variant === 'light' ? '/logoIdealo-light.svg' : '/logoIdealo.svg'}
      alt="Idealo"
      width={width}
      height={height}
      priority={priority}
      className={cn('h-auto', className)}
      style={{ height, width: 'auto' }}
    />
  );
}
