// entry.js – Einstiegspunkt für das Bündeln der Fremdbibliotheken.
// Aus dieser Datei erzeugt build.mjs die Datei app/lib/vendor.js.
// Die App lädt nur diese eine Datei mit Fremdcode, nichts von einem CDN.

// Transaktionen, PSBT, Skripte, Adressen (Cure53-geprüft, siehe README der Bibliothek).
// Nur die benötigten Teile werden exportiert, damit das Bündel klein und prüfbar bleibt.
export {
  Transaction, p2ms, p2wsh, Address, OutScript, RawTx, Decimal, SigHash, NETWORK, TEST_NETWORK,
} from '@scure/btc-signer';
// BIP32: Ableitung öffentlicher Schlüssel aus xpubs.
export { HDKey } from '@scure/bip32';
// Kodierungen: Hex, Base64, Base58 mit Prüfsumme.
export { hex, base64, createBase58check } from '@scure/base';
// SHA-256 (für Base58check, UR-Zufallsgenerator).
export { sha256 } from '@noble/hashes/sha2.js';
// Elliptische Kurve secp256k1 (nur zum Prüfen von Signaturen, nie zum Signieren).
export { secp256k1 } from '@noble/curves/secp256k1.js';
// QR-Code-Erzeugung (keine Abhängigkeiten).
export { default as qrcode } from 'qrcode-generator';
// QR-Code-Erkennung im Kamerabild, falls der Browser keinen eigenen Detektor hat.
export { default as jsQR } from 'jsqr';
