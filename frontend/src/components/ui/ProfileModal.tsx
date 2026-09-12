import React from 'react';
import MaterialIcon from '../icons/MaterialIcon';
import Modal from './Modal';
import { UserSession } from '../../pages/Authentication';

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
  session: UserSession;
  onUpdateRole?: (role: 'admin' | 'reviewer') => void;
  onSignOut: () => void;
  activeReviewersCount: number;
}

export default function ProfileModal({
  open,
  onClose,
  session,
  onSignOut,
  activeReviewersCount,
}: ProfileModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col gap-6 text-[#e5e2e1] font-['Geist']">
        {/* Header with Avatar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2a2a2a]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#131313] flex items-center justify-center font-bold text-lg shadow-md">
              {session.name[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{session.name}</h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    session.role === 'admin'
                      ? 'bg-white text-[#131313]'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}
                >
                  {session.role}
                </span>
              </div>
              <p className="text-xs text-[#8e9192] font-mono mt-0.5">{session.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8e9192] hover:text-white hover:bg-[#201f1f] transition-colors cursor-pointer"
          >
            <MaterialIcon name="close" size={18} />
          </button>
        </div>

        {/* Security & Node Details */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#131313] border border-[#2a2a2a] text-xs">
          <div>
            <span className="text-[10px] uppercase font-mono text-[#8e9192] block">Enclave ID</span>
            <span className="font-mono text-white font-semibold">{session.id}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-[#8e9192] block">Active Reviewers</span>
            <span className="font-mono text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {activeReviewersCount} Online
            </span>
          </div>
        </div>

        {/* Role Section */}
        <div className="p-4 rounded-2xl bg-[#131313] border border-[#2a2a2a] flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] uppercase font-mono text-[#8e9192] block">Assigned Operational Role</span>
            <span className="font-semibold text-white flex items-center gap-2 mt-1">
              <span>{session.role === 'admin' ? '🛡️ System Administrator' : '🔍 Conflict Reviewer'}</span>
            </span>
            <p className="text-[11px] text-[#8e9192] mt-1">
              Role permissions are securely assigned via your Supabase enterprise profile.
            </p>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 uppercase shrink-0">
            Verified RBAC
          </span>
        </div>

        {/* FCM Push Notification Status */}
        <div className="p-3.5 rounded-2xl bg-[#131313] border border-[#2a2a2a] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <MaterialIcon
              name="notifications_active"
              size={18}
              className={session.fcmToken ? 'text-emerald-400' : 'text-amber-400'}
            />
            <div>
              <span className="font-semibold text-white block">Push Notification Alerts</span>
              <span className="text-[11px] text-[#8e9192]">
                {session.fcmToken
                  ? 'FCM device token active for conflict assignments'
                  : 'Browser push notifications available'}
              </span>
            </div>
          </div>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-mono ${
              session.fcmToken
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-amber-500/10 text-amber-300'
            }`}
          >
            {session.fcmToken ? 'CONNECTED' : 'STANDBY'}
          </span>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[#2a2a2a]">
          <button
            onClick={onSignOut}
            className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <MaterialIcon name="logout" size={16} />
            <span>Sign Out</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white hover:bg-[#e2e2e2] text-[#131313] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
}
