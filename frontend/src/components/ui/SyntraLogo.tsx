import React from 'react';

interface SyntraLogoProps {
  className?: string;
}

export default function SyntraLogo({ className = 'w-10 h-10' }: SyntraLogoProps) {
  return (
    <svg
      viewBox="0 0 220 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Top Sphere Light Gradient */}
        <radialGradient
          id="syntra-sphere-top"
          cx="35%"
          cy="35%"
          r="65%"
        >
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
        </radialGradient>

        {/* Bottom Sphere Light Gradient */}
        <radialGradient
          id="syntra-sphere-bottom"
          cx="65%"
          cy="65%"
          r="65%"
        >
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.65" />
        </radialGradient>

        {/* High-intensity Lens Refraction Gradient */}
        <radialGradient
          id="syntra-lens-glow"
          cx="50%"
          cy="50%"
          r="50%"
        >
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
        </radialGradient>

        {/* Mask for Intersecting Lens Region */}
        <mask id="syntra-intersection-mask">
          <circle cx="92" cy="78" r="54" fill="#ffffff" />
        </mask>
      </defs>

      {/* Top Left Sphere */}
      <circle
        cx="92"
        cy="78"
        r="54"
        fill="url(#syntra-sphere-top)"
        stroke="rgba(255, 255, 255, 0.45)"
        strokeWidth="1.5"
      />

      {/* Bottom Right Sphere */}
      <circle
        cx="132"
        cy="118"
        r="54"
        fill="url(#syntra-sphere-bottom)"
        stroke="rgba(255, 255, 255, 0.45)"
        strokeWidth="1.5"
      />

      {/* Glowing Lens Refraction Overlay */}
      <circle
        cx="132"
        cy="118"
        r="54"
        fill="url(#syntra-lens-glow)"
        mask="url(#syntra-intersection-mask)"
      />
    </svg>
  );
}
