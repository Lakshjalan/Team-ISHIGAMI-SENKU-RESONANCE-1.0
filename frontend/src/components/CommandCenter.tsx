import React from 'react';
import { ConflictItem, AppScreen, SourceRegistry } from '../types';

interface CommandCenterProps {
  darkMode: boolean;
  conflicts: ConflictItem[];
  sources: SourceRegistry[];
  onNavigate: (screen: AppScreen) => void;
  onOpenConflictModal: (conflict: ConflictItem) => void;
  onTriggerNewRun: () => void;
  isSimulatingRun: boolean;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  darkMode,
  conflicts,
  sources,
  onNavigate,
  onOpenConflictModal,
  onTriggerNewRun,
  isSimulatingRun,
}) => {
  const cardCls = darkMode ? 'bg-[#1c1b1b] border-[#353534]' : 'bg-white border-slate-200 shadow-xs';
  const elevatedCls = darkMode ? 'bg-[#201f1f] border-[#3a3939]' : 'bg-white border-slate-200 shadow-xs';
  const textSec = darkMode ? 'text-[#a1a1aa]' : 'text-slate-600';
  const tagMuted = darkMode ? 'bg-[#201f1f] text-zinc-400 border border-[#353534]' : 'bg-slate-100 text-slate-700 border border-slate-200';
  const rowHover = darkMode ? 'hover:bg-[#201f1f]/80' : 'hover:bg-slate-50';

  return (
    <div className="space-y-6">
      {/* Top Bento Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* System Health */}
        <div className={`${cardCls} rounded-3xl p-6 border transition-all`}>
          <div className="flex justify-between items-center text-xs font-medium uppercase tracking-wider">
            <span className={textSec}>System Health</span>
            <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full text-[11px] font-semibold">
              +0.4% High Reliability
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-4xl font-serif font-bold tracking-tight">98.4%</span>
            <span className={`text-xs ${textSec}`}>Record Integrity Score</span>
          </div>
          <div className="w-full bg-zinc-800/60 rounded-full h-1.5 mt-4 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '98.4%' }}></div>
          </div>
          <div className={`mt-3 flex justify-between text-[11px] ${textSec}`}>
            <span>Confidence Target: 85.0%</span>
            <span className="text-emerald-400 font-mono">Verified Zero Drift</span>
          </div>
        </div>

        {/* Ingested Records */}
        <div className={`${cardCls} rounded-3xl p-6 border transition-all`}>
          <div className="flex justify-between items-center text-xs font-medium uppercase tracking-wider">
            <span className={textSec}>Ingested Records</span>
            <span className="font-mono text-zinc-400 text-xs">Run #1048</span>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-4xl font-serif font-bold tracking-tight">142,890</span>
            <span className={`text-xs ${textSec}`}>across 3 sources</span>
          </div>
          <div className="w-full bg-zinc-800/60 rounded-full h-1.5 mt-4 overflow-hidden">
            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
          </div>
          <div className={`mt-3 flex justify-between text-[11px] ${textSec}`}>
            <span>ERP · Campus · Alumni</span>
            <span className="text-blue-400 font-mono">100% Checksum Valid</span>
          </div>
        </div>

        {/* Master Identities */}
        <div className={`${cardCls} rounded-3xl p-6 border transition-all`}>
          <div className="flex justify-between items-center text-xs font-medium uppercase tracking-wider">
            <span className={textSec}>Master Identities</span>
            <span className="text-indigo-400 bg-indigo-950/60 border border-indigo-800/60 px-2 py-0.5 rounded-full text-[11px] font-semibold">
              Consensus Pinned
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-4xl font-serif font-bold tracking-tight">118,420</span>
            <span className={`text-xs ${textSec}`}>Golden Profiles</span>
          </div>
          <div className="w-full bg-zinc-800/60 rounded-full h-1.5 mt-4 overflow-hidden">
            <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '92.8%' }}></div>
          </div>
          <div className={`mt-3 flex justify-between text-[11px] ${textSec}`}>
            <span>Single ID Deduplication</span>
            <span className="text-indigo-400 font-mono">92.8% Auto Resolved</span>
          </div>
        </div>
      </div>

      {/* Interactive Resolution Pipeline Stepper */}
      <div className={`${elevatedCls} rounded-3xl p-5 border transition-all`}>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs font-semibold uppercase tracking-wider font-mono">
            Reconciliation Pipeline Stepper
          </h2>
          <span className={`text-xs ${textSec}`}>Interactive workflow stage navigator</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigate('ingestion')}
            className={`p-4 rounded-2xl border text-left transition-all focus-visible:ring-2 focus-visible:ring-blue-500 ${
              darkMode ? 'bg-[#181717] border-[#302f2f] hover:border-zinc-500' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-mono font-bold text-blue-400">01 INGEST</span>
              <span className="text-[10px] bg-emerald-950/60 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">Done</span>
            </div>
            <div className="text-base font-bold mt-1.5">142,890 Records</div>
            <div className={`text-xs ${textSec} mt-0.5`}>Enterprise Connectors &rarr;</div>
          </button>

          <button
            onClick={() => onTriggerNewRun()}
            disabled={isSimulatingRun}
            className={`p-4 rounded-2xl border text-left transition-all focus-visible:ring-2 focus-visible:ring-blue-500 ${
              darkMode ? 'bg-[#181717] border-[#302f2f] hover:border-zinc-500' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-mono font-bold text-blue-400">02 MATCH</span>
              <span className="text-[10px] bg-emerald-950/60 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">
                {isSimulatingRun ? 'Matching...' : 'Done'}
              </span>
            </div>
            <div className="text-base font-bold mt-1.5">139,120 Records</div>
            <div className={`text-xs ${textSec} mt-0.5`}>Deterministic Consensus &rarr;</div>
          </button>

          <button
            onClick={() => onNavigate('triage')}
            className={`p-4 rounded-2xl border text-left transition-all focus-visible:ring-2 focus-visible:ring-amber-500 ${
              conflicts.length > 0
                ? 'bg-amber-950/30 border-amber-600/50 hover:bg-amber-950/40'
                : darkMode ? 'bg-[#181717] border-[#302f2f]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-mono font-bold text-amber-400">03 CONFLICT</span>
              <span className="text-[10px] bg-amber-500 text-zinc-950 px-2 py-0.5 rounded-full font-bold animate-pulse">
                {conflicts.length} Pending
              </span>
            </div>
            <div className="text-base font-bold mt-1.5 text-amber-300">{conflicts.length} Human Review</div>
            <div className={`text-xs ${textSec} mt-0.5`}>Action Required &rarr;</div>
          </button>

          <button
            onClick={() => onNavigate('directory')}
            className={`p-4 rounded-2xl border text-left transition-all focus-visible:ring-2 focus-visible:ring-blue-500 ${
              darkMode ? 'bg-[#181717] border-[#302f2f] hover:border-zinc-500' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-mono font-bold text-indigo-400">04 RESOLVE</span>
              <span className="text-[10px] bg-indigo-950/60 text-indigo-400 px-2 py-0.5 rounded-full font-semibold">Active</span>
            </div>
            <div className="text-base font-bold mt-1.5">102,880 Golden</div>
            <div className={`text-xs ${textSec} mt-0.5`}>Master Directory &rarr;</div>
          </button>
        </div>
      </div>

      {/* Split Section: Attention Queue & Distribution Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Needs Your Attention (2 Cols) */}
        <div className={`lg:col-span-2 ${cardCls} rounded-3xl border flex flex-col overflow-hidden`}>
          <div className="p-6 border-b border-zinc-800/80 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-serif font-bold tracking-tight">Needs Your Attention</h2>
              <p className={`text-xs ${textSec}`}>
                High-priority attribute ambiguities awaiting human verification
              </p>
            </div>
            <button
              onClick={() => onNavigate('triage')}
              className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 transition-colors"
            >
              Open Triage Queue &rarr;
            </button>
          </div>

          <div className="divide-y divide-zinc-800/60 flex-1">
            {conflicts.length === 0 ? (
              <div className="p-12 text-center">
                <div className="h-12 w-12 bg-emerald-950/50 border border-emerald-700/50 text-emerald-400 rounded-full mx-auto flex items-center justify-center mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-base font-serif font-semibold">All Conflicts Reconciled!</h4>
                <p className={`text-xs ${textSec} mt-1 max-w-sm mx-auto`}>
                  Zero outstanding identity collisions remaining in queue.
                </p>
              </div>
            ) : (
              conflicts.slice(0, 3).map((conflict) => (
                <div
                  key={conflict.id}
                  className={`p-5 ${rowHover} transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-semibold text-sm">{conflict.name}</span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-md font-mono font-medium ${tagMuted}`}>
                        {conflict.field}
                      </span>
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-md font-mono font-semibold border ${
                          conflict.confidence >= 90
                            ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60'
                            : 'bg-amber-950/40 text-amber-400 border-amber-800/60'
                        }`}
                      >
                        {conflict.confidence}% Match Vector
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className={`px-2 py-1 rounded ${darkMode ? 'bg-[#181717] text-zinc-300 border border-[#302f2f]' : 'bg-slate-100 text-slate-700'}`}>
                        {conflict.sourceA.value}
                      </span>
                      <span className="text-zinc-500 font-bold">&ne;</span>
                      <span className={`px-2 py-1 rounded ${darkMode ? 'bg-[#181717] text-zinc-300 border border-[#302f2f]' : 'bg-slate-100 text-slate-700'}`}>
                        {conflict.sourceB.value}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenConflictModal(conflict)}
                    className="shrink-0 px-4 py-2 rounded-full text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-all focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    Review &amp; Diff &rarr;
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Outcomes & Source Reliability (1 Col) */}
        <div className="space-y-6">
          {/* Outcomes */}
          <div className={`${cardCls} rounded-3xl p-6 border transition-all`}>
            <h3 className="text-xs font-semibold uppercase tracking-wider font-mono mb-4">
              Reconciliation Distribution
            </h3>
            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium">Auto-Consensus Resolved</span>
                  <span className="font-bold text-emerald-400 font-mono">72.4%</span>
                </div>
                <div className="w-full bg-zinc-800/60 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '72.4%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium">Human-in-the-Loop Review</span>
                  <span className="font-bold text-amber-400 font-mono">18.2%</span>
                </div>
                <div className="w-full bg-zinc-800/60 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '18.2%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium">Critical Policy Exceptions</span>
                  <span className="font-bold text-rose-400 font-mono">9.4%</span>
                </div>
                <div className="w-full bg-zinc-800/60 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-2 rounded-full" style={{ width: '9.4%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Registries */}
          <div className={`${cardCls} rounded-3xl p-6 border transition-all`}>
            <h3 className="text-xs font-semibold uppercase tracking-wider font-mono mb-3">
              Active Golden Rule Weights
            </h3>
            <div className="space-y-2.5">
              {sources.map((src) => (
                <div key={src.id} className="flex justify-between items-center text-xs py-1.5 border-b border-zinc-800/40 last:border-0">
                  <div>
                    <div className="font-semibold">{src.name}</div>
                    <div className={`text-[11px] ${textSec}`}>{src.tag}</div>
                  </div>
                  <span className="font-mono font-bold text-blue-400 bg-blue-950/40 border border-blue-800/50 px-2 py-0.5 rounded-full text-xs">
                    {src.trust}% Trust
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
