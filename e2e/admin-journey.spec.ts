import { test, expect } from '@playwright/test';

const EMAIL = process.env.SEED_ADMIN_EMAIL;
const PASSWORD = process.env.SEED_ADMIN_PASSWORD;

test.skip(
  !EMAIL || !PASSWORD,
  'Faltan SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD (ver .env.local o las variables del pipeline).',
);

/**
 * Tarea 6.5: recorrido de administración, login → crear producto → verlo
 * publicado. El nombre (no solo el slug) incluye Date.now(): la tabla de
 * /admin/productos solo muestra nombre y SKU por fila, nunca el slug, así
 * que limpiar buscando por slug nunca encontraba la fila a borrar (dejó dos
 * productos de prueba huérfanos en la base real la primera vez que corrió
 * esta suite). Un nombre único también evita un choque de "strict mode" en
 * Playwright si quedara algún producto de una corrida anterior fallida: sin
 * esto, la ficha del producto nuevo podía mostrar uno viejo del mismo
 * nombre como "también te puede interesar" y el heading dejaba de ser único.
 */
test.describe('recorrido de administración', () => {
  let createdProductName: string | undefined;

  test.afterEach(async ({ page }) => {
    if (!createdProductName) return;
    await page.goto('/admin/productos', { waitUntil: 'domcontentloaded' });
    const row = page.locator('tr', { hasText: createdProductName });
    if ((await row.count()) > 0) {
      page.once('dialog', (dialog) => dialog.accept());
      await row.getByText('Borrar', { exact: true }).click();
      await page.waitForTimeout(1000);
    }
    createdProductName = undefined;
  });

  test('login → crear producto → verlo publicado en el catálogo', async ({ page }) => {
    await page.goto('/admin/login', { waitUntil: 'domcontentloaded' });
    await page.fill('#email', EMAIL!);
    await page.fill('#password', PASSWORD!);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/admin$/, { timeout: 10_000 });

    await page.goto('/admin/productos/nuevo', { waitUntil: 'domcontentloaded' });

    const stamp = Date.now();
    const name = `Producto E2E de prueba ${stamp}`;
    const slug = `producto-e2e-${stamp}`;
    createdProductName = name;

    await page.fill('#name', name);
    await page.fill('#slug', slug);
    // La categoría ya viene con una seleccionada por defecto (la primera del
    // <select>): alcanza con no tocarla para que el formulario sea válido.

    await page.getByRole('button', { name: 'Crear producto' }).click();
    await expect(page).toHaveURL(/\/admin\/productos\/.+\/editar/, { timeout: 10_000 });
    await expect(page.locator('#name')).toHaveValue(name);

    // isActive es true por defecto (productFormSchema): debería quedar
    // visible en el sitio público de inmediato, sin ningún paso extra.
    await page.goto(`/producto/${slug}`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name })).toBeVisible();
  });
});
