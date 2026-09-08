import React from 'react';
import MaterialIcon from '../icons/MaterialIcon';

interface NotFoundProps {
  onNavigateHome: () => void;
  onNavigateQueue?: () => void;
}

export default function NotFound({ onNavigateHome, onNavigateQueue }: NotFoundProps) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center font-['Geist']">
      <div className="w-full max-w-lg bg-[#1c1b1b] border border-[#2a2a2a] rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-[#201f1f] border border-[#2a2a2a] flex items-center justify-center text-white">
          <MaterialIcon name="travel_explore" size={32} className="text-[#8e9192]" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-[#201f1f] text-[#c4c7c8] text-xs font-mono tracking-wider uppercase border border-[#2a2a2a]">
            HTTP 404 • UNRESOLVED ROUTE
          </span>
          <h2 className="text-3xl font-semibold text-white font-['Libre_Caslon_Text'] mt-2">
            Resource Not Found
          </h2>
          <p className="text-sm text-[#8e9192] max-w-sm mx-auto leading-relaxed">
            The entity node, route path, or record ID you requested does not exist in the active reconciliation topology.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center pt-2">
          <button
            onClick={onNavigateHome}
            className="w-full sm:w-auto px-6 py-2.5 bg-white hover:bg-[#e2e2e2] text-[#131313] rounded-full text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <MaterialIcon name="dashboard" size={16} />
            <span>Command Center</span>
          </button>
          {onNavigateQueue && (
            <button
              onClick={onNavigateQueue}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#201f1f] hover:bg-[#2a2a2a] text-[#c4c7c8] hover:text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-colors border border-[#2a2a2a] flex items-center justify-center gap-2"
            >
              <MaterialIcon name="rule" size={16} />
              <span>Conflict Queue</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
