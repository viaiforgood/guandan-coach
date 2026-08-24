import React, { useState } from 'react';
import { Card, Combo, GameState, LevelRank, PlayerSeat } from '../../core/types';
import { PlayingCard } from '../Card/PlayingCard';
import { cardLabel } from '../../core/cards';
import { describeCombo } from '../../core/combos';
import { choosePlan } from '../../core/optimizer';
import { Users, Crown, Shield, Volume2, Sparkles, RefreshCw } from 'lucide-react';

interface PokerTableProps {
  gameState: GameState;
  selectedIds: Set<string>;
  onToggleCard: (cardId: string) => void;
  onClearSelection: () => void;
  onPlay: () => void;
  onPass: () => void;
  onAutoHint: () => void;
  isBotThinking?: boolean;
}

export const PokerTable: React.FC<PokerTableProps> = ({
  gameState,
  selectedIds,
  onToggleCard,
  onClearSelection,
  onPlay,
  onPass,
  onAutoHint,
  isBotThinking = false,
}) => {
  const [groupingMode, setGroupingMode] = useState<'plan' | 'rank'>('plan');

  const {
    hands,
    currentTurn,
    currentCombo,
    trickPlays,
    levelRank,
    teamLevels,
    lastPlayerIndex,
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

  return (
    <div className="relative w-full aspect-[4/3] max-h-[75vh] min-h-[520px] rounded-3xl table-felt border-4 border-amber-900/60 shadow-2xl p-4 sm:p-6 flex flex-col justify-between overflow-hidden">
      {/* Top Banner: Level Rank & Team Scores */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center space-x-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-500/30">
          <div className="flex items-center space-x-1.5 text-amber-400 font-extrabold text-sm">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>当前打【{levelRank}】</span>
            <span className="text-[11px] bg-rose-600 text-white px-1.5 py-0.2 rounded-full">
              ♥{levelRank} 逢人配
            </span>
          </div>
        </div>

        {/* Team Levels */}
        <div className="flex items-center space-x-4 bg-slate-900/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-700 text-xs">
          <div className="flex items-center space-x-1">
            <span className="text-emerald-400 font-bold">我方 (南/北):</span>
            <span className="text-white font-extrabold text-sm">{teamLevels[0]} 级</span>
          </div>
          <div className="text-slate-500">|</div>
          <div className="flex items-center space-x-1">
            <span className="text-rose-400 font-bold">对方 (东/西):</span>
            <span className="text-white font-extrabold text-sm">{teamLevels[1]} 级</span>
          </div>
        </div>
      </div>

      {/* North: Teammate (Seat 2) */}
      <div className="flex flex-col items-center z-10">
        <div
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all ${
            currentTurn === 2
              ? 'bg-amber-500 text-slate-950 font-bold ring-4 ring-amber-400/40 shadow-lg scale-105'
              : 'bg-slate-900/80 text-slate-200 border border-slate-700'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold">{seatNames[2]}</span>
          <span className="text-[11px] bg-slate-800 text-amber-300 px-2 py-0.2 rounded-full font-bold">
            余 {hands[2].length} 张
          </span>
          {finishedOrder.indexOf(2) !== -1 && (
            <span className="bg-emerald-500 text-slate-950 text-[10px] px-1.5 rounded font-extrabold">
              第{finishedOrder.indexOf(2) + 1}名
            </span>
          )}
        </div>

        {/* Teammate played cards */}
        <div className="h-14 mt-1 flex items-center justify-center">
          {trickPlays[2] ? (
            trickPlays[2]?.action === 'pass' ? (
              <span className="text-xs bg-slate-800/80 text-slate-400 px-3 py-1 rounded-full border border-slate-700 font-bold">
                过牌
              </span>
            ) : (
              <div className="flex -space-x-4">
                {trickPlays[2]?.cards?.map((card) => (
                  <PlayingCard key={card.id} card={card} levelRank={levelRank} size="sm" />
                ))}
              </div>
            )
          ) : null}
        </div>
      </div>

      {/* Middle Row: West (Seat 3) + Center Felt Area + East (Seat 1) */}
      <div className="grid grid-cols-3 items-center z-10">
        {/* West Player (Seat 3) */}
        <div className="flex flex-col items-start space-y-2">
          <div
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all ${
              currentTurn === 3
                ? 'bg-amber-500 text-slate-950 font-bold ring-4 ring-amber-400/40 shadow-lg scale-105'
                : 'bg-slate-900/80 text-slate-200 border border-slate-700'
            }`}
          >
            <span className="text-xs font-semibold">{seatNames[3]}</span>
            <span className="text-[11px] bg-slate-800 text-rose-300 px-2 py-0.2 rounded-full font-bold">
              余 {hands[3].length} 张
            </span>
            {finishedOrder.indexOf(3) !== -1 && (
              <span className="bg-emerald-500 text-slate-950 text-[10px] px-1.5 rounded font-extrabold">
                第{finishedOrder.indexOf(3) + 1}名
              </span>
            )}
          </div>

          <div className="h-14 flex items-center">
            {trickPlays[3] ? (
              trickPlays[3]?.action === 'pass' ? (
                <span className="text-xs bg-slate-800/80 text-slate-400 px-3 py-1 rounded-full border border-slate-700 font-bold">
                  过牌
                </span>
              ) : (
                <div className="flex -space-x-4">
                  {trickPlays[3]?.cards?.map((card) => (
                    <PlayingCard key={card.id} card={card} levelRank={levelRank} size="sm" />
                  ))}
                </div>
              )
            ) : null}
          </div>
        </div>

        {/* Center Trick Status */}
        <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-black/30 border border-emerald-500/20 backdrop-blur-sm min-h-[90px]">
          {currentCombo ? (
            <div className="text-center space-y-1">
              <div className="text-[11px] text-amber-300/80 font-medium">当前需压过牌型</div>
              <div className="text-sm font-extrabold text-amber-400 flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{describeCombo(currentCombo)}</span>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-0.5">
              <div className="text-xs font-bold text-emerald-300">新一墩出牌</div>
              <div className="text-[11px] text-slate-400">由领牌玩家自由首发</div>
            </div>
          )}
        </div>

        {/* East Player (Seat 1) */}
        <div className="flex flex-col items-end space-y-2">
          <div
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all ${
              currentTurn === 1
                ? 'bg-amber-500 text-slate-950 font-bold ring-4 ring-amber-400/40 shadow-lg scale-105'
                : 'bg-slate-900/80 text-slate-200 border border-slate-700'
            }`}
          >
            <span className="text-xs font-semibold">{seatNames[1]}</span>
            <span className="text-[11px] bg-slate-800 text-rose-300 px-2 py-0.2 rounded-full font-bold">
              余 {hands[1].length} 张
            </span>
            {finishedOrder.indexOf(1) !== -1 && (
              <span className="bg-emerald-500 text-slate-950 text-[10px] px-1.5 rounded font-extrabold">
                第{finishedOrder.indexOf(1) + 1}名
              </span>
            )}
          </div>

          <div className="h-14 flex items-center">
            {trickPlays[1] ? (
              trickPlays[1]?.action === 'pass' ? (
                <span className="text-xs bg-slate-800/80 text-slate-400 px-3 py-1 rounded-full border border-slate-700 font-bold">
                  过牌
                </span>
              ) : (
                <div className="flex -space-x-4">
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
      <div className="flex flex-col items-center space-y-3 z-10 mt-auto">
        {/* User Played Cards or Pass in current trick */}
        <div className="h-12 flex items-center justify-center">
          {trickPlays[0] ? (
            trickPlays[0]?.action === 'pass' ? (
              <span className="text-xs bg-slate-800/80 text-slate-400 px-3 py-1 rounded-full border border-slate-700 font-bold">
                过牌
              </span>
            ) : (
              <div className="flex -space-x-4">
                {trickPlays[0]?.cards?.map((card) => (
                  <PlayingCard key={card.id} card={card} levelRank={levelRank} size="sm" />
                ))}
              </div>
            )
          ) : null}
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={() => setGroupingMode(groupingMode === 'plan' ? 'rank' : 'plan')}
            className="bg-slate-800/90 hover:bg-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-slate-600 font-medium flex items-center space-x-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>理牌：{groupingMode === 'plan' ? '按方案' : '按点数'}</span>
          </button>

          <button
            onClick={onClearSelection}
            disabled={selectedIds.size === 0}
            className="bg-slate-800/90 hover:bg-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-slate-600 font-medium disabled:opacity-40"
          >
            重选
          </button>

          <button
            onClick={onAutoHint}
            className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>教练提示</span>
          </button>

          {isMyTurn && (
            <>
              <button
                onClick={onPass}
                disabled={!currentCombo}
                className="bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs sm:text-sm px-4 py-1.5 rounded-lg shadow disabled:opacity-40"
              >
                过牌
              </button>

              <button
                onClick={onPlay}
                disabled={selectedIds.size === 0}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-slate-950 font-extrabold text-xs sm:text-sm px-6 py-1.5 rounded-lg shadow-lg transition-transform active:scale-95 disabled:opacity-40"
              >
                出牌 ({selectedIds.size}张)
              </button>
            </>
          )}
        </div>

        {/* User Hand Cards */}
        <div className="w-full max-w-4xl overflow-x-auto pb-2 flex justify-center items-end min-h-[90px]">
          {groupingMode === 'plan' ? (
            <div className="flex space-x-2 sm:space-x-3 items-end">
              {bestGroups.map((group, gIdx) => (
                <div
                  key={gIdx}
                  className="bg-black/20 p-1 rounded-lg border border-white/10 flex -space-x-6 sm:-space-x-7 items-end"
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
