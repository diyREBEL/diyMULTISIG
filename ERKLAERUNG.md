# DIY Multisig – Erklärung des gesamten Codes

Dieses Dokument erklärt jede eigene Datei der App, Funktion für Funktion und Zeile für Zeile.
Stand: Version 1.1.0 (Modus ohne Speichern).
Zusätzlich steht in fast jeder Code-Zeile ein deutscher Kommentar. Am besten liest du beides nebeneinander:
Die Kommentare sagen, *was* eine Zeile tut, dieses Dokument erklärt, *warum*.

Inhalt

1. Grundlagen in fünf Minuten
2. Ablauf der App
3. Sicherheitskonzept
4. Datei für Datei
5. Was die Tests beweisen – und was nicht
6. Bekannte Grenzen und Empfehlungen

---

## 1. Grundlagen in fünf Minuten

**Multisig m-von-n.** Es gibt n Schlüssel (je ein Seed pro Gerät). Für eine Ausgabe braucht es Signaturen
von m davon. 2-von-3 heisst: ein Schlüssel darf verloren gehen oder gestohlen werden, ohne dass Geld weg ist.

**P2WSH (Native SegWit Multisig).** Das Geld liegt nicht an einem Schlüssel, sondern an einem *Skript*:
`OP_2 <Schlüssel A> <Schlüssel B> <Schlüssel C> OP_3 OP_CHECKMULTISIG`. Dieses Skript heisst *witnessScript*.
Die Adresse (`bc1q…`, 62 Zeichen) ist der SHA-256-Hash dieses Skripts. Erst beim Ausgeben wird das Skript
selbst zusammen mit den Signaturen veröffentlicht.

**sortedmulti (BIP67).** Die Schlüssel im Skript werden sortiert. So entsteht immer dieselbe Adresse,
egal in welcher Reihenfolge man die Geräte eingibt.

**xpub und Ableitungspfad (BIP32/BIP48).** Ein Gerät gibt keinen einzelnen Schlüssel heraus, sondern einen
*erweiterten öffentlichen Schlüssel* (xpub) am Pfad `m/48'/0'/0'/2'`:
48 = Multisig, 0 = Bitcoin (1 = Testnetz), 0 = Konto, 2 = Native SegWit. Aus der xpub lassen sich beliebig
viele öffentliche Schlüssel ableiten: `…/0/i` für Empfangsadressen, `…/1/i` für Wechselgeld.
Das `'` heisst "gehärtet": Diese Schritte kann nur das Gerät mit dem privaten Schlüssel rechnen.

**Fingerabdruck.** Die ersten 4 Bytes des Hashs des Master-Schlüssels, z. B. `73C5DA0A`. Er identifiziert
den Seed. Gerät und App müssen denselben Fingerabdruck anzeigen.

**Descriptor (BIP380/383/389).** Eine Textzeile, die die ganze Wallet beschreibt:
`wsh(sortedmulti(2,[fp/48h/0h/0h/2h]xpub…/<0;1>/*,…))#prüfsumme`. `<0;1>` steht für beide Ketten
(Empfang und Wechselgeld). Die Prüfsumme nach `#` entdeckt Tippfehler. **Ohne Descriptor helfen die Seeds
allein nicht weiter**, weil niemand weiss, welche anderen Schlüssel zur Wallet gehören.

**PSBT (BIP174).** "Teilweise signierte Bitcoin-Transaktion" – ein Austauschformat. Die App erstellt sie mit
allen Informationen, die ein Gerät zum Prüfen und Signieren braucht:
- `witnessUtxo`: Betrag und Skript der ausgegebenen Münze,
- `nonWitnessUtxo`: die *ganze* frühere Transaktion (damit ein Gerät den Betrag selbst nachrechnen kann),
- `witnessScript`: das Multisig-Skript,
- `bip32Derivation`: für jeden Schlüssel Fingerabdruck und Pfad, damit jedes Gerät "seinen" Schlüssel findet.
Jedes Gerät fügt eine `partialSig` (Teilsignatur) hinzu. Sind genug da, setzt die App alles zur fertigen
Transaktion zusammen ("finalisieren").

**Signatur (BIP143, SIGHASH_ALL).** Unterschrieben wird ein Hash über die ganze Transaktion inklusive Betrag
der ausgegebenen Münze. SIGHASH_ALL heisst: alle Ein- und Ausgänge sind unterschrieben, nichts lässt sich nachträglich
ändern. Signaturen sind im DER-Format, mit "kleinem S" (low-S, Standardregel des Netzwerks).

**UR / animierte QR-Codes (BCR-2020-005).** Eine PSBT ist oft 1–3 KB gross, zu viel für einen QR-Code.
UR teilt die Daten in Stücke. Jedes Stück wird als "Bytewords" geschrieben (jedes Byte = 2 Buchstaben),
mit CRC32-Prüfsumme. Ab dem (n+1)-ten Bild werden mehrere Stücke per XOR gemischt (*Fountain-Code*):
Verpasst die Kamera ein Bild, lässt es sich aus gemischten Bildern zurückrechnen. Die Daten selbst sind in
CBOR verpackt, einem kompakten Binärformat.

**vByte und Gebühr.** Die Gebühr hängt von der Grösse in "virtuellen Bytes" ab. Witness-Daten (Signaturen,
Skript) zählen nur ¼. Die App schätzt die Grösse vor dem Signieren und rechnet mit der grösstmöglichen
Signatur, damit die Gebühr nie zu tief ausfällt.

---

## 2. Ablauf der App

Die App speichert nichts. Jede Sitzung beginnt mit dem Laden der Wallet aus dem Backup
(Backup-QR, Backup-Datei oder Descriptor-Text) oder mit der Einrichtung einer neuen Wallet.

```
Einrichten                Empfangen                 Senden
──────────                ─────────                 ──────
Regeln (m, n, Name)       erste unbenutzte          Adresse, Betrag, Gebühr
   │                      Adresse …/0/i                │
Gerät 1..n: xpub-QR          │                      Münzauswahl + Vorgänger-Tx holen
scannen und prüfen        QR + Text anzeigen        und gegen txid prüfen
   │                      (am Gerät prüfen)            │
Descriptor bauen                                    PSBT bauen + Selbstkontrolle
   │                                                   │
Wallet-QR (Setup-Datei)                             Anzeige aus der PSBT selbst
auf Geräten registrieren                               │
   │                                                animierter QR → Gerät signiert
Backup-Blatt drucken                                Gerät-QR scannen → jede Signatur prüfen
                                                       │  (wiederholen bis m Signaturen)
                                                    finalisieren → senden → txid prüfen
```

---

## 3. Sicherheitskonzept

