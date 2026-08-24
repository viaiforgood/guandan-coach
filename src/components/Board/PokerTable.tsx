import React, { useState } from 'react';
import { GameState, PlayerSeat } from '../../core/types';
import { PlayingCard } from '../Card/PlayingCard';
import { describeCombo } from '../../core/combos';
import { choosePlan } from '../../core/optimizer';
import { Sound } from '../../core/audio';
import { Users, Crown, Sparkles, RefreshCw, Volume2, VolumeX } from 'lucide-react';

interface PokerTableProps {
  gameState: GameState;
  selectedIds: Set<string>;
  onToggleCard: (cardId: string) => void;
  onClearSelection: () => void;
  onPlay: () => void;
  onPass: () => void;
  onAutoHint: () => void;
}

export const PokerTable: React.FC<PokerTableProps> = ({
  gameState,
  selectedIds,
  onToggleCard,
  onClearSelection,
  onPlay,
  onPass,
  onAutoHint,
}) => {
  const [groupingMode, setGroupingMode] = useState<'plan' | 'rank'>('plan');
  const [isMuted, setIsMuted] = useState<boolean>(() => Sound.getIsMuted());

  const {
    hands,
    currentTurn,
    currentCombo,
    trickPlays,
    levelRank,
    teamLevels,
    finishedOrder,
  } = gameState;

  const userHand = hands[0];
  const isMyTurn = currentTurn === 0;

  // Plan groups for user hand
  const planResult = choosePlan(userHand, levelRank);
  const bestGroups = planResult.best.groups;

  const seatNames: Record<PlayerSeat, string> = {
    0: '我 (南)',
    1: '右家 (东)',
    2: '对家·搭档 (北)',
    3: '左家 (西)',
  };

  const handleToggleSound = () => {
    const next = Sound.toggleMute();
    setIsMuted(next);
  };

  return (
    <div className="relative w-full aspect-[4/3] max-h-[76vh] min-h-[540px] rounded-[36px] table-felt border-[8px] border-amber-950/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] p-4 sm:p-6 flex flex-col justify-between overflow-hidden ring-2 ring-amber-600/40">
      {/* Top Banner: Level Rank & Team Scores & Audio Control */}
      <div className="flex items-center justify-between z-20">
        <div className="flex items-center space-x-3 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-500/40 shadow-lg">
          <div className="flex items-center space-x-1.5 text-amber-400 font-black text-sm">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>当前级牌【{levelRank}】</span>
            <span className="text-[11px] bg-gradient-to-r from-rose-600 to-amber-600 text-white px-2 py-0.2 rounded-full font-bold shadow">
              ♥{levelRank} 逢人配
            </span>
          </div>
        </div>

        {/* Center/Right: Team Levels & Sound Button */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-4 bg-slate-950/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-700/80 text-xs shadow-lg">
            <div className="flex items-center space-x-1">
              <span className="text-emerald-400 font-bold">我方 (南/北):</span>
              <span className="text-white font-extrabold text-sm">{teamLevels[0]} 级</span>
            </div>
            <div className="text-slate-600">|</div>
            <div className="flex items-center space-x-1">
              <span className="text-rose-400 font-bold">对方 (东/西):</span>
              <span className="text-white font-extrabold text-sm">{teamLevels[1]} 级</span>
            </div>
          </div>

          <button
            onClick={handleToggleSound}
            className="bg-slate-950/80 hover:bg-slate-900 text-amber-400 p-2 rounded-full border border-slate-700 transition-transform active:scale-90"
            title={isMuted ? '开启音效' : '静音'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* North: Teammate (Seat 2) */}
      <div className="flex flex-col items-center z-10 -mt-2">
        <div
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full transition-all duration-300 ${
            currentTurn === 2
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black ring-4 ring-amber-400/50 shadow-2xl scale-105'
              : 'bg-slate-950/80 text-slate-200 border border-slate-700/80 shadow'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span className="text-xs font-bold">{seatNames[2]}</span>
          <span className="text-[11px] bg-slate-900/90 text-amber-300 px-2 py-0.2 rounded-full font-extrabold">
            余 {hands[2].length} 张
          </span>
          {finishedOrder.indexOf(2) !== -1 && (
            <span className="bg-emerald-500 text-slate-950 text-[10px] px-2 py-0.2 rounded-full font-black">
              第{finishedOrder.indexOf(2) + 1}名
            </span>
          )}
        </div>

        {/* Teammate played cards cascade */}
        <div className="h-16 mt-1 flex items-center justify-center">
          {trickPlays[2] ? (
            trickPlays[2]?.action === 'pass' ? (
              <span className="text-xs bg-slate-900/80 text-slate-400 px-3 py-1 rounded-full border border-slate-700 font-bold shadow">
                过牌
              </span>
            ) : (
              <div className="flex -space-x-5 sm:-space-x-6 drop-shadow-xl animate-fade-in">
                {trickPlays[2]?.cards?.map((card) => (
                  <PlayingCard key={card.id} card={card} levelRank={levelRank} size="sm" />
                ))}
              </div>
            )
          ) : null}
        </div>
      </div>

      {/* Middle Row: West (Seat 3) + Center Felt Trick Area + East (Seat 1) */}
      <div className="grid grid-cols-3 items-center z-10 px-2">
        {/* West Player (Seat 3) */}
        <div className="flex flex-col items-start space-y-2">
          <div
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full transition-all duration-300 ${
              currentTurn === 3
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black ring-4 ring-amber-400/50 shadow-2xl scale-105'
                : 'bg-slate-950/80 text-slate-200 border border-slate-700/80 shadow'
            }`}
          >
            <span className="text-xs font-bold">{seatNames[3]}</span>
            <span className="text-[11px] bg-slate-900/90 text-rose-300 px-2 py-0.2 rounded-full font-extrabold">
              余 {hands[3].length} 张
            </span>
            {finishedOrder.indexOf(3) !== -1 && (
              <span className="bg-emerald-500 text-slate-950 text-[10px] px-2 py-0.2 rounded-full font-black">
                第{finishedOrder.indexOf(3) + 1}名
              </span>
            )}
          </div>

          <div className="h-16 flex items-center">
            {trickPlays[3] ? (
              trickPlays[3]?.action === 'pass' ? (
                <span className="text-xs bg-slate-900/80 text-slate-400 px-3 py-1 rounded-full border border-slate-700 font-bold shadow">
                  过牌
                </span>
              ) : (
                <div className="flex -space-x-5 sm:-space-x-6 drop-shadow-xl animate-fade-in">
                  {trickPlays[3]?.cards?.map((card) => (
                    <PlayingCard key={card.id} card={card} levelRank={levelRank} size="sm" />
                  ))}
                </div>
              )
            ) : null}
          </div>
        </div>

        {/* Center Trick Podium */}
        <div className="flex flex-col items-center justify-center p-4 rounded-3xl bg-black/40 border-2 border-emerald-500/30 backdrop-blur-md min-h-[100px] shadow-2xl">
          {currentCombo ? (
            <div className="text-center space-y-1.5 animate-fade-in">
              <div className="text-[11px] text-amber-300/80 font-bold uppercase tracking-wider">
                当前需压过牌型
              </div>
              <div className="text-sm sm:text-base font-black text-amber-400 flex items-center justify-center gap-1.5 drop-shadow">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{describeCombo(currentCombo)}</span>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-0.5">
              <div className="text-sm font-black text-emerald-300 drop-shadow">新一墩出牌</div>
              <div className="text-[11px] text-slate-300">任意合法牌型皆可领出</div>
            </div>
          )}
        </div>

        {/* East Player (Seat 1) */}
        <div className="flex flex-col items-end space-y-2">
          <div
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full transition-all duration-300 ${
              currentTurn === 1
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black ring-4 ring-amber-400/50 shadow-2xl scale-105'
                : 'bg-slate-950/80 text-slate-200 border border-slate-700/80 shadow'
            }`}
          >
            <span className="text-xs font-bold">{seatNames[1]}</span>
            <span className="text-[11px] bg-slate-900/90 text-rose-300 px-2 py-0.2 rounded-full font-extrabold">
              余 {hands[1].length} 张
            </span>
            {finishedOrder.indexOf(1) !== -1 && (
              <span className="bg-emerald-500 text-slate-950 text-[10px] px-2 py-0.2 rounded-full font-black">
                第{finishedOrder.indexOf(1) + 1}名
              </span>
            )}
          </div>

          <div className="h-16 flex items-center">
            {trickPlays[1] ? (
              trickPlays[1]?.action === 'pass' ? (
                <span className="text-xs bg-slate-900/80 text-slate-400 px-3 py-1 rounded-full border border-slate-700 font-bold shadow">
                  过牌
                </span>
              ) : (
                <div className="flex -space-x-5 sm:-space-x-6 drop-shadow-xl animate-fade-in">
                  {trickPlays[1]?.cards?.map((card) => (
                    <PlayingCard key={card.id} card={card} levelRank={levelRank} size="sm" />
                  ))}
                </div>
              )
            ) : null}
          </div>
        </div>
      </div>

      {/* User Hand Area (South: Seat 0) */}
      <div className="flex flex-col items-center space-y-2.5 z-20 mt-auto">
        {/* User Played Cards in current trick */}
        <div className="h-12 flex items-center justify-center">
          {trickPlays[0] ? (
            trickPlays[0]?.action === 'pass' ? (
              <span className="text-xs bg-slate-900/80 text-slate-400 px-3 py-1 rounded-full border border-slate-700 font-bold shadow">
                过牌
              </span>
            ) : (
              <div className="flex -space-x-5 sm:-space-x-6 drop-shadow-2xl animate-fade-in">
                {trickPlays[0]?.cards?.map((card) => (
                  <PlayingCard key={card.id} card={card} levelRank={levelRank} size="sm" />
                ))}
              </div>
            )
          ) : null}
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex items-center space-x-2 sm:space-x-3 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-800 shadow-xl">
          <button
            onClick={() => {
              Sound.playCardDeal();
              setGroupingMode(groupingMode === 'plan' ? 'rank' : 'plan');
            }}
            className="bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-xl border border-slate-600 font-bold flex items-center space-x-1 transition-transform active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>理牌：{groupingMode === 'plan' ? '按方案分组' : '点数顺序'}</span>
          </button>

          <button
            onClick={onClearSelection}
            disabled={selectedIds.size === 0}
            className="bg-slate-800/90 hover:bg-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-xl border border-slate-600 font-bold disabled:opacity-30"
          >
            重选
          </button>

          <button
            onClick={onAutoHint}
            className="bg-gradient-to-r from-amber-500/30 to-amber-600/30 hover:from-amber-500/40 hover:to-amber-600/40 text-amber-300 border border-amber-500/50 text-xs px-3.5 py-1.5 rounded-xl font-black flex items-center space-x-1 shadow transition-transform active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>教练支招</span>
          </button>

          {isMyTurn && (
            <>
              <button
                onClick={onPass}
                disabled={!currentCombo}
                className="bg-slate-700 hover:bg-slate-600 text-white font-extrabold text-xs sm:text-sm px-4 py-1.5 rounded-xl shadow disabled:opacity-30 transition-transform active:scale-95"
              >
                过牌
              </button>

              <button
                onClick={onPlay}
                disabled={selectedIds.size === 0}
                className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-black text-xs sm:text-sm px-6 py-1.5 rounded-xl shadow-xl transition-transform active:scale-95 disabled:opacity-30 flex items-center space-x-1.5"
              >
                <span>出牌 ({selectedIds.size}张)</span>
              </button>
            </>
          )}
        </div>

        {/* User Hand Display */}
        <div className="w-full max-w-5xl overflow-x-auto pb-2 flex justify-center items-end min-h-[96px]">
          {groupingMode === 'plan' ? (
            <div className="flex space-x-2 sm:space-x-3 items-end">
              {bestGroups.map((group, gIdx) => (
                <div
                  key={gIdx}
                  className="bg-black/30 p-1.5 rounded-xl border border-white/10 flex -space-x-6 sm:-space-x-7 items-end shadow-inner"
                >
                  {group.cards.map((card) => (
                    <PlayingCard
                      key={card.id}
                      card={card}
                      levelRank={levelRank}
                      isSelected={selectedIds.has(card.id)}
                      onClick={() => onToggleCard(card.id)}
                      size="md"
                    />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex -space-x-6 sm:-space-x-7 items-end">
              {userHand.map((card) => (
                <PlayingCard
                  key={card.id}
                  card={card}
                  levelRank={levelRank}
                  isSelected={selectedIds.has(card.id)}
                  onClick={() => onToggleCard(card.id)}
                  size="md"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
