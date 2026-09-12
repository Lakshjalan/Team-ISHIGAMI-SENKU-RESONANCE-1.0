import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, onMessage, type MessagePayload } from 'firebase/messaging';

const cleanVal = (val?: string) => (val ? val.replace(/^["']|["']$/g, '').trim() : '');

const firebaseConfig = {
  apiKey: cleanVal(import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: cleanVal(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: cleanVal(import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: cleanVal(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: cleanVal(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: cleanVal(import.meta.env.VITE_FIREBASE_APP_ID),
};

// Initialize Firebase client instance
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

/**
 * Request notification permissions and register service worker
 */
export async function requestFCMToken(): Promise<string | null> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.warn('Push notifications are not supported in this browser environment.');
    return null;
  }

  const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
  if (!vapidKey || vapidKey === 'PASTE_YOUR_PUBLIC_VAPID_KEY_HERE') {
    console.warn('VITE_FIREBASE_VAPID_KEY is not configured in .env');
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Notification permission was not granted by user.');
      return null;
    }

    // Pass Firebase credentials into the service worker via query string
    const swParams = new URLSearchParams({
      apiKey: firebaseConfig.apiKey || '',
      authDomain: firebaseConfig.authDomain || '',
      projectId: firebaseConfig.projectId || '',
      storageBucket: firebaseConfig.storageBucket || '',
      messagingSenderId: firebaseConfig.messagingSenderId || '',
      appId: firebaseConfig.appId || '',
    }).toString();

    const registration = await navigator.serviceWorker.register(
      `/firebase-messaging-sw.js?${swParams}`
    );

    const messaging = getMessaging(app);
    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration,
    });

    return token || null;
  } catch (error) {
    console.error('Failed to retrieve FCM device token:', error);
    return null;
  }
}

/**
 * Listen for push notifications while the app tab IS actively open (foreground)
 */
export function listenToForegroundMessages(onMessageReceived: (payload: MessagePayload) => void) {
  try {
    const messaging = getMessaging(app);
    return onMessage(messaging, (payload: MessagePayload) => {
      onMessageReceived(payload);
    });
  } catch (error) {
    console.error('Error attaching foreground message listener:', error);
    return () => {};
  }
}
