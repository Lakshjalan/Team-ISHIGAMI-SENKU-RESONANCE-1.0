import React, { useState } from 'react';
import MaterialIcon from '../icons/MaterialIcon';

type Page = 'command-center' | 'ingest-datasets' | 'conflict-triage' | 'golden-master-directory' | 'audit-log' | 'settings';

interface HeaderProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const NAV_ITEMS: { path: Page; label: string }[] = [
  { path: 'command-center', label: 'Command Center' },
  { path: 'ingest-datasets', label: 'Ingest & Datasets' },
  { path: 'conflict-triage', label: 'Conflict Triage' },
  { path: 'golden-master-directory', label: 'Golden Master Directory' },
  { path: 'audit-log', label: 'Audit Log' },
];

export default function Header({ activePage, onNavigate }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 max-w-[1280px] mx-auto px-4 lg:px-12 flex items-center justify-between">
        {/* Left: Logo + Status */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('command-center')}>
            <span className="font-['Geist'] text-xs font-semibold tracking-[0.08em] text-primary uppercase">RECONCILE.AI</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-surface-container-high rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="font-['Geist'] text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant">Operational</span>
          </div>
        </div>

        {/* Center: Nav */}
        <nav className="hidden xl:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`font-['Geist'] text-xs font-semibold tracking-[0.08em] uppercase transition-colors ${
                activePage === item.path
                  ? 'text-primary font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('settings')}
            className="text-on-surface-variant hover:text-primary transition-colors"
          >
            <MaterialIcon name="settings" size={20} />
          </button>
          <button className="h-9 px-4 bg-primary text-on-primary font-['Geist'] text-xs font-semibold tracking-[0.08em] uppercase hover:bg-primary-fixed transition-colors flex items-center gap-2">
            <MaterialIcon name="add" size={16} />
            <span>New Run</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <MaterialIcon name="person" size={18} className="text-on-primary" />
          </div>
        </div>
      </div>
    </header>
  );
}
