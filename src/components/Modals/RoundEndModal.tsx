import React from 'react';
import { GameState, PlayerSeat } from '../../core/types';
import { calculateRoundScore, getTeamOf } from '../../core/engine';
import { Trophy, Award, ArrowRight, RotateCcw } from 'lucide-react';

interface RoundEndModalProps {
  gameState: GameState;
  onNextRound: () => void;
  onRestartMatch: () => void;
}

export const RoundEndModal: React.FC<RoundEndModalProps> = ({
  gameState,
  onNextRound,
  onRestartMatch,
}) => {
  const { finishedOrder, teamLevels, phase } = gameState;
  const isMatchEnd = phase === 'match_end';

  const roundScore = calculateRoundScore(finishedOrder);

  const seatNames: Record<PlayerSeat, string> = {
    0: '我 (南)',
    1: '右家 (东)',
    2: '对家·搭档 (北)',
    3: '左家 (西)',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-center">
        {/* Trophy Icon */}
        <div className="mx-auto w-16 h-16 bg-amber-500/20 border-2 border-amber-500/40 rounded-full flex items-center justify-center text-amber-400">
          <Trophy className="w-8 h-8" />
        </div>

        {/* Title */}
        <div>
          <h2 className="text-2xl font-black text-white">
            {isMatchEnd ? '🏆 比赛圆满结束！' : '本局对战完成'}
          </h2>
          <p className="text-amber-400 font-bold mt-1">{roundScore.scoreDescription}</p>
        </div>

        {/* Finishing Order Rank List */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 divide-y divide-slate-800 text-sm">
          {finishedOrder.map((seat, index) => {
            const isMyTeam = getTeamOf(seat) === 0;
            return (
              <div key={seat} className="py-2 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
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
                  className={`text-xs px-2 py-0.5 rounded font-bold ${
                    isMyTeam
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {isMyTeam ? '我方阵营' : '对方阵营'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Level Progression */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-emerald-500/30">
            <div className="text-xs text-emerald-400 font-bold">我方总级数</div>
            <div className="text-xl font-extrabold text-white">{teamLevels[0]} 级</div>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-rose-500/30">
            <div className="text-xs text-rose-400 font-bold">对方总级数</div>
            <div className="text-xl font-extrabold text-white">{teamLevels[1]} 级</div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {isMatchEnd ? (
            <button
              onClick={onRestartMatch}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black py-3 rounded-xl shadow-lg flex items-center justify-center space-x-2 text-base transition-transform active:scale-95"
            >
              <RotateCcw className="w-5 h-5" />
              <span>开启新一轮大战 (从打2开始)</span>
            </button>
          ) : (
            <button
              onClick={onNextRound}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-slate-950 font-black py-3 rounded-xl shadow-lg flex items-center justify-center space-x-2 text-base transition-transform active:scale-95"
            >
              <span>进入下一局 (当前打【{gameState.levelRank}】)</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
