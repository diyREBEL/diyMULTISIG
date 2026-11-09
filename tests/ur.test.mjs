// Prüft die eigene UR-Implementierung gegen die Referenz-Bibliothek @ngraveio/bc-ur.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { UREncoder, URDecoder, bytewordsEncode, bytewordsDecode, crc32 } from '../app/js/ur.js';
import { cborBytes, cborDecode } from '../app/js/cbor.js';
const require = createRequire(import.meta.url);
const bcur = require('../vendor-src/node_modules/@ngraveio/bc-ur');
const { Buffer } = require('node:buffer');

// 1) CRC32-Testvektor aus BCR-2020-005: "Hello, world!" -> 0xebe6c6e6
assert.equal(crc32(new TextEncoder().encode('Hello, world!')), 0xebe6c6e6);

// 2) Encoder-Vergleich mit Referenz für viele Grössen
let checked = 0;
for (const len of [5, 50, 99, 100, 101, 250, 777, 1500, 4000]) {
  const msg = new Uint8Array(len).map((_, i) => (i * 31 + len) & 0xff);
  const cbor = cborBytes(msg);
  const mine = new UREncoder('crypto-psbt', cbor, 120);
  const ref = new bcur.UREncoder(new bcur.UR(Buffer.from(cbor), 'crypto-psbt'), 120, 0, 10);
  for (let i = 0; i < Math.max(3, mine.seqLen * 3); i++) {
    assert.equal(mine.nextPart(), ref.nextPart().toUpperCase(), `len=${len} part=${i}`);
    checked++;
  }
}
console.log('Encoder-Teile identisch mit Referenz:', checked);

// 3) Decoder: Referenz-Teile, nur gemischte + zufällig ausgelassene Teile
for (const len of [300, 1200, 5000]) {
  const msg = new Uint8Array(len).map((_, i) => (i * 7 + 3) & 0xff);
  const ref = new bcur.UREncoder(new bcur.UR(Buffer.from(cborBytes(msg)), 'crypto-psbt'), 100, 0, 10);
  const dec = new URDecoder();
  let n = 0;
  while (!dec.result && n < 2000) {
    const part = ref.nextPart();
    n++;
    if (n % 3 === 0 || n <= ref.fragmentsLength / 2) continue; // viele Teile auslassen
    dec.receive(part);
  }
  assert.ok(dec.result, 'nicht fertig');
  assert.deepEqual(cborDecode(dec.result), msg);
  console.log(`Decoder ok: ${len} Bytes nach ${n} Teilen (seqLen ${ref.fragmentsLength})`);
}

// 4) Eigener Encoder -> Referenz-Decoder
{
  const msg = new Uint8Array(3000).map((_, i) => (i ^ 0x5a) & 0xff);
  const enc = new UREncoder('crypto-psbt', cborBytes(msg), 150);
  const rd = new bcur.URDecoder();
  let n = 0;
  while (!rd.isComplete() && n < 1000) { const p = enc.nextPart(); n++; if (n % 2) continue; rd.receivePart(p); }
  assert.ok(rd.isSuccess());
  assert.deepEqual(new Uint8Array(rd.resultUR().decodeCBOR()), msg);
  console.log('Referenz-Decoder liest eigene Teile nach', n, 'Teilen');
}
// 5) Bytewords Rundlauf + Fehlererkennung
const data = Uint8Array.from([0, 1, 2, 128, 255]);
assert.deepEqual(bytewordsDecode(bytewordsEncode(data)), data);
assert.throws(() => bytewordsDecode(bytewordsEncode(data).replace(/^../, 'ad')));
console.log('UR-Tests bestanden');
