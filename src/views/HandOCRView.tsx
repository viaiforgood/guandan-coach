import React, { useState } from 'react';
import { Card, LevelRank } from '../core/types';
import { choosePlan } from '../core/optimizer';
import { PlayingCard } from '../components/Card/PlayingCard';
import { Camera, Sparkles, Wand2, Lightbulb } from 'lucide-react';

export const HandOCRView: React.FC = () => {
  const [levelRank, setLevelRank] = useState<LevelRank>('2');
  const [inputText, setInputText] = useState<string>(
    'H2 S3 S4 S5 S6 S7 BJ SJ S9 H9 C9 D9 S10 H10 C10 SA HA CA'
  );
  const [parsedCards, setParsedCards] = useState<Card[]>([]);
  const [analysisResult, setAnalysisResult] = useState<ReturnType<typeof choosePlan> | null>(null);

  const handleParseAndAnalyze = () => {
    const tokens = inputText.trim().split(/[\s,，]+/);
    const cards: Card[] = [];
    let idCounter = 0;

    for (const token of tokens) {
      if (!token) continue;
      const upper = token.toUpperCase();

      if (upper === 'BJ' || upper === '大王') {
        cards.push({ id: `ocr_${idCounter++}`, suit: 'H', rank: 'BJ' });
      } else if (upper === 'SJ' || upper === '小王') {
        cards.push({ id: `ocr_${idCounter++}`, suit: 'S', rank: 'SJ' });
      } else {
        const suitChar = upper[0];
        const rankStr = upper.slice(1);
        const validSuits = ['S', 'H', 'C', 'D'];
        const validRanks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

        if (validSuits.includes(suitChar) && validRanks.includes(rankStr)) {
          cards.push({
            id: `ocr_${idCounter++}`,
            suit: suitChar as any,
            rank: rankStr as any,
          });
        }
      }
    }

    setParsedCards(cards);
    if (cards.length > 0) {
      const plan = choosePlan(cards, levelRank);
      setAnalysisResult(plan);
    } else {
      setAnalysisResult(null);
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto pr-1 space-y-3 sm:space-y-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 font-extrabold text-xs mb-0.5">
            <Camera className="w-3.5 h-3.5" />
            <span>智能识牌与手牌结构诊断</span>
          </div>
          <h1 className="text-lg sm:text-xl font-black text-white">手牌导入与一键理牌诊断</h1>
          <p className="text-xs text-slate-300">
            输入手牌符号或自然语言，AI 自动完成理牌规划（保炸优先 vs 去单化）。
          </p>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-bold text-slate-300">
            输入手牌编码（如 H2 S3 BJ SJ S9 H9 C9 D9）：
          </label>
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-400">级牌：</span>
            <select
              value={levelRank}
              onChange={(e) => setLevelRank(e.target.value as LevelRank)}
              className="bg-slate-800 border border-slate-700 text-amber-400 font-bold px-2 py-0.5 rounded-lg text-xs"
            >
              {['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'].map((r) => (
                <option key={r} value={r}>
                  打 {r} (♥{r}逢人配)
                </option>
              ))}
            </select>
          </div>
        </div>

        <textarea
          rows={2}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs sm:text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          placeholder="例如: H2 S3 S4 S5 S6 S7 BJ SJ S9 H9 C9 D9 S10 H10 C10 SA HA CA"
        />

        <div className="flex items-center justify-between pt-0.5">
          <div className="text-[10px] text-slate-400">
            S=黑桃, H=红桃, C=梅花, D=方块 | BJ=大王, SJ=小王
          </div>

          <button
            onClick={handleParseAndAnalyze}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs px-4 sm:px-5 py-1.5 rounded-xl shadow-md flex items-center space-x-1.5 transition-transform active:scale-95"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>智能理牌</span>
          </button>
        </div>
      </div>

      {/* Analysis Result */}
      {analysisResult && (
        <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>结构评估 (共识别 {parsedCards.length} 张牌)</span>
            </h3>
            <span className="text-[11px] bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              推荐方案：{analysisResult.best.name}
            </span>
          </div>

          {/* Rationale */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed flex items-start space-x-2">
            <Lightbulb className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <div>{analysisResult.explanation}</div>
          </div>

          {/* Hand Groups Render */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400">最佳牌型分组拆解：</span>
            <div className="flex flex-wrap gap-2">
              {analysisResult.best.groups.map((group, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 flex flex-col items-center space-y-1"
                >
                  <span className="text-[10px] font-bold text-amber-400">{group.label || group.category}</span>
                  <div className="flex -space-x-4">
                    {group.cards.map((c) => (
                      <PlayingCard key={c.id} card={c} levelRank={levelRank} size="sm" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">持有炸弹</span>
              <span className="font-extrabold text-amber-400 text-sm sm:text-base">
                {analysisResult.best.details.bombCount} 个
              </span>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">死牌单张 (&lt;J)</span>
              <span className="font-extrabold text-rose-400 text-sm sm:text-base">
                {analysisResult.best.details.deadCardCount} 张
              </span>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">手牌流畅评分</span>
              <span className="font-extrabold text-emerald-400 text-sm sm:text-base">
                {analysisResult.best.score} 分
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
