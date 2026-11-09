// config.js – feste Einstellungen der Wallet an einem Ort.
import { NETWORK, TEST_NETWORK } from '../lib/vendor.js'; // Adressformate für Mainnet und Testnet.

// Die unterstützten Netzwerke. Jedes Netzwerk legt fest:
// - btc: Adress-Präfixe für die Bibliothek (bc1… bzw. tb1…)
// - xpubVersion: die 4 Versions-Bytes eines erweiterten öffentlichen Schlüssels (xpub bzw. tpub)
// - coinType: dritte Stelle im Ableitungspfad m/48'/coinType'/… (0 = Bitcoin, 1 = alle Testnetze)
// - api / explorer: Standard-Server von mempool.space
export const NETWORKS = Object.freeze({
  main: Object.freeze({
    id: 'main',                                     // interner Name
    label: 'Mainnet',                               // Anzeige
    btc: NETWORK,                                   // bc1-Adressen
    xpubVersion: 0x0488b21e,                        // "xpub"
    slip132Version: 0x02aa7ed3,                     // "Zpub" (ältere Schreibweise für P2WSH-Multisig)
    coinType: 0,                                    // Bitcoin
    api: 'https://mempool.space/api',               // Daten-Server
    explorer: 'https://mempool.space',              // Block-Explorer für Links
  }),
  testnet4: Object.freeze({
    id: 'testnet4',
    label: 'Testnet4',
    btc: TEST_NETWORK,                              // tb1-Adressen
    xpubVersion: 0x043587cf,                        // "tpub"
    slip132Version: 0x02575483,                     // "Vpub"
    coinType: 1,                                    // Testnetz
    api: 'https://mempool.space/testnet4/api',
    explorer: 'https://mempool.space/testnet4',
  }),
  signet: Object.freeze({
    id: 'signet',
    label: 'Signet',
    btc: TEST_NETWORK,                              // Signet nutzt dieselben Präfixe wie Testnet
    xpubVersion: 0x043587cf,
    slip132Version: 0x02575483,
    coinType: 1,
    api: 'https://mempool.space/signet/api',
    explorer: 'https://mempool.space/signet',
  }),
});

export const GAP_LIMIT = 20;            // So viele unbenutzte Adressen in Folge beenden die Suche (BIP44-Standard).
export const MIN_COSIGNERS = 2;         // Mindestens zwei Schlüssel, sonst ist es kein Multisig.
export const MAX_COSIGNERS = 9;         // SeedSigner liest Setup-Dateien bis 9 Schlüssel.
export const DUST_LIMIT = 546n;         // Kleinster sinnvoller Betrag pro Ausgang in Sats (gilt für alle Adresstypen).
export const MIN_FEE_RATE = 1;          // Untergrenze Gebühr in sat/vB.
export const MAX_FEE_RATE = 1000;       // Obergrenze: schützt vor Tippfehlern (z. B. 10000 statt 10).
export const HIGH_FEE_RATIO = 0.05;     // Ab 5 % Gebühr (bezogen auf den Betrag) gibt es eine Warnung.
export const RBF_SEQUENCE = 0xfffffffd; // Markiert die Transaktion als ersetzbar (BIP125), Gebühr später erhöhbar.
export const SIGHASH_ALL = 1;           // Einziger akzeptierter Signaturtyp: unterschreibt alle Ein- und Ausgänge.
export const WALLET_NAME_PATTERN = /^[A-Za-z0-9_-]{1,15}$/; // Jade speichert höchstens 15 Zeichen ohne Leerzeichen.
export const API_TIMEOUT_MS = 20000;    // Nach 20 Sekunden ohne Antwort bricht eine Server-Anfrage ab.
export const LEGACY_STORAGE_KEY = 'diy-multisig-v1'; // Speichername von Version 1.0.0 – wird beim Start gelöscht.