| Gefahr | Gegenmassnahme | Wo im Code |
|---|---|---|
| Private Schlüssel geraten in die App | Die App kann keine privaten Schlüssel verarbeiten. xprv/Zprv/"is-private" werden mit Warnung abgelehnt und nie gespeichert. | `keys.js` → `makeCosigner`, `cosignerFromHdkey` |
| Falscher oder doppelter Schlüssel | Pfad muss exakt BIP48-P2WSH sein, Tiefe und Index der xpub müssen zum Pfad passen, Netzwerk muss stimmen. Gleicher Seed zweimal wird abgelehnt. | `keys.js` → `checkBip48`, `makeCosigner`, `assertDistinct` |
| Server lügt bei Beträgen | Die ganze Vorgänger-Transaktion wird geladen, ihre txid selbst berechnet und mit der Münze verglichen. Betrag und Skript stammen nur aus geprüften Daten. | `tx.js` → `createPsbt`, `txidOf` |
| Server schiebt fremde Münzen unter | Das Skript der Münze muss exakt dem selbst abgeleiteten Skript entsprechen. | `tx.js` → `createPsbt`, `ownInputAddress` |
| Manipulierte Wechselgeld-Angabe | Jeder Ausgang, der "zu uns" gehören will, wird aus den eigenen xpubs neu abgeleitet und verglichen. | `tx.js` → `analyzePsbt` |
| Gerät oder Angreifer liefert falsche Signatur | Jede Teilsignatur wird kryptografisch geprüft (Schlüssel gehört zur Wallet, nur SIGHASH_ALL, gültige DER/low-S-Signatur über den BIP143-Hash mit *unserem* Betrag). | `tx.js` → `verifyPartialSig`, `mergeSignedPsbt` |
| Signatur für andere Transaktion | Die unsignierte Transaktion des Geräts muss byte-genau unserer entsprechen. | `tx.js` → `mergeSignedPsbt` |
| Angezeigte ≠ gesendete Transaktion | Alle Anzeigen werden aus der PSBT selbst berechnet, nicht aus Formularwerten. Die txid steht fest, bevor signiert wird, und wird beim Senden verglichen. | `tx.js` → `analyzePsbt`, `finalizePsbt`; `app.js` → `showBroadcast` |
| Tippfehler bei Gebühr | Gebühr nur 1–1000 sat/vB, Warnung ab 5 % des Betrags. | `config.js`, `tx.js` → `checkFeeRate`, `app.js` → `showReview` |
| Adresse in der App ausgetauscht | Empfangsadressen auf dem Gerät prüfen (Jade: registrierte Wallet, SeedSigner: Wallet-QR). Geräte prüfen Empfänger und Wechselgeld beim Signieren selbst. | Hinweise in `index.html` |
| Fremder Code im Browser (XSS) | Content-Security-Policy: nur eigene Skripte, keine Inline-Skripte. Texte nur über `textContent`, nie als HTML. Keine CDNs. | `index.html`, `app.js` |
| Andere App unter derselben Adresse (z. B. `diyrebel.github.io`) verändert gespeicherte Daten oder Code | **Modus ohne Speichern:** kein localStorage, kein sessionStorage, kein Cache, kein Service Worker. Es gibt nichts, was sich dauerhaft manipulieren liesse. Reste von Version 1.0.0 werden beim Start gelöscht. Descriptor-Prüfsumme auf der Übersicht sichtbar. | `app.js` → `removeLegacyData`, `sw.js` |
| Andere App läuft *gleichzeitig* und greift in die offene Seite ein | Lässt sich im Browser nicht verhindern (gleiche Adresse = gleiche Rechte). Letzte Verteidigung sind die Geräte: Empfangsadresse am Gerät bestätigen, Empfänger und Wechselgeld beim Signieren am Gerät prüfen. | Hinweise in `index.html` |
| Bösartige QR-Codes (Absturz/Überlauf) | CBOR- und UR-Dekoder prüfen jede Länge, Tiefe und Prüfsumme. | `cbor.js`, `ur.js` |
| Kompromittierte Bibliothek | Nur 8 Pakete, exakte Versionen, lesbares Bündel, reproduzierbarer Build mit Prüfsumme. | `vendor-src/` |

---

## 4. Datei für Datei

### 4.1 `vendor-src/entry.js` und `vendor-src/build.mjs`

`entry.js` listet genau die Teile der Fremdbibliotheken auf, die die App braucht. Jede `export`-Zeile holt
ein Werkzeug aus einem Paket:
- `Transaction, p2ms, p2wsh, Address, OutScript, RawTx, Decimal, SigHash, NETWORK, TEST_NETWORK` aus
  @scure/btc-signer: Transaktions-Objekt, Multisig-Skript (`p2ms`), P2WSH-Verpackung (`p2wsh`),
  Adress-Umwandlung, Skript-Umwandlung, Rohdaten-Format, exakte BTC→Sats-Umrechnung, Signaturtypen, Netzwerke.
- `HDKey` aus @scure/bip32: xpubs lesen und Kind-Schlüssel ableiten.
- `hex, base64, createBase58check` aus @scure/base: Kodierungen.
- `sha256` aus @noble/hashes, `secp256k1` aus @noble/curves (nur `verify` wird benutzt).
- `qrcode` (Zeichnen) und `jsQR` (Erkennen).

`build.mjs` ruft esbuild auf: `bundle: true` packt alles in eine Datei, `format: 'esm'` erzeugt ein ES-Modul
(Browser-`import`), `minify: false` lässt den Code lesbar, `legalComments: 'inline'` behält die Lizenzhinweise.
Danach berechnet das Skript die SHA-256-Prüfsumme der Ausgabe. Wer selbst baut, muss dieselbe Zahl erhalten
(siehe README) – damit lässt sich prüfen, dass `vendor.js` wirklich aus diesen Quellen stammt.

### 4.2 `app/index.html`

- Die `Content-Security-Policy` ist die wichtigste Zeile der Seite: `default-src 'none'` verbietet alles,
  dann wird gezielt erlaubt: Skripte und Styles nur von dieser Seite (`'self'`), Bilder auch als `data:`,
  Netzwerkzugriffe nur verschlüsselt (`https:`, für den Blockchain-Server), Kamera-Stream (`mediastream:`).
  `base-uri 'none'` und `form-action 'none'` schliessen zwei bekannte Angriffswege.
- `referrer no-referrer`: Beim Öffnen eines Explorer-Links wird die eigene Adresse nicht mitgeschickt.
- `viewport`, `theme-color`, `apple-mobile-web-app-*`, `manifest`, Icons: Darstellung als installierte App.
- `<script type="module" src="js/app.js">`: lädt den eigenen Code als Modul (keine Inline-Skripte).
- Danach folgen die Bildschirme als `<section class="screen" hidden>`. Immer ist genau einer sichtbar
  (`app.js` → `show`). IDs wie `setup-name` werden in `app.js` angesprochen.
