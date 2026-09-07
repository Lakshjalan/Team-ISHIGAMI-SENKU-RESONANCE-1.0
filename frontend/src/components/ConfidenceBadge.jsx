import React from 'react';

/**
 * ConfidenceBadge component
 * Displays deterministic and probabilistic confidence scores with color-coded triage bands:
 * - Green (>= 0.90): High Confidence / Auto-Merged
 * - Amber (0.60 - 0.89): Ambiguous / Requires Human Review
 * - Red (< 0.60): Low Confidence / Distinct Entity
 */
export default function ConfidenceBadge({ score = 0, triageBand, showLabel = true, size = 'md' }) {
  // Normalize score to 0..1 scale if given as percentage 0..100
  const normalizedScore = score > 1 ? score / 100 : score;
  const percentage = Math.round(normalizedScore * 100);

  let band = triageBand;
  if (!band) {
    if (normalizedScore >= 0.90) band = 'high';
    else if (normalizedScore >= 0.60) band = 'ambiguous';
    else band = 'low';
  }

  const styles = {
    high: {
      bg: 'bg-[#22c55e]/10',
      border: 'border-[#22c55e]/30',
      text: 'text-[#4ade80]',
      dot: 'bg-[#22c55e]',
      label: 'HIGH CONFIDENCE',
      status: 'AUTO-MERGED',
    },
    ambiguous: {
      bg: 'bg-[#eab308]/10',
      border: 'border-[#eab308]/30',
      text: 'text-[#facc15]',
      dot: 'bg-[#eab308] animate-pulse',
      label: 'AMBIGUOUS',
      status: 'REVIEW REQUIRED',
    },
    low: {
      bg: 'bg-[#ef4444]/10',
      border: 'border-[#ef4444]/30',
      text: 'text-[#f87171]',
      dot: 'bg-[#ef4444]',
      label: 'LOW CONFIDENCE',
      status: 'DISTINCT / FLAGGED',
    },
  }[band] || styles.high;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1.5',
    md: 'px-2.5 py-1 text-xs gap-2',
    lg: 'px-3 py-1.5 text-sm gap-2.5',
  }[size] || sizeClasses.md;

  return (
    <span
      className={`inline-flex items-center rounded-full font-mono font-medium border ${styles.bg} ${styles.border} ${styles.text} ${sizeClasses}`}
      title={`Match Confidence: ${(normalizedScore * 100).toFixed(1)}% (${styles.status})`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
      <span>{percentage}%</span>
      {showLabel && (
        <span className="opacity-75 tracking-wider uppercase text-[10px]">
          · {styles.label}
        </span>
      )}
    </span>
  );
}
