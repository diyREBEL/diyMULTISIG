// Ende-zu-Ende-Test: eigene Wallet-Logik gegen echte SeedSigner-Software (Python) und embit,
// Prüfung der fertigen Transaktion mit unabhängigem Skript-Interpreter (python-bitcointx).
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { NETWORKS } from '../app/js/config.js';
import { parseKeyText, parseKeyUR } from '../app/js/keys.js';
import { buildDescriptor, parseDescriptor, buildSetupFile, descriptorChecksum } from '../app/js/descriptor.js';
import { MultisigWallet } from '../app/js/wallet.js';
import { createPsbt, analyzePsbt, mergeSignedPsbt, finalizePsbt, estimateVsize } from '../app/js/tx.js';
import { URDecoder, encodePsbtUR, encodeBytesUR } from '../app/js/ur.js';
import { cborDecode } from '../app/js/cbor.js';
import { RawTx, Address, Transaction, hex, sha256 } from '../app/lib/vendor.js';

const require = createRequire(import.meta.url);
const kr = require('../vendor-src/node_modules/@keystonehq/bc-ur-registry');
const py = (obj) => JSON.parse(execFileSync('python3', ['tests/interop.py'], { input: JSON.stringify(obj) }).toString());

const MNEMONICS = [
  'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
  'legal winner thank year wave sausage worth useful legal winner thank yellow',
  'letter advice cage absurd amount doctor acoustic avoid letter advice cage above',
];

function decodeAll(parts) {                                   // UR-Teile zusammensetzen
  const d = new URDecoder();
  for (const p of parts) { d.receive(p); if (d.result) break; }
  assert.ok(d.result, 'UR unvollständig');
  return d;
}
function urParts(enc, rounds = 2) {                           // genug Teile eines Encoders sammeln
  const out = [];
  const n = enc.isSinglePart ? 1 : enc.seqLen * rounds;
  for (let i = 0; i < n; i++) out.push(enc.nextPart());
  return out;
}
function fakePrevTx(outputs) {                                // erfundene Vorgänger-Transaktion
  const raw = RawTx.encode({
    version: 2, lockTime: 0, segwitFlag: false,
    inputs: [{ txid: sha256(Uint8Array.from(outputs.map((o) => Number(o.amount % 251n)))), index: 0, finalScriptSig: new Uint8Array(0), sequence: 0xffffffff }],
    outputs,
  });
  const txid = hex.encode(sha256(sha256(raw)).reverse());
  return { raw, txid };
}

