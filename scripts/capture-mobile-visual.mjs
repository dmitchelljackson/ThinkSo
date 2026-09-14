import { mkdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { chromium } from 'playwright-core';

const { values } = parseArgs({
  options: {
    source: { type: 'string' },
    url: { type: 'string', default: 'http://localhost:8081/' },
    name: { type: 'string' },
    action: { type: 'string' },
    output: { type: 'string' },
  },
  strict: true,
});

if (!values.source || !values.name) {
  console.error(
    'Usage: pnpm visual:compare --source <design.dc.html> --name <label> [--url <expo-web-url>] [--action <button-label>]',
  );
  process.exit(2);
}

const profiles = [
  { name: 'small', width: 360, height: 740 },
  { name: 'medium', width: 393, height: 852 },
  { name: 'large', width: 430, height: 932 },
];
const outputDirectory = resolve(values.output ?? `screenshots/visual/${values.name}`);
const sourcePath = resolve(values.source);
const sourceHtml = await readFile(sourcePath, 'utf8');
const sourceUrl = pathToFileURL(sourcePath).href;

await mkdir(outputDirectory, { recursive: true });

const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--allow-file-access-from-files'],
});

try {
  const captures = [];
  for (const profile of profiles) {
    const designPath = resolve(outputDirectory, `design-${profile.name}.png`);
    const implementationPath = resolve(outputDirectory, `expo-web-${profile.name}.png`);

    const designPage = await browser.newPage({ viewport: profile });
    await designPage.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
    await designPage.route(sourceUrl, (route) =>
      route.fulfill({
        contentType: 'text/html',
        body: resizeDesignSource(sourceHtml, profile),
      }),
    );
    await designPage.goto(sourceUrl, {
      waitUntil: 'domcontentloaded',
    });
    await designPage.evaluate(() => document.fonts.ready);
    const exportedDevice = designPage.locator('[data-om-starter="ios-frame"]');
    await exportedDevice.waitFor({ state: 'visible' });
    await exportedDevice.screenshot({ path: designPath });

    const appPage = await browser.newPage({ viewport: profile });
    await appPage.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
    await appPage.goto(values.url, { waitUntil: 'domcontentloaded' });
    await appPage.getByTestId('account-access-screen').waitFor({ state: 'visible' });
    await appPage.evaluate(() => document.fonts.ready);
    if (values.action) {
      await appPage.getByRole('button', { name: values.action, exact: true }).click();
    }
    await appPage.screenshot({ path: implementationPath });

    captures.push({
      ...profile,
      design: await pngDataUrl(designPath),
      implementation: await pngDataUrl(implementationPath),
    });
    await Promise.all([designPage.close(), appPage.close()]);
  }

  const matrixPage = await browser.newPage({ viewport: { width: 920, height: 2750 } });
  await matrixPage.setContent(matrixMarkup(captures));
  await matrixPage.screenshot({
    path: resolve(outputDirectory, 'responsive-matrix.png'),
    fullPage: true,
  });
} finally {
  await browser.close();
}

console.log(`Responsive visual matrix written to ${outputDirectory}`);

function resizeDesignSource(html, { width, height }) {
  return html
    .replace(/width="\{\{\s*393\s*\}\}"/, `width="{{ ${width} }}"`)
    .replace(/height="\{\{\s*852\s*\}\}"/, `height="{{ ${height} }}"`)
    .replace(/&quot;width&quot;:393/g, `&quot;width&quot;:${width}`)
    .replace(/&quot;height&quot;:852/g, `&quot;height&quot;:${height}`)
    .replace(
      'padding:24px;box-sizing:border-box',
      'padding:0;box-sizing:border-box;overflow:hidden',
    );
}

async function pngDataUrl(path) {
  return `data:image/png;base64,${(await readFile(path)).toString('base64')}`;
}

function matrixMarkup(captures) {
  return `<!doctype html>
    <style>
      * { box-sizing: border-box; }
      body { margin: 0; padding: 20px; background: #d8d5cd; font: 700 13px system-ui; }
      h1 { margin: 0 0 20px; font-size: 18px; }
      section { margin-bottom: 28px; }
      h2 { margin: 0 0 8px; font-size: 14px; text-transform: uppercase; }
      main { display: flex; align-items: flex-start; gap: 16px; }
      figure { margin: 0; width: 430px; }
      figcaption { height: 26px; text-align: center; }
      img { display: block; margin: auto; max-width: 430px; height: auto; object-fit: contain; }
    </style>
    <h1>${escapeHtml(values.name)} — responsive design comparison</h1>
    ${captures
      .map(
        ({ name, width, height, design, implementation }) => `
          <section>
            <h2>${name} · ${width} × ${height}</h2>
            <main>
              <figure><figcaption>AUTHORITATIVE DESIGN</figcaption><img src="${design}" width="${width}" height="${height}"></figure>
              <figure><figcaption>EXPO WEB</figcaption><img src="${implementation}" width="${width}" height="${height}"></figure>
            </main>
          </section>`,
      )
      .join('')}`;
}

function escapeHtml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}
