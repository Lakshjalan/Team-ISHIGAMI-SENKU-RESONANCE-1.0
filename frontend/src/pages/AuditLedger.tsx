import React, { useState } from 'react';
import MaterialIcon from '../components/icons/MaterialIcon';

export default function AuditLedger() {
  const [isReverifying, setIsReverifying] = useState(false);
  const [reverifySuccess, setReverifySuccess] = useState(false);
  const [filterCategory, setFilterCategory] = useState<'all' | 'merge' | 'override' | 'genesis'>('all');
  const [timeTravelIndex, setTimeTravelIndex] = useState<number>(2);
  const [showVerifyToast, setShowVerifyToast] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 1800);
  };

  const handleReverify = () => {
    setIsReverifying(true);
    setTimeout(() => {
      setIsReverifying(false);
      setReverifySuccess(true);
      setTimeout(() => {
        setReverifySuccess(false);
      }, 2000);
    }, 1200);
  };

  const handleVerifySingleLeaf = () => {
    setShowVerifyToast(true);
    setTimeout(() => setShowVerifyToast(false), 3500);
  };

  const viewMergedState = () => {
    setTimeTravelIndex(2);
    const slider = document.getElementById('timeTravelSlider');
    if (slider) {
      slider.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const exportProofJSON = (blockNumber: string) => {
    const proofPayload = {
      block_id: blockNumber,
      timestamp: "2026-09-07T21:55:42.000Z",
      merkle_root: "0x8a7f92bce19d45a0b7c2e19d5012eafbc0942ff901ac8842",
      consensus_witnesses: ["node-alpha", "node-beta", "node-enclave"],
      signature_scheme: "ed25519-dalek"
    };
    const blob = new Blob([JSON.stringify(proofPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reconcile-audit-proof-block-${blockNumber}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const snapshots = [
    {
      label: "GENESIS (21:00:00 UTC)",
      version: "v1.0.0-genesis",
      name: '"Rahul Sharma"',
      regNo: '"2021BTCS042"',
      phone: '"(unassigned)"',
      email: '"rahul.s@institute.ac.in"',
      status: '"INITIAL_RAW_CANDIDATE"',
      merkle: '"0x3e18a992bc01488eff29a102"'
    },
    {
      label: "OVERRIDE (21:20:10 UTC)",
      version: "v2.1.0-staged",
      name: '"Rahul Sharma"',
      regNo: '"2021BTCS042"',
      phone: '"+91 98765 43210" (OTP Confirmed)',
      email: '"rahul.sharma@alumni.org"',
      status: '"OVERRIDE_PENDING_MERGE"',
      merkle: '"0x4b1c88d2f1056c80a90f3312"'
    },
    {
      label: "HEAD STATE (21:55:42 UTC)",
      version: "v3.0.0-sealed",
      name: '"Rahul Sharma"',
      regNo: '"2021BTCS042"',
      phone: '"+91 98765 43210"',
      email: '"rahul.sharma@alumni.org"',
      status: '"RESOLVED_CANONICAL"',
      merkle: '"0x8a7f92bc4a89fb7c2e19d"'
    }
  ];

  const currentState = snapshots[timeTravelIndex];

  return (
    <div className="flex flex-col w-full h-full pb-10">
      <div className="max-w-[1280px] w-full mx-auto px-margin-mobile lg:px-margin-desktop py-8 flex flex-col gap-8">
        
        {/* Top Breadcrumb & Screen Title Block */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 self-start px-3 py-1 bg-surface-container-high rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            <span className="font-label-md text-label-md tracking-widest text-on-surface-variant uppercase">
              IMMUTABLE SHA-256 LEDGER · MERKLE PROOF VERIFIED · BLOCK #8,941,204
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
                Cryptographic Audit Ledger & Integrity Timeline
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-3xl">
                Tamper-evident, hash-chained audit ledger logging all identity merges, manual overrides, and state changes with cryptographic verification.
              </p>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md uppercase tracking-wider bg-surface-container px-3 py-2 rounded-full">
              <MaterialIcon icon="verified_user" className="text-[16px] text-primary" />
              <span>Zero-Knowledge Consensus Enclave Active</span>
            </div>
          </div>
        </div>

        {/* Chain Status Banner */}
        <div className="bg-surface-container rounded-3xl p-5 shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
          {/* Glow Underlay Decorator */}
          <div className="absolute -left-12 -top-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center flex-shrink-0 shadow-md">
              <MaterialIcon icon="shield_with_heart" className="text-primary text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-body-lg text-body-lg font-semibold text-primary">
                  Ledger Chain Status: TAMPER-FREE (100% Valid SHA-256 Chain)
                </span>
                <span className="w-2 h-2 rounded-full bg-primary"></span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">
                All 18,492 block transitions cryptographically verified against root consensus hash.
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 relative z-10">
            <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full shadow-inner">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Root Hash:</span>
              <code className="font-mono text-xs text-primary tracking-tight">0x8a7f92bc...e19d</code>
              <button 
                className="text-on-surface-variant hover:text-primary transition-colors flex items-center" 
                onClick={() => handleCopy('0x8a7f92bce19d45a089b21f9c34e0078b66e34279b7c2e19d')}
                title="Copy Root Hash"
              >
                {copiedHash === '0x8a7f92bce19d45a089b21f9c34e0078b66e34279b7c2e19d' ? (
                  <MaterialIcon icon="done" className="text-[16px] text-primary" />
                ) : (
                  <MaterialIcon icon="content_copy" className="text-[16px]" />
                )}
              </button>
            </div>
            <button 
              className="h-10 px-5 rounded-full bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider hover:bg-primary-fixed transition-all flex items-center gap-2 shadow-md" 
              onClick={handleReverify}
              disabled={isReverifying}
            >
              {isReverifying ? (
                <>
                  <MaterialIcon icon="refresh" className="text-[18px] animate-spin" />
                  <span>Verifying 18,492 Blocks...</span>
                </>
              ) : reverifySuccess ? (
                <>
                  <MaterialIcon icon="verified" className="text-[18px]" />
                  <span>100% Intact</span>
                </>
              ) : (
                <>
                  <MaterialIcon icon="bolt" className="text-[18px]" />
                  <span>Re-Verify Hash Chain Integrity</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Summary Metrics Row (3 Bento Pods) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Pod 1 */}
          <div className="bg-surface-container rounded-3xl p-6 shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant">
                IMMUTABLE LEDGER ENTRIES
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-label-md text-label-md uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                Zero Tamper Events
              </span>
            </div>
            <div>
              <div className="font-headline-lg text-display-lg text-primary leading-none tracking-tight">
                18,492
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                Blocks recorded in linear cryptographic sequence.
              </p>
            </div>
          </div>
          
          {/* Pod 2 */}
          <div className="bg-surface-container rounded-3xl p-6 shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant">
                CONSENSUS VERIFICATION SPEED
              </span>
              <MaterialIcon icon="speed" className="text-on-surface-variant text-[20px]" />
            </div>
            <div>
              <div className="font-headline-lg text-display-lg text-primary leading-none tracking-tight">
                1.42 <span className="font-body-md text-headline-md text-on-surface-variant">ms</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                SHA-256 Merkle proofs mean latency across nodes.
              </p>
            </div>
          </div>
          
          {/* Pod 3 */}
          <div className="bg-surface-container rounded-3xl p-6 shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant">
                HUMAN INTERVENTION RATE
              </span>
              <MaterialIcon icon="tune" className="text-on-surface-variant text-[20px]" />
            </div>
            <div>
              <div className="font-headline-lg text-display-lg text-primary leading-none tracking-tight">
                0.024%
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                99.976% Deterministic / AI Consensus rate.
              </p>
            </div>
          </div>
        </div>

        {/* Main Two-Column Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column 1 (Left 65% ~ 8 cols): Interactive Hash Chain Timeline Tree */}
          <div className="lg:col-span-8 bg-surface-container rounded-3xl p-6 lg:p-8 shadow-md flex flex-col gap-6">
            
            {/* Section Header & Filter Pills */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <MaterialIcon icon="account_tree" className="text-primary text-[22px]" />
                <h2 className="font-headline-md text-headline-md text-primary tracking-tight">
                  Hash Chain Event Stream
                </h2>
              </div>
              
              {/* Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-surface-container-low rounded-full">
                <button 
                  className={`px-4 py-1.5 rounded-full font-label-md text-label-md uppercase tracking-wider transition-all ${filterCategory === 'all' ? 'bg-primary text-on-primary' : 'bg-transparent text-on-surface-variant hover:text-primary'}`}
                  onClick={() => setFilterCategory('all')}
                >
                  ALL (18,492)
                </button>
                <button 
                  className={`px-3 py-1.5 rounded-full font-label-md text-label-md uppercase tracking-wider transition-all ${filterCategory === 'merge' ? 'bg-primary text-on-primary' : 'bg-transparent text-on-surface-variant hover:text-primary'}`}
                  onClick={() => setFilterCategory('merge')}
                >
                  MERGES (14,120)
                </button>
                <button 
                  className={`px-3 py-1.5 rounded-full font-label-md text-label-md uppercase tracking-wider transition-all ${filterCategory === 'override' ? 'bg-primary text-on-primary' : 'bg-transparent text-on-surface-variant hover:text-primary'}`}
                  onClick={() => setFilterCategory('override')}
                >
                  OVERRIDES (602)
                </button>
                <button 
                  className={`px-3 py-1.5 rounded-full font-label-md text-label-md uppercase tracking-wider transition-all ${filterCategory === 'genesis' ? 'bg-primary text-on-primary' : 'bg-transparent text-on-surface-variant hover:text-primary'}`}
                  onClick={() => setFilterCategory('genesis')}
                >
                  GENESIS
                </button>
              </div>
            </div>

            {/* Vertical Hash Chain Timeline */}
            <div className="relative flex flex-col gap-8 mt-2 pl-4 sm:pl-6">
              {/* Luminous Connecting Track line */}
              <div className="absolute left-7 sm:left-9 top-4 bottom-8 w-0.5 bg-surface-container-high -z-0"></div>
              
              {/* NODE 3: LATEST / HEAD (MERGE_APPROVED) */}
              {(filterCategory === 'all' || filterCategory === 'merge') && (
                <div className="relative z-10 flex items-start gap-4 sm:gap-6">
                  <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center flex-shrink-0 mt-1 shadow-lg ring-4 ring-surface-container">
                    <span className="w-2 h-2 rounded-full bg-on-primary"></span>
                  </div>
                  <div className="flex-1 bg-surface-container-low rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-0.5 rounded-full bg-surface-container-highest text-primary font-label-md text-label-md uppercase tracking-wider">
                          MERGE_APPROVED
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface font-label-md text-label-md uppercase">
                          Block #18,492
                        </span>
                      </div>
                      <span className="font-mono text-xs text-on-surface-variant">
                        Sep 07, 2026 · 21:55:42 UTC
                      </span>
                    </div>
                    
                    {/* Master Profile Anchor */}
                    <div className="flex items-center justify-between bg-surface-container p-3 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-primary font-label-md text-label-md font-bold">
                          RS
                        </div>
                        <div>
                          <span className="font-body-md text-body-md font-medium text-primary">Rahul Sharma</span>
                          <span className="font-mono text-xs text-on-surface-variant ml-2">MST-1004</span>
                        </div>
                      </div>
                      <div className="text-right hidden sm:block">
                        <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider block">Operator</span>
                        <span className="font-mono text-xs text-primary">admin@reconcile.ai</span>
                      </div>
                    </div>
                    
                    <p className="font-body-md text-body-md text-on-surface">
                      Approved entity resolution merge between <span className="font-semibold text-primary">Core Banking ERP (SRC_A)</span> &amp; <span className="font-semibold text-primary">Campus Management SIS (SRC_B)</span> with AI Arbitrator confidence <span className="text-primary font-bold">94.2%</span>.
                    </p>
                    
                    {/* Cryptographic Hash Block */}
                    <div className="bg-surface-container-lowest rounded-2xl p-4 flex flex-col gap-2 font-mono text-xs text-on-surface-variant">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">Prev Hash:</span>
                        <button 
                          className="bg-surface-container px-2 py-0.5 rounded text-on-surface hover:text-primary transition-colors flex items-center gap-1"
                          onClick={() => handleCopy('4b1c88d2f1056c80a90f331219bfe98ac02198f122894120')}
                        >
                          <span>4b1c88d2f1056c80...a90f3312</span>
                          {copiedHash === '4b1c88d2f1056c80a90f331219bfe98ac02198f122894120' ? (
                            <MaterialIcon icon="done" className="text-[14px] text-primary" />
                          ) : (
                            <MaterialIcon icon="content_copy" className="text-[14px]" />
                          )}
                        </button>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <span className="font-label-md text-label-md uppercase tracking-wider text-primary">Current Hash:</span>
                        <button 
                          className="bg-surface-container-high text-primary px-2.5 py-0.5 rounded flex items-center gap-1.5 shadow-sm hover:bg-surface-bright transition-colors"
                          onClick={() => handleCopy('8a7f92bce19d45a0b7c2e19d5012eafbc0942ff901ac8842')}
                        >
                          <MaterialIcon icon="key" className="text-[14px]" />
                          <span>8a7f92bce19d45a0...b7c2e19d</span>
                        </button>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 mt-1 border-t-0 bg-surface-container-low/40 p-2 rounded-xl">
                        <span>Merkle Leaf: <code className="text-primary">0x9f18a2...3c41</code></span>
                        <span>Nonce: <code className="text-primary">489,102</code></span>
                        <span className="text-primary uppercase font-label-md text-label-md tracking-wider">Witness: 3/3 Validated</span>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button 
                        className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md uppercase tracking-wider transition-colors flex items-center gap-2"
                        onClick={viewMergedState}
                      >
                        <MaterialIcon icon="visibility" className="text-[16px]" />
                        <span>View Merged State</span>
                      </button>
                      <button 
                        className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-primary font-label-md text-label-md uppercase tracking-wider transition-colors flex items-center gap-2"
                        onClick={() => exportProofJSON('18492')}
                      >
                        <MaterialIcon icon="download" className="text-[16px]" />
                        <span>Export Proof JSON</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* NODE 2: MANUAL OVERRIDE */}
              {(filterCategory === 'all' || filterCategory === 'override') && (
                <div className="relative z-10 flex items-start gap-4 sm:gap-6">
                  <div className="w-6 h-6 rounded-full bg-surface-container-highest text-primary flex items-center justify-center flex-shrink-0 mt-1 shadow-lg ring-4 ring-surface-container">
                    <MaterialIcon icon="edit" className="text-[14px]" />
                  </div>
                  <div className="flex-1 bg-surface-container-low rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-0.5 rounded-full bg-surface-container-highest text-primary font-label-md text-label-md uppercase tracking-wider">
                          MANUAL_OVERRIDE
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface font-label-md text-label-md uppercase">
                          Block #18,491
                        </span>
                      </div>
                      <span className="font-mono text-xs text-on-surface-variant">
                        Sep 07, 2026 · 21:20:10 UTC
                      </span>
                    </div>
                    
                    {/* Master Profile Anchor */}
                    <div className="flex items-center justify-between bg-surface-container p-3 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-primary font-label-md text-label-md font-bold">
                          RS
                        </div>
                        <div>
                          <span className="font-body-md text-body-md font-medium text-primary">Rahul Sharma</span>
                          <span className="font-mono text-xs text-on-surface-variant ml-2">MST-1004</span>
                        </div>
                      </div>
                      <div className="text-right hidden sm:block">
                        <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider block">Operator</span>
                        <span className="font-mono text-xs text-primary">operator_2</span>
                      </div>
                    </div>
                    
                    <p className="font-body-md text-body-md text-on-surface">
                      Operator manually updated <code className="font-mono text-xs text-primary bg-surface-container px-1.5 py-0.5 rounded">golden_phone_number</code> to overriding low-confidence SIS field due to verified OTP challenge.
                    </p>
                    
                    {/* Diff visualization */}
                    <div className="bg-surface-container p-3 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs">
                      <span className="text-on-surface-variant">field: <span className="text-primary font-semibold">golden_phone_number</span></span>
                      <div className="flex items-center gap-2">
                        <span className="line-through text-on-surface-variant">+91 98111 22334</span>
                        <MaterialIcon icon="arrow_forward" className="text-[14px] text-primary" />
                        <span className="text-primary bg-surface-container-high px-2 py-0.5 rounded font-bold">+91 98765 43210</span>
                      </div>
                    </div>
                    
                    {/* Cryptographic Hash Block */}
                    <div className="bg-surface-container-lowest rounded-2xl p-4 flex flex-col gap-2 font-mono text-xs text-on-surface-variant">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">Prev Hash:</span>
                        <button 
                          className="bg-surface-container px-2 py-0.5 rounded text-on-surface hover:text-primary transition-colors flex items-center gap-1"
                          onClick={() => handleCopy('3e18a992bc01488eff29a10245a089b21f9c34e0078b66e3427')}
                        >
                          <span>3e18a992bc01488e...ff29a102</span>
                          {copiedHash === '3e18a992bc01488eff29a10245a089b21f9c34e0078b66e3427' ? (
                            <MaterialIcon icon="done" className="text-[14px] text-primary" />
                          ) : (
                            <MaterialIcon icon="content_copy" className="text-[14px]" />
                          )}
                        </button>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <span className="font-label-md text-label-md uppercase tracking-wider text-primary">Current Hash:</span>
                        <button 
                          className="bg-surface-container-high text-primary px-2.5 py-0.5 rounded flex items-center gap-1.5 shadow-sm hover:bg-surface-bright transition-colors"
                          onClick={() => handleCopy('4b1c88d2f1056c80a90f331219bfe98ac02198f122894120')}
                        >
                          <MaterialIcon icon="key" className="text-[14px]" />
                          <span>4b1c88d2f1056c80...a90f3312</span>
                        </button>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button 
                        className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-primary font-label-md text-label-md uppercase tracking-wider transition-colors flex items-center gap-2"
                        onClick={() => exportProofJSON('18491')}
                      >
                        <MaterialIcon icon="download" className="text-[16px]" />
                        <span>Export Proof JSON</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* NODE 1: GENESIS */}
              {(filterCategory === 'all' || filterCategory === 'genesis') && (
                <div className="relative z-10 flex items-start gap-4 sm:gap-6">
                  <div className="w-6 h-6 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center flex-shrink-0 mt-1 shadow-lg ring-4 ring-surface-container">
                    <MaterialIcon icon="fiber_manual_record" className="text-[14px]" />
                  </div>
                  <div className="flex-1 bg-surface-container-low rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-0.5 rounded-full bg-surface-container-highest text-primary font-label-md text-label-md uppercase tracking-wider">
                          INITIAL_INGESTION (GENESIS)
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface font-label-md text-label-md uppercase">
                          Block #18,490
                        </span>
                      </div>
                      <span className="font-mono text-xs text-on-surface-variant">
                        Sep 07, 2026 · 21:00:00 UTC
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between bg-surface-container p-3 rounded-2xl">
                      <span className="font-body-md text-body-md text-on-surface">Source: <strong className="text-primary">Core Banking ERP (SRC-ERP-901)</strong></span>
                      <span className="font-mono text-xs text-on-surface-variant">SYSTEM_GENESIS_WORKER</span>
                    </div>
                    
                    <p className="font-body-md text-body-md text-on-surface">
                      Ingestion and candidate cluster instantiation from Core Banking ERP (SRC-ERP-901). Initial vector embedding assigned to cluster root.
                    </p>
                    
                    {/* Cryptographic Hash Block */}
                    <div className="bg-surface-container-lowest rounded-2xl p-4 flex flex-col gap-2 font-mono text-xs text-on-surface-variant">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">Prev Hash (Genesis Zero):</span>
                        <span className="text-on-surface-variant truncate max-w-xs">0000000000000000000000000000000000000000...</span>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <span className="font-label-md text-label-md uppercase tracking-wider text-primary">Current SHA-256 Hash:</span>
                        <button 
                          className="bg-surface-container-high text-primary px-2.5 py-0.5 rounded flex items-center gap-1.5 shadow-sm hover:bg-surface-bright transition-colors"
                          onClick={() => handleCopy('3e18a992bc01488eff29a10245a089b21f9c34e0078b66e3427')}
                        >
                          <MaterialIcon icon="key" className="text-[14px]" />
                          <span>3e18a992bc01488e...ff29a102</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Column 2 (Right 35% ~ 4 cols): Time-Travel Historical Snapshot Viewer & Cryptographic Verification Inspector */}
          <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
            
            {/* Time-Travel State Inspector Card */}
            <div className="bg-surface-container rounded-3xl p-6 lg:p-7 shadow-md flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                  <MaterialIcon icon="history_toggle_off" className="text-[20px]" />
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md text-primary tracking-tight">
                    Time-Travel State
                  </h3>
                  <p className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">
                    Historical Snapshot Inspector
                  </p>
                </div>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Reconstruct the exact golden master schema and values at any point in the immutable chain.
              </p>
              
              {/* Interactive Slider Control */}
              <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">Target State</span>
                  <span className="font-mono text-xs text-primary font-semibold">
                    {currentState.label}
                  </span>
                </div>
                
                {/* Custom Styled Range Slider */}
                <div className="relative py-2">
                  <input 
                    id="timeTravelSlider"
                    type="range" 
                    min="0" 
                    max="2" 
                    step="1" 
                    value={timeTravelIndex}
                    onChange={(e) => setTimeTravelIndex(Number(e.target.value))}
                    className="w-full accent-primary bg-surface-container-high h-2 rounded-lg cursor-pointer appearance-none" 
                  />
                </div>
                
                {/* Step Marks */}
                <div className="flex justify-between font-mono text-[10px] text-on-surface-variant">
                  <span className={timeTravelIndex === 0 ? "text-primary font-bold" : ""}>Genesis<br/>(21:00)</span>
                  <span className={`text-center ${timeTravelIndex === 1 ? "text-primary font-bold" : ""}`}>Override<br/>(21:20)</span>
                  <span className={`text-right ${timeTravelIndex === 2 ? "text-primary font-bold" : ""}`}>Merge Commit<br/>(21:55 Head)</span>
                </div>
              </div>
              
              {/* Snapshot State Card Payload */}
              <div className="bg-surface-container-low rounded-2xl p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 border-b-0">
                  <div>
                    <span className="font-body-md text-body-md font-bold text-primary block">Rahul Sharma</span>
                    <span className="font-mono text-xs text-on-surface-variant">MST-1004</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-surface-container-highest text-primary font-mono text-xs">
                    {currentState.version}
                  </span>
                </div>
                
                {/* Payload Table */}
                <div className="flex flex-col gap-2 font-mono text-xs pt-1">
                  <div className="flex justify-between py-1.5 px-2 rounded-lg bg-surface-container/60">
                    <span className="text-on-surface-variant">name:</span>
                    <span className="text-primary font-medium">{currentState.name}</span>
                  </div>
                  <div className="flex justify-between py-1.5 px-2 rounded-lg bg-surface-container/60">
                    <span className="text-on-surface-variant">registration_no:</span>
                    <span className="text-primary font-medium">{currentState.regNo}</span>
                  </div>
                  <div className="flex justify-between py-1.5 px-2 rounded-lg bg-surface-container/60">
                    <span className="text-on-surface-variant">phone:</span>
                    <span className="text-primary font-medium">{currentState.phone}</span>
                  </div>
                  <div className="flex justify-between py-1.5 px-2 rounded-lg bg-surface-container/60">
                    <span className="text-on-surface-variant">primary_email:</span>
                    <span className="text-primary font-medium">{currentState.email}</span>
                  </div>
                  <div className="flex justify-between py-1.5 px-2 rounded-lg bg-surface-container/60">
                    <span className="text-on-surface-variant">status:</span>
                    <span className="text-primary font-semibold">{currentState.status}</span>
                  </div>
                  <div className="flex flex-col gap-1 py-1.5 px-2 rounded-lg bg-surface-container/60">
                    <span className="text-on-surface-variant">merkle_root:</span>
                    <span className="text-on-surface truncate">{currentState.merkle}</span>
                  </div>
                </div>
              </div>
              
              {/* Cryptographic Signature Verification Pod */}
              <div className="bg-surface-container-high rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <MaterialIcon icon="verified" className="text-primary text-[18px]" />
                  <span className="font-body-md text-body-md font-semibold text-primary">
                    ED25519 Clustered Node Signature Valid
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-on-surface-variant">
                  <span>Witness Signatures</span>
                  <span className="text-primary font-bold">3 / 3 Validator Nodes Signed</span>
                </div>
                
                {/* Validator Nodes Pill Strip */}
                <div className="grid grid-cols-3 gap-2 text-center font-mono text-[10px]">
                  <div className="bg-surface-container px-2 py-1.5 rounded-lg text-on-surface">
                    Node-Alpha<br/><span className="text-on-surface-variant">0x7a...8b</span>
                  </div>
                  <div className="bg-surface-container px-2 py-1.5 rounded-lg text-on-surface">
                    Node-Beta<br/><span className="text-on-surface-variant">0x3c...1e</span>
                  </div>
                  <div className="bg-surface-container px-2 py-1.5 rounded-lg text-on-surface">
                    Node-Enclave<br/><span className="text-on-surface-variant">0x99...fa</span>
                  </div>
                </div>
                
                {/* Primary Action Button */}
                <button 
                  className="mt-2 w-full h-11 rounded-full bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider hover:bg-primary-fixed transition-all flex items-center justify-center gap-2 shadow-md"
                  onClick={() => exportProofJSON('8941204')}
                >
                  <MaterialIcon icon="file_download" className="text-[18px]" />
                  <span>Download Cryptographic Receipt</span>
                </button>
              </div>
            </div>
            
            {/* Quick Proof Verifier Interactive Tool */}
            <div className="bg-surface-container rounded-3xl p-6 shadow-md flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-headline-md text-body-lg text-primary font-semibold">Merkle Path Quick-Check</span>
                <span className="font-mono text-xs text-on-surface-variant">O(log n)</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm">
                Verify any arbitrary state hash directly against the current block header using hardware enclave consensus.
              </p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  defaultValue="8a7f92bce19d45a0b7c2" 
                  placeholder="Enter block hash or leaf..." 
                  className="w-full bg-surface-container-lowest px-3 py-2 rounded-full font-mono text-xs text-primary focus:outline-none"
                />
                <button 
                  className="px-4 py-2 rounded-full bg-surface-container-high hover:bg-surface-bright text-primary font-label-md text-label-md uppercase tracking-wider transition-colors"
                  onClick={handleVerifySingleLeaf}
                >
                  Verify
                </button>
              </div>
              
              {showVerifyToast && (
                <div className="text-xs font-mono text-primary bg-surface-container-low p-2.5 rounded-xl flex items-center gap-2">
                  <MaterialIcon icon="check_circle" className="text-[16px]" />
                  <span>Proof Valid • Included in Root Block #18,492</span>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
