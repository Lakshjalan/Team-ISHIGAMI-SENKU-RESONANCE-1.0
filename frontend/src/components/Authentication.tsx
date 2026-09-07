import React, { useState } from 'react';
import { AppScreen } from '../types';

interface AuthenticationProps {
  darkMode: boolean;
  onLoginSuccess: (email: string) => void;
  onNavigate: (screen: AppScreen) => void;
  onTriggerToast: (msg: string) => void;
}

export const Authentication: React.FC<AuthenticationProps> = ({
  darkMode,
  onLoginSuccess,
  onNavigate,
  onTriggerToast,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'recovery'>('login');
  const [recoveryStage, setRecoveryStage] = useState<1 | 2>(1);

  // Form states
  const [email, setEmail] = useState('paramjeet@reconcile.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const cardCls = darkMode ? 'bg-[#201f1f] border-[#3a3939]' : 'bg-white border-slate-200 shadow-xl';
  const textSec = darkMode ? 'text-[#a1a1aa]' : 'text-slate-600';
  const inputBg = darkMode ? 'bg-[#131313] border-[#353534] text-[#e5e2e1]' : 'bg-slate-50 border-slate-300 text-slate-900';

  // Password Strength Evaluator (Entropy)
  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = calculateStrength(newPassword);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    onTriggerToast(`Authenticated as ${email}. Welcome back!`);
    onLoginSuccess(email);
    onNavigate('command');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
      {authMode === 'login' ? (
        /* Screen Description 01: Centered Login Card */
        <div className={`${cardCls} rounded-3xl max-w-md w-full p-8 border shadow-2xl space-y-6 animate-in fade-in duration-200`}>
          <div className="text-center space-y-2">
            <div className="h-12 w-12 mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center font-serif text-2xl font-bold text-white shadow-md shadow-blue-500/20">
              R
            </div>
            <h2 className="text-2xl font-serif font-bold tracking-tight">RECONCILE.AI</h2>
            <p className={`text-xs ${textSec}`}>
              Enter your enterprise operator credentials to access identity command mesh
            </p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1">Work Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@enterprise.com"
                className={`w-full text-xs rounded-full px-4 py-2.5 border focus-visible:ring-2 focus-visible:ring-blue-500 ${inputBg}`}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('recovery');
                    setRecoveryStage(1);
                  }}
                  className="text-[11px] text-blue-400 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className={`w-full text-xs rounded-full px-4 py-2.5 border focus-visible:ring-2 focus-visible:ring-blue-500 ${inputBg}`}
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <input type="checkbox" id="remember" defaultChecked className="rounded border-zinc-700 bg-zinc-900 text-blue-600" />
              <label htmlFor="remember" className={textSec}>Remember operator session (30 days)</label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-full text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-colors shadow-sm"
            >
              Sign In to Command Center &rarr;
            </button>
          </form>

          <div className="relative text-center my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800"></div></div>
            <span className="relative px-3 bg-[#201f1f] text-[10px] uppercase font-mono text-zinc-500">
              Or Continue With
            </span>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => {
                onTriggerToast('Authenticating with Google Workspace SSO...');
                setTimeout(() => onNavigate('command'), 800);
              }}
              className="w-full py-2 rounded-full text-xs font-medium border border-zinc-700/60 bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 flex items-center justify-center gap-2 transition-colors"
            >
              <span>🌐</span> Continue with Google Workspace SSO
            </button>
            <button
              onClick={() => {
                onTriggerToast('Initiating Okta SAML 2.0 Identity Handshake...');
                setTimeout(() => onNavigate('command'), 800);
              }}
              className="w-full py-2 rounded-full text-xs font-medium border border-zinc-700/60 bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 flex items-center justify-center gap-2 transition-colors"
            >
              <span>🏢</span> Enterprise SAML 2.0 / Okta
            </button>
          </div>
        </div>
      ) : (
        /* Screen Description 02: Password Recovery Workflow */
        <div className={`${cardCls} rounded-3xl max-w-md w-full p-8 border shadow-2xl space-y-6 animate-in fade-in duration-200`}>
          {recoveryStage === 1 ? (
            <div className="space-y-5">
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-blue-400">Step 1 of 2</span>
                <h3 className="text-2xl font-serif font-bold">Reset Your Password</h3>
                <p className={`text-xs ${textSec}`}>
                  Enter your work email address to receive a secure, encrypted password recovery token.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Work Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full text-xs rounded-full px-4 py-2.5 border focus-visible:ring-2 focus-visible:ring-blue-500 ${inputBg}`}
                />
              </div>

              <button
                onClick={() => {
                  onTriggerToast(`Encrypted token dispatched to ${email}!`);
                  setRecoveryStage(2);
                }}
                className="w-full py-2.5 rounded-full text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-colors shadow-sm"
              >
                Send Recovery Token &rarr;
              </button>

              <button
                onClick={() => setAuthMode('login')}
                className="w-full text-center text-xs text-zinc-400 hover:text-white"
              >
                &larr; Back to Sign In
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-emerald-400">Step 2 of 2</span>
                <h3 className="text-2xl font-serif font-bold">Create New Password</h3>
                <p className={`text-xs ${textSec}`}>
                  Define a strong enterprise password meeting NIST SP 800-63B standards.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className={`w-full text-xs rounded-full px-4 py-2 border ${inputBg}`}
                  />
                </div>

                {/* 4-Segment Strength Meter */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className={textSec}>Entropy Strength:</span>
                    <span className="font-mono font-semibold text-emerald-400">
                      {strength === 4 ? 'Enterprise Strong' : strength === 3 ? 'Good' : strength === 2 ? 'Fair' : 'Weak'}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 h-1.5">
                    {[1, 2, 3, 4].map((seg) => (
                      <div
                        key={seg}
                        className={`rounded-full ${
                          strength >= seg
                            ? seg <= 2 ? 'bg-amber-400' : 'bg-emerald-400'
                            : 'bg-zinc-800'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className={`w-full text-xs rounded-full px-4 py-2 border ${inputBg}`}
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  onTriggerToast('Password updated! Signing into Command Center...');
                  setTimeout(() => {
                    setAuthMode('login');
                    onNavigate('command');
                  }, 800);
                }}
                className="w-full py-2.5 rounded-full text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-colors shadow-sm"
              >
                Update Password &amp; Sign In &rarr;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
