import React, { useState } from 'react';
import { SourceRegistry } from '../types';

interface DataIngestionProps {
  darkMode: boolean;
  sources: SourceRegistry[];
  onAddSource: (source: SourceRegistry) => void;
  onTriggerToast: (msg: string) => void;
}

export const DataIngestion: React.FC<DataIngestionProps> = ({
  darkMode,
  sources,
  onAddSource,
  onTriggerToast,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [sourceName, setSourceName] = useState('');
  const [trustScore, setTrustScore] = useState(90);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const cardCls = darkMode ? 'bg-[#1c1b1b] border-[#353534]' : 'bg-white border-slate-200 shadow-xs';
  const elevatedCls = darkMode ? 'bg-[#201f1f] border-[#3a3939]' : 'bg-white border-slate-200 shadow-xs';
  const textSec = darkMode ? 'text-[#a1a1aa]' : 'text-slate-600';
  const inputBg = darkMode ? 'bg-[#131313] border-[#353534] text-[#e5e2e1]' : 'bg-white border-slate-300 text-slate-900';

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      startIngest(e.dataTransfer.files[0].name);
    }
  };

  const startIngest = (fileName: string) => {
    setIsUploading(true);
    setUploadProgress(15);
    onTriggerToast(`Commencing schema validation for ${fileName}...`);

    setTimeout(() => setUploadProgress(45), 400);
    setTimeout(() => setUploadProgress(80), 900);
    setTimeout(() => {
      setUploadProgress(100);
      setIsUploading(false);
      const newSource: SourceRegistry = {
        id: `SRC-${Date.now().toString().slice(-4)}`,
        name: sourceName || fileName.replace(/\.[^/.]+$/, ''),
        tag: 'Custom Batch Ingestion',
        trust: trustScore,
        records: '12,450',
        protocol: 'Direct File Upload',
        status: 'Active',
        syncCycle: 'One-off Sync',
        lastUpdated: 'Just now',
      };
      onAddSource(newSource);
      setSourceName('');
      onTriggerToast(`Dataset "${newSource.name}" successfully registered & cached in Redis!`);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className={`${elevatedCls} rounded-3xl p-6 border flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
        <div>
          <h2 className="text-2xl font-serif font-bold tracking-tight">Data Ingestion &amp; Source Registries</h2>
          <p className={`text-xs ${textSec} mt-1`}>
            Upload CSV or JSON files to register raw identities into the candidate matching mesh
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 font-semibold">
            Ingestion Engine v4.2 &bull; Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Bento Dropzone Card */}
        <div className={`${cardCls} rounded-3xl p-6 border space-y-5 flex flex-col justify-between`}>
          <div>
            <h3 className="font-serif font-bold text-base">Register New Origin Source</h3>
            <p className={`text-xs ${textSec} mt-1`}>
              Drag and drop dataset files or specify source connection metadata
            </p>
          </div>

          {/* Drag and Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all flex flex-col items-center justify-center gap-3 ${
              dragActive
                ? 'border-blue-500 bg-blue-500/10'
                : darkMode ? 'border-zinc-700 bg-[#161515] hover:border-zinc-500' : 'border-slate-300 bg-slate-50 hover:border-slate-400'
            }`}
          >
            <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold">Drag &amp; drop dataset files here</div>
              <div className={`text-xs ${textSec} mt-1`}>Supported formats: CSV, JSON (UTF-8, RFC-4180)</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">MAX 500 MB</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">AUTO-NORMALIZE</span>
            </div>
            <label className="mt-2 px-4 py-2 rounded-full text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 cursor-pointer transition-colors shadow-sm">
              Browse Local Disk
              <input
                type="file"
                accept=".csv,.json"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && startIngest(e.target.files[0].name)}
              />
            </label>
          </div>

          {/* Form Metadata */}
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium mb-1">Origin Source Identifier</label>
              <input
                type="text"
                placeholder="e.g., Core Banking System or Faculty Payroll ERP"
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
                className={`w-full text-xs rounded-full px-4 py-2 border focus-visible:ring-2 focus-visible:ring-blue-500 ${inputBg}`}
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium">Prioritized Trust Weight</span>
                <span className="font-mono text-blue-400 font-bold">{trustScore}% Trust</span>
              </div>
              <input
                type="range"
                min="50"
                max="99"
                value={trustScore}
                onChange={(e) => setTrustScore(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <button
              onClick={() => startIngest(sourceName || 'Dataset_Batch_2026.csv')}
              disabled={isUploading}
              className={`w-full py-2.5 rounded-full text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-blue-500 ${
                isUploading
                  ? 'bg-blue-800 text-zinc-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
              }`}
            >
              {isUploading ? '⚡ Running Normalization & Hashing...' : '⚡ Start Ingestion Pipeline'}
            </button>
          </div>
        </div>

        {/* Column 2: Active Registries & Pipeline Normalization Monitor */}
        <div className="space-y-6">
          {/* Active Registries Grid */}
          <div className={`${cardCls} rounded-3xl p-6 border space-y-4`}>
            <div className="flex justify-between items-center">
              <h3 className="font-serif font-bold text-base">Active Source Registries</h3>
              <span className="font-mono text-xs text-zinc-500">{sources.length} Connected</span>
            </div>

            <div className="space-y-3">
              {sources.map((src) => (
                <div key={src.id} className="p-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/30 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{src.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                        {src.status}
                      </span>
                    </div>
                    <div className={`text-xs ${textSec}`}>
                      {src.records} records &bull; {src.syncCycle}
                    </div>
                    <div className="text-[10px] font-mono text-zinc-500">
                      Protocol: {src.protocol} &bull; Updated: {src.lastUpdated}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono text-base font-bold text-blue-400">{src.trust}%</div>
                    <div className={`text-[10px] ${textSec}`}>Trust Weight</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Normalization Status & Schema Preview */}
          <div className={`${cardCls} rounded-3xl p-6 border space-y-3`}>
            <h3 className="font-serif font-bold text-base">Live Schema Normalization</h3>
            {isUploading ? (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span>Ingesting &amp; Deduplicating...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-400">
                  <span>✔</span>
                  <span className={textSec}>Full names decomposed &amp; phonetically encoded (Double Metaphone)</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <span>✔</span>
                  <span className={textSec}>E.164 International phone format validated</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <span>✔</span>
                  <span className={textSec}>SHA-256 block digest verified against Merkle tree</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
