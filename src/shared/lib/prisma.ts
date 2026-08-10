import { Prisma, PrismaClient } from '@prisma/client';

// Patrón singleton: en desarrollo el hot-reload de Next.js vuelve a evaluar
// este módulo en cada guardado. Sin guardar la instancia en `globalThis`,
// cada recarga abriría una conexión nueva hasta agotar el pool de la base.
const globalForPrisma = globalThis as unknown as { prisma?: ExtendedPrismaClient };

/**
 * Códigos de Prisma que significan "no se pudo llegar a la base", no "la
 * consulta está mal". Solo estos se reintentan: reintentar un error de
 * validación o una violación de índice único sería repetir el mismo fallo.
 *
 * - P1001: no se puede alcanzar el servidor.
 * - P1002: el servidor cerró la conexión por timeout.
 * - P1008: se agotó el tiempo de la operación.
 * - P1017: el servidor cerró la conexión.
 */
const RETRYABLE_CODES = new Set(['P1001', 'P1002', 'P1008', 'P1017']);

function isRetryable(error: unknown) {
  if (
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientRustPanicError
  ) {
    return true;
  }
  return error instanceof Prisma.PrismaClientKnownRequestError && RETRYABLE_CODES.has(error.code);
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * La base corre en Neon, que suspende el compute tras unos minutos sin
 * tráfico. La primera consulta después de esa siesta tiene que esperar a que
 * el servidor arranque en frío, y ese arranque tarda más que el timeout de
 * conexión por defecto de Prisma: el resultado es un "Can't reach database
 * server" que revienta la página entera —o el `next build`, que prerenderiza
 * la portada leyendo `SiteSetting`— cuando en realidad la base está sana y
 * responde bien un segundo después.
 *
 * Por eso se reintenta con espera creciente (0.5s, 1s, 2s) solo ante errores
 * de conexión. No enmascara fallos reales: si la base está caída de verdad,
 * los tres intentos fallan y el error sale igual, apenas unos segundos más
 * tarde.
 *
 * Conviene además subir el timeout en la cadena de conexión —agregarle
 * `?connect_timeout=15` a `DATABASE_URL`—, pero eso vive en `.env` y no se
 * toca desde acá.
 */
function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  }).$extends({
    query: {
      async $allOperations({ args, query }) {
        const delays = [500, 1000, 2000];

        for (let attempt = 0; ; attempt += 1) {
          try {
            return await query(args);
          } catch (error) {
            const delay = delays[attempt];
            if (delay === undefined || !isRetryable(error)) throw error;
            await sleep(delay);
          }
        }
      },
    },
  });
}

type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>;

export const prisma: ExtendedPrismaClient = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
