import React from 'react';
import { BrandLogo } from '../Logo/BrandLogo';

interface CardBackProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  count?: number;
}

export const CardBack: React.FC<CardBackProps> = ({ size = 'md', className = '', count }) => {
  const sizeClasses = {
    sm: 'w-8 h-12 rounded',
    md: 'w-12 h-18 sm:w-15 sm:h-22 rounded-lg',
    lg: 'w-18 h-26 sm:w-22 sm:h-32 rounded-xl',
  }[size];

  return (
    <div
      className={`relative select-none border-2 border-amber-400/80 p-0.5 shadow-md flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 ${sizeClasses} ${className}`}
      style={{
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.4), inset 0 0 8px rgba(245, 158, 11, 0.2)',
      }}
    >
      {/* Inner Precision Border */}
      <div className="w-full h-full border border-amber-500/40 rounded flex items-center justify-center relative p-0.5">
        {/* Subtle Tech Pattern Background */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(#F59E0B 1px, transparent 1px), radial-gradient(#38BDF8 1px, transparent 1px)',
            backgroundSize: '8px 8px',
            backgroundPosition: '0 0, 4px 4px',
          }}
        />

        {/* Center Brand Logo Emblem */}
        <BrandLogo size={size === 'sm' ? 'sm' : 'md'} className="drop-shadow-lg" />

        {/* Optional Count Badge */}
        {count !== undefined && (
          <div className="absolute bottom-1 bg-amber-500 text-slate-950 font-black text-[9px] px-1 rounded-full shadow">
            {count}
          </div>
        )}
      </div>
    </div>
  );
};
