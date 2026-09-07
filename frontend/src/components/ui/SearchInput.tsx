import React from 'react';
import MaterialIcon from '../icons/MaterialIcon';

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export default function SearchInput({ placeholder = 'Search...', value, onChange }: SearchInputProps) {
  return (
    <div className="relative">
      <MaterialIcon name="search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 pl-11 pr-4 bg-surface-container-low border border-outline-variant rounded-full font-['Geist'] text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
      />
    </div>
  );
}
