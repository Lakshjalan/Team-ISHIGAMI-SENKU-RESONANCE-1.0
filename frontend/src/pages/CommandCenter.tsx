import React, { useState } from 'react';
import MaterialIcon from '../components/icons/MaterialIcon';
import Toast from '../components/ui/Toast';
import Modal from '../components/ui/Modal';
import {
  METRIC_CARDS,
  PIPELINE_STAGES,
  CONFLICTS,
  SOURCE_RELIABILITY,
  AUDIT_RECORDS,
  type ConflictItem,
} from '../data/mockData';
import { Page } from '../components/layout/Header';

interface CommandCenterProps {
  onNavigate?: (page: Page) => void;
}

export default function CommandCenter({ onNavigate }: CommandCenterProps) {
  const [selectedConflict, setSelectedConflict] = useState<ConflictItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
  };

  const handleResolveConflict = (resolution: string) => {
    triggerToast(`Resolution applied: ${resolution}`);
    setSelectedConflict(null);
  };

  return (
    <div className="flex flex-col gap-10 pb-12">
      <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />

      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#201f1f]">
        <div>
          <h1 className="text-3xl sm:text-4xl font-normal text-white tracking-tight flex items-center flex-wrap gap-x-3">
            <span className="font-syntra font-light text-white tracking-[0.28em] uppercase text-3xl sm:text-4xl">
              SYNTRA
            </span>
            <span className="font-['Geist'] font-semibold text-[#e5e2e1] text-2xl sm:text-3xl">
              Overview
            </span>
          </h1>
          <p className="text-sm text-[#8e9192] mt-2 max-w-xl">
            Automated multi-source identity matching and evidence-driven conflict resolution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate?.('conflict-triage')}
            className="px-4 py-2.5 rounded-lg bg-[#201f1f] hover:bg-[#2a2a2a] text-white text-xs font-semibold tracking-wide uppercase transition-colors border border-[#2a2a2a] flex items-center gap-2"
          >
            <MaterialIcon name="rule" size={16} />
            <span>Triage Queue (360)</span>
          </button>
          <button
            onClick={() => onNavigate?.('ingest-datasets')}
            className="px-4 py-2.5 rounded-lg bg-white hover:bg-[#e2e2e2] text-[#131313] text-xs font-semibold tracking-wide uppercase transition-colors flex items-center gap-2 shadow-sm"
          >
            <MaterialIcon name="upload_file" size={16} />
            <span>Ingest Source</span>
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {METRIC_CARDS.map((card, idx) => (
          <div
            key={idx}
            className="spotlight-card p-5 rounded-2xl bg-[#1c1b1b] border border-[#2a2a2a] flex flex-col justify-between gap-4 hover:border-[#353534] shadow-sm cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <span className="text-xs uppercase tracking-wider text-[#8e9192] font-medium">
                {card.label}
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#2a2a2a] flex items-center justify-center text-white">
                <MaterialIcon name={card.icon} size={18} />
              </div>
            </div>

            <div>
              <div className="text-3xl font-bold text-white font-['Libre_Caslon_Text']">
                {card.value}
              </div>
              <span className="inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#2a2a2a] text-[#c4c7c8]">
                {card.badge}
              </span>
            </div>

            <div className="pt-2 border-t border-[#201f1f] flex items-center justify-between text-[11px] text-[#8e9192]">
              <span>{card.footerLeft}</span>
              <span className="text-[#c4c7c8] font-medium">{card.footerRight}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Linear Reconciliation Pipeline Stepper */}
      <div className="spotlight-card p-6 rounded-2xl bg-[#1c1b1b] border border-[#2a2a2a] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MaterialIcon name="alt_route" size={20} className="text-white" />
            <h2 className="text-base font-semibold text-white">
              End-to-End Resolution Pipeline
            </h2>
          </div>
          <span className="text-xs text-[#8e9192]">
            Non-destructive • Source data preserved
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {PIPELINE_STAGES.map((st, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border flex flex-col justify-between gap-2 ${
                st.status === 'REVIEW'
                  ? 'bg-[#201f1f] border-amber-500/40'
                  : 'bg-[#131313] border-[#2a2a2a]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#8e9192]">{st.stage ? `STAGE ${st.stage}` : st.label}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    st.status === 'DONE'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : st.status === 'REVIEW'
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-blue-500/10 text-blue-400'
                  }`}
                >
                  {st.status}
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  {st.label}
                </span>
                <span className="text-sm font-semibold text-[#c4c7c8] mt-0.5 block">
                  {st.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Two-Column Equal Height Row: Attention Queue + Recent Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left (8 Cols): Needs Operator Review (Single Spotlight Block) */}
        <div className="spotlight-card lg:col-span-8 flex flex-col justify-between gap-4 p-5 rounded-2xl bg-[#1c1b1b] border border-[#2a2a2a]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white font-['Libre_Caslon_Text']">
                Needs Operator Review
              </h2>
              <p className="text-xs text-[#8e9192]">
                Ambiguous records below auto-resolution threshold (75%–90% confidence)
              </p>
            </div>
            <button
              onClick={() => onNavigate?.('conflict-triage')}
              className="text-xs text-white hover:underline flex items-center gap-1 font-medium"
            >
              <span>View All Conflicts</span>
              <MaterialIcon name="arrow_forward" size={14} />
            </button>
          </div>

          <div className="flex flex-col gap-3 flex-1 justify-between">
            {CONFLICTS.slice(0, 3).map((conflict) => (
              <div
                key={conflict.id}
                className="p-4 rounded-xl bg-[#131313] border border-[#201f1f] hover:border-[#2a2a2a] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-1"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {conflict.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-white">{conflict.name}</span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#2a2a2a] text-[#c4c7c8]">
                        {conflict.field} Conflict
                      </span>
                      <span className="text-xs font-semibold text-emerald-400">
                        {conflict.confidence}% Match
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-[#8e9192] flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 font-mono">
                      <span className="text-[#e5e2e1] font-medium">
                        A: {conflict.sourceA.value}
                      </span>
                      <span className="text-[#8e9192]">vs</span>
                      <span className="text-[#e5e2e1] font-medium">
                        B: {conflict.sourceB.value}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedConflict(conflict)}
                  className="px-4 py-2 rounded-lg bg-white hover:bg-[#e2e2e2] text-[#131313] text-xs font-semibold tracking-wider uppercase transition-colors shrink-0 flex items-center justify-center gap-1.5 self-end sm:self-center shadow-sm"
                >
                  <span>Resolve</span>
                  <MaterialIcon name="chevron_right" size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right (4 Cols): Recent Audit Trail (Matching Bottom Height) */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="spotlight-card p-5 rounded-2xl bg-[#1c1b1b] border border-[#2a2a2a] flex flex-col justify-between gap-4 h-full cursor-pointer">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#201f1f]">
                <div>
                  <h3 className="text-sm font-semibold text-white font-['Libre_Caslon_Text']">
                    Recent Audit Trail
                  </h3>
                  <p className="text-xs text-[#8e9192]">
                    Latest operational decisions & log activity
                  </p>
                </div>
                <button
                  onClick={() => onNavigate?.('audit-log')}
                  className="text-xs text-[#8e9192] hover:text-white shrink-0 font-medium"
                >
                  View all
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {AUDIT_RECORDS.slice(0, 3).map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3 rounded-xl bg-[#131313] border border-[#201f1f] flex flex-col gap-1.5 text-xs hover:border-[#2a2a2a] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{rec.entityName}</span>
                      <span className="text-[10px] text-[#8e9192]">{rec.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-[#c4c7c8]">
                      {rec.field}: <strong className="text-white font-mono">{rec.resolvedValue}</strong>
                    </p>
                    <span className="text-[10px] text-[#8e9192] font-mono">
                      By: {rec.operator}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#201f1f] flex items-center justify-between text-[11px] text-[#8e9192]">
              <span>Real-time Audit Sync</span>
              <span className="text-emerald-400 font-medium font-mono">100% Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Expanded Full-Width Source System Weights Section */}
      <div className="spotlight-card p-6 rounded-2xl bg-[#1c1b1b] border border-[#2a2a2a] flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-white font-['Libre_Caslon_Text']">
                Source System Weights & Reliability
              </h3>
              <span className="text-[10px] uppercase font-bold text-[#8e9192] bg-[#2a2a2a] px-2 py-0.5 rounded">
                Active Policy
              </span>
            </div>
            <p className="text-xs text-[#8e9192] mt-0.5">
              Resolution engine prioritizes high-trust systems during automated entity disambiguation.
            </p>
          </div>
          <button
            onClick={() => onNavigate?.('settings')}
            className="text-xs text-[#8e9192] hover:text-white font-medium"
          >
            Manage Weights
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SOURCE_RELIABILITY.map((src) => (
            <div
              key={src.id}
              className="p-4 rounded-xl bg-[#131313] border border-[#2a2a2a] flex flex-col justify-between gap-3 hover:border-[#353534] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#e5e2e1] font-semibold">{src.name}</span>
                  <span className="font-mono text-emerald-400 font-bold text-sm">{src.trust}%</span>
                </div>
                <div className="w-full h-2 bg-[#201f1f] rounded-full overflow-hidden border border-[#2a2a2a] my-2">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-500"
                    style={{ width: `${src.trust}%` }}
                  />
                </div>
                <p className="text-[11px] text-[#8e9192] line-clamp-2">{src.description}</p>
              </div>

              <div className="pt-2 border-t border-[#201f1f] flex items-center justify-between text-[11px] text-[#8e9192]">
                <span>{src.recordCount.toLocaleString()} records</span>
                <span className="font-mono text-[#c4c7c8]">{src.lastSync}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Conflict Resolution Modal */}
      {selectedConflict && (
        <Modal open={true} onClose={() => setSelectedConflict(null)}>
          <div className="flex flex-col gap-5 text-[#e5e2e1]">
            <div className="flex items-start justify-between pb-3 border-b border-[#2a2a2a]">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
                  {selectedConflict.priority} Priority Conflict
                </span>
                <h3 className="text-2xl font-bold text-white font-['Libre_Caslon_Text'] mt-0.5">
                  {selectedConflict.name}
                </h3>
                <span className="text-xs text-[#8e9192]">
                  Conflicting Field: <strong className="text-white">{selectedConflict.field}</strong>
                </span>
              </div>
              <button
                onClick={() => setSelectedConflict(null)}
                className="p-1 rounded-lg text-[#8e9192] hover:text-white hover:bg-[#2a2a2a]"
              >
                <MaterialIcon name="close" size={20} />
              </button>
            </div>

            {/* AI Explanation Pill */}
            <div className="p-3.5 rounded-xl bg-[#201f1f] border border-[#2a2a2a] text-xs flex items-start gap-2.5">
              <MaterialIcon name="lightbulb" size={18} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block mb-0.5">Evidence Analysis:</span>
                <p className="text-[#c4c7c8] leading-relaxed">{selectedConflict.reasoning}</p>
              </div>
            </div>

            {/* Side-by-Side Values */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Source A */}
              <div className="p-4 rounded-xl bg-[#1c1b1b] border border-[#2a2a2a] flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-white">{selectedConflict.sourceA.name}</span>
                    <span className="text-emerald-400 font-mono font-bold">
                      {selectedConflict.sourceA.trust}% Trust
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#131313] border border-[#2a2a2a] font-mono text-sm text-white break-all">
                    {selectedConflict.sourceA.value}
                  </div>
                  <span className="text-[11px] text-[#8e9192] mt-1 block">
                    Updated: {selectedConflict.sourceA.lastUpdated}
                  </span>
                </div>
                <button
                  onClick={() =>
                    handleResolveConflict(
                      `Adopted ${selectedConflict.sourceA.name} (${selectedConflict.sourceA.value})`
                    )
                  }
                  className="w-full py-2 bg-[#2a2a2a] hover:bg-white hover:text-[#131313] text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Adopt Source A
                </button>
              </div>

              {/* Source B */}
              <div className="p-4 rounded-xl bg-[#1c1b1b] border border-[#2a2a2a] flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-white">{selectedConflict.sourceB.name}</span>
                    <span className="text-emerald-400 font-mono font-bold">
                      {selectedConflict.sourceB.trust}% Trust
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#131313] border border-[#2a2a2a] font-mono text-sm text-white break-all">
                    {selectedConflict.sourceB.value}
                  </div>
                  <span className="text-[11px] text-[#8e9192] mt-1 block">
                    Updated: {selectedConflict.sourceB.lastUpdated}
                  </span>
                </div>
                <button
                  onClick={() =>
                    handleResolveConflict(
                      `Adopted ${selectedConflict.sourceB.name} (${selectedConflict.sourceB.value})`
                    )
                  }
                  className="w-full py-2 bg-[#2a2a2a] hover:bg-white hover:text-[#131313] text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Adopt Source B
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-[#2a2a2a]">
              <button
                onClick={() => setSelectedConflict(null)}
                className="text-xs text-[#8e9192] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleResolveConflict(
                    `Applied Recommended Resolution (${selectedConflict.recommendation})`
                  )
                }
                className="px-5 py-2.5 rounded-lg bg-white hover:bg-[#e2e2e2] text-[#131313] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
              >
                Accept Recommendation ({selectedConflict.recommendation})
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
