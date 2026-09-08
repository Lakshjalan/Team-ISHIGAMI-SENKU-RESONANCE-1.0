import React from 'react';
import MaterialIcon from '../icons/MaterialIcon';

interface AccessDeniedProps {
  currentRole?: string;
  requiredRole?: string;
  onElevate?: () => void;
  onBack?: () => void;
  onSwitchToAdmin?: () => void;
  onReturnToDashboard?: () => void;
}

export default function AccessDenied({
  currentRole = 'Reviewer',
  requiredRole = 'Administrator',
  onElevate,
  onBack,
  onSwitchToAdmin,
  onReturnToDashboard,
}: AccessDeniedProps) {
  const handleElevate = onElevate || onSwitchToAdmin || (() => {});
  const handleBack = onBack || onReturnToDashboard || (() => {});
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center font-['Geist']">
      <div className="w-full max-w-lg bg-[#1c1b1b] border border-amber-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <MaterialIcon name="lock" size={32} />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-[#201f1f] text-amber-400 text-xs font-mono tracking-wider uppercase border border-amber-500/20">
            HTTP 403 • ACCESS RESTRICTED
          </span>
          <h2 className="text-3xl font-semibold text-white font-['Libre_Caslon_Text'] mt-2">
            {requiredRole} Clearance Required
          </h2>
          <p className="text-sm text-[#8e9192] max-w-sm mx-auto leading-relaxed">
            Your current session has <strong className="text-white capitalize">{currentRole}</strong> privileges. Modifying institutional reliability scores and cluster parameters is restricted to {requiredRole}s.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center pt-2">
          <button
            onClick={handleElevate}
            className="w-full sm:w-auto px-6 py-2.5 bg-white hover:bg-[#e2e2e2] text-[#131313] rounded-full text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <MaterialIcon name="shield" size={16} />
            <span>Elevate to Admin Mode</span>
          </button>
          <button
            onClick={handleBack}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#201f1f] hover:bg-[#2a2a2a] text-[#c4c7c8] hover:text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-colors border border-[#2a2a2a] flex items-center justify-center gap-2"
          >
            <span>Return to Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}
