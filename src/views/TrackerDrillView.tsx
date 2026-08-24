import React, { useState } from 'react';
import { Eye, Sparkles, CheckCircle2, XCircle, RotateCcw, Brain } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DrillQuestion {
  id: string;
  scenario: string;
  playedSummary: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const DRILLS: DrillQuestion[] = [
  {
    id: 'd1',
    scenario: '当前打2。前4墩出牌记录中：右家出过一组单张5，左家出过一对5，自己手里有3张5。',
    playedSummary: '场上已见：右家1张5 + 左家2张5 + 自己3张5 = 共6张5',
    question: '根据两副牌总共8张5的规则，场上其他三家未出的牌里还剩几张5？对手还能组成以5为核心的顺子吗？',
    options: [
      '还剩2张5，对手仍有可能组成低位顺子',
      '还剩0张5，外部绝无顺子可能',
      '还剩4张5，顺子概率极高',
      '还剩1张5，对手必定有同花顺',
    ],
    correctIndex: 0,
    explanation: '总共8张5，已见6张（1+2+3），故场上外部仅余2张5。虽然数量极少，但对手仍有组合单组顺子的潜在可能性，不可完全放松对顺子的警惕。',
  },
  {
    id: 'd2',
    scenario: '当前打10。全场统计发现：8张“5”全部已出完，而8张“10”也全部出完或在已知手牌中。',
    playedSummary: '5已见 8/8 张，10已见 8/8 张',
    question: '此时对手领出一手单张6，根据“五十定律”，你对对手牌型结构的最关键推断是什么？',
    options: [
      '对手手中必定藏有5张顺子准备偷跑',
      '全场外部绝对不可能有任何5张顺子，对手只是在出弱单试探',
      '对手手里必定有天王炸',
      '对手即将走同花顺',
    ],
    correctIndex: 1,
    explanation: '任何5张顺子（从A-2-3-4-5到10-J-Q-K-A）都必须经过5或10！当5和10全部绝迹时，全场顺子空间归零，可彻底排除顺子威胁，放心打单张或对子！',
  },
  {
    id: 'd3',
    scenario: '当前残局阶段，两张大王中有一张由对家打出，另一张由上家打出。两张小王均未露面。',
    playedSummary: '大王：已出2/2张；小王：已出0/2张',
    question: '此时我方手中拥有最大单张A，我方在单张上的控制力如何？',
    options: [
      'A已是场上最大单张，所向披靡',
      '场上仍有2张小王未出，A遇到小王仍会被压制',
      '场上可能存在天王炸',
      '对家一定持有2张小王',
    ],
    correctIndex: 1,
    explanation: '虽然大王已全部出尽，但两张小王仍隐蔽在暗处，单张A并非绝对登基牌（还要谨防小王单张拦截）。',
  },
];

export const TrackerDrillView: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  const activeDrill = DRILLS[currentIdx];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOpt(index);
    setIsAnswered(true);

    if (index === activeDrill.correctIndex) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  const handleNext = () => {
    setSelectedOpt(null);
    setIsAnswered(false);
    setCurrentIdx((prev) => (prev + 1) % DRILLS.length);
  };

  return (
    <div className="h-full w-full overflow-y-auto pr-1 space-y-3 sm:space-y-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-extrabold text-xs mb-0.5">
            <Brain className="w-3.5 h-3.5" />
            <span>五十定律与记牌算牌特训营</span>
          </div>
          <h1 className="text-lg sm:text-xl font-black text-white">算无遗策 · 记牌强化训练</h1>
          <p className="text-xs text-slate-300">
            “逢五必看，逢十必算，记清王牌，掌控全盘”。高强度实战算牌测验。
          </p>
        </div>

        <div className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full font-bold self-start sm:self-auto border border-slate-700">
          特训进度: {currentIdx + 1} / {DRILLS.length}
        </div>
      </div>

      {/* Drill Question Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        {/* Scenario */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wide">
            牌局场景推演
          </span>
          <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            {activeDrill.scenario}
          </p>
          <div className="text-[11px] text-emerald-400 bg-emerald-950/30 p-2 rounded-lg border border-emerald-500/30 font-semibold">
            📊 记牌器数据：{activeDrill.playedSummary}
          </div>
        </div>

        {/* Question Title */}
        <h3 className="text-sm sm:text-base font-extrabold text-white pt-1">{activeDrill.question}</h3>

        {/* Options */}
        <div className="space-y-2">
          {activeDrill.options.map((opt, oIdx) => {
            const isChosen = selectedOpt === oIdx;
            const isCorrect = oIdx === activeDrill.correctIndex;

            let btnStyle = 'bg-slate-950/80 hover:bg-slate-800 border-slate-800 text-slate-200';
            if (isAnswered) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
              } else if (isChosen) {
                btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300';
              }
            }

            return (
              <button
                key={oIdx}
                onClick={() => handleSelectOption(oIdx)}
                className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
              >
                <span>{opt}</span>
                {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />}
                {isAnswered && isChosen && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>

        {/* Explanation Card */}
        {isAnswered && (
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-1.5 animate-fade-in">
            <div className="font-extrabold text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>算牌与牌理解析：</span>
            </div>
            <p className="leading-relaxed text-[11px] sm:text-xs">{activeDrill.explanation}</p>

            <button
              onClick={handleNext}
              className="mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black px-4 py-1.5 rounded-xl text-xs shadow-md transition-transform active:scale-95"
            >
              下一题特训 &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