- Die `<details>`-Blöcke enthalten die Bedienschritte an SeedSigner und Jade (aus deren Quellcode abgeleitet).
- `#scanner` und `#paste` sind Overlays über allem: Kamera-Scanner bzw. Texteingabe als Ersatz.
- `#print-sheet` ist das Backup-Blatt. Am Bildschirm ist es unsichtbar, beim Drucken erscheint nur dieses Blatt.
- Der Startbildschirm hat ein verstecktes `<input type="file">` für "Backup-Datei öffnen".

### 4.3 `app/css/style.css`

Reines Aussehen, keine Logik. `:root` definiert Farben als Variablen (Petrol `#0b5560`), der
`prefers-color-scheme: dark`-Block überschreibt sie für den Dunkelmodus. `.btn` sind grosse Tasten
(mind. 46 px hoch, gut für Daumen). `.summary` ist das zweispaltige Raster in den Prüf-Ansichten,
`overflow-wrap: anywhere` bricht lange Adressen um, ohne Wörter zu zerreissen. `.qrbox` hat immer weissen
Hintergrund (auch im Dunkelmodus), weil Kameras dunkle QR-Codes auf hellem Grund am besten lesen.
`[hidden] { display: none !important }` stellt sicher, dass ausgeblendete Elemente nie durch andere Regeln
sichtbar werden. `image-rendering: pixelated` hält QR-Kästchen scharf. Der `@media print`-Block blendet beim
Drucken die ganze App aus und zeigt nur das Backup-Blatt (A4, QR-Code 95 mm breit).

### 4.4 `app/js/config.js`

- `NETWORKS`: drei Netzwerke mit je Adress-Präfix (`btc`), Versions-Bytes der xpub (`xpubVersion` =
  "xpub"/"tpub", `slip132Version` = "Zpub"/"Vpub", eine ältere Schreibweise einiger Geräte), Münztyp im Pfad
  (`coinType` 0/1) sowie Standard-Server und Explorer. `Object.freeze` verhindert, dass Code die Werte
  versehentlich ändert.
- `GAP_LIMIT = 20`: Wallets suchen nach 20 unbenutzten Adressen in Folge nicht weiter (Standard). Darum
  lässt die App auch nicht mehr als 20 Adressen im Voraus anzeigen.
- `MIN_COSIGNERS`/`MAX_COSIGNERS`: 2–9. Mehr als 9 kann SeedSigner aus der Setup-Datei nicht lesen.
- `DUST_LIMIT = 546n`: Kleinere Ausgänge werden vom Netzwerk nicht weitergeleitet ("Staub"). Das `n` am
  Ende heisst BigInt: Alle Beträge sind exakte Ganzzahlen in Sats, nie Kommazahlen.
- `MIN_FEE_RATE`/`MAX_FEE_RATE`/`HIGH_FEE_RATIO`: Grenzen gegen Tippfehler.
- `RBF_SEQUENCE = 0xfffffffd`: Markiert die Transaktion als ersetzbar (BIP125). Steckt sie fest, kann man
  später mit höherer Gebühr neu senden.
- `SIGHASH_ALL = 1`: einzig erlaubter Signaturtyp.
- `WALLET_NAME_PATTERN`: Jade speichert höchstens 15 druckbare Zeichen ohne Leerzeichen.
- `API_TIMEOUT_MS`: Zeitlimit für Server-Anfragen.
- `LEGACY_STORAGE_KEY`: Name des Speichereintrags der alten Version 1.0.0. Er wird nur noch benutzt, um diesen
  Eintrag beim Start zu löschen.

### 4.5 `app/js/cbor.js`

CBOR besteht aus Elementen. Das erste Byte jedes Elements enthält in den oberen 3 Bits den Typ
(0 = Zahl, 1 = negative Zahl, 2 = Bytes, 3 = Text, 4 = Liste, 5 = Map, 6 = Tag, 7 = Sonderwert)
und in den unteren 5 Bits eine Zahl oder Länge.

- `MAX_DEPTH = 16`, `utf8` mit `fatal: true`: Schutz gegen absichtlich tief verschachtelte Daten
  und ungültigen Text.
- `class Tagged`: hält ein markiertes Element, z. B. Tag 303 = HD-Schlüssel, 401 = "wsh".
- `cborDecode`: prüft den Typ der Eingabe, liest ein Element und verlangt, dass danach **keine Bytes übrig**
  sind (sonst könnte jemand versteckte Daten anhängen).
- `readArgument`: Werte 0–23 stehen direkt im ersten Byte; 24/25/26/27 heissen "folgt in 1/2/4/8 Bytes".
  Alles andere (u. a. "unbestimmte Länge") wird abgelehnt. Es wird nie über das Ende hinaus gelesen.
  Grosse Zahlen bleiben BigInt, kleine werden normale Zahlen.
- `readItem`: der eigentliche Leser. Für jede Längenangabe wird geprüft, ob überhaupt so viele Bytes
  vorhanden sind (`Liste zu lang` usw.), bevor Speicher reserviert wird. Doppelte Map-Schlüssel sind verboten,
  weil sie mehrdeutig wären. Fliesskommazahlen braucht die Wallet nicht und lehnt sie ab.
- `header`: schreibt Typ + Zahl im kürzesten möglichen Format (vom UR-Standard verlangt, sonst stimmen
  Prüfsummen anderer Programme nicht).
- `cborUint`, `cborBytes`, `cborArray`: die drei Kodierer, die die App braucht (UR-Teile und Nutzdaten).
- `concat`: hängt Byte-Folgen aneinander (erst Gesamtlänge bestimmen, dann kopieren).

### 4.6 `app/js/ur.js`

- `BYTEWORDS`: die 256 offiziellen Wörter. `MINIMAL`/`MINIMAL_REVERSE`: Kurzform aus erstem und letztem
  Buchstaben (z. B. "able" → "ae"), in beide Richtungen als Tabelle.
- `CRC_TABLE`/`crc32`: Standard-CRC32. Die Tabelle wird einmal berechnet (8 Schiebe-/XOR-Schritte je Byte-Wert),
  danach kostet jedes Byte nur einen Tabellenzugriff.
