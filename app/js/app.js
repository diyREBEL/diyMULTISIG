// app.js – Steuerung der Oberfläche: verbindet Bildschirme, Eingaben und die Wallet-Logik.
// Sicherheitsregel für die Anzeige: Texte werden nur über textContent gesetzt, nie als HTML.
// Modus ohne Speichern: Die App legt NICHTS im Browser ab (kein localStorage, kein Cache).
// Alles lebt nur im Arbeitsspeicher, bis die App geschlossen wird. Beim Start wird die Wallet
// aus dem Backup geladen (QR-Code, Datei oder Text).
import { NETWORKS, MIN_COSIGNERS, MAX_COSIGNERS, WALLET_NAME_PATTERN, HIGH_FEE_RATIO, GAP_LIMIT, LEGACY_STORAGE_KEY } from './config.js';
import { MultisigWallet } from './wallet.js';
import { EsploraApi, normalizeServerUrl } from './api.js';
import { parseKeyText, parseKeyUR, assertDistinct } from './keys.js';
import { buildDescriptor, parseDescriptor, buildSetupFile, parseSetupFile } from './descriptor.js';
import { createPsbt, analyzePsbt, mergeSignedPsbt, finalizePsbt, recipientScript, checkFeeRate } from './tx.js';
import { encodePsbtUR, encodeBytesUR } from './ur.js';
import { cborDecode } from './cbor.js';
import { drawQr, AnimatedQr, QrScanner } from './qr.js';
import { Decimal, base64 } from '../lib/vendor.js';

const VERSION = '1.1.0';                                       // Versionsnummer der App
const $ = (id) => document.getElementById(id);                 // Kurzform für Elementzugriff
const S = {                                                    // gesamter Laufzeit-Zustand an einem Ort
  wallet: null,                                                // geladene MultisigWallet (nur im Arbeitsspeicher)
  server: null,                                                // eigener Server für diese Sitzung (sonst Standard)
  pending: null,                                               // offene Transaktion (PSBT-Bytes), nur im Arbeitsspeicher
  api: null,                                                   // Verbindung zum Blockchain-Server
  setup: null,                                                 // Daten des Einrichtungs-Assistenten
  anim: null,                                                  // laufender animierter QR-Code
  fees: null,                                                  // Gebührenempfehlungen
  unit: 'BTC',                                                 // Eingabe-Einheit beim Senden
  sendAll: false,                                              // "Alles senden" aktiv?
  draft: null,                                                 // PSBT, die gerade geprüft wird
  receiveOffset: 0,                                            // wie weit "Nächste Adresse" vorgeblättert wurde
  scanner: null,                                               // laufender Kamera-Scanner
  backupOpen: false,                                           // neue Wallet, Backup noch nicht bestätigt
};

// ---------- kleine Hilfen ----------
const nf = new Intl.NumberFormat('de-CH');                     // Schweizer Tausendertrennzeichen (')
const fmtSats = (s) => `${nf.format(s)} sats`;                 // 123'456 sats
function fmtBtc(sats) {                                        // exakte BTC-Darstellung ohne Fliesskomma
  const neg = sats < 0n;
  const abs = neg ? -sats : sats;
  return `${neg ? '-' : ''}${abs / 100000000n}.${(abs % 100000000n).toString().padStart(8, '0')} BTC`;
}
const groupAddr = (a) => a.match(/.{1,4}/g).join(' ');         // in 4er-Gruppen: leichter zu vergleichen
const shortId = (t) => `${t.slice(0, 8)}…${t.slice(-8)}`;      // gekürzte txid
const utf8 = (s) => new TextEncoder().encode(s);               // Text → Bytes

let toastTimer = null;
function toast(msg, isError = false) {                         // Meldung unten einblenden
  const t = $('toast');
  t.textContent = msg;
  t.classList.toggle('error', isError);
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, isError ? 9000 : 3500);
}

// Führt eine (asynchrone) Aktion aus, sperrt die Taste währenddessen und zeigt Fehler an.
async function run(button, fn) {
  if (button) button.disabled = true;
  try { await fn(); } catch (e) { console.error(e); toast(e.message || String(e), true); } finally { if (button) button.disabled = false; }
}

// Zeigt genau einen Bildschirm an.
function show(name) {
  $('toast').hidden = true;                                    // alte Meldung ausblenden
  S.anim?.stop();                                              // laufende QR-Animation stoppen
  S.anim = null;
  document.querySelectorAll('.screen').forEach((el) => { el.hidden = el.id !== `scr-${name}`; });
  window.scrollTo(0, 0);
}

// Füllt eine Definitionsliste (<dl>) mit Zeilen [Bezeichnung, Wert].
function fillSummary(dl, rows) {
  dl.replaceChildren();                                        // alten Inhalt entfernen
  for (const [k, v] of rows) {
    const dt = document.createElement('dt'); dt.textContent = k;
    const dd = document.createElement('dd'); dd.textContent = v;
    dl.append(dt, dd);
  }
}

// Kopiert Text in die Zwischenablage.
async function copy(text) {
  await navigator.clipboard.writeText(text);
  toast('Kopiert');
}

