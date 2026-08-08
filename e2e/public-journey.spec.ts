import { test, expect } from '@playwright/test';

/**
 * Tarea 6.4: recorrido público completo, inicio → catálogo → filtrar →
 * producto → WhatsApp. No fija un slug de producto/categoría a mano: toma
 * "el primero que haya" en cada paso, así el test no se rompe cada vez que
 * cambie el seed, siempre que exista al menos un producto activo.
 *
 * El grid de /catalogo vive en un <Suspense> de componente (no loading.tsx,
 * a propósito — ver el comentario en catalogo/page.tsx): el shell llega con
 * domcontentloaded, pero el grid en sí streamea un poco después. Por eso acá
 * se espera con un locator (auto-retry), nunca un .count() inmediato: leer
 * el DOM apenas resuelve domcontentloaded todavía puede mostrar el
 * ProductGridSkeleton en vez de los productos reales.
 */
test('recorrido público: inicio → catálogo → filtrar → producto → WhatsApp', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Idealo/i);

  await page.getByRole('link', { name: 'Ver catálogo' }).first().click();
  await expect(page).toHaveURL(/\/catalogo$/);

  const firstProductLink = page.locator('a[href^="/producto/"]').first();
  await expect(firstProductLink).toBeVisible({ timeout: 10_000 });
  const productCount = await page.locator('a[href^="/producto/"]').count();
  expect(productCount).toBeGreaterThan(0);

  // Ordenar por precio: menor a mayor, y confirmar que la URL lo refleja
  // (el estado de los filtros vive en la URL, no solo en useState).
  await page.getByLabel('Ordenar por').selectOption('price-asc');
  await expect(page).toHaveURL(/orden=price-asc/);
  await expect(page.locator('a[href^="/producto/"]').first()).toBeVisible({ timeout: 10_000 });

  const productHref = await page.locator('a[href^="/producto/"]').first().getAttribute('href');
  await page.locator('a[href^="/producto/"]').first().click();
  await expect(page).toHaveURL(new RegExp(productHref!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

  // Se verifica el href armado, sin navegar de verdad a wa.me: es un
  // servicio externo real que redirige a api.whatsapp.com cuando el
  // navegador no tiene la app de WhatsApp, así que afirmar sobre la URL
  // final sería un test flaky que depende de un tercero. Se busca dentro de
  // <main>: el header también tiene un "Cotizar por WhatsApp" genérico (sin
  // producto), y por accesible name solo hay dos.
  const whatsappHref = await page
    .getByRole('main')
    .getByRole('link', { name: 'Cotizar por WhatsApp' })
    .getAttribute('href');
  expect(whatsappHref).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
});

test('el catálogo no muestra errores de hidratación ni de consola', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(err.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  // domcontentloaded, no networkidle: esta última tiende a expirar sin
  // motivo real contra este sitio (ver el resto de la suite y el historial
  // de verificaciones del proyecto).
  await page.goto('/catalogo', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('a[href^="/producto/"]').first()).toBeVisible({ timeout: 10_000 });

  expect(errors).toEqual([]);
});
