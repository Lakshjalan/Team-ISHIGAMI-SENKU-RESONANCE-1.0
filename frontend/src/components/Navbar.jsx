import React from 'react';

/**
 * Navbar component
 * Top enterprise application header bar with real-time cluster telemetry and quick actions
 */
export default function Navbar({
  activeTab = 'dashboard',
  onTriggerDeduplication,
  clusterStatus = 'HEALTHY_SYNCED',
  latencyMs = 24,
}) {
  const titles = {
    dashboard: 'Command Center & Telemetry',
    upload: 'Multi-Source Data Ingestion',
    review: 'Conflict Review Queue',
    golden: 'Golden Master Record Directory',
    audit: 'Cryptographic Audit Ledger',
    auth: 'Identity & Access Gateway',
    settings: 'Governance & Threshold Settings',
    errors: 'System Diagnostics & Health',
  };

  return (
    <header className="h-16 bg-[#131313] border-b border-[#2a2a2a] px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Breadcrumbs / Current Page Indicator */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-[#8e9192] uppercase tracking-wider hidden sm:inline">
          VERITAS ER //
        </span>
        <h1 className="font-serif text-lg font-semibold text-white tracking-wide truncate">
          {titles[activeTab] || 'Command Center'}
        </h1>
      </div>

      {/* Right: Telemetry & Actions */}
      <div className="flex items-center gap-4">
        {/* Node latency & status indicator */}
        <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-[#1c1b1b] border border-[#2a2a2a] text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-[#e5e2e1]">{clusterStatus}: 12/12</span>
          </div>
          <span className="text-[#444748]">|</span>
          <span className="text-[#8e9192]">LATENCY: <span className="text-[#4ade80]">{latencyMs}ms</span></span>
          <span className="text-[#444748]">|</span>
          <span className="text-[#8e9192]">HASH RATIO: <span className="text-white font-medium">100%</span></span>
        </div>

        {/* Trigger Deduplication Run button */}
        <button
          onClick={onTriggerDeduplication}
          className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-neutral-200 text-black font-mono text-xs font-semibold tracking-wide transition shadow-sm flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="hidden sm:inline">TRIGGER RUN</span>
        </button>

        {/* User clearance pill */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-[#2a2a2a]">
          <div className="w-8 h-8 rounded-lg bg-[#2a2a2a] border border-[#444748] flex items-center justify-center font-mono text-xs font-bold text-white">
            S5
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-mono font-medium text-white">Dr. Senku</div>
            <div className="text-[10px] font-mono text-[#8e9192]">CLEARANCE: L5</div>
          </div>
        </div>
      </div>
    </header>
  );
}
