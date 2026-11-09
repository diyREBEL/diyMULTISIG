# DIY Multisig

Bitcoin-Multisig-Wallet (Native SegWit, `wsh(sortedmulti(m, …))`) als Web-App fürs Handy.
Signiert wird ausschliesslich auf Hardware-Signiergeräten per QR-Code (SeedSigner, Jade).
Die App selbst kennt **keine privaten Schlüssel** – sie ist nur "Koordinator":
Sie leitet Adressen ab, fragt Guthaben ab, baut die unsignierte Transaktion (PSBT),
sammelt die Signaturen ein, prüft sie und sendet die fertige Transaktion.

**Modus ohne Speichern (ab Version 1.1.0):** Die App legt nichts im Browser ab – kein localStorage, kein Cache,
kein Service Worker. Bei jedem Start wird die Wallet aus dem Backup geladen (Backup-QR vom gedruckten Blatt,
Backup-Datei oder Descriptor-Text). So kann keine andere App unter derselben Adresse (`diyrebel.github.io`)
gespeicherte Daten oder Code verändern.

Die ausführliche Erklärung aller Dateien und Code-Zeilen steht in [ERKLAERUNG.md](ERKLAERUNG.md).

## Ordner

| Ordner | Inhalt |
|---|---|
| `app/` | Die fertige App. Diesen Ordner auf GitHub Pages veröffentlichen. |
| `app/js/` | Eigener Code (lesbar, ohne Build-Schritt). |
| `app/lib/vendor.js` | Gebündelte, geprüfte Fremdbibliotheken (siehe unten). |
| `vendor-src/` | Rezept, um `vendor.js` selbst und reproduzierbar zu bauen. |
| `tests/` | Automatische Tests (Node, Python mit echter SeedSigner-Software, Chrome). |

## Veröffentlichung auf GitHub Pages

Die App liegt im Ordner `app/`. Der Workflow `.github/workflows/pages.yml` veröffentlicht diesen Ordner bei
jedem Push auf `main`. Vorher baut er `app/lib/vendor.js` aus den gepinnten Quellen neu und bricht ab, wenn das
Ergebnis nicht byte-genau mit der Datei im Repository übereinstimmt. Die verwendeten GitHub-Actions sind auf
feste Commits gepinnt.

Einmalig einrichten:

1. Repository öffentlich machen: Settings → General → Danger Zone → Change visibility → Public.
   (Mit GitHub Free gibt es Pages nur für öffentliche Repositories. Das Repository enthält keine Geheimnisse.)
2. Settings → Pages → Build and deployment → Source: **GitHub Actions**.
3. Actions → "Pages veröffentlichen" → "Run workflow" (oder einen neuen Commit pushen).
4. Adresse: <https://diyrebel.github.io/diyMULTISIG/> – auf dem Handy öffnen → "Zum Home-Bildschirm hinzufügen".

**Gemeinsame Adresse:** Alle Pages-Projekte unter `diyrebel.github.io` teilen sich den Browser-Speicher.
Weil die App nichts speichert, gibt es dort nichts zu manipulieren. Restrisiko: Eine andere App, die
*gleichzeitig* offen ist, könnte in die laufende Seite eingreifen. Darum Empfangsadressen und beim Signieren
Empfänger und Wechselgeld immer am Signiergerät prüfen. Die Descriptor-Prüfsumme auf der Übersicht muss mit
dem Backup-Blatt übereinstimmen.

**Updates:** `VERSION` in `app/js/app.js` erhöhen. `app/sw.js` nicht löschen: Die Datei schaltet den
Service Worker der alten Version 1.0.0 ab, falls ein Browser ihn noch installiert hat.

## Fremdbibliotheken selbst bauen (reproduzierbar)

```bash
cd vendor-src
npm ci            # installiert exakt die Versionen aus package-lock.json
node build.mjs    # erzeugt ../app/lib/vendor.js und zeigt die SHA-256-Prüfsumme
```

Erwartete Prüfsumme dieser Version:
`65e025775202816452b2212a6447762cf03b91417d16d59e33ddabe2e3aca71d`

Enthaltene Bibliotheken (alle ohne weitere Abhängigkeiten ausser untereinander):

| Paket | Version | Zweck | Prüfstand laut README der Bibliothek |
|---|---|---|---|
| @scure/btc-signer | 2.4.1 | PSBT, Skripte, Adressen | Cure53-Audit 2023 (v0.3.0), Selbst-Audit 2026 (v2.2.0) |
| @scure/bip32 | 2.4.0 | xpub-Ableitung | Cure53-Audit 2022 (v1.0.1), Selbst-Audit 2026 |
| @scure/base | 2.4.0 | Hex, Base58, Base64 | Cure53-Audit 2022 (v1.0.0), Selbst-Audit 2026 |
| @noble/hashes | 2.4.0 | SHA-256 | Cure53-Audit 2022 |
| @noble/curves | 2.4.0 | Signaturen prüfen (secp256k1) | Trail of Bits 2026 (v2.3.0), weitere frühere Audits |
| micro-packed | 0.11.1 | Binärformate (von btc-signer) | – |
| qrcode-generator | 2.0.4 | QR-Codes zeichnen | – |
| jsqr | 1.4.0 | QR-Codes im Kamerabild erkennen | – |

Die UR-Kodierung (animierte QR-Codes) und CBOR sind selbst geschrieben (`app/js/ur.js`, `app/js/cbor.js`),
um 70 zusätzliche Pakete zu vermeiden. Sie sind gegen die Referenz-Bibliothek und gegen den
Original-Code von SeedSigner getestet.

## Tests

```bash
node tests/ur.test.mjs            # UR/Bytewords/Fountain-Code gegen @ngraveio/bc-ur
node tests/interop.test.mjs       # gegen SeedSigner-Quellcode + embit + python-bitcointx
node tests/ui.test.mjs            # ganzer Ablauf im echten Chrome (Kamera-Testvideo, Druck, nichts gespeichert, Neuladen)
node tests/ui-restore.test.mjs    # Laden aus Setup-Datei/Backup-Datei, Prüfsummenfehler, Wallet schliessen
```

Voraussetzungen für interop/ui: `pip install embit urtypes python-bitcointx`,
SeedSigner-Quellcode unter `ext/seedsigner` (oder Pfad in `SEEDSIGNER_SRC`), Playwright und Chrome.

## Grenzen

- Kein unabhängiges Sicherheitsaudit. Erst mit kleinen Beträgen arbeiten.
- Getestet gegen den Original-Code von SeedSigner (Python) – **nicht** auf echter Hardware.
  Jade-Formate wurden anhand des Jade-Quellcodes umgesetzt, aber nicht mit einem Gerät getestet.
- BitBox und andere Geräte ohne Kamera werden nicht unterstützt.
- Der Blockchain-Server (Standard: mempool.space) sieht alle Adressen der Wallet.
- Eine offene Transaktion geht beim Schliessen der App verloren (der Browser warnt vorher).
- Ein eigener Server gilt nur für die laufende Sitzung.
