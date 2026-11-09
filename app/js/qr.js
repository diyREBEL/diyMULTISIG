// qr.js – QR-Codes anzeigen (auch animiert) und mit der Kamera scannen.
import { qrcode, jsQR } from '../lib/vendor.js';            // Erzeugen bzw. Erkennen von QR-Codes
import { URDecoder } from './ur.js';                          // setzt animierte UR-Teile zusammen

const ALNUM = /^[0-9A-Z $%*+\-./:]*$/;                        // Zeichen des kompakten QR-Modus "alphanumerisch"

// Zeichnet einen QR-Code in ein <canvas>. Fehlerkorrektur "L" = maximale Datenmenge pro Bild.
// size: gewünschte Breite in Pixeln (0 = Breite des Elements auf dem Bildschirm).
export function drawQr(canvas, text, ecc = 'L', size = 0) {
  const qr = qrcode(0, ecc);                                  // 0 = Grösse automatisch wählen
  qr.addData(text, ALNUM.test(text) ? 'Alphanumeric' : 'Byte'); // passenden Modus wählen
  qr.make();                                                  // Muster berechnen
  const modules = qr.getModuleCount();                        // Kästchen pro Seite
  const quiet = 4;                                            // weisser Rand (vom Standard verlangt)
  const total = modules + quiet * 2;
  const cssSize = size || canvas.clientWidth || 300;          // gewünschte bzw. angezeigte Grösse
  const scale = Math.max(2, Math.floor((cssSize * (window.devicePixelRatio || 1)) / total)); // scharfe Pixel
  canvas.width = canvas.height = total * scale;               // Auflösung setzen
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';                                     // Hintergrund weiss
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#000';                                     // Kästchen schwarz
  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      if (qr.isDark(r, c)) ctx.fillRect((c + quiet) * scale, (r + quiet) * scale, scale, scale);
    }
  }
}

// Zeigt eine Folge von QR-Codes (UR-Teile) in einer Schleife an.
export class AnimatedQr {
  // makeEncoder(maxFragmentLen) liefert einen UREncoder; density: 0 = wenig, 1 = mittel, 2 = viel Daten pro Bild
  constructor(canvas, makeEncoder, density = 1) {
    this.canvas = canvas;
    this.makeEncoder = makeEncoder;
    this.timer = null;                                        // Intervall-Handle
    this.wakeLock = null;                                     // hält den Bildschirm wach
    this.setDensity(density);
  }
  setDensity(level) {
    this.density = level;
    this.encoder = this.makeEncoder([60, 120, 200][level]);   // Bytes pro Bild
    if (this.timer) this.start();                             // läuft schon → neu starten
  }
  start() {
    this.stop();                                              // alte Animation beenden
    const show = () => drawQr(this.canvas, this.encoder.nextPart()); // nächstes Bild zeichnen
    show();
    if (!this.encoder.isSinglePart) this.timer = setInterval(show, 250); // 4 Bilder pro Sekunde
    navigator.wakeLock?.request('screen').then((l) => { this.wakeLock = l; }).catch(() => {}); // Bildschirm anlassen
  }
  stop() {
    clearInterval(this.timer);
    this.timer = null;
    this.wakeLock?.release().catch(() => {});
    this.wakeLock = null;
  }
}

// Kamera-Scanner. Ruft onResult({ kind: 'ur', type, cbor } | { kind: 'text', text }) genau einmal auf.
export class QrScanner {
  constructor(video, onProgress, onResult, onError) {
    this.video = video;                                       // <video>-Element für das Kamerabild
    this.onProgress = onProgress;                             // Fortschritt 0…1
    this.onResult = onResult;                                 // fertiges Ergebnis
    this.onError = onError;                                   // Fehlermeldung (Scan läuft weiter)
    this.canvas = document.createElement('canvas');          // Hilfsfläche für jsQR
    this.decoder = new URDecoder();                           // sammelt animierte Teile
    this.running = false;
    this.cancelled = false;                                   // wurde stop() schon aufgerufen?
    this.busy = false;                                        // verhindert überlappende Erkennungen
    this.lastError = '';
  }

  async start() {
    if (!navigator.mediaDevices?.getUserMedia) throw new Error('Kamera nicht verfügbar (nur über https möglich)');
    const stream = await navigator.mediaDevices.getUserMedia({ // Rückkamera bevorzugen
      video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false,
    });
    if (this.cancelled) { stream.getTracks().forEach((t) => t.stop()); return; } // inzwischen abgebrochen → Kamera gleich aus
    this.stream = stream;
    this.video.srcObject = this.stream;
    this.video.setAttribute('playsinline', '');               // iPhone: nicht im Vollbild öffnen
    await this.video.play();
    if ('BarcodeDetector' in window) {                        // eingebauter Detektor (schneller), falls vorhanden
      try {
        const formats = await window.BarcodeDetector.getSupportedFormats();
        if (formats.includes('qr_code')) this.detector = new window.BarcodeDetector({ formats: ['qr_code'] });
      } catch { this.detector = null; }
    }
    if (this.cancelled) { this.stop(); return; }              // Abbruch während des Starts
    this.running = true;
    this.loop();
  }

  stop() {
    this.cancelled = true;                                    // auch ein noch laufendes start() beenden
    this.running = false;
    this.stream?.getTracks().forEach((t) => t.stop());        // Kamera wirklich ausschalten
    this.video.srcObject = null;
  }

  loop() {
    if (!this.running) return;
    requestAnimationFrame(() => this.loop());                 // nächstes Bild einplanen
    if (this.busy || this.video.readyState < 2) return;       // noch kein Bild oder noch beschäftigt
    this.busy = true;
    this.detect().then((texts) => texts.forEach((t) => this.handle(t))).catch(() => {}).finally(() => { this.busy = false; });
  }

  async detect() {
    if (this.detector) return (await this.detector.detect(this.video)).map((c) => c.rawValue);
    const vw = this.video.videoWidth;
    const vh = this.video.videoHeight;
    const scale = Math.min(1, 800 / Math.max(vw, vh));        // auf max. 800 px verkleinern (schneller)
    this.canvas.width = Math.round(vw * scale);
    this.canvas.height = Math.round(vh * scale);
    const ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
    const img = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const code = jsQR(img.data, img.width, img.height, { inversionAttempts: 'dontInvert' });
    return code ? [code.data] : [];
  }

  handle(text) {
    if (!this.running || !text) return;
    try {
      if (/^ur:/i.test(text)) {                               // animierter oder einzelner UR-Code
        this.decoder.receive(text);
        this.onProgress(this.decoder.progress);
        if (this.decoder.result) {
          this.stop();
          this.onResult({ kind: 'ur', type: this.decoder.type, cbor: this.decoder.result });
        }
      } else {                                                // normaler QR-Code mit Text
        this.stop();
        this.onResult({ kind: 'text', text });
      }
    } catch (e) {
      this.decoder = new URDecoder();                         // bei Fehlern neu beginnen
      if (e.message !== this.lastError) this.onError(e.message);
      this.lastError = e.message;
    }
  }
}
