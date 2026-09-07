import React, { useState, useRef } from 'react';
import MaterialIcon from '../components/icons/MaterialIcon';

export default function DataIngestion() {
  const [reliabilityScore, setReliabilityScore] = useState(95);
  const [isDragging, setIsDragging] = useState(false);
  
  const [ingestState, setIngestState] = useState<'idle' | 'running' | 'complete'>('complete');
  const [ingestProgress, setIngestProgress] = useState(100);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const getReliabilityLabel = (val: number) => {
    if (val >= 90) return 'Master Authority';
    if (val <= 65) return 'Secondary Support';
    return 'Corroborative Weight';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      alert(`Detected ${e.dataTransfer.files[0].name} (${Math.round(e.dataTransfer.files[0].size / 1024)} KB). Ready to register into candidate matching pool.`);
    }
  };

  const simulateIngest = () => {
    if (ingestState === 'running') return;
    setIngestState('running');
    setIngestProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress <= 100) {
        setIngestProgress(progress);
      } else {
        clearInterval(interval);
        setIngestState('complete');
      }
    }, 180);
  };

  return (
    <div className="flex flex-col w-full relative">
      {/* Subtle Ambient Glow Element */}
      <div className="relative w-full max-w-[1280px] mx-auto px-margin-mobile lg:px-margin-desktop py-8 md:py-12">
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-surface-container-highest/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-48 left-10 w-72 h-72 bg-surface-variant/30 rounded-full blur-2xl pointer-events-none -z-10"></div>

        {/* Screen Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-outline-variant/30">
          <div className="flex flex-col gap-2 max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-highest rounded-full text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                INGESTION ENGINE READY • WORKER POOL 8/8 ONLINE
              </span>
              <span className="hidden sm:inline-block font-label-md text-label-md text-outline tracking-wider uppercase">
                V2.4 POOL
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
              Data Ingestion & Source Registries
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Upload CSV or JSON files to register raw student/customer identities into candidate matching pool.
            </p>
          </div>
          <div className="flex items-center gap-3 self-start md:self-auto">
            <button className="px-5 py-2.5 rounded-full bg-surface-container-high hover:bg-surface-bright text-primary font-label-md text-label-md uppercase tracking-wider transition-all duration-200 flex items-center gap-2 shadow-sm">
              <MaterialIcon icon="sync_alt" className="text-[16px]" />
              <span>+ Connect Webhook / API Source</span>
            </button>
          </div>
        </div>

        {/* Main Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
          
          {/* COLUMN 1: Drag-and-Drop Ingestion Zone (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-surface-container rounded-3xl p-8 flex flex-col shadow-xl">
              <div className="flex items-center justify-between pb-6 border-b border-outline-variant/30">
                <div className="flex items-center gap-2">
                  <MaterialIcon icon="cloud_upload" className="text-primary text-[20px]" />
                  <span className="font-label-md text-label-md uppercase tracking-wider text-primary">Pipeline Portal</span>
                </div>
                <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">STAGE 01: RAW INGEST</span>
              </div>

              {/* Dropzone Container */}
              <div 
                className={`mt-6 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group shadow-inner ${isDragging ? 'bg-surface-container-high' : 'bg-surface-container-low'}`}
                onDragEnter={handleDragOver}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".csv,.json,.gz" 
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      alert(`Selected ${e.target.files[0].name}`);
                    }
                  }}
                />
                <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                  <MaterialIcon icon="file_upload" className="text-primary text-[28px]" />
                </div>
                <h2 className="text-xl font-medium text-primary mb-2">
                  Drag & drop dataset files here
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                  or select from system terminal storage
                </p>
                <button 
                  type="button" 
                  className="rounded-full px-5 py-2.5 bg-primary text-on-primary hover:bg-primary-fixed font-label-md text-label-md uppercase tracking-wider font-semibold shadow-md transition-colors duration-150"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  [ Browse Local Disk ]
                </button>
                <div className="mt-6 rounded-full bg-surface-container px-4 py-1.5 text-on-surface-variant font-label-md text-label-md">
                  CSV • JSON • MAX 500 MB • UTF-8 / COMPRESSED GZ SUPPORTED
                </div>
              </div>

              {/* Metadata Configuration Fields */}
              <div className="mt-8 flex flex-col gap-5">
                {/* Source Identifier */}
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                    Source Identifier & Registry Name
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      className="rounded-full bg-surface-container-low px-6 py-3.5 text-primary placeholder-outline font-body-md text-body-md w-full focus:outline-none focus:bg-surface-container-lowest transition-all" 
                      placeholder="e.g., Core Banking ERP / Campus SIS v2.4" 
                      defaultValue="Enterprise CRM Data Lake v3" 
                    />
                    <MaterialIcon icon="badge" className="absolute right-4 top-3.5 text-outline text-[18px]" />
                  </div>
                </div>

                {/* Reliability Score Slider */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                      Source Authority & Reliability Weight
                    </label>
                    <span className="rounded-full bg-surface-container-highest px-2.5 py-0.5 font-label-md text-label-md text-primary tracking-wider uppercase">
                      {reliabilityScore}% Trust Level • {getReliabilityLabel(reliabilityScore)}
                    </span>
                  </div>
                  <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col gap-3">
                    <input 
                      type="range" 
                      min="50" 
                      max="100" 
                      value={reliabilityScore} 
                      onChange={(e) => setReliabilityScore(parseInt(e.target.value, 10))}
                      className="w-full accent-primary bg-surface-container-highest h-1.5 rounded-lg appearance-none cursor-pointer" 
                    />
                    <div className="flex justify-between font-label-md text-label-md text-on-surface-variant uppercase">
                      <span>50% Low Confidence</span>
                      <span>75% Corroborative</span>
                      <span>100% Deterministic</span>
                    </div>
                  </div>
                </div>

                {/* Field Mapping Preset */}
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                    Field Mapping Preset & Heuristic Schema
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" className="px-4 py-3 rounded-full bg-surface-container-high text-primary font-label-md text-label-md tracking-wider uppercase text-center flex items-center justify-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      <span>Standard Entity</span>
                    </button>
                    <button type="button" className="px-4 py-3 rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-primary font-label-md text-label-md tracking-wider uppercase text-center transition-colors">
                      Custom Schema...
                    </button>
                  </div>
                </div>

                {/* Start Ingestion Action Button */}
                <div className="pt-4">
                  <button 
                    type="button" 
                    className="w-full rounded-full py-4 bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider font-semibold text-center hover:bg-primary-fixed transition-all duration-200 shadow-xl flex items-center justify-center gap-2 group disabled:opacity-80 disabled:cursor-not-allowed"
                    onClick={simulateIngest}
                    disabled={ingestState === 'running'}
                  >
                    {ingestState === 'idle' && (
                      <>
                        <MaterialIcon icon="bolt" className="text-[18px] group-hover:rotate-12 transition-transform" />
                        <span>Start Data Ingestion & Normalization Pipeline</span>
                      </>
                    )}
                    {ingestState === 'running' && (
                      <>
                        <MaterialIcon icon="progress_activity" className="text-[18px] animate-spin" />
                        <span>Ingesting & Clustering Records...</span>
                      </>
                    )}
                    {ingestState === 'complete' && (
                      <>
                        <MaterialIcon icon="done_all" className="text-[18px]" />
                        <span>Pipeline Complete • Rerun Stream</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* System Pipeline Specs Capsule Card */}
            <div className="bg-surface-container-low rounded-3xl p-6 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">Parser Engine State</span>
                <span className="font-label-md text-label-md text-primary tracking-wider">SIMD Vectorized CSV-v3</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Streams files directly to RAM buffers with real-time entropy profiling for rapid deduplication prior to entity graph clustering.
              </p>
            </div>
          </div>

          {/* COLUMN 2: Active Source Registries Grid (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Registries Grid Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="font-headline-md text-headline-md text-primary">
                  Active Source Registries
                </h2>
                <span className="rounded-full bg-surface-container-highest px-3 py-1 font-label-md text-label-md uppercase tracking-wider text-primary">
                  3 Connected Sources
                </span>
              </div>
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Sync Mesh: Nominal</span>
            </div>

            {/* Registry Pod 1: Core Banking System (ERP) */}
            <div className="bg-surface-container rounded-3xl p-6 flex flex-col justify-between shadow-lg hover:bg-surface-container-high/80 transition-all duration-300">
              <div className="flex flex-col gap-4">
                {/* Pod Top Bar */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-surface-container-lowest flex items-center justify-center">
                      <MaterialIcon icon="account_balance" className="text-primary text-[24px]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary tracking-tight">Core Banking System (ERP)</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Source ID: SRC-ERP-901</span>
                        <span className="text-outline">•</span>
                        <span className="font-label-md text-label-md text-on-surface-variant uppercase">Postgres Master</span>
                      </div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest text-primary font-label-md text-label-md uppercase tracking-wider shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                    ACTIVE
                  </span>
                </div>

                {/* Visual Trust Arc & Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col justify-center">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Volume Load</span>
                    <span className="text-xl font-semibold text-primary mt-1">54,290 Records</span>
                    <span className="font-label-md text-label-md text-on-surface-variant mt-0.5">Verified Unique</span>
                  </div>
                  <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col justify-center">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Authority Weight</span>
                    <span className="text-xl font-semibold text-primary mt-1">95% Primary</span>
                    <span className="font-label-md text-label-md text-on-surface-variant mt-0.5">Golden Trust Level</span>
                  </div>
                  
                  {/* Inline Trust Arc Visualization */}
                  <div className="bg-surface-container-low rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Mesh Trust</span>
                      <div className="text-xl font-semibold text-primary mt-0.5">0.950</div>
                      <span className="font-label-md text-label-md text-outline">Deterministic</span>
                    </div>
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-surface-container-highest" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" />
                        <path className="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="95, 100" strokeLinecap="round" strokeWidth="3.5" />
                      </svg>
                      <span className="absolute font-label-md text-label-md text-primary">95%</span>
                    </div>
                  </div>
                </div>

                {/* Detected Schema Fields */}
                <div className="flex flex-col gap-2 pt-1">
                  <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Detected Ingest Schema</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['id', 'full_name', 'email', 'phone_primary', 'ssn_hash', 'permanent_addr'].map(field => (
                      <span key={field} className="rounded-full bg-surface-container-highest px-3 py-1 text-on-surface font-label-md text-label-md">{field}</span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Pod Bottom Action Bar */}
              <div className="flex items-center justify-between pt-5 mt-4 border-t border-outline-variant/30">
                <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
                  <MaterialIcon icon="schedule" className="text-[16px]" />
                  <span>Last updated 4 mins ago</span>
                </div>
                <button className="rounded-full px-4 py-2 bg-surface-container-high hover:bg-surface-bright text-primary font-label-md text-label-md uppercase tracking-wider transition-colors">
                  [ View Raw Records → ]
                </button>
              </div>
            </div>

            {/* Registry Pod 2: Campus Management System (SIS) */}
            <div className="bg-surface-container rounded-3xl p-6 flex flex-col justify-between shadow-lg hover:bg-surface-container-high/80 transition-all duration-300">
              <div className="flex flex-col gap-4">
                {/* Pod Top Bar */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-surface-container-lowest flex items-center justify-center">
                      <MaterialIcon icon="school" className="text-primary text-[24px]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary tracking-tight">Campus Management System (SIS)</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Source ID: SRC-SIS-412</span>
                        <span className="text-outline">•</span>
                        <span className="font-label-md text-label-md text-on-surface-variant uppercase">GraphQL Ingest</span>
                      </div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest text-primary font-label-md text-label-md uppercase tracking-wider shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    ACTIVE
                  </span>
                </div>

                {/* Visual Trust Arc & Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col justify-center">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Volume Load</span>
                    <span className="text-xl font-semibold text-primary mt-1">62,100 Records</span>
                    <span className="font-label-md text-label-md text-on-surface-variant mt-0.5">Active Academic Pool</span>
                  </div>
                  <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col justify-center">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Authority Weight</span>
                    <span className="text-xl font-semibold text-primary mt-1">88% High</span>
                    <span className="font-label-md text-label-md text-on-surface-variant mt-0.5">High Freshness</span>
                  </div>
                  
                  {/* Inline Trust Arc Visualization */}
                  <div className="bg-surface-container-low rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Mesh Trust</span>
                      <div className="text-xl font-semibold text-primary mt-0.5">0.880</div>
                      <span className="font-label-md text-label-md text-outline">High Validity</span>
                    </div>
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-surface-container-highest" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" />
                        <path className="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="88, 100" strokeLinecap="round" strokeWidth="3.5" />
                      </svg>
                      <span className="absolute font-label-md text-label-md text-primary">88%</span>
                    </div>
                  </div>
                </div>

                {/* Detected Schema Fields */}
                <div className="flex flex-col gap-2 pt-1">
                  <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Detected Ingest Schema</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['student_id', 'legal_name', 'campus_email', 'alt_phone', 'hostel_block'].map(field => (
                      <span key={field} className="rounded-full bg-surface-container-highest px-3 py-1 text-on-surface font-label-md text-label-md">{field}</span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Pod Bottom Action Bar */}
              <div className="flex items-center justify-between pt-5 mt-4 border-t border-outline-variant/30">
                <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
                  <MaterialIcon icon="schedule" className="text-[16px]" />
                  <span>Last updated 18 mins ago</span>
                </div>
                <button className="rounded-full px-4 py-2 bg-surface-container-high hover:bg-surface-bright text-primary font-label-md text-label-md uppercase tracking-wider transition-colors">
                  [ View Raw Records → ]
                </button>
              </div>
            </div>

            {/* Registry Pod 3: Alumni Network Portal */}
            <div className="bg-surface-container rounded-3xl p-6 flex flex-col justify-between shadow-lg hover:bg-surface-container-high/80 transition-all duration-300">
              <div className="flex flex-col gap-4">
                {/* Pod Top Bar */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-surface-container-lowest flex items-center justify-center">
                      <MaterialIcon icon="diversity_3" className="text-primary text-[24px]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary tracking-tight">Alumni Network Portal</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Source ID: SRC-ALM-108</span>
                        <span className="text-outline">•</span>
                        <span className="font-label-md text-label-md text-on-surface-variant uppercase">S3 Delta Snapshot</span>
                      </div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest text-primary font-label-md text-label-md uppercase tracking-wider shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    ACTIVE
                  </span>
                </div>

                {/* Visual Trust Arc & Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col justify-center">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Volume Load</span>
                    <span className="text-xl font-semibold text-primary mt-1">26,500 Records</span>
                    <span className="font-label-md text-label-md text-on-surface-variant mt-0.5">Graduated Cohorts</span>
                  </div>
                  <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col justify-center">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Authority Weight</span>
                    <span className="text-xl font-semibold text-primary mt-1">75% Medium</span>
                    <span className="font-label-md text-label-md text-on-surface-variant mt-0.5">Periodic Sync</span>
                  </div>
                  
                  {/* Inline Trust Arc Visualization */}
                  <div className="bg-surface-container-low rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Mesh Trust</span>
                      <div className="text-xl font-semibold text-primary mt-0.5">0.750</div>
                      <span className="font-label-md text-label-md text-outline">Corroborative</span>
                    </div>
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-surface-container-highest" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" />
                        <path className="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="75, 100" strokeLinecap="round" strokeWidth="3.5" />
                      </svg>
                      <span className="absolute font-label-md text-label-md text-primary">75%</span>
                    </div>
                  </div>
                </div>

                {/* Detected Schema Fields */}
                <div className="flex flex-col gap-2 pt-1">
                  <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Detected Ingest Schema</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['member_id', 'alum_name', 'personal_email', 'phone', 'current_employer', 'city'].map(field => (
                      <span className="rounded-full bg-surface-container-highest px-3 py-1 text-on-surface font-label-md text-label-md" key={field}>{field}</span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Pod Bottom Action Bar */}
              <div className="flex items-center justify-between pt-5 mt-4 border-t border-outline-variant/30">
                <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
                  <MaterialIcon icon="schedule" className="text-[16px]" />
                  <span>Last updated 2 hours ago</span>
                </div>
                <button className="rounded-full px-4 py-2 bg-surface-container-high hover:bg-surface-bright text-primary font-label-md text-label-md uppercase tracking-wider transition-colors">
                  [ View Raw Records → ]
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Section: Ingestion Pipeline Telemetry & Normalization Checklist */}
        <div className="mt-8 bg-surface-container rounded-3xl p-6 lg:p-8 flex flex-col gap-6 shadow-xl">
          {/* Top Row: Ingestion Status Indicator */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                {(ingestState === 'running' || ingestState === 'idle') ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></span>
                ) : (
                  <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                )}
                <span className="text-lg font-semibold text-primary">
                  {ingestState === 'idle' && 'Ingestion Engine Ready (0% Complete)'}
                  {ingestState === 'running' && `Ingesting ${Math.floor((ingestProgress / 100) * 12000).toLocaleString()} / 12,000 records (${ingestProgress}% Complete)`}
                  {ingestState === 'complete' && 'Ingesting 12,000 / 12,000 records (100% Complete)'}
                </span>
              </div>
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Batch Ref: #ING-202505-0994 • Target Index: primary-candidate-pool</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Throughput: 8,450 rec/sec</span>
              <span className="hidden sm:inline text-outline">•</span>
              <span className="font-label-md text-label-md text-primary tracking-wider uppercase">Active Thread: #04-Core</span>
            </div>
          </div>

          {/* Glowing Progress Bar Container */}
          <div className="w-full bg-surface-container-lowest h-3 rounded-full overflow-hidden p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-primary-fixed via-primary to-primary rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(255,255,255,0.4)]" 
              style={{ width: `${ingestState === 'complete' ? 100 : ingestProgress}%` }}
            ></div>
          </div>

          {/* Normalization Checklist Badges in Rounded-Full Pills */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            {[
              'Names standardized (UTF-8 NFKC & Capitalized)',
              'Phone numbers cleaned (E.164 International Format)',
              'Addresses geocoded & normalized',
              'Redis cache warmed & indexed'
            ].map((check, idx) => (
              <div key={idx} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high text-primary font-label-md text-label-md">
                <MaterialIcon icon="check_circle" className="text-[16px] text-primary" />
                <span>{check}</span>
              </div>
            ))}
          </div>

          {/* Summary Metrics Bar */}
          <div className="pt-4 border-t border-outline-variant/30 flex flex-wrap items-center justify-between gap-4 font-label-md text-label-md">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span className="text-on-surface-variant uppercase">0 Schema Errors</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-on-surface-variant"></span>
                <span className="text-on-surface-variant uppercase">142 Ambiguous UTF-8 Tokens Sanitized</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span className="text-on-surface-variant uppercase">18.4ms Ingestion Latency</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-outline">
              <MaterialIcon icon="verified" className="text-[16px]" />
              <span className="uppercase tracking-wider">Cryptographic Ingest Checksum Verified</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
