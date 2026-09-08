import React, { useState } from 'react';
import Toast from '../components/ui/Toast';
import LiquidGlassSlider from '../components/ui/LiquidGlassSlider';

export default function SystemSettings() {
  const [autoResolveThreshold, setAutoResolveThreshold] = useState(90);
  const [humanReviewThreshold, setHumanReviewThreshold] = useState(75);
  const [phoneWeight, setPhoneWeight] = useState(30);
  const [emailWeight, setEmailWeight] = useState(30);
  const [nameWeight, setNameWeight] = useState(25);
  const [deptWeight, setDeptWeight] = useState(15);
  const [nonDestructive, setNonDestructive] = useState(true);
  const [maskPii, setMaskPii] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage('Reconciliation configuration saved and applied to active engine.');
  };

  return (
    <div className="flex flex-col gap-8 pb-12 max-w-4xl">
      <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#201f1f]">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight font-['Libre_Caslon_Text']">
            System Settings
          </h1>
          <p className="text-sm text-[#8e9192] mt-1">
            Configure matching algorithms, confidence thresholds, and signal weighting.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-lg bg-white hover:bg-[#e2e2e2] text-[#131313] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
        >
          Save Configuration
        </button>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* 1. Confidence Thresholds */}
        <div className="p-6 rounded-2xl bg-[#1c1b1b] border border-[#2a2a2a] flex flex-col gap-5">
          <div>
            <h2 className="text-base font-semibold text-white font-['Libre_Caslon_Text']">
              Reconciliation Confidence Thresholds
            </h2>
            <p className="text-xs text-[#8e9192] mt-0.5">
              Determines when candidate records are automatically reconciled versus routed to human review.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs">
                <label className="text-white font-medium">Auto-Resolve Threshold</label>
                <span className="font-mono text-emerald-400 font-bold">{Math.round(autoResolveThreshold)}%</span>
              </div>
              <LiquidGlassSlider
                min={80}
                max={99}
                value={autoResolveThreshold}
                onChange={setAutoResolveThreshold}
              />
              <span className="text-[11px] text-[#8e9192]">
                Matches above <strong className="text-white">{Math.round(autoResolveThreshold)}%</strong> are automatically sealed.
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs">
                <label className="text-white font-medium">Human Review Floor</label>
                <span className="font-mono text-amber-400 font-bold">{Math.round(humanReviewThreshold)}%</span>
              </div>
              <LiquidGlassSlider
                min={60}
                max={85}
                value={humanReviewThreshold}
                onChange={setHumanReviewThreshold}
                glowColor="#f59e0b"
              />
              <span className="text-[11px] text-[#8e9192]">
                Matches between <strong className="text-white">{Math.round(humanReviewThreshold)}%</strong> and <strong className="text-white">{Math.round(autoResolveThreshold)}%</strong> enter the Triage Queue.
              </span>
            </div>
          </div>
        </div>

        {/* 2. Signal Matching Weights */}
        <div className="p-6 rounded-2xl bg-[#1c1b1b] border border-[#2a2a2a] flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white font-['Libre_Caslon_Text']">
                Attribute Signal Weights
              </h2>
              <p className="text-xs text-[#8e9192] mt-0.5">
                Relative contribution of each field to the overall entity match score. Must sum to 100%.
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-white bg-[#131313] px-2.5 py-1 rounded border border-[#2a2a2a]">
              Total: {Math.round(phoneWeight + emailWeight + nameWeight + deptWeight)}%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#131313] border border-[#2a2a2a] flex flex-col gap-2">
              <div className="flex justify-between text-xs">
                <span className="text-white font-semibold">Phone Match (Normalized)</span>
                <span className="font-mono text-white font-bold">{Math.round(phoneWeight)}%</span>
              </div>
              <LiquidGlassSlider
                min={10}
                max={50}
                value={phoneWeight}
                onChange={setPhoneWeight}
              />
              <span className="text-[10px] text-[#8e9192]">E.164 standardization + exact digit match</span>
            </div>

            <div className="p-4 rounded-xl bg-[#131313] border border-[#2a2a2a] flex flex-col gap-2">
              <div className="flex justify-between text-xs">
                <span className="text-white font-semibold">Email Match (Domain Aware)</span>
                <span className="font-mono text-white font-bold">{Math.round(emailWeight)}%</span>
              </div>
              <LiquidGlassSlider
                min={10}
                max={50}
                value={emailWeight}
                onChange={setEmailWeight}
              />
              <span className="text-[10px] text-[#8e9192]">Normalized lowercase + alias resolution</span>
            </div>

            <div className="p-4 rounded-xl bg-[#131313] border border-[#2a2a2a] flex flex-col gap-2">
              <div className="flex justify-between text-xs">
                <span className="text-white font-semibold">Name Similarity (Jaro-Winkler)</span>
                <span className="font-mono text-white font-bold">{Math.round(nameWeight)}%</span>
              </div>
              <LiquidGlassSlider
                min={10}
                max={40}
                value={nameWeight}
                onChange={setNameWeight}
              />
              <span className="text-[10px] text-[#8e9192]">Tolerates typos, abbreviations, and maiden names</span>
            </div>

            <div className="p-4 rounded-xl bg-[#131313] border border-[#2a2a2a] flex flex-col gap-2">
              <div className="flex justify-between text-xs">
                <span className="text-white font-semibold">Department / Metadata</span>
                <span className="font-mono text-white font-bold">{Math.round(deptWeight)}%</span>
              </div>
              <LiquidGlassSlider
                min={5}
                max={30}
                value={deptWeight}
                onChange={setDeptWeight}
              />
              <span className="text-[10px] text-[#8e9192]">Categorical department / organizational unit alignment</span>
            </div>
          </div>
        </div>

        {/* 3. Core Principles / Governance */}
        <div className="p-6 rounded-2xl bg-[#1c1b1b] border border-[#2a2a2a] flex flex-col gap-4">
          <h2 className="text-base font-semibold text-white font-['Libre_Caslon_Text']">
            Reconciliation Policies
          </h2>

          <div className="flex flex-col gap-3">
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#131313] border border-[#2a2a2a] cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-white block">
                  Non-Destructive Reconciliation Mode
                </span>
                <span className="text-[11px] text-[#8e9192]">
                  Keep original raw source records intact and immutable in the database.
                </span>
              </div>
              <input
                type="checkbox"
                checked={nonDestructive}
                onChange={(e) => setNonDestructive(e.target.checked)}
                className="w-4 h-4 accent-white rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#131313] border border-[#2a2a2a] cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-white block">
                  Operator PII Masking
                </span>
                <span className="text-[11px] text-[#8e9192]">
                  Mask sensitive contact digits in non-production triage views.
                </span>
              </div>
              <input
                type="checkbox"
                checked={maskPii}
                onChange={(e) => setMaskPii(e.target.checked)}
                className="w-4 h-4 accent-white rounded"
              />
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}
