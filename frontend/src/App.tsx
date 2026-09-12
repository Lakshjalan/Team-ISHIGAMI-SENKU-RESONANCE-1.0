import React, { useState, useEffect } from 'react';
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
import { supabase, signOutUser } from './services/supabase';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<Page>('command-center');
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  const [session, setSession] = useState<UserSession>({
    id: 'usr_init',
    role: 'reviewer',
    name: 'Operator',
    email: '',
    isGuest: false,
  });

  const [activeReviewers, setActiveReviewers] = useState<ActiveReviewer[]>([
    { id: 'rev_1', name: 'Priya Singh', email: 'priya.singh@syntra.ai', role: 'reviewer' },
    { id: 'rev_2', name: 'Alex Chen', email: 'alex.chen@syntra.ai', role: 'reviewer' },
    { id: 'rev_3', name: 'Marcus Vance', email: 'marcus.vance@syntra.ai', role: 'reviewer' },
  ]);

  // Listen to Supabase authentication state and active sessions
  useEffect(() => {
    // 1. Check existing session on load
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      if (existingSession?.user) {
        const email = existingSession.user.email || '';
        const name = existingSession.user.user_metadata?.name || email.split('@')[0];
        const role =
          (existingSession.user.user_metadata?.role as 'admin' | 'reviewer') ||
          (email.toLowerCase().includes('admin') ? 'admin' : 'reviewer');

        setSession({
          id: existingSession.user.id,
          name,
          email,
          role,
          isGuest: false,
        });
        setIsAuthenticated(true);
      }
    });

    // 2. React to auth state changes (sign in, email confirmation callback, sign out)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newAuthSession) => {
      if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && newAuthSession?.user) {
        const email = newAuthSession.user.email || '';
        const name = newAuthSession.user.user_metadata?.name || email.split('@')[0];
        const role =
          (newAuthSession.user.user_metadata?.role as 'admin' | 'reviewer') ||
          (email.toLowerCase().includes('admin') ? 'admin' : 'reviewer');

        setSession({
          id: newAuthSession.user.id,
          name,
          email,
          role,
          isGuest: false,
        });
        setIsAuthenticated(true);
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setSession({
          id: 'usr_init',
          role: 'reviewer',
          name: 'Operator',
          email: '',
          isGuest: false,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

  const handleSignOut = async () => {
    await signOutUser();
    authApi.logout();
    setIsProfileOpen(false);
    setIsAuthenticated(false);
    setCurrentPage('command-center');
  };

  // When user is not authenticated, show Clean First Login Portal
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
        userName={session.name}
        onOpenProfile={() => setIsProfileOpen(true)}
        activeReviewersCount={activeReviewers.length}
      >
        {renderPage()}
      </AppShell>

      {/* User Profile Modal */}
      <ProfileModal
        open={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        session={session}
        onSignOut={handleSignOut}
        activeReviewersCount={activeReviewers.length}
      />
    </ErrorBoundary>
  );
}
