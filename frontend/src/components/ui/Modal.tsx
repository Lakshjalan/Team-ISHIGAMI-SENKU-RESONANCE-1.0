import React from 'react';
import MaterialIcon from '../icons/MaterialIcon';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      {/* Dialog */}
      <div
        className="relative bg-surface-container rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between px-8 pt-8 pb-4">
            <h2 className="font-['Libre_Caslon_Text'] text-2xl font-semibold text-primary">{title}</h2>
            <button onClick={onClose} className="text-on-surface-variant hover:text-primary transition-colors">
              <MaterialIcon name="close" size={24} />
            </button>
          </div>
        )}
        <div className="px-8 pb-8">
          {children}
        </div>
      </div>
    </div>
  );
}