- `uint32BE`: Zahl → 4 Bytes, höchstwertiges zuerst.
- `bytewordsEncode`: hängt die CRC32 an und schreibt jedes Byte als 2 Buchstaben.
- `bytewordsDecode`: wandelt zurück, lehnt unbekannte Buchstabenpaare ab und prüft die CRC32.
- `Xoshiro256`: Zufallsgenerator mit festem Startwert. Startwert = SHA-256 der Eingabe, in vier 64-Bit-Zahlen
  zerlegt. `next()` ist der Original-Algorithmus "xoshiro256**" (Multiplikation, Rotation, XOR).
  `nextDouble` teilt durch 2^64, `nextInt` skaliert auf einen Bereich. Sender und Empfänger rechnen so exakt
  dieselben "Zufalls"-Mischungen.
- `RandomSampler`: wählt eine Zahl nach Gewichten (Alias-Methode). Die Reihenfolge der Listen ist absichtlich
  identisch zur Referenz, sonst würden andere Mischungen entstehen.
- `chooseFragments`: Teil 1…n enthalten je genau ein Stück. Ab Teil n+1: Startwert aus Teilnummer und
  Prüfsumme, "Grad" (wie viele Stücke gemischt werden) mit Wahrscheinlichkeit 1/Grad, dann eine gemischte
  Reihenfolge und davon die ersten Grad-Stücke.
- `nominalFragmentLength`: wählt die kleinste Anzahl Stücke, bei der jedes Stück höchstens `maxLen` Bytes hat.
- `xorInto`, `isSubset`, `keyOf`: kleine Hilfen für XOR und Mengen.
- `UREncoder`: zerlegt die CBOR-Nachricht in gleich lange Stücke (das letzte mit Nullen aufgefüllt).
  `nextPart` liefert entweder den einzigen Teil oder `ur:typ/nummer-anzahl/bytewords`. Alles in
  Grossbuchstaben, weil QR-Codes Grossbuchstaben im kompakteren "alphanumerischen" Modus speichern.
- `URDecoder.receive`: prüft das Textformat mit einem regulären Ausdruck, verhindert das Mischen
  verschiedener Typen, dekodiert Bytewords (inkl. CRC), dann das CBOR des Teils. Danach viele Plausibilitäts-
  prüfungen: Zahlen im erlaubten Bereich, Teilnummer im Text = Teilnummer im Inhalt, Stücklänge passt zur
  Nachrichtenlänge, alle Teile gehören zur selben Nachricht. Doppelte Teile (die Animation läuft im Kreis)
  werden übersprungen.
- `URDecoder.addPart`: das Herz des Fountain-Decoders. Bekannte reine Stücke werden aus einem gemischten
  Teil "herausge-XOR-t". Bleibt ein Stück übrig, ist es neu bekannt, und alle gemischten Teile, die es enthalten,
  werden erneut verarbeitet. Zusätzlich werden gemischte Teile, die ganz in anderen stecken, gegenseitig
  vereinfacht.
- `tryFinish`: sind alle Stücke da, werden sie aneinandergereiht, die Auffüll-Nullen abgeschnitten und die
  Prüfsumme der ganzen Nachricht verglichen.
- `progress`: Anteil bekannter Stücke für den Fortschrittsbalken.
- `encodePsbtUR` / `encodeBytesUR`: verpacken eine PSBT (Typ `crypto-psbt`) bzw. eine Textdatei (Typ `bytes`)
  als CBOR-Byte-Folge.

### 4.7 `app/js/keys.js`

- `b58c`: Base58 mit 4-Byte-SHA-256-Prüfsumme, das Format der xpubs. Ein einziges falsches Zeichen fällt auf.
- `HARDENED = 0x80000000`: Pfadschritte ab dieser Zahl sind "gehärtet" (`'`).
- `formatPath` / `parsePath`: Umwandlung zwischen `m/48'/0'/0'/2'` (auch `48h/…`) und Zahlenliste.
  `parsePath` akzeptiert nur Ziffern mit optional `'`, `h` oder `H`.
- `bip32Versions`: @scure/bip32 verlangt Versions-Bytes für öffentliche *und* private Schlüssel;
  der private Wert wird nie benutzt.
- `checkBip48`: genau vier Schritte, alle gehärtet: 48, Münztyp des Netzwerks, beliebiges Konto, 2.
  Die Fehlermeldung sagt, was am Gerät zu wählen ist.
- `serializeXpub`: baut die 78 Bytes einer xpub (Version, Tiefe, Eltern-Fingerabdruck, Index, Chain-Code,
  Schlüssel) – nötig, wenn ein Gerät die Daten als CBOR statt als Text liefert.
- `makeCosigner`: zentrale Prüfung, die *jeder* Schlüssel durchläuft, egal woher er kommt:
  1. Fingerabdruck = genau 8 Hex-Zeichen.
  2. Base58check dekodieren (Prüfsumme), Länge 78.
  3. Versions-Bytes: xpub/Zpub bzw. tpub/Vpub erlaubt. zpub/ypub (Single-Sig) und **jede private Version**
     ergeben eine klare Fehlermeldung.
  4. Pfad prüfen (`checkBip48`).
  5. Version auf die Standardform setzen (Zpub → xpub), damit alle Programme dieselbe Schreibweise sehen.
  6. `HDKey.fromExtendedKey` prüft u. a., dass der Schlüssel ein gültiger Punkt auf der Kurve ist.
  7. Tiefe der xpub = Länge des Pfads und Index = letzter Pfadschritt. So fällt auf, wenn Pfad und
     Schlüssel nicht zusammengehören.
- `parseKeyText`: erkennt `[fingerabdruck/pfad]xpub` (optional mit `/0/*` o. Ä. am Ende). Eine nackte xpub
  ohne Herkunft wird abgelehnt, weil Geräte Fingerabdruck und Pfad zum Signieren brauchen.
- `cosignerFromHdkey`: liest den CBOR-HD-Schlüssel (Feld 2 = privat? → Ablehnung, 3 = Schlüssel,
  4 = Chain-Code, 5 = Netzwerk, 6 = Herkunft mit Pfad und Fingerabdruck, 8 = Eltern-Fingerabdruck),
  baut daraus die xpub und schickt sie durch `makeCosigner`.
- `untag`: entfernt einen erwarteten CBOR-Tag.
- `parseKeyUR`: `crypto-account` (Standard bei SeedSigner und Jade) enthält eine Liste von Skript-Typen;
  gesucht wird `wsh(hdkey)` = Tag 401 um Tag 303. `crypto-hdkey` wird direkt gelesen.
- `assertDistinct`: kein Schlüssel doppelt und **kein Fingerabdruck doppelt** – zwei Schlüssel aus demselben
  Seed würden die Mehrfach-Sicherheit aushebeln.

### 4.8 `app/js/descriptor.js`

