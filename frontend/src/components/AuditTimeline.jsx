import React, { useState } from 'react';

/**
 * AuditTimeline component
 * Visual cryptographic audit trail timeline with SHA-256 hashes and time-travel record comparison
 */
export default function AuditTimeline({
  events = [
    {
      blockIndex: 41209,
      timestamp: '2026-03-01 10:14:22 UTC',
      operator: 'sec-admin@veritas.internal',
      action: 'HUMAN_RESOLVE_MERGE',
      sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      prevHash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
      details: 'Approved merge of CR-88219 (Alex Vance) into GMR-0982-4112.',
      snapshotBefore: {
        legalName: 'Alexander J. Vance',
        phone: '+1 (503) 555-0199',
        sources: ['Core Banking Ledger'],
      },
      snapshotAfter: {
        legalName: 'Alexander J. Vance',
        phone: '+1 (503) 555-0199',
        phoneAliases: ['+1 (503) 555-0142'],
        sources: ['Core Banking Ledger', 'Legacy FinCorp Export'],
      },
    },
    {
      blockIndex: 41208,
      timestamp: '2026-03-01 09:15:04 UTC',
      operator: 'SYSTEM_AUTODEDUP_ENGINE',
      action: 'DETERMINISTIC_MERGE',
      sha256Hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
      prevHash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
      details: 'Deterministic match on SSN + Exact Name with 0.992 confidence.',
      snapshotBefore: {
        legalName: 'Alexander J. Vance',
        phone: '+1 (503) 555-0199',
        sources: ['Core Banking Ledger'],
      },
      snapshotAfter: {
        legalName: 'Alexander J. Vance',
        phone: '+1 (503) 555-0199',
        sources: ['Core Banking Ledger', 'KYC Registry'],
      },
    },
    {
      blockIndex: 41207,
      timestamp: '2026-03-01 08:30:00 UTC',
      operator: 'INGEST_ORCHESTRATOR',
      action: 'INGEST_INITIAL_RECORD',
      sha256Hash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
      prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
      details: 'Genesis ingestion from Core Banking Batch 2026-03-01.',
      snapshotBefore: null,
      snapshotAfter: {
        legalName: 'Alexander J. Vance',
        phone: '+1 (503) 555-0199',
        sources: ['Core Banking Ledger'],
      },
    },
  ],
}) {
  const [expandedBlock, setExpandedBlock] = useState(null);
  const [timeTravelActive, setTimeTravelActive] = useState(false);

  return (
    <div className="space-y-6">
      {/* Top Header / Mode Switch */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#1c1b1b] border border-[#444748]/50">
        <div>
          <h4 className="font-serif text-base font-semibold text-white">
            Cryptographic Tamper-Evident Ledger
          </h4>
          <p className="text-xs font-mono text-[#8e9192]">
            SHA-256 Merkle chain integrity: <span className="text-[#4ade80]">VERIFIED 100%</span>
          </p>
        </div>

        <button
          onClick={() => setTimeTravelActive(!timeTravelActive)}
          className={`px-3 py-1.5 rounded-lg border font-mono text-xs transition ${
            timeTravelActive
              ? 'bg-white text-black font-semibold border-white'
              : 'bg-[#2a2a2a] text-[#e5e2e1] border-[#444748] hover:bg-[#353534]'
          }`}
        >
          {timeTravelActive ? 'EXIT TIME-TRAVEL' : 'ENTER TIME-TRAVEL MODE'}
        </button>
      </div>

      {/* Timeline nodes */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#2a2a2a]">
        {events.map((event) => {
          const isExpanded = expandedBlock === event.blockIndex;

          return (
            <div key={event.blockIndex} className="relative group">
              {/* Timeline Marker Dot */}
              <div className="absolute -left-[27px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#131313] border-2 border-white group-hover:border-[#4ade80] transition-colors" />

              <div className="rounded-xl bg-[#1c1b1b] border border-[#444748]/50 p-4 space-y-3 hover:border-[#8e9192] transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white bg-[#2a2a2a] px-2 py-0.5 rounded border border-[#444748]">
                      BLOCK #{event.blockIndex}
                    </span>
                    <span className="text-[#c4c7c8] font-medium">{event.action}</span>
                  </div>
                  <span className="text-[#8e9192]">{event.timestamp}</span>
                </div>

                <p className="text-xs text-[#e5e2e1]">{event.details}</p>

                {/* Hashes */}
                <div className="bg-[#131313] p-2.5 rounded-lg border border-[#2a2a2a] space-y-1 text-[11px] font-mono text-[#8e9192]">
                  <div className="truncate">
                    <span className="text-[#c4c7c8]">SHA-256: </span>
                    <span className="text-[#4ade80]">{event.sha256Hash}</span>
                  </div>
                  <div className="truncate text-[10px]">
                    <span>PREV: </span>
                    <span>{event.prevHash}</span>
                  </div>
                </div>

                {/* Time Travel Snapshot toggle */}
                {(timeTravelActive || isExpanded) && (
                  <div className="mt-3 pt-3 border-t border-[#2a2a2a] grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-lg bg-[#201f1f] border border-[#2a2a2a]">
                      <span className="text-[#8e9192] text-[10px] uppercase block mb-1">
                        State Before Block #{event.blockIndex}
                      </span>
                      <pre className="text-[11px] text-[#c4c7c8] overflow-x-auto whitespace-pre-wrap">
                        {JSON.stringify(event.snapshotBefore, null, 2) || '(Genesis - No prior state)'}
                      </pre>
                    </div>
                    <div className="p-3 rounded-lg bg-[#201f1f] border border-[#22c55e]/30">
                      <span className="text-[#4ade80] text-[10px] uppercase block mb-1">
                        State After Block #{event.blockIndex} (Committed)
                      </span>
                      <pre className="text-[11px] text-[#e5e2e1] overflow-x-auto whitespace-pre-wrap">
                        {JSON.stringify(event.snapshotAfter, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] font-mono text-[#8e9192] pt-1">
                  <span>Operator: <span className="text-[#e5e2e1]">{event.operator}</span></span>
                  <button
                    onClick={() => setExpandedBlock(isExpanded ? null : event.blockIndex)}
                    className="hover:text-white transition underline"
                  >
                    {isExpanded ? 'Hide Snapshot' : 'View Snapshot'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
