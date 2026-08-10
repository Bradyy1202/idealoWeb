import { chromium } from '@playwright/test';
const outDir='C:/Users/Brady/AppData/Local/Temp/claude/c--Users-BradyDeveloper-ProyectosPropios-idealoWeb/6bb00b0c-d1c0-4d55-b281-828ccc227814/scratchpad/shots';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3000/#contacto', { waitUntil: 'networkidle' });
await page.locator('#contacto').scrollIntoViewIfNeeded();
await page.waitForTimeout(1200);
const box = await page.evaluate(() => {
  const r = document.querySelector('#contacto a[href*="wa.me"]').closest('div.relative').getBoundingClientRect();
  return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
});
// speed=5s por vuelta -> cada 1.25s es un cuarto de vuelta
const angles = [];
for (let i = 0; i < 4; i++) {
  angles.push(await page.evaluate(() => {
    const el = document.querySelector('#contacto [style*="--beam-angle"]');
    return el ? el.style.getPropertyValue('--beam-angle') : 'n/a';
  }));
  await page.screenshot({ path: `${outDir}/orbit-${i}.png`, clip: { x: box.x - 55, y: box.y - 55, width: box.w + 110, height: box.h + 110 } });
  await page.waitForTimeout(1250);
}
console.error(JSON.stringify({ angles }, null, 2));
await browser.close();
