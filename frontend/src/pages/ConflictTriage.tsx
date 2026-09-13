import React, { useState, useEffect, useCallback } from 'react';
import MaterialIcon from '../components/icons/MaterialIcon';
import Toast from '../components/ui/Toast';
import Modal from '../components/ui/Modal';
import { Page } from '../components/layout/Header';
import { API_BASE } from '../services/api';

export interface ConflictItem {
  id: string;
  name: string;
  field: string;
  priority: string;
  confidence: number;
  recommendation: string;
  reasoning: string;
  assignedTo: string | null;
  assignedAt?: string;
  sourceA: {
    name: string;
    value: string;
    trust: number;
    recordId: string;
    lastUpdated: string;
  };
  sourceB: {
    name: string;
    value: string;
    trust: number;
    recordId: string;
    lastUpdated: string;
  };
}

export interface ActiveReviewer {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface ConflictTriageProps {
  onNavigate?: (page: Page) => void;
  currentUserName?: string;
  currentUserRole?: 'admin' | 'reviewer';
  activeReviewers?: ActiveReviewer[];
}

const DEFAULT_REVIEWERS: ActiveReviewer[] = [
  { id: 'rev_1', name: 'Priya Singh', email: 'priya.singh@syntra.ai', role: 'reviewer' },
  { id: 'rev_2', name: 'Alex Chen', email: 'alex.chen@syntra.ai', role: 'reviewer' },
  { id: 'rev_3', name: 'Marcus Vance', email: 'marcus.vance@syntra.ai', role: 'reviewer' },
];

export default function ConflictTriage({
  onNavigate,
  currentUserName = 'Priya Singh',
  currentUserRole: _currentUserRole = 'reviewer',
  activeReviewers = DEFAULT_REVIEWERS,
}: ConflictTriageProps) {
  const [conflictList, setConflictList] = useState<ConflictItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [manualModalConflict, setManualModalConflict] = useState<ConflictItem | null>(null);
  const [customValue, setCustomValue] = useState<string>('');

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const response = await fetch(`${API_BASE}/review/queue`);
        if (response.ok) {
          const data = await response.json();
          // Map DB queue to UI ConflictItem
          const mappedQueue = data.queue.map((q: any) => {
            const keys = Object.keys(q.field_diffs || {});
            const field = keys[0] || 'Unknown';
            return {
              id: q.id,
              name: q.record_1?.name || 'Unknown Student',
              field,
              priority: 'Medium',
              confidence: Math.round(q.match_confidence * 100) || 0,
              recommendation: 'Source A',
              reasoning: 'Automated match confidence suggests Source A is more reliable.',
              assignedTo: null,
              sourceA: {
                name: 'Source 1',
                value: q.field_diffs?.[field]?.record_1 || 'N/A',
                trust: 90,
                recordId: q.record_1?.id || 'N/A',
                lastUpdated: new Date(q.created_at).toLocaleDateString(),
              },
              sourceB: {
                name: 'Source 2',
                value: q.field_diffs?.[field]?.record_2 || 'N/A',
                trust: 85,
                recordId: q.record_2?.id || 'N/A',
                lastUpdated: new Date(q.created_at).toLocaleDateString(),
              },
            };
          });
          setConflictList(mappedQueue);
        }
      } catch (err) {
        console.error('Failed to fetch review queue', err);
      }
    };
    fetchQueue();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
  };

  const handleResolve = useCallback(
    (id: string, decision: string) => {
      setConflictList((prev) => prev.filter((c) => c.id !== id));
      triggerToast(`Resolved: ${decision}`);
      setManualModalConflict(null);
    },
    []
  );

  // Auto-distribute conflicts among active reviewers
  const handleDistributeConflicts = () => {
    const reviewersList = activeReviewers.length > 0 ? activeReviewers : DEFAULT_REVIEWERS;
    const count = conflictList.length;
    const perReviewer = Math.ceil(count / reviewersList.length);

    const distributed = conflictList.map((item, idx) => {
      const reviewer = reviewersList[idx % reviewersList.length];
      return {
        ...item,
        assignedTo: reviewer.name,
        assignedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    });

    setConflictList(distributed);

    // Calculate actual count assigned to current user
    const userAssigned = distributed.filter((item) => item.assignedTo === currentUserName).length;
    const assignedCount = userAssigned > 0 ? userAssigned : perReviewer;

    triggerToast(
      `⚡ ${count} conflicts distributed across ${reviewersList.length} active reviewers (${assignedCount} assigned to you)!`
    );

    // Trigger browser push notification pop-up
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const showAssignNotification = () => {
        try {
          new Notification('🔔 New Conflict Review Assignment', {
            body: `You have ${assignedCount} conflict record(s) assigned for triage review.`,
            // Vite public assets need an absolute path or be in the public directory
            icon: '/favicon.png',
          });
        } catch (err) {
          console.warn('Browser push notification could not be created:', err);
        }
      };

      if (Notification.permission === 'granted') {
        showAssignNotification();
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            showAssignNotification();
          }
        });
      }
    }
  };

  // Keyboard shortcut listener for active top conflict
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return;
      const topConflict = conflictList[0];
      if (!topConflict) return;

      if (e.key.toLowerCase() === 'a') {
        handleResolve(topConflict.id, `Adopted ${topConflict.sourceA.name} for ${topConflict.name}`);
      } else if (e.key.toLowerCase() === 'b') {
        handleResolve(topConflict.id, `Adopted ${topConflict.sourceB.name} for ${topConflict.name}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [conflictList, handleResolve]);

  const assignedToMeCount = conflictList.filter(
    (item) => item.assignedTo && currentUserName && item.assignedTo.toLowerCase().includes(currentUserName.toLowerCase())
  ).length;

  const filteredConflicts = conflictList.filter((item) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'high') return item.priority === 'High';
    if (activeFilter === 'my-assigned') {
      return (
        item.assignedTo &&
        currentUserName &&
        item.assignedTo.toLowerCase().includes(currentUserName.toLowerCase())
      );
    }
    return item.field.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <div className="flex flex-col gap-8 pb-12">
      <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#201f1f]">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight font-['Libre_Caslon_Text']">
            Conflict Review Queue
          </h1>
          <p className="text-sm text-[#8e9192] mt-1 max-w-xl">
            Review field-level discrepancies across matched candidate entities. Compare source evidence and commit resolutions to the master record.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#8e9192] bg-[#1c1b1b] border border-[#2a2a2a] px-3.5 py-2 rounded-lg">
          <MaterialIcon name="keyboard" size={16} />
          <span>Hotkeys: Press <kbd className="px-1.5 py-0.5 rounded bg-[#2a2a2a] text-white font-mono text-[10px]">A</kbd> for Source A, <kbd className="px-1.5 py-0.5 rounded bg-[#2a2a2a] text-white font-mono text-[10px]">B</kbd> for Source B</span>
        </div>
      </div>

      {/* Active Reviewers & Conflict Distribution Bento (Requested by user) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#1c1b1b] border border-[#2a2a2a] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#131313] border border-[#2a2a2a]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[#8e9192]">Active Reviewers:</span>
            <strong className="text-white font-mono">{activeReviewers.length} Online</strong>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#131313] border border-[#2a2a2a]">
            <MaterialIcon name="assignment" size={15} className="text-blue-400" />
            <span className="text-[#8e9192]">Total Queue:</span>
            <strong className="text-white font-mono">{conflictList.length} Conflicts</strong>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#131313] border border-[#2a2a2a]">
            <MaterialIcon name="pie_chart" size={15} className="text-amber-400" />
            <span className="text-[#8e9192]">Per Reviewer Quota:</span>
            <strong className="text-white font-mono">
              ~{Math.ceil(conflictList.length / (activeReviewers.length || 1))} records
            </strong>
          </div>
        </div>

        <button
          onClick={handleDistributeConflicts}
          className="h-10 px-4 rounded-xl bg-white hover:bg-[#e2e2e2] text-[#131313] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
        >
          <MaterialIcon name="hub" size={16} />
          <span>Distribute Among Reviewers</span>
        </button>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: `All (${conflictList.length})` },
            { id: 'my-assigned', label: `Assigned to Me (${assignedToMeCount})` },
            { id: 'high', label: 'High Priority' },
            { id: 'email', label: 'Email' },
            { id: 'phone', label: 'Phone' },
            { id: 'name', label: 'Name' },
            { id: 'address', label: 'Address' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-white text-[#131313] shadow-sm'
                  : 'bg-[#1c1b1b] text-[#c4c7c8] hover:text-white border border-[#2a2a2a]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-[#8e9192]">
          Showing <strong className="text-white">{filteredConflicts.length}</strong> of {conflictList.length} items
        </span>
      </div>

      {/* Queue Items */}
      {filteredConflicts.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#1c1b1b] border border-[#2a2a2a] text-center flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <MaterialIcon name="verified" size={24} />
          </div>
          <h3 className="text-lg font-bold text-white">Queue Clear</h3>
          <p className="text-xs text-[#8e9192] max-w-md">
            All candidate conflicts have been resolved or accepted into the Golden Master directory.
          </p>
          <button
            onClick={() => onNavigate?.('golden-master-directory')}
            className="mt-2 px-5 py-2.5 rounded-lg bg-white text-[#131313] text-xs font-bold uppercase tracking-wider hover:bg-[#e2e2e2] transition-colors"
          >
            View Master Directory
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-5 group/triage-list">
          {filteredConflicts.map((conflict, index) => (
            <div
              key={conflict.id}
              className="p-6 rounded-2xl bg-[#1c1b1b] border border-[#2a2a2a] hover:border-[#353534] transition-all duration-300 flex flex-col gap-5 shadow-sm group-has-[:hover]/triage-list:blur-[2px] group-has-[:hover]/triage-list:opacity-60 hover:!blur-none hover:!opacity-100 hover:z-10"
            >
              {/* Conflict Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#201f1f]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center text-xs font-bold text-white">
                    {conflict.name
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-bold text-white">{conflict.name}</span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#2a2a2a] text-[#c4c7c8]">
                        Field: {conflict.field}
                      </span>
                      {conflict.assignedTo && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1 ${
                            currentUserName && conflict.assignedTo.toLowerCase().includes(currentUserName.toLowerCase())
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold'
                              : 'bg-[#252424] text-[#8e9192] border border-[#353534]'
                          }`}
                        >
                          <MaterialIcon name="person" size={12} />
                          <span>
                            {conflict.assignedTo}
                            {currentUserName && conflict.assignedTo.toLowerCase().includes(currentUserName.toLowerCase()) ? ' (You)' : ''}
                          </span>
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#8e9192] font-mono">ID: {conflict.id}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                      conflict.priority === 'High'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : conflict.priority === 'Medium'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}
                  >
                    {conflict.priority} Priority
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-[#131313] px-2.5 py-1 rounded border border-[#2a2a2a]">
                    {conflict.confidence}% Match
                  </span>
                </div>
              </div>

              {/* AI Reasoning Pill */}
              <div className="p-3.5 rounded-xl bg-[#131313] border border-[#2a2a2a] flex items-start gap-3">
                <MaterialIcon name="psychology" size={20} className="text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">Evidence & Discrepancy Rationale</span>
                    <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.2 rounded">
                      Recommendation: {conflict.recommendation}
                    </span>
                  </div>
                  <p className="text-xs text-[#c4c7c8] leading-relaxed">{conflict.reasoning}</p>
                </div>
              </div>

              {/* Side-by-Side Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Source A */}
                <div
                  className={`p-4 rounded-xl border flex flex-col justify-between gap-4 ${
                    conflict.recommendation === 'Source A'
                      ? 'bg-[#201f1f] border-white/20'
                      : 'bg-[#131313] border-[#2a2a2a]'
                  }`}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <MaterialIcon name="database" size={14} />
                        <span>{conflict.sourceA.name}</span>
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {conflict.sourceA.trust}% Trust
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-[#0e0e0e] border border-[#2a2a2a] font-mono text-sm text-white break-all">
                      {conflict.sourceA.value}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#8e9192]">
                      <span>Ref: {conflict.sourceA.recordId}</span>
                      <span>Updated: {conflict.sourceA.lastUpdated}</span>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleResolve(conflict.id, `Adopted ${conflict.sourceA.name} (${conflict.sourceA.value})`)
                    }
                    className="w-full py-2.5 rounded-lg bg-[#2a2a2a] hover:bg-white hover:text-[#131313] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Adopt Source A</span>
                    {index === 0 && <span className="text-[10px] opacity-70">(Key: A)</span>}
                  </button>
                </div>

                {/* Source B */}
                <div
                  className={`p-4 rounded-xl border flex flex-col justify-between gap-4 ${
                    conflict.recommendation === 'Source B'
                      ? 'bg-[#201f1f] border-white/20'
                      : 'bg-[#131313] border-[#2a2a2a]'
                  }`}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <MaterialIcon name="database" size={14} />
                        <span>{conflict.sourceB.name}</span>
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {conflict.sourceB.trust}% Trust
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-[#0e0e0e] border border-[#2a2a2a] font-mono text-sm text-white break-all">
                      {conflict.sourceB.value}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#8e9192]">
                      <span>Ref: {conflict.sourceB.recordId}</span>
                      <span>Updated: {conflict.sourceB.lastUpdated}</span>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleResolve(conflict.id, `Adopted ${conflict.sourceB.name} (${conflict.sourceB.value})`)
                    }
                    className="w-full py-2.5 rounded-lg bg-[#2a2a2a] hover:bg-white hover:text-[#131313] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Adopt Source B</span>
                    {index === 0 && <span className="text-[10px] opacity-70">(Key: B)</span>}
                  </button>
                </div>
              </div>

              {/* Bottom Custom Edit Action */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    setManualModalConflict(conflict);
                    setCustomValue(conflict.sourceA.value);
                  }}
                  className="text-xs text-[#8e9192] hover:text-white transition-colors flex items-center gap-1"
                >
                  <MaterialIcon name="edit" size={14} />
                  <span>Manual Custom Edit...</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Manual Override Custom Value Modal */}
      {manualModalConflict && (
        <Modal open={true} onClose={() => setManualModalConflict(null)}>
          <div className="flex flex-col gap-4 text-[#e5e2e1]">
            <div>
              <h3 className="text-xl font-bold text-white font-['Libre_Caslon_Text']">
                Manual Override: {manualModalConflict.field}
              </h3>
              <p className="text-xs text-[#8e9192] mt-0.5">
                Set a custom verified value for {manualModalConflict.name}. This will be logged in the immutable audit trail.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-white">Reconciled Golden Value</label>
              <input
                type="text"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#131313] border border-[#2a2a2a] text-sm text-white font-mono focus:outline-none focus:border-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2a2a2a]">
              <button
                onClick={() => setManualModalConflict(null)}
                className="px-4 py-2 rounded-lg text-xs text-[#8e9192] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleResolve(
                    manualModalConflict.id,
                    `Manual Override applied: "${customValue}" by operator`
                  )
                }
                className="px-5 py-2 rounded-lg bg-white text-[#131313] text-xs font-bold uppercase tracking-wider hover:bg-[#e2e2e2]"
              >
                Commit Override
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