- `INPUT_CHARSET`, `CHECKSUM_CHARSET`, `GENERATOR`, `polymod`, `descriptorChecksum`: der Prüfsummen-Algorithmus
  aus BIP380, Zeichen für Zeichen wie in Bitcoin Core. Jedes Zeichen wird in 5 Bits plus eine "Gruppe"
  zerlegt, je drei Gruppen ergeben ein weiteres Symbol. `polymod` ist ein Fehler-erkennender Code (BCH) über
  40-Bit-Zahlen, darum BigInt. Getestet gegen embit und urtypes.
- `buildDescriptor`: setzt pro Schlüssel `[fingerabdruck/48h/0h/0h/2h]xpub/<0;1>/*` zusammen, umschliesst alles
  mit `wsh(sortedmulti(m, …))` und hängt `#prüfsumme` an.
- `parseDescriptor`: Leerraum weg, Prüfsumme (falls vorhanden) **muss** stimmen, ältere Schreibweise `{0,1}`
  wird vereinheitlicht, nur `wsh(sortedmulti(…))` wird akzeptiert, jeder Schlüssel muss auf `/<0;1>/*` oder
  `/0/*` enden und läuft durch `parseKeyText`. Danach Duplikat- und Schwellenwert-Prüfung.
- `buildSetupFile`: Textdatei im Coldcard-Format (Name, Policy, Derivation, Format, dann `FINGERABDRUCK: xpub`).
  Jade registriert die Wallet damit dauerhaft, SeedSigner lädt sie für die Sitzung. Haben die Schlüssel
  unterschiedliche Pfade, steht vor jedem Schlüssel eine eigene `Derivation:`-Zeile.
- `parseSetupFile`: liest dasselbe Format zurück (z. B. Backup-Export einer Jade). Kommentare `#` werden
  übersprungen, `Sorted: False` wird abgelehnt, Schlüssel brauchen vorher eine `Derivation:`, am Ende
  müssen Format P2WSH und Anzahl Schlüssel stimmen.

### 4.9 `app/js/wallet.js`

- `compareBytes`: lexikografischer Vergleich für die BIP67-Sortierung.
- `validateConfig`: prüft eine Konfiguration vollständig (Netzwerk, Name, 2–9 Schlüssel, 1 ≤ m ≤ n) und schickt
  **jeden Schlüssel erneut durch `makeCosigner`**. Das passiert bei jedem Laden aus dem Backup.
- `MultisigWallet` (Konstruktor): prüft die Konfiguration, liest jede xpub als `HDKey` und berechnet einmal die
  beiden Ketten-Knoten `…/0` und `…/1` je Schlüssel. `cache` und `byScript` speichern bereits berechnete
  Adressen (Ableiten kostet Rechenzeit).
- `derive(chain, index)`: prüft Kette (0/1) und Index (nicht gehärtet). Für jeden Mitsignierer wird der
  Schlüssel `…/kette/index` abgeleitet, dann sortiert (BIP67), daraus `p2ms` (das m-von-n-Skript) und `p2wsh`
  (Adresse) gebaut. Mitgegeben werden `bip32Derivation` (Fingerabdruck + vollständiger Pfad je Schlüssel,
  für die PSBT) und `pubkeyOwner` (welcher Schlüssel gehört zu welchem Gerät – für die Signaturprüfung).
- `findByScript`: findet eine eigene, schon abgeleitete Adresse über ihr Skript.
- `scan(api, onProgress)`: für beide Ketten werden Adressen in Fünferblöcken abgefragt. Benutzte Adresse →
  Lücke zurücksetzen, nächsten freien Index merken, bei Guthaben oder offenen Bewegungen die UTXOs holen.
  Nach 20 unbenutzten in Folge ist Schluss. Am Ende werden bestätigtes und unbestätigtes Guthaben addiert.

### 4.10 `app/js/api.js`

- `TXID`, `isCount`: Formatprüfungen für Server-Antworten.
- `normalizeServerUrl`: nur `https://`, keine Zugangsdaten, kein `?` oder `#` in der Adresse.
- `EsploraApi.request`: jede Anfrage mit 20-Sekunden-Zeitlimit (`AbortController`), ohne Cookies
  (`credentials: 'omit'`), ohne Referrer, **ohne Weiterleitungen** (`redirect: 'error'` – ein Server kann
  die App nicht auf einen anderen Server umlenken), ohne Cache. Bei "429 zu viele Anfragen" wird bis zu
  dreimal mit wachsender Pause (1, 2, 4 s) wiederholt.
- `addressInfo`: Anzahl Transaktionen und Saldo einer Adresse; jedes Feld muss eine nicht-negative Ganzzahl sein.
- `addressUtxos`: Liste der Münzen; jede muss gültige txid, Ausgangsnummer, Betrag und Bestätigungsstatus haben.
  Beträge werden BigInt.
- `txBytes`: ganze frühere Transaktion als Bytes. Ob sie stimmt, prüft erst `tx.js` (txid).
- `fees`: Gebührenempfehlung, zuerst im mempool.space-Format, sonst im Esplora-Format.
- `broadcast`: sendet die fertige Transaktion; die Antwort muss eine txid sein.

### 4.11 `app/js/tx.js` – der sicherheitskritische Kern

- `equalBytes`: Byte-genauer Vergleich.
- `varintLen`, `estimateVsize`: Grössenschätzung. Pro Eingang: 41 Bytes Grunddaten (txid, Index, leeres
  scriptSig, Sequenz) plus Witness: Anzahl Elemente, ein leeres "Dummy"-Element (ein historischer Fehler in
  `OP_CHECKMULTISIG` verlangt es), m Signaturen à höchstens 72+1 Bytes und das Skript (3 + 34·n Bytes).
  Ausgänge: 8 Bytes Betrag + Skript. Gewicht = 4·Grunddaten + Witness, vBytes = Gewicht/4 aufgerundet.
  Im Test: geschätzt 294 vB, tatsächlich 293 vB – die Gebühr ist also nie zu tief.
- `feeFor`, `checkFeeRate`: Gebühr in Sats (aufgerundet) und Grenzprüfung.
- `recipientScript`: Adresse → Ausgangsskript über die Bibliothek. Falsches Netzwerk, Tippfehler oder
  ungültige Prüfsumme ergeben "Ungültige Adresse".
- `selectCoins`: nur **bestätigte** Münzen, grösste zuerst. "Alles senden" nimmt alle und zieht die Gebühr ab.
  Sonst wird Münze um Münze hinzugenommen, bis Betrag + Gebühr gedeckt sind. Wäre das Wechselgeld kleiner als
  die Staubgrenze, entfällt es und der kleine Rest geht an die Miner (sonst entstünde ein unbrauchbarer Ausgang).
