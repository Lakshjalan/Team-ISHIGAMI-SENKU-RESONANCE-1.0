import React, { useState } from 'react';
import AppShell from './components/layout/AppShell';
import { Page } from './components/layout/Header';
import CommandCenter from './pages/CommandCenter';
import DataIngestion from './pages/DataIngestion';
import ConflictTriage, { ActiveReviewer } from './pages/ConflictTriage';
import GoldenMasterDirectory from './pages/GoldenMasterDirectory';
import AuditLedger from './pages/AuditLedger';
import SystemSettings from './pages/SystemSettings';
import Authentication, { UserSession } from './pages/Authentication';
import ErrorBoundary from './components/ui/ErrorBoundary';
import NetworkOfflineBanner from './components/ui/NetworkOfflineBanner';
import AccessDenied from './components/ui/AccessDenied';
import NotFound from './components/ui/NotFound';
import ProfileModal from './components/ui/ProfileModal';
import { authApi } from './services/api';

export default function App() {
  // App flow: start at the clean Login page first as requested
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<Page>('command-center');
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  const [session, setSession] = useState<UserSession>({
    id: 'usr_init',
    role: 'admin',
    name: 'Operator Admin',
    email: 'admin@reconcile.ai',
    isGuest: false,
    isJudge: false,
  });

  const [activeReviewers, setActiveReviewers] = useState<ActiveReviewer[]>([
    { id: 'rev_1', name: 'Priya Singh', email: 'priya.singh@reconcile.ai', role: 'reviewer' },
    { id: 'rev_2', name: 'Alex Chen', email: 'alex.chen@reconcile.ai', role: 'reviewer' },
    { id: 'rev_3', name: 'Marcus Vance', email: 'marcus.vance@reconcile.ai', role: 'reviewer' },
  ]);

  const handleSetRole = (role: 'admin' | 'reviewer') => {
    setSession((prev) => ({
      ...prev,
      role,
      name:
        role === 'admin'
          ? prev.name.includes('Reviewer')
            ? prev.name.replace('Reviewer', 'Admin')
            : prev.name
          : prev.name.includes('Admin')
          ? prev.name.replace('Admin', 'Reviewer')
          : prev.name,
    }));

    // Update active reviewer roster
    if (role === 'reviewer') {
      setActiveReviewers((prev) => {
        if (prev.some((r) => r.email === session.email)) return prev;
        return [
          ...prev,
          {
            id: 'rev_' + Date.now().toString(16),
            name: session.name,
            email: session.email,
            role: 'reviewer',
          },
        ];
      });
    } else {
      setActiveReviewers((prev) => prev.filter((r) => r.email !== session.email));
    }
  };

  const handleToggleRole = () => {
    const nextRole = session.role === 'admin' ? 'reviewer' : 'admin';
    handleSetRole(nextRole);
  };

  const handleLoginSuccess = (newSession: UserSession) => {
    setSession(newSession);
    setIsAuthenticated(true);
    setCurrentPage('command-center');

    if (newSession.role === 'reviewer') {
      setActiveReviewers((prev) => {
        if (prev.some((r) => r.email === newSession.email)) return prev;
        return [
          ...prev,
          {
            id: newSession.id,
            name: newSession.name,
            email: newSession.email,
            role: 'reviewer',
          },
        ];
      });
    }
  };

  const handleSignOut = () => {
    authApi.logout();
    setIsProfileOpen(false);
    setIsAuthenticated(false);
    setCurrentPage('command-center');
  };

  // Flow Step 1: When user is not authenticated, show Clean First Login Portal
  if (!isAuthenticated || currentPage === 'auth') {
    return (
      <ErrorBoundary>
        <NetworkOfflineBanner />
        <Authentication
          onLoginSuccess={handleLoginSuccess}
          onNavigateHome={isAuthenticated ? () => setCurrentPage('command-center') : undefined}
        />
      </ErrorBoundary>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'command-center':
        return <CommandCenter onNavigate={setCurrentPage} />;
      case 'ingest-datasets':
        return <DataIngestion onNavigate={setCurrentPage} />;
      case 'conflict-triage':
        return (
          <ConflictTriage
            onNavigate={setCurrentPage}
            currentUserName={session.name}
            currentUserRole={session.role}
            activeReviewers={activeReviewers}
          />
        );
      case 'golden-master-directory':
        return <GoldenMasterDirectory onNavigate={setCurrentPage} />;
      case 'audit-log':
        return <AuditLedger onNavigate={setCurrentPage} />;
      case 'settings':
        // RBAC enforcement: Settings is restricted to Administrators
        if (session.role !== 'admin') {
          return (
            <AccessDenied
              currentRole={session.role}
              requiredRole="admin"
              onElevate={session.isJudge ? () => handleSetRole('admin') : undefined}
              onBack={() => setCurrentPage('command-center')}
            />
          );
        }
        return <SystemSettings />;
      case '403':
        return (
          <AccessDenied
            currentRole={session.role}
            requiredRole="admin"
            onElevate={session.isJudge ? () => handleSetRole('admin') : undefined}
            onBack={() => setCurrentPage('command-center')}
          />
        );
      case '404':
        return <NotFound onNavigateHome={() => setCurrentPage('command-center')} />;
      default:
        return <NotFound onNavigateHome={() => setCurrentPage('command-center')} />;
    }
  };

  return (
    <ErrorBoundary>
      <NetworkOfflineBanner />

      <AppShell
        activePage={currentPage}
        onNavigate={setCurrentPage}
        onNewRun={() => setCurrentPage('ingest-datasets')}
        currentRole={session.role}
        onToggleRole={handleToggleRole}
        onSetRole={handleSetRole}
        userName={session.name}
        onOpenProfile={() => setIsProfileOpen(true)}
        activeReviewersCount={activeReviewers.length}
        isJudge={session.isJudge}
      >
        {renderPage()}
      </AppShell>

      {/* User Profile & Role Setting Modal */}
      <ProfileModal
        open={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        session={session}
        onUpdateRole={handleSetRole}
        onSignOut={handleSignOut}
        activeReviewersCount={activeReviewers.length}
      />
    </ErrorBoundary>
  );
}
