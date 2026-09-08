// Give the service worker access to Firebase Messaging.
// Note: We use compat libraries inside the service worker.
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

// Parse config from query string if passed during registration
const urlParams = new URLSearchParams(location.search);
const firebaseConfig = {
  apiKey: urlParams.get('apiKey') || '',
  authDomain: urlParams.get('authDomain') || '',
  projectId: urlParams.get('projectId') || '',
  storageBucket: urlParams.get('storageBucket') || '',
  messagingSenderId: urlParams.get('messagingSenderId') || '',
  appId: urlParams.get('appId') || ''
};

if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  // Background message handler (runs when tab is CLOSED or minimized)
  messaging.onBackgroundMessage((payload) => {
    const title = payload.notification?.title || '🔔 New Review Assignment';
    const options = {
      body: payload.notification?.body || 'You have new conflict records assigned to you.',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
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
