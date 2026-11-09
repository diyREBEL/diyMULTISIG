// Oberflächen-Test: Wiederherstellen aus Setup-Datei (Jade-Beispiel), Einstellungen, Entfernen.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT ?? 'playwright');
const server = spawn('python3', ['-m', 'http.server', '8766', '--bind', '127.0.0.1'], { cwd: 'app', stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 800));
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? '/usr/bin/google-chrome' });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: 'dark' });
await ctx.route('https://mempool.space/api/**', (route) => {
  const p = new URL(route.request().url()).pathname;
  const h = { 'access-control-allow-origin': '*' };
  if (p.endsWith('/utxo')) return route.fulfill({ status: 200, contentType: 'application/json', body: '[]', headers: h });
  if (p.startsWith('/api/address/')) return route.fulfill({ status: 200, contentType: 'application/json', headers: h,
    body: JSON.stringify({ chain_stats: { tx_count: 0, funded_txo_sum: 0, spent_txo_sum: 0 }, mempool_stats: { tx_count: 0, funded_txo_sum: 0, spent_txo_sum: 0 } }) });
  if (p === '/api/v1/fees/recommended') return route.fulfill({ status: 200, contentType: 'application/json', body: '{"fastestFee":3,"halfHourFee":2,"hourFee":1}', headers: h });
  return route.fulfill({ status: 404, body: '' });
});
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
const file = `# Passport Multisig setup file (created by Sparrow)
#
Name: roundtripperA
Policy: 2 of 3
Derivation: m/48'/0'/0'/2'
Format: P2WSH

E3EBCC79: xpub6EWJLhf2M3XbBH22hCW69RL6gvfeUyLFfhLBtAH7W8ci4DgTCmEmoDEqkYVME5qAx6DtUG82h4JeNPHV33AoD93uGM7MzvuoJNvBmStqhwc
249192D2: xpub6EbXynW6xjYR3crcztum6KzSWqDJoAJQoovwamwVnLaCSHA6syXKPnJo6U3bVeGdeEaXAeHsQTxhkLam9Dw2YfoAabtNm44XUWnnUZfHJRq
67F90FFC: xpub6EHuWWrYd8bp5FS1XAZsMPkmCqLSjpULmygWqAqWRCCjSWQwz6ntq5KnuQnL23No2Jo8qdp48PrL8SVyf14uBrynurgPxonvnX6R5pbit3w
`;
await page.goto('http://127.0.0.1:8766/');
// 1) Mainnet-Setup-Datei über "Backup-QR scannen" → "Text einfügen": lädt sofort, Name aus der Datei
await page.click('#load-scan');
await page.click('#scanner-paste');
await page.fill('#paste-text', file);
await page.click('#paste-ok');
await page.waitForSelector('#scr-home:not([hidden])');
await page.waitForFunction(() => document.querySelector('#home-updated').textContent.startsWith('Stand'));
assert.equal(await page.textContent('#home-name'), 'roundtripperA');
assert.match(await page.textContent('#home-checksum'), /ah58dy57/);         // gleiche Prüfsumme wie im Node-Test
await page.screenshot({ path: 'tests/out/20-geladen-dunkel.png', fullPage: true });
// 2) Wallet schliessen → Startbildschirm
await page.click('#go-settings');
await page.click('#set-close');
await page.waitForSelector('#scr-welcome:not([hidden])');
await page.screenshot({ path: 'tests/out/21-start-dunkel.png', fullPage: true });
// 3) Backup-Datei öffnen (Descriptor irgendwo im Text) → lädt sofort, Standardname
const desc = 'wsh(sortedmulti(2,[e3ebcc79/48h/0h/0h/2h]xpub6EWJLhf2M3XbBH22hCW69RL6gvfeUyLFfhLBtAH7W8ci4DgTCmEmoDEqkYVME5qAx6DtUG82h4JeNPHV33AoD93uGM7MzvuoJNvBmStqhwc/<0;1>/*,[249192d2/48h/0h/0h/2h]xpub6EbXynW6xjYR3crcztum6KzSWqDJoAJQoovwamwVnLaCSHA6syXKPnJo6U3bVeGdeEaXAeHsQTxhkLam9Dw2YfoAabtNm44XUWnnUZfHJRq/<0;1>/*,[67f90ffc/48h/0h/0h/2h]xpub6EHuWWrYd8bp5FS1XAZsMPkmCqLSjpULmygWqAqWRCCjSWQwz6ntq5KnuQnL23No2Jo8qdp48PrL8SVyf14uBrynurgPxonvnX6R5pbit3w/<0;1>/*))#ah58dy57';
await page.setInputFiles('#load-file', { name: 'backup.txt', mimeType: 'text/plain', buffer: Buffer.from(`Mein Backup\n\nDESCRIPTOR:\n${desc}\n`) });
await page.waitForSelector('#scr-home:not([hidden])');
assert.equal(await page.textContent('#home-name'), 'Multisig');
// 4) Tippfehler im Descriptor → Fehlermeldung, nichts geladen
await page.click('#go-settings'); await page.click('#set-close');
await page.setInputFiles('#load-file', { name: 'kaputt.txt', mimeType: 'text/plain', buffer: Buffer.from(desc.replace('ah58dy57', 'ah58dy58')) });
await page.waitForFunction(() => /Prüfsumme/.test(document.querySelector('#toast').textContent));
assert.equal(await page.isVisible('#scr-welcome'), true);
// 5) Nichts gespeichert
const stored = await page.evaluate(() => localStorage.length + sessionStorage.length);
assert.equal(stored, 0);
console.log('Konsolenfehler:', errors.length ? errors : 'keine');
await browser.close(); server.kill();
console.log('LADEN-UI-TEST BESTANDEN');
