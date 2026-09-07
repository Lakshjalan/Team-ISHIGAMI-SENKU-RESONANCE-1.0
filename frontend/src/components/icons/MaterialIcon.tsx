import React from 'react';

interface MaterialIconProps {
  name?: string;
  icon?: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function MaterialIcon({ name, icon, size = 24, className = '', style = {} }: MaterialIconProps) {
  const iconName = name || icon || '';
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{ fontSize: `${size}px`, ...style }}
    >
      {iconName}
    </span>
  );
}
