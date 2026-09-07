import React from 'react';
import Header from './Header';

type Page = 'command-center' | 'ingest-datasets' | 'conflict-triage' | 'golden-master-directory' | 'audit-log' | 'settings';

interface AppShellProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  children: React.ReactNode;
}

export default function AppShell({ activePage, onNavigate, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-surface-dim flex flex-col">
      <Header activePage={activePage} onNavigate={onNavigate} />
      <main className="w-full pt-16 flex-1">
        <div className="max-w-[1280px] w-full mx-auto px-4 lg:px-12 py-10 flex flex-col gap-10">
          {children}
        </div>
      </main>
    </div>
  );
}
