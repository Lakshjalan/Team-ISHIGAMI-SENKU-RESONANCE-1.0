import React, { useState } from 'react';
import { RunRecord, AuditLogEntry } from '../types';

interface CryptographicAuditLedgerProps {
  darkMode: boolean;
  runs: RunRecord[];
  auditLogs: AuditLogEntry[];
  onTriggerToast: (msg: string) => void;
}

export const CryptographicAuditLedger: React.FC<CryptographicAuditLedgerProps> = ({
  darkMode,
  runs,
  auditLogs,
  onTriggerToast,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'auto' | 'human' | 'system'>('all');

  const cardCls = darkMode ? 'bg-[#1c1b1b] border-[#353534]' : 'bg-white border-slate-200 shadow-xs';
  const elevatedCls = darkMode ? 'bg-[#201f1f] border-[#3a3939]' : 'bg-white border-slate-200 shadow-xs';
  const textSec = darkMode ? 'text-[#a1a1aa]' : 'text-slate-600';
  const rowHover = darkMode ? 'hover:bg-[#201f1f]/80' : 'hover:bg-slate-50';

  const copyHash = (hash: string) => {
    navigator.clipboard?.writeText(hash);
    onTriggerToast(`Copied hash to clipboard: ${hash.slice(0, 18)}...`);
  };

  const filteredLogs = auditLogs.filter((log) => filterType === 'all' || log.type === filterType);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className={`${elevatedCls} rounded-3xl p-6 border flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div>
          <h2 className="text-2xl font-serif font-bold tracking-tight">Cryptographic Audit Ledger &amp; Integrity Timeline</h2>
          <p className={`text-xs ${textSec} mt-1`}>
            Immutable SHA-256 block receipts verifying zero data drift across all identity runs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full font-semibold">
            Ledger Chain Height: #8804 &bull; Cryptographically Verified
          </span>
        </div>
      </div>

      {/* Ingestion Execution Runs Table */}
      <div className={`${cardCls} rounded-3xl border overflow-hidden`}>
        <div className="px-6 py-4 border-b border-zinc-800/80 font-serif font-bold text-base flex justify-between items-center">
          <span>Recent Execution Runs</span>
          <span className="font-mono text-xs font-normal text-zinc-500">{runs.length} Recorded Runs</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`border-b ${darkMode ? 'border-zinc-800 bg-[#161515] text-zinc-400' : 'border-slate-200 bg-slate-100 text-slate-600'} font-mono uppercase tracking-wider`}>
              <tr>
                <th className="px-6 py-3.5">Run ID</th>
                <th className="px-6 py-3.5">Timestamp</th>
                <th className="px-6 py-3.5">Records Processed</th>
                <th className="px-6 py-3.5">Integrity Metric</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Operator</th>
                <th className="px-6 py-3.5">SHA-256 Digest</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-zinc-800/80' : 'divide-slate-200'}`}>
              {runs.map((r) => (
                <tr key={r.id} className={`${rowHover} transition-colors`}>
                  <td className="px-6 py-4 font-mono font-bold text-blue-400">{r.id}</td>
                  <td className="px-6 py-4">{r.timestamp}</td>
                  <td className="px-6 py-4 font-mono">{r.recordCount.toLocaleString()}</td>
                  <td className="px-6 py-4 font-mono font-semibold text-emerald-400">{r.confidence}%</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-400">{r.operator}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => copyHash(r.hash)}
                      className="font-mono text-[11px] text-zinc-400 hover:text-white bg-zinc-900 px-2 py-1 rounded border border-zinc-800 flex items-center gap-1.5 transition-colors"
                      title="Click to copy full SHA-256 hash"
                    >
                      <span className="truncate max-w-[120px]">{r.hash}</span>
                      <svg className="w-3 h-3 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Continuous Event Stream */}
      <div className={`${cardCls} rounded-3xl p-6 border space-y-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif font-bold text-base">Continuous Tamper-Evident Event Stream</h3>
            <p className={`text-xs ${textSec} mt-0.5`}>Audited chronological log of identity operations</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1">
            {(['all', 'auto', 'human', 'system'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded-full text-xs font-mono uppercase transition-colors ${
                  filterType === t
                    ? 'bg-blue-600 text-white font-bold'
                    : darkMode ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-2xl border border-zinc-800/60 bg-zinc-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3">
                <span
                  className={`h-2.5 w-2.5 rounded-full mt-1 shrink-0 ${
                    log.type === 'human' ? 'bg-amber-400' : log.type === 'auto' ? 'bg-emerald-400' : 'bg-blue-400'
                  }`}
                ></span>
                <div>
                  <div className="font-semibold text-sm">{log.action}</div>
                  <div className={`text-xs ${textSec} mt-0.5`}>{log.details}</div>
                  <div className="text-[11px] font-mono text-zinc-500 mt-1">
                    Operator: <span className="text-zinc-400">{log.operator}</span> &bull; {log.time}
                  </div>
                </div>
              </div>
              <button
                onClick={() => copyHash(log.blockHash)}
                className="font-mono text-[11px] text-zinc-500 hover:text-white bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800 shrink-0 text-left transition-colors"
              >
                Block: {log.blockHash}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
