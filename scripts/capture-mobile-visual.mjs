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

const viewport = { width: 393, height: 852 };
const outputDirectory = resolve(values.output ?? `screenshots/visual/${values.name}`);
const sourcePath = resolve(values.source);
const designPath = resolve(outputDirectory, 'design.png');
const implementationPath = resolve(outputDirectory, 'expo-web.png');
const comparisonPath = resolve(outputDirectory, 'side-by-side.png');
const overlayPath = resolve(outputDirectory, 'overlay.png');

await mkdir(outputDirectory, { recursive: true });

const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--allow-file-access-from-files'],
});

try {
  const designPage = await browser.newPage({ viewport: { width: 441, height: 900 } });
  await designPage.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
  await designPage.goto(pathToFileURL(sourcePath).href, { waitUntil: 'domcontentloaded' });
  await designPage.evaluate(() => document.fonts.ready);
  const exportedDevice = designPage.locator('[data-om-starter="ios-frame"]');
  await exportedDevice.waitFor({ state: 'visible' });
  await exportedDevice.screenshot({ path: designPath });

  const appPage = await browser.newPage({ viewport });
  await appPage.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
  await appPage.goto(values.url, { waitUntil: 'domcontentloaded' });
  await appPage.getByTestId('account-access-screen').waitFor({ state: 'visible' });
  await appPage.evaluate(() => document.fonts.ready);
  if (values.action) {
    await appPage.getByRole('button', { name: values.action, exact: true }).click();
  }
  await appPage.screenshot({ path: implementationPath });

  const comparisonPage = await browser.newPage({ viewport: { width: 820, height: 900 } });
  const designImage = await pngDataUrl(designPath);
  const implementationImage = await pngDataUrl(implementationPath);
  await comparisonPage.setContent(comparisonMarkup(designImage, implementationImage));
  await comparisonPage.screenshot({ path: comparisonPath });

  const overlayPage = await browser.newPage({ viewport });
  await overlayPage.setContent(overlayMarkup(designImage, implementationImage));
  await overlayPage.screenshot({ path: overlayPath });
} finally {
  await browser.close();
}

console.log(`Visual comparison written to ${outputDirectory}`);

async function pngDataUrl(path) {
  return `data:image/png;base64,${(await readFile(path)).toString('base64')}`;
}

function comparisonMarkup(design, implementation) {
  return `<!doctype html>
    <style>
      * { box-sizing: border-box; }
      body { margin: 0; padding: 10px; background: #d8d5cd; font: 700 13px system-ui; }
      main { display: flex; gap: 10px; }
      figure { margin: 0; width: 393px; }
      figcaption { height: 28px; text-align: center; }
      img { display: block; width: 393px; height: 852px; object-fit: contain; }
    </style>
    <main>
      <figure><figcaption>AUTHORITATIVE DESIGN</figcaption><img src="${design}"></figure>
      <figure><figcaption>EXPO WEB</figcaption><img src="${implementation}"></figure>
    </main>`;
}

function overlayMarkup(design, implementation) {
  return `<!doctype html>
    <style>
      body { margin: 0; width: 393px; height: 852px; overflow: hidden; background: white; }
      img { position: absolute; inset: 0; width: 393px; height: 852px; }
      img:last-child { opacity: .5; }
    </style>
    <img src="${design}"><img src="${implementation}">`;
}
