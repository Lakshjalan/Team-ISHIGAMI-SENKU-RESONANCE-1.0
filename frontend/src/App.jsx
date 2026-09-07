import React, { useState } from 'react';
// types
import { Layout } from './components/Layout';
import { CommandCenter } from './components/CommandCenter';
import { DataIngestion } from './components/DataIngestion';
import { ConflictReviewQueue } from './components/ConflictReviewQueue';
import { GoldenMasterDirectory } from './components/GoldenMasterDirectory';
import { CryptographicAuditLedger } from './components/CryptographicAuditLedger';
import { Authentication } from './components/Authentication';
import { SystemSettings } from './components/SystemSettings';
import { ErrorEmptyStates } from './components/ErrorEmptyStates';

export const App = () => {
  const [currentScreen, setCurrentScreen] = useState('command');
  const [darkMode, setDarkMode] = useState(true);

  // Global Mock States
  const [conflicts, setConflicts] = useState([
    {
      id: 'CONF-101',
      name: 'Rahul Sharma',
      field: 'Email',
      sourceA: {
        name: 'Alumni Portal',
        value: 'rahul.sharma@alumni.org',
        trust: 75,
        timestamp: '2026-08-14 10:20 UTC',
        sourceId: 'ALUM-9921',
      },
      sourceB: {
        name: 'Campus Placement',
        value: 'r.sharma@techcorp.io',
        trust: 88,
        timestamp: '2026-09-02 16:45 UTC',
        sourceId: 'CAMP-4402',
      },
      confidence: 89,
      priority: 'High',
      matchReason: 'Exact DOB + National ID match; handle token variation',
    },
    {
      id: 'CONF-102',
      name: 'Priya Singh',
      field: 'Phone',
      sourceA: {
        name: 'Enterprise ERP',
        value: '+91 98765 43210',
        trust: 95,
        timestamp: '2026-07-20 08:30 UTC',
        sourceId: 'ERP-10842',
      },
      sourceB: {
        name: 'Campus Placement',
        value: '+91 98111 22334',
        trust: 88,
        timestamp: '2026-09-05 11:15 UTC',
        sourceId: 'CAMP-5109',
      },
      confidence: 94,
      priority: 'Critical',
      matchReason: 'High identity consensus; recent mobile number update',
    },
    {
      id: 'CONF-103',
      name: 'Amit Kumar',
      field: 'Address',
      sourceA: {
        name: 'Enterprise ERP',
        value: 'Sector 62, Noida, UP 201301',
        trust: 95,
        timestamp: '2026-06-12 14:00 UTC',
        sourceId: 'ERP-88219',
      },
      sourceB: {
        name: 'Alumni Portal',
        value: 'Indirapuram, Ghaziabad, UP 201014',
        trust: 75,
        timestamp: '2026-08-28 09:10 UTC',
        sourceId: 'ALUM-3041',
      },
      confidence: 81,
      priority: 'Medium',
      matchReason: 'Geographic proximity (NCR corridor); relocated post-grad',
    },
    {
      id: 'CONF-104',
      name: 'Neha Verma',
      field: 'Name',
      sourceA: {
        name: 'Enterprise ERP',
        value: 'Neha Verma',
        trust: 95,
        timestamp: '2026-05-19 12:00 UTC',
        sourceId: 'ERP-44012',
      },
      sourceB: {
        name: 'LinkedIn Sync',
        value: 'Neha V. Sharma',
        trust: 70,
        timestamp: '2026-09-01 18:00 UTC',
        sourceId: 'LINK-8812',
      },
      confidence: 78,
      priority: 'Medium',
      matchReason: 'Marital surname delta; verified Aadhaar anchor',
    },
  ]);

  const [goldenRecords] = useState([
    {
      id: 'GOLD-01',
      masterId: 'REC-ID-99201',
      fullName: 'Dr. Vikramaditya Rao',
      email: 'v.rao@iitb.ac.in',
      phone: '+91 98200 11223',
      address: 'Powai Campus, Mumbai, MH',
      confidence: 99.4,
      sourcesMerged: ['Enterprise ERP', 'Faculty Registry', 'Research Ledger'],
      lastUpdated: '2 hours ago',
      blockHash: '0x8f2d...91b4',
    },
    {
      id: 'GOLD-02',
      masterId: 'REC-ID-99202',
      fullName: 'Ananya Deshmukh',
      email: 'ananya.d@fintechglobal.com',
      phone: '+91 99301 44556',
      address: 'Bandra Kurla Complex, Mumbai, MH',
      confidence: 97.8,
      sourcesMerged: ['Enterprise ERP', 'Campus Placement'],
      lastUpdated: '5 hours ago',
      blockHash: '0x4c1e...88a2',
    },
    {
      id: 'GOLD-03',
      masterId: 'REC-ID-99203',
      fullName: 'Siddharth Menon',
      email: 's.menon@alumni.org',
      phone: '+91 98450 77889',
      address: 'Indiranagar, Bangalore, KA',
      confidence: 96.2,
      sourcesMerged: ['Enterprise ERP', 'Alumni Directory', 'LinkedIn Sync'],
      lastUpdated: 'Yesterday',
      blockHash: '0x7b9a...32f1',
    },
  ]);

  const [runs, setRuns] = useState([
    {
      id: '#1048',
      timestamp: 'Today, 18:30 UTC',
      recordCount: 142890,
      confidence: 98.4,
      status: 'Completed',
      hash: 'sha256-e3b0c44298fc1c149afbf4c8996fb924',
      operator: 'Auto Consensus Engine v4.2',
    },
    {
      id: '#1047',
      timestamp: 'Yesterday, 14:15 UTC',
      recordCount: 38500,
      confidence: 94.8,
      status: 'Completed',
      hash: 'sha256-8c4391b4a098efbc10934fa10b987213',
      operator: 'Admin (P. Kumar)',
    },
  ]);

  const [auditLogs, setAuditLogs] = useState([
    {
      id: 'AUD-8801',
      action: 'Auto-resolved 312 records using ERP Golden Trust Rule',
      details: 'Applied 95% trust weight for Enterprise ERP over secondary inputs',
      operator: 'AI Engine v4.2',
      time: '12m ago',
      blockHash: '0x3a9f...e102',
      type: 'auto',
    },
    {
      id: 'AUD-8802',
      action: 'Admin approved conflict resolution for Priya Singh',
      details: 'Manual adoption of Campus Placement mobile number (+91 98111 22334)',
      operator: 'Admin (Paramjeet)',
      time: '44m ago',
      blockHash: '0x9c41...b760',
      type: 'human',
    },
    {
      id: 'AUD-8803',
      action: 'Run #1048 completed ingestion (142,890 records)',
      details: 'Zero checksum failures across 3 enterprise connectors',
      operator: 'System Ingest Pipeline',
      time: '2h ago',
      blockHash: '0x11be...88dc',
      type: 'system',
    },
  ]);

  const [sources, setSources] = useState([
    {
      id: 'SRC-01',
      name: 'Enterprise ERP',
      tag: 'Primary Golden Anchor',
      trust: 95,
      records: '84,200',
      protocol: 'REST / OAuth2',
      status: 'Active',
      syncCycle: 'Real-time Webhook',
      lastUpdated: 'Just now',
    },
    {
      id: 'SRC-02',
      name: 'Campus Placement System',
      tag: 'High Freshness',
      trust: 88,
      records: '38,400',
      protocol: 'GraphQL Stream',
      status: 'Active',
      syncCycle: 'Hourly Polling',
      lastUpdated: '4 mins ago',
    },
    {
      id: 'SRC-03',
      name: 'Alumni Directory Database',
      tag: 'Periodic Sync',
      trust: 75,
      records: '20,290',
      protocol: 'SFTP Batch Ingestion',
      status: 'Active',
      syncCycle: 'Nightly 00:00 UTC',
      lastUpdated: 'Yesterday',
    },
  ]);

  // Toast and Undo Buffer
  const [toastMessage, setToastMessage] = useState(null);
  const [undoBuffer, setUndoBuffer] = useState(null);
  const [isSimulatingRun, setIsSimulatingRun] = useState(false);

  const triggerToast = (msg, reversible) => {
    setToastMessage(msg);
    if (reversible) setUndoBuffer(reversible);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleUndo = () => {
    if (undoBuffer) {
      setConflicts((prev) => [undoBuffer, ...prev]);
      triggerToast(`Restored ${undoBuffer.name}'s conflict to queue.`);
      setUndoBuffer(null);
    }
  };

  const handleResolveConflict = (conflictId, chosenValue, sourceName, rememberRule) => {
    const item = conflicts.find((c) => c.id === conflictId);
    if (!item) return;

    setConflicts((prev) => prev.filter((c) => c.id !== conflictId));

    const newLog = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      action: `Resolved ${item.field} for ${item.name}`,
      details: `Merged "${chosenValue}" via ${sourceName}${rememberRule ? ' (Rule Persisted)' : ''}`,
      operator: 'Admin (Paramjeet)',
      time: 'Just now',
      blockHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
      type: 'human',
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    triggerToast(`Resolved: "${chosenValue}" committed to Golden Master.`, item);
  };

  const handleBatchResolve = (ids) => {
    const resolved = conflicts.filter((c) => ids.includes(c.id));
    setConflicts((prev) => prev.filter((c) => !ids.includes(c.id)));
    triggerToast(`Batch resolved ${resolved.length} conflicts using highest-trust anchor.`);
  };

  const handleTriggerNewRun = () => {
    setIsSimulatingRun(true);
    triggerToast('Initiating Ingestion & Deduplication Run #1049...');
    setTimeout(() => {
      setIsSimulatingRun(false);
      const newRun = {
        id: `#${runs.length + 1047}`,
        timestamp: 'Just now',
        recordCount: 144210,
        confidence: 98.6,
        status: 'Completed',
        hash: `sha256-${Math.random().toString(16).substring(2, 18)}...`,
        operator: 'Auto Consensus Engine v4.2',
      };
      setRuns((prev) => [newRun, ...prev]);
      triggerToast('Run #1049 complete! Verified 144,210 identities.');
    }, 2000);
  };

  return (
    <Layout
      currentScreen={currentScreen}
      onNavigate={setCurrentScreen}
      darkMode={darkMode}
      onToggleTheme={() => setDarkMode(!darkMode)}
      toastMessage={toastMessage}
      onDismissToast={() => setToastMessage(null)}
      onUndo={handleUndo}
      hasUndo={!!undoBuffer}
    >
      {currentScreen === 'command' && (
        <CommandCenter
          darkMode={darkMode}
          conflicts={conflicts}
          sources={sources}
          onNavigate={setCurrentScreen}
          onOpenConflictModal={() => setCurrentScreen('triage')}
          onTriggerNewRun={handleTriggerNewRun}
          isSimulatingRun={isSimulatingRun}
        />
      )}

      {currentScreen === 'ingestion' && (
        <DataIngestion
          darkMode={darkMode}
          sources={sources}
          onAddSource={(newSrc) => setSources((prev) => [newSrc, ...prev])}
          onTriggerToast={triggerToast}
        />
      )}

      {currentScreen === 'triage' && (
        <ConflictReviewQueue
          darkMode={darkMode}
          conflicts={conflicts}
          onResolveConflict={handleResolveConflict}
          onBatchResolve={handleBatchResolve}
          onTriggerToast={triggerToast}
        />
      )}

      {currentScreen === 'directory' && (
        <GoldenMasterDirectory
          darkMode={darkMode}
          goldenRecords={goldenRecords}
          onTriggerToast={triggerToast}
        />
      )}

      {currentScreen === 'audit' && (
        <CryptographicAuditLedger
          darkMode={darkMode}
          runs={runs}
          auditLogs={auditLogs}
          onTriggerToast={triggerToast}
        />
      )}

      {currentScreen === 'auth' && (
        <Authentication
          darkMode={darkMode}
          onLoginSuccess={(email) => triggerToast(`Authenticated as ${email}`)}
          onNavigate={setCurrentScreen}
          onTriggerToast={triggerToast}
        />
      )}

      {currentScreen === 'settings' && (
        <SystemSettings
          darkMode={darkMode}
          sources={sources}
          onTriggerToast={triggerToast}
        />
      )}

      {currentScreen === 'errors' && (
        <ErrorEmptyStates
          darkMode={darkMode}
          onNavigate={setCurrentScreen}
          onTriggerToast={triggerToast}
        />
      )}
    </Layout>
  );
};

export default App;
