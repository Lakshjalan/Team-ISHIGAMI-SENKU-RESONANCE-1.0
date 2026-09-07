import React, { useState, useMemo } from 'react';
import MaterialIcon from '../components/icons/MaterialIcon';

// Local data matching the HTML script block
const directoryData = [
  {
    id: 'MST-1004',
    name: 'Rahul Sharma',
    initials: 'RS',
    department: 'Computer Science • 2025',
    regNo: '2021BTCS042',
    email: 'rahul.sharma@alumni.org',
    phone: '+91 98765 43210',
    sources: ['ERP', 'Campus', 'Alumni'],
    confidence: 98,
    status: 'RESOLVED & SEALED • CONFIDENCE: 98%',
    hash: '0x7f8a9e2d...4c1b92e7',
    sourceDetails: [
      { name: 'Core Banking ERP', trust: '95%', rawName: 'Rahul Sharma', field: 'Phone Deterministic', val: '+91 98765 43210', node: 'SRC-ERP-901', note: 'Match Exact', noteIcon: 'check' },
      { name: 'Campus Management SIS', trust: '88%', rawName: 'Rahul Sahrma', field: 'Reg Index', val: '2021BTCS042', node: 'SIS-COL-004', note: 'Resolved Fuzzy 0.94', noteIcon: 'auto_fix_high', typo: true },
      { name: 'Alumni Relations Registry', trust: '75%', rawName: 'rahul.sharma@alumni.org', field: 'Degree Horizon', val: 'B.Tech CS • 2025', node: 'ALUM-SYNC-01', note: 'Identity Merged', noteIcon: 'link' }
    ]
  },
  {
    id: 'MST-1005',
    name: 'Priya Singh',
    initials: 'PS',
    department: 'Chemical Eng • 2024',
    regNo: '2021BCE0192',
    email: 'priya.singh@campus.edu',
    phone: '+91 98111 22334',
    sources: ['ERP', 'Campus'],
    confidence: 94,
    status: 'RESOLVED & SEALED • CONFIDENCE: 94%',
    hash: '0x3a9f02b1...8e44c291',
    sourceDetails: [
      { name: 'Core Banking ERP', trust: '96%', rawName: 'Priya Singh', field: 'Phone Deterministic', val: '+91 98111 22334', node: 'SRC-ERP-902', note: 'Exact Match', noteIcon: 'check' },
      { name: 'Campus Management SIS', trust: '92%', rawName: 'Priya Singh', field: 'Reg Index', val: '2021BCE0192', node: 'SIS-COL-005', note: 'Deterministic Join', noteIcon: 'check' }
    ]
  },
  {
    id: 'MST-1006',
    name: 'Amit Kumar',
    initials: 'AK',
    department: 'Mechanical Eng • 2025',
    regNo: '2021MECH081',
    email: 'amit.k@gmail.com',
    phone: '+91 97112 33445',
    sources: ['ERP', 'Alumni'],
    confidence: 88,
    status: 'RESOLVED (PROVISIONAL) • CONFIDENCE: 88%',
    hash: '0x9d8c43a0...2f1184a2',
    sourceDetails: [
      { name: 'Core Banking ERP', trust: '94%', rawName: 'Amit Kumar', field: 'Reg Index', val: '2021MECH081', node: 'SRC-ERP-903', note: 'High Score Match', noteIcon: 'check' },
      { name: 'Alumni Relations Registry', trust: '82%', rawName: 'amit.k@gmail.com', field: 'Phone Deterministic', val: '+91 97112 33445', node: 'ALUM-SYNC-02', note: 'Probabilistic Linking', noteIcon: 'auto_fix_high' }
    ]
  },
  {
    id: 'MST-1007',
    name: 'Sneha Patel',
    initials: 'SP',
    department: 'Civil Eng • 2026',
    regNo: '2022CIVL055',
    email: 'sneha.p@campus.edu',
    phone: '+91 98223 44556',
    sources: ['ERP', 'Campus', 'Hostel'],
    confidence: 97,
    status: 'RESOLVED & SEALED • CONFIDENCE: 97%',
    hash: '0x5c4b12a8...91ef0023',
    sourceDetails: [
      { name: 'Core Banking ERP', trust: '95%', rawName: 'Sneha Patel', field: 'Reg Index', val: '2022CIVL055', node: 'SRC-ERP-904', note: 'Exact Match', noteIcon: 'check' },
      { name: 'Campus Management SIS', trust: '90%', rawName: 'Sneha Patel', field: 'Phone Deterministic', val: '+91 98223 44556', node: 'SIS-COL-006', note: 'Deterministic Join', noteIcon: 'check' },
      { name: 'Hostel Database', trust: '89%', rawName: 'Sneha Patel', field: 'Campus Room', val: 'Block B-204', node: 'HSTL-DB-01', note: 'Exact Match', noteIcon: 'check' }
    ]
  },
  {
    id: 'MST-1008',
    name: 'Vikram Malhotra',
    initials: 'VM',
    department: 'Electrical Eng • 2024',
    regNo: '2020EE041',
    email: 'v.malhotra@alumni.org',
    phone: '+91 99887 76655',
    sources: ['Campus', 'Alumni'],
    confidence: 91,
    status: 'RESOLVED & SEALED • CONFIDENCE: 91%',
    hash: '0x1b7e44a9...66d92fa4',
    sourceDetails: [
      { name: 'Campus Management SIS', trust: '92%', rawName: 'Vikram Malhotra', field: 'Reg Index', val: '2020EE041', node: 'SIS-COL-007', note: 'Exact Match', noteIcon: 'check' },
      { name: 'Alumni Relations Registry', trust: '88%', rawName: 'v.malhotra@alumni.org', field: 'Phone Deterministic', val: '+91 99887 76655', node: 'ALUM-SYNC-03', note: 'Heuristic Resolved', noteIcon: 'link' }
    ]
  }
];

