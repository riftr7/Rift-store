// No caching for offline use - always fetch from network
self.addEventListener('install', event => {
  // Skip waiting to activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  // Claim all clients
  event.waitUntil(self.clients.claim());
});

// Fetch event: if offline, show offline message
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      // If fetch fails (offline), return offline message
      return new Response(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Offline - Rift</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #0d0a1a; color: #e2e8f0; }
            h1 { color: #ef4444; }
          </style>
        </head>
        <body>
          <h1>You are offline</h1>
          <p>Connect to the internet to use Rift.</p>
        </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' }
      });
    })
  );
});
