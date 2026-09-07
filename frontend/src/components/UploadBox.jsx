import React, { useState, useRef } from 'react';

/**
 * UploadBox component
 * Drag-and-drop file dropzone for CSV and JSON datasets
 * Features:
 * - Drag over visual indicators
 * - Client-side format validation (.csv, .json)
 * - Animated progress bar with record count simulation
 * - File summary & parsing preview
 */
export default function UploadBox({ onUploadSuccess, disabled = false }) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [previewStats, setPreviewStats] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateAndProcess = (selectedFile) => {
    setError(null);
    if (!selectedFile) return;

    const validExtensions = ['.csv', '.json'];
    const fileName = selectedFile.name.toLowerCase();
    const isValid = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValid) {
      setError('Invalid file format. Please upload a structured .CSV or .JSON dataset.');
      return;
    }

    setFile(selectedFile);
    startUploadSimulation(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const droppedFile = e.dataTransfer?.files?.[0];
    validateAndProcess(droppedFile);
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    validateAndProcess(selectedFile);
  };

  const startUploadSimulation = (fileObj) => {
    setIsUploading(true);
    setUploadProgress(10);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          const estimatedRecords = Math.floor((fileObj.size / 1024) * 8.5) || 14200;
          const stats = {
            fileName: fileObj.name,
            fileSize: (fileObj.size / (1024 * 1024)).toFixed(2) + ' MB',
            recordCount: estimatedRecords,
            detectedColumns: ['tax_id', 'full_name', 'phone', 'dob', 'address', 'timestamp'],
            ingestionTime: new Date().toLocaleTimeString(),
          };
          setPreviewStats(stats);
          if (onUploadSuccess) onUploadSuccess(stats);
          return 100;
        }
        return prev + 15;
      });
    }, 180);
  };

  const resetUpload = () => {
    setFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setError(null);
    setPreviewStats(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full space-y-4">
      {/* Dropzone Container */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !file && !isUploading && fileInputRef.current?.click()}
        className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-white bg-[#201f1f]/80 scale-[1.008]'
            : 'border-[#444748]/50 bg-[#1c1b1b]/60 hover:border-[#8e9192] hover:bg-[#201f1f]/40'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.json"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || isUploading}
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          {/* Central Icon */}
          <div className="w-14 h-14 rounded-2xl bg-[#2a2a2a] border border-[#444748]/60 flex items-center justify-center text-[#e5e2e1]">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.75"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          <div>
            <p className="font-medium text-white text-base">
              {file ? file.name : 'Drop raw identity datasets here, or browse local files'}
            </p>
            <p className="text-xs text-[#8e9192] mt-1">
              Supports delimited <span className="text-[#e5e2e1] font-mono">.CSV</span> or normalized <span className="text-[#e5e2e1] font-mono">.JSON</span> (Max 2.5 GB / batch)
            </p>
          </div>

          {!file && (
            <button
              type="button"
              className="mt-2 px-4 py-1.5 rounded-lg bg-[#2a2a2a] hover:bg-[#353534] border border-[#444748] text-xs font-mono text-[#e5e2e1] transition"
            >
              SELECT FILE SYSTEM
            </button>
          )}
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-3 rounded-lg bg-[#93000a]/20 border border-[#ffb4ab]/40 text-[#ffb4ab] text-xs flex items-center justify-between">
          <span className="font-mono">ERROR: {error}</span>
          <button onClick={() => setError(null)} className="hover:text-white font-bold">✕</button>
        </div>
      )}

      {/* Uploading Progress Bar */}
      {isUploading && (
        <div className="p-4 rounded-xl bg-[#1c1b1b] border border-[#444748]/50 space-y-2">
          <div className="flex justify-between text-xs font-mono text-[#c4c7c8]">
            <span>Ingesting & Parsing Records...</span>
            <span className="text-white font-semibold">{uploadProgress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#2a2a2a] overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Parse Preview Stats */}
      {previewStats && !isUploading && (
        <div className="p-4 rounded-xl bg-[#1c1b1b] border border-[#444748]/60 space-y-3">
          <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
              <span className="text-xs font-mono text-[#22c55e] font-semibold uppercase tracking-wider">
                READY FOR DEDUPLICATION STAGE
              </span>
            </div>
            <button
              onClick={resetUpload}
              className="text-xs font-mono text-[#8e9192] hover:text-[#ffb4ab] transition"
            >
              Clear & Upload Another
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-[#131313] p-2.5 rounded-lg border border-[#2a2a2a]">
              <span className="text-[#8e9192] block text-[10px] uppercase font-mono">File Size</span>
              <span className="font-mono text-white font-semibold">{previewStats.fileSize}</span>
            </div>
            <div className="bg-[#131313] p-2.5 rounded-lg border border-[#2a2a2a]">
              <span className="text-[#8e9192] block text-[10px] uppercase font-mono">Records Parsed</span>
              <span className="font-mono text-white font-semibold">{previewStats.recordCount.toLocaleString()}</span>
            </div>
            <div className="bg-[#131313] p-2.5 rounded-lg border border-[#2a2a2a]">
              <span className="text-[#8e9192] block text-[10px] uppercase font-mono">Detected Schema</span>
              <span className="font-mono text-[#e5e2e1]">{previewStats.detectedColumns.length} fields</span>
            </div>
            <div className="bg-[#131313] p-2.5 rounded-lg border border-[#2a2a2a]">
              <span className="text-[#8e9192] block text-[10px] uppercase font-mono">Timestamp</span>
              <span className="font-mono text-[#c4c7c8]">{previewStats.ingestionTime}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
