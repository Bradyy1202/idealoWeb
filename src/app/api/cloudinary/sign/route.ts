import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { cloudinary } from '@/shared/lib/cloudinary';

/**
 * Firma solicitudes de subida a Cloudinary para el widget del panel. Fuera
 * de /admin/*, así que el middleware no la protege: hay que chequear la
 * sesión acá también, o cualquiera podría pedir firmas para subir a nuestra
 * cuenta de Cloudinary.
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const body = (await request.json()) as { paramsToSign: Record<string, unknown> };
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!apiSecret) {
    return NextResponse.json({ error: 'Cloudinary no está configurado' }, { status: 500 });
  }

  const signature = cloudinary.utils.api_sign_request(body.paramsToSign, apiSecret);

  return NextResponse.json({ signature });
}
