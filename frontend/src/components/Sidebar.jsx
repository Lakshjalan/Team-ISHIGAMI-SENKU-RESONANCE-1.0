import React from 'react';

/**
 * Sidebar component
 * Navigation sidebar supporting all core application domains with active highlights and badge counts
 */
export default function Sidebar({
  activeTab = 'dashboard',
  onSelectTab,
  conflictCount = 42,
}) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Command Center',
      code: 'DASHBOARD',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 'upload',
      label: 'Data Ingestion',
      code: 'INGESTION',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
    },
    {
      id: 'review',
      label: 'Review Queue',
      code: 'CONFLICT_TRIAGE',
      badge: conflictCount,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    {
      id: 'golden',
      label: 'Golden Masters',
      code: 'CANONICAL_INDEX',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      id: 'audit',
      label: 'Audit Ledger',
      code: 'SHA256_CHAIN',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      id: 'settings',
      label: 'Governance & Rules',
      code: 'SETTINGS',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      id: 'auth',
      label: 'Security & Access',
      code: 'AUTH_GATEWAY',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
    {
      id: 'errors',
      label: 'Diagnostics',
      code: 'SYSTEM_HEALTH',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-64 bg-[#0e0e0e] border-r border-[#2a2a2a] flex flex-col justify-between flex-shrink-0 min-h-screen">
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-[#2a2a2a] flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white text-black font-serif font-bold text-lg flex items-center justify-center shadow-lg">
            R
          </div>
          <div>
            <span className="font-serif text-base font-semibold text-white tracking-wide block leading-tight">
              RECONCILE.AI
            </span>
            <span className="text-[10px] font-mono text-[#8e9192] uppercase tracking-wider block">
              Veritas Mesh v1.0
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab && onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-mono text-xs transition ${
                  isActive
                    ? 'bg-white text-black font-semibold shadow-md'
                    : 'text-[#c4c7c8] hover:text-white hover:bg-[#1c1b1b]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="font-sans text-sm font-normal">{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isActive
                        ? 'bg-black text-white'
                        : 'bg-[#eab308]/20 text-[#facc15] border border-[#eab308]/40'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status */}
      <div className="p-4 m-3 rounded-xl bg-[#131313] border border-[#2a2a2a] space-y-2 text-xs font-mono">
        <div className="flex items-center justify-between">
          <span className="text-[#8e9192]">CLUSTER ENGINE:</span>
          <span className="text-[#4ade80] font-semibold">HEALTHY</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#8e9192]">SUPABASE SYNC:</span>
          <span className="text-white">ONLINE</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#8e9192]">GEMINI LLM:</span>
          <span className="text-[#c4c7c8]">CONNECTED</span>
        </div>
      </div>
    </aside>
  );
}
