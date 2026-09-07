import React from 'react';
import MaterialIcon from '../icons/MaterialIcon';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="bg-surface-container-low rounded-3xl p-12 flex flex-col items-center text-center gap-5">
      <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center">
        <MaterialIcon name={icon} size={32} className="text-on-surface-variant" />
      </div>
      <h3 className="font-['Libre_Caslon_Text'] text-2xl font-semibold text-primary">{title}</h3>
      <p className="font-['Geist'] text-base text-on-surface-variant max-w-md">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-2 h-11 px-6 bg-primary text-on-primary rounded-full font-['Geist'] text-xs font-semibold uppercase tracking-wider hover:bg-primary-fixed transition-colors flex items-center gap-2"
        >
          {actionLabel}
          <MaterialIcon name="arrow_forward" size={16} />
        </button>
      )}
    </div>
  );
}
