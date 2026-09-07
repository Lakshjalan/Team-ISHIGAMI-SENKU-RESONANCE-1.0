import React from 'react';
// types



export const Layout = ({
  currentScreen,
  onNavigate,
  darkMode,
  onToggleTheme,
  toastMessage,
  onDismissToast,
  onUndo,
  hasUndo,
  children,
}) => {
  const theme = {
    bg: darkMode ? 'bg-[#131313]' : 'bg-slate-50',
    textPrimary: darkMode ? 'text-[#e5e2e1]' : 'text-slate-900',
    textSecondary: darkMode ? 'text-[#a1a1aa]' : 'text-slate-600',
    header: darkMode ? 'bg-[#131313]/90 border-[#2a2a2a]' : 'bg-white/95 border-slate-200 shadow-xs',
    navPillActive: darkMode ? 'bg-white text-zinc-950 font-semibold shadow-sm' : 'bg-blue-600 text-white shadow-xs',
    navPillInactive: darkMode ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
  };

  const navItems = [
    { id: 'command', label: 'Command Center' },
    { id: 'ingestion', label: 'Data Ingestion' },
    { id: 'triage', label: 'Conflict Triage' },
    { id: 'directory', label: 'Golden Master' },
    { id: 'audit', label: 'Audit Ledger' },
    { id: 'auth', label: 'Auth & Security' },
    { id: 'settings', label: 'Governance' },
    { id: 'errors', label: 'Error & Empty' },
  ];

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.textPrimary} flex flex-col font-sans transition-colors duration-200 antialiased`}>
      {/* Accessible Live Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl text-xs flex items-center gap-3 border transition-all duration-200 ${
            darkMode
              ? 'bg-[#201f1f] border-[#3a3939] text-[#e5e2e1] shadow-black/80'
              : 'bg-slate-900 border-slate-700 text-white shadow-xl'
          }`}
        >
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shrink-0 animate-pulse"></span>
          <span className="font-medium">{toastMessage}</span>
          {hasUndo && onUndo && (
            <button
              onClick={onUndo}
              className="ml-2 px-2 py-1 rounded bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 hover:text-blue-300 font-semibold uppercase tracking-wider text-[11px] focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              Undo
            </button>
          )}
          <button
            onClick={onDismissToast}
            className="text-zinc-400 hover:text-white p-1 ml-1"
            aria-label="Dismiss notification"
          >
            &times;
          </button>
        </div>
      )}

      {/* Global Navigation Header */}
      <header className={`sticky top-0 z-30 ${theme.header} backdrop-blur-md border-b px-6 py-3.5 transition-colors`}>
        <div className="max-w-7xl mx-auto flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          {/* Logo & Operational Status */}
          <div className="flex items-center gap-3.5">
            <div 
              onClick={() => onNavigate('command')}
              className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center font-serif text-lg font-bold text-white shadow-md shadow-blue-500/20 cursor-pointer"
            >
              R
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span 
                  onClick={() => onNavigate('command')}
                  className="text-base font-serif font-bold tracking-tight cursor-pointer"
                >
                  RECONCILE.AI
                </span>
                <span className="bg-emerald-950/50 text-emerald-400 border border-emerald-800/60 text-[11px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  OPERATIONAL
                </span>
              </div>
              <p className={`text-[11px] ${theme.textSecondary}`}>
                Enterprise Multi-Source Identity Deduplication Mesh
              </p>
            </div>
          </div>

          {/* Nav Pills */}
          <nav aria-label="Main Navigation" className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${
                  currentScreen === item.id ? theme.navPillActive : theme.navPillInactive
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2.5 shrink-0 self-end xl:self-auto">
            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-full border text-xs flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 ${
                darkMode ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
              aria-label={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {darkMode ? (
                <svg className="w-4 h-4 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-slate-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            <div 
              onClick={() => onNavigate('auth')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono cursor-pointer transition-colors ${
                darkMode ? 'border-zinc-800 bg-[#1c1b1b] text-zinc-300 hover:border-zinc-600' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-blue-500"></span>
              <span>ADMIN (PARAMJEET)</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Screen Content */}
      <main className="max-w-7xl mx-auto w-full p-6 space-y-6 flex-1">
        {children}
      </main>

      {/* Global Footer */}
      <footer className={`border-t py-4 px-6 text-center text-xs font-mono ${darkMode ? 'border-zinc-800/80 text-zinc-500' : 'border-slate-200 text-slate-500'}`}>
        RECONCILE.AI Enterprise Deduplication Mesh &bull; Verifiable SHA-256 Consensus &bull; WCAG 2.2 AA Certified
      </footer>
    </div>
  );
};

export default Layout;