// Startet eine animierte QR-Anzeige mit Dichte-Tasten im selben Kasten.
function startAnimation(canvas, makeEncoder) {
  S.anim?.stop();
  S.anim = new AnimatedQr(canvas, makeEncoder, 1);
  S.anim.start();
  const box = canvas.closest('.qrbox');
  box.querySelectorAll('[data-density]').forEach((b) => {
    b.classList.toggle('active', Number(b.dataset.density) === 1);
    b.onclick = () => {                                        // Dichte ändern (bei Leseproblemen)
      S.anim.setDensity(Number(b.dataset.density));
      box.querySelectorAll('[data-density]').forEach((x) => x.classList.toggle('active', x === b));
    };
  });
}

// ---------- Scanner ----------
// Öffnet die Kamera und liefert das Ergebnis (oder null bei Abbruch).
function scanQr(title) {
  return new Promise((resolve) => {
    const finish = (result) => {                               // Overlay schliessen, Ergebnis liefern
      S.scanner?.stop();
      S.scanner = null;
      $('scanner').hidden = true;
      resolve(result);
    };
    $('scanner-title').textContent = title;
    $('scanner-msg').textContent = 'Kamera wird gestartet …';
    $('scanner-progress').value = 0;
    $('scanner').hidden = false;
    $('scanner-cancel').onclick = () => finish(null);
    $('scanner-paste').onclick = async () => {                 // Ersatz: Text manuell einfügen
      S.scanner?.stop();
      $('scanner').hidden = true;
      const text = await pasteText();
      resolve(text ? { kind: 'text', text } : null);
    };
    S.scanner = new QrScanner(
      $('scanner-video'),
      (p) => { $('scanner-progress').value = p; $('scanner-msg').textContent = `Animierter Code: ${Math.round(p * 100)} %`; },
      (result) => finish(result),
      (msg) => { $('scanner-msg').textContent = msg; },
    );
    S.scanner.start().then(() => { $('scanner-msg').textContent = 'QR-Code ins Bild halten'; })
      .catch((e) => { $('scanner-msg').textContent = `Kamera: ${e.message}`; });
  });
}

// Einfaches Textfeld als Ersatz für den Scanner.
function pasteText() {
  return new Promise((resolve) => {
    $('paste-text').value = '';
    $('paste').hidden = false;
    $('paste-ok').onclick = () => { $('paste').hidden = true; resolve($('paste-text').value.trim()); };
    $('paste-cancel').onclick = () => { $('paste').hidden = true; resolve(null); };
    $('paste-text').focus();
  });
}

// ---------- Wallet öffnen ----------
function serverFor(netId) {                                    // eigener Server dieser Sitzung oder Standard
  return S.server ?? NETWORKS[netId].api;
}

function openWallet(cfg) {
  S.wallet = new MultisigWallet(cfg);                          // prüft die Konfiguration vollständig
  S.pending = null;                                            // keine offene Transaktion übernehmen
  S.server = null;                                             // Server zurück auf Standard
  S.api = new EsploraApi(serverFor(cfg.network));
  S.receiveOffset = 0;
  const badge = $('net-badge');                                // Testnetz deutlich anzeigen
  badge.hidden = cfg.network === 'main';
  badge.textContent = NETWORKS[cfg.network].label.toUpperCase();
  showHome();
  run($('home-refresh'), refresh);                             // Guthaben gleich laden
}

// ---------- Übersicht ----------
function showHome() {
  if (!S.wallet) { show('welcome'); return; }
  const { config, state } = S.wallet;
  $('home-name').textContent = config.name;
  $('home-policy').textContent = `${config.m} von ${config.cosigners.length}`;
  $('home-checksum').textContent = `Descriptor-Prüfsumme ${buildDescriptor(config).split('#')[1]}`; // Vergleich mit dem Backup
  if (state) {
    $('home-balance').textContent = fmtBtc(state.confirmed);
    $('home-sats').textContent = fmtSats(state.confirmed);
    $('home-unconfirmed').hidden = state.unconfirmed === 0n;
    $('home-unconfirmed').textContent = `Unbestätigt: ${fmtBtc(state.unconfirmed)}`;
    $('home-updated').textContent = `Stand ${new Date(state.time).toLocaleTimeString('de-CH')}`;
    const list = $('home-coins');
    list.replaceChildren();
    for (const u of state.utxos) {
      const li = document.createElement('li');
      const a = document.createElement('span');
      a.textContent = `${u.chain === 1 ? 'Wechselgeld' : 'Empfang'} #${u.index}${u.confirmed ? '' : ' (unbestätigt)'}`;
      const b = document.createElement('span');
      b.textContent = fmtBtc(u.value);
      li.append(a, b);
      list.append(li);
    }
    if (!state.utxos.length) {                                 // leere Liste: Hinweis anzeigen
      const li = document.createElement('li');
      li.className = 'muted';
      li.textContent = 'Noch keine Münzen';
      list.append(li);
    }
  } else {                                                     // noch keine Daten (z. B. nach Wallet-Wechsel)
    $('home-balance').textContent = '–';
    $('home-sats').textContent = '';
    $('home-unconfirmed').hidden = true;
    $('home-coins').replaceChildren();
  }
  renderPendingBanner();
  show('home');
}

function renderPendingBanner() {
  const pending = getPending();
  $('pending-banner').hidden = !pending;
  if (pending) {
    const info = analyzePsbt(S.wallet, pending);
    $('pending-text').textContent = `Offene Transaktion: ${info.signedBy.length} von ${S.wallet.config.m} Signaturen`;
  }
}

