// cbor.js – minimaler CBOR-Kodierer/-Dekodierer (RFC 8949).
// CBOR ist ein kompaktes Binärformat. Animierte QR-Codes nach dem UR-Standard (BC-UR)
// verpacken ihre Daten darin. Hier ist nur umgesetzt, was die Wallet braucht.
// Fremde Daten aus der Kamera gelten als nicht vertrauenswürdig: Jede Länge wird geprüft.

const MAX_DEPTH = 16;                                  // Maximale Verschachtelungstiefe (Schutz vor Endlos-Rekursion).
const utf8 = new TextDecoder('utf-8', { fatal: true }); // Ungültiges UTF-8 löst einen Fehler aus statt still zu raten.

// Markiert einen CBOR-"Tag" (Typ-Kennzeichnung, z. B. 303 = HD-Schlüssel).
export class Tagged {
  constructor(tag, value) {        // tag: Zahl, value: der markierte Inhalt
    this.tag = tag;                // Tag-Nummer speichern
    this.value = value;            // markierten Wert speichern
  }
}

// Dekodiert ein komplettes CBOR-Objekt aus einem Uint8Array.
export function cborDecode(bytes) {
  if (!(bytes instanceof Uint8Array)) throw new Error('CBOR: Bytes erwartet'); // Typ prüfen
  const state = { pos: 0 };                           // Lese-Position im Puffer
  const value = readItem(bytes, state, 0);            // erstes (und einziges) Element lesen
  if (state.pos !== bytes.length) throw new Error('CBOR: Überzählige Bytes'); // Rest = Manipulation oder Fehler
  return value;                                       // fertiges JavaScript-Objekt zurückgeben
}

// Liest die Längen-/Wert-Angabe nach dem ersten Byte (CBOR "additional information").
function readArgument(bytes, state, info) {
  if (info < 24) return info;                          // Werte 0–23 stecken direkt im ersten Byte
  const sizes = { 24: 1, 25: 2, 26: 4, 27: 8 };        // 24–27: Wert folgt in 1, 2, 4 oder 8 Bytes
  const size = sizes[info];                            // passende Grösse nachschlagen
  if (!size) throw new Error('CBOR: Nicht unterstützte Länge'); // 28–31 (u. a. "unbestimmte Länge") ablehnen
  if (state.pos + size > bytes.length) throw new Error('CBOR: Daten zu kurz'); // nicht über das Ende lesen
  let value = 0n;                                       // BigInt, damit auch 8-Byte-Werte exakt bleiben
  for (let i = 0; i < size; i++) value = (value << 8n) | BigInt(bytes[state.pos + i]); // Big-Endian zusammensetzen
  state.pos += size;                                    // Lese-Position weiterschieben
  return value <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(value) : value; // kleine Werte als normale Zahl
}

