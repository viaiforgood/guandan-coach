import React, { useState } from 'react';
import { CoachSuggestion, LevelRank } from '../../core/types';
import { Bot, Lightbulb, CheckCircle2, ChevronRight } from 'lucide-react';
import { describeCombo } from '../../core/combos';

interface CoachBubbleProps {
  suggestion: CoachSuggestion | null;
  levelRank: LevelRank;
  onApplyPlay?: () => void;
  isMyTurn: boolean;
}

export const CoachBubble: React.FC<CoachBubbleProps> = ({
  suggestion,
  levelRank,
  onApplyPlay,
  isMyTurn,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  if (!suggestion) return null;

  return (
    <div className="bg-slate-900/95 backdrop-blur-md border border-amber-500/30 rounded-xl p-3 shadow-xl transition-all">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-amber-500/20 p-1.5 rounded-lg border border-amber-500/40 text-amber-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <span>AI 掼蛋大师教练</span>
              {suggestion.confidence && (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded border border-amber-500/30">
                  置信度 {suggestion.confidence === 'high' ? '高' : '中'}
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-400">
              {isMyTurn ? '轮到你出牌，教练已为你推演最佳策略' : '推演其他家出牌与战局走向'}
            </div>
          </div>
        </div>

        {isMyTurn && suggestion.action === 'play' && suggestion.combo && onApplyPlay && (
          <button
            onClick={onApplyPlay}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs px-3 py-1.5 rounded-lg shadow-md flex items-center space-x-1 transition-transform active:scale-95"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>一键选牌</span>
          </button>
        )}
      </div>

      {/* Rationale Content */}
      <div className="mt-2.5 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-line">
        <div className="flex items-start space-x-1.5">
          <Lightbulb className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          <div>{suggestion.rationale}</div>
        </div>
      </div>
    </div>
  );
};
