import React from 'react';
import { GameState, PlayerSeat } from '../../core/types';
import { calculateRoundScore, getTeamOf } from '../../core/engine';
import { Trophy, ArrowRight, RotateCcw, RefreshCw, Film } from 'lucide-react';

interface RoundEndModalProps {
  gameState: GameState;
  onNextRound: () => void;
  onRestartMatch: () => void;
  onSwapRematch?: () => void;
  onReviewReplay?: () => void;
}

export const RoundEndModal: React.FC<RoundEndModalProps> = ({
  gameState,
  onNextRound,
  onRestartMatch,
  onSwapRematch,
  onReviewReplay,
}) => {
  const { finishedOrder, teamLevels, phase } = gameState;
  const isMatchEnd = phase === 'match_end';

  const mode = gameState.mode || '4p';
  const is6p = mode === '6p';
  const roundScore = calculateRoundScore(finishedOrder, mode);

  const seatNames: Record<number, string> = is6p
    ? {
        0: '我 (南)',
        1: '东南 (对方1)',
        2: '西北 (搭档1)',
        3: '正北 (对方2)',
        4: '东北 (搭档2)',
        5: '西南 (对方3)',
      }
    : {
        0: '我 (南)',
        1: '右家 (东)',
        2: '对家·搭档 (北)',
        3: '左家 (西)',
      };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl max-w-md w-full p-4 sm:p-5 shadow-2xl space-y-3.5 text-center">
        {/* Trophy Icon */}
        <div className="mx-auto w-12 h-12 bg-amber-500/20 border-2 border-amber-500/40 rounded-full flex items-center justify-center text-amber-400">
          <Trophy className="w-6 h-6" />
        </div>

        {/* Title */}
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {isMatchEnd ? '🏆 比赛圆满结束！' : '本局对战完成'}
          </h2>
          <p className="text-amber-400 font-bold text-xs sm:text-sm mt-0.5">{roundScore.scoreDescription}</p>
        </div>

        {/* Finishing Order Rank List */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 divide-y divide-slate-800 text-xs">
          {finishedOrder.map((seat, index) => {
            const isMyTeam = getTeamOf(seat) === 0;
            return (
              <div key={seat} className="py-1.5 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                      index === 0
                        ? 'bg-amber-500 text-slate-950'
                        : index === 1
                        ? 'bg-slate-300 text-slate-900'
                        : index === 2
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="font-semibold text-slate-200">{seatNames[seat]}</span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.2 rounded font-bold ${
                    isMyTeam
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {isMyTeam ? '我方' : '对方'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Level Progression */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-800/80 p-2 rounded-xl border border-emerald-500/30">
            <div className="text-[10px] text-emerald-400 font-bold">我方总级数</div>
            <div className="text-base font-extrabold text-white">{teamLevels[0]} 级</div>
          </div>
          <div className="bg-slate-800/80 p-2 rounded-xl border border-rose-500/30">
            <div className="text-[10px] text-rose-400 font-bold">对方总级数</div>
            <div className="text-base font-extrabold text-white">{teamLevels[1]} 级</div>
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="space-y-2 pt-1">
          {/* Main Progression */}
          {isMatchEnd ? (
            <button
              onClick={onRestartMatch}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black py-2.5 rounded-xl shadow-lg flex items-center justify-center space-x-1.5 text-xs sm:text-sm transition-transform active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>开启新一轮大战 (从打2开始)</span>
            </button>
          ) : (
            <button
              onClick={onNextRound}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-slate-950 font-black py-2.5 rounded-xl shadow-lg flex items-center justify-center space-x-1.5 text-xs sm:text-sm transition-transform active:scale-95"
            >
              <span>进入下一局 (当前打【{gameState.levelRank}】)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {/* Replay & Swap Rematch Sub-buttons */}
          <div className="grid grid-cols-2 gap-2">
            {onSwapRematch && (
              <button
                onClick={onSwapRematch}
                className="bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold py-2 rounded-xl text-xs border border-amber-500/30 flex items-center justify-center gap-1 transition-transform active:scale-95"
                title="与对手互换手牌重打本局"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>🔄 换牌复赛</span>
              </button>
            )}

            {onReviewReplay && (
              <button
                onClick={onReviewReplay}
                className="bg-slate-800 hover:bg-slate-700 text-sky-300 font-bold py-2 rounded-xl text-xs border border-sky-500/30 flex items-center justify-center gap-1 transition-transform active:scale-95"
                title="进入复盘模式查看每一步出牌"
              >
                <Film className="w-3.5 h-3.5" />
                <span>🎬 立即复盘</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
