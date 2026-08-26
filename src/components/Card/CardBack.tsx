import React, { useEffect, useState } from 'react';
import { CardBackSettings, CARDBACK_PRESETS, loadCardBackSettings } from '../../core/cardback';

interface CardBackProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  count?: number;
  customSettings?: CardBackSettings;
}

export const CardBack: React.FC<CardBackProps> = ({
  size = 'md',
  className = '',
  count,
  customSettings,
}) => {
  const [settings, setSettings] = useState<CardBackSettings>(() => customSettings || loadCardBackSettings());

  useEffect(() => {
    if (customSettings) {
      setSettings(customSettings);
      return;
    }

    const handler = () => {
      setSettings(loadCardBackSettings());
    };
    window.addEventListener('cardback_settings_changed', handler);
    return () => window.removeEventListener('cardback_settings_changed', handler);
  }, [customSettings]);

  const preset = CARDBACK_PRESETS.find((p) => p.id === settings.presetId) || CARDBACK_PRESETS[0];

  const sizeClasses = {
    sm: 'w-7.5 h-11 text-[8px] rounded-md',
    md: 'w-11 h-17 sm:w-14 sm:h-21 text-[10px] rounded-lg',
    lg: 'w-16 h-24 sm:w-20 sm:h-30 text-xs rounded-xl',
  }[size];

  const icon = settings.customIcon || preset.icon;
  const title = settings.customTitle || preset.title;
  const subtitle = settings.customSubtitle || preset.subtitle;
  const logoUrl = settings.customLogoUrl;

  const bgGradients = {
    crimson: 'bg-gradient-to-br from-red-950 via-rose-950 to-slate-950 border-amber-400',
    emerald: 'bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 border-emerald-400',
    navy: 'bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-950 border-sky-400',
    gold: 'bg-gradient-to-br from-amber-950 via-yellow-950 to-slate-950 border-amber-300',
    obsidian: 'bg-gradient-to-br from-slate-950 via-zinc-900 to-black border-amber-400/80',
  };

  const themeClass = bgGradients[settings.themeColor] || bgGradients.crimson;

  return (
    <div
      className={`relative select-none border-2 p-0.5 shadow-xl flex items-center justify-center overflow-hidden font-sans ${themeClass} ${sizeClasses} ${className}`}
      style={{
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.45), inset 0 0 10px rgba(245, 158, 11, 0.25)',
      }}
    >
      {/* Inner Decorative Golden Inset Border */}
      <div className="w-full h-full border border-amber-400/50 rounded flex flex-col items-center justify-center relative p-0.5 overflow-hidden">
        {/* Subtle Diamond Guilloche Texture Background */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(#F59E0B 1px, transparent 1px), radial-gradient(#38BDF8 1px, transparent 1px)',
            backgroundSize: '6px 6px',
            backgroundPosition: '0 0, 3px 3px',
          }}
        />

        {/* Center Custom Logo / Emblem */}
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={title}
            className="w-5 h-5 sm:w-7 sm:h-7 object-contain drop-shadow-md rounded-full border border-amber-300/50"
          />
        ) : (
          <div className="flex flex-col items-center justify-center leading-tight drop-shadow-md">
            <span className="text-sm sm:text-base">{icon}</span>
            {size !== 'sm' && (
              <>
                <span className="text-[8px] sm:text-[9px] font-black text-amber-200 tracking-tighter mt-0.5 line-clamp-1 max-w-[48px] text-center">
                  {title}
                </span>
                <span className="text-[6px] font-bold text-slate-300 tracking-widest uppercase scale-75 opacity-70">
                  {subtitle}
                </span>
              </>
            )}
          </div>
        )}

        {/* Optional Remaining Count Badge */}
        {count !== undefined && (
          <div className="absolute bottom-0.5 bg-amber-500 text-slate-950 font-black text-[8px] sm:text-[9px] px-1 rounded-full shadow border border-amber-200">
            {count}
          </div>
        )}
      </div>
    </div>
  );
};
