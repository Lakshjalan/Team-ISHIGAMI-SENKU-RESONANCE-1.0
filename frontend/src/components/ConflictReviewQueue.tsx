import React, { useState, useEffect, useRef } from 'react';
import { ConflictItem } from '../types';

interface ConflictReviewQueueProps {
  darkMode: boolean;
  conflicts: ConflictItem[];
  onResolveConflict: (conflictId: string, chosenValue: string, sourceName: string, rememberRule: boolean) => void;
  onBatchResolve: (ids: string[]) => void;
  onTriggerToast: (msg: string) => void;
}

export const ConflictReviewQueue: React.FC<ConflictReviewQueueProps> = ({
  darkMode,
  conflicts,
  onResolveConflict,
  onBatchResolve,
}) => {
  const [selectedConflict, setSelectedConflict] = useState<ConflictItem | null>(null);
  const [filterField, setFilterField] = useState<string>('ALL');
  const [minConfidence, setMinConfidence] = useState<number>(70);
  const [selectedBatchIds, setSelectedBatchIds] = useState<string[]>([]);
  const [customValueEdit, setCustomValueEdit] = useState<string>('');
  const [rememberRule, setRememberRule] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const modalCloseBtnRef = useRef<HTMLButtonElement | null>(null);
  const triggerRefMap = useRef<Record<string, HTMLButtonElement | null>>({});
  const activeTriggerIdRef = useRef<string | null>(null);

  const cardCls = darkMode ? 'bg-[#1c1b1b] border-[#353534]' : 'bg-white border-slate-200 shadow-xs';
  const elevatedCls = darkMode ? 'bg-[#201f1f] border-[#3a3939]' : 'bg-white border-slate-200 shadow-xs';
  const textSec = darkMode ? 'text-[#a1a1aa]' : 'text-slate-600';
  const inputBg = darkMode ? 'bg-[#131313] border-[#353534] text-[#e5e2e1]' : 'bg-white border-slate-300 text-slate-900';
  const tagMuted = darkMode ? 'bg-[#201f1f] text-zinc-400 border border-[#353534]' : 'bg-slate-100 text-slate-700 border border-slate-200';
  const rowHover = darkMode ? 'hover:bg-[#201f1f]/80' : 'hover:bg-slate-50';

  const handleCloseModal = () => {
    setSelectedConflict(null);
    if (activeTriggerIdRef.current && triggerRefMap.current[activeTriggerIdRef.current]) {
      triggerRefMap.current[activeTriggerIdRef.current]?.focus();
    }
  };

  const handleOpenModal = (conflict: ConflictItem) => {
    activeTriggerIdRef.current = conflict.id;
    setSelectedConflict(conflict);
    setCustomValueEdit(conflict.sourceB.value);
    setRememberRule(false);
  };

  // Modal Keyboard Listeners
  useEffect(() => {
    if (selectedConflict) {
      setTimeout(() => modalCloseBtnRef.current?.focus(), 50);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') handleCloseModal();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedConflict]);

  const executeResolve = (chosenValue: string, sourceName: string) => {
    if (!selectedConflict) return;
    onResolveConflict(selectedConflict.id, chosenValue, sourceName, rememberRule);
    handleCloseModal();
  };

  const filtered = conflicts.filter((c) => {
    const matchesField = filterField === 'ALL' || c.field.toUpperCase() === filterField;
    const matchesConfidence = c.confidence >= minConfidence;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.sourceA.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.sourceB.value.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesField && matchesConfidence && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header & Batch Trigger */}
      <div className={`${elevatedCls} rounded-3xl p-6 border flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div>
          <h2 className="text-2xl font-serif font-bold tracking-tight">Conflict Review Queue</h2>
          <p className={`text-xs ${textSec} mt-1`}>
            Triage cross-source identity divergence with cryptographic traceability
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              onBatchResolve(selectedBatchIds);
              setSelectedBatchIds([]);
            }}
            disabled={selectedBatchIds.length === 0}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-blue-500 ${
              selectedBatchIds.length > 0
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            Accept High-Trust Source ({selectedBatchIds.length})
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className={`${cardCls} rounded-3xl p-4 border flex flex-wrap items-center justify-between gap-4`}>
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <input
            type="text"
            placeholder="Filter by name or conflicting values..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full text-xs rounded-full px-4 py-2 border focus-visible:ring-2 focus-visible:ring-blue-500 ${inputBg}`}
          />
        </div>

        {/* Field Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {['ALL', 'EMAIL', 'PHONE', 'ADDRESS', 'NAME'].map((field) => (
            <button
              key={field}
              onClick={() => setFilterField(field)}
              className={`px-3 py-1 rounded-full text-xs font-mono font-medium transition-colors ${
                filterField === field
                  ? 'bg-blue-600 text-white'
                  : darkMode ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {field}
            </button>
          ))}
        </div>

        {/* Confidence Threshold Slider */}
        <div className="flex items-center gap-3 text-xs">
          <span className={textSec}>Min Confidence:</span>
          <input
            type="range"
            min="50"
            max="95"
            step="5"
            value={minConfidence}
            onChange={(e) => setMinConfidence(Number(e.target.value))}
            className="w-24 accent-blue-600 cursor-pointer"
          />
          <span className="font-mono font-bold text-blue-400 w-8">{minConfidence}%</span>
        </div>
      </div>

      {/* Conflicts Data Table */}
      <div className={`${cardCls} rounded-3xl border overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`border-b ${darkMode ? 'border-zinc-800 bg-[#161515] text-zinc-400' : 'border-slate-200 bg-slate-100 text-slate-600'} font-mono uppercase tracking-wider`}>
              <tr>
                <th className="px-6 py-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedBatchIds.length === filtered.length && filtered.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedBatchIds(filtered.map((c) => c.id));
                      else setSelectedBatchIds([]);
                    }}
                    className="rounded border-zinc-700 bg-zinc-900 text-blue-600 focus-visible:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-4">Identity Record</th>
                <th className="px-6 py-4">Conflict Field</th>
                <th className="px-6 py-4">Source A (Primary)</th>
                <th className="px-6 py-4">Source B (Challenger)</th>
                <th className="px-6 py-4">Confidence</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-zinc-800/80' : 'divide-slate-200'}`}>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                    No conflicts found matching the active filters.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className={`${rowHover} transition-colors`}>
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedBatchIds.includes(c.id)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedBatchIds((prev) => [...prev, c.id]);
                          else setSelectedBatchIds((prev) => prev.filter((id) => id !== c.id));
                        }}
                        className="rounded border-zinc-700 bg-zinc-900 text-blue-600 focus-visible:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold">{c.name}</div>
                      <div className={`text-[11px] font-mono ${textSec}`}>{c.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium ${tagMuted}`}>
                        {c.field}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-mono font-semibold">{c.sourceA.value}</div>
                      <div className="text-[11px] text-zinc-500">{c.sourceA.name} ({c.sourceA.trust}%)</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-mono font-semibold">{c.sourceB.value}</div>
                      <div className="text-[11px] text-zinc-500">{c.sourceB.name} ({c.sourceB.trust}%)</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded-full font-mono text-[11px] font-bold border ${
                          c.confidence >= 90
                            ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60'
                            : 'bg-amber-950/40 text-amber-400 border-amber-800/60'
                        }`}
                      >
                        {c.confidence}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        ref={(el) => {
                          triggerRefMap.current[c.id] = el;
                        }}
                        onClick={() => handleOpenModal(c)}
                        className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-xs focus-visible:ring-2 focus-visible:ring-blue-400"
                      >
                        Triage &rarr;
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Accessible Modal Dialog */}
      {selectedConflict && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-200"
        >
          <div className={`rounded-3xl max-w-xl w-full border shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150 ${cardCls}`}>
            <div className="flex items-center justify-between border-b pb-4 border-zinc-800">
              <div>
                <span className="text-[11px] font-mono text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-full">
                  {selectedConflict.confidence}% Match Vector
                </span>
                <h3 id="modal-title" className="text-xl font-serif font-bold mt-1">
                  Resolve {selectedConflict.field} Conflict
                </h3>
                <p className={`text-xs ${textSec} mt-0.5`}>
                  Arbitration for <strong className={darkMode ? 'text-white' : 'text-slate-900'}>{selectedConflict.name}</strong> ({selectedConflict.id})
                </p>
              </div>
              <button
                ref={modalCloseBtnRef}
                onClick={handleCloseModal}
                className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label="Close dialog"
              >
                &times;
              </button>
            </div>

            {/* Heuristic Explanation */}
            <div className="p-3.5 rounded-2xl bg-blue-950/30 border border-blue-800/40 text-xs flex items-start gap-2.5">
              <span className="h-2 w-2 rounded-full bg-blue-400 mt-1 shrink-0"></span>
              <div>
                <span className="font-semibold text-blue-300">Algorithmic Match Heuristic:</span>
                <span className="text-zinc-300 ml-1.5">{selectedConflict.matchReason}</span>
              </div>
            </div>

            {/* Candidates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-zinc-900/60 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-semibold">{selectedConflict.sourceA.name}</span>
                  <span className="text-[11px] font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded-full">
                    {selectedConflict.sourceA.trust}% Trust
                  </span>
                </div>
                <div className="p-2.5 rounded-xl font-mono text-xs bg-black/40 border border-zinc-800 mb-3 break-all">
                  {selectedConflict.sourceA.value}
                </div>
                <button
                  onClick={() => executeResolve(selectedConflict.sourceA.value, selectedConflict.sourceA.name)}
                  className="w-full py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-white transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  Adopt Source A
                </button>
              </div>

              <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-zinc-900/60 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-semibold">{selectedConflict.sourceB.name}</span>
                  <span className="text-[11px] font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded-full">
                    {selectedConflict.sourceB.trust}% Trust
                  </span>
                </div>
                <div className="p-2.5 rounded-xl font-mono text-xs bg-black/40 border border-zinc-800 mb-3 break-all">
                  {selectedConflict.sourceB.value}
                </div>
                <button
                  onClick={() => executeResolve(selectedConflict.sourceB.value, selectedConflict.sourceB.name)}
                  className="w-full py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-white transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  Adopt Source B
                </button>
              </div>
            </div>

            {/* Custom Value */}
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <label className="block text-xs font-medium text-zinc-400">
                Or manually correct before committing to Master:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customValueEdit}
                  onChange={(e) => setCustomValueEdit(e.target.value)}
                  className={`flex-1 text-xs font-mono rounded-xl px-3.5 py-2 border ${inputBg}`}
                />
                <button
                  onClick={() => executeResolve(customValueEdit, 'Manual Synthesis')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                >
                  Commit Custom
                </button>
              </div>
            </div>

            {/* Remember Rule */}
            <label className="flex items-center gap-2.5 text-xs text-zinc-400 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={rememberRule}
                onChange={(e) => setRememberRule(e.target.checked)}
                className="rounded border-zinc-700 bg-zinc-900 text-blue-600 focus-visible:ring-blue-500"
              />
              <span>Remember as persistent golden rule for future {selectedConflict.field} conflicts</span>
            </label>

            {/* Footer */}
            <div className="flex justify-end gap-2.5 pt-3 border-t border-zinc-800">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 rounded-full text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => executeResolve(`${selectedConflict.sourceA.value} / ${selectedConflict.sourceB.value}`, 'Composite Merge')}
                className="px-5 py-2 rounded-full text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-colors shadow-sm"
              >
                Merge Both Values
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
