import Image from 'next/image';
import { cn } from '@/shared/lib/cn';

/**
 * El SVG real de la marca (`public/logoIdealo.svg`) solo trae `fill="#000000"`
 * en todos los paths: perdió el acento azul que se ve en el logo a color.
 * Se usa tal cual —monocromático— hasta que exista una versión a dos colores.
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
}: {
  className?: string;
  height?: number;
  priority?: boolean;
}) {
  const width = Math.round(height * (6399 / 2131));
  return (
    <Image
      src="/logoIdealo.svg"
      alt="Idealo"
      width={width}
      height={height}
      priority={priority}
      className={cn('h-auto', className)}
      style={{ height, width: 'auto' }}
    />
  );
}
