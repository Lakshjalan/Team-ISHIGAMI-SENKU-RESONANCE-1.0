import React from 'react';
import MaterialIcon from '../icons/MaterialIcon';

export type Page = 'command-center' | 'ingest-datasets' | 'conflict-triage' | 'golden-master-directory' | 'audit-log' | 'settings' | 'errors';

interface HeaderProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  onNewRun?: () => void;
}

const NAV_ITEMS: { path: Page; label: string; badge?: string }[] = [
  { path: 'command-center', label: 'Dashboard' },
  { path: 'ingest-datasets', label: 'Ingest & Datasets' },
  { path: 'conflict-triage', label: 'Conflict Triage', badge: '360' },
  { path: 'golden-master-directory', label: 'Master Directory' },
  { path: 'audit-log', label: 'Audit Trail' },
];

export default function Header({ activePage, onNavigate, onNewRun }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#131313]/90 backdrop-blur-xl border-b border-[#2a2a2a]">
      <div className="h-16 max-w-[1280px] mx-auto px-4 lg:px-8 flex items-center justify-between">
        {/* Left: Brand + Status */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate('command-center')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#131313] font-bold text-sm tracking-wider">
              R
            </div>
            <div>
              <span className="font-['Geist'] text-xs font-bold tracking-[0.1em] text-white uppercase block">
                RECONCILE.AI
              </span>
              <span className="text-[10px] text-[#8e9192] uppercase tracking-wider block">
                Entity Resolution
              </span>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 bg-[#201f1f] border border-[#2a2a2a] rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="font-['Geist'] text-[11px] font-medium tracking-wide text-[#c4c7c8]">
              Engine Active
            </span>
          </div>
        </div>

        {/* Center: Main Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.path;
            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className={`px-3.5 py-1.5 rounded-lg font-['Geist'] text-xs font-medium tracking-wide transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-white text-[#131313] font-semibold shadow-sm'
                    : 'text-[#c4c7c8] hover:text-white hover:bg-[#201f1f]'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-[#131313] text-white'
                        : 'bg-[#ffb4ab]/20 text-[#ffb4ab]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => onNavigate('errors')}
            title="Preview system fallback & error states"
            className={`px-2.5 py-1.5 rounded-lg text-xs font-['Geist'] transition-colors flex items-center gap-1.5 ${
              activePage === 'errors'
                ? 'bg-[#2a2a2a] text-white'
                : 'text-[#8e9192] hover:text-white hover:bg-[#201f1f]'
            }`}
          >
            <MaterialIcon name="bug_report" size={16} />
            <span className="hidden xl:inline text-[11px]">States</span>
          </button>

          <button
            onClick={() => onNavigate('settings')}
            title="System Settings"
            className={`p-2 rounded-lg transition-colors ${
              activePage === 'settings'
                ? 'bg-[#2a2a2a] text-white'
                : 'text-[#8e9192] hover:text-white hover:bg-[#201f1f]'
            }`}
          >
            <MaterialIcon name="tune" size={18} />
          </button>

          <button
            onClick={onNewRun || (() => onNavigate('ingest-datasets'))}
            className="h-8 sm:h-9 px-3.5 sm:px-4 bg-white text-[#131313] rounded-lg font-['Geist'] text-xs font-semibold tracking-wide uppercase hover:bg-[#e2e2e2] transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <MaterialIcon name="add" size={16} />
            <span className="hidden sm:inline">Ingest New</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Nav */}
      <div className="flex lg:hidden overflow-x-auto px-4 py-2 border-t border-[#201f1f] gap-1 no-scrollbar">
        {NAV_ITEMS.map((item) => {
          const isActive = activePage === item.path;
          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`px-3 py-1 rounded-md whitespace-nowrap text-xs font-['Geist'] ${
                isActive
                  ? 'bg-white text-[#131313] font-semibold'
                  : 'text-[#c4c7c8] hover:text-white'
              }`}
            >
              {item.label}
              {item.badge && ` (${item.badge})`}
            </button>
          );
        })}
      </div>
    </header>
  );
}
