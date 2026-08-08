import { PrismaClient } from '@prisma/client';

// Patrón singleton: en desarrollo el hot-reload de Next.js vuelve a evaluar
// este módulo en cada guardado. Sin guardar la instancia en `globalThis`,
// cada recarga abriría una conexión nueva hasta agotar el pool de la base.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
