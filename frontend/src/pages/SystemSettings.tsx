import React, { useState } from 'react';
import SegmentedTabs from '../components/ui/SegmentedTabs';
import MaterialIcon from '../components/icons/MaterialIcon';
import { TEAM_MEMBERS } from '../data/mockData';

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState('matching');
  const [mergeThreshold, setMergeThreshold] = useState(90);

  const [keyRevealed, setKeyRevealed] = useState(false);
  const [copyLabel, setCopyLabel] = useState('Copy Key');
  const [pingLabel, setPingLabel] = useState('Send Test Ping');
  const [saveLabel, setSaveLabel] = useState('Save & Commit Governance Policy');

  const tabs = [
    { id: 'matching', label: 'Matching Thresholds' },
    { id: 'apikeys', label: 'API Keys & Webhooks' },
    { id: 'rbac', label: 'Team RBAC Permissions' },
  ];

  const handleCopyApiKey = () => {
    setCopyLabel('Copied!');
    setTimeout(() => setCopyLabel('Copy Key'), 2000);
  };

  const handleTestPing = () => {
    setPingLabel('Dispatching 200 OK...');
    setTimeout(() => setPingLabel('Send Test Ping'), 1800);
  };

  const handleSavePolicy = () => {
    setSaveLabel('Committed to Ledger ✓');
    setTimeout(() => setSaveLabel('Save & Commit Governance Policy'), 2200);
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full max-w-[1280px] mx-auto px-margin-mobile lg:px-margin-desktop py-8 flex flex-col gap-8">
        {/* Top Identity & Sub-badge Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div className="flex flex-col gap-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 self-start px-3 py-1 bg-surface-container-high rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              <span className="font-label-md text-label-md tracking-widest text-on-surface-variant uppercase">
                ZERO-TRUST GOVERNANCE · POLICY ENGINE ACTIVE · TLS 1.3
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
              System Settings & Data Governance
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Tune identity matching thresholds, configure API keys, and manage operator RBAC roles across distributed clusters.
            </p>
          </div>

          <div className="self-start md:self-auto">
            <SegmentedTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </header>

        {/* TAB PANE 1: Matching Engine Thresholds */}
        {activeTab === 'matching' && (
          <section className="flex flex-col gap-6" role="tabpanel">
            {/* Section Overview Pod */}
            <div className="bg-surface-container rounded-3xl p-8 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary flex-shrink-0">
                  <MaterialIcon name="tune" size={24} />
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="font-headline-md text-headline-md text-primary">
                    Deterministic & Heuristic Resolution Engine Tuning
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                    Calibrate machine confidence boundaries. High thresholds prioritize integrity to minimize false merges, while triage bands isolate marginal collisions for human verification.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-surface-container-high px-4 py-2.5 rounded-full flex items-center gap-2">
                  <MaterialIcon name="schema" size={18} className="text-primary" />
                  <span className="font-label-md text-label-md uppercase tracking-wider text-primary">
                    v4.18 Levenshtein-Vector Hybrid
                  </span>
                </div>
              </div>
            </div>

            {/* Bento Grid for Threshold Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Auto-Merge Confidence Threshold Card (7 cols) */}
              <div className="lg:col-span-7 bg-surface-container rounded-3xl p-8 flex flex-col justify-between gap-8 shadow-sm">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <MaterialIcon name="verified" size={20} className="text-primary" />
                      <h3 className="font-headline-md text-headline-md text-primary">Auto-Merge Confidence Threshold</h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-surface-container-highest font-label-md text-label-md text-primary uppercase tracking-wider">
                      Current Threshold: {(mergeThreshold / 100).toFixed(2)} ({mergeThreshold}%)
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Pairs with score &ge; 0.90 automatically create Golden Records without human intervention. Deterministic clustering applied.
                  </p>
                </div>

                {/* Interactive Threshold Slider Simulation */}
                <div className="bg-surface-container-low rounded-2xl p-6 flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase">Conservative (0.50)</span>
                    <span className="font-label-md text-label-md text-primary uppercase">Production Strict (1.00)</span>
                  </div>
                  <div className="relative flex items-center w-full">
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={mergeThreshold}
                      onChange={(e) => setMergeThreshold(Number(e.target.value))}
                      className="w-full h-2 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-primary focus:outline-none"
                    />
                  </div>
                  {/* Tick Marks & Visual Calibration */}
                  <div className="flex justify-between items-center px-1 font-label-md text-label-md text-on-surface-variant">
                    <span>0.50</span>
                    <span>0.60</span>
                    <span>0.70</span>
                    <span>0.80</span>
                    <span className="text-primary font-bold underline decoration-2 underline-offset-4">0.90</span>
                    <span>1.00</span>
                  </div>
                </div>

                {/* Impact Metrics Capsule */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-surface-container-high rounded-2xl">
                  <div className="flex items-center gap-3">
                    <MaterialIcon name="analytics" size={20} className="text-primary" />
                    <span className="font-body-md text-body-md text-on-surface">
                      Estimated Impact Analysis
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-surface-container-lowest rounded-full font-label-md text-label-md text-primary">
                      ~92.4% Auto-Resolution Rate
                    </span>
                    <span className="px-3 py-1 bg-surface-container-lowest rounded-full font-label-md text-label-md text-on-surface-variant">
                      0.002% Estimated False Positive Risk
                    </span>
                  </div>
                </div>
              </div>

              {/* Human Review Triage Band Card (5 cols) */}
              <div className="lg:col-span-5 bg-surface-container rounded-3xl p-8 flex flex-col justify-between gap-6 shadow-sm">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <MaterialIcon name="assignment_turned_in" size={20} className="text-primary" />
                      <h3 className="font-headline-md text-headline-md text-primary">Human Review Triage Band</h3>
                    </div>
                  </div>
                  <div className="self-start px-3 py-1 rounded-full bg-surface-container-highest font-label-md text-label-md text-primary tracking-widest">
                    TRIAGE BAND: [ 0.60 ──── 0.89 ]
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Pairs in this band are automatically routed to the <code className="text-primary font-label-md px-1.5 py-0.5 bg-surface-container-lowest rounded">student_conflict_queue</code> for manual operator arbitration.
                  </p>
                </div>

                {/* Band Graphic Visualization */}
                <div className="bg-surface-container-low rounded-2xl p-6 flex flex-col gap-4">
                  <div className="h-10 w-full bg-surface-container-high rounded-xl overflow-hidden flex items-center p-1">
                    <div className="h-full w-[40%] bg-surface-container-lowest rounded-lg flex items-center justify-center font-label-md text-label-md text-on-surface-variant">
                      Reject &lt;0.60
                    </div>
                    <div className="h-full w-[35%] bg-surface-container-highest rounded-lg flex items-center justify-center font-label-md text-label-md text-primary font-bold mx-1">
                      Triage Band
                    </div>
                    <div className="h-full w-[25%] bg-primary rounded-lg flex items-center justify-center font-label-md text-label-md text-on-primary font-bold">
                      Merge &ge;0.90
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 pt-2">
                    <div className="flex items-center justify-between text-body-md font-body-md text-on-surface-variant">
                      <span>Hard Reject Boundary</span>
                      <span className="text-primary font-label-md">&lt; 0.60 (Automatic Discard)</span>
                    </div>
                    <div className="flex items-center justify-between text-body-md font-body-md text-on-surface-variant">
                      <span>Routing Queue Target</span>
                      <span className="text-primary font-label-md">Tier-1 Operational Ops</span>
                    </div>
                    <div className="flex items-center justify-between text-body-md font-body-md text-on-surface-variant">
                      <span>Average Arbitration SLA</span>
                      <span className="text-primary font-label-md">14.2 Minutes</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md">
                  <MaterialIcon name="info" size={16} />
                  <span>Deterministic bypass triggers when SSN & State ID verify exact match.</span>
                </div>
              </div>

              {/* Matching Rules Quick Matrix (Full Width in Grid) */}
              <div className="lg:col-span-12 bg-surface-container rounded-3xl p-8 flex flex-col gap-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="font-headline-md text-headline-md text-primary">Weighted Scoring Attributions</h3>
                  <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                    Normalization Profile: North American Higher Ed
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-surface-container-low rounded-2xl p-5 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="font-label-md text-label-md uppercase text-on-surface-variant">National Identity / SSN</span>
                      <span className="font-label-md text-label-md text-primary bg-surface-container-high px-2 py-0.5 rounded-full">0.45 WT</span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[45%]"></div>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant">Exact or transposition-tolerated match.</p>
                  </div>
                  <div className="bg-surface-container-low rounded-2xl p-5 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="font-label-md text-label-md uppercase text-on-surface-variant">Full Legal Name</span>
                      <span className="font-label-md text-label-md text-primary bg-surface-container-high px-2 py-0.5 rounded-full">0.25 WT</span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[25%]"></div>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant">Jaro-Winkler phonetic index parsing.</p>
                  </div>
                  <div className="bg-surface-container-low rounded-2xl p-5 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="font-label-md text-label-md uppercase text-on-surface-variant">Date of Birth (DOB)</span>
                      <span className="font-label-md text-label-md text-primary bg-surface-container-high px-2 py-0.5 rounded-full">0.20 WT</span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[20%]"></div>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant">ISO 8601 strict format parity.</p>
                  </div>
                  <div className="bg-surface-container-low rounded-2xl p-5 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="font-label-md text-label-md uppercase text-on-surface-variant">Address & Geocodes</span>
                      <span className="font-label-md text-label-md text-primary bg-surface-container-high px-2 py-0.5 rounded-full">0.10 WT</span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[10%]"></div>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant">USPS CASS standardized coordinates.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB PANE 2: API Keys & Webhooks */}
        {activeTab === 'apikeys' && (
          <section className="flex flex-col gap-6" role="tabpanel">
            {/* Section Overview Pod */}
            <div className="bg-surface-container rounded-3xl p-8 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary flex-shrink-0">
                  <MaterialIcon name="key" size={24} />
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="font-headline-md text-headline-md text-primary">
                    Programmable Ingestion & Dispatch Endpoints
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                    Rotate enterprise cryptographic keys, configure real-time downstream webhooks, and ensure strict mutual TLS verification across tenant boundaries.
                  </p>
                </div>
              </div>
              <button className="h-10 px-5 bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider rounded-full hover:bg-primary-fixed transition-colors flex items-center gap-2 self-start lg:self-auto">
                <MaterialIcon name="add" size={16} />
                <span>Generate New Key</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Live API Key Management Pod (6 cols) */}
              <div className="lg:col-span-6 bg-surface-container rounded-3xl p-8 flex flex-col justify-between gap-6 shadow-sm">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md text-primary tracking-widest uppercase">Secret Token Authority</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-label-md text-label-md">LIVE PRODUCTION</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-primary">Production Ingestion Gateway (Live)</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Full read/write permissions for asynchronous dataset ingest, streaming conflict ingestion, and ledger retrieval.
                  </p>
                </div>

                {/* Masked Key Box */}
                <div className="flex flex-col gap-3">
                  <div className="bg-surface-container-low rounded-full px-5 py-3 flex items-center justify-between gap-4">
                    <span className="font-label-md text-label-md text-primary tracking-wider truncate select-all">
                      {keyRevealed ? 'veritas_live_key_9f82d3e91a0c4f8287c4b' : 'veritas_live_key_9f82••••••••••••••••7c4b'}
                    </span>
                    <button onClick={() => setKeyRevealed(!keyRevealed)} className="text-on-surface-variant hover:text-primary transition-colors flex items-center">
                      <MaterialIcon name={keyRevealed ? 'visibility_off' : 'visibility'} size={20} />
                    </button>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={handleCopyApiKey}
                      className="flex-1 h-10 bg-primary text-on-primary rounded-full font-label-md text-label-md uppercase tracking-wider hover:bg-primary-fixed transition-colors flex items-center justify-center gap-2"
                    >
                      <MaterialIcon name="content_copy" size={18} />
                      <span>{copyLabel}</span>
                    </button>
                    <button className="flex-1 h-10 bg-transparent text-error hover:bg-surface-container-high rounded-full font-label-md text-label-md uppercase tracking-wider transition-colors flex items-center justify-center gap-2">
                      <MaterialIcon name="cached" size={18} />
                      <span>Revoke Key</span>
                    </button>
                  </div>
                </div>

                {/* Key Metadata Strip */}
                <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col gap-2 font-label-md text-label-md text-on-surface-variant">
                  <div className="flex items-center justify-between">
                    <span>Created Timestamp</span>
                    <span className="text-primary">Jan 12, 2026 · 14:32:08 UTC</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Throughput Limit</span>
                    <span className="text-primary">10,000 req/min (Burst 15k)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>IP Whitelist Enclave</span>
                    <span className="text-primary">Enforced (8 CIDR blocks)</span>
                  </div>
                </div>
              </div>

              {/* Webhook Configuration Pod (6 cols) */}
              <div className="lg:col-span-6 bg-surface-container rounded-3xl p-8 flex flex-col justify-between gap-6 shadow-sm">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md text-on-surface-variant tracking-widest uppercase">Downstream Bus</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-label-md text-label-md">HTTPS ONLY</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-primary">Webhook URL Config & Triggers</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Reconcile dispatches signed JSON payloads with an HMAC-SHA256 signature header (<code className="text-primary font-label-md">X-Reconcile-Signature</code>).
                  </p>
                </div>

                {/* URL Input Capsule */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-label-md text-on-surface-variant uppercase">Target HTTPS Destination</label>
                    <div className="bg-surface-container-lowest rounded-full px-5 py-2.5 flex items-center gap-3">
                      <MaterialIcon name="link" size={18} className="text-primary" />
                      <input
                        className="w-full bg-transparent text-primary font-body-md text-body-md focus:outline-none"
                        type="text"
                        defaultValue="https://api.enterprise.com/webhooks/identity-events"
                      />
                    </div>
                  </div>
                  {/* Event Subscription Checkbox Chips */}
                  <div className="flex flex-col gap-2">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase">Event Subscriptions</span>
                    <div className="flex flex-wrap gap-2">
                      {['entity.merged', 'conflict.raised', 'override.committed', 'ledger.block_sealed'].map((evt) => (
                        <label key={evt} className="px-3 py-1.5 rounded-full bg-surface-container-high text-primary font-label-md text-label-md flex items-center gap-2 cursor-pointer hover:bg-surface-container-highest transition-colors">
                          <input defaultChecked className="accent-primary w-3.5 h-3.5" type="checkbox" />
                          <span>{evt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Test Trigger Button */}
                <div className="pt-2 flex items-center justify-between gap-4">
                  <button
                    onClick={handleTestPing}
                    className="h-10 px-6 bg-surface-container-high hover:bg-surface-container-highest text-primary rounded-full font-label-md text-label-md uppercase tracking-wider transition-colors flex items-center gap-2"
                  >
                    <MaterialIcon name="bolt" size={18} />
                    <span>{pingLabel}</span>
                  </button>
                  <span className="font-label-md text-label-md text-on-surface-variant">Last ping: 200 OK (38ms)</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB PANE 3: Team RBAC Permissions Table */}
        {activeTab === 'rbac' && (
          <section className="flex flex-col gap-6" role="tabpanel">
            {/* Section Overview & Action Bar */}
            <div className="bg-surface-container rounded-3xl p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary flex-shrink-0">
                  <MaterialIcon name="shield_person" size={24} />
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="font-headline-md text-headline-md text-primary">
                    Role-Based Access Control (RBAC) & Keyrings
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                    Strict compartmentalization enforced by policy engine. Hardware-backed credentials mandatory for cluster-level master overrides.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    className="bg-surface-container-low text-primary placeholder:text-on-surface-variant font-label-md text-label-md rounded-full px-4 py-2 pl-9 focus:outline-none w-48 lg:w-60"
                    placeholder="Filter identity..."
                    type="text"
                  />
                  <MaterialIcon name="search" size={18} className="text-on-surface-variant absolute left-3 top-2.5" />
                </div>
                <button className="h-10 px-5 bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider rounded-full hover:bg-primary-fixed transition-colors flex items-center gap-2 flex-shrink-0">
                  <MaterialIcon name="person_add" size={16} />
                  <span>Invite Operator</span>
                </button>
              </div>
            </div>

            {/* RBAC Table Container */}
            <div className="bg-surface-container rounded-3xl p-8 shadow-sm flex flex-col gap-4 overflow-x-auto">
              <table className="w-full text-left min-w-[760px]">
                <thead>
                  <tr className="text-on-surface-variant font-label-md text-label-md uppercase tracking-wider pb-4">
                    <th className="pb-4 font-normal">User / Identity</th>
                    <th className="pb-4 font-normal">Role & Scope</th>
                    <th className="pb-4 font-normal">MFA / Hardware Key</th>
                    <th className="pb-4 font-normal">Last Active</th>
                    <th className="pb-4 font-normal text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y-0 space-y-2">
                  {TEAM_MEMBERS.map((member, idx) => {
                    const isSuper = member.role === 'Super Admin';
                    return (
                      <tr key={idx} className="hover:bg-surface-container-high/40 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold font-label-md text-label-md ${isSuper ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-primary'}`}>
                              {member.avatar}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-body-md text-body-md text-primary font-medium">{member.email.split('@')[0]}</span>
                              <span className="font-label-md text-label-md text-on-surface-variant">{member.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full font-label-md text-label-md uppercase tracking-wider ${isSuper ? 'bg-primary text-on-primary font-semibold' : 'bg-surface-container-high text-primary'}`}>
                            {member.role}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high font-label-md text-label-md ${isSuper ? 'text-primary' : 'text-on-surface-variant'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isSuper ? 'bg-primary' : 'bg-on-surface-variant'}`}></span>
                            <span>{isSuper ? 'FIPS 140-3 Enclave' : 'WebAuthn FIDO2'}</span>
                          </div>
                        </td>
                        <td className={`py-4 font-label-md text-label-md ${isSuper ? 'text-primary' : 'text-on-surface-variant'}`}>
                          {member.lastActive}
                        </td>
                        <td className="py-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button className="px-3 py-1 bg-surface-container-high hover:bg-surface-container-highest text-primary rounded-full font-label-md text-label-md uppercase tracking-wider transition-colors">
                              Edit
                            </button>
                            {isSuper && (
                              <button className="px-3 py-1 bg-surface-container-high hover:bg-error/20 text-error rounded-full font-label-md text-label-md uppercase tracking-wider transition-colors">
                                Revoke
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  
                  {/* Additional Bot Row from Spec */}
                  <tr className="hover:bg-surface-container-high/40 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-surface-container-lowest text-primary flex items-center justify-center">
                          <MaterialIcon name="smart_toy" size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-body-md text-body-md text-primary font-medium">Data Pipeline Bot</span>
                          <span className="font-label-md text-label-md text-on-surface-variant">service_ingest@reconcile.ai</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
                        Pipeline Worker
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-primary font-label-md text-label-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        <span>Mutual TLS / mTLS</span>
                      </div>
                    </td>
                    <td className="py-4 font-label-md text-label-md text-primary">
                      Continuous
                    </td>
                    <td className="py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button className="px-3 py-1 bg-surface-container-high hover:bg-surface-container-highest text-primary rounded-full font-label-md text-label-md uppercase tracking-wider transition-colors">
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Bottom Floating Action Rail */}
        <div className="sticky bottom-6 z-40 w-full bg-surface-container/95 backdrop-blur-xl rounded-3xl p-4 md:p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-primary uppercase tracking-wider">
                Configuration Sync State
              </span>
              <span className="font-label-md text-label-md text-on-surface-variant">
                ALL CHANGES PROPAGATED TO MESH
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button className="h-11 px-6 rounded-full font-label-md text-label-md uppercase tracking-wider text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors">
              Discard Unsaved Changes
            </button>
            <button
              onClick={handleSavePolicy}
              className="h-11 px-8 rounded-full bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider hover:bg-primary-fixed transition-colors flex items-center gap-2 shadow-sm flex-shrink-0"
            >
              <MaterialIcon name="save" size={18} />
              <span>{saveLabel}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
