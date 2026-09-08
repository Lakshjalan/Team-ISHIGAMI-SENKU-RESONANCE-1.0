import React from 'react';
import { motion } from 'framer-motion';
import MaterialIcon from '../icons/MaterialIcon';
import SyntraLogo from '../ui/SyntraLogo';

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
  { path: 'settings', label: 'System Settings' },
];

export default function Header({ activePage, onNavigate, onNewRun }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#131313]/90 backdrop-blur-xl border-b border-[#2a2a2a]">
      <div className="h-16 max-w-[1440px] mx-auto px-4 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Brand */}
        <div className="flex items-center gap-6 shrink-0">
          <button
            onClick={() => onNavigate('command-center')}
            className="flex items-center gap-3 text-left focus:outline-none group"
          >
            <SyntraLogo className="w-8 h-8 transition-transform group-hover:scale-105" />
            <span className="font-syntra text-sm sm:text-base font-light text-white uppercase tracking-[0.28em]">
              SYNTRA
            </span>
          </button>
        </div>

        {/* Center: Apple-style Segmented Control Main Nav */}
        <nav className="hidden lg:flex items-center p-1.5 rounded-full bg-[#181818] border border-white/10 shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)] relative gap-2 shrink-0">
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.path;
            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className={`relative px-5 py-2 rounded-full font-['Geist'] text-[15px] transition-colors flex items-center gap-2 select-none outline-none ${
                  isActive
                    ? 'text-white font-medium'
                    : 'text-[#8e9192] hover:text-[#c4c7c8] font-normal'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavSegment"
                    className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-md z-0"
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
                {item.badge && (
                  <span
                    className={`relative z-10 px-2 py-0.5 rounded-full text-[11px] font-bold transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
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
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onNewRun || (() => onNavigate('ingest-datasets'))}
            className="h-9 px-4 bg-white text-[#131313] rounded-lg font-['Geist'] text-xs font-semibold tracking-wide uppercase hover:bg-[#e2e2e2] transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <MaterialIcon name="add" size={16} />
            <span className="hidden sm:inline">Ingest New</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Nav */}
      <div className="flex lg:hidden overflow-x-auto px-4 py-2 border-t border-[#201f1f] gap-1 no-scrollbar bg-[#131313]">
        <div className="flex items-center p-1 rounded-full bg-[#181818] border border-white/10 shadow-inner gap-1 min-w-max">
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.path;
            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className={`relative px-3.5 py-1.5 rounded-full whitespace-nowrap text-xs font-['Geist'] transition-colors ${
                  isActive
                    ? 'bg-white/10 text-white font-semibold border border-white/20 shadow-sm'
                    : 'text-[#8e9192] hover:text-white'
                }`}
              >
                {item.label}
                {item.badge && ` (${item.badge})`}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