- `txidOf`: txid selbst berechnen: Transaktion ohne Witness kodieren, zweimal SHA-256, Bytes umdrehen.
- `randomInt`: Zufall aus `crypto.getRandomValues` (kryptografisch sicher).
- `createPsbt`: der Ablauf beim Bauen:
  1. Empfänger prüfen, Münzen wählen.
  2. Für jede Münze: eigene Adresse ableiten, **ganze Vorgänger-Transaktion holen, txid nachrechnen**,
     Ausgang herausnehmen, Skript und Betrag mit der eigenen Adresse bzw. der Server-Angabe vergleichen.
  3. Eingang hinzufügen mit Sequenz für RBF, `witnessUtxo`, `nonWitnessUtxo`, `witnessScript`, `bip32Derivation`.
  4. Empfänger-Ausgang, und bei Bedarf Wechselgeld an die nächste unbenutzte Adresse der Kette 1 – mit
     `witnessScript` und `bip32Derivation`, damit die Geräte es als "eigen" erkennen.
  5. Bei zwei Ausgängen wird die Reihenfolge zufällig gewählt (Beobachter erkennen das Wechselgeld nicht an
     der Position).
  6. PSBT als Bytes erzeugen und **sofort unabhängig mit `analyzePsbt` nachprüfen**: Betrag, Gebühr und
     Wechselgeld müssen exakt dem Plan entsprechen.
- `ownInputAddress`: liest aus dem Pfad eines Eingangs Kette und Index, leitet die Adresse **selbst** neu ab und
  verlangt, dass Skript und witnessScript übereinstimmen.
- `verifyPartialSig`: (1) Der Schlüssel muss einer der eigenen sein, (2) das letzte Byte muss SIGHASH_ALL
  sein, (3) der BIP143-Hash wird mit *unserem* geprüften Betrag berechnet, (4) `secp256k1.verify` prüft die
  DER-Signatur mit low-S-Regel. Rückgabe ist der Fingerabdruck des Geräts.
- `analyzePsbt`: liest eine PSBT komplett und ist die **einzige Quelle für alle Anzeigen**: Jeder Eingang muss
  zur Wallet gehören, eine mitgelieferte Vorgänger-Transaktion muss zur txid und zum Betrag passen, nur
  SIGHASH_ALL, jede vorhandene Teilsignatur wird geprüft. Jeder Ausgang, der behauptet, eigen zu sein, wird
  nachgerechnet; ein Widerspruch heisst "gefälscht". Ergebnis: Summen, Gebühr, geschätzte Grösse, welche Geräte
  alle Eingänge signiert haben und ob jeder Eingang mindestens m Signaturen hat.
- `mergeSignedPsbt`: Die zurückgescannte PSBT muss dieselbe unsignierte Transaktion enthalten. Danach wird jede
  Signatur des Geräts gegen *unsere* Fassung geprüft und nur dann übernommen. Kommt nichts Neues dazu
  (dasselbe Gerät zweimal), gibt es einen Hinweis. Weitere Felder aus der Geräte-PSBT werden ignoriert.
- `finalizePsbt`: nochmals `analyzePsbt`, dann setzt `finalize` die Witness zusammen (leeres Element, Signaturen
  in Skript-Reihenfolge, Skript), `extract` erzeugt die fertige Transaktion. Zur Kontrolle wird sie neu
  eingelesen; die txid muss gleich bleiben.

### 4.12 Kein Speichermodul mehr

Version 1.0.0 hatte `storage.js` (localStorage). Ab Version 1.1.0 gibt es diese Datei nicht mehr.
Warum: Alle Seiten unter derselben Adresse (z. B. alle deine Apps unter `diyrebel.github.io`) teilen sich
localStorage, sessionStorage, IndexedDB und den Cache. Eine fehlerhafte oder bösartige andere App könnte dort
z. B. die xpubs austauschen – dann würden Empfangsadressen einem Angreifer gehören. Ohne gespeicherte Daten
gibt es nichts auszutauschen.

### 4.13 `app/js/qr.js`

- `drawQr`: wählt den alphanumerischen Modus, wenn möglich (kleinerer Code), berechnet den Code, lässt den
  vorgeschriebenen 4-Kästchen-Rand und zeichnet ganzzahlig skalierte Kästchen (scharf auf jedem Bildschirm).
  Mit `size` lässt sich eine feste Breite wählen (für das Backup-Blatt 1000 px).
- `AnimatedQr`: zeigt 4 Bilder pro Sekunde. `setDensity` wählt 60/120/200 Bytes pro Bild – weniger Daten
  heisst grössere Kästchen, was schwächere Kameras (SeedSigner) leichter lesen. `wakeLock` hält den
  Bildschirm wach, solange der Code läuft.
- `QrScanner.start`: fordert die Rückkamera an. Wurde inzwischen abgebrochen, wird die Kamera sofort wieder
  ausgeschaltet (`cancelled`). Nutzt den eingebauten `BarcodeDetector`, wenn der Browser ihn hat (z. B. Chrome
  auf Android), sonst `jsQR`.
- `stop`: schaltet alle Kamera-Spuren wirklich ab.
- `loop`/`detect`: pro Bildschirm-Frame höchstens eine Erkennung gleichzeitig. Für jsQR wird das Bild auf
  höchstens 800 px verkleinert (schneller).
- `handle`: `ur:`-Texte gehen an den `URDecoder` (Fortschritt wird gemeldet), alles andere ist ein einfacher
  Text. Bei einem Fehler (z. B. Bild eines anderen Codes) beginnt der Decoder neu und zeigt die Meldung an.

### 4.14 `app/js/app.js` – die Oberfläche

Grundregel: Kein Text aus fremden Quellen wird als HTML eingefügt, nur über `textContent` oder
`createElement`. So kann ein präparierter Name oder QR-Code keinen Code einschleusen.

- **Zustand `S`**: alles, was die App gerade weiss, an einem Ort – **nur im Arbeitsspeicher**. Dazu gehören die
  geladene Wallet, der Server dieser Sitzung (`server`), die offene Transaktion (`pending`) und `backupOpen`
  (neue Wallet, Backup noch nicht bestätigt).
- **Hilfen**: `fmtSats` (Schweizer Tausender-Apostroph), `fmtBtc` (exakt mit BigInt: ganze BTC und 8 Stellen),
  `groupAddr` (Adresse in 4er-Gruppen zum Vergleichen mit dem Gerät), `shortId`, `utf8`, `toast` (Meldung
  unten, Fehler rot und länger sichtbar), `run` (sperrt eine Taste, solange eine Aktion läuft, und zeigt Fehler
  an), `show` (genau einen Bildschirm zeigen, Animation stoppen, Meldung ausblenden), `fillSummary` (Zeilen der
  Prüf-Ansicht), `copy`, `startAnimation` (animierter QR mit Dichte-Tasten).
