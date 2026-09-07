import React, { useState, useEffect, useCallback } from 'react';
import MaterialIcon from '../components/icons/MaterialIcon';
import Toast from '../components/ui/Toast';
import Modal from '../components/ui/Modal';
import { CONFLICTS, type ConflictItem } from '../data/mockData';
import { Page } from '../components/layout/Header';

interface ConflictTriageProps {
  onNavigate?: (page: Page) => void;
}

export default function ConflictTriage({ onNavigate }: ConflictTriageProps) {
  const [conflictList, setConflictList] = useState<ConflictItem[]>(CONFLICTS);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [manualModalConflict, setManualModalConflict] = useState<ConflictItem | null>(null);
  const [customValue, setCustomValue] = useState<string>('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
  };

  const handleResolve = useCallback(
    (id: string, decision: string) => {
      setConflictList((prev) => prev.filter((c) => c.id !== id));
      triggerToast(`Resolved: ${decision}`);
      setManualModalConflict(null);
    },
    []
  );

  // Keyboard shortcut listener for active top conflict
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return;
      const topConflict = conflictList[0];
      if (!topConflict) return;

      if (e.key.toLowerCase() === 'a') {
        handleResolve(topConflict.id, `Adopted ${topConflict.sourceA.name} for ${topConflict.name}`);
      } else if (e.key.toLowerCase() === 'b') {
        handleResolve(topConflict.id, `Adopted ${topConflict.sourceB.name} for ${topConflict.name}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [conflictList, handleResolve]);

  const filteredConflicts = conflictList.filter((item) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'high') return item.priority === 'High';
    return item.field.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <div className="flex flex-col gap-8 pb-12">
      <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#201f1f]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#201f1f] text-[11px] font-medium text-[#c4c7c8] tracking-wider uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            Stage 03 • Human-In-The-Loop Triage
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight font-['Libre_Caslon_Text']">
            Conflict Review Queue
          </h1>
          <p className="text-sm text-[#8e9192] mt-1 max-w-xl">
            Review field-level discrepancies across matched candidate entities. Compare source evidence and commit resolutions to the master record.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#8e9192] bg-[#1c1b1b] border border-[#2a2a2a] px-3.5 py-2 rounded-lg">
          <MaterialIcon name="keyboard" size={16} />
          <span>Hotkeys: Press <kbd className="px-1.5 py-0.5 rounded bg-[#2a2a2a] text-white font-mono text-[10px]">A</kbd> for Source A, <kbd className="px-1.5 py-0.5 rounded bg-[#2a2a2a] text-white font-mono text-[10px]">B</kbd> for Source B</span>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'All Conflicts' },
            { id: 'high', label: 'High Priority' },
            { id: 'email', label: 'Email' },
            { id: 'phone', label: 'Phone' },
            { id: 'name', label: 'Name' },
            { id: 'address', label: 'Address' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeFilter === tab.id
                  ? 'bg-white text-[#131313] shadow-sm'
                  : 'bg-[#1c1b1b] text-[#c4c7c8] hover:text-white border border-[#2a2a2a]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-[#8e9192]">
          Showing <strong className="text-white">{filteredConflicts.length}</strong> of {conflictList.length} items
        </span>
      </div>

      {/* Queue Items */}
      {filteredConflicts.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#1c1b1b] border border-[#2a2a2a] text-center flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <MaterialIcon name="verified" size={24} />
          </div>
          <h3 className="text-lg font-bold text-white">Queue Clear</h3>
          <p className="text-xs text-[#8e9192] max-w-md">
            All candidate conflicts have been resolved or accepted into the Golden Master directory.
          </p>
          <button
            onClick={() => onNavigate?.('golden-master-directory')}
            className="mt-2 px-5 py-2.5 rounded-lg bg-white text-[#131313] text-xs font-bold uppercase tracking-wider hover:bg-[#e2e2e2] transition-colors"
          >
            View Master Directory
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {filteredConflicts.map((conflict, index) => (
            <div
              key={conflict.id}
              className="p-6 rounded-2xl bg-[#1c1b1b] border border-[#2a2a2a] hover:border-[#353534] transition-all flex flex-col gap-5 shadow-sm"
            >
              {/* Conflict Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#201f1f]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center text-xs font-bold text-white">
                    {conflict.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-white">{conflict.name}</span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#2a2a2a] text-[#c4c7c8]">
                        Field: {conflict.field}
                      </span>
                    </div>
                    <span className="text-xs text-[#8e9192] font-mono">ID: {conflict.id}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                      conflict.priority === 'High'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : conflict.priority === 'Medium'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}
                  >
                    {conflict.priority} Priority
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-[#131313] px-2.5 py-1 rounded border border-[#2a2a2a]">
                    {conflict.confidence}% Match
                  </span>
                </div>
              </div>

              {/* AI Reasoning Pill */}
              <div className="p-3.5 rounded-xl bg-[#131313] border border-[#2a2a2a] flex items-start gap-3">
                <MaterialIcon name="psychology" size={20} className="text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">Evidence & Discrepancy Rationale</span>
                    <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.2 rounded">
                      Recommendation: {conflict.recommendation}
                    </span>
                  </div>
                  <p className="text-xs text-[#c4c7c8] leading-relaxed">{conflict.reasoning}</p>
                </div>
              </div>

              {/* Side-by-Side Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Source A */}
                <div
                  className={`p-4 rounded-xl border flex flex-col justify-between gap-4 ${
                    conflict.recommendation === 'Source A'
                      ? 'bg-[#201f1f] border-white/20'
                      : 'bg-[#131313] border-[#2a2a2a]'
                  }`}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <MaterialIcon name="database" size={14} />
                        <span>{conflict.sourceA.name}</span>
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {conflict.sourceA.trust}% Trust
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-[#0e0e0e] border border-[#2a2a2a] font-mono text-sm text-white break-all">
                      {conflict.sourceA.value}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#8e9192]">
                      <span>Ref: {conflict.sourceA.recordId}</span>
                      <span>Updated: {conflict.sourceA.lastUpdated}</span>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleResolve(conflict.id, `Adopted ${conflict.sourceA.name} (${conflict.sourceA.value})`)
                    }
                    className="w-full py-2.5 rounded-lg bg-[#2a2a2a] hover:bg-white hover:text-[#131313] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Adopt Source A</span>
                    {index === 0 && <span className="text-[10px] opacity-70">(Key: A)</span>}
                  </button>
                </div>

                {/* Source B */}
                <div
                  className={`p-4 rounded-xl border flex flex-col justify-between gap-4 ${
                    conflict.recommendation === 'Source B'
                      ? 'bg-[#201f1f] border-white/20'
                      : 'bg-[#131313] border-[#2a2a2a]'
                  }`}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <MaterialIcon name="database" size={14} />
                        <span>{conflict.sourceB.name}</span>
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {conflict.sourceB.trust}% Trust
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-[#0e0e0e] border border-[#2a2a2a] font-mono text-sm text-white break-all">
                      {conflict.sourceB.value}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#8e9192]">
                      <span>Ref: {conflict.sourceB.recordId}</span>
                      <span>Updated: {conflict.sourceB.lastUpdated}</span>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleResolve(conflict.id, `Adopted ${conflict.sourceB.name} (${conflict.sourceB.value})`)
                    }
                    className="w-full py-2.5 rounded-lg bg-[#2a2a2a] hover:bg-white hover:text-[#131313] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Adopt Source B</span>
                    {index === 0 && <span className="text-[10px] opacity-70">(Key: B)</span>}
                  </button>
                </div>
              </div>

              {/* Bottom Custom Edit Action */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    setManualModalConflict(conflict);
                    setCustomValue(conflict.sourceA.value);
                  }}
                  className="text-xs text-[#8e9192] hover:text-white transition-colors flex items-center gap-1"
                >
                  <MaterialIcon name="edit" size={14} />
                  <span>Manual Custom Edit...</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Manual Override Custom Value Modal */}
      {manualModalConflict && (
        <Modal open={true} onClose={() => setManualModalConflict(null)}>
          <div className="flex flex-col gap-4 text-[#e5e2e1]">
            <div>
              <h3 className="text-xl font-bold text-white font-['Libre_Caslon_Text']">
                Manual Override: {manualModalConflict.field}
              </h3>
              <p className="text-xs text-[#8e9192] mt-0.5">
                Set a custom verified value for {manualModalConflict.name}. This will be logged in the immutable audit trail.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-white">Reconciled Golden Value</label>
              <input
                type="text"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#131313] border border-[#2a2a2a] text-sm text-white font-mono focus:outline-none focus:border-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2a2a2a]">
              <button
                onClick={() => setManualModalConflict(null)}
                className="px-4 py-2 rounded-lg text-xs text-[#8e9192] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleResolve(
                    manualModalConflict.id,
                    `Manual Override applied: "${customValue}" by operator`
                  )
                }
                className="px-5 py-2 rounded-lg bg-white text-[#131313] text-xs font-bold uppercase tracking-wider hover:bg-[#e2e2e2]"
              >
                Commit Override
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
