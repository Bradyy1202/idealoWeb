import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'node',
    // No incluye tests de Playwright (viven en e2e/, corren con `npm run test:e2e`).
    exclude: ['node_modules', 'e2e', '.next'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      // .tsx (páginas y componentes) queda fuera: se prueba con Playwright
      // (tarea 6.4/6.5), no con unitarios. repository.ts/service.ts/actions.ts
      // sí entran aunque gran parte de sus funciones toquen Prisma y no
      // tengan test unitario propio (necesitan una base real, las cubre el
      // recorrido de Playwright) — el reporte de cobertura queda parcial en
      // esos archivos a propósito, refleja qué está probado con qué.
      include: ['src/**/*.ts'],
      exclude: ['src/shared/lib/prisma.ts', '**/*.d.ts'],
    },
  },
});
