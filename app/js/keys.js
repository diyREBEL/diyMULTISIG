// keys.js – öffentliche Schlüssel (xpubs) der Signiergeräte einlesen und streng prüfen.
// Die Wallet kennt NIE private Schlüssel. Taucht doch einer auf, wird er abgelehnt.
import { HDKey, createBase58check, sha256, hex } from '../lib/vendor.js'; // BIP32, Base58check, Hex
import { cborDecode, Tagged } from './cbor.js';                          // für UR-Exporte der Geräte

const b58c = createBase58check(sha256);           // Base58 mit 4-Byte-Prüfsumme (Format der xpubs)
export const HARDENED = 0x80000000;               // Ab diesem Index gilt ein Pfadschritt als "gehärtet" (')

// Pfad als Zahlenliste → Text, z. B. [0x80000030, …] → "m/48'/0'/0'/2'"
export function formatPath(path, mark = "'") {
  return ['m', ...path.map((i) => (i >= HARDENED ? `${i - HARDENED}${mark}` : String(i)))].join('/');
}

// Text → Pfad als Zahlenliste. Erlaubt "m/48'/0'/0'/2'", "48h/0h/0h/2h" oder "/48h/0h…".
export function parsePath(text) {
  const parts = text.trim().replace(/^m/i, '').split('/').filter((p) => p !== ''); // "m" und Leerteile entfernen
  return parts.map((p) => {
    const m = /^(\d{1,10})(['hH]?)$/.exec(p);         // Zahl, optional mit ' oder h
    if (!m) throw new Error(`Ungültiger Pfadschritt: ${p}`);
    const n = Number(m[1]);                          // Zahlenwert
    if (n >= HARDENED) throw new Error('Pfadschritt zu gross');
    return m[2] ? n + HARDENED : n;                  // gehärtet → Offset addieren
  });
}

// Liefert die Versions-Bytes für @scure/bip32 (privat wird nie benutzt, muss aber angegeben werden).
export function bip32Versions(net) {
  const isMain = net.xpubVersion === 0x0488b21e;     // Mainnet oder Testnet?
  return { public: net.xpubVersion, private: isMain ? 0x0488ade4 : 0x04358394 };
}

// Erwarteter Pfad nach BIP48 für P2WSH-Multisig: m/48'/coin'/konto'/2'
function checkBip48(path, net) {
  const ok = path.length === 4
    && path[0] === HARDENED + 48                     // Zweck 48 = Multisig
    && path[1] === HARDENED + net.coinType           // 0 = Bitcoin, 1 = Testnetze
    && path[2] >= HARDENED                           // Kontonummer, gehärtet
    && path[3] === HARDENED + 2;                     // 2 = Native SegWit (P2WSH)
  if (!ok) {
    throw new Error(`Pfad ${formatPath(path)} passt nicht. Erwartet wird m/48'/${net.coinType}'/0'/2' `
      + '(am Gerät beim Export "Multisig" und "Native SegWit" wählen).');
  }
}

// Baut aus Rohdaten einen xpub-Text im Standardformat des Netzwerks (xpub bzw. tpub).
function serializeXpub(net, depth, parentFp, childNumber, chainCode, pubKey) {
  const buf = new Uint8Array(78);                    // xpubs sind immer 78 Bytes lang
  const view = new DataView(buf.buffer);             // zum Schreiben von 32-Bit-Zahlen
  view.setUint32(0, net.xpubVersion);                // 4 Bytes Version
  buf[4] = depth;                                    // 1 Byte Tiefe im Baum
  view.setUint32(5, parentFp >>> 0);                 // 4 Bytes Fingerabdruck des Elternschlüssels
  view.setUint32(9, childNumber >>> 0);              // 4 Bytes Kind-Index
  buf.set(chainCode, 13);                            // 32 Bytes Chain-Code
  buf.set(pubKey, 45);                               // 33 Bytes öffentlicher Schlüssel
  return b58c.encode(buf);                           // Base58check kodieren
}

// Zentrale Prüfung eines Mitsignierer-Schlüssels. Gibt ein sauberes Objekt zurück.
export function makeCosigner(net, fingerprintHex, path, xpubText, label = '') {
  if (!/^[0-9a-f]{8}$/i.test(fingerprintHex)) throw new Error('Fingerabdruck muss 8 Hex-Zeichen haben');
  let raw;
  try { raw = b58c.decode(xpubText.trim()); }        // Base58check prüft die Prüfsumme
  catch { throw new Error('Schlüssel ist beschädigt (Prüfsumme falsch)'); }
  if (raw.length !== 78) throw new Error('Schlüssel hat die falsche Länge');
  const version = new DataView(raw.buffer, raw.byteOffset).getUint32(0); // Versions-Bytes lesen
  if (version !== net.xpubVersion && version !== net.slip132Version) {   // xpub/Zpub (Main) bzw. tpub/Vpub (Test)
    if ([0x04b24746, 0x045f1cf6, 0x049d7cb2, 0x044a5262].includes(version)) { // zpub, vpub, ypub, upub
      throw new Error('Das ist ein Single-Sig-Schlüssel. Wähle am Gerät beim Export "Multisig".');
    }
    if (version === 0x0488ade4 || version === 0x04358394 || version === 0x02aa7a99 || version === 0x02575048) {
      throw new Error('ACHTUNG: Das ist ein PRIVATER Schlüssel. Nie weitergeben! Er wurde nicht gespeichert.');
    }
    throw new Error(`Schlüssel gehört nicht zum Netzwerk ${net.label}`);
  }
  checkBip48(path, net);                             // Pfad muss zum Multisig-Standard passen
  raw.set([0, 0, 0, 0].map((_, i) => (net.xpubVersion >>> (24 - 8 * i)) & 0xff), 0); // Version auf xpub/tpub setzen
  const xpub = b58c.encode(raw);                     // normalisierter Text
  const node = HDKey.fromExtendedKey(xpub, bip32Versions(net)); // prüft u. a., ob der Punkt auf der Kurve liegt
  if (node.privateKey) throw new Error('Privater Schlüssel abgelehnt');   // doppelte Sicherung
  if (node.depth !== path.length) throw new Error('Tiefe des Schlüssels passt nicht zum Pfad'); // Konsistenz
  if (node.index !== path[path.length - 1]) throw new Error('Letzter Pfadschritt passt nicht zum Schlüssel');
  return {
    fingerprint: fingerprintHex.toLowerCase(),       // Master-Fingerabdruck des Geräts (8 Hex-Zeichen)
    path: formatPath(path),                          // Pfad als Text m/48'/…
    xpub,                                            // erweiterter öffentlicher Schlüssel
    label: String(label).slice(0, 30),               // frei wählbarer Name, z. B. "Jade Anna"
  };
}

// Erkennt Text-Exporte wie "[a1b2c3d4/48h/0h/0h/2h]xpub6…" (SeedSigner, Sparrow, Specter …).
export function parseKeyText(text, net) {
  const t = text.trim().replace(/\s+/g, '');         // Leerzeichen/Zeilenumbrüche entfernen
  const m = /^\[([0-9a-fA-F]{8})((?:\/\d{1,10}['hH]?)*)\]([1-9A-HJ-NP-Za-km-z]{100,120})(\/(?:<0;1>|\{0,1\}|0)\/\*)?$/.exec(t);
  if (!m) {
    if (/^[xtZV]pub[1-9A-HJ-NP-Za-km-z]{100,}$/.test(t)) {
      throw new Error('Fingerabdruck und Pfad fehlen. Exportiere den Schlüssel am Gerät erneut als QR-Code.');
    }
    throw new Error('Unbekanntes Format. Erwartet: QR-Code des Geräts oder [fingerabdruck/pfad]xpub…');
  }
  return makeCosigner(net, m[1], parsePath(m[2]), m[3]); // Teile prüfen und zusammensetzen
}

// Liest ein CBOR "crypto-hdkey" (Tag 303) bzw. "hdkey" (Tag 40303).
function cosignerFromHdkey(map, net, accountFp) {
  if (!(map instanceof Map)) throw new Error('HD-Schlüssel: falsches Format');
  if (map.get(2) === true) throw new Error('ACHTUNG: Das ist ein PRIVATER Schlüssel. Er wurde nicht gespeichert.');
  const key = map.get(3);                            // 33 Bytes öffentlicher Schlüssel
  const chain = map.get(4);                          // 32 Bytes Chain-Code
  if (!(key instanceof Uint8Array) || key.length !== 33) throw new Error('HD-Schlüssel ohne gültigen Schlüssel');
  if (!(chain instanceof Uint8Array) || chain.length !== 32) throw new Error('HD-Schlüssel ohne Chain-Code');
  const use = untag(map.get(5), [305, 40305]);       // optional: Netzwerk-Angabe
  if (use instanceof Map) {
    const isTest = use.get(2) === 1;                 // 1 = Testnetz
    if (isTest !== (net.coinType === 1)) throw new Error(`Schlüssel gehört nicht zum Netzwerk ${net.label}`);
  }
  const origin = untag(map.get(6), [304, 40304]);    // Herkunft: Pfad + Master-Fingerabdruck
  if (!(origin instanceof Map)) throw new Error('Pfadangabe fehlt im Export');
  const comps = origin.get(1);                       // flache Liste [index, gehärtet?, index, gehärtet?, …]
  if (!Array.isArray(comps) || comps.length % 2 !== 0) throw new Error('Pfadangabe ungültig');
  const path = [];
  for (let i = 0; i < comps.length; i += 2) {
    if (!Number.isInteger(comps[i]) || typeof comps[i + 1] !== 'boolean') throw new Error('Pfadangabe ungültig');
    path.push(comps[i] + (comps[i + 1] ? HARDENED : 0)); // in Zahl mit Härtungs-Offset umrechnen
  }
  const fp = origin.get(2) ?? accountFp;             // Master-Fingerabdruck (hier oder im Konto-Objekt)
  if (!Number.isInteger(fp)) throw new Error('Fingerabdruck fehlt im Export');
  if (accountFp !== undefined && fp !== accountFp) throw new Error('Fingerabdrücke widersprechen sich');
  const parentFp = Number.isInteger(map.get(8)) ? map.get(8) : 0; // Eltern-Fingerabdruck (nur Kosmetik)
  const xpub = serializeXpub(net, path.length, parentFp, path[path.length - 1] ?? 0, chain, key);
  return makeCosigner(net, fp.toString(16).padStart(8, '0'), path, xpub); // gemeinsame Prüfung
}

// Entfernt einen erwarteten CBOR-Tag; andere Werte bleiben unverändert.
function untag(v, tags) {
  return v instanceof Tagged && tags.includes(v.tag) ? v.value : v;
}

// Liest UR-Exporte: crypto-account (SeedSigner, Jade Standard) und crypto-hdkey (Jade Option).
export function parseKeyUR(type, cbor, net) {
  const data = cborDecode(cbor);                     // CBOR → Objekt
  if (type === 'crypto-hdkey' || type === 'hdkey') return cosignerFromHdkey(data, net);
  if (type === 'crypto-account' || type === 'account-descriptor') {
    if (!(data instanceof Map)) throw new Error('Konto-Export: falsches Format');
    const accountFp = data.get(1);                   // Master-Fingerabdruck des Geräts
    const outputs = data.get(2);                     // Liste möglicher Skript-Typen
    if (!Number.isInteger(accountFp) || !Array.isArray(outputs)) throw new Error('Konto-Export unvollständig');
    for (const out of outputs) {                     // gesucht: wsh(<hdkey>) = Tag 401 um Tag 303
      if (out instanceof Tagged && out.tag === 401 && out.value instanceof Tagged && [303, 40303].includes(out.value.tag)) {
        return cosignerFromHdkey(out.value.value, net, accountFp);
      }
    }
    throw new Error('Kein Multisig-Schlüssel (Native SegWit) im Export. Am Gerät "Multisig" wählen.');
  }
  throw new Error(`QR-Typ "${type}" ist kein Schlüssel-Export`);
}

// Stellt sicher, dass kein Schlüssel doppelt vorkommt.
export function assertDistinct(cosigners) {
  const seen = new Set();                            // bereits gesehene xpubs und Fingerabdrücke
  for (const c of cosigners) {
    if (seen.has(c.xpub)) throw new Error(`Schlüssel ${c.fingerprint.toUpperCase()} ist doppelt`);
    // Gleicher Fingerabdruck = gleicher Seed. Zwei Schlüssel aus einem Seed bringen keine echte Mehrfach-Sicherheit.
    if (seen.has(c.fingerprint)) throw new Error(`Seed ${c.fingerprint.toUpperCase()} kommt zweimal vor. Jeder Schlüssel braucht einen eigenen Seed.`);
    seen.add(c.xpub);
    seen.add(c.fingerprint);
  }
}

export const fpHex = (n) => (n >>> 0).toString(16).padStart(8, '0'); // Zahl → 8 Hex-Zeichen
export { hex };
