import React, { useState } from 'react';
import MaterialIcon from '../components/icons/MaterialIcon';
import Toast from '../components/ui/Toast';

type AuthView = 'login' | 'recovery';
type LoadingState = 'idle' | 'loading' | 'success';

export default function Authentication({ onNavigate }: { onNavigate?: (page?: any) => void }) {
  const [activeView, setActiveView] = useState<AuthView>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  
  const [loginStatus, setLoginStatus] = useState<LoadingState>('idle');
  const [recoveryStatus, setRecoveryStatus] = useState<LoadingState>('idle');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginStatus('loading');
    setTimeout(() => {
      setToastMsg('Enclave handshake complete. Session token dispatched.');
      setLoginStatus('idle');
    }, 1200);
  };

  const handleSendRecovery = () => {
    if (!recoveryEmail || !recoveryEmail.includes('@')) {
      setToastMsg('Please specify an authorized operator email');
      return;
    }
    setRecoveryStatus('loading');
    setTimeout(() => {
      setToastMsg(`Encrypted token dispatched to ${recoveryEmail}`);
      setRecoveryStatus('idle');
    }, 900);
  };

  const handleUpdatePassword = () => {
    if (!password || password.length < 8) {
      setToastMsg('Master password must fulfill minimum length requirements');
      return;
    }
    if (password !== confirmPassword) {
      setToastMsg('Password confirmation vectors do not match');
      return;
    }
    setToastMsg('Cryptographic master key updated across node mesh.');
    setActiveView('login');
    setPassword('');
    setConfirmPassword('');
  };

  const triggerSSO = (provider: string) => {
    setToastMsg(`Redirecting to ${provider} Identity Gateway...`);
  };

  const switchAuthTab = (tab: AuthView) => {
    setActiveView(tab);
    // Smooth scroll into view behavior
    document.getElementById(`view-${tab}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Password Entropy Logic
  const hasLen = password.length >= 12;
  const hasSym = /[^A-Za-z0-9]/.test(password);
  const hasMix = /[A-Z]/.test(password) && /[0-9]/.test(password);

  let score = 0;
  if (password.length > 0) score = 1;
  if (hasLen) score = 2;
  if (hasLen && (hasSym || hasMix)) score = 3;
  if (hasLen && hasSym && hasMix && password.length >= 16) score = 4;

  const getScoreText = () => {
    if (score === 4) return "Entropy: 128-bit SHA-256";
    if (score === 3) return "Entropy: Strong High-Tier";
    if (score === 2) return "Entropy: Standard Acceptable";
    return "Entropy: Low Complexity";
  };

  return (
    <div className="bg-background font-body-md text-body-md text-on-surface min-h-screen flex flex-col justify-between selection:bg-primary selection:text-on-primary">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-20 max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop flex items-center justify-between">
          <div className="flex items-center gap-unit">
            <img 
              alt="Brand logo" 
              className="h-8 w-auto object-contain" 
              src="https://lh3.googleusercontent.com/aida/AEtjO1Xw2ObwwjP8a_tj_E5Vd-jRZEWaxuREhQkUF7fLUT8HAkkxSEyTIpyVlf_tgZ45jS-6b4FlVj5oGFg0EELcoe4IuABuEp5XNwPzTb4wr3NiNSCkB3Cbi4qa7w-7BviOZPXLpCAR_tO_y64g_SaKAIEEVeZ_hnuz6bujT4FpObGGsQf1ituVZ0r04TUW6LNSYvq0pq1-6nDB5I0wBSocakkkAKI07xepYEe6dzW0qoknTxwO0FjllWQ7wos"
            />
            <div className="flex flex-col">
              <span className="font-headline-md text-headline-md text-primary tracking-tight">RECONCILE.AI</span>
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest hidden sm:inline-block">Enterprise Access Mesh</span>
            </div>
          </div>
          <div className="flex items-center gap-unit">
            <div className="hidden md:flex items-center gap-unit px-unit py-1 bg-surface-container-highest rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              <span className="font-label-md text-label-md text-on-surface tracking-widest uppercase">ZERO-TRUST ENCLAVE • TLS 1.3</span>
            </div>
            <nav className="flex items-center gap-unit">
              <a href="#" className="transition-colors px-unit py-1 uppercase bg-surface-container-high text-on-surface font-label-md text-label-md">Verify</a>
              <a href="#" className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors px-unit py-1 uppercase">Enclave Key</a>
              <a href="#" className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors px-unit py-1 uppercase">Override</a>
            </nav>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <MaterialIcon name="person" className="text-on-primary" size={18} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full flex-1 flex flex-col justify-center items-center pt-20 px-margin-mobile lg:px-margin-desktop relative bg-surface-dim">
        <div className="w-full max-w-container-max mx-auto flex flex-col items-center justify-center py-12 relative z-10">
          <div className="flex flex-col w-full">
            {/* Interactive View Switcher Pill */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex p-1 bg-surface-container rounded-full shadow-lg">
                <button 
                  className={`px-6 py-2 rounded-full font-label-md text-label-md uppercase tracking-wider transition-all duration-200 shadow-md flex items-center gap-2 ${activeView === 'login' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                  onClick={() => switchAuthTab('login')}
                  type="button"
                >
                  <MaterialIcon name="lock" size={16} />
                  Enterprise Login
                </button>
                <button 
                  className={`px-6 py-2 rounded-full font-label-md text-label-md uppercase tracking-wider transition-all duration-200 shadow-md flex items-center gap-2 ${activeView === 'recovery' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                  onClick={() => switchAuthTab('recovery')}
                  type="button"
                >
                  <MaterialIcon name="restart_alt" size={16} />
                  Recover Credentials
                </button>
              </div>
            </div>

            {/* Main Multi-View Enclave Stage */}
            <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column / Primary Login View */}
              <div className={`lg:col-span-7 w-full max-w-xl mx-auto flex flex-col transition-all duration-300 ${activeView === 'login' ? '' : 'opacity-40 scale-[0.98]'}`} id="view-login">
                <div className="bg-surface-container rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden flex flex-col gap-6">
                  {/* Enclave Tag & Header */}
                  <div className="flex flex-col gap-2">
                    <div className="inline-flex items-center gap-2 self-start px-3 py-1 bg-surface-container-highest rounded-full">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                      <span className="font-label-md text-label-md uppercase text-on-surface tracking-widest text-[11px]">
                        ZERO-KNOWLEDGE ENCLAVE · OPERATOR PORTAL
                      </span>
                    </div>
                    <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight mt-2">
                      RECONCILE.AI
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Enter your enterprise credentials to access identity command mesh.
                    </p>
                  </div>
                  
                  {/* Form Elements */}
                  <form className="flex flex-col gap-5 mt-2" onSubmit={handleLogin}>
                    {/* Work Email Input Capsule */}
                    <div className="flex flex-col gap-2">
                      <label className="font-label-md text-label-md uppercase text-on-surface-variant tracking-wider flex items-center gap-1.5">
                        <span>Enterprise Work Email</span>
                      </label>
                      <div className="relative flex items-center">
                        <div className="absolute left-4 flex items-center text-on-surface-variant pointer-events-none">
                          <MaterialIcon name="mail" size={20} />
                        </div>
                        <input 
                          className="w-full h-12 bg-surface-container-lowest text-on-surface placeholder:text-on-primary-container font-body-md text-body-md pl-12 pr-4 rounded-full focus:bg-surface-container-low transition-all outline-none" 
                          placeholder="operator@enterprise.com" 
                          required 
                          type="email" 
                        />
                      </div>
                    </div>
                    
                    {/* Password Input Capsule */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <label className="font-label-md text-label-md uppercase text-on-surface-variant tracking-wider flex items-center gap-1.5">
                          <span>Password</span>
                        </label>
                        <button 
                          className="font-label-md text-label-md uppercase text-secondary hover:text-primary transition-colors cursor-pointer tracking-wider" 
                          onClick={() => switchAuthTab('recovery')} 
                          type="button"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative flex items-center">
                        <div className="absolute left-4 flex items-center text-on-surface-variant pointer-events-none">
                          <MaterialIcon name="key" size={20} />
                        </div>
                        <input 
                          className="w-full h-12 bg-surface-container-lowest text-on-surface placeholder:text-on-primary-container font-body-md text-body-md pl-12 pr-12 rounded-full focus:bg-surface-container-low transition-all outline-none" 
                          placeholder="••••••••••••••••" 
                          required 
                          type={showPassword ? "text" : "password"} 
                        />
                        <button 
                          aria-label="Toggle password view" 
                          className="absolute right-4 text-on-surface-variant hover:text-on-surface flex items-center justify-center p-1" 
                          onClick={() => setShowPassword(!showPassword)} 
                          type="button"
                        >
                          <MaterialIcon name={showPassword ? "visibility_off" : "visibility"} size={20} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Security Check */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                      <label className="flex items-center gap-2.5 cursor-pointer select-none">
                        <input className="w-4 h-4 rounded bg-surface-container-lowest text-primary accent-primary cursor-pointer" type="checkbox" />
                        <span className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface">Remember me</span>
                      </label>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low self-start sm:self-auto"></div>
                    </div>
                    
                    {/* Primary Sign In Action Button */}
                    <button 
                      className="w-full h-12 mt-2 rounded-full bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-tertiary-fixed transition-all shadow-lg active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed" 
                      type="submit"
                      disabled={loginStatus === 'loading'}
                    >
                      {loginStatus === 'loading' ? (
                        <>
                          <div className="animate-spin flex items-center">
                            <MaterialIcon name="progress_activity" size={18} />
                          </div>
                          <span>Authenticating Enclave...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In to Command Center</span>
                          <MaterialIcon name="arrow_forward" size={18} />
                        </>
                      )}
                    </button>
                  </form>
                  
                  {/* Divider */}
                  <div className="relative flex items-center justify-center py-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full bg-surface-variant h-px"></div>
                    </div>
                    <span className="relative px-4 bg-surface-container text-on-surface-variant font-label-md text-label-md uppercase tracking-widest text-[11px]">
                      Or Continue With SSO
                    </span>
                  </div>
                  
                  {/* OAuth Enterprise SSO Pills */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button 
                      className="w-full h-11 px-4 rounded-full bg-surface-container-high hover:bg-surface-variant text-on-surface font-label-md text-label-md flex items-center justify-center gap-2.5 transition-all" 
                      onClick={() => triggerSSO('Google Workspace')} 
                      type="button"
                    >
                      <MaterialIcon name="public" className="text-primary" size={18} />
                      Google Workspace
                    </button>
                    <button 
                      className="w-full h-11 px-4 rounded-full bg-surface-container-high hover:bg-surface-variant text-on-surface font-label-md text-label-md flex items-center justify-center gap-2.5 transition-all" 
                      onClick={() => triggerSSO('Enterprise SAML 2.0 / Okta')} 
                      type="button"
                    >
                      <MaterialIcon name="domain_verification" className="text-primary" size={18} />
                      Enterprise SAML
                    </button>
                  </div>
                  
                  {/* Trust & Telemetry Micro-Bar */}
                  <div className="mt-4 pt-4 bg-surface-container-lowest/60 -mx-8 sm:-mx-10 -mb-8 sm:-mb-10 px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-on-surface-variant">
                    <div className="flex items-center gap-1.5 font-label-md text-label-md text-[11px] uppercase">
                      <MaterialIcon name="verified_user" className="text-primary" size={14} />
                      <span>ED25519 Mutual TLS Verification</span>
                    </div>
                    <div className="flex items-center gap-2 font-label-md text-label-md text-[11px] uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      <span>12ms Latency · EU-Central-1</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column / Password Recovery & Multi-Stage Card */}
              <div className={`lg:col-span-5 w-full max-w-xl mx-auto flex flex-col gap-6 transition-all duration-300 ${activeView === 'recovery' ? '' : 'opacity-40 scale-[0.98]'}`} id="view-recovery">
                {/* Stage 1 Bento: Request Recovery Link */}
                <div className="bg-surface-container rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md uppercase tracking-wider text-secondary px-2.5 py-0.5 bg-surface-container-highest rounded-full">
                      Stage 01 · Verification
                    </span>
                    <MaterialIcon name="mark_email_read" className="text-on-surface-variant" size={20} />
                  </div>
                  <div>
                    <h2 className="font-headline-md text-headline-md text-primary">
                      Reset Your Password
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                      Enter your email address to receive a secure password recovery link.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="relative flex items-center">
                      <div className="absolute left-4 flex items-center text-on-surface-variant pointer-events-none">
                        <MaterialIcon name="mail" size={20} />
                      </div>
                      <input 
                        className="w-full h-12 bg-surface-container-lowest text-on-surface placeholder:text-on-primary-container font-body-md text-body-md pl-12 pr-4 rounded-full outline-none focus:bg-surface-container-low transition-all" 
                        placeholder="operator@enterprise.com" 
                        type="email"
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                      />
                    </div>
                    <button 
                      className="w-full h-11 rounded-full bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-tertiary-fixed transition-all disabled:opacity-70 disabled:cursor-not-allowed" 
                      onClick={handleSendRecovery} 
                      type="button"
                      disabled={recoveryStatus === 'loading'}
                    >
                      {recoveryStatus === 'loading' ? (
                        <>
                          <div className="animate-spin flex items-center">
                            <MaterialIcon name="sync" size={18} />
                          </div>
                          <span>Signing Link...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Recovery Link</span>
                          <MaterialIcon name="send" size={18} />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Stage 2 Bento: Create New Password & Entropy Engine */}
                <div className="bg-surface-container rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md uppercase tracking-wider text-secondary px-2.5 py-0.5 bg-surface-container-highest rounded-full">
                      Stage 02 · Cryptographic Update
                    </span>
                    <MaterialIcon name="encrypted" className="text-on-surface-variant" size={20} />
                  </div>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-primary">
                      Create New Password
                    </h3>
                  </div>
                  <div className="flex flex-col gap-4">
                    {/* Password Input */}
                    <div className="relative flex items-center">
                      <div className="absolute left-4 flex items-center text-on-surface-variant pointer-events-none">
                        <MaterialIcon name="password" size={20} />
                      </div>
                      <input 
                        className="w-full h-11 bg-surface-container-lowest text-on-surface placeholder:text-on-primary-container font-body-md text-body-md pl-12 pr-4 rounded-full outline-none focus:bg-surface-container-low transition-all" 
                        placeholder="Enter new 16+ char password" 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    
                    {/* Confirm Password Input */}
                    <div className="relative flex items-center">
                      <div className="absolute left-4 flex items-center text-on-surface-variant pointer-events-none">
                        <MaterialIcon name="lock_reset" size={20} />
                      </div>
                      <input 
                        className="w-full h-11 bg-surface-container-lowest text-on-surface placeholder:text-on-primary-container font-body-md text-body-md pl-12 pr-4 rounded-full outline-none focus:bg-surface-container-low transition-all" 
                        placeholder="Confirm new master password" 
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    
                    {/* Interactive Entropy & Strength Meter */}
                    <div className="bg-surface-container-lowest p-4 rounded-2xl flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-[11px]">Key Entropy Status</span>
                        <span className="font-label-md text-label-md text-primary text-[11px] uppercase tracking-wider">
                          {getScoreText()}
                        </span>
                      </div>
                      
                      {/* 4 Segment Progress Bars */}
                      <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
                        <div className={`rounded-full transition-all duration-300 ${score >= 1 ? 'bg-primary' : 'bg-surface-variant'}`}></div>
                        <div className={`rounded-full transition-all duration-300 ${score >= 2 ? 'bg-primary' : 'bg-surface-variant'}`}></div>
                        <div className={`rounded-full transition-all duration-300 ${score >= 3 ? 'bg-primary' : 'bg-surface-variant'}`}></div>
                        <div className={`rounded-full transition-all duration-300 ${score >= 4 ? 'bg-primary' : 'bg-surface-variant'}`}></div>
                      </div>
                      
                      {/* Checklist Chips */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-md text-label-md text-[11px]">
                          <MaterialIcon name="check_circle" className={hasLen ? "text-primary" : "text-surface-variant"} size={13} />
                          <span>16+ Characters</span>
                        </div>
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-md text-label-md text-[11px]">
                          <MaterialIcon name="check_circle" className={hasSym ? "text-primary" : "text-surface-variant"} size={13} />
                          <span>Entropy Symbols</span>
                        </div>
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-md text-label-md text-[11px]">
                          <MaterialIcon name="check_circle" className="text-primary" size={13} />
                          <span>Zero Dictionary</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action CTA */}
                    <button 
                      className="w-full h-11 rounded-full bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-tertiary-fixed transition-all" 
                      onClick={handleUpdatePassword} 
                      type="button"
                    >
                      <span>Update Password & Sign In</span>
                      <MaterialIcon name="done_all" size={18} />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-lowest py-8 border-t-0 shadow-[0_-1px_8px_rgba(0,0,0,0.04)]">
        <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop flex flex-col md:flex-row items-center justify-between gap-unit text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-unit text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <MaterialIcon name="dns" className="text-primary" size={14} /> NODE MESH: EU-CENTRAL-1
            </span>
            <span className="text-outline-variant">•</span>
            <span>SOC2 TYPE II CERTIFIED</span>
            <span className="text-outline-variant">•</span>
            <span>FIPS 140-3 HARDWARE ENCLAVE</span>
          </div>
          <div className="text-on-surface-variant font-label-md text-label-md uppercase tracking-widest">
            © 2026 RECONCILE.AI INC. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      <Toast message={toastMsg} onDismiss={() => setToastMsg(null)} />
    </div>
  );
}