// Liest ein einzelnes CBOR-Element (rekursiv für Listen, Maps und Tags).
function readItem(bytes, state, depth) {
  if (depth > MAX_DEPTH) throw new Error('CBOR: Zu tief verschachtelt'); // Schutz vor Stapelüberlauf
  if (state.pos >= bytes.length) throw new Error('CBOR: Unerwartetes Ende'); // nichts mehr zu lesen
  const initial = bytes[state.pos++];                    // erstes Byte lesen
  const major = initial >> 5;                            // obere 3 Bits = Haupttyp (0–7)
  const info = initial & 0x1f;                           // untere 5 Bits = Zusatzinformation
  const arg = readArgument(bytes, state, info);          // Wert bzw. Länge dekodieren
  const length = typeof arg === 'bigint' ? Infinity : arg; // riesige Längen gelten als ungültig
  switch (major) {
    case 0: return arg;                                  // positive Ganzzahl
    case 1: return typeof arg === 'bigint' ? -1n - arg : -1 - arg; // negative Ganzzahl (−1 − n)
    case 2: {                                            // Byte-Folge
      if (state.pos + length > bytes.length) throw new Error('CBOR: Byte-Folge zu lang');
      const out = bytes.slice(state.pos, state.pos + length); // Kopie herausschneiden
      state.pos += length;                               // weiterlesen nach der Byte-Folge
      return out;
    }
    case 3: {                                            // Text (UTF-8)
      if (state.pos + length > bytes.length) throw new Error('CBOR: Text zu lang');
      const text = utf8.decode(bytes.subarray(state.pos, state.pos + length)); // streng dekodieren
      state.pos += length;
      return text;
    }
    case 4: {                                            // Liste (Array)
      if (length > bytes.length - state.pos) throw new Error('CBOR: Liste zu lang'); // jedes Element braucht ≥1 Byte
      const list = [];                                   // Ergebnisliste
      for (let i = 0; i < length; i++) list.push(readItem(bytes, state, depth + 1)); // Elemente rekursiv lesen
      return list;
    }
    case 5: {                                            // Map (Schlüssel → Wert)
      if (length * 2 > bytes.length - state.pos) throw new Error('CBOR: Map zu lang');
      const map = new Map();                             // Map erlaubt auch Zahlen als Schlüssel
      for (let i = 0; i < length; i++) {
        const key = readItem(bytes, state, depth + 1);   // Schlüssel lesen
        if (map.has(key)) throw new Error('CBOR: Doppelter Schlüssel'); // Mehrdeutigkeit verbieten
        map.set(key, readItem(bytes, state, depth + 1)); // Wert lesen und speichern
      }
      return map;
    }
    case 6: return new Tagged(arg, readItem(bytes, state, depth + 1)); // Tag + markierter Inhalt
    case 7:                                              // Sonderwerte
      if (info === 20) return false;                     // false
      if (info === 21) return true;                      // true
      if (info === 22) return null;                      // null
      throw new Error('CBOR: Nicht unterstützter Sonderwert'); // Fliesskommazahlen u. a. werden nicht gebraucht
    default: throw new Error('CBOR: Unbekannter Typ');    // kann nicht vorkommen (3 Bits), aber sicher ist sicher
  }
}

// Schreibt Haupttyp + Zahl im kürzesten Format (wie es der UR-Standard verlangt).
function header(major, n) {
  const value = BigInt(n);                               // einheitlich mit BigInt rechnen
  if (value < 0n) throw new Error('CBOR: Negative Länge');
  if (value < 24n) return [(major << 5) | Number(value)]; // passt direkt ins erste Byte
  const sizes = [[0xffn, 24, 1], [0xffffn, 25, 2], [0xffffffffn, 26, 4], [0xffffffffffffffffn, 27, 8]];
  for (const [max, info, size] of sizes) {               // kleinste passende Grösse suchen
    if (value <= max) {
      const out = [(major << 5) | info];                 // erstes Byte mit Grössenkennung
      for (let i = size - 1; i >= 0; i--) out.push(Number((value >> BigInt(8 * i)) & 0xffn)); // Big-Endian
      return out;
    }
  }
  throw new Error('CBOR: Zahl zu gross');
}

// Kodiert eine positive Ganzzahl.
export function cborUint(n) {
  return Uint8Array.from(header(0, n));                  // Haupttyp 0
}

// Kodiert eine Byte-Folge.
export function cborBytes(data) {
  return concat([Uint8Array.from(header(2, data.length)), data]); // Haupttyp 2 + Länge + Inhalt
}

// Kodiert eine Liste aus bereits kodierten Elementen.
export function cborArray(encodedItems) {
  return concat([Uint8Array.from(header(4, encodedItems.length)), ...encodedItems]); // Haupttyp 4
}

// Hängt mehrere Uint8Arrays aneinander.
export function concat(parts) {
  const total = parts.reduce((sum, p) => sum + p.length, 0); // Gesamtlänge berechnen
  const out = new Uint8Array(total);                     // Zielpuffer anlegen
  let offset = 0;                                        // Schreibposition
  for (const p of parts) { out.set(p, offset); offset += p.length; } // nacheinander kopieren
  return out;
}
