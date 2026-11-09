// wallet.js – Adressen ableiten und Guthaben ermitteln (nur mit öffentlichen Schlüsseln).
import { HDKey, p2ms, p2wsh, hex } from '../lib/vendor.js';            // BIP32 und Skript-Bausteine
import { NETWORKS, GAP_LIMIT, MIN_COSIGNERS, MAX_COSIGNERS, WALLET_NAME_PATTERN } from './config.js';
import { bip32Versions, parsePath, makeCosigner, assertDistinct } from './keys.js';

// Vergleicht zwei Byte-Folgen lexikografisch (für die Sortierung nach BIP67).
function compareBytes(a, b) {
  for (let i = 0; i < Math.min(a.length, b.length); i++) if (a[i] !== b[i]) return a[i] - b[i];
  return a.length - b.length;
}

// Prüft eine gespeicherte oder neu erstellte Wallet-Konfiguration vollständig.
export function validateConfig(cfg) {
  const net = NETWORKS[cfg.network];                                     // Netzwerk muss bekannt sein
  if (!net) throw new Error('Unbekanntes Netzwerk');
  if (!WALLET_NAME_PATTERN.test(cfg.name)) throw new Error('Name: 1–15 Zeichen, nur Buchstaben, Ziffern, _ und -');
  const n = cfg.cosigners.length;                                        // Anzahl Schlüssel
  if (n < MIN_COSIGNERS || n > MAX_COSIGNERS) throw new Error(`Es braucht ${MIN_COSIGNERS} bis ${MAX_COSIGNERS} Schlüssel`);
  if (!Number.isInteger(cfg.m) || cfg.m < 1 || cfg.m > n) throw new Error('Ungültige Anzahl benötigter Signaturen');
  // Jeden Schlüssel erneut streng prüfen (schützt auch vor manipulierten Speicherdaten).
  const cosigners = cfg.cosigners.map((c) => makeCosigner(net, c.fingerprint, parsePath(c.path), c.xpub, c.label));
  assertDistinct(cosigners);                                             // keine Duplikate
  return { name: cfg.name, network: cfg.network, m: cfg.m, cosigners, createdAt: cfg.createdAt };
}

export class MultisigWallet {
  constructor(cfg) {
    this.config = validateConfig(cfg);                                   // nur geprüfte Daten verwenden
    this.net = NETWORKS[this.config.network];                            // Netzwerk-Einstellungen
    const versions = bip32Versions(this.net);                            // xpub/tpub-Versionen
    // Konto-Schlüssel (Tiefe 4) und davon die zwei Ketten 0 (Empfang) und 1 (Wechselgeld) vorberechnen.
    const accounts = this.config.cosigners.map((c) => HDKey.fromExtendedKey(c.xpub, versions));
    this.chainNodes = [0, 1].map((chain) => accounts.map((a) => a.deriveChild(chain)));
    this.cache = new Map();                                              // "kette/index" → abgeleitete Adresse
    this.byScript = new Map();                                           // Skript (hex) → abgeleitete Adresse
    this.state = null;                                                   // letztes Scan-Ergebnis
  }

  // Leitet die Multisig-Adresse für Kette (0/1) und Index ab.
  derive(chain, index) {
    if (chain !== 0 && chain !== 1) throw new Error('Kette muss 0 oder 1 sein');
    if (!Number.isInteger(index) || index < 0 || index >= 0x80000000) throw new Error('Ungültiger Adress-Index');
    const key = `${chain}/${index}`;                                     // Cache-Schlüssel
    if (this.cache.has(key)) return this.cache.get(key);                 // schon berechnet
    const keys = this.chainNodes[chain].map((node, i) => ({              // pro Mitsignierer:
      pubkey: node.deriveChild(index).publicKey,                         //   öffentlicher Schlüssel …/kette/index
      cosigner: this.config.cosigners[i],                                //   zugehöriger Mitsignierer
    }));
    const sorted = [...keys].sort((a, b) => compareBytes(a.pubkey, b.pubkey)); // BIP67: aufsteigend sortieren
    const ms = p2ms(this.config.m, sorted.map((k) => k.pubkey));         // m-von-n Skript (OP_CHECKMULTISIG)
    const pay = p2wsh(ms, this.net.btc);                                 // in P2WSH verpacken → bc1q…-Adresse
    const derived = {
      chain, index,                                                      // Position im Baum
      address: pay.address,                                              // Adresse als Text
      script: pay.script,                                                // scriptPubKey (0x0020 + SHA-256)
      witnessScript: pay.witnessScript,                                  // das eigentliche Multisig-Skript
      // Für jeden Schlüssel: woher er stammt (Fingerabdruck + vollständiger Pfad). Signiergeräte brauchen das.
      bip32Derivation: keys.map((k) => [k.pubkey, {
        fingerprint: parseInt(k.cosigner.fingerprint, 16),
        path: [...parsePath(k.cosigner.path), chain, index],
      }]),
      pubkeyOwner: new Map(keys.map((k) => [hex.encode(k.pubkey), k.cosigner.fingerprint])), // Schlüssel → Gerät
    };
    this.cache.set(key, derived);                                        // merken
    this.byScript.set(hex.encode(pay.script), derived);                  // auch über das Skript auffindbar
    return derived;
  }

  // Sucht eine eigene Adresse über ihr Skript (z. B. um Wechselgeld zu erkennen).
  findByScript(script) {
    return this.byScript.get(hex.encode(script)) ?? null;
  }

  // Fragt den Server nach allen benutzten Adressen und deren unverbrauchten Ausgängen (UTXOs).
  async scan(api, onProgress = () => {}) {
    const used = [];                                                     // benutzte Adressen
    const utxos = [];                                                    // gefundene UTXOs
    const nextIndex = [0, 0];                                            // erste unbenutzte Adresse je Kette
    let checked = 0;                                                     // Zähler für die Fortschrittsanzeige
    for (const chain of [0, 1]) {
      let gap = 0;                                                       // unbenutzte Adressen in Folge
      let index = 0;                                                     // aktueller Index
      while (gap < GAP_LIMIT) {
        const batch = [];                                                // 5 Adressen gleichzeitig abfragen
        for (let i = 0; i < 5; i++) batch.push(this.derive(chain, index + i));
        const infos = await Promise.all(batch.map((d) => api.addressInfo(d.address)));
        for (let i = 0; i < batch.length && gap < GAP_LIMIT; i++) {
          const d = batch[i];
          const info = infos[i];
          checked++;
          if (info.txCount > 0) {                                        // Adresse wurde benutzt
            gap = 0;
            nextIndex[chain] = d.index + 1;                              // nächste freie Adresse liegt dahinter
            used.push({ ...d, balance: info.balance });
            if (info.balance > 0n || info.mempoolActive) {               // nur dann UTXOs abfragen
              for (const u of await api.addressUtxos(d.address)) utxos.push({ ...u, chain: d.chain, index: d.index });
            }
          } else {
            gap++;                                                       // wieder eine unbenutzte
          }
        }
        index += batch.length;                                           // nächsten Block prüfen
        onProgress(checked);
      }
    }
    const sum = (list) => list.reduce((s, u) => s + u.value, 0n);         // Beträge addieren
    this.state = {
      used, utxos, nextIndex,
      confirmed: sum(utxos.filter((u) => u.confirmed)),                  // bestätigtes Guthaben
      unconfirmed: sum(utxos.filter((u) => !u.confirmed)),               // noch unbestätigt
      time: Date.now(),                                                  // Zeitpunkt der Abfrage
    };
    return this.state;
  }
}
