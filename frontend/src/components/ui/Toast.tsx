import { useEffect, useState } from 'react';
import MaterialIcon from '../icons/MaterialIcon';

export interface ToastProps {
  message: string | null;
  variant?: 'success' | 'error' | 'info' | string;
  onDismiss?: () => void;
  onClose?: () => void;
}

export default function Toast({ message, onDismiss, onClose }: ToastProps) {
  const [visible, setVisible] = useState(false);
  const handleDismiss = onDismiss || onClose || (() => {});

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(handleDismiss, 300);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!message) return null;

  return (
    <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] transition-all duration-300 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'}`}>
      <div className="flex items-center gap-3 px-6 py-3.5 bg-primary text-on-primary rounded-full shadow-2xl font-['Geist'] text-sm font-medium">
        <MaterialIcon name="check_circle" size={18} />
        <span>{message}</span>
      </div>
    </div>
  );
}
