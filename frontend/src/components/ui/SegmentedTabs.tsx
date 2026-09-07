import React from 'react';

interface Tab {
  id: string;
  label: string;
}

interface SegmentedTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export default function SegmentedTabs({ tabs, activeTab, onTabChange }: SegmentedTabsProps) {
  return (
    <div className="flex items-center p-1 bg-[#201f1f] rounded-full border border-[#2a2a2a]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-1.5 rounded-full font-['Geist'] text-xs font-semibold tracking-wider uppercase transition-all ${
            activeTab === tab.id
              ? 'bg-white text-[#131313] shadow-sm'
              : 'text-[#c4c7c8] hover:text-white'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
