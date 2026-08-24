import React from 'react';
import { Card, LevelRank } from '../../core/types';
import { isRedSuit, isWildcard, SUIT_SYMBOLS } from '../../core/cards';

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

  // Size definitions
  const sizeClasses = {
    sm: 'w-8 h-12 text-xs rounded',
    md: 'w-12 h-18 sm:w-14 sm:h-20 text-sm rounded-md',
    lg: 'w-16 h-24 sm:w-20 sm:h-28 text-base rounded-lg',
  }[size];

  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`relative select-none cursor-pointer transition-all duration-150 transform flex flex-col justify-between p-1 border shadow-card font-bold ${sizeClasses} ${
        isSelected
          ? '-translate-y-4 ring-2 ring-yellow-400 bg-amber-50 shadow-card-hover z-20'
          : 'bg-white hover:-translate-y-1 hover:shadow-card-hover'
      } ${disabled ? 'opacity-60 cursor-not-allowed hover:translate-y-0' : ''} ${
        isRed ? 'text-rose-600' : 'text-slate-900'
      }`}
      style={{
        boxShadow: isSelected
          ? '0 12px 20px -2px rgba(251, 191, 36, 0.4), 0 0 10px rgba(251, 191, 36, 0.6)'
          : undefined,
      }}
    >
      {/* Top-Left Rank & Suit */}
      <div className="flex flex-col items-center leading-none">
        <span className="font-extrabold tracking-tight">{isJoker ? (card.rank === 'BJ' ? '大' : '小') : card.rank}</span>
        <span className="text-[10px] sm:text-xs leading-none">{isJoker ? '王' : SUIT_SYMBOLS[card.suit]}</span>
      </div>

      {/* Center Watermark / Icon */}
      {!compact && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 text-xl sm:text-2xl">
          {isJoker ? '👑' : SUIT_SYMBOLS[card.suit]}
        </div>
      )}

      {/* Wildcard Badge */}
      {wildcard && showWildcardBadge && (
        <div className="absolute -top-2 -right-1 bg-gradient-to-r from-amber-500 to-red-500 text-white text-[9px] px-1 py-0.2 rounded-full font-bold shadow animate-pulse">
          ★配
        </div>
      )}

      {/* Bottom-Right Inverted Rank */}
      <div className="flex flex-col items-center leading-none rotate-180 self-end">
        <span className="font-extrabold tracking-tight">{isJoker ? (card.rank === 'BJ' ? '大' : '小') : card.rank}</span>
        <span className="text-[10px] sm:text-xs leading-none">{isJoker ? '王' : SUIT_SYMBOLS[card.suit]}</span>
      </div>
    </div>
  );
};
