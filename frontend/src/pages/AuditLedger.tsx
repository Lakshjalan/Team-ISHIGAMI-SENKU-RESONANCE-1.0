import React, { useState } from 'react';
import MaterialIcon from '../components/icons/MaterialIcon';
import Toast from '../components/ui/Toast';
import { AUDIT_RECORDS } from '../data/mockData';
import { Page } from '../components/layout/Header';

interface AuditLedgerProps {
  onNavigate?: (page: Page) => void;
}

export default function AuditLedger({ onNavigate: _onNavigate }: AuditLedgerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredRecords = AUDIT_RECORDS.filter((rec) => {
    const matchesSearch =
      rec.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.masterId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.field.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.operator.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' ? true : rec.actionType === typeFilter;
    return matchesSearch && matchesType;
  });

  const exportAuditReport = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(AUDIT_RECORDS, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'reconcile_audit_trail.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setToastMessage('Exported official audit trail to JSON.');
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#201f1f]">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight font-['Libre_Caslon_Text']">
            Evidence & Audit Trail
          </h1>
          <p className="text-sm text-[#8e9192] mt-1 max-w-xl">
            Immutable log of all automated reconciliations, operator approvals, and manual overrides.
          </p>
        </div>

        <button
          onClick={exportAuditReport}
          className="px-4 py-2.5 rounded-lg bg-white hover:bg-[#e2e2e2] text-[#131313] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-sm"
        >
          <MaterialIcon name="download" size={16} />
          <span>Export Audit Log</span>
        </button>
      </div>

      {/* Audit Stats Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Reconciliations', val: '102,880', desc: 'Resolved entities', icon: 'check_circle' },
          { label: 'Engine Auto-Resolved', val: '98,240', desc: '95.5% automated', icon: 'auto_fix_high' },
          { label: 'Human Approvals', val: '4,280', desc: 'Triage verified', icon: 'verified' },
          { label: 'Manual Overrides', val: '360', desc: 'Custom operator edits', icon: 'edit_note' },
        ].map((stat, i) => (
          <div
            key={i}
            className="p-4 rounded-xl bg-[#1c1b1b] border border-[#2a2a2a] flex items-center justify-between"
          >
            <div>
              <span className="text-[11px] text-[#8e9192] uppercase tracking-wider block font-medium">
                {stat.label}
              </span>
              <span className="text-2xl font-bold text-white font-['Libre_Caslon_Text']">
                {stat.val}
              </span>
              <span className="text-[11px] text-[#c4c7c8] block mt-0.5">{stat.desc}</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#131313] border border-[#2a2a2a] flex items-center justify-center text-white shrink-0">
              <MaterialIcon name={stat.icon} size={20} />
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <MaterialIcon
            name="search"
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e9192]"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search audit trail by entity, field, or operator..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1c1b1b] border border-[#2a2a2a] text-xs text-white placeholder-[#8e9192] focus:outline-none focus:border-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          {[
            { id: 'all', label: 'All Decisions' },
            { id: 'AUTO_RESOLVE', label: 'Auto-Resolved' },
            { id: 'MANUAL_APPROVAL', label: 'Manual Approval' },
            { id: 'OVERRIDE', label: 'Override' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTypeFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                typeFilter === tab.id
                  ? 'bg-white text-[#131313]'
                  : 'bg-[#1c1b1b] text-[#c4c7c8] hover:text-white border border-[#2a2a2a]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline of Decisions */}
      <div className="flex flex-col gap-4">
        {filteredRecords.length === 0 ? (
          <div className="p-12 rounded-2xl bg-[#1c1b1b] border border-[#2a2a2a] text-center text-[#8e9192]">
            No audit records matched your filter criteria.
          </div>
        ) : (
          filteredRecords.map((record) => (
            <div
              key={record.id}
              className="p-5 rounded-2xl bg-[#1c1b1b] border border-[#2a2a2a] flex flex-col gap-3 hover:border-[#353534] transition-all shadow-sm"
            >
              {/* Event Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#201f1f]">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      record.actionType === 'AUTO_RESOLVE'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : record.actionType === 'MANUAL_APPROVAL'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {record.actionType.replace('_', ' ')}
                  </span>
                  <span className="text-sm font-bold text-white">
                    {record.entityName}
                  </span>
                  <span className="text-xs font-mono text-[#8e9192]">
                    ({record.masterId})
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#8e9192]">
                  <span>Operator: <strong className="text-[#c4c7c8]">{record.operator}</strong></span>
                  <span>•</span>
                  <span>{record.timestamp}</span>
                </div>
              </div>

              {/* Resolution Diff */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-lg bg-[#131313] border border-[#2a2a2a]">
                  <span className="text-[10px] text-[#8e9192] uppercase font-bold block mb-1">
                    Previous Discrepancy / Competing Value:
                  </span>
                  <span className="text-xs font-mono text-amber-300 line-through">
                    {record.previousValue}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-[#131313] border border-[#2a2a2a]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-[#8e9192] uppercase font-bold">
                      Sealed Golden Value:
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold">
                      Source: {record.selectedSource}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    {record.resolvedValue}
                  </span>
                </div>
              </div>

              {/* Rationale */}
              <div className="flex items-start gap-2 text-xs text-[#c4c7c8] pt-1">
                <MaterialIcon name="info" size={16} className="text-[#8e9192] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="text-white">Decision Rationale:</strong> {record.rationale}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
