import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8 sm:w-9 sm:h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${sizeMap[size]} ${className}`}>
      {/* Ambient Tech Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/30 via-rose-500/20 to-sky-500/30 rounded-2xl blur-md -z-10" />

      {/* Vector Icon */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_4px_12px_rgba(245,158,11,0.35)]"
      >
        <defs>
          {/* Main Tech Metallic Gold & Sapphire Gradient */}
          <linearGradient id="brandGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="35%" stopColor="#EF4444" />
            <stop offset="70%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>

          {/* Card Surface Gradient */}
          <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Gold Foil Accent */}
          <linearGradient id="goldFoil" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>

        {/* Outer Rounded Tech Squircle Shield */}
        <rect
          x="6"
          y="6"
          width="88"
          height="88"
          rx="24"
          fill="url(#cardGrad)"
          stroke="url(#brandGrad1)"
          strokeWidth="3.5"
        />

        {/* Back Card (Angled Fan) */}
        <path
          d="M32 24 C32 20, 36 18, 40 18 L68 18 C72 18, 76 20, 76 24 L76 72 C76 76, 72 78, 68 78 L40 78 C36 78, 32 76, 32 72 Z"
          fill="#1E1B4B"
          opacity="0.6"
          transform="rotate(10 54 48)"
          stroke="#4F46E5"
          strokeWidth="1.5"
        />

        {/* Front Card (Precision Diamond / Ace Cut) */}
        <rect
          x="26"
          y="22"
          width="48"
          height="58"
          rx="10"
          fill="#090D16"
          stroke="url(#goldFoil)"
          strokeWidth="2"
        />

        {/* Futuristic 'V' AI Neural Core (Via AI + ZJU Qiushi Eagle Wing + Guandan Ace) */}
        <path
          d="M38 34 L50 64 L62 34 L55 34 L50 49 L45 34 Z"
          fill="url(#goldFoil)"
        />

        {/* Top Floating AI Spark Node */}
        <circle cx="50" cy="29" r="3" fill="#38BDF8" />
        <circle cx="38" cy="34" r="2" fill="#F59E0B" />
        <circle cx="62" cy="34" r="2" fill="#EF4444" />

        {/* Central Heart Wildcard Sparkle */}
        <path
          d="M50 54 C50 54, 46 51, 46 49 C46 47.5, 47.5 46.5, 49 47.5 L50 48.5 L51 47.5 C52.5 46.5, 54 47.5, 54 49 C54 51, 50 54, 50 54 Z"
          fill="#EF4444"
        />
      </svg>
    </div>
  );
};
