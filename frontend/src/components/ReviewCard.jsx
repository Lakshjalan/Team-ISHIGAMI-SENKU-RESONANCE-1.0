import React, { useState } from 'react';
import ConfidenceBadge from './ConfidenceBadge.jsx';

/**
 * ReviewCard component
 * Side-by-side comparison of candidate records with highlighted field discrepancies,
 * LLM reasoning explanation, and human-in-the-loop action buttons.
 */
export default function ReviewCard({
  conflict = {
    id: 'CR-88219',
    confidenceScore: 0.78,
    similarityMetrics: {
      jaroWinkler: 0.91,
      cosineEmbedding: 0.84,
      levenshtein: 0.82,
      overallConfidence: 0.78,
    },
    candidateA: {
      source: 'Core Banking Ledger',
      sourceTrust: 0.98,
      timestamp: '2026-03-01 09:12:00',
      recordId: 'REC-9014-A',
      data: {
        legalName: 'Alexander J. Vance',
        taxId: '***-**-4910',
        dob: '1984-11-23',
        residence: '742 Evergreen Terrace, Springfield, OR',
        phone: '+1 (503) 555-0199',
        email: 'avance@vancetech.io',
      },
    },
    candidateB: {
      source: 'Legacy FinCorp Batch Export',
      sourceTrust: 0.68,
      timestamp: '2026-02-15 14:30:11',
      recordId: 'REC-3382-B',
      data: {
        legalName: 'Alex Vance',
        taxId: '***-**-4910',
        dob: '1984-11-23',
        residence: '742 Evergreen Terr., Springfield, OR',
        phone: '+1 (503) 555-0142',
        email: 'alex.vance@gmail.com',
      },
    },
    llmReasoning:
      'Identity correlation score is 0.78. Strong deterministic convergence on SSN/Tax ID and DOB (exact match). Address strings exhibit minor standard postal abbreviation variation ("Terrace" vs "Terr."). Discrepancy observed in secondary phone number and personal email. Core Banking carries higher source trust (0.98) versus Legacy FinCorp (0.68). Recommended action: MERGE under Core Banking golden master profile with secondary phone retained as alias.',
  },
  onResolve,
}) {
  const [decision, setDecision] = useState(null);
  const [isResolving, setIsResolving] = useState(false);

  const handleAction = (actionType) => {
    setIsResolving(true);
    setTimeout(() => {
      setDecision(actionType);
      setIsResolving(false);
      if (onResolve) onResolve(conflict.id, actionType);
    }, 250);
  };

  const fields = [
    { key: 'legalName', label: 'Legal Name' },
    { key: 'taxId', label: 'Tax ID / SSN' },
    { key: 'dob', label: 'Date of Birth' },
    { key: 'residence', label: 'Residence Address' },
    { key: 'phone', label: 'Primary Contact' },
    { key: 'email', label: 'Email Address' },
  ];

  if (decision) {
    return (
      <div className="rounded-xl bg-[#1c1b1b]/70 border border-[#22c55e]/40 p-6 text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-[#4ade80] font-mono text-sm font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
          CONFLICT RESOLVED: {decision.toUpperCase()}
        </div>
        <p className="text-xs font-mono text-[#8e9192]">
          Committed to cryptographic ledger for entity {conflict.id}.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-[#1c1b1b] border border-[#444748]/50 overflow-hidden space-y-0 shadow-2xl">
      {/* Top Bar */}
      <div className="p-4 bg-[#201f1f] border-b border-[#2a2a2a] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-semibold text-white bg-[#2a2a2a] px-2.5 py-1 rounded border border-[#444748]">
            {conflict.id}
          </span>
          <span className="text-xs text-[#8e9192] font-mono">Triage Priority: Level 2</span>
        </div>
        <ConfidenceBadge score={conflict.confidenceScore} />
      </div>

      {/* Side-by-Side Comparison Table */}
      <div className="p-5 overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#2a2a2a] text-[#8e9192] font-mono uppercase text-[10px]">
              <th className="py-2 px-3 w-1/4">Field Attribute</th>
              <th className="py-2 px-3 w-[37.5%]">
                Candidate A ({conflict.candidateA.source})
                <span className="block text-[9px] text-[#4ade80] font-normal">Trust: {conflict.candidateA.sourceTrust}</span>
              </th>
              <th className="py-2 px-3 w-[37.5%]">
                Candidate B ({conflict.candidateB.source})
                <span className="block text-[9px] text-[#facc15] font-normal">Trust: {conflict.candidateB.sourceTrust}</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2a]/60 font-mono">
            {fields.map(({ key, label }) => {
              const valA = conflict.candidateA.data[key];
              const valB = conflict.candidateB.data[key];
              const isMatch = valA === valB;

              return (
                <tr key={key} className={isMatch ? 'bg-transparent' : 'bg-[#eab308]/5'}>
                  <td className="py-2.5 px-3 font-semibold text-[#8e9192] flex items-center gap-1.5">
                    {!isMatch && <span className="text-[#facc15] text-xs font-bold">≠</span>}
                    {label}
                  </td>
                  <td className={`py-2.5 px-3 ${isMatch ? 'text-[#e5e2e1]' : 'text-white font-medium bg-[#22c55e]/10 rounded'}`}>
                    {valA}
                  </td>
                  <td className={`py-2.5 px-3 ${isMatch ? 'text-[#e5e2e1]' : 'text-[#facc15] font-medium bg-[#eab308]/10 rounded'}`}>
                    {valB}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* LLM Reasoning Block */}
      <div className="p-4 mx-5 mb-5 rounded-lg bg-[#131313] border border-[#2a2a2a] space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-white">
          <span className="w-2 h-2 rounded-full bg-white" />
          <span>GEMINI REASONING ENGINE (MATCH EXPLANATION)</span>
        </div>
        <p className="text-xs text-[#c4c7c8] leading-relaxed font-sans">
          {conflict.llmReasoning}
        </p>
      </div>

      {/* Resolution Action Footer */}
      <div className="p-4 bg-[#1c1b1b] border-t border-[#2a2a2a] flex flex-wrap items-center justify-between gap-3">
        <div className="text-[11px] font-mono text-[#8e9192]">
          Operator signature required for golden master commit
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => handleAction('reject')}
            disabled={isResolving}
            className="px-3 py-1.5 rounded-lg border border-[#ffb4ab]/40 bg-[#93000a]/20 text-[#ffb4ab] hover:bg-[#93000a]/40 transition"
          >
            REJECT / DISTINCT
          </button>
          <button
            onClick={() => handleAction('override')}
            disabled={isResolving}
            className="px-3 py-1.5 rounded-lg border border-[#444748] bg-[#2a2a2a] text-[#e5e2e1] hover:bg-[#353534] transition"
          >
            MANUAL OVERRIDE
          </button>
          <button
            onClick={() => handleAction('approve')}
            disabled={isResolving}
            className="px-4 py-1.5 rounded-lg bg-white text-black font-semibold hover:bg-neutral-200 transition shadow-lg"
          >
            APPROVE MERGE
          </button>
        </div>
      </div>
    </div>
  );
}
