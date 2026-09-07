import React from 'react';

interface SkeletonLoaderProps {
  rows?: number;
  variant?: 'card' | 'table' | 'metric';
}

export default function SkeletonLoader({ rows = 4, variant = 'card' }: SkeletonLoaderProps) {
  if (variant === 'metric') {
    return (
      <div className="bg-surface-container-low rounded-3xl p-8 animate-pulse">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-5 h-5 bg-surface-container-highest rounded-full" />
          <div className="h-3 w-24 bg-surface-container-highest rounded-full" />
        </div>
        <div className="h-12 w-32 bg-surface-container-highest rounded-full mb-4" />
        <div className="h-1.5 w-full bg-surface-container-highest rounded-full" />
        <div className="flex justify-between mt-6">
          <div className="h-3 w-20 bg-surface-container-highest rounded-full" />
          <div className="h-3 w-28 bg-surface-container-highest rounded-full" />
        </div>
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className="bg-surface-container-low rounded-3xl p-6 animate-pulse">
        <div className="flex gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-3 flex-1 bg-surface-container-highest rounded-full" />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-4 border-t border-outline-variant/20">
            <div className="w-8 h-8 bg-surface-container-highest rounded-full" />
            <div className="h-3 flex-1 bg-surface-container-highest rounded-full" />
            <div className="h-3 w-20 bg-surface-container-highest rounded-full" />
            <div className="h-6 w-16 bg-surface-container-highest rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-surface-container-low rounded-3xl p-8 animate-pulse space-y-4">
      <div className="h-4 w-3/4 bg-surface-container-highest rounded-full" />
      <div className="h-3 w-full bg-surface-container-highest rounded-full" />
      <div className="h-3 w-5/6 bg-surface-container-highest rounded-full" />
      <div className="h-3 w-2/3 bg-surface-container-highest rounded-full" />
    </div>
  );
}