async function refresh() {
  $('home-updated').textContent = 'Frage Server ab …';
  await S.wallet.scan(S.api, (n) => { $('home-updated').textContent = `Prüfe Adressen … ${n}`; });
  if (!$('scr-home').hidden) showHome();                       // Anzeige nur aktualisieren, wenn sichtbar
}

async function ensureState() {                                 // vor Empfangen/Senden aktuelle Daten sicherstellen
  if (!S.wallet.state) await refresh();
}

// ---------- offene Transaktion (nur im Arbeitsspeicher) ----------
// Wird die App geschlossen oder neu geladen, ist sie weg. Die Geräte müssen dann neu signieren.
function getPending() {
  return S.pending;
}
function setPending(bytes) {
  S.pending = bytes;
}

// ---------- Einrichtung ----------
function startSetup() {
  S.setup = { name: '', network: 'main', n: 3, m: 2, cosigners: [] };
  $('setup-name').value = '';
  $('setup-network').value = 'main';
  renderPolicy();
  show('setup-policy');
}

function renderPolicy() {
  const { n, m } = S.setup;
  $('n-val').textContent = n;
  $('m-val').textContent = m;
  let text = `${m} von ${n} Schlüsseln müssen unterschreiben.`;
  if (m === n) text += ' Achtung: Geht ein einziger Schlüssel verloren, ist das Geld nicht mehr erreichbar.';
  else if (m === 1) text += ' Achtung: Ein einziger gestohlener Schlüssel reicht zum Ausgeben.';
  else text += ` Bis zu ${n - m} Schlüssel dürfen verloren gehen.`;
  $('policy-sentence').textContent = text;
}

function changeCount(which, delta) {
  const s = S.setup;
  if (which === 'n') s.n = Math.min(MAX_COSIGNERS, Math.max(MIN_COSIGNERS, s.n + delta));
  else s.m = Math.min(s.n, Math.max(1, s.m + delta));
  s.m = Math.min(s.m, s.n);                                    // m darf nie grösser als n sein
  renderPolicy();
}

function policyNext() {
  const name = $('setup-name').value.trim();
  if (!WALLET_NAME_PATTERN.test(name)) throw new Error('Name: 1–15 Zeichen, nur Buchstaben, Ziffern, _ und -');
  S.setup.name = name;
  S.setup.network = $('setup-network').value;
  S.setup.cosigners = S.setup.cosigners.slice(0, S.setup.n);   // bei weniger Schlüsseln kürzen
  while (S.setup.cosigners.length < S.setup.n) S.setup.cosigners.push(null);
  renderSlots();
  show('setup-keys');
}

function renderSlots() {
  const ol = $('key-slots');
  ol.replaceChildren();
  S.setup.cosigners.forEach((c, i) => {
    const li = document.createElement('li');
    li.classList.toggle('done', Boolean(c));
    const head = document.createElement('div');
    head.className = 'slot-head';
    const title = document.createElement('strong');
    title.textContent = `Schlüssel ${i + 1}`;
    const fp = document.createElement('span');
    fp.className = 'fp';
    fp.textContent = c ? c.fingerprint.toUpperCase() : 'fehlt';
    head.append(title, fp);
    const label = document.createElement('input');             // Bezeichnung, z. B. "Jade Anna"
    label.placeholder = 'Bezeichnung, z.B. Jade Anna';
    label.maxLength = 30;
    label.value = c?.label ?? S.setup.labels?.[i] ?? '';
    label.oninput = () => { (S.setup.labels ??= [])[i] = label.value; if (c) c.label = label.value; };
    li.append(head, label);
    if (c) {
      const p = document.createElement('p');
      p.className = 'muted small';
      p.textContent = `Pfad ${c.path} – vergleiche den Fingerabdruck mit dem Gerät.`;
      li.append(p);
    }
    const actions = document.createElement('div');
    actions.className = 'actions';
    const scan = document.createElement('button');
    scan.className = c ? 'btn' : 'btn primary';
    scan.textContent = c ? 'Neu scannen' : 'QR scannen';
    scan.onclick = () => run(scan, () => addKey(i, label.value));
    actions.append(scan);
    if (c) {
      const del = document.createElement('button');
      del.className = 'btn';
      del.textContent = 'Entfernen';
      del.onclick = () => { S.setup.cosigners[i] = null; renderSlots(); };
      actions.append(del);
    }
    li.append(actions);
    ol.append(li);
  });
  $('keys-next').disabled = S.setup.cosigners.some((c) => !c);
}

async function addKey(i, label) {
  const net = NETWORKS[S.setup.network];
  const res = await scanQr(`Schlüssel ${i + 1}: Export-QR des Geräts scannen`);
  if (!res) return;
  const c = res.kind === 'ur' ? parseKeyUR(res.type, res.cbor, net) : parseKeyText(res.text, net); // streng prüfen
  c.label = label.trim();
  const others = S.setup.cosigners.filter((x, j) => x && j !== i);
  assertDistinct([...others, c]);                              // kein Schlüssel/Seed doppelt
  S.setup.cosigners[i] = c;
  renderSlots();
  toast(`Schlüssel ${c.fingerprint.toUpperCase()} übernommen`);
}