const GoldenMasterDirectory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecordId, setSelectedRecordId] = useState<string>('MST-1004');

  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return directoryData.filter(d => 
      d.name.toLowerCase().includes(q) || 
      d.email.toLowerCase().includes(q) || 
      d.regNo.toLowerCase().includes(q) ||
      d.id.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const selectedRecord = useMemo(() => {
    return directoryData.find(d => d.id === selectedRecordId) || directoryData[0];
  }, [selectedRecordId]);

  return (
    <div className="flex flex-col w-full">
      <div className="max-w-[1280px] w-full mx-auto px-margin-mobile lg:px-margin-desktop py-8 flex flex-col gap-8">
        
        {/* Top Header & Meta */}
        <header className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            <p className="font-label-md text-label-md tracking-widest text-on-surface-variant uppercase">
              Single Source of Truth • 118,420 Verified Master Identities • Canonical Entity Graph
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
                Golden Master Directory
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-2xl">
                Unified, single-source-of-truth master profiles resolved deterministically and probabilistically across all enterprise input registries.
              </p>
            </div>
            
            {/* Live System Metric Pill */}
            <div className="flex items-center gap-4 self-start md:self-auto bg-surface-container px-4 py-2 rounded-full">
              <div className="flex items-center gap-2">
                <MaterialIcon icon="verified_user" className="text-primary text-[18px]" />
                <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface">SHA-256 Ledger Synchronized</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
              <span className="font-label-md text-label-md text-on-surface-variant">Sync: 12s ago</span>
            </div>
          </div>
        </header>

        {/* KPI Summary Bento Ribbon */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-surface-container-low p-5 rounded-xl flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-surface-container-high/40 rounded-full blur-2xl group-hover:bg-primary/5 transition-all"></div>
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md tracking-wider text-on-surface-variant uppercase">Total Resolved</span>
              <MaterialIcon icon="groups" className="text-on-surface-variant text-[20px]" />
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-display-lg text-headline-lg text-primary font-bold">118,420</span>
              <span className="font-label-md text-label-md text-primary bg-surface-container-high px-2 py-0.5 rounded-full">+1,420 today</span>
            </div>
            <div className="w-full bg-surface-container-highest h-1 rounded-full mt-3 overflow-hidden">
              <div className="bg-primary h-full rounded-full w-[94%]"></div>
            </div>
          </div>
          <div className="bg-surface-container-low p-5 rounded-xl flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-surface-container-high/40 rounded-full blur-2xl group-hover:bg-primary/5 transition-all"></div>
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md tracking-wider text-on-surface-variant uppercase">Avg Graph Confidence</span>
              <MaterialIcon icon="psychology" className="text-on-surface-variant text-[20px]" />
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-display-lg text-headline-lg text-primary font-bold">96.8%</span>
              <span className="font-label-md text-label-md text-primary bg-surface-container-high px-2 py-0.5 rounded-full">↑ 0.4% baseline</span>
            </div>
            <div className="w-full bg-surface-container-highest h-1 rounded-full mt-3 overflow-hidden">
              <div className="bg-primary h-full rounded-full w-[96.8%]"></div>
            </div>
          </div>
          <div className="bg-surface-container-low p-5 rounded-xl flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-surface-container-high/40 rounded-full blur-2xl group-hover:bg-primary/5 transition-all"></div>
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md tracking-wider text-on-surface-variant uppercase">Multi-Source Merges</span>
              <MaterialIcon icon="hub" className="text-on-surface-variant text-[20px]" />
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-display-lg text-headline-lg text-primary font-bold">92.4%</span>
              <span className="font-label-md text-label-md text-on-surface-variant">Across ERP, SIS, Alumni</span>
            </div>
            <div className="w-full bg-surface-container-highest h-1 rounded-full mt-3 overflow-hidden">
              <div className="bg-primary h-full rounded-full w-[92.4%]"></div>
            </div>
          </div>
        </section>

        {/* Filters & Actions Command Ribbon */}
        <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Pill */}
            <div className="relative flex items-center min-w-[280px] sm:w-96">
              <MaterialIcon icon="search" className="absolute left-4 text-on-surface-variant text-[18px]" />
              <input 
                className="w-full bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/70 font-body-md text-label-md pl-11 pr-4 py-2.5 rounded-full focus:outline-none focus:bg-surface-container-high transition-all" 
                placeholder="Search by Golden Name, Email, or Reg No..." 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* Filter Dropdowns */}
            <div className="relative">
              <button className="flex items-center gap-2 bg-surface-container-low hover:bg-surface-container-high text-on-surface px-4 py-2.5 rounded-full font-label-md text-label-md uppercase tracking-wider transition-colors">
                <MaterialIcon icon="domain" className="text-[16px]" />
                <span>All Branches</span>
                <MaterialIcon icon="expand_more" className="text-[16px]" />
              </button>
            </div>
            <div className="relative">
              <button className="flex items-center gap-2 bg-surface-container-low hover:bg-surface-container-high text-on-surface px-4 py-2.5 rounded-full font-label-md text-label-md uppercase tracking-wider transition-colors">
                <MaterialIcon icon="layers" className="text-[16px]" />
                <span>All Linked Sources</span>
                <MaterialIcon icon="expand_more" className="text-[16px]" />
              </button>
            </div>
            <div className="relative">
              <button className="flex items-center gap-2 bg-surface-container-low hover:bg-surface-container-high text-on-surface px-4 py-2.5 rounded-full font-label-md text-label-md uppercase tracking-wider transition-colors">
                <MaterialIcon icon="tune" className="text-[16px]" />
                <span>Min Conf: 85%+</span>
                <MaterialIcon icon="expand_more" className="text-[16px]" />
              </button>
            </div>
          </div>
          {/* Right Export Button */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-primary text-on-primary hover:bg-primary-fixed px-6 py-2.5 rounded-full font-label-md text-label-md uppercase tracking-wider font-semibold transition-colors shadow-md">
              <MaterialIcon icon="download" className="text-[18px]" />
              <span>Export Master Catalog</span>
            </button>
          </div>
        </section>

        {/* Master Layout: Directory Table & Real-time Provenance Drawer */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* Primary Data Table Container */}
          <div className="xl:col-span-7 2xl:col-span-8 bg-surface-container rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col justify-between min-h-[640px]">
            <div>
              {/* Table Header Utility Controls */}
              <div className="flex items-center justify-between pb-4">
                <div className="flex items-center gap-2">
                  <span className="font-label-md text-label-md uppercase tracking-widest text-primary font-bold">Canonical Entities</span>
                  <span className="bg-surface-container-highest px-2 py-0.5 rounded text-on-surface-variant font-label-md text-[10px]">LIVE SYNC</span>
                </div>
                <div className="flex items-center gap-3 text-on-surface-variant font-label-md text-label-md">
                  <span>Sort: Relevance</span>
                  <MaterialIcon icon="filter_list" className="text-[16px] cursor-pointer hover:text-primary" />
                </div>
              </div>
              
              {/* Table Wrapper */}
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-lowest/50 text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
                      <th className="py-3.5 px-3 font-medium">Golden ID</th>
                      <th className="py-3.5 px-3 font-medium">Student Name</th>
                      <th className="py-3.5 px-3 font-medium">Registration No</th>
                      <th className="py-3.5 px-3 font-medium">Primary Contact</th>
                      <th className="py-3.5 px-3 font-medium">Sources</th>
                      <th className="py-3.5 px-3 font-medium">Confidence</th>
                      <th className="py-3.5 px-3 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="font-body-md text-body-md">
                    {filteredData.map(record => (
                      <tr 
                        key={record.id}
                        className={`record-row group hover:bg-surface-container-high transition-colors cursor-pointer ${selectedRecordId === record.id ? 'bg-surface-container-high/80' : ''}`}
                        onClick={() => setSelectedRecordId(record.id)}
                      >
                        <td className="py-4 px-3">
                          <span className="bg-surface-container-lowest text-primary font-mono text-xs px-2.5 py-1 rounded-full inline-block">{record.id}</span>
                        </td>
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center font-label-md text-xs font-semibold text-primary">
                              {record.initials}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-primary font-medium group-hover:text-primary-fixed transition-colors">{record.name}</span>
                              <span className="text-on-surface-variant font-label-md text-[11px]">{record.department}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-3">
                          <span className="font-mono text-xs text-on-surface-variant">{record.regNo}</span>
                        </td>
                        <td className="py-4 px-3">
                          <div className="flex flex-col">
                            <span className="text-xs text-on-surface">{record.email}</span>
                            <span className="font-mono text-[11px] text-on-surface-variant">{record.phone}</span>
                          </div>
                        </td>
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-1 flex-wrap max-w-[130px]">
                            {record.sources.map(src => (
                              <span key={src} className="bg-surface-container-lowest text-on-surface-variant text-[10px] uppercase font-label-md px-2 py-0.5 rounded-full">
                                {src}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-3">
                          <div className="inline-flex items-center gap-1.5 bg-surface-container-lowest px-2.5 py-1 rounded-full">
                            <span className={`w-1.5 h-1.5 rounded-full ${record.confidence >= 90 ? 'bg-primary' : 'bg-on-surface-variant'}`}></span>
                            <span className={`${record.confidence >= 90 ? 'text-primary' : 'text-on-surface'} font-label-md text-xs font-semibold`}>{record.confidence}%</span>
                          </div>
                        </td>
                        <td className="py-4 px-3 text-right">
                          <button className={`px-3 py-1 ${selectedRecordId === record.id ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-primary'} group-hover:bg-primary group-hover:text-on-primary rounded-full font-label-md text-xs uppercase tracking-wider transition-all`}>
                            Audit →
                          </button>
                        </td>
                      </tr>
                    ))}
                    
                    {filteredData.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-on-surface-variant">
                          No matching identities found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Pagination & Footer Stats */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-4 border-t border-outline-variant/30">
              <p className="font-label-md text-label-md text-on-surface-variant">
                Showing <span className="text-primary font-medium">1 - {filteredData.length}</span> of <span className="text-primary font-medium">118,420</span> Master Profiles
              </p>
              <div className="flex items-center gap-1">
                <button className="bg-surface-container-low hover:bg-surface-container-high text-on-surface px-3 py-1.5 rounded-full font-label-md text-xs uppercase tracking-wider transition-colors disabled:opacity-40" disabled>
                  ‹ Prev
                </button>
                <button className="w-8 h-8 rounded-full bg-primary text-on-primary font-label-md text-xs font-bold flex items-center justify-center">
                  1
                </button>
                <button className="w-8 h-8 rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface font-label-md text-xs flex items-center justify-center transition-colors">
                  2
                </button>
                <button className="w-8 h-8 rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface font-label-md text-xs flex items-center justify-center transition-colors">
                  3
                </button>
                <span className="text-on-surface-variant px-1 font-label-md text-xs">…</span>
                <button className="w-12 h-8 rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface font-label-md text-xs flex items-center justify-center transition-colors">
                  23,684
                </button>
                <button className="bg-surface-container-low hover:bg-surface-container-high text-on-surface px-3 py-1.5 rounded-full font-label-md text-xs uppercase tracking-wider transition-colors">
                  Next ›
                </button>
              </div>
            </div>
          </div>

          {/* Slide-Over Profile Provenance Drawer / Live Inspection Panel */}
          <aside className="xl:col-span-5 2xl:col-span-4 bg-surface-container-low rounded-3xl p-6 flex flex-col gap-6 shadow-2xl relative">
            {/* Panel Top Status */}
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span className="font-label-md text-[11px] tracking-widest text-primary uppercase font-bold">Provenance Dossier</span>
              </div>
              <span className="font-label-md text-xs font-mono text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-full">
                REALTIME INSPECTION
              </span>
            </div>
            
            {/* Entity Identity Header */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h2 className="font-headline-md text-headline-md text-primary font-display-lg">
                  {selectedRecord.name}
                </h2>
                <span className="bg-surface-container text-primary font-mono text-xs px-2.5 py-1 rounded-full">
                  {selectedRecord.id}
                </span>
              </div>
              <p className="font-label-md text-xs text-primary flex items-center gap-1.5 mt-1 font-semibold">
                <MaterialIcon icon="verified" className="text-[16px] text-primary" />
                {selectedRecord.status}
              </p>
            </div>
            
            {/* Provenance Traceability Tree */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">Underlying Ingested Records ({selectedRecord.sourceDetails.length})</span>
                <span className="font-label-md text-[11px] text-primary">High Fidelity Consensus</span>
              </div>
              
              {selectedRecord.sourceDetails.map((src, i) => (
                <div key={i} className="bg-surface-container p-4 rounded-xl flex flex-col gap-2 relative overflow-hidden group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="bg-surface-container-highest px-2 py-0.5 rounded font-label-md text-[10px] text-primary font-semibold uppercase">Source {i+1}</span>
                      <span className="font-body-md text-sm font-medium text-primary">{src.name}</span>
                    </div>
                    <span className="font-label-md text-xs text-primary bg-surface-container-highest px-2 py-0.5 rounded-full font-mono">Trust: {src.trust}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 text-on-surface-variant">
                    <div>
                      <span className="font-label-md block text-[10px] uppercase text-on-surface-variant/70">Raw Name {src.typo ? 'Ingest' : ''}</span>
                      <span className={`text-on-surface ${src.typo ? 'line-through opacity-60' : 'font-medium'}`}>{src.rawName}</span>
                      {src.typo && <span className="text-[10px] text-primary block mt-0.5 font-label-md">NLP Phonetic Corrected</span>}
                    </div>
                    <div>
                      <span className="font-label-md block text-[10px] uppercase text-on-surface-variant/70">{src.field}</span>
                      <span className="font-mono text-on-surface">{src.val}</span>
                    </div>
                    <div className="col-span-2 flex items-center justify-between pt-1">
                      <span className="font-mono text-[10px] text-on-surface-variant">Ingest Node: {src.node}</span>
                      <span className="text-[11px] text-primary flex items-center gap-1">
                        <MaterialIcon icon={src.noteIcon} className="text-[14px]" /> {src.note}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Consensus Engine & Cryptographic Hash Footer */}
            <div className="bg-surface-container-lowest p-4 rounded-xl flex flex-col gap-3 mt-auto">
              <div className="flex flex-col gap-1">
                <span className="font-label-md text-[10px] uppercase tracking-widest text-on-surface-variant">Consensus Algorithm</span>
                <p className="font-body-md text-xs text-on-surface font-mono">
                  Multi-Attribute Fuzzy Jaro-Winkler + Exact Deterministic Phone Hash
                </p>
              </div>
              <div className="flex flex-col gap-1 pt-2 border-t border-outline-variant/30">
                <span className="font-label-md text-[10px] uppercase tracking-widest text-on-surface-variant">SHA-256 Cryptographic Hash</span>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-primary font-semibold">{selectedRecord.hash}</span>
                  <MaterialIcon icon="verified" className="text-primary text-[18px]" />
                </div>
              </div>
            </div>
            
            {/* Panel Call to Action */}
            <button className="w-full py-3 px-4 rounded-full bg-primary hover:bg-primary-fixed text-on-primary font-label-md text-label-md uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 shadow-md">
              <span>Open Cryptographic Audit History</span>
              <MaterialIcon icon="arrow_forward" className="text-[16px]" />
            </button>
          </aside>
        </section>

        {/* Visual Ledger Network Metadata Card */}
        <section className="bg-surface-container-low p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary">
              <MaterialIcon icon="account_tree" className="text-[24px]" />
            </div>
            <div>
              <h3 className="font-headline-md text-sm font-semibold text-primary">Consensus Mesh Status: Real-time Partitioning Intact</h3>
              <p className="font-body-md text-xs text-on-surface-variant mt-0.5">
                118,420 identity graphs indexed across 3 federated registries. Cryptographically timestamped on Immutable Raft Cluster.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-on-surface-variant bg-surface-container px-3 py-1.5 rounded-full">BLOCK #8,941,204</span>
            <a href="#" className="font-label-md text-label-md uppercase tracking-wider text-primary hover:underline flex items-center gap-1">
              <span>Inspect Block Proof</span>
              <MaterialIcon icon="open_in_new" className="text-[14px]" />
            </a>
          </div>
        </section>
        
      </div>
    </div>
  );
};

export default GoldenMasterDirectory;
