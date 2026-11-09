// tx.js – Transaktion bauen (PSBT), Signaturen prüfen und zusammenführen, fertigstellen.
// Grundsatz: Alles, was von aussen kommt (Server, gescannte QR-Codes), wird nachgerechnet.
import { Transaction, Address, OutScript, RawTx, secp256k1, sha256, hex } from '../lib/vendor.js';
import { DUST_LIMIT, RBF_SEQUENCE, SIGHASH_ALL, MIN_FEE_RATE, MAX_FEE_RATE } from './config.js';
import { HARDENED } from './keys.js';

const PSBT_VERSION = 0;                                        // PSBT v0: von SeedSigner und Jade unterstützt
const CHANGE_SCRIPT_LEN = 34;                                  // P2WSH-Skript: 0x00 0x20 + 32 Bytes Hash

// Vergleicht zwei Byte-Folgen auf Gleichheit.
export function equalBytes(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

// Länge einer "CompactSize"-Zahl in Bytes (Bitcoin-Längenangabe).
const varintLen = (n) => (n < 0xfd ? 1 : n <= 0xffff ? 3 : 5);

// Schätzt die virtuelle Grösse (vB) einer Transaktion mit P2WSH-m-von-n-Eingängen.
// Gerechnet wird mit der grösstmöglichen Signatur (72 Bytes), damit die Gebühr nie zu tief ist.
export function estimateVsize(m, n, inputCount, outputScriptLengths) {
  const witnessScriptLen = 3 + 34 * n;                         // OP_m + n×(Länge+33 Bytes) + OP_n + OP_CHECKMULTISIG
  const inputBase = 32 + 4 + 1 + 4;                            // txid + vout + leeres scriptSig + sequence
  const inputWitness = varintLen(m + 2)                        // Anzahl Witness-Elemente
    + 1                                                        // leeres Dummy-Element (Fehler in OP_CHECKMULTISIG)
    + m * (1 + 72)                                             // m Signaturen mit Längenbyte
    + varintLen(witnessScriptLen) + witnessScriptLen;          // das Skript selbst
  const outputs = outputScriptLengths.reduce((s, len) => s + 8 + varintLen(len) + len, 0); // Betrag + Skript
  const base = 4 + varintLen(inputCount) + inputCount * inputBase
    + varintLen(outputScriptLengths.length) + outputs + 4;    // Version, Eingänge, Ausgänge, Locktime
  const witness = 2 + inputCount * inputWitness;               // Marker/Flag + Witness-Daten
  return Math.ceil((base * 4 + witness) / 4);                  // Gewicht / 4 = vB (aufgerundet)
}

// Gebühr in Sats für eine Grösse und Gebührenrate (aufgerundet).
const feeFor = (vsize, feeRate) => BigInt(Math.ceil(vsize * feeRate));

// Prüft eine eingegebene Gebührenrate.
export function checkFeeRate(rate) {
  if (!Number.isFinite(rate) || rate < MIN_FEE_RATE || rate > MAX_FEE_RATE) {
    throw new Error(`Gebühr muss zwischen ${MIN_FEE_RATE} und ${MAX_FEE_RATE} sat/vB liegen`);
  }
}

// Wandelt eine Empfängeradresse in ein Ausgangsskript um (prüft Netzwerk und Prüfsumme).
export function recipientScript(address, net) {
  try {
    return OutScript.encode(Address(net.btc).decode(address.trim())); // wirft bei Tippfehler oder falschem Netz
  } catch {
    throw new Error(`Ungültige Adresse für ${net.label}`);
  }
}

// Münzauswahl: grösste bestätigte UTXOs zuerst, bis Betrag + Gebühr gedeckt sind.
// amount = null bedeutet "alles senden".
export function selectCoins({ utxos, amount, feeRate, m, n, recipientLen }) {
  checkFeeRate(feeRate);
  const spendable = utxos.filter((u) => u.confirmed)          // nur bestätigte Münzen ausgeben (sicherer)
    .sort((a, b) => (b.value > a.value ? 1 : b.value < a.value ? -1 : 0)); // absteigend nach Betrag
  if (!spendable.length) throw new Error('Kein bestätigtes Guthaben vorhanden');
  if (amount === null) {                                       // ALLES SENDEN
    const total = spendable.reduce((s, u) => s + u.value, 0n);
    const fee = feeFor(estimateVsize(m, n, spendable.length, [recipientLen]), feeRate);
    const send = total - fee;                                  // Rest nach Abzug der Gebühr
    if (send < DUST_LIMIT) throw new Error('Guthaben reicht nicht für die Gebühr');
    return { inputs: spendable, send, fee, change: 0n };
  }
  if (amount < DUST_LIMIT) throw new Error(`Mindestbetrag ist ${DUST_LIMIT} Sats`);
  const inputs = [];
  let total = 0n;
  for (const u of spendable) {
    inputs.push(u);                                            // nächste Münze hinzunehmen
    total += u.value;
    const feeChange = feeFor(estimateVsize(m, n, inputs.length, [recipientLen, CHANGE_SCRIPT_LEN]), feeRate);
    const feeNoChange = feeFor(estimateVsize(m, n, inputs.length, [recipientLen]), feeRate);
    if (total >= amount + feeChange && total - amount - feeChange >= DUST_LIMIT) {
      return { inputs, send: amount, fee: feeChange, change: total - amount - feeChange }; // mit Wechselgeld
    }
    if (total >= amount + feeNoChange) {
      // Wechselgeld wäre kleiner als die Staubgrenze: kein Wechselgeld-Ausgang, der kleine Rest geht an die Miner.
      return { inputs, send: amount, fee: total - amount, change: 0n };
    }
  }
  throw new Error('Guthaben reicht nicht (Betrag plus Gebühr)');
}

// Berechnet die txid einer rohen Transaktion selbst: doppeltes SHA-256 ohne Witness-Daten, umgedreht.
function txidOf(rawBytes) {
  const parsed = RawTx.decode(rawBytes);                       // Rohdaten zerlegen
  const stripped = RawTx.encode({ ...parsed, segwitFlag: false, witnesses: undefined }); // ohne Witness
  return hex.encode(sha256(sha256(stripped)).reverse());       // txid wird umgekehrt angezeigt
}

// Zufällige ganze Zahl in [0, max) aus dem sicheren Zufallsgenerator des Browsers.
function randomInt(max) {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % max;                                         // kleiner Bias ist hier bedeutungslos
}

// Baut die unsignierte PSBT. Holt dafür die vollständigen Vorgänger-Transaktionen und prüft sie.
export async function createPsbt({ wallet, api, recipient, amount, feeRate }) {
  const { net, config } = wallet;
  const outScript = recipientScript(recipient, net);           // Empfänger prüfen
  if (!wallet.state) throw new Error('Bitte zuerst aktualisieren');
  const sel = selectCoins({
    utxos: wallet.state.utxos, amount, feeRate,
    m: config.m, n: config.cosigners.length, recipientLen: outScript.length,
  });
  const tx = new Transaction({ version: 2, lockTime: 0 });     // Version 2, keine Zeitsperre
  for (const u of sel.inputs) {
    const own = wallet.derive(u.chain, u.index);               // eigene Adresse dieser Münze
    const raw = await api.txBytes(u.txid);                     // vollständige Vorgänger-Transaktion
    if (txidOf(raw) !== u.txid) throw new Error('Server lieferte eine falsche Vorgänger-Transaktion'); // Manipulation?
    const prevOut = RawTx.decode(raw).outputs[u.vout];         // der ausgegebene Ausgang
    if (!prevOut) throw new Error('Vorgänger-Transaktion hat diesen Ausgang nicht');
    if (!equalBytes(prevOut.script, own.script)) throw new Error('Münze gehört nicht zu dieser Wallet');
    if (prevOut.amount !== u.value) throw new Error('Server meldete einen falschen Betrag'); // nur geprüfte Beträge
    tx.addInput({
      txid: u.txid,                                            // welche Münze
      index: u.vout,                                           // welcher Ausgang darin
      sequence: RBF_SEQUENCE,                                  // Gebühr später erhöhbar (RBF)
      witnessUtxo: { script: own.script, amount: prevOut.amount }, // Betrag + Skript (für die Signatur)
      nonWitnessUtxo: raw,                                     // ganze Vorgänger-Tx: Geräte können den Betrag selbst prüfen
      witnessScript: own.witnessScript,                        // Multisig-Skript
      bip32Derivation: own.bip32Derivation,                    // Pfade, damit jedes Gerät seinen Schlüssel findet
    });
  }
  const outputs = [{ script: outScript, amount: sel.send }];  // Empfänger-Ausgang
  if (sel.change > 0n) {
    const ch = wallet.derive(1, wallet.state.nextIndex[1]);    // nächste unbenutzte Wechselgeld-Adresse
    outputs.push({
      script: ch.script, amount: sel.change,                   // Wechselgeld zurück an die eigene Wallet
      witnessScript: ch.witnessScript,                         // erlaubt den Geräten die Prüfung
      bip32Derivation: ch.bip32Derivation,                     // "gehört zu uns"
    });
  }
  if (outputs.length === 2 && randomInt(2) === 1) outputs.reverse(); // Reihenfolge zufällig (Privatsphäre)
  for (const o of outputs) tx.addOutput(o);
  const psbt = tx.toPSBT(PSBT_VERSION);                        // als Bytes
  const check = analyzePsbt(wallet, psbt);                     // unabhängige Nachkontrolle
  if (check.sendTotal !== sel.send || check.fee !== sel.fee || check.changeTotal !== sel.change) {
    throw new Error('Interne Kontrolle fehlgeschlagen – Transaktion verworfen');
  }
  return psbt;
}

// Ermittelt zu einem Eingang die eigene Adresse aus den Pfadangaben und prüft sie gegen das Skript.
function ownInputAddress(wallet, input) {
  const entry = input.bip32Derivation?.[0];                    // irgendein Pfad reicht zur Orientierung
  if (!entry) throw new Error('Eingang ohne Pfadangabe');
  const path = entry[1].path;                                  // …/kette/index
  const chain = path[path.length - 2];
  const index = path[path.length - 1];
  if (chain >= HARDENED || index >= HARDENED) throw new Error('Unerwarteter Pfad im Eingang');
  const own = wallet.derive(chain, index);                     // selbst neu ableiten
  if (!equalBytes(own.script, input.witnessUtxo?.script)) throw new Error('Eingang gehört nicht zu dieser Wallet');
  if (!equalBytes(own.witnessScript, input.witnessScript)) throw new Error('Multisig-Skript des Eingangs stimmt nicht');
  return own;
}

// Prüft eine Teilsignatur kryptografisch. Gibt den Fingerabdruck des Geräts zurück.
function verifyPartialSig(tx, idx, own, amount, pubkey, sigWithType) {
  const owner = own.pubkeyOwner.get(hex.encode(pubkey));       // gehört der Schlüssel zu unserem Multisig?
  if (!owner) throw new Error('Signatur von einem fremden Schlüssel');
  if (sigWithType[sigWithType.length - 1] !== SIGHASH_ALL) throw new Error('Unerlaubter Signaturtyp (nur SIGHASH_ALL)');
  const sig = sigWithType.subarray(0, sigWithType.length - 1); // DER-Signatur ohne Typ-Byte
  const msg = tx.preimageWitnessV0(idx, own.witnessScript, SIGHASH_ALL, amount); // was unterschrieben sein muss (BIP143)
  let ok = false;
  try { ok = secp256k1.verify(sig, msg, pubkey, { prehash: false, format: 'der', lowS: true }); } catch { ok = false; }
  if (!ok) throw new Error('Ungültige Signatur – Transaktion nicht verwenden');
  return owner;
}

// Liest eine PSBT vollständig aus und prüft sie gegen die Wallet. Grundlage aller Anzeigen.
export function analyzePsbt(wallet, psbtBytes) {
  const tx = Transaction.fromPSBT(psbtBytes);                  // PSBT zerlegen (Format wird geprüft)
  if (tx.inputsLength === 0 || tx.outputsLength === 0) throw new Error('PSBT ist leer');
  let inTotal = 0n;
  const signedBy = [];                                         // je Eingang: Menge der Geräte mit gültiger Signatur
  for (let i = 0; i < tx.inputsLength; i++) {
    const input = tx.getInput(i);                              // Kopie des Eingangs
    const own = ownInputAddress(wallet, input);                // muss unser Multisig sein
    if (input.nonWitnessUtxo) {                                // Vorgänger-Tx vorhanden: Betrag gegenprüfen
      const raw = RawTx.encode(input.nonWitnessUtxo);
      if (txidOf(raw) !== hex.encode(input.txid)) throw new Error('Vorgänger-Transaktion passt nicht');
      const prev = input.nonWitnessUtxo.outputs[input.index];
      if (!prev || prev.amount !== input.witnessUtxo.amount || !equalBytes(prev.script, input.witnessUtxo.script)) {
        throw new Error('Betrag eines Eingangs ist widersprüchlich');
      }
    }
    if (input.sighashType !== undefined && input.sighashType !== SIGHASH_ALL) throw new Error('Unerlaubter Signaturtyp');
    inTotal += input.witnessUtxo.amount;                       // Summe der Eingänge
    const owners = new Set();
    for (const [pub, sig] of input.partialSig ?? []) owners.add(verifyPartialSig(tx, i, own, input.witnessUtxo.amount, pub, sig));
    if (input.finalScriptWitness) throw new Error('Unerwartet bereits fertiggestellter Eingang');
    signedBy.push(owners);
  }
  const outputs = [];
  let sendTotal = 0n;
  let changeTotal = 0n;
  for (let i = 0; i < tx.outputsLength; i++) {
    const o = tx.getOutput(i);
    const own = wallet.findByScript(o.script);                 // ist das eine unserer Adressen?
    let isChange = false;
    if (o.bip32Derivation?.length) {                           // Ausgang behauptet, zu uns zu gehören
      const path = o.bip32Derivation[0][1].path;
      const d = wallet.derive(path[path.length - 2], path[path.length - 1]); // nachrechnen
      if (!equalBytes(d.script, o.script)) throw new Error('Wechselgeld-Ausgang ist gefälscht');
      isChange = true;
    }
    const address = Address(wallet.net.btc).encode(OutScript.decode(o.script)); // Skript → Adresse (zur Anzeige)
    outputs.push({ address, amount: o.amount, isChange, ownAddress: Boolean(own) || isChange, index: own?.index ?? null });
    if (isChange) changeTotal += o.amount; else sendTotal += o.amount;
  }
  const fee = inTotal - sendTotal - changeTotal;               // Gebühr = Eingänge − Ausgänge
  if (fee <= 0n) throw new Error('Ungültige Gebühr');
  const vsize = estimateVsize(wallet.config.m, wallet.config.cosigners.length, tx.inputsLength,
    outputs.map((_, i) => tx.getOutput(i).script.length));
  // Ein Gerät gilt als "fertig", wenn es ALLE Eingänge unterschrieben hat.
  const complete = wallet.config.cosigners.map((c) => c.fingerprint)
    .filter((fp) => signedBy.every((set) => set.has(fp)));
  const ready = signedBy.every((set) => set.size >= wallet.config.m); // genug Signaturen überall?
  return {
    txid: tx.id, inputs: tx.inputsLength, inTotal, outputs, sendTotal, changeTotal, fee, vsize,
    feeRate: Number(fee) / vsize, signedBy: complete, ready,
  };
}

// Übernimmt Signaturen aus einer gescannten PSBT in die eigene PSBT – nur wenn alles stimmt.
export function mergeSignedPsbt(wallet, currentBytes, scannedBytes) {
  const cur = Transaction.fromPSBT(currentBytes);              // unsere Fassung
  const inc = Transaction.fromPSBT(scannedBytes);              // Fassung vom Signiergerät
  if (!equalBytes(cur.unsignedTx, inc.unsignedTx)) {           // gleiche Transaktion? (Ein-/Ausgänge, Beträge)
    throw new Error('Diese Signatur gehört zu einer anderen Transaktion');
  }
  let added = 0;
  for (let i = 0; i < cur.inputsLength; i++) {
    const mine = cur.getInput(i);
    const own = ownInputAddress(wallet, mine);                 // Daten aus UNSERER Fassung verwenden
    const have = new Set((mine.partialSig ?? []).map(([p]) => hex.encode(p))); // schon vorhandene Signaturen
    for (const [pub, sig] of inc.getInput(i).partialSig ?? []) {
      verifyPartialSig(cur, i, own, mine.witnessUtxo.amount, pub, sig); // mit unserem Betrag prüfen
      if (have.has(hex.encode(pub))) continue;                // schon vorhanden
      cur.updateInput(i, { partialSig: [[pub, sig]] });        // gültige Signatur übernehmen
      have.add(hex.encode(pub));
      added++;
    }
  }
  if (added === 0) throw new Error('Keine neue Signatur gefunden. Wurde dieses Gerät schon gescannt?');
  return cur.toPSBT(PSBT_VERSION);
}

// Setzt die Signaturen ins Witness-Feld und erzeugt die sendefertige Transaktion.
export function finalizePsbt(wallet, psbtBytes) {
  const info = analyzePsbt(wallet, psbtBytes);                 // nochmals alles prüfen
  if (!info.ready) throw new Error('Es fehlen noch Signaturen');
  const tx = Transaction.fromPSBT(psbtBytes);
  tx.finalize();                                               // Witness: leer, Signaturen (in Skript-Reihenfolge), Skript
  const raw = tx.extract();                                    // fertige Transaktion als Bytes
  const check = Transaction.fromRaw(raw, { allowUnknownOutputs: true }); // zur Kontrolle neu einlesen
  if (check.id !== info.txid) throw new Error('Kontrolle fehlgeschlagen: txid hat sich verändert');
  return { hex: hex.encode(raw), txid: info.txid, info };
}
