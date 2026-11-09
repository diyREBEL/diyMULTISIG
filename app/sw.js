// sw.js – NUR noch zum Aufräumen. Version 1.0.0 hatte einen Service Worker mit Offline-Cache.
// Dieser Cache liegt im gemeinsamen Speicher der Adresse und könnte von einer anderen App unter
// derselben Adresse manipuliert werden. Darum: Hat ein Browser die alte Version noch installiert,
// lädt er bei der nächsten Update-Prüfung diese Datei, löscht damit den Cache und meldet sich ab.
// Die aktuelle App registriert keinen Service Worker mehr.
self.addEventListener('install', () => self.skipWaiting());                  // sofort aktiv werden
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();                                          // alle Cache-Namen
    await Promise.all(keys.filter((k) => k.startsWith('diy-multisig-')).map((k) => caches.delete(k))); // eigene löschen
    await self.registration.unregister();                                      // Service Worker abmelden
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach((c) => c.navigate(c.url));                                 // offene Fenster neu laden (ohne Cache)
  })());
});
