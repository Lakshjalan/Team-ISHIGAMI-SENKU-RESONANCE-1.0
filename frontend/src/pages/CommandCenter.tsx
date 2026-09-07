import React, { useState } from 'react';
import MaterialIcon from '../components/icons/MaterialIcon';
import MetricCard from '../components/ui/MetricCard';
import PipelineStepper from '../components/ui/PipelineStepper';
import Toast from '../components/ui/Toast';
import Modal from '../components/ui/Modal';
import { METRIC_CARDS, PIPELINE_STAGES, CONFLICTS, type ConflictItem } from '../data/mockData';

export default function CommandCenter() {
  const [activeTab, setActiveTab] = useState<'cc' | 'at'>('cc');
  const [selectedConflict, setSelectedConflict] = useState<ConflictItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
  };

  const handleOpenModal = (conflict: ConflictItem) => {
    setSelectedConflict(conflict);
  };

  const handleCloseModal = () => {
    setSelectedConflict(null);
  };

  const handleAction = (msg: string) => {
    triggerToast(msg);
    handleCloseModal();
  };

  return (
    <div className="flex flex-col gap-10">
      <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />

      {/* 1. Hero Header Area */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4">
        <div className="flex flex-col gap-3 max-w-2xl">
          {/* Sub-badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-surface-container-high w-fit shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="font-['Geist'] text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              OPERATIONAL • RUN #1048 • SYNCED JUST NOW
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-['Libre_Caslon_Text'] text-4xl lg:text-5xl font-semibold tracking-tight text-primary mt-1">
            Good morning, Admin
          </h1>

          {/* Subtitle */}
          <p className="font-['Geist'] text-base text-on-surface-variant max-w-xl">
            Automated multi-source identity deduplication & entity resolution runtime. Cluster state nominal across 12 ingestion nodes.
          </p>
        </div>

        {/* Actions & Segmented Control */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center p-1 bg-surface-container rounded-full shadow-inner">
            <button
              onClick={() => setActiveTab('cc')}
              className={`px-5 py-2 rounded-full font-['Geist'] text-xs font-semibold tracking-wider uppercase transition-all ${
                activeTab === 'cc'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Command Center
            </button>
            <button
              onClick={() => setActiveTab('at')}
              className={`px-5 py-2 rounded-full font-['Geist'] text-xs font-semibold tracking-wider uppercase transition-all ${
                activeTab === 'at'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Audit & Telemetry
            </button>
          </div>

          <button
            onClick={() => triggerToast('Initiating automated cluster reconciliation batch #1049...')}
            className="h-11 px-6 bg-primary text-on-primary rounded-full font-['Geist'] text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-primary-fixed transition-colors shadow-md group"
          >
            <MaterialIcon name="add" size={18} className="group-hover:rotate-90 transition-transform" />
            <span>New Run</span>
          </button>
        </div>
      </header>

      {/* TAB 1: COMMAND CENTER VIEW */}
      {activeTab === 'cc' && (
        <div className="flex flex-col gap-10">
          {/* 2. Bento Grid Metric Cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {METRIC_CARDS.map((card, i) => (
              <MetricCard
                key={i}
                icon={card.icon}
                label={card.label}
                value={card.value}
                badge={card.badge}
                badgeVariant={i === 2 ? 'filled' : 'default'}
                footerLeft={card.footerLeft}
                footerRight={card.footerRight}
                progress={card.progress}
              />
            ))}
          </section>

          {/* 3. Resolution Pipeline Stepper Bar */}
          <PipelineStepper stages={PIPELINE_STAGES} />

          {/* 4. Centerpiece: Needs Your Attention Module */}
          <section className="bg-surface-container rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <h2 className="font-['Libre_Caslon_Text'] text-2xl font-semibold text-primary">Needs Your Attention</h2>
                  <span className="px-3 py-1 rounded-full bg-surface-container-highest text-primary font-['Geist'] text-xs font-semibold tracking-wider">
                    {CONFLICTS.length} PENDING
                  </span>
                </div>
                <p className="font-['Geist'] text-sm text-on-surface-variant">
                  High-entropy candidate matches below confidence thresholds requiring manual operator review.
                </p>
              </div>

              <div className="flex items-center gap-4 text-on-surface-variant">
                <span className="font-['Geist'] text-xs font-semibold uppercase tracking-widest bg-surface-container-high px-3 py-1.5 rounded-full">
                  HEURISTICS BLOCKED
                </span>
                <button
                  onClick={() => triggerToast('Loading comprehensive conflict archive...')}
                  className="font-['Geist'] text-xs font-semibold uppercase tracking-wider text-primary hover:underline flex items-center gap-1"
                >
                  <span>View Batch History</span>
                  <MaterialIcon name="arrow_forward" size={16} />
                </button>
              </div>
            </div>

            {/* Conflict Cards Stack */}
            <div className="flex flex-col gap-4">
              {CONFLICTS.slice(0, 3).map((conflict) => {
                const initials = conflict.name.split(' ').map(n => n[0]).join('');
                return (
                  <div
                    key={conflict.id}
                    className="bg-surface-container-low rounded-2xl p-5 md:p-6 shadow-sm hover:bg-surface-container-high transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                  >
                    <div className="flex items-start md:items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center font-['Geist'] text-sm font-bold text-primary flex-shrink-0">
                        {initials}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="font-['Geist'] text-base font-semibold text-primary">{conflict.name}</span>
                          <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-['Geist'] text-[11px] uppercase tracking-wider">
                            {conflict.field}
                          </span>
                          <span className="font-['Geist'] text-xs text-primary tracking-wider font-semibold">
                            {conflict.confidence}% MATCH
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-2 font-['Geist'] text-xs text-on-surface-variant">
                          <span className="bg-surface-container px-2.5 py-1 rounded-md text-primary font-mono">
                            {conflict.sourceA.value} <span className="text-on-surface-variant text-[11px]">({conflict.sourceA.name.split(' ')[0]} {conflict.sourceA.trust}%)</span>
                          </span>
                          <span className="text-on-surface-variant/60">↔</span>
                          <span className="bg-surface-container px-2.5 py-1 rounded-md text-primary font-mono">
                            {conflict.sourceB.value} <span className="text-on-surface-variant text-[11px]">({conflict.sourceB.name.split(' ')[0]} {conflict.sourceB.trust}%)</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => handleOpenModal(conflict)}
                        className="px-6 py-2.5 bg-primary text-on-primary rounded-full font-['Geist'] text-xs font-semibold uppercase tracking-wider hover:bg-primary-fixed transition-colors flex items-center gap-2 shadow-sm"
                      >
                        <span>Review</span>
                        <MaterialIcon name="arrow_forward" size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-on-surface-variant font-['Geist'] text-xs uppercase tracking-wider gap-2">
              <span>CANDIDATE RECORDS SORTED BY MATCH CONFIDENCE</span>
              <span className="text-primary font-medium">QUEUE LATENCY: 0.14ms</span>
            </div>
          </section>

          {/* 5. Topology & Node Overview */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-surface-container-low rounded-3xl p-8 shadow-sm flex flex-col justify-between gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-['Libre_Caslon_Text'] text-2xl font-semibold text-primary">Identity Graph Convergence</h3>
                  <p className="font-['Geist'] text-sm text-on-surface-variant mt-1">Multi-modal vector embedding alignment in latent coordinate space.</p>
                </div>
                <span className="font-['Geist'] text-xs uppercase tracking-widest text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full">
                  HDBSCAN + COSINE
                </span>
              </div>

              {/* Vector Graph SVG */}
              <div className="w-full h-56 bg-surface-container-lowest rounded-2xl flex items-center justify-center p-4 relative overflow-hidden">
                <svg className="w-full h-full text-on-surface-variant" fill="none" viewBox="0 0 700 200" xmlns="http://www.w3.org/2000/svg">
                  <line stroke="currentColor" strokeDasharray="4 4" strokeOpacity="0.1" x1="50" x2="650" y1="40" y2="40" />
                  <line stroke="currentColor" strokeDasharray="4 4" strokeOpacity="0.1" x1="50" x2="650" y1="100" y2="100" />
                  <line stroke="currentColor" strokeDasharray="4 4" strokeOpacity="0.1" x1="50" x2="650" y1="160" y2="160" />
                  <path d="M120 100 C 220 50, 260 90, 350 95" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" />
                  <path d="M120 160 C 220 150, 260 110, 350 95" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" />
                  <path d="M120 40 C 220 50, 260 85, 350 95" stroke="currentColor" strokeOpacity="0.6" strokeWidth="2" />
                  <path d="M350 95 C 440 95, 480 120, 580 100" stroke="#ffffff" strokeWidth="2.5" />
                  <circle cx="120" cy="40" fill="#ffffff" r="7" />
                  <text fill="#c4c7c8" fontFamily="Geist" fontSize="11" textAnchor="middle" x="120" y="24">SOURCE_ERP</text>
                  <circle cx="120" cy="100" fill="#c4c7c8" r="6" />
                  <text fill="#c4c7c8" fontFamily="Geist" fontSize="11" textAnchor="middle" x="120" y="85">CAMPUS_SIS</text>
                  <circle cx="120" cy="160" fill="#8e9192" r="6" />
                  <text fill="#c4c7c8" fontFamily="Geist" fontSize="11" textAnchor="middle" x="120" y="182">ALUMNI_NET</text>
                  <circle cx="350" cy="95" fill="#2a2a2a" r="11" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="350" cy="95" fill="#ffffff" r="4" />
                  <text fill="#ffffff" fontFamily="Geist" fontSize="11" fontWeight="600" textAnchor="middle" x="350" y="125">FUZZY CLUSTER #409</text>
                  <circle cx="580" cy="100" fill="#ffffff" r="14" />
                  <text fill="#131313" fontFamily="Geist" fontSize="11" fontWeight="700" textAnchor="middle" x="580" y="104">ID</text>
                  <text fill="#ffffff" fontFamily="Geist" fontSize="11" fontWeight="600" textAnchor="middle" x="580" y="132">GOLDEN MASTER ENTITY</text>
                </svg>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-surface-container p-3 rounded-xl">
                  <span className="font-['Geist'] text-xs text-on-surface-variant block uppercase">Cosine Distance</span>
                  <span className="font-['Libre_Caslon_Text'] text-2xl font-semibold text-primary mt-1">0.042</span>
                </div>
                <div className="bg-surface-container p-3 rounded-xl">
                  <span className="font-['Geist'] text-xs text-on-surface-variant block uppercase">Entropy Shift</span>
                  <span className="font-['Libre_Caslon_Text'] text-2xl font-semibold text-primary mt-1">-18.3%</span>
                </div>
                <div className="bg-surface-container p-3 rounded-xl">
                  <span className="font-['Geist'] text-xs text-on-surface-variant block uppercase">F1 Accuracy</span>
                  <span className="font-['Libre_Caslon_Text'] text-2xl font-semibold text-primary mt-1">99.12%</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-surface-container-low rounded-3xl p-8 shadow-sm flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-1">
                <span className="font-['Geist'] text-xs text-on-surface-variant uppercase tracking-widest">Runtime Fabric</span>
                <h3 className="font-['Libre_Caslon_Text'] text-2xl font-semibold text-primary">Cluster Topology</h3>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  { name: 'NODE-CENTRAL-ALPHA', role: 'Deterministic Hashing', latency: '42μs' },
                  { name: 'NODE-CENTRAL-BETA', role: 'Jaro-Winkler Similarity', latency: '89μs' },
                  { name: 'NODE-ENCLAVE-OMEGA', role: 'Zero-Knowledge Tokenizer', latency: '114μs' },
                ].map((node) => (
                  <div key={node.name} className="p-3.5 rounded-xl bg-surface-container flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      <div>
                        <span className="font-['Geist'] text-xs text-primary block font-semibold">{node.name}</span>
                        <span className="text-[11px] text-on-surface-variant">{node.role}</span>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-on-surface">{node.latency}</span>
                  </div>
                ))}
              </div>

              <div className="bg-surface-container-highest p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MaterialIcon name="lock" size={20} className="text-primary" />
                  <span className="font-['Geist'] text-xs font-semibold text-primary uppercase tracking-wider">PII Vault Enclave</span>
                </div>
                <span className="font-['Geist'] text-xs text-on-surface-variant uppercase">AES-256 GCM</span>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* TAB 2: AUDIT & TELEMETRY VIEW */}
      {activeTab === 'at' && (
        <div className="flex flex-col gap-8">
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-container-low rounded-3xl p-8 shadow-sm">
              <span className="font-['Geist'] text-xs uppercase tracking-wider text-on-surface-variant block">Enterprise Source Reliability</span>
              <h4 className="font-['Libre_Caslon_Text'] text-3xl font-semibold text-primary mt-2">Weight Distribution</h4>
              <div className="mt-6 flex flex-col gap-3 font-['Geist'] text-xs">
                {[
                  { name: 'Corporate Central ERP', wt: '0.95 WT', pct: 95 },
                  { name: 'Campus SIS Directory', wt: '0.88 WT', pct: 88 },
                  { name: 'Alumni Association Database', wt: '0.75 WT', pct: 75 },
                ].map((s) => (
                  <div key={s.name}>
                    <div className="flex justify-between text-on-surface mb-1">
                      <span>{s.name}</span>
                      <span className="font-mono">{s.wt}</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface-container-low rounded-3xl p-8 shadow-sm">
              <span className="font-['Geist'] text-xs uppercase tracking-wider text-on-surface-variant block">Immutable Ledger Status</span>
              <h4 className="font-['Libre_Caslon_Text'] text-3xl font-semibold text-primary mt-2">Block #8,941,200</h4>
              <div className="mt-6 flex flex-col gap-2 font-mono text-xs text-on-surface-variant">
                <p><span className="text-primary font-bold">Merkle Root:</span> 9f82...c74a01</p>
                <p><span className="text-primary font-bold">Last Hash:</span> 00000a42f88b71d9</p>
                <p><span className="text-primary font-bold">Signers:</span> 5 of 5 Quorum Active</p>
                <p><span className="text-primary font-bold">Timestamp:</span> 2025-02-23T11:42:09Z</p>
              </div>
            </div>

            <div className="bg-surface-container-low rounded-3xl p-8 shadow-sm">
              <span className="font-['Geist'] text-xs uppercase tracking-wider text-on-surface-variant block">Realtime Ingestion Throughput</span>
              <h4 className="font-['Libre_Caslon_Text'] text-3xl font-semibold text-primary mt-2">24,400 rec/s</h4>
              <p className="font-['Geist'] text-sm text-on-surface-variant mt-2">
                Peak sustained throughput on parquet streaming partitions. Zero pipeline backpressure.
              </p>
            </div>
          </section>
        </div>
      )}

      {/* Inspection Modal */}
      {selectedConflict && (
        <Modal open={true} onClose={handleCloseModal}>
          <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-['Geist'] text-xs uppercase tracking-wider text-on-surface-variant">Conflict Resolution Inspector</span>
                  <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary font-['Geist'] text-xs font-bold">
                    {selectedConflict.confidence}% MATCH
                  </span>
                </div>
                <h3 className="font-['Libre_Caslon_Text'] text-2xl font-semibold text-primary">{selectedConflict.name}</h3>
                <p className="font-['Geist'] text-xs text-on-surface-variant uppercase tracking-wider">{selectedConflict.type}</p>
              </div>
              <button onClick={handleCloseModal} className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
                <MaterialIcon name="close" size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Source A */}
              <div className="bg-surface-container rounded-2xl p-5 flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-['Geist'] text-xs uppercase tracking-wider text-primary font-bold">{selectedConflict.sourceA.name}</span>
                    <span className="font-mono text-xs text-on-surface-variant">Trust: {selectedConflict.sourceA.trust}%</span>
                  </div>
                  <div className="p-3 bg-surface-container-lowest rounded-xl">
                    <span className="font-['Geist'] text-[11px] uppercase text-on-surface-variant block mb-1">Record Value</span>
                    <span className="font-mono text-sm text-primary break-all">{selectedConflict.sourceA.value}</span>
                  </div>
                  <p className="font-['Geist'] text-xs text-on-surface-variant mt-1">{selectedConflict.sourceA.extra}</p>
                </div>
                <button
                  onClick={() => handleAction('Merged: Adopted Record from Source A as Golden Master')}
                  className="w-full py-2.5 bg-surface-container-high hover:bg-surface-bright text-primary rounded-full font-['Geist'] text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Adopt Source A
                </button>
              </div>

              {/* Source B */}
              <div className="bg-surface-container rounded-2xl p-5 flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-['Geist'] text-xs uppercase tracking-wider text-primary font-bold">{selectedConflict.sourceB.name}</span>
                    <span className="font-mono text-xs text-on-surface-variant">Trust: {selectedConflict.sourceB.trust}%</span>
                  </div>
                  <div className="p-3 bg-surface-container-lowest rounded-xl">
                    <span className="font-['Geist'] text-[11px] uppercase text-on-surface-variant block mb-1">Record Value</span>
                    <span className="font-mono text-sm text-primary break-all">{selectedConflict.sourceB.value}</span>
                  </div>
                  <p className="font-['Geist'] text-xs text-on-surface-variant mt-1">{selectedConflict.sourceB.extra}</p>
                </div>
                <button
                  onClick={() => handleAction('Merged: Adopted Record from Source B as Golden Master')}
                  className="w-full py-2.5 bg-surface-container-high hover:bg-surface-bright text-primary rounded-full font-['Geist'] text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Adopt Source B
                </button>
              </div>
            </div>

            {/* Heuristic Explanation */}
            <div className="bg-surface-container p-4 rounded-2xl flex items-start gap-3">
              <MaterialIcon name="psychology" size={20} className="text-primary flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-['Geist'] text-xs text-primary uppercase tracking-wider block font-semibold">Reconcile.ai Heuristic Inference</span>
                <p className="font-['Geist'] text-sm text-on-surface-variant mt-1">{selectedConflict.notes}</p>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                onClick={() => handleAction('Record deferred to manual legal hold queue.')}
                className="font-['Geist'] text-xs uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors"
              >
                Defer Resolution
              </button>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-full bg-surface-container text-on-surface font-['Geist'] text-xs uppercase tracking-wider hover:bg-surface-container-high transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAction('Composite Merge executed: Golden Master record synthesized & verified.')}
                  className="flex-1 sm:flex-initial px-6 py-2.5 rounded-full bg-primary text-on-primary font-['Geist'] text-xs uppercase tracking-wider hover:bg-primary-fixed transition-colors shadow-sm font-semibold"
                >
                  Composite Merge (Recommended)
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