function keysNext() {
  const s = S.setup;
  const cfg = { name: s.name, network: s.network, m: s.m, cosigners: s.cosigners, createdAt: Date.now() };
  const w = new MultisigWallet(cfg);                           // vollständige Prüfung
  s.preview = w;
  fillSummary($('review-summary'), [
    ['Name', cfg.name],
    ['Regel', `${cfg.m} von ${cfg.cosigners.length}`],
    ['Netzwerk', NETWORKS[cfg.network].label],
    ...w.config.cosigners.map((c, i) => [`Schlüssel ${i + 1}`, `${c.fingerprint.toUpperCase()} ${c.label ? `(${c.label})` : ''}`]),
    ['Descriptor-Prüfsumme', buildDescriptor(w.config).split('#')[1]],
  ]);
  $('review-address').textContent = groupAddr(w.derive(0, 0).address);
  show('setup-review');
}

function createWallet() {
  const w = S.setup.preview;
  S.setup = null;
  S.backupOpen = true;                                         // bis das Backup bestätigt ist, vor dem Schliessen warnen
  openWallet(w.config);                                        // nur im Arbeitsspeicher, nichts wird gespeichert
  showRegister(false);
}

// ---------- Registrieren / Backup ----------
function showRegister(fromSettings) {
  const cfg = S.wallet.config;
  const desc = buildDescriptor(cfg);
  $('register-step').hidden = fromSettings;
  $('register-confirm').parentElement.hidden = fromSettings;
  $('register-confirm').checked = false;
  $('register-done').disabled = !fromSettings;
  $('register-done').textContent = fromSettings ? 'Zurück' : 'Fertig';
  $('register-done').onclick = () => {
    if (fromSettings) { show('settings'); return; }
    S.backupOpen = false;                                      // Backup bestätigt
    showHome();
  };
  $('register-descriptor').value = desc;
  $('register-checksum').textContent = desc.split('#')[1];     // Prüfsumme separat hervorheben
  $('desc-qr-box').hidden = true;
  $('desc-print').onclick = () => run(null, () => printBackup(cfg, desc));
  $('desc-copy').onclick = () => run(null, () => copy(desc));
  $('desc-download').onclick = () => downloadBackup(cfg, desc);
  $('desc-qr').onclick = () => { $('desc-qr-box').hidden = false; drawQr($('desc-qr-canvas'), desc, 'M'); };
  show('register');
  startAnimation($('register-qr'), (len) => encodeBytesUR(utf8(buildSetupFile(cfg)), len)); // nach show(), sonst gestoppt
}

// Bezeichnungen der Geräte (falls vorhanden) für Ausdruck und Datei.
function keyLines(cfg) {
  return cfg.cosigners.map((c, i) => `${i + 1}. ${c.fingerprint.toUpperCase()}  ${c.path}${c.label ? `  (${c.label})` : ''}`);
}

