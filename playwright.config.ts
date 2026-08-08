import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { defineConfig, devices } from '@playwright/test';

/**
 * Carga .env.local a mano (sin agregar dotenv como dependencia): así
 * `npm run test:e2e` encuentra SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD sin que
 * haya que exportarlas antes en la terminal. En CI el archivo no existe
 * -las variables las inyecta el propio pipeline- y esto no hace nada.
 */
function loadEnvLocal() {
  try {
    const content = readFileSync(join(__dirname, '.env.local'), 'utf-8');
    for (const line of content.split('\n')) {
      const match = /^([A-Z_][A-Z0-9_]*)=(.*)$/.exec(line.trim());
      if (match && match[1] && !process.env[match[1]]) {
        process.env[match[1]] = match[2]?.replace(/^["']|["']$/g, '') ?? '';
      }
    }
  } catch {
    // Sin .env.local (típico en CI): las variables ya vienen del entorno.
  }
}
loadEnvLocal();

/**
 * Corre siempre contra el build de producción (`npm run build && npm start`),
 * nunca `next dev`: un bug real de streaming de Next.js (loading.tsx rompe el
 * status 404 de notFound()) solo se reproduce ahí, así que es la única forma
 * honesta de verificar el sitio. `webServer` de abajo solo levanta `npm start`
 * -el build hay que correrlo antes a mano o en un paso previo del CI-, y
 * reutiliza un server ya corriendo en localhost:3000 si existe (típico en
 * desarrollo local).
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
