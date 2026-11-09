// ur.js – "Uniform Resources" (BC-UR, Blockchain Commons BCR-2020-005/-006/-012).
// Damit werden grosse Datenmengen (z. B. eine PSBT) auf viele kleine QR-Codes verteilt,
// die nacheinander angezeigt werden ("animierter QR-Code"). SeedSigner und Jade nutzen dieses Format.
//
// Aufbau eines Teils:  UR:CRYPTO-PSBT/7-12/LPATAX…   (Typ / Teilnummer-Anzahl / Bytewords)
// - Bytewords: jedes Byte wird als 2 Buchstaben geschrieben (erster+letzter Buchstabe eines Wortes).
// - Fountain-Code: ab Teil n+1 werden zufällig gewählte Teile per XOR gemischt. Fehlt beim Scannen
//   ein Bild, kann es aus gemischten Teilen rekonstruiert werden. Der "Zufall" ist deterministisch,
//   damit Sender und Empfänger dieselben Mischungen berechnen.
import { sha256 } from '../lib/vendor.js';                 // SHA-256 für den Zufallsgenerator
import { cborDecode, cborUint, cborBytes, cborArray } from './cbor.js'; // CBOR-Hilfen

// Die 256 Bytewords hintereinander (je 4 Buchstaben). Index = Bytewert.
const BYTEWORDS =
  'ableacidalsoapexaquaarchatomauntawayaxisbackbaldbarnbeltbetabiasbluebodybragbrewbulbbuzzcalmcashcatschefcityclawcodecolacookcostcruxcurlcuspcyandarkdatadaysdelidicedietdoordowndrawdropdrumdulldutyeacheasyechoedgeepicevenexamexiteyesfactfairfernfigsfilmfishfizzflapflewfluxfoxyfreefrogfuelfundgalagamegeargemsgiftgirlglowgoodgraygrimgurugushgyrohalfhanghardhawkheathelphighhillholyhopehornhutsicedideaidleinchinkyintoirisironitemjadejazzjoinjoltjowljudojugsjumpjunkjurykeepkenokeptkeyskickkilnkingkitekiwiknoblamblavalazyleaflegsliarlimplionlistlogoloudloveluaulucklungmainmanymathmazememomenumeowmildmintmissmonknailnavyneednewsnextnoonnotenumbobeyoboeomitonyxopenovalowlspaidpartpeckplaypluspoempoolposepuffpumapurrquadquizraceramprealredorichroadrockroofrubyruinrunsrustsafesagascarsetssilkskewslotsoapsolosongstubsurfswantacotasktaxitenttiedtimetinytoiltombtoystriptunatwinuglyundouniturgeuservastveryvetovialvibeviewvisavoidvowswallwandwarmwaspwavewaxywebswhatwhenwhizwolfworkyankyawnyellyogayurtzapszerozestzinczonezoom';

// Kurzform-Tabellen: Byte → 2 Buchstaben und 2 Buchstaben → Byte.
const MINIMAL = [];                                         // Index 0–255 → "ae", "ad", …
const MINIMAL_REVERSE = new Map();                          // "ae" → 0, …
for (let i = 0; i < 256; i++) {
  const word = BYTEWORDS.slice(i * 4, i * 4 + 4);           // 4-Buchstaben-Wort holen
  const short = word[0] + word[3];                          // erster + letzter Buchstabe
  MINIMAL.push(short);                                      // Hin-Richtung speichern
  MINIMAL_REVERSE.set(short, i);                            // Rück-Richtung speichern
}

// CRC32 (IEEE 802.3), Prüfsumme gegen Lesefehler. Tabelle einmal vorberechnen.
const CRC_TABLE = new Uint32Array(256);                     // 256 vorberechnete Werte
for (let n = 0; n < 256; n++) {
  let c = n;                                                // Startwert = Bytewert
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; // Polynom bitweise anwenden
  CRC_TABLE[n] = c >>> 0;                                   // als vorzeichenlose 32-Bit-Zahl ablegen
}
export function crc32(bytes) {
  let crc = 0xffffffff;                                     // Startwert laut Standard
  for (const b of bytes) crc = CRC_TABLE[(crc ^ b) & 0xff] ^ (crc >>> 8); // Byte für Byte einrechnen
  return (crc ^ 0xffffffff) >>> 0;                          // Endwert invertieren, vorzeichenlos zurückgeben
}

