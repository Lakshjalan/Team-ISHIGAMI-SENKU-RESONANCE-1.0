import { useEffect } from 'react';
import MaterialIcon from '../icons/MaterialIcon';

export interface ToastProps {
  message: string | null;
  variant?: 'success' | 'error' | 'info' | string;
  onDismiss?: () => void;
  onClose?: () => void;
}

export default function Toast({ message, onDismiss, onClose }: ToastProps) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      if (onDismiss) onDismiss();
      if (onClose) onClose();
    }, 3500);

    return () => clearTimeout(timer);
  }, [message, onDismiss, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] transition-all duration-300 translate-y-0 opacity-100">
      <div className="flex items-center gap-3 px-6 py-3.5 bg-white text-[#131313] rounded-full shadow-2xl font-['Geist'] text-sm font-semibold border border-[#e2e2e2]">
        <MaterialIcon name="check_circle" size={18} />
        <span>{message}</span>
      </div>
    </div>
  );
}
