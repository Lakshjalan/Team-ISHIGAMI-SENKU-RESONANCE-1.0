import React, { useState, useCallback } from 'react';
import MaterialIcon from '../components/icons/MaterialIcon';

export default function ErrorPages({ onNavigate: _onNavigate }: { onNavigate?: (page?: any) => void }) {
  const [activeTab, setActiveTab] = useState('all');
  const [isHydrated, setIsHydrated] = useState(false);
  
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [reconnectSuccess, setReconnectSuccess] = useState(false);
  
  const [isCopied, setIsCopied] = useState(false);

  const triggerReconnect = useCallback(() => {
    setIsReconnecting(true);
    setReconnectSuccess(false);
    setTimeout(() => {
      setIsReconnecting(false);
      setReconnectSuccess(true);
    }, 1200);
  }, []);

  const copyTraceback = useCallback(() => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }, []);

  const toggleSkeletonHydration = useCallback(() => {
    setIsHydrated(prev => !prev);
  }, []);

  return (
    <div className="w-full flex-1 flex flex-col justify-center items-center pt-20 px-margin-mobile lg:px-margin-desktop relative bg-surface-dim min-h-screen">
      <style>{`
        @keyframes tactical-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .skeleton-shimmer {
          position: relative;
          overflow: hidden;
        }
        .skeleton-shimmer::after {
          content: '';
          position: absolute;
          inset: 0;
          transform: translateX(-100%);
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
          animation: tactical-shimmer 1.8s infinite ease-in-out;
        }
      `}</style>
      
      <div className="w-full max-w-container-max mx-auto flex flex-col items-center justify-center py-12 relative z-10">
        <div className="flex flex-col w-full">
          
          {/* Top Hero Header Section */}
          <div className="w-full flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-highest/80 border border-outline-variant/40 mb-6 backdrop-blur-md shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
                ZERO-TRUST SYSTEM STATUS · EXCEPTION TAXONOMY · FAULT ENCLAVES
              </span>
            </div>
            <h1 className="font-display-lg text-display-lg text-primary max-w-4xl tracking-tight mb-4 selection:bg-surface-variant">
              System Diagnostics, Error Enclaves &amp; Empty States
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl text-center mb-10 leading-relaxed">
              Tactical fallbacks, cryptographically verified error boundaries, vacant table empty states, and skeleton pulse loaders for RECONCILE.AI.
            </p>
            
            {/* Segmented Navigation Capsule */}
            <div className="p-1.5 rounded-full bg-surface-container-lowest border border-outline-variant/50 flex flex-wrap items-center justify-center gap-1 shadow-md">
              <button 
                className={`px-6 py-2 rounded-full font-label-md text-label-md uppercase tracking-wider transition-all duration-200 ${activeTab === 'all' ? 'bg-primary text-on-primary font-semibold shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}`}
                onClick={() => setActiveTab('all')}
              >
                All System States
              </button>
              <button 
                className={`px-6 py-2 rounded-full font-label-md text-label-md uppercase tracking-wider transition-all duration-200 ${activeTab === 'exceptions' ? 'bg-primary text-on-primary font-semibold shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}`}
                onClick={() => setActiveTab('exceptions')}
              >
                404 &amp; 500 Exceptions
              </button>
              <button 
                className={`px-6 py-2 rounded-full font-label-md text-label-md uppercase tracking-wider transition-all duration-200 ${activeTab === 'empty' ? 'bg-primary text-on-primary font-semibold shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}`}
                onClick={() => setActiveTab('empty')}
              >
                Empty States
              </button>
              <button 
                className={`px-6 py-2 rounded-full font-label-md text-label-md uppercase tracking-wider transition-all duration-200 ${activeTab === 'skeletons' ? 'bg-primary text-on-primary font-semibold shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}`}
                onClick={() => setActiveTab('skeletons')}
              >
                Skeleton Loaders
              </button>
            </div>
          </div>

          {/* SECTION 1: Tactical Error Pages & Fault Enclaves */}
          {(activeTab === 'all' || activeTab === 'exceptions') && (
            <div className="state-section w-full mb-12">
              <div className="flex items-center justify-between mb-6 px-2">
                <div className="flex items-center gap-3">
                  <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Section 01 // Runtime Exceptions</span>
                  <span className="h-px w-12 bg-outline-variant"></span>
                </div>
                <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Fault Boundary: Active</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                
                {/* Pod 1: 404 Route Missing */}
                <div className="bg-surface-container rounded-3xl border border-outline-variant/40 p-8 relative overflow-hidden shadow-xl flex flex-col justify-between group hover:border-outline transition-all duration-300">
                  <div className="absolute -right-16 -top-16 w-64 h-64 bg-surface-container-highest/20 rounded-full blur-3xl pointer-events-none"></div>
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <span className="px-3.5 py-1 rounded-full bg-surface-container-highest/90 border border-outline-variant/60 font-label-md text-label-md text-on-surface uppercase tracking-widest">
                        FAULT DOMAIN: ROUTE_NOT_FOUND
                      </span>
                      <span className="font-label-md text-label-md text-on-surface-variant uppercase">EID-404-X99</span>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-surface-container-high border border-outline-variant/50 flex items-center justify-center mx-auto mb-6 shadow-inner">
                      <MaterialIcon icon="link_off" className="text-primary text-[28px]" />
                    </div>
                    <div className="text-center mb-6">
                      <span className="font-display-lg text-[72px] leading-none text-primary block mb-2 drop-shadow-[0_4px_24px_rgba(255,255,255,0.08)]">404</span>
                      <h2 className="font-headline-md text-headline-md text-primary font-semibold mb-3">
                        Entity Record or Route Not Found in Mesh
                      </h2>
                      <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
                        The requested record ID or application route does not exist or has been cryptographically archived in cold storage.
                      </p>
                    </div>
                    <div className="bg-surface-container-low rounded-full px-5 py-3 border border-outline-variant/60 w-full my-6 flex items-center justify-between focus-within:border-primary transition-colors shadow-inner">
                      <div className="flex items-center gap-3 w-full mr-2">
                        <MaterialIcon icon="search" className="text-on-surface-variant text-[20px]" />
                        <input className="bg-transparent border-0 outline-none text-on-surface font-body-md text-body-md placeholder:text-on-surface-variant/60 w-full focus:ring-0" placeholder="Search Record ID or Golden Master Hash..." type="text"/>
                      </div>
                      <kbd className="px-2.5 py-1 rounded bg-surface-container-highest border border-outline-variant/60 font-label-md text-label-md text-on-surface-variant uppercase">⌘K</kbd>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-outline-variant/20">
                    <button className="px-6 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider font-semibold hover:bg-primary-container transition-colors shadow-sm flex items-center gap-2">
                      <MaterialIcon icon="arrow_back" className="text-[16px]" /> Return to Command Center
                    </button>
                    <button className="px-5 py-2.5 rounded-full bg-surface-container-high/60 border border-outline-variant/60 text-on-surface hover:bg-surface-container-highest font-label-md text-label-md uppercase tracking-wider transition-colors flex items-center gap-2">
                      <MaterialIcon icon="sync_alt" className="text-[16px]" /> Trace Route Diagnostics
                    </button>
                  </div>
                </div>

                {/* Pod 2: 500 Outage Pod */}
                <div className="bg-surface-container rounded-3xl border border-error-container/70 p-8 relative overflow-hidden shadow-xl flex flex-col justify-between group">
                  <div className="absolute -right-16 -top-16 w-64 h-64 bg-error-container/10 rounded-full blur-3xl pointer-events-none"></div>
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-error-container/40 border border-error/30">
                        <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
                        <span className="font-label-md text-label-md text-error uppercase tracking-widest font-semibold">
                          CRITICAL: PGSQL CLUSTER TIMEOUT
                        </span>
                      </div>
                      <span className="font-label-md text-label-md text-error/80 uppercase">NODE: REPLICA-EU-3</span>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-error-container/30 border border-error/30 flex items-center justify-center mx-auto mb-6 shadow-inner">
                      <MaterialIcon icon="gpp_maybe" className="text-error text-[28px]" />
                    </div>
                    <div className="text-center mb-6">
                      <span className="font-headline-md text-headline-md text-error font-bold tracking-tight block mb-2">
                        500 - DATABASE DISCONNECTED
                      </span>
                      <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
                        The backend Express or Supabase PostgreSQL database connection timed out. Consensus engine is attempting auto-reconnect across secondary replicas.
                      </p>
                    </div>
                    <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/40 mb-6 shadow-inner">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-label-md text-label-md text-on-surface flex items-center gap-1.5 uppercase">
                          <MaterialIcon icon="refresh" className="text-[14px] text-error animate-spin" /> Auto-reconnecting to cluster...
                        </span>
                        <span className="font-label-md text-label-md text-on-surface-variant">
                          {isReconnecting ? 'Querying Secondary Replicas...' : reconnectSuccess ? 'Reconnected to postgres-eu-central-1 replica.' : 'Retrying in 4.2s (Attempt 3/5)'}
                        </span>
                      </div>
                      <div className="w-full bg-surface-container-lowest h-2 rounded-full overflow-hidden">
                        <div className={`bg-gradient-to-r from-error-container via-error to-primary-container h-full rounded-full transition-all duration-500 ease-out`} style={{ width: reconnectSuccess ? '100%' : '65%' }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-outline-variant/20">
                    <button 
                      className={`px-6 py-2.5 rounded-full ${reconnectSuccess ? 'bg-primary text-on-primary' : 'bg-primary text-on-primary'} font-label-md text-label-md uppercase tracking-wider font-semibold hover:bg-primary-container transition-colors shadow-sm flex items-center gap-2`}
                      onClick={triggerReconnect}
                    >
                      {isReconnecting ? (
                        <><MaterialIcon icon="autorenew" className="text-[16px] animate-spin" /> Connecting...</>
                      ) : reconnectSuccess ? (
                        <><MaterialIcon icon="check_circle" className="text-[16px]" /> Consensus Synced</>
                      ) : (
                        <><MaterialIcon icon="bolt" className="text-[16px]" /> Force Reconnect Now</>
                      )}
                    </button>
                    <button 
                      className="px-5 py-2.5 rounded-full bg-surface-container-high/60 border border-outline-variant/60 text-on-surface hover:bg-surface-container-highest font-label-md text-label-md uppercase tracking-wider transition-colors flex items-center gap-2"
                      onClick={copyTraceback}
                    >
                      {isCopied ? (
                        <><MaterialIcon icon="done" className="text-[16px]" /> Copied (SHA256 Signed)</>
                      ) : (
                        <><MaterialIcon icon="content_copy" className="text-[16px]" /> Copy Error Traceback (JSON)</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: Zero-State & Empty State Placeholders */}
          {(activeTab === 'all' || activeTab === 'empty') && (
            <div className="state-section w-full mb-12">
              <div className="flex items-center justify-between mb-6 px-2">
                <div className="flex items-center gap-3">
                  <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Section 02 // Clean Registers &amp; Vacant Pools</span>
                  <span className="h-px w-12 bg-outline-variant"></span>
                </div>
                <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Storage State: Synchronized</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                
                {/* Empty State 1 */}
                <div className="bg-surface-container rounded-3xl border border-outline-variant/30 p-8 text-center flex flex-col justify-between shadow-xl">
                  <div>
                    <div className="flex items-center justify-center mb-6">
                      <span className="px-3.5 py-1 rounded-full bg-surface-container-highest border border-outline-variant/60 font-label-md text-label-md text-on-surface uppercase tracking-widest">
                        STATUS: QUEUE VACANT
                      </span>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-surface-container-highest border border-primary/30 flex items-center justify-center mx-auto mb-6 shadow-inner">
                      <MaterialIcon icon="verified" className="text-primary text-[32px]" />
                    </div>
                    <h3 className="font-headline-md text-headline-md text-primary font-semibold mb-3">
                      All Conflicts Resolved!
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto mb-6">
                      There are currently 0 ambiguous record pairs in the review queue. Master Golden Records are fully reconciled across all enterprise clusters.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                      <span className="px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant/40 font-label-md text-label-md text-on-surface-variant">
                        • Entropy: <span className="text-primary font-semibold">0.000</span>
                      </span>
                      <span className="px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant/40 font-label-md text-label-md text-on-surface-variant">
                        • Reviewers: <span className="text-primary font-semibold">Idle</span>
                      </span>
                      <span className="px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant/40 font-label-md text-label-md text-on-surface-variant">
                        • Golden Consensus: <span className="text-primary font-semibold">100%</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-outline-variant/20">
                    <button className="px-5 py-2.5 rounded-full bg-surface-container-high border border-outline-variant/60 text-on-surface hover:bg-surface-container-highest font-label-md text-label-md uppercase tracking-wider transition-colors flex items-center gap-2">
                      <MaterialIcon icon="autorenew" className="text-[16px]" /> Refresh Review Pipeline
                    </button>
                    <button className="px-6 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider font-semibold hover:bg-primary-container transition-colors shadow-sm flex items-center gap-2">
                      View Golden Master Catalog <MaterialIcon icon="arrow_forward" className="text-[16px]" />
                    </button>
                  </div>
                </div>

                {/* Empty State 2 */}
                <div className="bg-surface-container rounded-3xl border border-outline-variant/30 p-8 text-center flex flex-col justify-between shadow-xl">
                  <div>
                    <div className="flex items-center justify-center mb-6">
                      <span className="px-3.5 py-1 rounded-full bg-surface-container-highest border border-outline-variant/60 font-label-md text-label-md text-on-surface uppercase tracking-widest">
                        REGISTRY STATUS: EMPTY INGEST POOL
                      </span>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-surface-container-highest border border-outline-variant/60 flex items-center justify-center mx-auto mb-6 shadow-inner">
                      <MaterialIcon icon="cloud_upload" className="text-primary text-[30px]" />
                    </div>
                    <h3 className="font-headline-md text-headline-md text-primary font-semibold mb-3">
                      No Data Sources Registered Yet
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto mb-6">
                      Upload a CSV, JSON dataset, or connect an enterprise SIS / Core Banking API endpoint to populate the entity matching candidate pool.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                      <span className="px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant/40 font-label-md text-label-md text-on-surface">CSV (RFC 4180)</span>
                      <span className="px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant/40 font-label-md text-label-md text-on-surface">JSON / NDJSON</span>
                      <span className="px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant/40 font-label-md text-label-md text-on-surface">REST Webhooks</span>
                      <span className="px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant/40 font-label-md text-label-md text-on-surface">Apache Parquet</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-outline-variant/20">
                    <button className="px-6 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider font-semibold hover:bg-primary-container transition-colors shadow-sm flex items-center gap-2">
                      <MaterialIcon icon="bolt" className="text-[16px]" /> Ingest First Dataset
                    </button>
                    <button className="px-5 py-2.5 rounded-full bg-surface-container-high border border-outline-variant/60 text-on-surface hover:bg-surface-container-highest font-label-md text-label-md uppercase tracking-wider transition-colors flex items-center gap-2">
                      <MaterialIcon icon="menu_book" className="text-[16px]" /> Read Ingestion Spec
                    </button>
                  </div>
                </div>
                
              </div>
            </div>
          )}

          {/* SECTION 3: Bento Shimmer Skeleton Loader Component */}
          {(activeTab === 'all' || activeTab === 'skeletons') && (
            <div className="state-section w-full mb-12">
              <div className="flex items-center justify-between mb-6 px-2">
                <div className="flex items-center gap-3">
                  <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Section 03 // Async Hydration Skeletons</span>
                  <span className="h-px w-12 bg-outline-variant"></span>
                </div>
                <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Engine: Reactive Wire</span>
              </div>
              
              <div className="bg-surface-container rounded-3xl border border-outline-variant/30 p-8 shadow-xl">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 mb-8 border-b border-outline-variant/30 gap-4">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-primary font-semibold mb-1">
                      Data Table &amp; Bento Pod Shimmer Loader
                    </h3>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-highest border border-outline-variant/40">
                      {!isHydrated && <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>}
                      <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                        {isHydrated ? 'HYDRATED STATE VERIFIED (0ms delta)' : 'SIMULATING ASYNC HYDRATION (240ms latency)'}
                      </span>
                    </div>
                  </div>
                  <button 
                    className="px-5 py-2 rounded-full bg-surface-container-high border border-outline-variant/60 text-on-surface hover:bg-surface-container-highest font-label-md text-label-md uppercase tracking-wider transition-all flex items-center gap-2"
                    onClick={toggleSkeletonHydration}
                  >
                    <MaterialIcon icon={isHydrated ? 'blur_linear' : 'cached'} className="text-[16px]" />
                    <span>{isHydrated ? 'Switch to Skeleton State' : 'Switch to Loaded State'}</span>
                  </button>
                </div>

                {!isHydrated ? (
                  <div className="flex flex-col gap-6">
                    <div className="skeleton-shimmer w-full h-12 bg-surface-container-low rounded-full border border-outline-variant/30 px-4 flex items-center justify-between">
                      <div className="flex items-center gap-3 w-1/3">
                        <div className="w-5 h-5 rounded-full bg-surface-container-highest"></div>
                        <div className="h-3.5 w-48 bg-surface-container-highest rounded-full"></div>
                      </div>
                      <div className="h-6 w-16 bg-surface-container-highest rounded-md"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="skeleton-shimmer bg-surface-container-low rounded-2xl p-5 border border-outline-variant/20 flex flex-col justify-between h-36">
                          <div className="flex items-center justify-between">
                            <div className={`h-3 ${i === 1 ? 'w-28' : i === 2 ? 'w-32' : 'w-24'} bg-surface-container-highest rounded-full`}></div>
                            <div className="w-6 h-6 rounded-full bg-surface-container-highest"></div>
                          </div>
                          <div>
                            <div className={`h-8 ${i === 1 ? 'w-36' : i === 2 ? 'w-24' : 'w-40'} bg-surface-container-highest rounded-lg mb-2`}></div>
                            <div className={`h-3 ${i === 1 ? 'w-20' : i === 2 ? 'w-28' : 'w-16'} bg-surface-container-highest/60 rounded-full`}></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="w-full overflow-x-auto">
                      <div className="grid grid-cols-6 px-4 py-3 bg-surface-container-lowest/50 rounded-xl mb-3 border border-outline-variant/20">
                        <div className="h-3 w-20 bg-surface-container-highest rounded-full"></div>
                        <div className="h-3 w-24 bg-surface-container-highest rounded-full"></div>
                        <div className="h-3 w-28 bg-surface-container-highest rounded-full"></div>
                        <div className="h-3 w-20 bg-surface-container-highest rounded-full"></div>
                        <div className="h-3 w-20 bg-surface-container-highest rounded-full"></div>
                        <div className="h-3 w-16 bg-surface-container-highest rounded-full ml-auto"></div>
                      </div>
                      
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`skeleton-shimmer bg-surface-container-low/70 rounded-xl p-4 ${i === 4 ? 'mb-1' : 'mb-3'} flex items-center justify-between border border-outline-variant/20`}>
                          <div className="flex items-center gap-3 w-1/5">
                            <div className="w-10 h-10 rounded-full bg-surface-container-highest flex-shrink-0"></div>
                            <div className="flex flex-col gap-1.5">
                              <div className={`h-4 ${i === 1 ? 'w-32' : i === 2 ? 'w-28' : i === 3 ? 'w-36' : 'w-30'} bg-surface-container-highest rounded-full`}></div>
                              <div className={`h-3 ${i === 1 ? 'w-20' : i === 2 ? 'w-24' : i === 3 ? 'w-16' : 'w-20'} bg-surface-container-highest/60 rounded-full`}></div>
                            </div>
                          </div>
                          <div className="w-1/6">
                            <div className="h-6 w-24 bg-surface-container-highest rounded-full"></div>
                          </div>
                          <div className="w-1/4">
                            <div className={`h-4 ${i === 1 ? 'w-40' : i === 2 ? 'w-36' : i === 3 ? 'w-44' : 'w-32'} bg-surface-container-highest rounded-full`}></div>
                          </div>
                          <div className="w-1/6">
                            <div className={`h-6 ${i === 1 ? 'w-16' : i === 2 ? 'w-16' : i === 3 ? 'w-20' : 'w-16'} bg-surface-container-highest rounded-full inline-block mr-1`}></div>
                            {(i === 1 || i === 3) && <div className={`h-6 ${i === 1 ? 'w-12' : 'w-10'} bg-surface-container-highest/60 rounded-full inline-block`}></div>}
                          </div>
                          <div className="w-1/6 flex justify-end">
                            <div className="h-8 w-24 bg-surface-container-highest rounded-full"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    <div className="w-full h-12 bg-surface-container-low rounded-full border border-outline-variant/40 px-5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MaterialIcon icon="search" className="text-primary text-[20px]" />
                        <span className="text-on-surface font-body-md text-body-md">Filtered by: <span className="font-semibold text-primary">entity_cluster: "EU-GOLDEN"</span></span>
                      </div>
                      <span className="font-label-md text-label-md text-on-surface-variant uppercase">4 MATCHES HYDRATED</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/30 flex flex-col justify-between h-36">
                        <div className="flex items-center justify-between">
                          <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Golden Master Nodes</span>
                          <MaterialIcon icon="account_tree" className="text-primary text-[20px]" />
                        </div>
                        <div>
                          <span className="font-display-lg text-[32px] leading-tight text-primary font-bold">14,289</span>
                          <p className="font-label-md text-label-md text-on-surface-variant mt-1">99.98% Confidence Floor</p>
                        </div>
                      </div>
                      <div className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/30 flex flex-col justify-between h-36">
                        <div className="flex items-center justify-between">
                          <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Ambiguous Pairs</span>
                          <MaterialIcon icon="rule" className="text-primary text-[20px]" />
                        </div>
                        <div>
                          <span className="font-display-lg text-[32px] leading-tight text-primary font-bold">0 Active</span>
                          <p className="font-label-md text-label-md text-on-surface-variant mt-1">Review pipeline clear</p>
                        </div>
                      </div>
                      <div className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/30 flex flex-col justify-between h-36">
                        <div className="flex items-center justify-between">
                          <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Mesh Ingestion</span>
                          <MaterialIcon icon="speed" className="text-primary text-[20px]" />
                        </div>
                        <div>
                          <span className="font-display-lg text-[32px] leading-tight text-primary font-bold">1.28 GB/s</span>
                          <p className="font-label-md text-label-md text-on-surface-variant mt-1">Active sync: Postgres Replicas</p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full overflow-x-auto">
                      <div className="grid grid-cols-6 px-4 py-3 bg-surface-container-lowest/70 rounded-xl mb-3 border border-outline-variant/20 font-label-md text-label-md text-on-surface-variant uppercase">
                        <div>Principal Entity</div>
                        <div>Cluster ID</div>
                        <div>Canonical Mail</div>
                        <div>Confidence</div>
                        <div>Status</div>
                        <div className="text-right">Action</div>
                      </div>
                      
                      {[
                        { initials: 'DR', name: 'David R. Vance', ssn: 'SSN-***-9921', id: '#GLD-88219', email: 'd.vance@institutional-mesh.org', conf: '99.8%' },
                        { initials: 'SC', name: 'Siobhan Chen', ssn: 'SSN-***-4108', id: '#GLD-88220', email: 'chen.siobhan@enclave-fin.io', conf: '99.4%' }
                      ].map((row, i) => (
                        <div key={i} className="bg-surface-container-low rounded-xl p-4 mb-3 flex items-center justify-between border border-outline-variant/20">
                          <div className="flex items-center gap-3 w-1/5">
                            <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant/40 flex items-center justify-center font-bold text-primary">{row.initials}</div>
                            <div>
                              <span className="font-body-md text-body-md text-primary font-medium block">{row.name}</span>
                              <span className="font-label-md text-label-md text-on-surface-variant">{row.ssn}</span>
                            </div>
                          </div>
                          <div className="w-1/6">
                            <span className="px-2.5 py-1 rounded bg-surface-container-highest font-label-md text-label-md text-on-surface">{row.id}</span>
                          </div>
                          <div className="w-1/4 font-body-md text-body-md text-on-surface-variant truncate">
                            {row.email}
                          </div>
                          <div className="w-1/6">
                            <span className="px-2.5 py-0.5 rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold">{row.conf}</span>
                          </div>
                          <div className="w-1/6">
                            <span className="px-2.5 py-1 rounded-full bg-surface-container-highest text-on-surface font-label-md text-label-md">RECONCILED</span>
                          </div>
                          <div className="w-1/6 flex justify-end">
                            <button className="px-4 py-1.5 rounded-full bg-primary text-on-primary font-label-md text-label-md uppercase font-semibold">Inspect</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Enterprise System Footnote Capsule */}
          <div className="w-full flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 mt-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span className="font-label-md text-label-md text-on-surface uppercase tracking-wider">• NODE MESH: EU-CENTRAL-1 (99.998%)</span>
              <span className="text-outline-variant">/</span>
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">KERNEL BUILD: V4.18.2-PROD-ENC</span>
              <span className="text-outline-variant">/</span>
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">COMPLIANCE ARCHITECTURE</span>
              <span className="text-outline-variant">/</span>
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">DATA GOVERNANCE &amp; PII</span>
            </div>
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
              © 2025 RECONCILE.AI INC.
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
