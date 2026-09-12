import React, { useState, useEffect } from 'react';
import MaterialIcon from '../components/icons/MaterialIcon';
import Toast from '../components/ui/Toast';
import Modal from '../components/ui/Modal';
import { Page } from '../components/layout/Header';
import { API_BASE } from '../services/api';

export interface GoldenRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  confidence: number;
  status: 'Verified' | 'Pending Review';
}

interface GoldenMasterDirectoryProps {
  onNavigate?: (page: Page) => void;
}

export default function GoldenMasterDirectory({ onNavigate: _onNavigate }: GoldenMasterDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Verified' | 'Pending Review'>('All');
  const [selectedRecord, setSelectedRecord] = useState<GoldenRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [records, setRecords] = useState<GoldenRecord[]>([]);

  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const response = await fetch(`${API_BASE}/entities/master`);
        if (response.ok) {
          const data = await response.json();
          const mapped = data.master_students.map((m: any) => ({
            id: m.id,
            name: m.golden_name || 'N/A',
            email: m.golden_email || 'N/A',
            phone: m.golden_phone_number || 'N/A',
            department: m.golden_branch || 'N/A',
            confidence: Math.round(m.confidence_score * 100),
            status: m.confidence_score >= 0.85 ? 'Verified' : 'Pending Review'
          }));
          setRecords(mapped);
        }
      } catch (err) {
        console.error('Failed to fetch master records', err);
      }
    };
    fetchMasters();
  }, []);

  const filteredRecords = records.filter((rec) => {
    const matchesSearch =
      rec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' ? true : rec.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportCSV = () => {
    const headers = ['Master ID', 'Name', 'Email', 'Phone', 'Department', 'Confidence', 'Status'];
    const rows = filteredRecords.map((r) => [
      r.id,
      r.name,
      r.email,
      r.phone,
      r.department,
      `${r.confidence}%`,
      r.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'golden_master_records.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage('Exported Golden Master records to CSV.');
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#201f1f]">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight font-['Libre_Caslon_Text']">
            Golden Master Directory
          </h1>
          <p className="text-sm text-[#8e9192] mt-1 max-w-xl">
            Unified entity profiles synthesized from multiple conflicting datasets. Each field maintains verified source provenance.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="px-4 py-2.5 rounded-lg bg-white hover:bg-[#e2e2e2] text-[#131313] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-sm"
        >
          <MaterialIcon name="download" size={16} />
          <span>Export Master CSV</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search Box */}
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
            placeholder="Search by name, email, department, or Master ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1c1b1b] border border-[#2a2a2a] text-xs text-white placeholder-[#8e9192] focus:outline-none focus:border-white transition-colors"
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-2">
          {(['All', 'Verified', 'Pending Review'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                statusFilter === filter
                  ? 'bg-white text-[#131313]'
                  : 'bg-[#1c1b1b] text-[#c4c7c8] hover:text-white border border-[#2a2a2a]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Master Records Table */}
      <div className="rounded-2xl bg-[#1c1b1b] border border-[#2a2a2a] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#2a2a2a] bg-[#131313] text-[#8e9192] font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Master ID</th>
                <th className="py-3.5 px-4">Entity Profile</th>
                <th className="py-3.5 px-4">Golden Email</th>
                <th className="py-3.5 px-4">Golden Phone</th>
                <th className="py-3.5 px-4">Confidence</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Provenance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#201f1f]">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#8e9192]">
                    No master records matched your search query.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-[#201f1f] transition-colors group cursor-pointer"
                    onClick={() => setSelectedRecord(record)}
                  >
                    <td className="py-4 px-4 font-mono text-white font-bold">{record.id}</td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-white block">{record.name}</span>
                      <span className="text-[11px] text-[#8e9192]">{record.department}</span>
                    </td>
                    <td className="py-4 px-4 font-mono text-[#c4c7c8]">{record.email}</td>
                    <td className="py-4 px-4 font-mono text-[#c4c7c8]">{record.phone}</td>
                    <td className="py-4 px-4">
                      <span className="font-mono font-bold text-emerald-400 bg-[#131313] px-2 py-0.5 rounded border border-[#2a2a2a]">
                        {record.confidence}%
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          record.status === 'Verified'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-amber-500/10 text-amber-400'
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRecord(record);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#2a2a2a] group-hover:bg-white group-hover:text-[#131313] text-white text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1"
                      >
                        <span>Evidence</span>
                        <MaterialIcon name="visibility" size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provenance Inspection Modal */}
      {selectedRecord && (
        <Modal open={true} onClose={() => setSelectedRecord(null)}>
          <div className="flex flex-col gap-5 text-[#e5e2e1]">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#2a2a2a]">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
                  {selectedRecord.id} • {selectedRecord.confidence}% Resolution Confidence
                </span>
                <h3 className="text-2xl font-bold text-white font-['Libre_Caslon_Text'] mt-0.5">
                  {selectedRecord.name}
                </h3>
                <span className="text-xs text-[#8e9192]">{selectedRecord.department}</span>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1 rounded-lg text-[#8e9192] hover:text-white hover:bg-[#2a2a2a]"
              >
                <MaterialIcon name="close" size={20} />
              </button>
            </div>

            {/* Explanation Note */}
            <div className="p-3 rounded-xl bg-[#201f1f] border border-[#2a2a2a] text-xs flex items-start gap-2.5">
              <MaterialIcon name="account_tree" size={18} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block mb-0.5">Multi-Source Provenance Trail:</span>
                <p className="text-[#c4c7c8]">
                  This master record combines attributes from {selectedRecord.sourcesCount} independent datasets.
                  Each field value has been selected based on source authority weights and cross-source consensus.
                </p>
              </div>
            </div>

            {/* Field Breakdown Grid */}
            <div className="flex flex-col gap-3">
              {[
                {
                  label: 'Reconciled Full Name',
                  value: selectedRecord.name,
                  source: selectedRecord.provenance.nameSource,
                  icon: 'person',
                },
                {
                  label: 'Golden Contact Email',
                  value: selectedRecord.email,
                  source: selectedRecord.provenance.emailSource,
                  icon: 'mail',
                },
                {
                  label: 'Verified Phone Number',
                  value: selectedRecord.phone,
                  source: selectedRecord.provenance.phoneSource,
                  icon: 'call',
                },
                {
                  label: 'Assigned Department',
                  value: selectedRecord.department,
                  source: selectedRecord.provenance.departmentSource,
                  icon: 'domain',
                },
              ].map((f, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-[#131313] border border-[#2a2a2a] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#201f1f] flex items-center justify-center text-white shrink-0">
                      <MaterialIcon name={f.icon} size={16} />
                    </div>
                    <div>
                      <span className="text-[11px] text-[#8e9192] uppercase tracking-wider block font-semibold">
                        {f.label}
                      </span>
                      <span className="font-mono text-sm font-bold text-white">{f.value}</span>
                    </div>
                  </div>

                  <div className="text-right sm:text-right text-xs">
                    <span className="text-[10px] text-[#8e9192] uppercase block">Selected Source:</span>
                    <span className="text-emerald-400 font-semibold">{f.source}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-[#2a2a2a]">
              <span className="text-xs text-[#8e9192]">Last updated {selectedRecord.lastUpdated}</span>
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-5 py-2 rounded-lg bg-white text-[#131313] text-xs font-bold uppercase tracking-wider hover:bg-[#e2e2e2]"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
