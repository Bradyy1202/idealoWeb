import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  // Falla la compilación si hay errores de tipos.
  // No desactivar: es la red de seguridad del proyecto.
  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;
