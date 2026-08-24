import React, { useState } from 'react';
import { TrackerState } from '../../core/tracker';
import { LevelRank, Rank } from '../../core/types';
import { Eye, ShieldAlert, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface CardTrackerProps {
  tracker: TrackerState;
  levelRank: LevelRank;
}

export const CardTrackerDrawer: React.FC<CardTrackerProps> = ({ tracker, levelRank }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const { keyCards, fiftyLaw, dangerAlerts } = tracker;

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 shadow-xl transition-all">
      {/* Header */}
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-slate-200 tracking-wide">记牌算牌 (五十定律)</span>
          {dangerAlerts.length > 0 && (
            <span className="bg-rose-500/20 text-rose-400 text-[10px] px-1.5 py-0.5 rounded font-semibold border border-rose-500/30 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />
              {dangerAlerts.length}家报牌
            </span>
          )}
        </div>
        <button className="text-slate-400 hover:text-white p-1">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-3 space-y-3">
          {/* Key Control Cards Grid */}
          <div className="grid grid-cols-5 gap-1.5 text-center">
            {/* Big Joker */}
            <div className="bg-slate-800/80 p-1.5 rounded border border-slate-700/60">
              <div className="text-[10px] text-rose-400 font-bold">大王</div>
              <div className="text-sm font-extrabold text-white">
                {keyCards.bigJoker.played}/{keyCards.bigJoker.total}
              </div>
              <div className="text-[9px] text-slate-400">余 {keyCards.bigJoker.remaining}</div>
            </div>

            {/* Small Joker */}
            <div className="bg-slate-800/80 p-1.5 rounded border border-slate-700/60">
              <div className="text-[10px] text-amber-400 font-bold">小王</div>
              <div className="text-sm font-extrabold text-white">
                {keyCards.smallJoker.played}/{keyCards.smallJoker.total}
              </div>
              <div className="text-[9px] text-slate-400">余 {keyCards.smallJoker.remaining}</div>
            </div>

            {/* Level Rank (级牌) */}
            <div className="bg-amber-950/40 p-1.5 rounded border border-amber-500/40">
              <div className="text-[10px] text-amber-300 font-bold">级牌 {levelRank}</div>
              <div className="text-sm font-extrabold text-amber-400">
                {keyCards.levelRankCards.played}/{keyCards.levelRankCards.total}
              </div>
              <div className="text-[9px] text-amber-200/70">余 {keyCards.levelRankCards.remaining}</div>
            </div>

            {/* Aces */}
            <div className="bg-slate-800/80 p-1.5 rounded border border-slate-700/60">
              <div className="text-[10px] text-emerald-400 font-bold">A</div>
              <div className="text-sm font-extrabold text-white">
                {keyCards.aces.played}/{keyCards.aces.total}
              </div>
              <div className="text-[9px] text-slate-400">余 {keyCards.aces.remaining}</div>
            </div>

            {/* Kings */}
            <div className="bg-slate-800/80 p-1.5 rounded border border-slate-700/60">
              <div className="text-[10px] text-indigo-400 font-bold">K</div>
              <div className="text-sm font-extrabold text-white">
                {keyCards.kings.played}/{keyCards.kings.total}
              </div>
              <div className="text-[9px] text-slate-400">余 {keyCards.kings.remaining}</div>
            </div>
          </div>

          {/* 50-Law (五十定律) Box */}
          <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-lg p-2 flex items-start space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <div className="text-xs">
              <div className="flex items-center space-x-2 mb-0.5">
                <span className="font-semibold text-emerald-300">五十定律顺子监测：</span>
                <span className="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded text-slate-200">
                  出5: {fiftyLaw.rank5.played}/8 (余{fiftyLaw.rank5.remaining})
                </span>
                <span className="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded text-slate-200">
                  出10: {fiftyLaw.rank10.played}/8 (余{fiftyLaw.rank10.remaining})
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-tight">{fiftyLaw.summary}</p>
            </div>
          </div>

          {/* Danger Alerts (报1, 报2, 报5) */}
          {dangerAlerts.length > 0 && (
            <div className="space-y-1">
              {dangerAlerts.map((alert, idx) => (
                <div
                  key={idx}
                  className={`text-xs px-2 py-1 rounded flex items-center justify-between ${
                    alert.alertType === 'warning'
                      ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                  }`}
                >
                  <span className="font-medium">
                    ⚠️ {alert.label} 仅剩 <strong className="text-white">{alert.count}</strong> 张！
                  </span>
                  <span className="text-[10px] font-bold underline">
                    {alert.count === 1 ? '防单绝不可出单' : alert.count === 2 ? '防对子' : '谨防顺子炸弹'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
