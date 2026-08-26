import React from 'react';
import { Card, LevelRank } from '../../core/types';
import { isRedSuit, isWildcard, SUIT_SYMBOLS } from '../../core/cards';
import { Sound } from '../../core/audio';

interface PlayingCardProps {
  card: Card;
  levelRank?: LevelRank;
  isSelected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  compact?: boolean;
  disabled?: boolean;
  showWildcardBadge?: boolean;
}

export const PlayingCard: React.FC<PlayingCardProps> = ({
  card,
  levelRank,
  isSelected = false,
  onClick,
  size = 'md',
  compact = false,
  disabled = false,
  showWildcardBadge = true,
}) => {
  const isRed = isRedSuit(card.suit) || card.rank === 'BJ';
  const wildcard = levelRank ? isWildcard(card, levelRank) : false;
  const isJoker = card.rank === 'SJ' || card.rank === 'BJ';

  // Size dimensions for responsive tables
  const sizeClasses = {
    sm: 'w-7.5 h-11 text-[11px] rounded-md',
    md: 'w-11 h-17 sm:w-14 sm:h-21 text-sm rounded-lg',
    lg: 'w-16 h-24 sm:w-20 sm:h-30 text-base rounded-xl',
  }[size];

  const handleClick = () => {
    if (disabled) return;
    Sound.playCardClick();
    if (onClick) onClick();
  };

  return (
    <div
      onClick={handleClick}
      className={`relative select-none cursor-pointer transition-all duration-200 ease-out flex flex-col justify-between p-1 sm:p-1.5 font-sans font-black ${sizeClasses} ${
        isSelected
          ? '-translate-y-5 ring-2 ring-amber-400 shadow-2xl z-30 scale-105'
          : 'hover:-translate-y-1.5 hover:shadow-xl'
      } ${disabled ? 'opacity-45 cursor-not-allowed hover:translate-y-0' : ''} ${
        isRed ? 'text-rose-600' : 'text-slate-900'
      } ${wildcard ? 'ring-2 ring-amber-400 shadow-amber-400/40' : 'border border-slate-300/80'}`}
      style={{
        boxShadow: isSelected
          ? '0 18px 30px -4px rgba(0, 0, 0, 0.45), 0 0 16px rgba(251, 191, 36, 0.75)'
          : '0 4px 10px -2px rgba(0, 0, 0, 0.25), 0 1px 3px rgba(0, 0, 0, 0.15)',
        background: wildcard
          ? 'linear-gradient(135deg, #fffbeb 0%, #ffffff 40%, #fef3c7 100%)'
          : 'linear-gradient(180deg, #ffffff 0%, #fdfdfd 60%, #f4f4f5 100%)',
      }}
    >
      {/* Top-Left Corner Pip */}
      <div className="flex flex-col items-center leading-none z-10">
        <span className="font-extrabold tracking-tight text-xs sm:text-[13px] drop-shadow-sm">
          {isJoker ? (card.rank === 'BJ' ? '大' : '小') : card.rank}
        </span>
        <span className="text-[10px] sm:text-xs leading-tight -mt-0.5 font-normal">
          {isJoker ? '王' : SUIT_SYMBOLS[card.suit]}
        </span>
      </div>

      {/* Center Authentic Watermark & Joker Emblem */}
      {!compact && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {isJoker ? (
            <div className="flex flex-col items-center justify-center opacity-85 scale-90">
              <span className="text-xl sm:text-2xl filter drop-shadow">
                {card.rank === 'BJ' ? '👑' : '🎭'}
              </span>
              <span
                className={`text-[8px] sm:text-[9px] font-black px-1 rounded ${
                  card.rank === 'BJ' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-white'
                }`}
              >
                {card.rank === 'BJ' ? 'RED JOKER' : 'BLACK JOKER'}
              </span>
            </div>
          ) : wildcard ? (
            <div className="flex flex-col items-center justify-center opacity-25">
              <span className="text-2xl sm:text-3xl text-rose-600 animate-pulse">♥</span>
            </div>
          ) : (
            <span className="text-xl sm:text-2xl opacity-15">
              {SUIT_SYMBOLS[card.suit]}
            </span>
          )}
        </div>
      )}

      {/* Red Heart Wildcard Shimmering Gold Ribbon Badge */}
      {wildcard && showWildcardBadge && (
        <div className="absolute -top-2.5 -right-1.5 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 text-white text-[8px] sm:text-[9px] px-1.5 py-0.2 rounded-full font-black shadow-md border border-amber-300 animate-pulse z-20 flex items-center gap-0.5">
          <span>★</span>
          <span>配</span>
        </div>
      )}

      {/* Bottom-Right Inverted Corner Pip */}
      <div className="flex flex-col items-center leading-none rotate-180 self-end z-10">
        <span className="font-extrabold tracking-tight text-xs sm:text-[13px] drop-shadow-sm">
          {isJoker ? (card.rank === 'BJ' ? '大' : '小') : card.rank}
        </span>
        <span className="text-[10px] sm:text-xs leading-tight -mt-0.5 font-normal">
          {isJoker ? '王' : SUIT_SYMBOLS[card.suit]}
        </span>
      </div>
    </div>
  );
};