function downloadBackup(cfg, desc) {
  const text = [
    `DIY Multisig – Backup der Wallet "${cfg.name}" (${NETWORKS[cfg.network].label})`,
    `Erstellt: ${new Date().toLocaleString('de-CH')}`,
    `Regel: ${cfg.m} von ${cfg.cosigners.length}`,
    '',
    'Zum Wiederherstellen braucht es diesen Descriptor UND die nötige Anzahl Seeds.',
    'Der Descriptor enthält keine privaten Schlüssel, verrät aber Guthaben und Bewegungen.',
    'Laden in DIY Multisig: "Backup-Datei öffnen" und diese Datei wählen.',
    '',
    'SCHLÜSSEL:',
    ...keyLines(cfg),
    '',
    'DESCRIPTOR:',
    desc,
    '',
    'SETUP-DATEI (Coldcard-Format, für Jade/SeedSigner/Sparrow):',
    buildSetupFile(cfg),
  ].join('\n');
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${cfg.name}-multisig-backup.txt`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

// Füllt das Backup-Blatt (nur beim Drucken sichtbar) und öffnet den Druckdialog.
async function printBackup(cfg, desc) {
  const canvas = document.createElement('canvas');             // QR-Code in hoher Auflösung zeichnen
  drawQr(canvas, desc, 'M', 1000);                             // Fehlerkorrektur M: robuster auf Papier
  const img = $('print-qr');
  const loaded = new Promise((r) => { img.onload = r; });
  img.src = canvas.toDataURL('image/png');                     // als Bild einsetzen (druckt zuverlässiger als canvas)
  await loaded;
  const n = cfg.cosigners.length;
  $('print-meta').textContent = `${cfg.name} · ${cfg.m} von ${n} · ${NETWORKS[cfg.network].label} · erstellt ${new Date().toLocaleDateString('de-CH')}`;
  $('print-checksum').textContent = desc.split('#')[1];
  $('print-keys').replaceChildren(...keyLines(cfg).map((t) => { const li = document.createElement('li'); li.textContent = t.replace(/^\d+\. /, ''); return li; }));
  $('print-descriptor').textContent = desc;
  $('print-usage').replaceChildren(...[
    'Laden: DIY Multisig öffnen → "Backup-QR scannen" → diesen QR-Code scannen.',
    `Ausgeben braucht ${cfg.m} der ${n} Seeds (Signiergeräte). Dieses Blatt allein reicht nicht zum Ausgeben.`,
    'In anderer Software (z.B. Sparrow): Descriptor importieren, dann mit den Signiergeräten signieren.',
    'Enthält keine privaten Schlüssel, verrät aber Guthaben und alle Bewegungen. Sorgfältig und getrennt von den Seeds aufbewahren – am besten je ein Exemplar bei jedem Seed-Backup.',
  ].map((t) => { const li = document.createElement('li'); li.textContent = t; return li; }));
  window.print();                                              // Druckdialog (auch "Als PDF sichern")
}

// ---------- Wallet laden (aus dem Backup) ----------
// Erkennt das Netzwerk an der Schlüssel-Schreibweise: xpub/Zpub = Mainnet, tpub/Vpub = Testnetz.
function detectNetwork(text) {
  const main = /[xZ]pub[1-9A-HJ-NP-Za-km-z]{100,}/.test(text);
  const test = /[tV]pub[1-9A-HJ-NP-Za-km-z]{100,}/.test(text);
  if (main && !test) return 'main';
  if (test && !main) return 'testnet4';
  return null;                                                 // nichts oder gemischt gefunden
}

// Baut aus Backup-Text (Descriptor, Backup-Datei oder Setup-Datei) eine geprüfte Konfiguration.
function walletFromText(text, netId, name) {
  const net = NETWORKS[netId];
  const desc = /wsh\(sortedmulti\(\S+/.exec(text)?.[0];        // Descriptor-Zeile suchen (enthält keine Leerzeichen)
  const parsed = desc ? parseDescriptor(desc, net) : parseSetupFile(text, net);
  const fromFile = /^\s*Name:\s*([A-Za-z0-9_-]{1,15})\s*$/m.exec(text)?.[1]; // Name aus Setup-Datei, falls vorhanden
  const finalName = name || fromFile || 'Multisig';           // sonst Standardname
  if (!WALLET_NAME_PATTERN.test(finalName)) throw new Error('Name: 1–15 Zeichen, nur Buchstaben, Ziffern, _ und -');
  return { name: finalName, network: netId, m: parsed.m, cosigners: parsed.cosigners, createdAt: Date.now() };
}

// Lädt direkt (Mainnet). Bei Testnetz-Schlüsseln wird das Formular zur Netzwerkwahl gezeigt.
function loadFromText(text) {
  const netId = detectNetwork(text);
  if (!netId) throw new Error('Kein gültiger Descriptor gefunden');
  if (netId === 'main') {
    openWallet(walletFromText(text, 'main', ''));
    toast('Wallet geladen');
    return;
  }
  $('restore-text').value = text;                              // Testnetz: Signet oder Testnet4 wählen lassen
  $('restore-name').value = '';
  $('restore-network').value = netId;
  guessNetwork(text);
  show('restore');
  toast('Testnetz-Wallet: bitte Netzwerk wählen');
}

// QR-Ergebnis → Text (normaler QR oder animierte Setup-Datei als UR "bytes").
function qrToText(res) {
  if (res.kind === 'text') return res.text;
  if (res.type === 'bytes') return new TextDecoder('utf-8', { fatal: true }).decode(cborDecode(res.cbor));
  throw new Error('Bitte den Descriptor-QR vom Backup-Blatt scannen');
}

async function scanBackup() {                                  // Startbildschirm: Backup-QR scannen
  const res = await scanQr('Backup-QR scannen');
  if (res) loadFromText(qrToText(res));
}

async function openBackupFile(file) {                          // Startbildschirm: Backup-Datei öffnen
  if (!file) return;
  if (file.size > 100000) throw new Error('Datei zu gross für ein Backup');
  loadFromText(await file.text());
}

async function restoreScan() {                                 // Formular: QR scannen und Text einfügen
  const res = await scanQr('Descriptor oder Setup-Datei scannen');
  if (!res) return;
  const text = qrToText(res);
  $('restore-text').value = text;
  guessNetwork(text);
}

function guessNetwork(text) {                                  // tpub/Vpub → Testnetz vorschlagen
  if (/[tV]pub/.test(text) && $('restore-network').value === 'main') $('restore-network').value = 'testnet4';
  const name = /^\s*Name:\s*(.+)$/im.exec(text)?.[1]?.trim();  // Name aus Setup-Datei übernehmen
  if (name && !$('restore-name').value) $('restore-name').value = name.replace(/[^A-Za-z0-9_-]/g, '_').slice(0, 15);
}

function restoreGo() {                                         // Formular: laden mit gewähltem Netzwerk
  const cfg = walletFromText($('restore-text').value, $('restore-network').value, $('restore-name').value.trim());
  openWallet(cfg);
  toast('Wallet geladen');
}

// Wallet aus dem Arbeitsspeicher entfernen (z. B. um eine andere zu laden).
function closeWallet() {
  if (S.pending && !window.confirm('Offene Transaktion verwerfen und Wallet schliessen?')) return;
  S.wallet = null;
  S.api = null;
  S.pending = null;
  S.draft = null;
  S.server = null;
  S.backupOpen = false;
  $('net-badge').hidden = true;
  show('welcome');
}

// ---------- Empfangen ----------
async function showReceive() {
  await ensureState();
  show('receive');                                             // zuerst einblenden, damit der QR-Code die richtige Grösse bekommt
  renderReceive();
}

function renderReceive() {
  const index = S.wallet.state.nextIndex[0] + S.receiveOffset; // erste unbenutzte Adresse (+ vorgeblättert)
  const d = S.wallet.derive(0, index);
  $('receive-address').textContent = groupAddr(d.address);
  $('receive-index').textContent = `Empfangsadresse #${index}`;
  drawQr($('receive-qr'), `bitcoin:${d.address}`.toUpperCase()); // BIP21, Grossbuchstaben = kompakter QR
  $('receive-copy').onclick = () => run(null, () => copy(d.address));
}

