import React, { useState } from 'react';
import { GoldenRecord } from '../types';

interface GoldenMasterDirectoryProps {
  darkMode: boolean;
  goldenRecords: GoldenRecord[];
  onTriggerToast: (msg: string) => void;
}

export const GoldenMasterDirectory: React.FC<GoldenMasterDirectoryProps> = ({
  darkMode,
  goldenRecords,
  onTriggerToast,
}) => {
  const [search, setSearch] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<GoldenRecord | null>(null);

  const cardCls = darkMode ? 'bg-[#1c1b1b] border-[#353534]' : 'bg-white border-slate-200 shadow-xs';
  const elevatedCls = darkMode ? 'bg-[#201f1f] border-[#3a3939]' : 'bg-white border-slate-200 shadow-xs';
  const textSec = darkMode ? 'text-[#a1a1aa]' : 'text-slate-600';
  const inputBg = darkMode ? 'bg-[#131313] border-[#353534] text-[#e5e2e1]' : 'bg-white border-slate-300 text-slate-900';

  const filtered = goldenRecords.filter(
    (r) =>
      r.fullName.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.masterId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className={`${elevatedCls} rounded-3xl p-6 border flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div>
          <h2 className="text-2xl font-serif font-bold tracking-tight">Golden Master Identity Directory</h2>
          <p className={`text-xs ${textSec} mt-1`}>
            Consolidated single source of truth identities with immutable cross-system lineage
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onTriggerToast('Exporting 118,420 Golden Identities to encrypted JSON / CSV...')}
            className="px-4 py-2 rounded-full text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-colors shadow-sm"
          >
            &darr; Export Directory (JSON/CSV)
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className={`${cardCls} rounded-3xl p-4 border flex items-center justify-between gap-4`}>
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by Master ID, full name, email, or national identity token..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full text-xs rounded-full px-4 py-2 border focus-visible:ring-2 focus-visible:ring-blue-500 ${inputBg}`}
          />
        </div>
        <span className={`text-xs font-mono ${textSec}`}>
          Showing {filtered.length} of {goldenRecords.length} identities
        </span>
      </div>

      {/* Master Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((rec) => (
          <div key={rec.id} className={`${cardCls} rounded-3xl p-6 border space-y-4 flex flex-col justify-between`}>
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono text-[11px] text-zinc-500">{rec.masterId}</span>
                  <h3 className="text-base font-serif font-bold mt-0.5">{rec.fullName}</h3>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                  {rec.confidence}% Consensus
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500 w-16 shrink-0">Email:</span>
                  <span className="font-semibold truncate">{rec.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500 w-16 shrink-0">Phone:</span>
                  <span className="font-semibold">{rec.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500 w-16 shrink-0">Address:</span>
                  <span className="font-semibold truncate">{rec.address}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800/80">
                <div className="text-[11px] text-zinc-500 mb-1.5 font-mono">Lineage Origins:</div>
                <div className="flex flex-wrap gap-1.5">
                  {rec.sourcesMerged.map((src) => (
                    <span key={src} className="px-2 py-0.5 rounded-md bg-zinc-800/80 text-zinc-300 text-[10px] font-medium border border-zinc-700/50">
                      {src}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800/80 flex justify-between items-center text-[10px] font-mono text-zinc-500">
              <span title={rec.blockHash}>Block: {rec.blockHash}</span>
              <button
                onClick={() => setSelectedRecord(rec)}
                className="text-blue-400 hover:text-blue-300 underline font-sans text-xs"
              >
                Inspect Lineage &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Lineage Detail Drawer / Modal */}
      {selectedRecord && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className={`rounded-3xl max-w-lg w-full border shadow-2xl p-6 space-y-5 ${cardCls}`}>
            <div className="flex justify-between items-center border-b pb-3 border-zinc-800">
              <div>
                <span className="text-xs font-mono text-emerald-400">Master Record Lineage</span>
                <h3 className="text-lg font-serif font-bold">{selectedRecord.fullName}</h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-zinc-400 hover:text-white p-1 text-lg"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 font-mono space-y-1">
                <div><strong>Master ID:</strong> {selectedRecord.masterId}</div>
                <div><strong>Current Block:</strong> {selectedRecord.blockHash}</div>
                <div><strong>Consensus Confidence:</strong> {selectedRecord.confidence}%</div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Contributing Source Systems:</h4>
                <div className="space-y-2 font-mono">
                  {selectedRecord.sourcesMerged.map((src, i) => (
                    <div key={src} className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 flex justify-between">
                      <span>{i + 1}. {src}</span>
                      <span className="text-emerald-400">Verified Match</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-zinc-800">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
