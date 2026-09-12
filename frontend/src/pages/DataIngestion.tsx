import React, { useState, useRef, useEffect } from 'react';
import MaterialIcon from '../components/icons/MaterialIcon';
import Toast from '../components/ui/Toast';
import { type SourceReliability } from '../data/mockData';
import { API_BASE } from '../services/api';
import { Page } from '../components/layout/Header';

interface DataIngestionProps {
  onNavigate?: (page: Page) => void;
}

export default function DataIngestion({ onNavigate }: DataIngestionProps) {
  const [sources, setSources] = useState<SourceReliability[]>([]);
  const [sourceName, setSourceName] = useState('');
  const [trustScore, setTrustScore] = useState(85);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const response = await fetch(`${API_BASE}/sources`);
        if (response.ok) {
          const data = await response.json();
          // Map DB sources to SourceReliability type
          const mappedSources = data.sources.map((src: any) => ({
            id: src.id,
            name: src.source_name,
            trust: src.reliability_score * 100, // DB stores as 0.85 -> UI expects 85
            recordCount: 0, // We can enhance backend to return count later
            format: 'CSV',
            status: 'Connected',
            lastSync: new Date(src.created_at).toLocaleDateString(),
            description: src.description || `Registered source with ${src.reliability_score * 100}% reliability.`
          }));
          setSources(mappedSources);
        }
      } catch (err) {
        console.error('Failed to fetch sources', err);
      }
    };
    fetchSources();
  }, []);

  const getTrustLabel = (val: number) => {
    if (val >= 90) return 'Primary Golden Authority (High)';
    if (val >= 75) return 'Corroborative System (Medium)';
    return 'Supporting / Unverified (Low)';
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!sourceName) {
        setSourceName(file.name.replace(/\.[^/.]+$/, '').toUpperCase());
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      if (!sourceName) {
        setSourceName(file.name.replace(/\.[^/.]+$/, '').toUpperCase());
      }
    }
  };

  const handleRegisterSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceName.trim()) {
      setToastMessage('Please enter a name for this source dataset.');
      return;
    }
    if (!selectedFile) {
      setToastMessage('Please select a CSV file.');
      return;
    }

    setIsProcessing(true);
    setProcessProgress(0);
    setProcessingStage('Uploading and ingesting records...');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('source_name', sourceName);
      formData.append('reliability_score', (trustScore / 100).toString());

      const response = await fetch(`${API_BASE}/upload/file`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const result = await response.json();
      setToastMessage(`Success! Ingested ${result.records_ingested} records. Flagged ${result.conflicts_flagged} conflicts.`);

      // Optimistically add to UI list (or fetch from backend instead)
      const newSource: SourceReliability = {
        id: `SRC-${result.source_id}`,
        name: sourceName,
        trust: trustScore,
        recordCount: result.records_ingested,
        format: 'CSV',
        status: 'Connected',
        lastSync: 'Just now',
        description: `Newly registered source with ${trustScore}% reliability weighting.`
      };
      setSources([newSource, ...sources]);
      setSourceName('');
      setSelectedFile(null);
    } catch (err: any) {
      console.error(err);
      setToastMessage(`Upload failed: ${err.message}`);
    } finally {
      setIsProcessing(false);
      setProcessProgress(100);
      setProcessingStage('');
    }
  };

  const handleRunReconciliation = () => {
    // If there is an explicit trigger needed, we can do it here.
    // For now, it runs automatically on upload.
    setToastMessage('Reconciliation runs automatically during ingestion.');
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#201f1f]">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight font-['Libre_Caslon_Text']">
            Ingest & Datasets
          </h1>
          <p className="text-sm text-[#8e9192] mt-1 max-w-xl">
            Upload CSV source datasets and assign institutional reliability weights to guide conflict resolution.
          </p>
        </div>

        <button
          onClick={handleRunReconciliation}
          disabled={isProcessing}
          className="px-5 py-2.5 rounded-lg bg-white hover:bg-[#e2e2e2] disabled:opacity-50 text-[#131313] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-sm"
        >
          <MaterialIcon name={isProcessing ? 'sync' : 'play_arrow'} size={18} className={isProcessing ? 'animate-spin' : ''} />
          <span>{isProcessing ? 'Reconciling...' : 'Run Pipeline'}</span>
        </button>
      </div>

      {/* Live Pipeline Processing Banner */}
      {isProcessing && (
        <div className="p-5 rounded-2xl bg-[#1c1b1b] border border-amber-500/40 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-white font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              <span>Running Reconciliation Engine</span>
            </div>
            <span className="font-mono text-amber-400">{processProgress}%</span>
          </div>

          <div className="w-full h-2 bg-[#131313] rounded-full overflow-hidden border border-[#2a2a2a]">
            <div
              className="h-full bg-white transition-all duration-300 rounded-full"
              style={{ width: `${processProgress}%` }}
            />
          </div>

          <p className="text-xs text-[#8e9192] font-mono">{processingStage}</p>
        </div>
      )}

      {/* Two Column Layout: Ingestion Form + Connected Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left (5 Cols): Drag & Drop Upload & Config Form */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <form
            onSubmit={handleRegisterSource}
            className="p-6 rounded-2xl bg-[#1c1b1b] border border-[#2a2a2a] flex flex-col gap-5"
          >
            <div>
              <h2 className="text-base font-semibold text-white font-['Libre_Caslon_Text']">
                Register New Source Dataset
              </h2>
              <p className="text-xs text-[#8e9192] mt-0.5">
                Upload a structured CSV containing candidate entity records.
              </p>
            </div>

            {/* Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-white bg-[#2a2a2a]'
                  : selectedFile
                  ? 'border-emerald-500/50 bg-[#131313]'
                  : 'border-[#2a2a2a] hover:border-[#444748] bg-[#131313]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileSelect}
              />
              <div className="w-10 h-10 rounded-full bg-[#201f1f] flex items-center justify-center text-white mb-2">
                <MaterialIcon name={selectedFile ? 'task_alt' : 'cloud_upload'} size={20} />
              </div>
              {selectedFile ? (
                <div>
                  <span className="text-xs font-semibold text-white block">
                    {selectedFile.name}
                  </span>
                  <span className="text-[11px] text-[#8e9192]">
                    {(selectedFile.size / 1024).toFixed(1)} KB • Ready to Ingest
                  </span>
                </div>
              ) : (
                <div>
                  <span className="text-xs font-medium text-white block">
                    Drop CSV file here, or click to browse
                  </span>
                  <span className="text-[11px] text-[#8e9192]">
                    Supports standard headers: name, email, phone, dept
                  </span>
                </div>
              )}
            </div>

            {/* Source Name Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-white">Source System Name</label>
              <input
                type="text"
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
                placeholder="e.g., Campus Placement System 2026"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#131313] border border-[#2a2a2a] text-xs text-white placeholder-[#8e9192] focus:outline-none focus:border-white transition-colors"
              />
            </div>

            {/* Trust Reliability Slider */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-white">Institutional Reliability Weight</label>
                <span className="font-mono text-xs font-bold text-white bg-[#201f1f] px-2 py-0.5 rounded border border-[#2a2a2a]">
                  {trustScore}%
                </span>
              </div>
              <input
                type="range"
                min={50}
                max={100}
                step={1}
                value={trustScore}
                onChange={(e) => setTrustScore(Number(e.target.value))}
                className="w-full accent-white cursor-pointer"
              />
              <span className="text-[11px] text-[#8e9192]">
                Level: <strong className="text-[#c4c7c8]">{getTrustLabel(trustScore)}</strong>
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-white hover:bg-[#e2e2e2] text-[#131313] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm mt-1"
            >
              Add Dataset to Pool
            </button>
          </form>
        </div>

        {/* Right (7 Cols): Registered Data Sources Table */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white font-['Libre_Caslon_Text']">
                Active Source Registry ({sources.length})
              </h2>
              <p className="text-xs text-[#8e9192]">
                Datasets currently feeding the entity deduplication graph.
              </p>
            </div>
            <button
              onClick={() => onNavigate?.('conflict-triage')}
              className="text-xs text-white hover:underline flex items-center gap-1 font-medium"
            >
              <span>Go to Triage</span>
              <MaterialIcon name="arrow_forward" size={14} />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {sources.map((src) => (
              <div
                key={src.id}
                className="p-5 rounded-2xl bg-[#1c1b1b] border border-[#2a2a2a] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#131313] border border-[#2a2a2a] flex items-center justify-center text-white shrink-0">
                    <MaterialIcon name="table_chart" size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{src.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-[#2a2a2a] text-[#c4c7c8]">
                        {src.format}
                      </span>
                    </div>
                    <p className="text-xs text-[#8e9192] mt-0.5">{src.description}</p>
                    <div className="flex items-center gap-3 text-[11px] text-[#8e9192] mt-2">
                      <span>Records: <strong className="text-white">{src.recordCount.toLocaleString()}</strong></span>
                      <span>•</span>
                      <span>Last sync: {src.lastSync}</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#201f1f]">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {src.trust}% Trust Weight
                  </span>
                  <span className="text-[11px] text-[#8e9192] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    {src.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