function receiveNext() {
  if (S.receiveOffset + 1 >= GAP_LIMIT) throw new Error(`Höchstens ${GAP_LIMIT} unbenutzte Adressen im Voraus, sonst findet eine Wiederherstellung sie nicht.`);
  S.receiveOffset++;
  renderReceive();
}

// ---------- Senden ----------
async function showSend() {
  if (getPending()) { showSign(); toast('Es gibt noch eine offene Transaktion'); return; }
  await ensureState();
  S.sendAll = false;
  $('send-to').value = '';                                     // Formular leeren
  $('send-amount').value = '';
  $('send-amount').placeholder = S.unit === 'BTC' ? '0.001' : '100000';
  $('send-available').textContent = `Verfügbar (bestätigt): ${fmtBtc(S.wallet.state.confirmed)}`;
  show('send');
  try {
    S.fees = await S.api.fees();                               // Gebührenempfehlungen holen
    for (const k of ['fast', 'medium', 'slow']) $(`fee-${k}`).textContent = `(${Math.max(1, S.fees[k])} sat/vB)`;
  } catch (e) {
    S.fees = null;
    toast(`Gebühren nicht abrufbar: ${e.message}. Bitte eigene Gebühr eingeben.`, true);
  }
}

function parseAmount(text) {                                   // Eingabe → Sats (BigInt), ohne Rundungsfehler
  const t = text.trim().replace(/['’\s]/g, '').replace(',', '.'); // 1'000 und 0,5 erlauben
  if (S.unit === 'sats') {
    if (!/^\d{1,16}$/.test(t)) throw new Error('Betrag in sats: nur ganze Zahlen');
    return BigInt(t);
  }
  if (!/^\d{1,8}(\.\d{1,8})?$/.test(t)) throw new Error('Betrag in BTC: höchstens 8 Nachkommastellen');
  return Decimal.decode(t);                                    // exakte Umrechnung in Sats
}

function toggleUnit() {
  let sats = null;
  try { sats = parseAmount($('send-amount').value); } catch { sats = null; }
  S.unit = S.unit === 'BTC' ? 'sats' : 'BTC';
  $('send-unit').textContent = S.unit;
  if (sats !== null && !S.sendAll) $('send-amount').value = S.unit === 'sats' ? sats.toString() : fmtBtc(sats).replace(' BTC', '');
}

function chosenFeeRate() {
  const choice = document.querySelector('input[name=fee]:checked').value;
  const rate = choice === 'custom' ? Number($('fee-custom').value.replace(',', '.'))
    : S.fees ? Math.max(1, S.fees[choice]) : NaN;
  if (Number.isNaN(rate)) throw new Error('Keine Gebühr verfügbar – bitte "Eigene" wählen');
  checkFeeRate(rate);
  return rate;
}

async function scanRecipient() {
  const res = await scanQr('Empfänger-QR scannen');
  if (!res) return;
  if (res.kind !== 'text') throw new Error('Das ist keine Adresse');
  let text = res.text.trim();
  const m = /^bitcoin:([^?]+)(\?.*)?$/i.exec(text);            // BIP21: bitcoin:ADRESSE?amount=…
  if (m) {
    text = m[1];
    const amount = new URLSearchParams(m[2] ?? '').get('amount');
    if (amount && /^\d{1,8}(\.\d{1,8})?$/.test(amount)) {      // Betrag aus der Zahlungsaufforderung übernehmen
      S.unit = 'BTC'; $('send-unit').textContent = 'BTC'; S.sendAll = false;
      $('send-amount').value = amount;
    }
  }
  if (/^(bc1|tb1)/i.test(text) && text === text.toUpperCase()) text = text.toLowerCase(); // QR-Grossschreibung zurückwandeln
  recipientScript(text, S.wallet.net);                         // sofort prüfen
  $('send-to').value = text;
}

async function sendNext() {
  const to = $('send-to').value.trim();
  recipientScript(to, S.wallet.net);                           // Adresse prüfen (Netzwerk, Prüfsumme)
  const amount = S.sendAll ? null : parseAmount($('send-amount').value);
  const feeRate = chosenFeeRate();
  const psbt = await createPsbt({ wallet: S.wallet, api: S.api, recipient: to, amount, feeRate });
  S.draft = psbt;
  showReview(psbt);
}

function showReview(psbt) {
  const info = analyzePsbt(S.wallet, psbt);                    // alles aus der PSBT selbst ablesen
  const external = info.outputs.filter((o) => !o.isChange);
  const change = info.outputs.find((o) => o.isChange);
  const rows = [];
  for (const o of external) rows.push(['An', groupAddr(o.address)], ['Betrag', `${fmtBtc(o.amount)}\n${fmtSats(o.amount)}`]);
  const pct = Number(info.fee) / Number(info.sendTotal);
  rows.push(['Gebühr', `${fmtSats(info.fee)} (${info.feeRate.toFixed(1)} sat/vB, ${(pct * 100).toFixed(2)} %)`]);
  rows.push(['Wechselgeld', change ? `${fmtBtc(change.amount)} zurück an diese Wallet` : 'keins']);
  rows.push(['Total ab Wallet', fmtBtc(info.sendTotal + info.fee)]);
  rows.push(['Transaktions-ID', shortId(info.txid)]);
  fillSummary($('tx-summary'), rows);
  const warn = $('tx-warnings');
  warn.replaceChildren();
  const addWarn = (t) => { const d = document.createElement('div'); d.className = 'warn'; d.textContent = t; warn.append(d); };
  if (pct > HIGH_FEE_RATIO) addWarn(`Hohe Gebühr: ${(pct * 100).toFixed(1)} % des Betrags.`);
  if (external.some((o) => o.ownAddress)) addWarn('Die Empfängeradresse gehört zu dieser Wallet (Geld bleibt hier).');
  if (S.wallet.config.network !== 'main') addWarn(`Testnetz (${S.wallet.net.label}): keine echten Bitcoin.`);
  $('tx-confirm').checked = false;
  $('tx-to-sign').disabled = true;
  show('send-review');
}

function toSign() {
  setPending(S.draft);                                         // offene Transaktion im Arbeitsspeicher halten
  S.draft = null;
  showSign();
}

// ---------- Signieren ----------
function showSign() {
  const psbt = getPending();
  if (!psbt) { showHome(); return; }
  const info = analyzePsbt(S.wallet, psbt);
  if (info.ready) { showBroadcast(); return; }
  const { m, cosigners } = S.wallet.config;
  const missing = m - info.signedBy.length;
  $('sign-status').textContent = `${info.signedBy.length} von ${m} Signaturen vorhanden. Noch ${missing} nötig.`;
  const ol = $('sign-list');
  ol.replaceChildren();
  for (const c of cosigners) {
    const li = document.createElement('li');
    const ok = info.signedBy.includes(c.fingerprint);
    li.classList.toggle('ok', ok);
    const name = document.createElement('span');
    name.textContent = `${c.label || 'Gerät'} · ${c.fingerprint.toUpperCase()}`;
    const st = document.createElement('span');
    st.className = 'state';
    st.textContent = ok ? 'signiert' : 'offen';
    li.append(name, st);
    ol.append(li);
  }
  show('sign');
  startAnimation($('sign-qr'), (len) => encodePsbtUR(psbt, len)); // PSBT als animierter QR
}

async function scanSignature() {
  const res = await scanQr('Signierte Transaktion vom Gerät scannen');
  if (!res) return;
  let bytes;
  if (res.kind === 'ur' && (res.type === 'crypto-psbt' || res.type === 'psbt')) bytes = cborDecode(res.cbor); // UR → PSBT-Bytes
  else if (res.kind === 'text' && /^cHNidP/.test(res.text.trim())) bytes = base64.decode(res.text.trim()); // Base64-PSBT
  else throw new Error('Das ist keine signierte Transaktion');
  if (!(bytes instanceof Uint8Array)) throw new Error('Unerwartetes PSBT-Format');
  const merged = mergeSignedPsbt(S.wallet, getPending(), bytes); // prüft jede Signatur
  setPending(merged);
  showSign();
  toast('Signatur geprüft und übernommen');
}

function cancelPending() {
  if (!window.confirm('Offene Transaktion verwerfen? Bereits gesammelte Signaturen gehen verloren.')) return;
  setPending(null);
  showHome();
}

// ---------- Senden ins Netzwerk ----------
function showBroadcast() {
  const psbt = getPending();
  const fin = finalizePsbt(S.wallet, psbt);                    // prüft und baut die fertige Transaktion
  const { info } = fin;
  const rows = [];
  for (const o of info.outputs.filter((x) => !x.isChange)) rows.push(['An', groupAddr(o.address)], ['Betrag', fmtBtc(o.amount)]);
  rows.push(['Gebühr', `${fmtSats(info.fee)} (${info.feeRate.toFixed(1)} sat/vB)`]);
  rows.push(['Signiert von', info.signedBy.map((fp) => fp.toUpperCase()).join(', ')]);
  rows.push(['Transaktions-ID', shortId(fin.txid)]);
  fillSummary($('final-summary'), rows);
  $('broadcast-go').onclick = () => run($('broadcast-go'), async () => {
    const txid = await S.api.broadcast(fin.hex);               // ins Netzwerk senden
    if (txid !== fin.txid) throw new Error('Server meldet eine andere txid – bitte im Explorer prüfen');
    setPending(null);
    $('done-txid').textContent = txid;
    $('done-link').href = `${S.wallet.net.explorer}/tx/${txid}`;
    show('done');
    setTimeout(() => run(null, refresh), 3000);                // Guthaben kurz danach neu laden
  });
  show('broadcast');
}

// ---------- Einstellungen ----------
function showSettings() {
  const netId = S.wallet.config.network;
  $('set-server').value = serverFor(netId);
  $('set-version').textContent = `Version ${VERSION}`;
  show('settings');
}

async function saveServer() {
  const netId = S.wallet.config.network;
  const url = normalizeServerUrl($('set-server').value);
  const api = new EsploraApi(url);
  await api.fees();                                            // Testabfrage: antwortet der Server?
  S.server = url === NETWORKS[netId].api ? null : url;        // gilt nur für diese Sitzung
  S.api = api;
  S.wallet.state = null;                                       // Daten neu vom neuen Server laden
  toast('Server übernommen (bis zum Schliessen der App)');
}

// ---------- Ereignisse verbinden ----------
function bind() {
  document.querySelectorAll('[data-go]').forEach((b) => {     // einfache Navigation
    b.addEventListener('click', () => {
      const go = b.dataset.go;
      if (go === 'setup') startSetup();
      else if (go === 'restore') { $('restore-text').value = ''; $('restore-name').value = ''; $('restore-network').value = 'main'; show('restore'); }
      else if (go === 'home' || go === 'back') {
        S.setup = null;                                        // abgebrochene Einrichtung verwerfen
        if (S.wallet) showHome(); else show('welcome');
      }
    });
  });
  $('n-minus').onclick = () => changeCount('n', -1);
  $('n-plus').onclick = () => changeCount('n', +1);
  $('m-minus').onclick = () => changeCount('m', -1);
  $('m-plus').onclick = () => changeCount('m', +1);
  $('policy-next').onclick = () => run(null, policyNext);
  $('keys-back').onclick = () => show('setup-policy');
  $('keys-next').onclick = () => run(null, keysNext);
  $('review-back').onclick = () => show('setup-keys');
  $('review-create').onclick = () => run(null, createWallet);
  $('register-confirm').onchange = (e) => { $('register-done').disabled = !e.target.checked; };
  $('restore-scan').onclick = () => run($('restore-scan'), restoreScan);
  $('restore-text').oninput = () => guessNetwork($('restore-text').value);
  $('restore-go').onclick = () => run(null, restoreGo);
  $('load-scan').onclick = () => run($('load-scan'), scanBackup);
  $('load-file-btn').onclick = () => $('load-file').click();   // verstecktes Datei-Feld öffnen
  $('load-file').onchange = (e) => run(null, async () => {
    const file = e.target.files[0];
    e.target.value = '';                                       // gleiche Datei später erneut wählbar
    await openBackupFile(file);
  });
  $('home-refresh').onclick = () => run($('home-refresh'), refresh);
  $('go-receive').onclick = () => run($('go-receive'), showReceive);
  $('go-send').onclick = () => run($('go-send'), showSend);
  $('go-settings').onclick = showSettings;
  $('pending-continue').onclick = () => run(null, showSign);
  $('receive-next').onclick = () => run(null, receiveNext);
  $('send-scan').onclick = () => run($('send-scan'), scanRecipient);
  $('send-unit').onclick = toggleUnit;
  $('send-max').onclick = () => {                              // alles senden (Gebühr wird abgezogen)
    S.sendAll = true;
    $('send-amount').value = '';
    $('send-amount').placeholder = 'Alles (abzüglich Gebühr)';
  };
  $('send-amount').oninput = () => { S.sendAll = false; };
  $('fee-custom').onfocus = () => { document.querySelector('input[name=fee][value=custom]').checked = true; };
  $('send-next').onclick = () => run($('send-next'), sendNext);
  $('tx-confirm').onchange = (e) => { $('tx-to-sign').disabled = !e.target.checked; };
  $('review-cancel').onclick = () => { S.draft = null; showHome(); };
  $('tx-to-sign').onclick = () => run(null, toSign);
  $('sign-scan').onclick = () => run($('sign-scan'), scanSignature);
  $('sign-cancel').onclick = cancelPending;
  $('set-server-default').onclick = () => { $('set-server').value = NETWORKS[S.wallet.config.network].api; };
  $('set-server-save').onclick = () => run($('set-server-save'), saveServer);
  $('set-register').onclick = () => showRegister(true);
  $('set-close').onclick = closeWallet;
}

// Aufräumen: Version 1.0.0 hat Daten im Browser gespeichert und einen Service Worker mit Cache angelegt.
// Beides wird entfernt, damit nichts mehr im gemeinsamen Speicher der Adresse liegt.
function removeLegacyData() {
  try { localStorage.removeItem(LEGACY_STORAGE_KEY); } catch { /* Speicher gesperrt: nichts zu tun */ }
  const base = new URL('./', location.href).href;              // Ordner dieser App
  navigator.serviceWorker?.getRegistrations()
    .then((regs) => regs.filter((r) => r.scope.startsWith(base)).forEach((r) => r.unregister()))
    .catch(() => {});
  window.caches?.keys()
    .then((keys) => keys.filter((k) => k.startsWith('diy-multisig-')).forEach((k) => caches.delete(k)))
    .catch(() => {});
}

// Warnung vor dem Schliessen/Neuladen, solange etwas verloren ginge.
window.addEventListener('beforeunload', (e) => {
  if (S.pending || S.setup || S.backupOpen) {                  // offene Transaktion, Einrichtung oder Backup fehlt
    e.preventDefault();
    e.returnValue = '';                                        // ältere Browser brauchen das
  }
});

// ---------- Start ----------
bind();
removeLegacyData();
show('welcome');                                               // nichts gespeichert: immer mit dem Startbildschirm beginnen
