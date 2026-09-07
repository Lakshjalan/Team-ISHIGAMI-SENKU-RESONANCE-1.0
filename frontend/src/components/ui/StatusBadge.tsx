import React from 'react';

interface StatusBadgeProps {
  label: string;
  variant?: 'high' | 'medium' | 'low' | 'neutral' | 'filled';
}

export default function StatusBadge({ label, variant = 'neutral' }: StatusBadgeProps) {
  const classes = {
    high: 'bg-surface-container-highest text-primary',
    medium: 'bg-surface-container-high text-on-surface-variant',
    low: 'bg-surface-container text-on-surface-variant',
    neutral: 'bg-surface-container-highest text-on-surface-variant',
    filled: 'bg-primary text-on-primary',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-['Geist'] text-xs font-semibold uppercase tracking-wider ${classes[variant]}`}>
      {label}
    </span>
  );
}