// 32-Bit-Zahl als 4 Bytes Big-Endian.
function uint32BE(n) {
  return Uint8Array.of((n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff);
}

// Bytes → Bytewords (Kurzform) inkl. angehängter CRC32-Prüfsumme.
export function bytewordsEncode(data) {
  const withCrc = new Uint8Array(data.length + 4);           // Platz für Daten + 4 Prüfsummen-Bytes
  withCrc.set(data);                                         // Daten kopieren
  withCrc.set(uint32BE(crc32(data)), data.length);           // Prüfsumme anhängen
  let out = '';                                              // Ergebnis-Text
  for (const b of withCrc) out += MINIMAL[b];                // jedes Byte als 2 Buchstaben
  return out;
}

// Bytewords (Kurzform) → Bytes; prüft die CRC32-Prüfsumme.
export function bytewordsDecode(text) {
  const s = text.toLowerCase();                              // QR-Codes nutzen Grossbuchstaben
  if (s.length % 2 !== 0 || s.length < 10) throw new Error('UR: Ungültige Länge'); // mind. 1 Byte + 4 Prüfbytes
  const bytes = new Uint8Array(s.length / 2);                // jedes Buchstabenpaar = 1 Byte
  for (let i = 0; i < bytes.length; i++) {
    const v = MINIMAL_REVERSE.get(s.slice(i * 2, i * 2 + 2)); // Paar nachschlagen
    if (v === undefined) throw new Error('UR: Ungültiges Byteword'); // unbekanntes Paar = Lesefehler
    bytes[i] = v;                                            // Byte speichern
  }
  const body = bytes.subarray(0, bytes.length - 4);          // eigentliche Daten
  const expected = bytes.subarray(bytes.length - 4);         // mitgelieferte Prüfsumme
  const actual = uint32BE(crc32(body));                      // selbst berechnete Prüfsumme
  for (let i = 0; i < 4; i++) if (actual[i] !== expected[i]) throw new Error('UR: Prüfsumme falsch'); // vergleichen
  return body.slice();                                       // Kopie der Daten zurückgeben
}

// --- Deterministischer Zufallsgenerator Xoshiro256** (wie in der Referenz-Implementierung) ---
const MASK64 = (1n << 64n) - 1n;                             // 64-Bit-Maske
const rotl = (x, k) => ((x << k) | (x >> (64n - k))) & MASK64; // 64-Bit-Linksrotation

class Xoshiro256 {
  constructor(seedBytes) {
    const digest = sha256(seedBytes);                        // Startwert = SHA-256 der Eingabe
    this.s = [0n, 0n, 0n, 0n];                               // 4 × 64 Bit Zustand
    for (let i = 0; i < 4; i++) {
      let v = 0n;                                            // 8 Bytes Big-Endian zu einer Zahl
      for (let j = 0; j < 8; j++) v = (v << 8n) | BigInt(digest[i * 8 + j]);
      this.s[i] = v;                                         // Zustandswort speichern
    }
  }
  next() {                                                   // nächste 64-Bit-Zufallszahl
    const s = this.s;
    const result = (rotl((s[1] * 5n) & MASK64, 7n) * 9n) & MASK64; // "Scrambler" ** des Verfahrens
    const t = (s[1] << 17n) & MASK64;
    s[2] ^= s[0]; s[3] ^= s[1]; s[1] ^= s[2]; s[0] ^= s[3]; // Zustand mischen
    s[2] ^= t;
    s[3] = rotl(s[3], 45n);
    return result;
  }
  nextDouble() { return Number(this.next()) / 2 ** 64; }     // Zahl im Bereich [0, 1)
  nextInt(low, high) { return Math.floor(this.nextDouble() * (high - low + 1) + low); } // ganze Zahl in [low, high]
}

// Zufallsauswahl nach Gewichten (Alias-Methode nach Vose), exakt wie in der Referenz.
class RandomSampler {
  constructor(probs) {
    const n = probs.length;                                  // Anzahl Möglichkeiten
    const total = probs.reduce((a, b) => a + b, 0);          // Summe der Gewichte
    const P = probs.map((p) => (p * n) / total);             // normieren, Mittelwert 1
    const S = [];                                            // Indizes mit Gewicht < 1
    const L = [];                                            // Indizes mit Gewicht ≥ 1
    for (let i = n - 1; i >= 0; i--) (P[i] < 1 ? S : L).push(i); // rückwärts einsortieren (wie Referenz)
    this.probs = new Array(n).fill(0);                       // Schwellenwerte
    this.aliases = new Array(n).fill(0);                     // Ersatz-Indizes
    while (S.length && L.length) {
      const a = S.pop();                                     // kleines Gewicht
      const g = L.pop();                                     // grosses Gewicht
      this.probs[a] = P[a];                                  // Schwelle für a
      this.aliases[a] = g;                                   // sonst g wählen
      P[g] += P[a] - 1;                                      // Restgewicht von g anpassen
      (P[g] < 1 ? S : L).push(g);                            // g neu einsortieren
    }
    while (L.length) this.probs[L.pop()] = 1;                // Rest sicher wählen
    while (S.length) this.probs[S.pop()] = 1;                // nur bei Rundungsfehlern nötig
  }
  next(rng) {
    const r1 = rng.nextDouble();                             // wählt das Fach
    const r2 = rng.nextDouble();                             // entscheidet Fach oder Alias
    const i = Math.floor(this.probs.length * r1);
    return r2 < this.probs[i] ? i : this.aliases[i];
  }
}

// Welche Original-Fragmente stecken in Teil Nummer seqNum? (Referenz: choose_fragments)
export function chooseFragments(seqNum, seqLen, checksum) {
  if (seqNum <= seqLen) return [seqNum - 1];                 // die ersten seqLen Teile sind "rein"
  const seed = new Uint8Array(8);                            // Startwert: seqNum ‖ checksum
  seed.set(uint32BE(seqNum), 0);
  seed.set(uint32BE(checksum), 4);
  const rng = new Xoshiro256(seed);                          // Generator mit diesem Startwert
  const probs = [];                                          // Gewicht 1/i für "Grad" i
  for (let i = 1; i <= seqLen; i++) probs.push(1 / i);
  const degree = new RandomSampler(probs).next(rng) + 1;     // wie viele Fragmente gemischt werden
  const remaining = [];                                      // alle Fragment-Indizes
  for (let i = 0; i < seqLen; i++) remaining.push(i);
  const shuffled = [];                                       // gemischte Reihenfolge (Fisher-Yates-Variante)
  while (remaining.length) shuffled.push(remaining.splice(rng.nextInt(0, remaining.length - 1), 1)[0]);
  return shuffled.slice(0, degree);                          // die ersten "degree" Indizes
}

// Passende Fragmentlänge wählen (Referenz: find_nominal_fragment_length).
function nominalFragmentLength(messageLen, minLen, maxLen) {
  const maxCount = Math.max(1, Math.floor(messageLen / minLen)); // höchstens so viele Fragmente
  let len = messageLen;                                      // Rückfall: alles in einem Fragment
  for (let count = 1; count <= maxCount; count++) {
    len = Math.ceil(messageLen / count);                     // Länge bei "count" Fragmenten
    if (len <= maxLen) break;                                // erste passende Aufteilung nehmen
  }
  return len;
}

function xorInto(target, source) {                           // target ^= source (gleiche Länge)
  for (let i = 0; i < target.length; i++) target[i] ^= source[i];
}
function isSubset(a, b) {                                    // steckt jedes Element von a auch in b?
  for (const x of a) if (!b.has(x)) return false;
  return true;
}
function keyOf(set) {                                        // Menge → eindeutiger Text, z. B. "1,4,7"
  return [...set].sort((x, y) => x - y).join(',');
}

// Erzeugt die (endlose) Folge von QR-Texten für einen UR.
export class UREncoder {
  constructor(type, cbor, maxFragmentLen = 120, minFragmentLen = 10) {
    if (!/^[a-z0-9-]+$/.test(type)) throw new Error('UR: Ungültiger Typ'); // Typname laut Standard
    this.type = type;                                        // z. B. "crypto-psbt"
    this.message = cbor;                                     // CBOR-kodierte Nutzdaten
    this.checksum = crc32(cbor);                             // Prüfsumme der ganzen Nachricht
    this.fragmentLen = nominalFragmentLength(cbor.length, minFragmentLen, maxFragmentLen);
    this.seqLen = Math.ceil(cbor.length / this.fragmentLen); // Anzahl reiner Fragmente
    this.fragments = [];                                     // Nachricht in gleich grosse Stücke teilen
    for (let i = 0; i < this.seqLen; i++) {
      const frag = new Uint8Array(this.fragmentLen);         // mit Nullen aufgefüllt
      frag.set(cbor.subarray(i * this.fragmentLen, (i + 1) * this.fragmentLen)); // Stück kopieren
      this.fragments.push(frag);
    }
    this.seqNum = 0;                                         // Zähler der ausgegebenen Teile
  }
  get isSinglePart() { return this.seqLen === 1; }           // passt alles in einen QR-Code?
  nextPart() {
    if (this.isSinglePart) {                                 // Einzelteil: ohne Nummerierung
      return `ur:${this.type}/${bytewordsEncode(this.message)}`.toUpperCase();
    }
    this.seqNum += 1;                                        // nächste Teilnummer (beginnt bei 1)
    const idx = chooseFragments(this.seqNum, this.seqLen, this.checksum); // welche Fragmente?
    const mixed = new Uint8Array(this.fragmentLen);          // XOR-Summe der Fragmente
    for (const i of idx) xorInto(mixed, this.fragments[i]);
    const part = cborArray([                                 // Teil als CBOR-Liste kodieren
      cborUint(this.seqNum), cborUint(this.seqLen), cborUint(this.message.length),
      cborUint(this.checksum), cborBytes(mixed),
    ]);
    // Grossbuchstaben: QR-Codes speichern sie im kompakten "alphanumerischen" Modus.
    return `ur:${this.type}/${this.seqNum}-${this.seqLen}/${bytewordsEncode(part)}`.toUpperCase();
  }
}

// Setzt gescannte Teile wieder zusammen.
export class URDecoder {
  constructor() {
    this.type = null;                                        // erwarteter Typ (vom ersten Teil)
    this.params = null;                                      // seqLen, messageLen, checksum, fragmentLen
    this.simple = new Map();                                 // Index → bekanntes reines Fragment
    this.mixed = [];                                         // noch nicht auflösbare Mischungen
    this.seen = new Set();                                   // bereits verarbeitete Teilnummern
    this.result = null;                                      // fertige Nachricht (CBOR-Bytes)
  }

  // Gibt true zurück, wenn der Text als UR erkannt und verarbeitet wurde.
  receive(text) {
    if (this.result) return true;                            // schon fertig
    const m = /^ur:([a-z0-9-]+)\/(?:(\d+)-(\d+)\/)?([a-z]+)$/i.exec(text.trim()); // Aufbau prüfen
    if (!m) return false;                                    // kein UR-Text
    const type = m[1].toLowerCase();                         // Typ normalisieren
    if (this.type && this.type !== type) throw new Error('UR: Anderer Datentyp als zuvor'); // keine Vermischung
    this.type = type;
    const body = bytewordsDecode(m[4]);                      // Bytewords → Bytes (prüft CRC)
    if (m[2] === undefined) {                                // Einzelteil
      this.result = body;                                    // ist bereits die ganze Nachricht
      return true;
    }
    const part = cborDecode(body);                           // Teil-Liste dekodieren
    if (!Array.isArray(part) || part.length !== 5) throw new Error('UR: Ungültiger Teil');
    const [seqNum, seqLen, messageLen, checksum, data] = part; // Felder auspacken
    const ints = [seqNum, seqLen, messageLen, checksum];
    if (!ints.every((x) => Number.isSafeInteger(x) && x >= 0) || !(data instanceof Uint8Array)) {
      throw new Error('UR: Ungültige Teil-Felder');
    }
    if (seqNum < 1 || seqLen < 1 || seqLen > 10000 || messageLen < 1 || messageLen > 2_000_000 || checksum > 0xffffffff) {
      throw new Error('UR: Werte ausserhalb des erlaubten Bereichs'); // Schutz vor absurden Grössen
    }
    if (String(seqNum) !== m[2] || String(seqLen) !== m[3]) throw new Error('UR: Nummerierung widersprüchlich');
    if (data.length * seqLen < messageLen || data.length * (seqLen - 1) >= messageLen) {
      throw new Error('UR: Fragmentlänge passt nicht');      // Aufteilung muss zur Nachricht passen
    }
    const params = { seqLen, messageLen, checksum, fragmentLen: data.length };
    if (!this.params) this.params = params;                  // erste Parameter merken
    else if (JSON.stringify(this.params) !== JSON.stringify(params)) {
      throw new Error('UR: Teil gehört zu einer anderen Nachricht'); // anderer QR-Code mitgescannt
    }
    if (this.seen.has(seqNum)) return true;                  // Duplikat (Animation läuft im Kreis)
    this.seen.add(seqNum);
    const indexes = chooseFragments(seqNum, seqLen, checksum); // gleiche Rechnung wie beim Sender
    this.addPart(new Set(indexes), data.slice());            // einarbeiten
    return true;
  }

  // Arbeitet einen (evtl. gemischten) Teil ein und löst Mischungen soweit möglich auf.
  addPart(indexes, data) {
    const queue = [{ indexes, data }];                       // Warteschlange zu verarbeitender Teile
    while (queue.length && !this.result) {
      const p = queue.shift();                               // nächsten Teil nehmen
      for (const [i, frag] of this.simple) {                 // bekannte Fragmente herausrechnen
        if (p.indexes.has(i) && p.indexes.size > 1) { p.indexes.delete(i); xorInto(p.data, frag); }
      }
      if (p.indexes.size === 1) {                            // reines Fragment gefunden
        const [i] = p.indexes;
        if (this.simple.has(i)) continue;                    // schon bekannt
        this.simple.set(i, p.data);                          // speichern
        const still = [];                                    // Mischungen mit neuem Wissen erneut prüfen
        for (const mx of this.mixed) {
          if (mx.indexes.has(i)) queue.push(mx); else still.push(mx);
        }
        this.mixed = still;
        this.tryFinish();                                    // vielleicht ist jetzt alles da
      } else if (p.indexes.size > 1) {
        for (const mx of this.mixed) {                       // kleinere Mischungen, die ganz in p stecken, herausrechnen
          if (mx.indexes.size < p.indexes.size && isSubset(mx.indexes, p.indexes)) {
            for (const i of mx.indexes) p.indexes.delete(i); // diese Fragmente sind dann nicht mehr in p
            xorInto(p.data, mx.data);                        // XOR hebt sie auf
          }
        }
        if (p.indexes.size === 1) { queue.push(p); continue; } // jetzt rein → nochmals als reines Fragment verarbeiten
        if (p.indexes.size === 0) continue;                  // enthielt nichts Neues
        const key = keyOf(p.indexes);                        // Mischung eindeutig kennzeichnen
        if (this.mixed.some((mx) => keyOf(mx.indexes) === key)) continue; // gleiche Mischung schon vorhanden
        const still = [];                                    // grössere Mischungen mit p vereinfachen
        for (const mx of this.mixed) {
          if (p.indexes.size < mx.indexes.size && isSubset(p.indexes, mx.indexes)) {
            for (const i of p.indexes) mx.indexes.delete(i);
            xorInto(mx.data, p.data);
            if (mx.indexes.size === 1) { queue.push(mx); continue; } // wurde rein → in die Warteschlange
          }
          still.push(mx);
        }
        still.push(p);                                       // p selbst merken
        this.mixed = still;
      }
    }
  }

  tryFinish() {
    const { seqLen, messageLen, checksum, fragmentLen } = this.params;
    if (this.simple.size !== seqLen) return;                 // noch nicht alle Fragmente
    const out = new Uint8Array(seqLen * fragmentLen);        // Fragmente aneinanderreihen
    for (let i = 0; i < seqLen; i++) out.set(this.simple.get(i), i * fragmentLen);
    const message = out.slice(0, messageLen);                // Auffüll-Nullen entfernen
    if (crc32(message) !== checksum) throw new Error('UR: Prüfsumme der Nachricht falsch'); // Endkontrolle
    this.result = message;                                   // fertig
  }

  get progress() {                                           // Fortschritt 0…1 für die Anzeige
    if (this.result) return 1;
    if (!this.params) return 0;
    return this.simple.size / this.params.seqLen;
  }
}

// Bequeme Funktionen für die zwei Nutzlast-Typen, die die Wallet selbst erzeugt.
export function encodePsbtUR(psbtBytes, maxFragmentLen) {
  return new UREncoder('crypto-psbt', cborBytes(psbtBytes), maxFragmentLen); // PSBT als CBOR-Byte-Folge
}
export function encodeBytesUR(bytes, maxFragmentLen) {
  return new UREncoder('bytes', cborBytes(bytes), maxFragmentLen);         // beliebige Bytes (z. B. Textdatei)
}
