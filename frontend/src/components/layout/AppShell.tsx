import React from 'react';
import Header, { Page } from './Header';

interface AppShellProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  onNewRun?: () => void;
  currentRole?: 'admin' | 'reviewer';
  userName?: string;
  onOpenProfile?: () => void;
  activeReviewersCount?: number;
  children: React.ReactNode;
}

export default function AppShell({
  activePage,
  onNavigate,
  onNewRun,
  currentRole,
  userName,
  onOpenProfile,
  activeReviewersCount,
  children,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] flex flex-col font-['Geist'] selection:bg-[#353534] selection:text-white">
      <Header
        activePage={activePage}
        onNavigate={onNavigate}
        onNewRun={onNewRun}
        currentRole={currentRole}
        userName={userName}
        onOpenProfile={onOpenProfile}
        activeReviewersCount={activeReviewersCount}
      />
      <main className="w-full pt-16 lg:pt-20 flex-1 flex flex-col">
        <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
