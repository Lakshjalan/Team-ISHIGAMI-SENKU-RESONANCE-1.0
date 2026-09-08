import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface LiquidGlassSliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  step?: number | 'any';
  className?: string;
  glowColor?: string;
}

export default function LiquidGlassSlider({
  min,
  max,
  value,
  onChange,
  step = 'any',
  className = '',
  glowColor = '#007AFF',
}: LiquidGlassSliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  const isActive = isDragging || isHovered;

  return (
    <div
      className={`relative w-full h-7 flex items-center select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsDragging(false);
      }}
    >
      {/* Track Background */}
      <div className="relative w-full h-4 rounded-full bg-[#131313] border border-white/10 overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
        {/* Dynamic Liquid Active Fill (Apple iOS Blue) */}
        <div
          className="h-full rounded-full"
          style={{
            width: `${percentage}%`,
            background: `linear-gradient(90deg, #0055ff 0%, ${glowColor} 100%)`,
            boxShadow: `0 0 ${percentage > 3 ? 12 : 0}px ${glowColor}66`,
          }}
        />
      </div>

      {/* Morphing Liquid Glass Thumb Knob (Framer Motion Crystal-Clear Glass Lens) */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 pointer-events-none rounded-full flex items-center justify-center z-10 overflow-hidden border"
        style={{
          left: `${percentage}%`,
          x: '-50%',
        }}
        initial={false}
        animate={{
          width: isActive ? 44 : 38,
          height: 24,
          backgroundColor: 'transparent',
          backdropFilter: 'blur(12px)',
          borderColor: isActive ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)',
          scale: isDragging ? 1.05 : isHovered ? 1.02 : 1,
          boxShadow: isActive
            ? 'inset 6px 0px 12px -2px rgba(0, 122, 255, 0.6), inset 0px 1px 4px rgba(255, 255, 255, 0.4), 0px 4px 10px rgba(0, 0, 0, 0.4)'
            : 'inset 0px 1px 4px rgba(255, 255, 255, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.3)',
        }}
        transition={{
          type: 'spring',
          stiffness: 450,
          damping: 28,
          mass: 0.8,
        }}
      >
        {/* Diagonal Optical Shimmer Overlay */}
        <div
          className={`w-full h-full rounded-full bg-gradient-to-tr from-transparent via-white/30 to-transparent transition-opacity duration-200 ${
            isActive ? 'opacity-100 animate-pulse' : 'opacity-20'
          }`}
        />
      </motion.div>

      {/* Visually Hidden Native Input for 60fps Buttery Smooth Drag Physics */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onPointerDown={() => setIsDragging(true)}
        onPointerUp={() => setIsDragging(false)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
      />
    </div>
  );
}
