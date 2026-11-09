// Oberflächen-Test im echten Chrome (Playwright): Einrichten, Empfangen, Senden, Signieren, Senden.
// Kamera: Chrome bekommt ein künstliches Video mit dem animierten Schlüssel-QR von Gerät 1.
// Server: mempool.space-Antworten werden im Test simuliert (kein echtes Netz).
import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync } from 'node:fs';
import { NETWORKS } from '../app/js/config.js';
import { MultisigWallet } from '../app/js/wallet.js';
import { parseKeyText } from '../app/js/keys.js';
import { URDecoder } from '../app/js/ur.js';
import { cborDecode } from '../app/js/cbor.js';
import { RawTx, Address, hex, sha256, base64, qrcode } from '../app/lib/vendor.js';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT ?? 'playwright');
const py = (o) => JSON.parse(execFileSync('python3', ['tests/interop.py'], { input: JSON.stringify(o) }).toString());
const MN = [
  'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
  'legal winner thank year wave sausage worth useful legal winner thank yellow',
  'letter advice cage absurd amount doctor acoustic avoid letter advice cage above',
];
mkdirSync('tests/out', { recursive: true });

// --- Testdaten vorbereiten ---
const net = NETWORKS.testnet4;
const keys = py({ cmd: 'setup', network: 'test', mnemonics: MN });
const cos = keys.map((k) => parseKeyText(k.text, net));
const w = new MultisigWallet({ id: 'x', name: 'Test', network: 'testnet4', m: 2, cosigners: cos, createdAt: 0 });
const a0 = w.derive(0, 0);
const raw = RawTx.encode({ version: 2, lockTime: 0, segwitFlag: false,
  inputs: [{ txid: new Uint8Array(32).fill(1), index: 0, finalScriptSig: new Uint8Array(0), sequence: 0xffffffff }],
  outputs: [{ amount: 150000n, script: a0.script }] });
const txid = hex.encode(sha256(sha256(raw)).reverse());
const recipient = Address(net.btc).encode({ type: 'wpkh', hash: new Uint8Array(20).fill(7) });

// --- Künstliches Kamerabild: animierte UR-Teile von Gerät 1 als y4m-Video ---
function y4m(parts, file) {
  const W = 640, H = 480, frames = [];
  for (const p of parts) {
    const qr = qrcode(0, 'L'); qr.addData(p.toUpperCase(), 'Alphanumeric'); qr.make();
    const n = qr.getModuleCount(); const s = Math.floor(400 / (n + 8));
    const Y = Buffer.alloc(W * H, 235);
    const ox = Math.floor((W - (n + 8) * s) / 2) + 4 * s, oy = Math.floor((H - (n + 8) * s) / 2) + 4 * s;
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) {
      for (let y = 0; y < s; y++) Y.fill(16, (oy + r * s + y) * W + ox + c * s, (oy + r * s + y) * W + ox + c * s + s);
    }
    for (let k = 0; k < 4; k++) frames.push(Y);                // jedes Teil 4 Bilder lang
  }
  const UV = Buffer.alloc((W / 2) * (H / 2) * 2, 128);
  const chunks = [Buffer.from(`YUV4MPEG2 W${W} H${H} F10:1 Ip A1:1 C420jpeg\n`)];
  for (const f of frames) chunks.push(Buffer.from('FRAME\n'), f, UV);
  writeFileSync(file, Buffer.concat(chunks));
}
y4m(keys[0].ur, '/tmp/key1.y4m');

// --- kleiner Webserver für die App ---
const server = spawn('python3', ['-m', 'http.server', '8765', '--bind', '127.0.0.1'], { cwd: 'app', stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 800));

const browser = await chromium.launch({
  executablePath: process.env.CHROME ?? '/usr/bin/google-chrome',
  args: ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream', '--use-file-for-fake-video-capture=/tmp/key1.y4m'],
});
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, permissions: ['camera', 'clipboard-read', 'clipboard-write'] });
const page = await ctx.newPage();
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push(e.message));

