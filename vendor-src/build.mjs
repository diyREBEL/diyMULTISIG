// build.mjs – bündelt die Fremdbibliotheken zu app/lib/vendor.js.
// Aufruf: npm ci && node build.mjs
import { build } from 'esbuild';                 // esbuild ist der Bündler (nur beim Bauen nötig).
import { createHash } from 'node:crypto';        // Für die SHA-256-Prüfsumme der Ausgabedatei.
import { readFileSync } from 'node:fs';          // Zum Einlesen der fertigen Datei.

const outfile = '../app/lib/vendor.js';          // Zielpfad innerhalb des App-Ordners.

await build({
  entryPoints: ['entry.js'],                     // Startdatei mit allen Exporten.
  bundle: true,                                  // Alle Abhängigkeiten in eine Datei packen.
  format: 'esm',                                 // Als ES-Modul ausgeben (import/export im Browser).
  platform: 'browser',                           // Für Browser bauen, nicht für Node.
  target: ['es2022'],                            // Moderne Browser (BigInt, Klassenfelder).
  minify: false,                                 // Lesbar lassen, damit man den Code prüfen kann.
  legalComments: 'inline',                       // Lizenzhinweise der Bibliotheken behalten.
  outfile,                                       // Zieldatei.
});

// Prüfsumme ausgeben: Wer selbst baut, muss dieselbe Zahl erhalten (reproduzierbarer Build).
const digest = createHash('sha256').update(readFileSync(outfile)).digest('hex');
console.log(`vendor.js SHA-256: ${digest}`);
