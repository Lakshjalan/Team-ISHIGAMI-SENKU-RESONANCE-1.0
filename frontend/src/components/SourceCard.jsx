import React, { useState } from 'react';

/**
 * SourceCard component
 * Displays source trust metadata, record counts, ingestion status, and interactive reliability weighting controls
 */
export default function SourceCard({
  source = {
    id: 'src-core-banking',
    name: 'Core Banking Ledger',
    type: 'PostgreSQL Direct',
    reliabilityScore: 0.98,
    recordCount: 1420500,
    lastIngested: '12m ago',
    status: 'SYNCED',
    activeWeight: 0.95,
  },
  onWeightChange,
}) {
  const [weight, setWeight] = useState(source.activeWeight ?? source.reliabilityScore ?? 0.85);

  const handleSlider = (e) => {
    const val = parseFloat(e.target.value);
    setWeight(val);
    if (onWeightChange) onWeightChange(source.id, val);
  };

  const statusColors = {
    SYNCED: 'bg-[#22c55e]/10 text-[#4ade80] border-[#22c55e]/30',
    SYNCING: 'bg-[#eab308]/10 text-[#facc15] border-[#eab308]/30',
    PENDING: 'bg-[#8e9192]/10 text-[#c4c7c8] border-[#8e9192]/30',
    ERROR: 'bg-[#ef4444]/10 text-[#f87171] border-[#ef4444]/30',
  }[source.status] || 'bg-[#8e9192]/10 text-[#c4c7c8] border-[#8e9192]/30';

  return (
    <div className="rounded-xl bg-[#1c1b1b] border border-[#444748]/50 p-5 hover:border-[#8e9192] transition-colors space-y-4">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-serif text-base font-semibold text-white tracking-wide">
              {source.name}
            </h4>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border ${statusColors}`}>
              {source.status}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-[#8e9192] mt-1">
            <span>ID: <span className="text-[#e5e2e1]">{source.id}</span></span>
            <span>•</span>
            <span>Type: <span className="text-[#e5e2e1]">{source.type}</span></span>
          </div>
        </div>

        {/* Record count badge */}
        <div className="text-right">
          <span className="block text-xs font-mono text-[#8e9192] uppercase">Volume</span>
          <span className="font-mono text-sm font-semibold text-white">
            {Number(source.recordCount || 0).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Trust & Weighting Controls */}
      <div className="bg-[#131313] rounded-lg p-3.5 border border-[#2a2a2a] space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[#8e9192] uppercase">Trust Weighting:</span>
          <span className="font-bold text-white">
            {(weight * 100).toFixed(0)}% <span className="text-[#8e9192] font-normal">({weight.toFixed(2)})</span>
          </span>
        </div>

        <input
          type="range"
          min="0.10"
          max="1.00"
          step="0.05"
          value={weight}
          onChange={handleSlider}
          className="w-full accent-white bg-[#2a2a2a] rounded-lg h-1.5 cursor-pointer"
        />

        <div className="flex justify-between text-[10px] font-mono text-[#8e9192]">
          <span>0.10 (Unverified / Ad-Hoc)</span>
          <span>1.00 (Cryptographic Sovereign)</span>
        </div>
      </div>

      {/* Bottom info */}
      <div className="flex items-center justify-between text-[11px] font-mono text-[#8e9192] pt-1">
        <span>Last Ingested: <span className="text-[#e5e2e1]">{source.lastIngested || 'Recently'}</span></span>
        <span className="text-[#c4c7c8]">Deterministic Index: Active</span>
      </div>
    </div>
  );
}
