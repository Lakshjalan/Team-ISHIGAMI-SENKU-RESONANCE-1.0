// Give the service worker access to Firebase Messaging.
// Note: We use compat libraries inside the service worker.
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

// Parse config from query string if passed during registration
const urlParams = new URLSearchParams(location.search);
const cleanParam = (val) => (val ? val.replace(/^["']|["']$/g, '').trim() : '');
const firebaseConfig = {
  apiKey: cleanParam(urlParams.get('apiKey')),
  authDomain: cleanParam(urlParams.get('authDomain')),
  projectId: cleanParam(urlParams.get('projectId')),
  storageBucket: cleanParam(urlParams.get('storageBucket')),
  messagingSenderId: cleanParam(urlParams.get('messagingSenderId')),
  appId: cleanParam(urlParams.get('appId'))
};

if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  // Background message handler (runs when tab is CLOSED or minimized)
  messaging.onBackgroundMessage((payload) => {
    const title = payload.notification?.title || '🔔 New Review Assignment';
    const options = {
      body: payload.notification?.body || 'You have new conflict records assigned to you.',
      icon: '/favicon.png',
      badge: '/favicon.png',
      data: {
        url: payload.data?.url || '/conflict-triage'
      }
    };

    self.registration.showNotification(title, options);
  });
}

// Notification click behavior: open or focus the review queue
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes('conflict-triage') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
