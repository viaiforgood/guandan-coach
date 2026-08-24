import React, { useState } from 'react';
import { PUZZLES } from '../core/puzzles';
import { PuzzleScenario } from '../core/types';
import { PlayingCard } from '../components/Card/PlayingCard';
import { describeCombo } from '../core/combos';
import { PRINCIPLES } from '../core/knowledge';
import { Trophy, Award, CheckCircle, XCircle, Lightbulb, ChevronRight, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const PuzzleView: React.FC = () => {
  const [selectedPuzzleId, setSelectedPuzzleId] = useState<string>(PUZZLES[0].id);
  const [selectedCardIds, setSelectedCardIds] = useState<Set<string>>(new Set());
  const [resultStatus, setResultStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showHint, setShowHint] = useState<boolean>(false);

  const activePuzzle = PUZZLES.find((p) => p.id === selectedPuzzleId) || PUZZLES[0];
  const principle = PRINCIPLES[activePuzzle.principleCitation];

  const handleToggleCard = (cardId: string) => {
    setSelectedCardIds((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) next.delete(cardId);
      else next.add(cardId);
      return next;
    });
  };

  const handleCheckAnswer = (action: 'play' | 'pass') => {
    const isActionMatch = action === activePuzzle.optimalMove.action;
    let isCardsMatch = true;

    if (action === 'play') {
      const optimalIds = new Set(activePuzzle.optimalMove.cardIds || []);
      isCardsMatch =
        selectedCardIds.size === optimalIds.size &&
        [...selectedCardIds].every((id) => optimalIds.has(id));
    }

    if (isActionMatch && isCardsMatch) {
      setResultStatus('correct');
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } else {
      setResultStatus('wrong');
    }
  };

  const handleResetPuzzle = () => {
    setSelectedCardIds(new Set());
    setResultStatus('idle');
    setShowHint(false);
  };

  const handleSelectPuzzle = (puzzle: PuzzleScenario) => {
    setSelectedPuzzleId(puzzle.id);
    setSelectedCardIds(new Set());
    setResultStatus('idle');
    setShowHint(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 font-extrabold text-sm mb-1">
            <Trophy className="w-4 h-4" />
            <span>掼蛋大师残局闯关与牌理题库</span>
          </div>
          <h1 className="text-2xl font-black text-white">残局演练与战术考题</h1>
          <p className="text-sm text-slate-300 mt-1">
            精选报1/报2防守、五十定律算牌、逢人配组合及搭档接应经典残局，建立顶尖高手直觉。
          </p>
        </div>

        {/* Puzzle Selector Pills */}
        <div className="flex flex-wrap gap-1.5 max-w-md">
          {PUZZLES.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => handleSelectPuzzle(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedPuzzleId === p.id
                  ? 'bg-amber-500 text-slate-950 shadow-lg scale-105'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              第 {idx + 1} 题：{p.title.split('：')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Puzzle Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Question Board */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            {/* Title & Difficulty Badge */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                  {activePuzzle.category}
                </span>
                <h2 className="text-xl font-black text-white mt-0.5">{activePuzzle.title}</h2>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-extrabold ${
                    activePuzzle.difficulty === '入门'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : activePuzzle.difficulty === '进阶'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {activePuzzle.difficulty}
                </span>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded-full font-bold">
                  当前打【{activePuzzle.levelRank}】
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              {activePuzzle.description}
            </p>

            {/* Opponents Status Bar */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[11px]">右家 (下家)</span>
                <span
                  className={`font-black text-sm ${
                    activePuzzle.seatCounts[1] <= 2 ? 'text-rose-400 animate-pulse' : 'text-slate-200'
                  }`}
                >
                  剩 {activePuzzle.seatCounts[1]} 张 {activePuzzle.seatCounts[1] === 1 && '(报一)'}
                </span>
              </div>
              <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[11px]">对家 (搭档)</span>
                <span className="font-black text-sm text-emerald-400">
                  剩 {activePuzzle.seatCounts[2]} 张
                </span>
              </div>
              <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[11px]">左家 (上家)</span>
                <span className="font-black text-sm text-slate-200">
                  剩 {activePuzzle.seatCounts[3]} 张
                </span>
              </div>
            </div>

            {/* Current Table Trick */}
            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-3 text-center">
              <span className="text-xs text-slate-400">当前墩局面：</span>
              <div className="text-sm font-extrabold text-amber-400 mt-0.5">
                {activePuzzle.currentCombo ? (
                  <span>
                    需压过上家出牌：{describeCombo(activePuzzle.currentCombo)}
                  </span>
                ) : (
                  <span>新一墩，由你首发领牌！</span>
                )}
              </div>
            </div>

            {/* Interactive Player Hand */}
            <div>
              <div className="text-xs font-bold text-slate-400 mb-2 flex items-center justify-between">
                <span>你的手牌 (点击选择出牌)：</span>
                <span className="text-amber-400">已选 {selectedCardIds.size} 张</span>
              </div>

              <div className="flex flex-wrap gap-2 justify-center bg-slate-950/60 p-4 rounded-xl border border-slate-800 min-h-[100px]">
                {activePuzzle.userHand.map((card) => (
                  <PlayingCard
                    key={card.id}
                    card={card}
                    levelRank={activePuzzle.levelRank}
                    isSelected={selectedCardIds.has(card.id)}
                    onClick={() => handleToggleCard(card.id)}
                    size="md"
                  />
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs px-3 py-2 rounded-xl font-bold flex items-center space-x-1"
                >
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>{showHint ? '隐藏提示' : '牌理提示'}</span>
                </button>

                <button
                  onClick={handleResetPuzzle}
                  className="text-slate-400 hover:text-white p-2 text-xs flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>重置</span>
                </button>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleCheckAnswer('pass')}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm px-4 py-2 rounded-xl"
                >
                  选择过牌
                </button>

                <button
                  onClick={() => handleCheckAnswer('play')}
                  disabled={selectedCardIds.size === 0}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-slate-950 font-black text-xs sm:text-sm px-6 py-2 rounded-xl shadow-lg disabled:opacity-40"
                >
                  确定出牌
                </button>
              </div>
            </div>

            {/* Hint Drawer */}
            {showHint && principle && (
              <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-3.5 text-xs text-amber-200 animate-fade-in">
                <div className="font-bold flex items-center gap-1 text-amber-400 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>核心牌理线索：{principle.name}</span>
                </div>
                <p>{principle.text}</p>
                <div className="text-[11px] text-amber-300/80 mt-1 italic">{principle.quote}</div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Analysis & Feedback Panel */}
        <div className="space-y-4">
          {/* Result Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>教练推演与解题报告</span>
            </h3>

            {resultStatus === 'idle' && (
              <div className="text-xs text-slate-400 py-6 text-center">
                请仔细观察场上报牌人数、手牌结构与回手牌，做出你的出牌选择。
              </div>
            )}

            {resultStatus === 'correct' && (
              <div className="space-y-3 animate-fade-in">
                <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-xl p-3.5 text-emerald-300 text-xs flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-sm text-emerald-400 font-black">
                      🎉 精彩绝伦！完全命中最佳打法！
                    </strong>
                    <div className="mt-1 text-slate-200 leading-relaxed">
                      {activePuzzle.explanation}
                    </div>
                  </div>
                </div>

                {principle && (
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                    <span className="font-bold text-amber-400">💡 牌理归纳 ({principle.level})：</span>
                    <p className="text-slate-300 mt-1">{principle.quote}</p>
                  </div>
                )}
              </div>
            )}

            {resultStatus === 'wrong' && (
              <div className="space-y-3 animate-fade-in">
                <div className="bg-rose-500/20 border border-rose-500/40 rounded-xl p-3.5 text-rose-300 text-xs flex items-start space-x-2">
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-sm text-rose-400 font-black">
                      打法欠妥，容易给对手留出通路！
                    </strong>
                    <div className="mt-1 text-slate-200 leading-relaxed">
                      请重新思考：下家报牌情况、出单/出对风险以及回手牌的保留。
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleResetPuzzle}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded-xl text-xs"
                >
                  再试一次
                </button>
              </div>
            )}
          </div>

          {/* Quick Principle Encyclopedia */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-300">掼蛋八字方针与秘诀：</h4>
            <div className="text-xs text-slate-400 space-y-1.5 leading-relaxed">
              <p>• <strong>定位</strong>：认清自己本局是主攻还是助攻。</p>
              <p>• <strong>沟通</strong>：通过出牌大小与牌型向搭档传递牌力信号。</p>
              <p>• <strong>配合</strong>：搭档顺则不争，搭档弱则接风，助对家冲头游。</p>
              <p>• <strong>记算</strong>：死守五十定律，算清王牌、级牌与炸弹分布。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
