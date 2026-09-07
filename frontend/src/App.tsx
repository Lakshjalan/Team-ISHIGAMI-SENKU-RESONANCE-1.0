import React, { useState } from 'react';
import AppShell from './components/layout/AppShell';
import { Page } from './components/layout/Header';
import CommandCenter from './pages/CommandCenter';
import DataIngestion from './pages/DataIngestion';
import ConflictTriage from './pages/ConflictTriage';
import GoldenMasterDirectory from './pages/GoldenMasterDirectory';
import AuditLedger from './pages/AuditLedger';
import SystemSettings from './pages/SystemSettings';
import ErrorPages from './pages/ErrorPages';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('command-center');

  const renderPage = () => {
    switch (currentPage) {
      case 'command-center':
        return <CommandCenter onNavigate={setCurrentPage} />;
      case 'ingest-datasets':
        return <DataIngestion onNavigate={setCurrentPage} />;
      case 'conflict-triage':
        return <ConflictTriage onNavigate={setCurrentPage} />;
      case 'golden-master-directory':
        return <GoldenMasterDirectory onNavigate={setCurrentPage} />;
      case 'audit-log':
        return <AuditLedger onNavigate={setCurrentPage} />;
      case 'settings':
        return <SystemSettings />;
      case 'errors':
        return <ErrorPages onNavigate={setCurrentPage} />;
      default:
        return <CommandCenter onNavigate={setCurrentPage} />;
    }
  };

  return (
    <AppShell
      activePage={currentPage}
      onNavigate={setCurrentPage}
      onNewRun={() => setCurrentPage('ingest-datasets')}
    >
      {renderPage()}
    </AppShell>
  );
}
