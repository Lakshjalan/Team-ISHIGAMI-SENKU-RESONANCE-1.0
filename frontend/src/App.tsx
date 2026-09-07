import React, { useState } from 'react';
import AppShell from './components/layout/AppShell';
import CommandCenter from './pages/CommandCenter';
import DataIngestion from './pages/DataIngestion';
import ConflictTriage from './pages/ConflictTriage';
import GoldenMasterDirectory from './pages/GoldenMasterDirectory';
import AuditLedger from './pages/AuditLedger';
import Authentication from './pages/Authentication';
import SystemSettings from './pages/SystemSettings';
import ErrorPages from './pages/ErrorPages';

type Page = 'command-center' | 'ingest-datasets' | 'conflict-triage' | 'golden-master-directory' | 'audit-log' | 'settings' | 'auth' | 'errors';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('command-center');

  // Standalone pages (no AppShell)
  if (currentPage === 'auth') {
    return <Authentication onNavigate={() => setCurrentPage('command-center')} />;
  }
  if (currentPage === 'errors') {
    return <ErrorPages onNavigate={() => setCurrentPage('command-center')} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'command-center': return <CommandCenter />;
      case 'ingest-datasets': return <DataIngestion />;
      case 'conflict-triage': return <ConflictTriage />;
      case 'golden-master-directory': return <GoldenMasterDirectory />;
      case 'audit-log': return <AuditLedger />;
      case 'settings': return <SystemSettings />;
      default: return <CommandCenter />;
    }
  };

  return (
    <AppShell activePage={currentPage as any} onNavigate={setCurrentPage as any}>
      {renderPage()}
    </AppShell>
  );
}
