import React, { useState, useEffect, useCallback } from 'react';
import MaterialIcon from '../components/icons/MaterialIcon';
import Toast from '../components/ui/Toast';

const ConflictTriage: React.FC = () => {
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastVariant, setToastVariant] = useState<'success' | 'error' | 'info'>('success');
  const [activeFilter, setActiveFilter] = useState('all');

  const notify = useCallback((message: string, isPrimary: boolean = true) => {
    setToastMessage(message);
    setToastVariant(isPrimary ? 'success' : 'info');
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 2500);
  }, []);

  const handleApprove = useCallback(() => {
    notify('CR-9042: Approved & Merged to Golden Master', true);
  }, [notify]);

  const handleReject = useCallback(() => {
    notify('CR-9042: Marked as Distinct Entities', false);
  }, [notify]);

  const handleOverride = useCallback(() => {
    notify('Field editing mode engaged', false);
  }, [notify]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return;
      if (e.key.toLowerCase() === 'a') {
        handleApprove();
      } else if (e.key.toLowerCase() === 'r') {
        handleReject();
      } else if (e.key.toLowerCase() === 'm') {
        handleOverride();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleApprove, handleReject, handleOverride]);

  return (
    <div className="flex flex-col w-full text-on-surface">
      <div className="max-w-[1280px] mx-auto w-full px-margin-mobile lg:px-margin-desktop py-8 flex flex-col gap-8">
        {/* Editorial Header & Filter Rail */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-md text-label-md tracking-widest uppercase">HITL Arbitrage Mode</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              <span className="font-label-md text-label-md tracking-wider text-on-surface-variant uppercase">Stream Synchronized</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight font-normal">Conflict Review Queue</h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">Review high-entropy record pairs, evaluate AI reasoning, and commit golden master resolutions.</p>
          </div>
          {/* Capsule Filter Rail */}
          <div className="flex flex-wrap items-center gap-3 p-1.5 rounded-full bg-surface-container-low shadow-sm">
            <button 
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-full font-label-md text-label-md uppercase tracking-wider transition-all duration-200 shadow-sm flex items-center gap-2 ${activeFilter === 'all' ? 'bg-primary text-on-primary' : 'bg-transparent hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface'}`}
            >
              <span>All Conflicts</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeFilter === 'all' ? 'bg-on-primary/10 text-on-primary' : 'bg-surface-container-highest text-on-surface'}`}>3,770</span>
            </button>
            <button 
              onClick={() => setActiveFilter('high')}
              className={`px-4 py-2 rounded-full font-label-md text-label-md uppercase tracking-wider transition-all duration-200 flex items-center gap-2 ${activeFilter === 'high' ? 'bg-primary text-on-primary' : 'bg-transparent hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface'}`}
            >
              <span>High Match (80–89%)</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeFilter === 'high' ? 'bg-on-primary/10 text-on-primary font-bold' : 'bg-surface-container-highest text-on-surface'}`}>1,284</span>
            </button>
            <button 
              onClick={() => setActiveFilter('med')}
              className={`px-4 py-2 rounded-full font-label-md text-label-md uppercase tracking-wider transition-all duration-200 flex items-center gap-2 ${activeFilter === 'med' ? 'bg-primary text-on-primary' : 'bg-transparent hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface'}`}
            >
              <span>Medium Match (60–79%)</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeFilter === 'med' ? 'bg-on-primary/10 text-on-primary font-bold' : 'bg-surface-container-highest text-on-surface'}`}>2,486</span>
            </button>
            <div className="h-5 w-px bg-outline-variant/40 mx-1 hidden sm:block"></div>
            <div className="relative flex items-center">
              <MaterialIcon icon="search" className="absolute left-3.5 text-[18px] text-on-surface-variant" />
              <input className="w-48 sm:w-64 pl-10 pr-4 py-1.5 rounded-full bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/60 font-body-md text-[13px] outline-none transition-all duration-200 focus:w-72" placeholder="Search by name or reg no..." type="text"/>
            </div>
          </div>
        </div>

        {/* Main HITL Layout: Active Workspace (8 cols) + Upcoming Queue Sidebar (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Primary Resolution Workspace Card */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-surface-container rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-8 relative overflow-hidden">
              {/* Subtle top decorative ambient radial glow */}
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
              
              {/* Top Pair Context Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 bg-surface-container-lowest/30 -mx-6 sm:-mx-8 px-6 sm:px-8 -mt-6 sm:-mt-8 pt-6 sm:pt-8">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-3">
                    <span className="font-label-md text-label-md tracking-wider uppercase px-3 py-1 bg-surface-container-highest text-primary rounded-full font-bold">Conflict #CR-9042</span>
                    <span className="px-3 py-1 rounded-full bg-surface-container-high text-primary font-label-md text-label-md uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      89% Match Confidence
                    </span>
                  </div>
                  <p className="font-body-md text-[13px] text-on-surface-variant flex items-center gap-2">
                    <span>Generated 12 mins ago</span>
                    <span>•</span>
                    <span>Entropy: <strong className="text-on-surface font-medium">0.182 (Low Dissonance)</strong></span>
                  </p>
                </div>
                {/* Source Origin Pills & Navigation */}
                <div className="flex items-center gap-4">
                  <div className="hidden md:flex items-center gap-2 text-[12px] font-label-md">
                    <span className="px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface-variant">Source A: <strong className="text-on-surface">Alumni (75% Trust)</strong></span>
                    <span className="text-on-surface-variant">vs</span>
                    <span className="px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface-variant">Source B: <strong className="text-on-surface">Campus ERP (88% Trust)</strong></span>
                  </div>
                  <div className="flex items-center bg-surface-container-low rounded-full p-1 shadow-inner">
                    <button className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors" title="Previous Conflict">
                      <MaterialIcon icon="arrow_back" className="text-[18px]" />
                    </button>
                    <span className="px-3 font-label-md text-label-md tracking-widest text-on-surface">1 / 3,770</span>
                    <button className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors" title="Next Conflict">
                      <MaterialIcon icon="arrow_forward" className="text-[18px]" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Side-by-Side Field Matrix Table */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md tracking-widest uppercase text-on-surface-variant">Differential Data Matrix</span>
                  <span className="font-label-md text-[11px] text-on-surface-variant/80 uppercase">Click pill to override Golden selection</span>
                </div>
                <div className="bg-surface-container-lowest rounded-2xl p-4 overflow-x-auto shadow-inner">
                  <table className="w-full text-left text-body-md border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-surface-container-low/60 text-on-surface-variant font-label-md text-[11px] tracking-wider uppercase">
                        <th className="py-3 px-4 rounded-l-xl w-1/4">Entity Attribute</th>
                        <th className="py-3 px-4 w-1/3">Source A • Alumni Portal</th>
                        <th className="py-3 px-4 w-1/3">Source B • Campus ERP</th>
                        <th className="py-3 px-4 rounded-r-xl text-right">Golden Master Preview</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container/60 font-body-md text-[14px]">
                      {/* Row 1: Full Name */}
                      <tr className="hover:bg-surface-container-low/40 transition-colors group">
                        <td className="py-4 px-4 font-medium text-primary">
                          <div className="flex items-center gap-2">
                            <MaterialIcon icon="badge" className="text-[16px] text-on-surface-variant" />
                            <span>Full Name</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <button className="w-full text-left p-2 rounded-xl bg-surface-container-high/60 hover:bg-surface-container-high transition-all text-primary font-medium flex items-center justify-between">
                            <span>Rahul Sharma</span>
                            <MaterialIcon icon="check_circle" className="text-[16px] text-primary" />
                          </button>
                        </td>
                        <td className="py-4 px-4">
                          <div className="p-2 rounded-xl bg-error-container/20 text-error flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span>Rahul</span>
                              <span className="underline decoration-error underline-offset-4 font-bold bg-error/20 px-1 rounded">Sahrma</span>
                            </div>
                            <span className="font-label-md text-[10px] tracking-widest uppercase bg-error/30 px-2 py-0.5 rounded-full text-error">Typo Dissonance</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-container-high font-label-md text-label-md tracking-wider text-primary font-semibold">
                            Rahul Sharma
                          </span>
                        </td>
                      </tr>
                      {/* Row 2: Email Address */}
                      <tr className="hover:bg-surface-container-low/40 transition-colors group">
                        <td className="py-4 px-4 font-medium text-primary">
                          <div className="flex items-center gap-2">
                            <MaterialIcon icon="alternate_email" className="text-[16px] text-on-surface-variant" />
                            <span>Email Address</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <button className="w-full text-left p-2 rounded-xl bg-surface-container-high/60 hover:bg-surface-container-high transition-all text-primary font-mono text-[13px] flex items-center justify-between">
                            <span>rahul.sharma@alumni.org</span>
                            <MaterialIcon icon="check_circle" className="text-[16px] text-primary" />
                          </button>
                        </td>
                        <td className="py-4 px-4">
                          <div className="p-2 rounded-xl bg-surface-container-high text-on-surface font-mono text-[13px] flex items-center justify-between">
                            <span>r.sharma@techcorp.io</span>
                            <span className="font-label-md text-[10px] tracking-widest uppercase bg-surface-container-highest px-2 py-0.5 rounded-full text-on-surface-variant">Corporate Domain</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-container-high font-mono text-[12px] text-primary">
                            rahul.sharma@alumni.org
                          </span>
                        </td>
                      </tr>
                      {/* Row 3: Phone Number */}
                      <tr className="hover:bg-surface-container-low/40 transition-colors group">
                        <td className="py-4 px-4 font-medium text-primary">
                          <div className="flex items-center gap-2">
                            <MaterialIcon icon="call" className="text-[16px] text-on-surface-variant" />
                            <span>Phone Number</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-mono text-[13px] text-on-surface">
                          +91 98765 43210
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-between text-on-surface font-mono text-[13px]">
                            <span>+91 98765 43210</span>
                            <span className="px-2 py-0.5 rounded-full bg-surface-container-highest font-label-md text-[10px] uppercase tracking-wider text-primary">100% Match • E.164</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-container-high font-mono text-[12px] text-primary">
                            +91 98765 43210
                          </span>
                        </td>
                      </tr>
                      {/* Row 4: Registration Number */}
                      <tr className="hover:bg-surface-container-low/40 transition-colors group">
                        <td className="py-4 px-4 font-medium text-primary">
                          <div className="flex items-center gap-2">
                            <MaterialIcon icon="pin" className="text-[16px] text-on-surface-variant" />
                            <span>Registration No</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-mono text-[13px] text-on-surface">
                          2021BTCS042
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-between text-on-surface font-mono text-[13px]">
                            <span>2021BTCS042</span>
                            <span className="px-2 py-0.5 rounded-full bg-surface-container-highest font-label-md text-[10px] uppercase tracking-wider text-primary">100% Match • Verified SIS</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-container-high font-mono text-[12px] text-primary">
                            2021BTCS042
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Custom LLM Reasoning Pod */}
              <div className="bg-surface-container-high rounded-2xl p-6 relative overflow-hidden shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-on-primary">
                      <MaterialIcon icon="auto_awesome" className="text-[16px]" />
                    </div>
                    <span className="font-headline-md text-[18px] text-primary">AI Conflict Arbitrator Explanation</span>
                  </div>
                  <div className="flex items-center gap-2 font-label-md text-label-md tracking-wider text-on-surface-variant">
                    <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest text-primary uppercase">Confidence: 94.2%</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="uppercase">Claude 3.5 Sonnet / Reasoning Engine</span>
                  </div>
                </div>
                <p className="font-body-md text-body-md text-on-surface leading-relaxed mt-1">
                  High-confidence entity match. Phone number (<span className="font-mono text-primary font-semibold">+91 98765 43210</span>) and Registration Number (<span className="font-mono text-primary font-semibold">2021BTCS042</span>) match 100% across both disparate silos. The name variation <span className="line-through text-error decoration-error decoration-1">'Rahul Sahrma'</span> in Source B represents an unequivocal transposition typo for <span className="text-primary font-semibold">'Rahul Sharma'</span> (Edit distance: 1). Recommended Golden Value: <strong className="text-primary">Rahul Sharma</strong>.
                </p>
                {/* Recommended Golden Payload Pill Strip */}
                <div className="mt-5 pt-4 flex flex-col gap-2">
                  <span className="font-label-md text-[11px] tracking-widest uppercase text-on-surface-variant">Staged Golden Record State:</span>
                  <div className="flex flex-wrap gap-2">
                    <div className="px-3.5 py-1.5 rounded-full bg-surface-container-lowest text-[12px] font-mono flex items-center gap-2 shadow-sm">
                      <span className="text-on-surface-variant">golden_name:</span>
                      <span className="text-primary font-bold">Rahul Sharma</span>
                    </div>
                    <div className="px-3.5 py-1.5 rounded-full bg-surface-container-lowest text-[12px] font-mono flex items-center gap-2 shadow-sm">
                      <span className="text-on-surface-variant">golden_email:</span>
                      <span className="text-primary font-bold">rahul.sharma@alumni.org</span>
                    </div>
                    <div className="px-3.5 py-1.5 rounded-full bg-surface-container-lowest text-[12px] font-mono flex items-center gap-2 shadow-sm">
                      <span className="text-on-surface-variant">golden_phone:</span>
                      <span className="text-primary font-bold">+91 98765 43210</span>
                    </div>
                    <div className="px-3.5 py-1.5 rounded-full bg-surface-container-lowest text-[12px] font-mono flex items-center gap-2 shadow-sm">
                      <span className="text-on-surface-variant">golden_reg_no:</span>
                      <span className="text-primary font-bold">2021BTCS042</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Resolution Floating Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-lowest font-label-md text-[11px] text-on-surface-variant tracking-wider uppercase">
                  <MaterialIcon icon="keyboard" className="text-[14px]" />
                  <span>Hotkeys: [A] Approve • [R] Reject • [M] Override • [→] Skip</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
                  <button 
                    onClick={handleReject}
                    className="px-5 py-3 rounded-full bg-surface-container-low hover:bg-error-container hover:text-on-error-container text-on-surface font-label-md text-label-md tracking-wider uppercase transition-all duration-200 flex items-center gap-2"
                  >
                    <MaterialIcon icon="close" className="text-[16px]" />
                    <span>Reject / Distinct</span>
                  </button>
                  <button 
                    onClick={handleOverride}
                    className="px-5 py-3 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-md text-label-md tracking-wider uppercase transition-all duration-200 flex items-center gap-2"
                  >
                    <MaterialIcon icon="edit" className="text-[16px]" />
                    <span>Manual Override</span>
                  </button>
                  <button 
                    onClick={handleApprove}
                    className="px-7 py-3 rounded-full bg-primary text-on-primary hover:bg-primary-fixed font-label-md text-label-md font-bold tracking-wider uppercase transition-all duration-200 shadow-md hover:shadow-primary/20 flex items-center gap-2 transform active:scale-95"
                  >
                    <MaterialIcon icon="done_all" className="text-[18px]" />
                    <span>Approve Golden Merge</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contextual Queue Mini-Sidebar & Ingest Telemetry */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Queue Sidebar Card */}
            <div className="bg-surface-container rounded-3xl p-6 shadow-xl flex flex-col gap-5">
              <div className="flex items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                  <MaterialIcon icon="list_alt" className="text-[20px] text-primary" />
                  <h2 className="font-headline-md text-[20px] text-primary">Pending Queue</h2>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-md text-label-md">3,770 Remaining</span>
              </div>
              <p className="font-body-md text-[13px] text-on-surface-variant -mt-2">Real-time prioritized entropy stack. Low-entropy items are triaged first for deterministic convergence.</p>
              
              {/* Queue Items List */}
              <div className="flex flex-col gap-2.5 mt-1">
                {/* Queue Item Active (Current) */}
                <div className="p-3.5 rounded-2xl bg-surface-container-high shadow-md transition-all flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-[12px]">
                      9042
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-body-md text-[14px] font-semibold text-primary">Rahul Sharma</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                      </div>
                      <span className="font-label-md text-[11px] text-on-surface-variant font-mono">2021BTCS042</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-label-md text-label-md tracking-wider text-primary font-bold">89%</span>
                    <span className="block font-label-md text-[10px] text-on-surface-variant uppercase">Active</span>
                  </div>
                </div>

                {/* Queue Item 2 */}
                <div className="p-3.5 rounded-2xl bg-surface-container-low hover:bg-surface-container-high transition-all flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center font-mono text-[12px]">
                      9043
                    </div>
                    <div className="flex flex-col">
                      <span className="font-body-md text-[14px] font-medium text-on-surface group-hover:text-primary transition-colors">Priya Singh</span>
                      <span className="font-label-md text-[11px] text-on-surface-variant font-mono">2020MECH108</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-label-md text-label-md tracking-wider text-primary font-bold">94%</span>
                    <span className="block font-label-md text-[10px] text-on-surface-variant uppercase">Ready</span>
                  </div>
                </div>

                {/* Queue Item 3 */}
                <div className="p-3.5 rounded-2xl bg-surface-container-low hover:bg-surface-container-high transition-all flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center font-mono text-[12px]">
                      9044
                    </div>
                    <div className="flex flex-col">
                      <span className="font-body-md text-[14px] font-medium text-on-surface group-hover:text-primary transition-colors">Amit Kumar</span>
                      <span className="font-label-md text-[11px] text-on-surface-variant font-mono">2019ELEC004</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-label-md text-label-md tracking-wider text-on-surface font-bold">81%</span>
                    <span className="block font-label-md text-[10px] text-on-surface-variant uppercase">Ready</span>
                  </div>
                </div>

                {/* Queue Item 4 */}
                <div className="p-3.5 rounded-2xl bg-surface-container-low hover:bg-surface-container-high transition-all flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center font-mono text-[12px]">
                      9045
                    </div>
                    <div className="flex flex-col">
                      <span className="font-body-md text-[14px] font-medium text-on-surface group-hover:text-primary transition-colors">Sneha Patel</span>
                      <span className="font-label-md text-[11px] text-on-surface-variant font-mono">2022CIVL055</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-label-md text-label-md tracking-wider text-on-surface-variant font-bold">67%</span>
                    <span className="block font-label-md text-[10px] text-on-surface-variant uppercase">Review</span>
                  </div>
                </div>
              </div>
              
              {/* Queue Action Footer */}
              <div className="pt-2">
                <button className="w-full py-2.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md tracking-widest uppercase transition-colors flex items-center justify-center gap-2">
                  <span>View All 3,770 Records</span>
                  <MaterialIcon icon="trending_flat" className="text-[16px]" />
                </button>
              </div>
            </div>

            {/* System Entity Graph Overview Card */}
            <div className="bg-surface-container rounded-3xl p-6 shadow-xl flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md tracking-widest uppercase text-on-surface-variant">Triage Velocity</span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-high font-label-md text-[11px] text-primary">Session: 42 Decisions</span>
              </div>
              {/* Inline SVG Mini Velocity Sparkline */}
              <div className="h-20 w-full flex items-end justify-between gap-1 pt-4 px-1">
                <div className="w-full bg-surface-container-high rounded-t h-[40%]"></div>
                <div className="w-full bg-surface-container-high rounded-t h-[65%]"></div>
                <div className="w-full bg-surface-container-high rounded-t h-[55%]"></div>
                <div className="w-full bg-surface-container-high rounded-t h-[80%]"></div>
                <div className="w-full bg-surface-container-high rounded-t h-[45%]"></div>
                <div className="w-full bg-surface-container-high rounded-t h-[90%]"></div>
                <div className="w-full bg-primary rounded-t h-[100%]"></div>
              </div>
              <div className="flex items-center justify-between text-[12px] font-label-md text-on-surface-variant pt-1">
                <span>Avg HITL Decision Latency</span>
                <strong className="text-primary font-mono font-bold">4.2s / Record</strong>
              </div>
            </div>

            {/* Operator Badge & Audit Seal */}
            <div className="p-5 rounded-3xl bg-surface-container-lowest flex items-center gap-4 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary shrink-0">
                <MaterialIcon icon="verified_user" className="text-[20px]" />
              </div>
              <div className="flex flex-col">
                <span className="font-label-md text-[11px] tracking-wider uppercase text-on-surface-variant">Compliance &amp; Audit Seal</span>
                <span className="font-body-md text-[13px] text-on-surface font-medium">All merge actions signed with SHA-256 ledger proof.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {toastVisible && (
        <Toast 
          message={toastMessage}
          variant={toastVariant}
          onClose={() => setToastVisible(false)}
        />
      )}
    </div>
  );
};

export default ConflictTriage;
