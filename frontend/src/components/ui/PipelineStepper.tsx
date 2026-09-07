import React from 'react';
import MaterialIcon from '../icons/MaterialIcon';
import type { PipelineStage } from '../../data/mockData';

interface PipelineStepperProps {
  stages: PipelineStage[];
}

export default function PipelineStepper({ stages }: PipelineStepperProps) {
  const statusClasses = (status: string) => {
    switch (status) {
      case 'DONE': return 'bg-surface-container-highest text-primary';
      case 'REVIEW': return 'bg-surface-container-high text-primary';
      case 'ACTIVE': return 'bg-primary text-on-primary font-bold';
      default: return 'bg-surface-container-highest text-on-surface-variant';
    }
  };

  return (
    <section className="bg-surface-container-low rounded-3xl p-5 md:px-8 md:py-6 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      {stages.map((stage, i) => (
        <React.Fragment key={stage.stage}>
          <div className="flex items-center gap-4 flex-1">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-['Geist'] text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Stage {stage.stage}</span>
                <span className={`px-2 py-0.5 rounded-full font-['Geist'] text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1 ${statusClasses(stage.status)}`}>
                  {stage.status === 'REVIEW' && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                  {stage.status}
                </span>
              </div>
              <span className="font-['Geist'] text-base font-semibold text-primary">
                {stage.stage} {stage.label} {stage.count}
              </span>
            </div>
          </div>
          {i < stages.length - 1 && (
            <div className="hidden md:flex items-center justify-center text-on-surface-variant/40">
              <MaterialIcon name="arrow_forward" size={20} />
            </div>
          )}
        </React.Fragment>
      ))}
    </section>
  );
}