// Simulierter mempool.space-Server
let broadcastHex = null;
await ctx.route('https://mempool.space/testnet4/api/**', async (route) => {
  const url = new URL(route.request().url());
  const p = url.pathname.replace('/testnet4/api', '');
  const json = (o) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(o), headers: { 'access-control-allow-origin': '*' } });
  const text = (t) => route.fulfill({ status: 200, contentType: 'text/plain', body: t, headers: { 'access-control-allow-origin': '*' } });
  let m;
  if (p === '/v1/fees/recommended') return json({ fastestFee: 10, halfHourFee: 5, hourFee: 2, economyFee: 1, minimumFee: 1 });
  if ((m = /^\/address\/([a-z0-9]+)\/utxo$/.exec(p))) return json(m[1] === a0.address ? [{ txid, vout: 0, value: 150000, status: { confirmed: true, block_height: 100 } }] : []);
  if ((m = /^\/address\/([a-z0-9]+)$/.exec(p))) {
    const used = m[1] === a0.address;
    return json({ chain_stats: { tx_count: used ? 1 : 0, funded_txo_sum: used ? 150000 : 0, spent_txo_sum: 0 }, mempool_stats: { tx_count: 0, funded_txo_sum: 0, spent_txo_sum: 0 } });
  }
  if ((m = /^\/tx\/([0-9a-f]{64})\/hex$/.exec(p))) return text(hex.encode(raw));
  if (p === '/tx' && route.request().method() === 'POST') {
    broadcastHex = route.request().postData();
    return text(py({ cmd: 'verify', tx: broadcastHex, prevouts: [{ script: hex.encode(a0.script), amount: 150000 }] }).txid);
  }
  return route.fulfill({ status: 404, body: 'not found' });
});

const shot = (n) => page.screenshot({ path: `tests/out/${n}.png`, fullPage: true });
async function paste(text) {                                  // Scanner öffnen → Text einfügen
  await page.click('#scanner-paste');
  await page.fill('#paste-text', text);
  await page.click('#paste-ok');
}

await page.goto('http://127.0.0.1:8765/');
await shot('01-start');
await page.click('text=Neue Wallet einrichten');
await page.fill('#setup-name', 'Test');
await page.click('details.adv summary');
await page.selectOption('#setup-network', 'testnet4');
await shot('02-regeln');
await page.click('#policy-next');

