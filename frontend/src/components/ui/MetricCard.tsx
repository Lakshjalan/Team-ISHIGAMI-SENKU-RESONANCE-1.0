import React from 'react';
import MaterialIcon from '../icons/MaterialIcon';

interface MetricCardProps {
  icon: string;
  label: string;
  value: string;
  badge?: string;
  badgeVariant?: 'default' | 'filled';
  footerLeft: string;
  footerRight: string;
  progress?: number;
}

export default function MetricCard({ icon, label, value, badge, badgeVariant = 'default', footerLeft, footerRight, progress }: MetricCardProps) {
  return (
    <div className="bg-surface-container-low rounded-3xl p-8 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:bg-surface-container transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MaterialIcon name={icon} size={20} className="text-primary" />
          <span className="font-['Geist'] text-xs font-semibold text-on-surface-variant uppercase tracking-[0.1em]">{label}</span>
        </div>
        {badge && (
          <span className={`px-2.5 py-0.5 rounded-full font-['Geist'] text-xs font-semibold ${
            badgeVariant === 'filled'
              ? 'bg-primary text-on-primary tracking-wider'
              : 'bg-surface-container-highest text-primary'
          }`}>
            {badge}
          </span>
        )}
      </div>
      <div className="my-6">
        <span className="font-['Libre_Caslon_Text'] text-5xl font-bold text-primary">{value}</span>
        {progress !== undefined && (
          <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden mt-4">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}
        {progress === undefined && (
          <div className="mt-4 flex items-end gap-1 h-3 w-full">
            {[1, 2, 1.5, 2.5, 2, 3].map((h, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t-sm ${i === 5 ? 'bg-primary' : 'bg-surface-container-highest'}`}
                style={{ height: `${h * 4}px` }}
              />
            ))}
          </div>
        )}
      </div>
      <div className="pt-4 flex items-center justify-between text-on-surface-variant font-['Geist'] text-xs font-semibold uppercase tracking-wider">
        <span>{footerLeft}</span>
        <span className="text-primary flex items-center gap-1">
          {progress !== undefined && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
          {footerRight}
        </span>
      </div>
    </div>
  );
}
