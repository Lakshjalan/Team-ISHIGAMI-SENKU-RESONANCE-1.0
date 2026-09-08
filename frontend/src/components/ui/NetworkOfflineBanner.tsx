import { useState, useEffect } from 'react';
import MaterialIcon from '../icons/MaterialIcon';

export default function NetworkOfflineBanner() {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showReconnected, setShowReconnected] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  if (!isOnline) {
    return (
      <div className="fixed top-16 left-0 right-0 z-40 bg-[#93000a] text-[#ffdad6] px-4 py-2 text-xs font-['Geist'] flex items-center justify-center gap-2 shadow-lg border-b border-[#ffb4ab]/30 animate-in slide-in-from-top duration-300">
        <MaterialIcon name="wifi_off" size={16} className="text-[#ffb4ab] animate-pulse" />
        <span className="font-semibold">Offline Mode:</span>
        <span>Network connection lost. Running on cached entity states and local memory.</span>
      </div>
    );
  }

  if (showReconnected) {
    return (
      <div className="fixed top-16 left-0 right-0 z-40 bg-emerald-950 text-emerald-300 px-4 py-2 text-xs font-['Geist'] flex items-center justify-center gap-2 shadow-lg border-b border-emerald-500/40 animate-in slide-in-from-top duration-300">
        <MaterialIcon name="wifi" size={16} className="text-emerald-400" />
        <span className="font-semibold">Reconnected:</span>
        <span>Live link restored. Synchronizing state with Supabase &amp; Reconcile Mesh.</span>
      </div>
    );
  }

  return null;
}
