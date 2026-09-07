import React, { useState, useEffect } from 'react';
import { AppScreen } from '../types';

interface ErrorEmptyStatesProps {
  darkMode: boolean;
  onNavigate: (screen: AppScreen) => void;
  onTriggerToast: (msg: string) => void;
}

export const ErrorEmptyStates: React.FC<ErrorEmptyStatesProps> = ({
  darkMode,
  onNavigate,
  onTriggerToast,
}) => {
  const [activePreview, setActivePreview] = useState<'404' | '500' | 'empty' | 'skeleton'>('404');
  const [retryCountdown, setRetryCountdown] = useState(5);

  const cardCls = darkMode ? 'bg-[#201f1f] border-[#3a3939]' : 'bg-white border-slate-200 shadow-xl';
  const textSec = darkMode ? 'text-[#a1a1aa]' : 'text-slate-600';
  const inputBg = darkMode ? 'bg-[#131313] border-[#353534] text-[#e5e2e1]' : 'bg-white border-slate-300 text-slate-900';

  useEffect(() => {
    if (activePreview === '500') {
      const timer = setInterval(() => {
        setRetryCountdown((prev) => (prev > 1 ? prev - 1 : 5));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [activePreview]);

  return (
    <div className="space-y-6">
      {/* State Switcher Tabs */}
      <div className={`rounded-3xl p-4 border flex items-center justify-between gap-4 ${cardCls}`}>
        <div>
          <h2 className="text-xl font-serif font-bold">Error Pages, Empty States &amp; Skeletons</h2>
          <p className={`text-xs ${textSec} mt-0.5`}>Interactive previews of resilience states and fallback views</p>
        </div>
        <div className="flex bg-[#161515] p-1 rounded-full border border-zinc-800 text-xs font-mono">
          {[
            { id: '404', label: '404 Not Found' },
            { id: '500', label: '500 Outage Alert' },
            { id: 'empty', label: 'Empty States' },
            { id: 'skeleton', label: 'Skeleton Loaders' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActivePreview(tab.id as typeof activePreview)}
              className={`px-3 py-1.5 rounded-full transition-all ${
                activePreview === tab.id
                  ? 'bg-white text-zinc-950 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. 404 Screen */}
      {activePreview === '404' && (
        <div className="flex items-center justify-center min-h-[55vh]">
          <div className={`${cardCls} rounded-3xl max-w-lg w-full p-8 border shadow-2xl text-center space-y-6 animate-in fade-in duration-200`}>
            <div className="h-16 w-16 mx-auto rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="space-y-1">
              <div className="font-serif text-6xl font-bold tracking-tight">404</div>
              <h3 className="text-xl font-serif font-bold">Entity Record or Route Not Found</h3>
              <p className={`text-xs ${textSec} max-w-sm mx-auto`}>
                The requested identity token, run hash, or navigation route does not exist in the active mesh.
              </p>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search by Master ID or Name..."
                className={`w-full text-xs rounded-full px-4 py-2.5 border ${inputBg}`}
              />
            </div>

            <button
              onClick={() => onNavigate('command')}
              className="px-6 py-2.5 rounded-full text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-colors shadow-sm"
            >
              &larr; Return to Command Center
            </button>
          </div>
        </div>
      )}

      {/* 2. 500 Outage Alert */}
      {activePreview === '500' && (
        <div className="flex items-center justify-center min-h-[55vh]">
          <div className={`rounded-3xl max-w-lg w-full p-8 border border-red-900/60 shadow-2xl text-center space-y-6 bg-[#201f1f] text-white animate-in fade-in duration-200`}>
            <div className="h-16 w-16 mx-auto rounded-full bg-rose-950/80 border border-rose-700/60 flex items-center justify-center text-rose-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-mono text-rose-400 uppercase font-bold tracking-wider">
                500 &bull; Database Disconnected
              </span>
              <h3 className="text-2xl font-serif font-bold">PostgreSQL Cluster Connection Timeout</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                The primary database connection timed out during ingestion write. Standby replica is attempting automatic recovery.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-zinc-400">
                <span>Auto-Reconnect Attempt</span>
                <span>Retrying in {retryCountdown}s</span>
              </div>
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(retryCountdown / 5) * 100}%` }}
                ></div>
              </div>
            </div>

            <button
              onClick={() => onTriggerToast('Forced reconnect handshake... Cluster verified healthy!')}
              className="px-6 py-2.5 rounded-full text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-colors shadow-sm"
            >
              ⚡ Force Reconnect Now
            </button>
          </div>
        </div>
      )}

      {/* 3. Empty States */}
      {activePreview === 'empty' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`${cardCls} rounded-3xl p-8 border text-center space-y-4`}>
            <div className="h-14 w-14 mx-auto rounded-full bg-emerald-950/60 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-lg">Zero Conflicts Pending!</h3>
              <p className={`text-xs ${textSec} max-w-xs mx-auto`}>
                There are currently 0 ambiguous record pairs in the review queue. Master Golden Records are fully reconciled.
              </p>
            </div>
            <button
              onClick={() => onNavigate('command')}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200"
            >
              Back to Command Center
            </button>
          </div>

          <div className={`${cardCls} rounded-3xl p-8 border text-center space-y-4`}>
            <div className="h-14 w-14 mx-auto rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-lg">No Datasets Uploaded Yet</h3>
              <p className={`text-xs ${textSec} max-w-xs mx-auto`}>
                Register your first enterprise CSV or JSON dataset to commence entity resolution.
              </p>
            </div>
            <button
              onClick={() => onNavigate('ingestion')}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md"
            >
              Go to Ingestion Zone &rarr;
            </button>
          </div>
        </div>
      )}

      {/* 4. Skeleton Loaders */}
      {activePreview === 'skeleton' && (
        <div className={`${cardCls} rounded-3xl p-6 border space-y-4`}>
          <div className="flex justify-between items-center">
            <h3 className="font-serif font-bold text-base">Async Ingestion Loading Skeleton</h3>
            <span className="text-xs font-mono text-zinc-500">aria-busy="true"</span>
          </div>

          <div className="space-y-3 animate-pulse">
            <div className="h-10 bg-zinc-800/60 rounded-2xl w-full"></div>
            <div className="h-14 bg-zinc-800/40 rounded-2xl w-full"></div>
            <div className="h-14 bg-zinc-800/40 rounded-2xl w-full"></div>
            <div className="h-14 bg-zinc-800/40 rounded-2xl w-full"></div>
            <div className="h-14 bg-zinc-800/40 rounded-2xl w-full"></div>
          </div>
        </div>
      )}
    </div>
  );
};
