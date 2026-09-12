import React, { useState } from 'react';
import MaterialIcon from '../components/icons/MaterialIcon';
import Toast from '../components/ui/Toast';
import SyntraLogo from '../components/ui/SyntraLogo';
import { requestFCMToken } from '../services/fcm';
import {
  signInWithEmail,
  signUpWithEmail,
  resendVerificationEmail,
  sendPasswordRecoveryEmail,
  updatePassword,
  syncUserProfile,
} from '../services/supabase';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'reviewer';
  isGuest: boolean;
  fcmToken?: string | null;
}

interface AuthenticationProps {
  onLoginSuccess?: (session: UserSession) => void;
  onNavigateHome?: () => void;
}

type AuthViewMode = 'login' | 'signup' | 'verify-pending' | 'forgot-password' | 'recovery-sent' | 'reset-password';

export default function Authentication({ onLoginSuccess, onNavigateHome }: AuthenticationProps) {
  const [viewMode, setViewMode] = useState<AuthViewMode>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const search = window.location.search;
      if (hash.includes('type=recovery') || search.includes('reset=true')) {
        return 'reset-password';
      }
    }
    return 'login';
  });

  // Login form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Signup form states
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupRole, setSignupRole] = useState<'admin' | 'reviewer'>('reviewer');
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Verification states
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState('');
  const [unconfirmedEmailAlert, setUnconfirmedEmailAlert] = useState<string | null>(null);

  // Recovery states
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // UI state
  const [toastMessage, setToastMessage] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const search = window.location.search;
      if (hash.includes('type=recovery') || search.includes('reset=true')) {
        return '🔑 Recovery token verified from email link. Please set your new password.';
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
  };

  // 1. Authenticate with Supabase
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;

    setIsLoading(true);
    setUnconfirmedEmailAlert(null);

    const res = await signInWithEmail(loginEmail, loginPassword);

    if (!res.success) {
      setIsLoading(false);
      if (res.needsEmailVerification) {
        setUnconfirmedEmailAlert(loginEmail);
        triggerToast('⚠️ Please verify your email before logging in.');
      } else {
        triggerToast(`❌ ${res.message}`);
      }
      return;
    }

    const user = res.user;
    const name = user?.user_metadata?.name || loginEmail.split('@')[0];
    const role: 'admin' | 'reviewer' =
      user?.user_metadata?.role || (loginEmail.toLowerCase().includes('admin') ? 'admin' : 'reviewer');

    let fcmToken: string | null = null;
    if (role === 'reviewer') {
      try {
        fcmToken = await requestFCMToken();
        if (fcmToken) {
          triggerToast('🔔 Registered for Reviewer FCM push alerts');
        }
      } catch (err) {
        console.warn('FCM token request skipped:', err);
      }
    }

    await syncUserProfile({
      id: user?.id || 'usr_' + Date.now().toString(16),
      email: loginEmail,
      name,
      role,
      fcmToken,
    });

    const session: UserSession = {
      id: user?.id || 'usr_' + Date.now().toString(16),
      name,
      email: loginEmail,
      role,
      isGuest: false,
      fcmToken,
    };

    setIsLoading(false);
    triggerToast(`Authenticated as ${name} (${role.toUpperCase()})`);

    if (onLoginSuccess) {
      onLoginSuccess(session);
    } else if (onNavigateHome) {
      onNavigateHome();
    }
  };

  // 2. Sign Up with Supabase (Sends confirmation email)
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupEmail || !signupPassword || !signupName) return;

    if (signupPassword !== signupConfirmPassword) {
      triggerToast('❌ Passwords do not match.');
      return;
    }

    if (signupPassword.length < 6) {
      triggerToast('❌ Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    const res = await signUpWithEmail(signupEmail, signupPassword, signupName, signupRole);
    setIsLoading(false);

    if (!res.success) {
      triggerToast(`❌ ${res.message}`);
      return;
    }

    if (res.needsEmailVerification) {
      setPendingVerificationEmail(signupEmail);
      setViewMode('verify-pending');
      triggerToast('✉️ Verification email sent! Please check your inbox.');
    } else {
      // Auto logged in if confirmation is disabled on Supabase
      const session: UserSession = {
        id: res.user?.id || 'usr_' + Date.now().toString(16),
        name: signupName,
        email: signupEmail,
        role: signupRole,
        isGuest: false,
      };
      triggerToast('🎉 Account created and logged in!');
      if (onLoginSuccess) {
        onLoginSuccess(session);
      } else if (onNavigateHome) {
        onNavigateHome();
      }
    }
  };

  // 3. Resend Verification Email
  const handleResendVerification = async (targetEmail: string) => {
    if (!targetEmail) return;
    setIsLoading(true);
    const res = await resendVerificationEmail(targetEmail);
    setIsLoading(false);
    triggerToast(res.message);
  };

  // 4. Send Password Recovery Email
  const handleSendRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail) return;

    setIsLoading(true);
    const res = await sendPasswordRecoveryEmail(recoveryEmail);
    setIsLoading(false);
    triggerToast(res.message);
    setViewMode('recovery-sent');
  };

  // 5. Update Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      triggerToast('❌ Passwords do not match');
      return;
    }

    setIsLoading(true);
    const res = await updatePassword(newPassword);
    setIsLoading(false);

    triggerToast(res.message);
    if (res.success) {
      setTimeout(() => {
        setViewMode('login');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] flex flex-col font-['Geist'] selection:bg-[#353534] selection:text-white relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-emerald-500/[0.03] rounded-full blur-[100px] pointer-events-none" />

      {/* Subtle Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.1) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Top Navbar */}
      <header className="h-16 border-b border-[#2a2a2a] px-4 sm:px-8 flex items-center justify-between relative z-20 bg-[#131313]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <SyntraLogo className="w-8 h-8" />
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-lg font-semibold tracking-wide text-white font-['Libre_Caslon_Text']">
              RECONCILE.AI
            </span>
            <span className="text-[10px] font-mono text-[#8e9192] uppercase tracking-widest hidden sm:inline">
              // VERITAS ER
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c1b1b] border border-[#2a2a2a] text-xs font-mono text-[#8e9192]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>SUPABASE AUTH ENCLAVE</span>
          </div>
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className="text-xs text-[#8e9192] hover:text-white transition-colors flex items-center gap-1 font-mono uppercase tracking-wider cursor-pointer"
            >
              <MaterialIcon name="arrow_back" size={14} />
              <span>Back</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Single Centered Portal */}
      <main className="w-full flex-1 flex flex-col justify-center items-center py-12 px-4 sm:px-6 relative z-10">
        <div className="w-full max-w-md mx-auto">
          {/* =========================================================================
              VIEW 1: SECURE ENTERPRISE LOGIN
             ========================================================================= */}
          {viewMode === 'login' && (
            <div className="bg-[#1c1b1b]/95 border border-[#2a2a2a] hover:border-white/20 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl relative overflow-hidden flex flex-col gap-6 transition-all">
              {/* Tabs: Sign In / Create Account */}
              <div className="flex p-1 bg-[#131313] border border-[#2a2a2a] rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setViewMode('login')}
                  className="flex-1 py-2 rounded-lg bg-white text-[#131313] font-bold shadow-xs transition-all cursor-pointer text-center"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('signup')}
                  className="flex-1 py-2 rounded-lg text-[#8e9192] hover:text-white transition-all cursor-pointer text-center"
                >
                  Create Account
                </button>
              </div>

              {/* Card Header */}
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Libre_Caslon_Text']">
                  Welcome Back
                </h1>
                <p className="text-xs text-[#8e9192]">
                  Sign in with your verified institutional email to access the reconciliation queue.
                </p>
              </div>

              {/* Unconfirmed Email Warning Alert */}
              {unconfirmedEmailAlert && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col gap-2">
                  <div className="flex items-start gap-2.5">
                    <MaterialIcon name="mark_email_unread" size={18} className="text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-semibold text-amber-300 block">
                        Email Verification Required
                      </span>
                      <p className="text-[11px] text-amber-200/80 mt-0.5 leading-relaxed">
                        Please confirm your email address via the link sent to{' '}
                        <strong className="text-white font-mono">{unconfirmedEmailAlert}</strong>.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleResendVerification(unconfirmedEmailAlert)}
                    disabled={isLoading}
                    className="self-end px-3 py-1 bg-amber-400 text-black rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-amber-300 transition cursor-pointer"
                  >
                    Resend Link
                  </button>
                </div>
              )}

              {/* Credentials Form */}
              <form onSubmit={handleSignIn} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#c4c7c8] uppercase tracking-wider">
                    Work Email
                  </label>
                  <div className="relative flex items-center">
                    <MaterialIcon
                      name="mail"
                      size={18}
                      className="absolute left-3.5 text-[#8e9192] pointer-events-none"
                    />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="reviewer@institution.edu"
                      required
                      className="w-full h-11 bg-[#131313] text-white placeholder-[#8e9192] text-xs pl-10 pr-4 rounded-xl border border-[#2a2a2a] focus:border-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#c4c7c8] uppercase tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setRecoveryEmail(loginEmail);
                        setViewMode('forgot-password');
                      }}
                      className="text-[11px] text-[#8e9192] hover:text-white transition-colors uppercase tracking-wider cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative flex items-center">
                    <MaterialIcon
                      name="lock"
                      size={18}
                      className="absolute left-3.5 text-[#8e9192] pointer-events-none"
                    />
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full h-11 bg-[#131313] text-white placeholder-[#8e9192] text-xs pl-10 pr-10 rounded-xl border border-[#2a2a2a] focus:border-white focus:outline-none transition-colors font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 text-[#8e9192] hover:text-white transition-colors cursor-pointer"
                    >
                      <MaterialIcon
                        name={showLoginPassword ? 'visibility_off' : 'visibility'}
                        size={18}
                      />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#8e9192] pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded bg-[#131313] border-[#2a2a2a] text-white focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    <span>Remember this station</span>
                  </label>
                  <span className="font-mono text-[10px] text-[#8e9192]">TLS 1.3 SECURED</span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-white hover:bg-[#e2e2e2] text-[#131313] rounded-xl font-semibold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm mt-2 disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-[#131313] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In to Station</span>
                      <MaterialIcon name="arrow_forward" size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* =========================================================================
              VIEW 2: CREATE ACCOUNT (SIGN UP)
             ========================================================================= */}
          {viewMode === 'signup' && (
            <div className="bg-[#1c1b1b]/95 border border-[#2a2a2a] hover:border-white/20 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl relative overflow-hidden flex flex-col gap-6 transition-all">
              {/* Tabs: Sign In / Create Account */}
              <div className="flex p-1 bg-[#131313] border border-[#2a2a2a] rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setViewMode('login')}
                  className="flex-1 py-2 rounded-lg text-[#8e9192] hover:text-white transition-all cursor-pointer text-center"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('signup')}
                  className="flex-1 py-2 rounded-lg bg-white text-[#131313] font-bold shadow-xs transition-all cursor-pointer text-center"
                >
                  Create Account
                </button>
              </div>

              {/* Card Header */}
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Libre_Caslon_Text']">
                  Register Account
                </h1>
                <p className="text-xs text-[#8e9192]">
                  Create an account. You will receive an email confirmation link from Supabase.
                </p>
              </div>

              {/* Signup Form */}
              <form onSubmit={handleSignUp} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#c4c7c8] uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative flex items-center">
                    <MaterialIcon
                      name="badge"
                      size={18}
                      className="absolute left-3.5 text-[#8e9192] pointer-events-none"
                    />
                    <input
                      type="text"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="Dr. Senku Ishigami"
                      required
                      className="w-full h-11 bg-[#131313] text-white placeholder-[#8e9192] text-xs pl-10 pr-4 rounded-xl border border-[#2a2a2a] focus:border-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#c4c7c8] uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <MaterialIcon
                      name="mail"
                      size={18}
                      className="absolute left-3.5 text-[#8e9192] pointer-events-none"
                    />
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="senku@reconcile.ai"
                      required
                      className="w-full h-11 bg-[#131313] text-white placeholder-[#8e9192] text-xs pl-10 pr-4 rounded-xl border border-[#2a2a2a] focus:border-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Role Selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#c4c7c8] uppercase tracking-wider">
                    Operational Role
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSignupRole('reviewer')}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col gap-1 ${
                        signupRole === 'reviewer'
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                          : 'bg-[#131313] border-[#2a2a2a] text-[#8e9192] hover:border-[#3a3a3a]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider">Reviewer</span>
                        {signupRole === 'reviewer' && (
                          <MaterialIcon name="check_circle" size={14} className="text-emerald-400" />
                        )}
                      </div>
                      <span className="text-[10px] text-[#8e9192]">Triage & resolve conflicts</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSignupRole('admin')}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col gap-1 ${
                        signupRole === 'admin'
                          ? 'bg-white/10 border-white text-white'
                          : 'bg-[#131313] border-[#2a2a2a] text-[#8e9192] hover:border-[#3a3a3a]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider">Admin</span>
                        {signupRole === 'admin' && (
                          <MaterialIcon name="check_circle" size={14} className="text-white" />
                        )}
                      </div>
                      <span className="text-[10px] text-[#8e9192]">System & dataset control</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#c4c7c8] uppercase tracking-wider">
                    Create Password
                  </label>
                  <div className="relative flex items-center">
                    <MaterialIcon
                      name="lock"
                      size={18}
                      className="absolute left-3.5 text-[#8e9192] pointer-events-none"
                    />
                    <input
                      type={showSignupPassword ? 'text' : 'password'}
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      required
                      className="w-full h-11 bg-[#131313] text-white placeholder-[#8e9192] text-xs pl-10 pr-10 rounded-xl border border-[#2a2a2a] focus:border-white focus:outline-none transition-colors font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-3 text-[#8e9192] hover:text-white transition-colors cursor-pointer"
                    >
                      <MaterialIcon
                        name={showSignupPassword ? 'visibility_off' : 'visibility'}
                        size={18}
                      />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#c4c7c8] uppercase tracking-wider">
                    Confirm Password
                  </label>
                  <div className="relative flex items-center">
                    <MaterialIcon
                      name="lock_outline"
                      size={18}
                      className="absolute left-3.5 text-[#8e9192] pointer-events-none"
                    />
                    <input
                      type="password"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      required
                      className="w-full h-11 bg-[#131313] text-white placeholder-[#8e9192] text-xs pl-10 pr-4 rounded-xl border border-[#2a2a2a] focus:border-white focus:outline-none transition-colors font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-white hover:bg-[#e2e2e2] text-[#131313] rounded-xl font-semibold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm mt-2 disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-[#131313] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Register & Send Confirmation</span>
                      <MaterialIcon name="send" size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* =========================================================================
              VIEW 3: EMAIL VERIFICATION PENDING
             ========================================================================= */}
          {viewMode === 'verify-pending' && (
            <div className="bg-[#1c1b1b]/95 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl relative overflow-hidden flex flex-col gap-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <MaterialIcon name="mark_email_read" size={32} />
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono tracking-wider uppercase border border-emerald-500/20">
                  CONFIRMATION DISPATCHED
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Libre_Caslon_Text'] mt-2">
                  Verify Your Email
                </h2>
                <p className="text-sm text-[#8e9192] max-w-sm mx-auto leading-relaxed">
                  A verification email has been dispatched to:
                </p>
                <div className="py-2 px-3 rounded-xl bg-[#131313] border border-[#2a2a2a] text-white font-mono text-xs inline-block">
                  {pendingVerificationEmail}
                </div>
                <p className="text-xs text-[#8e9192] max-w-sm mx-auto leading-relaxed pt-2">
                  Please open your inbox and click the activation link to confirm your identity. Once confirmed, you can sign in securely.
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleResendVerification(pendingVerificationEmail)}
                  disabled={isLoading}
                  className="w-full h-11 bg-white hover:bg-[#e2e2e2] text-[#131313] rounded-xl font-semibold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <MaterialIcon name="refresh" size={16} />
                  <span>Resend Confirmation Email</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail(pendingVerificationEmail);
                    setViewMode('login');
                  }}
                  className="w-full h-11 bg-[#131313] hover:bg-[#201f1f] text-white rounded-xl font-semibold text-xs uppercase tracking-wider transition border border-[#2a2a2a] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MaterialIcon name="login" size={16} />
                  <span>Proceed to Sign In</span>
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 4: FORGOT PASSWORD
             ========================================================================= */}
          {viewMode === 'forgot-password' && (
            <div className="bg-[#1c1b1b]/95 border border-[#2a2a2a] rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setViewMode('login')}
                  className="p-2 rounded-xl bg-[#131313] border border-[#2a2a2a] text-[#8e9192] hover:text-white transition cursor-pointer"
                >
                  <MaterialIcon name="arrow_back" size={16} />
                </button>
                <div>
                  <h2 className="text-xl font-bold text-white font-['Libre_Caslon_Text']">
                    Recover Password
                  </h2>
                  <p className="text-xs text-[#8e9192]">
                    Reset link will be dispatched via Supabase & Brevo SMTP.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSendRecovery} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#c4c7c8] uppercase tracking-wider">
                    Enter Registered Email
                  </label>
                  <div className="relative flex items-center">
                    <MaterialIcon
                      name="mail"
                      size={18}
                      className="absolute left-3.5 text-[#8e9192] pointer-events-none"
                    />
                    <input
                      type="email"
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      placeholder="operator@enterprise.com"
                      required
                      className="w-full h-11 bg-[#131313] text-white placeholder-[#8e9192] text-xs pl-10 pr-4 rounded-xl border border-[#2a2a2a] focus:border-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-white hover:bg-[#e2e2e2] text-[#131313] rounded-xl font-semibold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-[#131313] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Send Recovery Link</span>
                      <MaterialIcon name="send" size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* =========================================================================
              VIEW 5: RECOVERY SENT
             ========================================================================= */}
          {viewMode === 'recovery-sent' && (
            <div className="bg-[#1c1b1b]/95 border border-[#2a2a2a] rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl flex flex-col gap-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white mx-auto">
                <MaterialIcon name="forward_to_inbox" size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-['Libre_Caslon_Text']">
                  Recovery Email Dispatched
                </h2>
                <p className="text-xs text-[#8e9192] mt-1 max-w-sm mx-auto">
                  If an account exists for <strong className="text-white">{recoveryEmail}</strong>, a secure reset token has been sent.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setViewMode('login')}
                className="w-full h-11 bg-white hover:bg-[#e2e2e2] text-[#131313] rounded-xl font-semibold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Back to Sign In</span>
              </button>
            </div>
          )}

          {/* =========================================================================
              VIEW 6: SET NEW PASSWORD
             ========================================================================= */}
          {viewMode === 'reset-password' && (
            <div className="bg-[#1c1b1b]/95 border border-[#2a2a2a] rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-bold text-white font-['Libre_Caslon_Text']">
                  Set New Master Password
                </h2>
                <p className="text-xs text-[#8e9192] mt-1">
                  Enter your new password to update your Supabase credentials.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#c4c7c8] uppercase tracking-wider">
                    New Password
                  </label>
                  <div className="relative flex items-center">
                    <MaterialIcon
                      name="lock"
                      size={18}
                      className="absolute left-3.5 text-[#8e9192] pointer-events-none"
                    />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full h-11 bg-[#131313] text-white placeholder-[#8e9192] text-xs pl-10 pr-10 rounded-xl border border-[#2a2a2a] focus:border-white focus:outline-none transition font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 text-[#8e9192] hover:text-white cursor-pointer"
                    >
                      <MaterialIcon
                        name={showNewPassword ? 'visibility_off' : 'visibility'}
                        size={18}
                      />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#c4c7c8] uppercase tracking-wider">
                    Confirm New Password
                  </label>
                  <div className="relative flex items-center">
                    <MaterialIcon
                      name="lock_outline"
                      size={18}
                      className="absolute left-3.5 text-[#8e9192] pointer-events-none"
                    />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full h-11 bg-[#131313] text-white placeholder-[#8e9192] text-xs pl-10 pr-4 rounded-xl border border-[#2a2a2a] focus:border-white focus:outline-none transition font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-white hover:bg-[#e2e2e2] text-[#131313] rounded-xl font-semibold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm mt-2"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-[#131313] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Update Password</span>
                      <MaterialIcon name="check" size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="h-12 border-t border-[#2a2a2a] px-6 flex items-center justify-between text-[11px] text-[#8e9192] font-mono relative z-20 bg-[#131313]/90">
        <div>RECONCILE.AI // VERITAS ER</div>
        <div>SUPABASE AUTHENTICATION ENGINE</div>
      </footer>

      {/* Toast Notification */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
}
