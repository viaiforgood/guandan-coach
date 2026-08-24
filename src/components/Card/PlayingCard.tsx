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
  const isCourt = card.rank === 'J' || card.rank === 'Q' || card.rank === 'K';

  // Size dimensions
  const sizeClasses = {
    sm: 'w-8 h-12 text-[11px] rounded',
    md: 'w-12 h-18 sm:w-15 sm:h-22 text-sm rounded-lg',
    lg: 'w-18 h-26 sm:w-22 sm:h-32 text-base rounded-xl',
  }[size];

  const handleClick = () => {
    if (disabled) return;
    Sound.playCardClick();
    if (onClick) onClick();
  };

  return (
    <div
      onClick={handleClick}
      className={`relative select-none cursor-pointer transition-all duration-200 ease-out flex flex-col justify-between p-1 sm:p-1.5 border font-sans font-black ${sizeClasses} ${
        isSelected
          ? '-translate-y-5 ring-2 ring-amber-400 bg-gradient-to-b from-amber-50 to-white shadow-2xl z-30 scale-105'
          : 'bg-gradient-to-b from-white to-slate-50 hover:-translate-y-2 hover:shadow-xl'
      } ${disabled ? 'opacity-50 cursor-not-allowed hover:translate-y-0' : ''} ${
        isRed ? 'text-rose-600 border-rose-200/80' : 'text-slate-900 border-slate-300'
      } ${wildcard ? 'ring-2 ring-amber-500 shadow-amber-500/20' : ''}`}
      style={{
        boxShadow: isSelected
          ? '0 16px 28px -4px rgba(0, 0, 0, 0.4), 0 0 14px rgba(251, 191, 36, 0.6)'
          : '0 4px 8px -2px rgba(0, 0, 0, 0.25), 0 1px 3px rgba(0, 0, 0, 0.15)',
        backgroundImage: 'radial-gradient(circle at 50% 0%, #ffffff 0%, #f8fafc 100%)',
      }}
    >
      {/* Top-Left Rank & Suit */}
      <div className="flex flex-col items-center leading-none z-10">
        <span className="font-extrabold tracking-tighter text-xs sm:text-sm">
          {isJoker ? (card.rank === 'BJ' ? '大' : '小') : card.rank}
        </span>
        <span className="text-[10px] sm:text-xs leading-tight -mt-0.5">
          {isJoker ? '王' : SUIT_SYMBOLS[card.suit]}
        </span>
      </div>

      {/* Center Court Graphic / Watermark */}
      {!compact && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          {isJoker ? (
            <span className="text-2xl sm:text-3xl">👑</span>
          ) : isCourt ? (
            <span className="text-xl sm:text-2xl font-serif text-amber-900 opacity-30">
              {card.rank === 'K' ? '♔' : card.rank === 'Q' ? '♕' : '♘'}
            </span>
          ) : (
            <span className="text-xl sm:text-2xl">{SUIT_SYMBOLS[card.suit]}</span>
          )}
        </div>
      )}

      {/* Wildcard Shimmering Badge */}
      {wildcard && showWildcardBadge && (
        <div className="absolute -top-2.5 -right-1.5 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 text-white text-[9px] px-1.5 py-0.2 rounded-full font-black shadow-md border border-amber-300 animate-pulse z-20 flex items-center gap-0.5">
          <span>★</span>
          <span>配</span>
        </div>
      )}

      {/* Bottom-Right Inverted Corner */}
      <div className="flex flex-col items-center leading-none rotate-180 self-end z-10">
        <span className="font-extrabold tracking-tighter text-xs sm:text-sm">
          {isJoker ? (card.rank === 'BJ' ? '大' : '小') : card.rank}
        </span>
        <span className="text-[10px] sm:text-xs leading-tight -mt-0.5">
          {isJoker ? '王' : SUIT_SYMBOLS[card.suit]}
        </span>
      </div>
    </div>
  );
};
