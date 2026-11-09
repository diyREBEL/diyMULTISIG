// descriptor.js – Wallet-Beschreibung als "Output Descriptor" (BIP380/383/389) und als Setup-Datei.
// Der Descriptor ist das wichtigste Backup neben den Seeds: Ohne ihn weiss niemand, welche
// Schlüssel zusammengehören und wie viele Signaturen nötig sind.
import { parseKeyText, parsePath, formatPath, assertDistinct, makeCosigner } from './keys.js'; // Schlüssel-Prüfung

// Zeichensatz und Konstanten der Descriptor-Prüfsumme, exakt wie in Bitcoin Core (BIP380).
const INPUT_CHARSET = "0123456789()[],'/*abcdefgh@:$%{}IJKLMNOPQRSTUVWXYZ&+-.;<=>?!^_|~ijklmnopqrstuvwxyzABCDEFGH`#\"\\ ";
const CHECKSUM_CHARSET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
const GENERATOR = [0xf5dee51989n, 0xa9fdca3312n, 0x1bab10e32dn, 0x3706b1677an, 0x644d626ffdn];

// Polynom-Rechnung über einem endlichen Körper (BCH-Code). Erkennt Tippfehler zuverlässig.
function polymod(symbols) {
  let chk = 1n;                                              // Startwert
  for (const value of symbols) {
    const top = chk >> 35n;                                  // oberste 5 Bits merken
    chk = ((chk & 0x7ffffffffn) << 5n) ^ BigInt(value);      // 5 Bits nachschieben
    for (let i = 0; i < 5; i++) if ((top >> BigInt(i)) & 1n) chk ^= GENERATOR[i]; // Generator einmischen
  }
  return chk;
}

// Berechnet die 8 Zeichen lange Prüfsumme eines Descriptors (ohne "#…").
export function descriptorChecksum(desc) {
  const symbols = [];                                        // Zeichen → 5-Bit-Symbole
  const groups = [];                                         // "Gruppen"-Anteile, je 3 zusammengefasst
  for (const ch of desc) {
    const v = INPUT_CHARSET.indexOf(ch);                     // Position im Zeichensatz
    if (v < 0) throw new Error(`Unerlaubtes Zeichen im Descriptor: ${ch}`);
    symbols.push(v & 31);                                    // untere 5 Bits
    groups.push(v >> 5);                                     // Gruppe 0–2
    if (groups.length === 3) {                               // drei Gruppen → ein Symbol
      symbols.push(groups[0] * 9 + groups[1] * 3 + groups[2]);
      groups.length = 0;
    }
  }
  if (groups.length === 1) symbols.push(groups[0]);          // Rest-Gruppen anhängen
  else if (groups.length === 2) symbols.push(groups[0] * 3 + groups[1]);
  const chk = polymod([...symbols, 0, 0, 0, 0, 0, 0, 0, 0]) ^ 1n; // 8 Nullen anhängen, Ergebnis berechnen
  let out = '';
  for (let i = 0; i < 8; i++) out += CHECKSUM_CHARSET[Number((chk >> BigInt(5 * (7 - i))) & 31n)]; // in Zeichen
  return out;
}

// Erzeugt den vollständigen Descriptor einer Wallet, z. B.
// wsh(sortedmulti(2,[a1b2c3d4/48h/0h/0h/2h]xpub…/<0;1>/*,…))#prüfsum
// <0;1> bedeutet: Kette 0 = Empfangsadressen, Kette 1 = Wechselgeld (BIP389).
export function buildDescriptor(wallet) {
  const keys = wallet.cosigners.map((c) => {
    const origin = formatPath(parsePath(c.path), 'h').slice(1); // "m/48'/…" → "/48h/…"
    return `[${c.fingerprint}${origin}]${c.xpub}/<0;1>/*`;      // Schlüssel mit Herkunft
  });
  const body = `wsh(sortedmulti(${wallet.m},${keys.join(',')}))`; // P2WSH + sortierte Multisig
  return `${body}#${descriptorChecksum(body)}`;              // Prüfsumme anhängen
}