// Schlüssel 1 per Kamera (animierter UR-Code), 2 und 3 per Text
const slots = page.locator('#key-slots li');
await slots.nth(0).locator('input').fill('SeedSigner A');
await slots.nth(0).locator('button').click();
await page.waitForFunction(() => document.querySelector('#key-slots li')?.classList.contains('done'), null, { timeout: 30000 });
assert.equal((await slots.nth(0).locator('.fp').textContent()).toLowerCase(), cos[0].fingerprint);
console.log('Schlüssel 1 per Kamera (animierter UR crypto-account) gelesen');
for (const i of [1, 2]) {
  await slots.nth(i).locator('input').fill(i === 1 ? 'Jade B' : 'Reserve C');
  await slots.nth(i).locator('button').click();
  await paste(keys[i].text);
  await page.waitForFunction((k) => document.querySelectorAll('#key-slots li')[k].classList.contains('done'), i);
}
await shot('03-schluessel');
await page.click('#keys-next');
await shot('04-pruefen');
assert.equal((await page.textContent('#review-address')).replace(/ /g, ''), a0.address);
await page.click('#review-create');
await page.waitForSelector('#scr-register:not([hidden])');
await page.waitForTimeout(600);
await shot('05-registrieren');
// Backup-Blatt: Druckdialog abfangen, Druckansicht fotografieren
await page.evaluate(() => { window.print = () => { window.__printed = true; }; });
await page.click('#desc-print');
await page.waitForFunction(() => window.__printed === true);
await page.emulateMedia({ media: 'print' });
await page.screenshot({ path: 'tests/out/05b-backup-blatt.png', fullPage: true });
await page.emulateMedia({ media: 'screen' });
assert.match(await page.textContent('#print-descriptor'), /^wsh\(sortedmulti\(2,/);
const backupText = await page.inputValue('#register-descriptor');
const printedQr = await page.evaluate(async () => {           // gedruckten QR-Code wieder einlesen
  const { jsQR } = await import('/lib/vendor.js');
  const img = document.querySelector('#print-qr');
  const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
  const ctx = c.getContext('2d'); ctx.drawImage(img, 0, 0);
  return jsQR(ctx.getImageData(0, 0, c.width, c.height).data, c.width, c.height)?.data;
});
assert.equal(printedQr, backupText, 'gedruckter QR enthält nicht den Descriptor');
console.log('Backup-Blatt erzeugt, Prüfsumme', await page.textContent('#print-checksum'));
await page.check('#register-confirm');
await page.click('#register-done');
await page.waitForFunction(() => document.querySelector('#home-balance').textContent.includes('0.00150000'));
await shot('06-uebersicht');
console.log('Guthaben angezeigt:', await page.textContent('#home-balance'));

// Empfangen: nächste unbenutzte Adresse ist #1
await page.click('#go-receive');
await page.waitForSelector('#scr-receive:not([hidden])');
assert.equal((await page.textContent('#receive-address')).replace(/ /g, ''), w.derive(0, 1).address);
await shot('07-empfangen');
await page.click('#scr-receive [data-go=home]');

// Senden
await page.click('#go-send');
await page.waitForSelector('#scr-send:not([hidden])');
await page.fill('#send-to', recipient);
await page.fill('#send-amount', '0,0005');
await page.waitForFunction(() => document.querySelector('#fee-medium').textContent.includes('5'));
await shot('08-senden');
await page.click('#send-next');
await page.waitForSelector('#scr-send-review:not([hidden])');
await shot('09-transaktion-pruefen');
await page.check('#tx-confirm');
await page.click('#tx-to-sign');
await page.waitForSelector('#scr-sign:not([hidden])');
await page.waitForTimeout(600);
await shot('10-signieren');

// Zwei Geräte signieren (SeedSigner-Logik in Python); Rückgabe als Base64 einfügen
for (const k of [0, 2]) {
  // animierten PSBT-QR direkt vom Bildschirm "abfotografieren": alle Teile einsammeln, die die App zeigt
  const parts = await page.evaluate(async () => {
    const { jsQR } = await import('/lib/vendor.js');           // QR-Erkennung der App mitbenutzen
    const seen = new Set();
    const canvas = document.querySelector('#sign-qr');
    for (let i = 0; i < 60; i++) {                            // ca. 15 s lang Bilder lesen
      const ctx = canvas.getContext('2d');
      const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(img.data, img.width, img.height);
      if (code) seen.add(code.data);
      await new Promise((r) => setTimeout(r, 250));
    }
    return [...seen];
  });
  assert.ok(parts.length > 0, 'keine QR-Teile gelesen');
  const s = py({ cmd: 'sign', network: 'test', parts, mnemonic: MN[k] });
  assert.ok(s.signed);
  const d = new URDecoder(); for (const p of s.parts) { d.receive(p); if (d.result) break; }
  await page.click('#sign-scan');
  await paste(base64.encode(cborDecode(d.result)));
  if (k === 0) { await page.waitForFunction(() => document.querySelector('#sign-status').textContent.startsWith('1 von 2')); await shot('11-eine-signatur'); }
}
await page.waitForSelector('#scr-broadcast:not([hidden])');
await shot('12-bereit');
await page.click('#broadcast-go');
await page.waitForSelector('#scr-done:not([hidden])');
await shot('13-gesendet');
const doneTxid = await page.textContent('#done-txid');
await page.click('#scr-done [data-go=home]');
const v = py({ cmd: 'verify', tx: broadcastHex, prevouts: [{ script: hex.encode(a0.script), amount: 150000 }] });
assert.equal(v.txid, doneTxid);
console.log('Gesendete Transaktion gültig (python-bitcointx), txid', doneTxid.slice(0, 16) + '…');

// Nichts darf im Browser gespeichert sein
const stored = await page.evaluate(async () => ({
  local: localStorage.length, session: sessionStorage.length,
  sw: (await navigator.serviceWorker.getRegistrations()).length,
  caches: (await caches.keys()).length,
  idb: (await indexedDB.databases()).length,
}));
console.log('Browser-Speicher nach dem Senden:', JSON.stringify(stored));
assert.deepEqual(stored, { local: 0, session: 0, sw: 0, caches: 0, idb: 0 });

// Neu laden: Wallet ist weg, Laden aus dem Backup (Testnetz → Netzwerkwahl, dann laden)
await page.reload();
await page.waitForSelector('#scr-welcome:not([hidden])');
await page.click('#load-scan');
await paste(backupText);
await page.waitForSelector('#scr-restore:not([hidden])');
assert.equal(await page.inputValue('#restore-network'), 'testnet4');
await page.click('#restore-go');
await page.waitForFunction(() => document.querySelector('#home-balance').textContent.includes('BTC'));
assert.match(await page.textContent('#home-checksum'), new RegExp(backupText.split('#')[1]));
await shot('14-nach-neuladen-geladen');
console.log('Nach Neuladen aus Backup-QR (Text) geladen, Prüfsumme stimmt');

const csp = errors.filter((e) => /Content Security Policy|Refused/.test(e));
console.log('Konsolenfehler:', errors.length ? errors : 'keine');
assert.equal(csp.length, 0, 'CSP-Verletzungen');
await browser.close();
server.kill();
console.log('UI-TEST BESTANDEN');