for (const netId of ['main', 'testnet4']) {
  const net = NETWORKS[netId];
  const pyNet = netId === 'main' ? 'main' : 'test';
  console.log(`\n=== Netzwerk ${net.label} ===`);

  // 1) Schlüssel-Import: Text und UR crypto-account (SeedSigner-Format)
  const exported = py({ cmd: 'setup', network: pyNet, mnemonics: MNEMONICS });
  const cosigners = exported.map((k, i) => {
    const a = parseKeyText(k.text, net);
    const d = decodeAll(k.ur);
    const b = parseKeyUR(d.type, d.result, net);
    assert.equal(a.xpub, k.xpub); assert.equal(b.xpub, k.xpub);
    assert.equal(a.fingerprint, k.fingerprint); assert.equal(b.fingerprint, k.fingerprint);
    assert.equal(a.path, b.path);
    return { ...a, label: `Gerät ${i + 1}` };
  });
  console.log('Schlüssel-Import (Text + UR crypto-account) ok:', cosigners.map((c) => c.fingerprint).join(', '));

  // 1b) crypto-hdkey (Jade-Option) mit Keystone-Bibliothek erzeugt
  {
    const c = cosigners[1];
    const node = (await import('../app/lib/vendor.js')).HDKey.fromExtendedKey(c.xpub, { public: net.xpubVersion, private: 0 });
    const coin = net.coinType;
    const origin = new kr.CryptoKeypath([48, coin, 0, 2].map((index) => new kr.PathComponent({ index, hardened: true })), Buffer.from(c.fingerprint, 'hex'), 4);
    const hk = new kr.CryptoHDKey({ isMaster: false, key: Buffer.from(node.publicKey), chainCode: Buffer.from(node.chainCode), origin, parentFingerprint: Buffer.alloc(4, 0) });
    const r = parseKeyUR('crypto-hdkey', new Uint8Array(hk.toCBOR()), net);
    const rn = (await import('../app/lib/vendor.js')).HDKey.fromExtendedKey(r.xpub, { public: net.xpubVersion, private: 0 });
    assert.deepEqual(rn.publicKey, node.publicKey);          // gleiche Schlüsseldaten (Eltern-Fingerabdruck darf abweichen)
    assert.deepEqual(rn.chainCode, node.chainCode);
    assert.equal(r.fingerprint, c.fingerprint);
    console.log('crypto-hdkey (Keystone-Bibliothek) ok');
  }

  // 2) Descriptor und Adressen gegen embit
  const w = new MultisigWallet({ id: 't', name: 'Test-Wallet', network: netId, m: 2, cosigners, createdAt: 0 });
  const desc = buildDescriptor(w.config);
  const emb = py({ cmd: 'addresses', network: pyNet, descriptor: desc, count: 6 });
  for (let i = 0; i < 6; i++) {
    assert.equal(w.derive(0, i).address, emb.receive[i]);
    assert.equal(w.derive(1, i).address, emb.change[i]);
  }
  assert.equal(desc.split('#')[1], emb.checksum);             // Prüfsumme identisch mit embit
  const back = parseDescriptor(desc, net);
  assert.equal(back.m, 2); assert.deepEqual(back.cosigners.map((c) => c.xpub), cosigners.map((c) => c.xpub));
  console.log('Adressen identisch mit embit (je 6 Empfang/Wechselgeld), Descriptor:', desc.slice(0, 40) + '…');

  // 3) Setup-Datei als UR:BYTES → echter SeedSigner-Decoder
  const setupParts = urParts(encodeBytesUR(new TextEncoder().encode(buildSetupFile(w.config)), 100));
  const ss = py({ cmd: 'setupfile', network: pyNet, parts: setupParts });
  assert.equal(ss.receive0, w.derive(0, 0).address);
  assert.equal(ss.change0, w.derive(1, 0).address);
  console.log(`SeedSigner liest Wallet-QR (${setupParts.length} Teile, Typ ${ss.qr_type}) ok`);

  // 4) Erfundene Münzen und Schein-Server
  const other = Address(net.btc).encode({ type: 'wpkh', hash: new Uint8Array(20).fill(7) });
  const t1 = fakePrevTx([{ amount: 150000n, script: w.derive(0, 0).script }, { amount: 5000n, script: new Uint8Array([0x00, 0x14, ...new Uint8Array(20).fill(9)]) }]);
  const t2 = fakePrevTx([{ amount: 80000n, script: w.derive(0, 1).script }, { amount: 30000n, script: w.derive(1, 0).script }]);
  const txs = new Map([[t1.txid, t1.raw], [t2.txid, t2.raw]]);
  let lie = null;                                              // für Manipulationstests
  const api = { txBytes: async (id) => (lie ? lie(id) : txs.get(id)) };
  w.state = {
    utxos: [
      { txid: t1.txid, vout: 0, value: 150000n, confirmed: true, chain: 0, index: 0 },
      { txid: t2.txid, vout: 0, value: 80000n, confirmed: true, chain: 0, index: 1 },
      { txid: t2.txid, vout: 1, value: 30000n, confirmed: true, chain: 1, index: 0 },
    ],
    nextIndex: [2, 1],
  };

  // 5) PSBT bauen (200 000 Sats → braucht 2 Münzen)
  const psbt = await createPsbt({ wallet: w, api, recipient: other, amount: 200000n, feeRate: 5 });
  const info = analyzePsbt(w, psbt);
  assert.equal(info.sendTotal, 200000n);
  assert.equal(info.signedBy.length, 0);
  console.log(`PSBT: ${info.inputs} Eingänge, Gebühr ${info.fee} Sats (${info.feeRate.toFixed(2)} sat/vB), Wechselgeld ${info.changeTotal}`);

  // 6) Zwei Geräte signieren unabhängig (parallel) mit SeedSigner-Logik
  const psbtParts = urParts(encodePsbtUR(psbt, 100));
  const s1 = py({ cmd: 'sign', network: pyNet, parts: psbtParts, mnemonic: MNEMONICS[0], descriptor: desc });
  const s3 = py({ cmd: 'sign', network: pyNet, parts: psbtParts, mnemonic: MNEMONICS[2], descriptor: desc });
  assert.ok(s1.signed && s3.signed, 'SeedSigner hat nicht signiert');
  assert.equal(s1.spend, 200000); assert.equal(BigInt(s1.fee), info.fee);
  assert.equal(s1.num_change, info.changeTotal > 0n ? 1 : 0);
  assert.ok(s1.change_verified.every(Boolean), 'SeedSigner erkennt Wechselgeld nicht');
  console.log(`SeedSigner zeigt: Betrag ${s1.spend}, Gebühr ${s1.fee}, Wechselgeld ${s1.change} (geprüft: ${s1.change_verified})`);

  const signed1 = cborDecode(decodeAll(s1.parts).result);     // UR → CBOR → PSBT-Bytes
  const signed3 = cborDecode(decodeAll(s3.parts).result);
  const p2 = mergeSignedPsbt(w, psbt, signed1);
  const i2 = analyzePsbt(w, p2);
  assert.deepEqual(i2.signedBy, [cosigners[0].fingerprint]); assert.equal(i2.ready, false);
  assert.throws(() => mergeSignedPsbt(w, p2, signed1), /Keine neue Signatur/);
  const p3 = mergeSignedPsbt(w, p2, signed3);
  const i3 = analyzePsbt(w, p3);
  assert.equal(i3.ready, true);
  const fin = finalizePsbt(w, p3);

  // 7) Unabhängige Skript-Prüfung der fertigen Transaktion
  const tx = Transaction.fromPSBT(p3);
  const prevouts = [];
  for (let i = 0; i < tx.inputsLength; i++) {
    const inp = tx.getInput(i);
    prevouts.push({ script: hex.encode(inp.witnessUtxo.script), amount: Number(inp.witnessUtxo.amount) });
  }
  const v = py({ cmd: 'verify', tx: fin.hex, prevouts });
  assert.equal(v.txid, fin.txid);
  assert.ok(v.vsize <= info.vsize, `Schätzung zu klein: echt ${v.vsize} > geschätzt ${info.vsize}`);
  console.log(`Fertige Tx gültig laut python-bitcointx. txid ${fin.txid.slice(0, 16)}…, vsize echt ${v.vsize} / geschätzt ${info.vsize}`);

  // 8) Manipulationen müssen scheitern
  const otherPsbt = await createPsbt({ wallet: w, api, recipient: other, amount: 210000n, feeRate: 5 });
  assert.throws(() => mergeSignedPsbt(w, otherPsbt, signed1), /anderen Transaktion/);
  const [, sig] = Transaction.fromPSBT(signed1).getInput(0).partialSig[0];
  const hexPsbt = hex.encode(signed1);                        // Signatur in den Rohdaten suchen …
  const pos = hexPsbt.indexOf(hex.encode(sig)) / 2;
  assert.ok(pos > 0);
  const tampered = signed1.slice(); tampered[pos + 40] ^= 1;   // … und ein Bit im s-Wert kippen
  assert.throws(() => mergeSignedPsbt(w, psbt, tampered), /Ungültige Signatur/);
  lie = (id) => { const r = txs.get(id).slice(); r[r.length - 20] ^= 1; return r; };
  await assert.rejects(createPsbt({ wallet: w, api, recipient: other, amount: 100000n, feeRate: 5 }), /falsche Vorgänger/);
  lie = () => txs.get(t1.txid);
  await assert.rejects(createPsbt({ wallet: w, api, recipient: other, amount: 200000n, feeRate: 5 }), /falsche Vorgänger/);
  lie = null;
  await assert.rejects(createPsbt({ wallet: w, api, recipient: other, amount: 1000000n, feeRate: 5 }), /reicht nicht/);
  await assert.rejects(createPsbt({ wallet: w, api, recipient: other, amount: 100000n, feeRate: 5000 }), /Gebühr/);
  await assert.rejects(createPsbt({ wallet: w, api, recipient: netId === 'main' ? 'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx' : 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4', amount: 100000n, feeRate: 5 }), /Ungültige Adresse/);
  console.log('Manipulations- und Fehlertests ok');

  // 9) Alles senden (ohne Wechselgeld)
  const sweep = analyzePsbt(w, await createPsbt({ wallet: w, api, recipient: other, amount: null, feeRate: 2 }));
  assert.equal(sweep.changeTotal, 0n); assert.equal(sweep.sendTotal + sweep.fee, 260000n);
  console.log('Alles senden ok: Betrag', sweep.sendTotal, 'Gebühr', sweep.fee);
}

// 10) Schlüssel-Prüfungen
{
  const net = NETWORKS.main;
  const k = py({ cmd: 'setup', network: 'main', mnemonics: [MNEMONICS[0]] })[0];
  assert.throws(() => parseKeyText(k.text, NETWORKS.testnet4), /Netzwerk/);
  assert.throws(() => parseKeyText(k.xpub, net), /Fingerabdruck und Pfad fehlen/);
  assert.throws(() => parseKeyText(k.text.replace('48h/0h/0h/2h', '84h/0h/0h'), net), /Pfad|Tiefe/);
  assert.throws(() => parseKeyText('[73c5da0a/48h/0h/0h/2h]xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi', net), /PRIVATER|beschädigt|Schlüssel/);
  const bad = buildDescriptor({ m: 1, cosigners: [{ fingerprint: k.fingerprint, path: "m/48'/0'/0'/2'", xpub: k.xpub }, { fingerprint: k.fingerprint, path: "m/48'/0'/0'/2'", xpub: k.xpub }] });
  assert.throws(() => parseDescriptor(bad, net), /doppelt|zweimal/);
  assert.throws(() => parseDescriptor(bad.slice(0, -1) + (bad.endsWith('q') ? 'p' : 'q'), net), /Prüfsumme/);
  // BIP380-Testvektor (Descriptor-Prüfsumme)
  assert.equal(descriptorChecksum("raw(deadbeef)"), '89f8spxm');
  console.log('\nSchlüssel- und Descriptor-Prüfungen ok');
}
console.log('\nALLE INTEROP-TESTS BESTANDEN');
