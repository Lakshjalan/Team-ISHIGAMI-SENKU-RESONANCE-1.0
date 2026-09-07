import React, { useState } from 'react';
import { SourceRegistry, TeamMember } from '../types';

interface SystemSettingsProps {
  darkMode: boolean;
  sources: SourceRegistry[];
  onTriggerToast: (msg: string) => void;
}

export const SystemSettings: React.FC<SystemSettingsProps> = ({
  darkMode,
  sources,
  onTriggerToast,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'thresholds' | 'apikeys' | 'rbac'>('thresholds');
  const [autoThreshold, setAutoThreshold] = useState(90);
  const [reviewMin, setReviewMin] = useState(60);
  const [webhookUrl, setWebhookUrl] = useState('https://api.enterprise.com/webhooks/identity-events');
  const [isCopied, setIsCopied] = useState(false);

  const [team, setTeam] = useState<TeamMember[]>([
    {
      id: 'TM-01',
      name: 'Paramjeet Kumar',
      email: 'paramjeet@reconcile.ai',
      role: 'Super Admin',
      lastActive: 'Active Now',
      avatar: 'PK',
    },
    {
      id: 'TM-02',
      name: 'Lakshya Sharma',
      email: 'laksh@reconcile.ai',
      role: 'Super Admin',
      lastActive: 'Just Now',
      avatar: 'LS',
    },
    {
      id: 'TM-03',
      name: 'Audit Lead 1',
      email: 'reviewer_1@enterprise.com',
      role: 'Triage Reviewer',
      lastActive: '2 hours ago',
      avatar: 'AL',
    },
  ]);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamMember['role']>('Triage Reviewer');
  const [showInviteModal, setShowInviteModal] = useState(false);

  const cardCls = darkMode ? 'bg-[#1c1b1b] border-[#353534]' : 'bg-white border-slate-200 shadow-xs';
  const elevatedCls = darkMode ? 'bg-[#201f1f] border-[#3a3939]' : 'bg-white border-slate-200 shadow-xs';
  const textSec = darkMode ? 'text-[#a1a1aa]' : 'text-slate-600';
  const inputBg = darkMode ? 'bg-[#131313] border-[#353534] text-[#e5e2e1]' : 'bg-white border-slate-300 text-slate-900';
  const rowHover = darkMode ? 'hover:bg-[#201f1f]/80' : 'hover:bg-slate-50';

  const copyKey = () => {
    setIsCopied(true);
    navigator.clipboard?.writeText('veritas_live_key_9f82d1c08492fba489c72');
    onTriggerToast('API Secret key copied to clipboard.');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    const newMember: TeamMember = {
      id: `TM-${Date.now().toString().slice(-4)}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      lastActive: 'Invited',
      avatar: inviteEmail.substring(0, 2).toUpperCase(),
    };
    setTeam((prev) => [...prev, newMember]);
    setShowInviteModal(false);
    setInviteEmail('');
    onTriggerToast(`Invitation dispatched to ${newMember.email} as ${newMember.role}!`);
  };

  return (
    <div className="space-y-6">
      {/* Header & Segmented Tabs */}
      <div className={`${elevatedCls} rounded-3xl p-6 border flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div>
          <h2 className="text-2xl font-serif font-bold tracking-tight">System Settings &amp; Data Governance</h2>
          <p className={`text-xs ${textSec} mt-1`}>
            Tune identity matching thresholds, configure API keys, and manage operator RBAC roles
          </p>
        </div>

        <div className="flex bg-[#161515] p-1 rounded-full border border-zinc-800 text-xs font-mono">
          {[
            { id: 'thresholds', label: 'Matching Thresholds' },
            { id: 'apikeys', label: 'API Keys & Webhooks' },
            { id: 'rbac', label: `Team RBAC (${team.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as typeof activeSubTab)}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                activeSubTab === tab.id
                  ? 'bg-white text-zinc-950 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Matching Thresholds */}
      {activeSubTab === 'thresholds' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`${cardCls} rounded-3xl p-6 border space-y-6`}>
            <div>
              <h3 className="font-serif font-bold text-base">Matching Engine Gates</h3>
              <p className={`text-xs ${textSec} mt-1`}>
                Deterministic boundary calibration for auto-resolution vs. human-in-the-loop review
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold">Auto-Merge Confidence Threshold</span>
                <span className="font-mono text-emerald-400 font-bold">{autoThreshold}%</span>
              </div>
              <input
                type="range"
                min="80"
                max="98"
                value={autoThreshold}
                onChange={(e) => setAutoThreshold(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <p className="text-[11px] text-zinc-500">
                Identity pairs with consensus score &ge; {autoThreshold}% commit directly to Golden Directory without human intervention.
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-zinc-800/80">
              <div className="flex justify-between text-xs">
                <span className="font-semibold">Human Review Triage Band Lower Bound</span>
                <span className="font-mono text-amber-400 font-bold">{reviewMin}% to {autoThreshold - 1}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="79"
                value={reviewMin}
                onChange={(e) => setReviewMin(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <p className="text-[11px] text-zinc-500">
                Matches in this interval are routed to the Conflict Queue. Records &lt; {reviewMin}% are flagged as unlinked anomalies.
              </p>
            </div>

            <button
              onClick={() => onTriggerToast('Saved updated confidence threshold gates.')}
              className="px-5 py-2 rounded-full text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-colors shadow-sm"
            >
              Save Threshold Calibration
            </button>
          </div>

          <div className={`${cardCls} rounded-3xl p-6 border space-y-4`}>
            <div>
              <h3 className="font-serif font-bold text-base">Cascading Golden Trust Hierarchy</h3>
              <p className={`text-xs ${textSec} mt-1`}>
                Source authority order applied when multiple valid values conflict
              </p>
            </div>

            <div className="space-y-2.5">
              {sources.map((src, i) => (
                <div key={src.id} className="p-3.5 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-400">
                      {i + 1}
                    </span>
                    <div>
                      <div className="font-semibold text-zinc-200">{src.name}</div>
                      <div className="text-[10px] text-zinc-500">{src.tag}</div>
                    </div>
                  </div>
                  <span className="text-blue-400 font-bold">{src.trust}% Weight</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: API Keys & Webhooks */}
      {activeSubTab === 'apikeys' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`${cardCls} rounded-3xl p-6 border space-y-5`}>
            <div>
              <h3 className="font-serif font-bold text-base">Production API Secret Keys</h3>
              <p className={`text-xs ${textSec} mt-1`}>
                Bearer keys required for programmatic ingestion and resolution queries
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-mono font-semibold text-zinc-300">live_master_identity_key</span>
                <span className="text-emerald-400 text-[11px] font-mono font-semibold">Active &bull; Read/Write</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  readOnly
                  value="veritas_live_key_9f82d1c08492fba489c72"
                  className={`flex-1 font-mono text-xs rounded-xl px-3.5 py-2 border ${inputBg}`}
                />
                <button
                  onClick={copyKey}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-colors shrink-0"
                >
                  {isCopied ? 'Copied!' : 'Copy Key'}
                </button>
              </div>
              <p className="text-[11px] text-zinc-500">Created on 2026-09-01 &bull; Last used 4 minutes ago</p>
            </div>

            <button
              onClick={() => onTriggerToast('Generated new auxiliary API Secret Token.')}
              className="px-4 py-2 rounded-full text-xs font-semibold border border-zinc-700 hover:bg-zinc-800 text-zinc-300 transition-colors"
            >
              + Generate New Secret Key
            </button>
          </div>

          <div className={`${cardCls} rounded-3xl p-6 border space-y-5`}>
            <div>
              <h3 className="font-serif font-bold text-base">Outbound Identity Event Webhook</h3>
              <p className={`text-xs ${textSec} mt-1`}>
                Real-time HTTP POST notifications dispatched on reconciliation events
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1">Webhook Endpoint URL</label>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className={`w-full text-xs font-mono rounded-full px-4 py-2 border ${inputBg}`}
                />
              </div>

              <div className="space-y-1.5 text-xs text-zinc-400">
                <div>Dispatched Events:</div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600 bg-zinc-900 border-zinc-700" />
                    <span>identity.resolved</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600 bg-zinc-900 border-zinc-700" />
                    <span>conflict.flagged</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600 bg-zinc-900 border-zinc-700" />
                    <span>run.completed</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600 bg-zinc-900 border-zinc-700" />
                    <span>block.mined</span>
                  </label>
                </div>
              </div>

              <button
                onClick={() => onTriggerToast('Sent test webhook payload (HTTP 200 OK received).')}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-colors shadow-sm"
              >
                Send Test Webhook Ping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Team RBAC Permissions */}
      {activeSubTab === 'rbac' && (
        <div className={`${cardCls} rounded-3xl border overflow-hidden space-y-4 p-6`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif font-bold text-base">Team Operator Access &amp; Permissions</h3>
              <p className={`text-xs ${textSec} mt-0.5`}>Role-Based Access Control (RBAC) governing the reconciliation mesh</p>
            </div>
            <button
              onClick={() => setShowInviteModal(true)}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-colors shadow-sm self-start sm:self-auto"
            >
              + Invite Operator
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className={`border-b ${darkMode ? 'border-zinc-800 bg-[#161515] text-zinc-400' : 'border-slate-200 bg-slate-100 text-slate-600'} font-mono uppercase tracking-wider`}>
                <tr>
                  <th className="px-6 py-3.5">Operator</th>
                  <th className="px-6 py-3.5">Assigned Role</th>
                  <th className="px-6 py-3.5">Last Active</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-zinc-800/80' : 'divide-slate-200'}`}>
                {team.map((member) => (
                  <tr key={member.id} className={`${rowHover} transition-colors`}>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                        {member.avatar}
                      </div>
                      <div>
                        <div className="font-semibold">{member.name}</div>
                        <div className={`text-[11px] font-mono ${textSec}`}>{member.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${
                        member.role === 'Super Admin'
                          ? 'bg-blue-950/60 text-blue-400 border-blue-800/60'
                          : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                      }`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-400">{member.lastActive}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onTriggerToast(`Editing access permissions for ${member.name}...`)}
                        className="text-xs font-semibold text-blue-400 hover:text-blue-300 underline"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invite Operator Modal */}
      {showInviteModal && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`rounded-3xl max-w-md w-full border shadow-2xl p-6 space-y-4 ${cardCls}`}>
            <div className="flex justify-between items-center border-b pb-3 border-zinc-800">
              <h3 className="font-serif font-bold text-lg">Invite New Operator</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-zinc-400 hover:text-white">&times;</button>
            </div>
            <form onSubmit={handleInvite} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium mb-1">Operator Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="analyst@enterprise.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className={`w-full text-xs rounded-full px-4 py-2 border ${inputBg}`}
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Access Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as TeamMember['role'])}
                  className={`w-full text-xs rounded-full px-4 py-2 border ${inputBg}`}
                >
                  <option value="Triage Reviewer">Triage Reviewer (Manual conflict resolution only)</option>
                  <option value="Auditor">Auditor (Read-only cryptographic access)</option>
                  <option value="Data Engineer">Data Engineer (Connector &amp; pipeline management)</option>
                  <option value="Super Admin">Super Admin (Full governance controls)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200"
                >
                  Dispatch Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
