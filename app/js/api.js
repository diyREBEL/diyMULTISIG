// api.js – Verbindung zu einem Esplora-kompatiblen Server (mempool.space oder eigene Instanz).
// Der Server liefert nur öffentliche Blockchain-Daten. Er bekommt aber alle Adressen dieser
// Wallet zu sehen (Privatsphäre!). Seine Antworten gelten als nicht vertrauenswürdig und werden geprüft.
import { hex } from '../lib/vendor.js';                     // Hex-Kodierung
import { API_TIMEOUT_MS } from './config.js';               // Zeitlimit pro Anfrage

const TXID = /^[0-9a-f]{64}$/;                              // Format einer Transaktions-ID
const isCount = (n) => Number.isSafeInteger(n) && n >= 0;   // nicht-negative ganze Zahl?

// Prüft die vom Benutzer eingegebene Server-Adresse.
export function normalizeServerUrl(text) {
  let url;
  try { url = new URL(text.trim()); } catch { throw new Error('Ungültige Server-Adresse'); }
  if (url.protocol !== 'https:') throw new Error('Nur https:// ist erlaubt (verschlüsselte Verbindung)');
  if (url.username || url.password || url.search || url.hash) throw new Error('Server-Adresse ohne Zugangsdaten, ? oder #');
  return url.origin + url.pathname.replace(/\/+$/, '');      // ohne abschliessenden Schrägstrich
}

export class EsploraApi {
  constructor(baseUrl) {
    this.base = normalizeServerUrl(baseUrl);                // geprüfte Basis-Adresse
  }

  // Führt eine HTTP-Anfrage aus: Zeitlimit, keine Weiterleitungen, keine Cookies, Wiederholung bei Überlast.
  async request(path, { method = 'GET', body, as = 'json' } = {}) {
    for (let attempt = 0; ; attempt++) {
      const ctrl = new AbortController();                   // ermöglicht Abbruch nach Zeitlimit
      const timer = setTimeout(() => ctrl.abort(), API_TIMEOUT_MS);
      let res;
      try {
        res = await fetch(this.base + path, {
          method,                                           // GET oder POST
          body,                                             // nur beim Senden einer Transaktion
          headers: body ? { 'Content-Type': 'text/plain' } : undefined,
          signal: ctrl.signal,                              // Zeitlimit
          cache: 'no-store',                                // nie alte Antworten aus dem Cache
          credentials: 'omit',                              // keine Cookies mitsenden
          referrerPolicy: 'no-referrer',                    // eigene Seite nicht verraten
          redirect: 'error',                                // keine Umleitung auf fremde Server
        });
      } catch (e) {
        throw new Error(e.name === 'AbortError' ? 'Server antwortet nicht (Zeitüberschreitung)' : 'Server nicht erreichbar');
      } finally {
        clearTimeout(timer);                                // Zeitlimit aufräumen
      }
      if (res.status === 429 && attempt < 3) {              // "zu viele Anfragen": kurz warten, erneut versuchen
        await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
        continue;
      }
      if (!res.ok) {
        const text = (await res.text()).slice(0, 200);      // Fehlermeldung des Servers (gekürzt)
        throw new Error(`Server-Fehler ${res.status}: ${text}`);
      }
      return as === 'json' ? res.json() : res.text();       // Antwort als JSON oder Text
    }
  }

  // Anzahl Transaktionen und Saldo einer Adresse.
  async addressInfo(address) {
    const r = await this.request(`/address/${encodeURIComponent(address)}`);
    const c = r?.chain_stats;                               // bestätigte Daten
    const m = r?.mempool_stats;                             // unbestätigte Daten
    const fields = ['tx_count', 'funded_txo_sum', 'spent_txo_sum'];
    if (!c || !m || !fields.every((f) => isCount(c[f]) && isCount(m[f]))) throw new Error('Unerwartete Server-Antwort (Adresse)');
    return {
      txCount: c.tx_count + m.tx_count,                     // alle Transaktionen
      balance: BigInt(c.funded_txo_sum - c.spent_txo_sum + m.funded_txo_sum - m.spent_txo_sum), // Saldo in Sats
      mempoolActive: m.tx_count > 0,                        // gibt es offene Bewegungen?
    };
  }

  // Unverbrauchte Ausgänge (UTXOs) einer Adresse.
  async addressUtxos(address) {
    const list = await this.request(`/address/${encodeURIComponent(address)}/utxo`);
    if (!Array.isArray(list)) throw new Error('Unerwartete Server-Antwort (UTXO)');
    return list.map((u) => {
      if (!TXID.test(u?.txid) || !isCount(u.vout) || !isCount(u.value) || typeof u.status?.confirmed !== 'boolean') {
        throw new Error('Unerwartete Server-Antwort (UTXO-Eintrag)');
      }
      return { txid: u.txid, vout: u.vout, value: BigInt(u.value), confirmed: u.status.confirmed, height: u.status.block_height ?? null };
    });
  }

  // Vollständige frühere Transaktion als Bytes (wird später gegen die txid geprüft).
  async txBytes(txid) {
    if (!TXID.test(txid)) throw new Error('Ungültige txid');
    const text = (await this.request(`/tx/${txid}/hex`, { as: 'text' })).trim();
    if (!/^([0-9a-f]{2})+$/.test(text)) throw new Error('Unerwartete Server-Antwort (Transaktion)');
    return hex.decode(text);
  }

  // Gebührenempfehlungen in sat/vB. mempool.space hat einen eigenen Endpunkt, Esplora einen anderen.
  async fees() {
    try {
      const r = await this.request('/v1/fees/recommended');   // mempool.space
      const ok = ['fastestFee', 'halfHourFee', 'hourFee'].every((k) => typeof r[k] === 'number' && r[k] > 0);
      if (ok) return { fast: r.fastestFee, medium: r.halfHourFee, slow: r.hourFee };
    } catch { /* Rückfall auf Esplora */ }
    const e = await this.request('/fee-estimates');           // Esplora: Zielblöcke → sat/vB
    const pick = (k) => (typeof e?.[k] === 'number' && e[k] > 0 ? e[k] : null);
    const fast = pick('1') ?? pick('2');
    const medium = pick('3') ?? pick('6') ?? fast;
    const slow = pick('6') ?? pick('12') ?? medium;
    if (!fast) throw new Error('Keine Gebührenschätzung verfügbar');
    return { fast, medium, slow };
  }

  // Sendet die fertige Transaktion ins Netzwerk. Antwort ist die txid.
  async broadcast(txHex) {
    const txid = (await this.request('/tx', { method: 'POST', body: txHex, as: 'text' })).trim();
    if (!TXID.test(txid)) throw new Error(`Unerwartete Antwort beim Senden: ${txid.slice(0, 100)}`);
    return txid;
  }
}