// Liest einen Descriptor (z. B. aus Sparrow oder einem Backup) und prüft ihn vollständig.
export function parseDescriptor(text, net) {
  let s = text.trim().replace(/\s+/g, '');                   // Leerraum entfernen
  const hashPos = s.indexOf('#');                            // Prüfsumme vorhanden?
  if (hashPos >= 0) {
    const body = s.slice(0, hashPos);
    const given = s.slice(hashPos + 1);
    if (given !== descriptorChecksum(body)) throw new Error('Prüfsumme des Descriptors stimmt nicht – Tippfehler?');
    s = body;                                                // ab hier ohne Prüfsumme weiter
  }
  s = s.replace(/\/\{0,1\}\/\*/g, '/<0;1>/*');               // ältere Schreibweise {0,1} vereinheitlichen
  const m = /^wsh\(sortedmulti\((\d{1,2}),(.+)\)\)$/.exec(s); // nur dieser eine Typ wird unterstützt
  if (!m) throw new Error('Nur wsh(sortedmulti(…)) wird unterstützt (Native SegWit Multisig).');
  const threshold = Number(m[1]);                            // benötigte Signaturen
  const parts = m[2].split(',');                             // einzelne Schlüssel
  for (const p of parts) {
    if (!/\/(<0;1>|0)\/\*$/.test(p)) throw new Error('Schlüssel müssen auf /<0;1>/* oder /0/* enden');
  }
  const cosigners = parts.map((p) => parseKeyText(p, net));  // jeden Schlüssel streng prüfen
  assertDistinct(cosigners);                                  // keine Duplikate
  if (threshold < 1 || threshold > cosigners.length) throw new Error('Ungültige Anzahl benötigter Signaturen');
  return { m: threshold, cosigners };
}

// Setup-Datei im Coldcard-Format. Jade registriert die Wallet damit, SeedSigner prüft damit
// Adressen und Wechselgeld. Übertragen wird sie als animierter QR-Code (UR "bytes").
export function buildSetupFile(wallet) {
  const lines = [
    '# Multisig setup file (DIY Multisig)',                  // Kommentarzeile
    '#',
    `Name: ${wallet.name}`,                                   // Name (Jade: max. 15 Zeichen)
    `Policy: ${wallet.m} of ${wallet.cosigners.length}`,     // z. B. "2 of 3"
  ];
  const paths = new Set(wallet.cosigners.map((c) => c.path)); // haben alle denselben Pfad?
  if (paths.size === 1) lines.push(`Derivation: ${wallet.cosigners[0].path}`); // gemeinsamer Pfad
  lines.push('Format: P2WSH', '');                           // Skript-Typ + Leerzeile
  for (const c of wallet.cosigners) {
    if (paths.size > 1) lines.push(`Derivation: ${c.path}`); // sonst Pfad pro Schlüssel
    lines.push(`${c.fingerprint.toUpperCase()}: ${c.xpub}`); // FINGERABDRUCK: xpub
  }
  return lines.join('\n') + '\n';                            // Zeilen verbinden
}

// Liest eine Setup-Datei im Coldcard-Format (z. B. Backup-Export von Jade oder Sparrow).
export function parseSetupFile(text, net) {
  let name = '';                                             // Wallet-Name (optional)
  let m = 0;                                                 // benötigte Signaturen
  let n = 0;                                                 // Anzahl Schlüssel
  let format = '';                                           // Skript-Typ
  let derivation = '';                                       // aktueller Pfad (global oder pro Schlüssel)
  const cosigners = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();                                 // Leerraum am Rand entfernen
    if (!line || line.startsWith('#')) continue;             // Leer- und Kommentarzeilen überspringen
    const colon = line.indexOf(':');
    if (colon < 0) throw new Error(`Unverständliche Zeile: ${line.slice(0, 30)}`);
    const key = line.slice(0, colon).trim();                 // links vom Doppelpunkt
    const value = line.slice(colon + 1).trim();              // rechts vom Doppelpunkt
    const k = key.toLowerCase();
    if (k === 'name') name = value;
    else if (k === 'policy') {
      const pm = /^(\d{1,2})\s*of\s*(\d{1,2})$/i.exec(value); // "2 of 3"
      if (!pm) throw new Error('Policy-Zeile ungültig');
      m = Number(pm[1]); n = Number(pm[2]);
    } else if (k === 'derivation') derivation = value;
    else if (k === 'format') format = value.toUpperCase();
    else if (k === 'sorted' && value.toLowerCase() === 'false') throw new Error('Unsortierte Multisig wird nicht unterstützt');
    else if (/^[0-9a-f]{8}$/i.test(key)) {                   // "FINGERABDRUCK: xpub"
      if (!derivation) throw new Error('Derivation-Zeile fehlt vor den Schlüsseln');
      cosigners.push(makeCosigner(net, key, parsePath(derivation), value));
    }
  }
  if (format !== 'P2WSH') throw new Error('Nur Format P2WSH (Native SegWit) wird unterstützt');
  if (!m || cosigners.length !== n) throw new Error('Anzahl Schlüssel passt nicht zur Policy');
  if (m > n) throw new Error('Ungültige Policy');
  assertDistinct(cosigners);
  return { name, m, cosigners };
}