- **Scanner**: `scanQr` öffnet das Overlay, startet `QrScanner` und liefert das Ergebnis als Promise;
  "Abbrechen" liefert `null`, "Text einfügen" öffnet `pasteText`.
- **Wallet öffnen**: `serverFor` (Server dieser Sitzung oder Standard), `openWallet(cfg)` (Konfiguration prüfen,
  offene Transaktion und Server zurücksetzen, API verbinden, Testnetz-Plakette, Übersicht, Guthaben laden).
- **Übersicht**: `showHome` zeigt Name, Regel, Descriptor-Prüfsumme, Guthaben und Münzen (oder "–", solange
  noch keine Daten da sind). `renderPendingBanner` zeigt eine offene Transaktion an. `refresh` fragt den Server
  ab, `ensureState` lädt nur, wenn noch nichts da ist.
- **Offene Transaktion**: `getPending`/`setPending` lesen und setzen `S.pending`. Nichts wird gespeichert:
  Wird die App während des Signierens geschlossen, ist die Transaktion weg und muss neu erstellt und signiert
  werden. Darum fragt der Browser vorher nach (siehe `beforeunload`).
- **Einrichtung**: `startSetup` (Standard 2-von-3), `renderPolicy` (Satz mit Warnungen für m = n bzw. m = 1),
  `changeCount` (Grenzen 2–9 und 1 ≤ m ≤ n), `policyNext` (Name prüfen, Plätze anlegen), `renderSlots` (pro
  Schlüssel Bezeichnung, Fingerabdruck, Pfad, Tasten), `addKey` (scannen → `parseKeyUR`/`parseKeyText` →
  Duplikatprüfung), `keysNext` (Wallet probeweise bauen, Zusammenfassung und erste Adresse zeigen),
  `createWallet` (Wallet öffnen, `backupOpen` setzen, Registrierung zeigen).
- **Registrieren und Backup**: `showRegister` zeigt die Setup-Datei als animierten Wallet-QR, den Descriptor,
  die Prüfsumme und die Tasten Drucken/Kopieren/Speichern/als QR. Bei der Ersteinrichtung muss das Häkchen
  "Backup gedruckt oder gespeichert" gesetzt werden, erst dann ist `backupOpen` erledigt.
  `keyLines` listet Fingerabdruck, Pfad und Bezeichnung jedes Schlüssels. `downloadBackup` speichert eine
  Textdatei (Regel, Schlüssel, Descriptor, Setup-Datei mit Name). `printBackup` zeichnet den Descriptor als
  QR-Code mit Fehlerkorrektur M in 1000 px, setzt ihn als Bild ins Backup-Blatt (Bilder drucken zuverlässiger
  als Canvas), füllt Name, Regel, Netzwerk, Datum, Prüfsumme, Schlüssel und Anleitung (alles über
  `textContent`) und öffnet den Druckdialog.
- **Wallet laden**:
  - `detectNetwork`: xpub/Zpub im Text = Mainnet, tpub/Vpub = Testnetz, nichts oder gemischt = Fehler.
  - `walletFromText`: sucht im Text die Descriptor-Zeile (sie enthält keine Leerzeichen, darum funktioniert
    das auch mitten in der Backup-Datei). Gibt es keine, wird der Text als Setup-Datei gelesen. Der Name kommt
    aus dem Formular, sonst aus einer `Name:`-Zeile, sonst "Multisig" (ein Descriptor selbst enthält keinen Namen).
  - `loadFromText`: Mainnet wird sofort geöffnet. Bei Testnetz-Schlüsseln erscheint das Formular, weil
    Testnet4 und Signet gleich aussehende Schlüssel haben und nur der Mensch weiss, welches gemeint ist.
  - `qrToText`: normaler QR → Text; animierte Setup-Datei (UR `bytes`) → Text.
  - `scanBackup` (Taste "Backup-QR scannen"), `openBackupFile` (Taste "Backup-Datei öffnen", höchstens 100 KB),
    `restoreScan`, `guessNetwork` und `restoreGo` (Formular "Descriptor einfügen").
  - `closeWallet`: entfernt alles aus dem Arbeitsspeicher (fragt nach, wenn eine Transaktion offen ist).
- **Empfangen**: `showReceive` und `renderReceive` zeigen die erste unbenutzte Adresse als BIP21-QR in
  Grossbuchstaben. `receiveNext` blättert weiter, aber höchstens 20 Adressen im Voraus.
- **Senden**: `showSend` (bei offener Transaktion direkt zum Signieren, Formular leeren, Gebühren laden),
  `parseAmount` (BTC mit höchstens 8 Nachkommastellen oder ganze Sats, Komma und Apostroph erlaubt, exakt mit
  `Decimal.decode`), `toggleUnit`, `chosenFeeRate`, `scanRecipient` (liest BIP21 inkl. Betrag, wandelt
  QR-Grossschreibung zurück), `sendNext` (prüfen und `createPsbt`), `showReview` (alles aus `analyzePsbt`:
  Empfänger, Betrag, Gebühr mit sat/vB und Prozent, Wechselgeld, Total, txid; Warnungen für hohe Gebühr,
  eigene Adresse, Testnetz), `toSign` (PSBT als offene Transaktion übernehmen).
- **Signieren**: `showSign` (Status je Gerät, animierter PSBT-QR; sind genug Signaturen da, direkt weiter),
  `scanSignature` (UR `crypto-psbt` oder Base64-PSBT annehmen und über `mergeSignedPsbt` prüfen),
  `cancelPending` (mit Rückfrage verwerfen).
- **Senden ins Netz**: `showBroadcast` finalisiert, zeigt die Zusammenfassung und sendet erst auf Tastendruck.
  Meldet der Server eine andere txid, gibt es eine Warnung. Danach Erfolgsseite mit Explorer-Link und
  automatischem Neuladen des Guthabens.
- **Einstellungen**: `showSettings`, `saveServer` (Adresse prüfen, Testabfrage, für diese Sitzung übernehmen).
- **`bind`**: verbindet alle Tasten mit ihren Funktionen. Das versteckte Datei-Feld wird nach jeder Auswahl
  geleert, damit dieselbe Datei erneut gewählt werden kann. "Zurück"/"Abbrechen" verwirft eine angefangene
  Einrichtung.
- **`removeLegacyData`**: löscht den Speichereintrag von Version 1.0.0, meldet deren Service Worker ab (nur
  den im Ordner dieser App) und löscht deren Cache (nur Namen mit `diy-multisig-`). Fremde Daten anderer Apps
  werden nicht angerührt.
