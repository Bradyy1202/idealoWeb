import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import eslintConfigPrettier from 'eslint-config-prettier';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTypescript,
  eslintConfigPrettier,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    // El seed si puede escribir en consola
    files: ['prisma/**/*.ts'],
    rules: { 'no-console': 'off' },
  },
  globalIgnores([
    '.next/**',
    'node_modules/**',
    'src/generated/**',
    'coverage/**',
    'playwright-report/**',
    'test-results/**',
    // Herramientas instaladas de agentes: código de terceros que el CI no
    // debe auditar. Se versiona tal cual lo publica el skill.
    '.claude/**',
    '.github/skills/**',
    '.github/agents/**',
    '.github/hooks/**',
    '.impeccable/**',
  ]),
]);

export default eslintConfig;
