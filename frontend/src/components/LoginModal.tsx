import React, { useState } from 'react';
import { requestFCMToken } from '../services/fcm';

export type UserRole = 'admin' | 'reviewer';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isGuest: boolean;
  isJudge?: boolean;
  fcmToken?: string | null;
}

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  currentSession: UserSession;
  onSessionChange: (session: UserSession) => void;
  onTriggerToast: (msg: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  open,
  onClose,
  currentSession,
  onSessionChange,
  onTriggerToast,
}) => {
  const [activeTab, setActiveTab] = useState<'guest' | 'credentials'>('guest');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEnablingPush, setIsEnablingPush] = useState(false);

  if (!open) return null;

  const handleSelectRole = async (role: UserRole) => {
    const isReviewer = role === 'reviewer';
    let token: string | null = null;

    if (isReviewer) {
      setIsEnablingPush(true);
      try {
        token = await requestFCMToken();
        if (token) {
          onTriggerToast('🔔 Push notifications active for Reviewer session!');
        }
      } catch (err) {
        console.warn('Push registration skipped:', err);
      } finally {
        setIsEnablingPush(false);
      }
    }

    const newSession: UserSession = {
      id: isReviewer ? 'rev_judge_01' : 'admin_judge_00',
      name: isReviewer ? 'Dr. Senku (Judge Reviewer)' : 'Admin Lead (Judge)',
      email: isReviewer ? 'reviewer@reconcile.ai' : 'admin@reconcile.ai',
      role,
      isGuest: true,
      isJudge: true,
      fcmToken: token,
    };

    onSessionChange(newSession);
    onTriggerToast(`Switched to ${role === 'admin' ? '🛡️ Administrator' : '🔍 Reviewer'} Mode`);
    onClose();
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const isJudge = email.toLowerCase().includes('judge');
    const role: UserRole = email.includes('admin') ? 'admin' : 'reviewer';
    const newSession: UserSession = {
      id: 'usr_' + Date.now().toString(16),
      name: email.split('@')[0],
      email,
      role,
      isGuest: false,
      isJudge,
    };

    onSessionChange(newSession);
    onTriggerToast(`Signed in as ${email} (${role.toUpperCase()})`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#1c1b1b] border border-[#2a2a2a] rounded-2xl shadow-2xl overflow-hidden flex flex-col text-[#e5e2e1] font-sans">
        {/* Header */}
        <div className="p-6 border-b border-[#2a2a2a] flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#201f1f] border border-[#2a2a2a] text-[10px] font-mono uppercase tracking-wider text-amber-400 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Judge Evaluation Mode
            </div>
            <h2 className="text-xl font-serif font-bold text-white tracking-wide">
              Access Gateway & Role Switcher
            </h2>
            <p className="text-xs text-[#8e9192] mt-0.5">
              Switch role instantly to test Admin or Reviewer workflows.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#8e9192] hover:text-white hover:bg-[#201f1f] transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[#2a2a2a] bg-[#131313] text-xs">
          <button
            onClick={() => setActiveTab('guest')}
            className={`flex-1 py-3 text-center font-semibold tracking-wider uppercase transition ${
              activeTab === 'guest'
                ? 'text-white border-b-2 border-white bg-[#1c1b1b]'
                : 'text-[#8e9192] hover:text-white'
            }`}
          >
            1-Click Judge Mode
          </button>
          <button
            onClick={() => setActiveTab('credentials')}
            className={`flex-1 py-3 text-center font-semibold tracking-wider uppercase transition ${
              activeTab === 'credentials'
                ? 'text-white border-b-2 border-white bg-[#1c1b1b]'
                : 'text-[#8e9192] hover:text-white'
            }`}
          >
            Supabase Login
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {activeTab === 'guest' ? (
            <div className="flex flex-col gap-4">
              <p className="text-xs text-[#c4c7c8] leading-relaxed">
                Choose a role to test. The UI adapts live, and selecting <strong className="text-white">Reviewer</strong> will automatically register your browser for real background push notifications:
              </p>

              {/* Admin Button */}
              <button
                onClick={() => handleSelectRole('admin')}
                className={`p-4 rounded-xl border text-left transition flex items-start justify-between group ${
                  currentSession.role === 'admin'
                    ? 'bg-[#201f1f] border-white text-white shadow-md'
                    : 'bg-[#131313] border-[#2a2a2a] hover:border-[#444748] text-[#c4c7c8]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white group-hover:text-white">
                      🛡️ Administrator Role
                    </span>
                    {currentSession.role === 'admin' && (
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-white text-black font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#8e9192] mt-1">
                    Full cluster overview, ingestion triggers, source reliability weights, and global triage stats.
                  </p>
                </div>
              </button>

              {/* Reviewer Button */}
              <button
                onClick={() => handleSelectRole('reviewer')}
                disabled={isEnablingPush}
                className={`p-4 rounded-xl border text-left transition flex items-start justify-between group ${
                  currentSession.role === 'reviewer'
                    ? 'bg-[#201f1f] border-white text-white shadow-md'
                    : 'bg-[#131313] border-[#2a2a2a] hover:border-[#444748] text-[#c4c7c8]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white group-hover:text-white">
                      🔍 Triage Reviewer Role
                    </span>
                    {currentSession.role === 'reviewer' && (
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-emerald-400 text-black font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#8e9192] mt-1">
                    Scoped conflict review queue, evidence comparison, manual override commit, and push alert listener.
                  </p>
                  {isEnablingPush && (
                    <span className="text-[11px] text-amber-400 font-mono mt-2 block animate-pulse">
                      Requesting browser notification permission...
                    </span>
                  )}
                </div>
              </button>
            </div>
          ) : (
            <form onSubmit={handleCredentialsSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. admin@reconcile.ai or reviewer@reconcile.ai"
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#131313] border border-[#2a2a2a] text-xs text-white placeholder-[#8e9192] focus:outline-none focus:border-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#131313] border border-[#2a2a2a] text-xs text-white placeholder-[#8e9192] focus:outline-none focus:border-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-white hover:bg-neutral-200 text-black font-semibold text-xs tracking-wider uppercase transition mt-2 shadow-sm"
              >
                Sign In with Supabase
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#131313] border-t border-[#2a2a2a] flex items-center justify-between text-xs text-[#8e9192]">
          <span>Current: <strong className="text-white font-mono uppercase">{currentSession.role}</strong></span>
          <button
            onClick={onClose}
            className="text-white hover:underline font-medium"
          >
            Continue to App →
          </button>
        </div>
      </div>
    </div>
  );
};