- **`beforeunload`**: Solange eine Transaktion offen ist, eine Einrichtung läuft oder das Backup einer neuen
  Wallet noch nicht bestätigt ist, fragt der Browser vor dem Schliessen oder Neuladen nach.
- **Start**: Tasten verbinden, Altlasten löschen, Startbildschirm zeigen. Es wird nie automatisch eine Wallet
  geöffnet, weil keine gespeichert ist.

### 4.15 `app/sw.js` und `app/manifest.webmanifest`

Die App registriert keinen Service Worker mehr. Der Grund: Sein Offline-Cache liegt im gemeinsamen Speicher der
Adresse. Eine andere App unter derselben Adresse könnte dort eine veränderte `app.js` ablegen, und der Service
Worker würde sie bei jedem Start ausliefern – eine dauerhafte, unsichtbare Manipulation.

`sw.js` existiert nur noch als "Abschalter" für Browser, die Version 1.0.0 installiert haben: Prüft so ein
Browser auf Updates, lädt er diese Datei. Sie aktiviert sich sofort (`skipWaiting`), löscht die eigenen Caches,
meldet sich ab (`unregister`) und lädt offene Fenster neu – danach läuft die App ohne Service Worker.

Das Manifest beschreibt Name, Farben und Icons. "Zum Home-Bildschirm hinzufügen" funktioniert weiterhin; die App
startet aber nicht mehr offline (ohne Internet ist ohnehin kein Guthaben abrufbar).

---

## 5. Was die Tests beweisen – und was nicht

| Test | Ergebnis |
|---|---|
| `ur.test.mjs` | 186 UR-Teile (auch gemischte) sind Zeichen für Zeichen identisch mit der Referenz-Bibliothek @ngraveio/bc-ur. Der Decoder setzt Nachrichten auch bei vielen fehlenden Bildern zusammen. CRC32-Testvektor aus dem Standard. |
| `interop.test.mjs` (Mainnet und Testnet4) | Schlüssel-Export im SeedSigner-Format (Text und UR) wird korrekt gelesen. Adressen (je 6 Empfang/Wechselgeld) und Descriptor-Prüfsumme sind identisch mit embit (der Bibliothek, die SeedSigner nutzt). Der **originale SeedSigner-Code** liest den Wallet-QR, erkennt Betrag, Gebühr und Wechselgeld (Wechselgeld als "eigen" verifiziert) und signiert. Zwei Geräte signieren unabhängig, die App führt zusammen und finalisiert. Die fertige Transaktion wird von python-bitcointx (unabhängiger Skript-Interpreter mit Standardregeln) als gültig bestätigt. Manipulierte Signatur, fremde Transaktion, falsche Vorgänger-Transaktion, zu hohe Gebühr, falsches Netzwerk, privater Schlüssel, Duplikate und Tippfehler im Descriptor werden abgelehnt. |
| `ui.test.mjs` | Ganzer Ablauf im echten Chrome auf Handy-Grösse: Einrichten (ein Schlüssel über die **Kamera** als animierter QR), Backup-Blatt (der gedruckte QR-Code wird wieder eingelesen und muss exakt den Descriptor enthalten), Guthaben, Empfangen, Senden. Die PSBT wird direkt **vom animierten QR auf dem Bildschirm** abgelesen und vom SeedSigner-Code signiert. Danach: localStorage, sessionStorage, IndexedDB, Cache und Service Worker sind **leer**. Nach dem Neuladen ist die Wallet weg und lässt sich aus dem Backup wieder laden (gleiche Prüfsumme). Keine Konsolen- oder CSP-Fehler. |
| `ui-restore.test.mjs` | Laden aus der Setup-Datei, die Jade in ihrem eigenen Selbsttest verwendet (Name wird übernommen); Laden aus einer Backup-Datei mit Descriptor; Tippfehler in der Prüfsumme wird abgelehnt; Wallet schliessen; Dunkelmodus. |

**Nicht getestet:** echte SeedSigner- und Jade-Hardware, echte Handy-Kameras, das echte Bitcoin-Netzwerk.
Die Jade-Formate (Setup-Datei als UR `bytes`, `crypto-account`, `crypto-psbt`) wurden aus dem Jade-Quellcode
übernommen, aber nicht mit einem Gerät ausprobiert.

---

## 6. Bekannte Grenzen und Empfehlungen

1. **Kein externes Audit.** Erste Transaktionen auf Mainnet nur mit kleinen Beträgen. Am einfachsten mit
   "Erweitert → Netzwerk: Signet/Testnet4" alles einmal durchspielen (Geräte dafür auf Testnet stellen).
2. **Privatsphäre:** mempool.space sieht alle Adressen. Für mehr Privatsphäre eigene mempool-Instanz (z. B. auf
   einem eigenen Node) in den Einstellungen eintragen.
3. **Gemeinsame Adresse:** Der Modus ohne Speichern verhindert dauerhafte Manipulation durch andere Apps unter
   `diyrebel.github.io`. Eine andere App, die *gleichzeitig* offen ist, könnte aber in die laufende Seite
   eingreifen. Darum Adressen und Beträge immer am Signiergerät prüfen.
4. **Offene Transaktion geht beim Schliessen verloren.** Signieren mit mehreren Geräten in einem Zug erledigen.
   Der Browser warnt vor dem Schliessen.
5. **Eigener Server** gilt nur für die Sitzung und muss nach jedem Start neu eingetragen werden.
6. **Name:** Ein Descriptor enthält keinen Namen. Wird aus dem Backup-QR geladen, heisst die Wallet "Multisig";
   aus der Backup-Datei wird der Name übernommen. Geräte-Bezeichnungen stehen nur auf dem Backup-Blatt.
7. **Unbestätigte Münzen** werden nicht ausgegeben (bewusst, einfacher und sicherer).
8. **Gebühr erhöhen (RBF)** ist vorbereitet (Sequenz-Wert), aber noch nicht als Funktion eingebaut.
9. **Kein Transaktionsverlauf**, nur aktuelle Münzen.
10. **SeedSigner und unterschiedliche Konten:** Haben die Schlüssel verschiedene Kontonummern im Pfad
   (z. B. `…/0'/2'` und `…/1'/2'`), kann SeedSigner das Wechselgeld nicht verifizieren (SeedSigner liest aus der
   Setup-Datei nur einen Pfad). Signieren funktioniert trotzdem. Empfehlung: überall Konto 0.
11. **BitBox** und andere Geräte ohne Kamera lassen sich in diesem QR-Ablauf nicht einbinden.
