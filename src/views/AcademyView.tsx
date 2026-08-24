import React, { useState } from 'react';
import { Card, LevelRank } from '../core/types';
import { classify, describeCombo } from '../core/combos';
import { PlayingCard } from '../components/Card/PlayingCard';
import { BookOpen, Sparkles, Calendar, CheckSquare, MessageSquareCode, ShieldCheck, HelpCircle, Copy, Check } from 'lucide-react';

export const AcademyView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'checklist' | 'prompts' | 'rules' | 'wildcard' | 'tribute' | 'sandbox'>('roadmap');
  const [sandboxLevel, setSandboxLevel] = useState<LevelRank>('2');
  const [sandboxSelected, setSandboxSelected] = useState<Card[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Demo cards for Sandbox
  const samplePalette: Card[] = [
    { id: 'sb_1', suit: 'H', rank: '2' }, // Wildcard
    { id: 'sb_2', suit: 'S', rank: '3' },
    { id: 'sb_3', suit: 'H', rank: '3' },
    { id: 'sb_4', suit: 'C', rank: '3' },
    { id: 'sb_5', suit: 'S', rank: '4' },
    { id: 'sb_6', suit: 'H', rank: '4' },
    { id: 'sb_7', suit: 'C', rank: '4' },
    { id: 'sb_8', suit: 'S', rank: '5' },
    { id: 'sb_9', suit: 'S', rank: '6' },
    { id: 'sb_10', suit: 'S', rank: '7' },
    { id: 'sb_11', suit: 'S', rank: 'SJ' },
    { id: 'sb_12', suit: 'H', rank: 'BJ' },
  ];

  const handleToggleSandboxCard = (card: Card) => {
    setSandboxSelected((prev) => {
      const exists = prev.some((c) => c.id === card.id);
      if (exists) return prev.filter((c) => c.id !== card.id);
      return [...prev, card];
    });
  };

  const handleCopyPrompt = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const classifiedCombo = classify(sandboxSelected, sandboxLevel);

  return (
    <div className="h-full w-full overflow-y-auto pr-1 space-y-3 sm:space-y-4 max-w-5xl mx-auto">
      {/* Academy Header */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-extrabold text-xs mb-0.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>掼蛋新手 × AI 智能体 · 开锋课 (Michael HUO)</span>
          </div>
          <h1 className="text-lg sm:text-xl font-black text-white">从零单排到小有所成 · 新手加速营</h1>
          <p className="text-xs text-slate-300">
            “人负责判断与担当；AI 负责解释、记忆辅助、出题与复盘”。7天可执行上场路径。
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap bg-slate-800/80 p-1 rounded-xl border border-slate-700 gap-0.5">
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              activeTab === 'roadmap' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Calendar className="w-3 h-3" />
            <span>7天路径</span>
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              activeTab === 'checklist' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <CheckSquare className="w-3 h-3" />
            <span>10秒Checklist</span>
          </button>

          <button
            onClick={() => setActiveTab('prompts')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              activeTab === 'prompts' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <MessageSquareCode className="w-3 h-3" />
            <span>AI提示词</span>
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'rules' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            牌型大全
          </button>

          <button
            onClick={() => setActiveTab('wildcard')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'wildcard' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            逢人配
          </button>

          <button
            onClick={() => setActiveTab('tribute')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'tribute' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            进贡与升级
          </button>

          <button
            onClick={() => setActiveTab('sandbox')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'sandbox' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            🧪 验牌沙盒
          </button>
        </div>
      </div>

      {/* Tab 0: 7-Day Roadmap (7天从零到能上场) */}
      {activeTab === 'roadmap' && (
        <div className="space-y-3">
          {/* Core Philosophy Banner */}
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-3.5 sm:p-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-400">💡 新手 × AI 总公式</span>
              <p className="text-xs sm:text-sm text-slate-100 font-extrabold leading-relaxed">
                人负责判断与担当；AI 负责解释、记忆辅助、出题与复盘。
              </p>
              <div className="text-[11px] text-slate-400">
                AI 不是代打外挂，不替你看对门眼神、不替你承担配合责任。尊重牌德，享受博弈。
              </div>
            </div>
            <div className="bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-xl px-3 py-1.5 text-xs font-bold shrink-0">
              目标: 敢坐上桌 · 7天能上场
            </div>
          </div>

          {/* 3 Phases Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Phase 1 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-2 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">阶段一</span>
                <span className="text-[11px] text-slate-400 font-semibold">Day 1 – 2</span>
              </div>
              <h3 className="text-sm font-extrabold text-white">没入门：敢开第一局</h3>
              <p className="text-[11px] text-slate-300">懂规则语言，掌握最少要懂的 5 件事与牌型大小。</p>
              <div className="bg-slate-950 p-2 rounded-xl text-[11px] text-emerald-400 space-y-0.5 border border-slate-800">
                <div className="font-bold text-slate-300">AI 怎么帮：</div>
                <div>• 规则问答与概念翻译</div>
                <div>• 牌型举例（钢板 vs 连对）</div>
                <div>• 每天15分钟只问规则</div>
              </div>
            </div>

            {/* Phase 2 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-2 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">阶段二</span>
                <span className="text-[11px] text-slate-400 font-semibold">Day 3 – 4</span>
              </div>
              <h3 className="text-sm font-extrabold text-white">入门：能理牌少犯错</h3>
              <p className="text-[11px] text-slate-300">27张理牌清单，抓准王牌/级牌/报牌核心关键。</p>
              <div className="bg-slate-950 p-2 rounded-xl text-[11px] text-emerald-400 space-y-0.5 border border-slate-800">
                <div className="font-bold text-slate-300">AI 怎么帮：</div>
                <div>• 理牌方案（保炸 vs 去单）</div>
                <div>• 五十定律顺子空间推演</div>
                <div>• 出牌前10秒检查清单</div>
              </div>
            </div>

            {/* Phase 3 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-2 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded">阶段三</span>
                <span className="text-[11px] text-slate-400 font-semibold">Day 5 – 7</span>
              </div>
              <h3 className="text-sm font-extrabold text-white">小有所成：能配合能复盘</h3>
              <p className="text-[11px] text-slate-300">能稳定上场，形成局后复盘闭环，建立牌感。</p>
              <div className="bg-slate-950 p-2 rounded-xl text-[11px] text-emerald-400 space-y-0.5 border border-slate-800">
                <div className="font-bold text-slate-300">AI 怎么帮：</div>
                <div>• 局后配合失误点分析</div>
                <div>• 给出 2 种稳妥思路对比</div>
                <div>• 经典残局针对性专项练</div>
              </div>
            </div>
          </div>

          {/* 7-Day Day-by-Day Schedule */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>7 天可执行学习清单 (Day 1 - Day 7)</span>
            </h3>

            <div className="space-y-2 text-xs divide-y divide-slate-800/80">
              <div className="pt-2 flex items-start gap-2.5">
                <span className="bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded text-[11px] shrink-0">Day 1-2</span>
                <div className="text-slate-300">
                  <strong className="text-white block">极简规则地图 + 牌型辨析</strong>
                  掌握最少懂的5件事（4人两队、争头游升级、红桃逢人配、牌型大小、算分）。使用验牌沙盒练习牌型组合。
                </div>
              </div>

              <div className="pt-2 flex items-start gap-2.5">
                <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded text-[11px] shrink-0">Day 3-4</span>
                <div className="text-slate-300">
                  <strong className="text-white block">27张理牌清单 + 核心记牌</strong>
                  练习手牌智能诊断（保炸优先 vs 去单化）；记牌只抓4王、级牌、报牌与五十定律。
                </div>
              </div>

              <div className="pt-2 flex items-start gap-2.5">
                <span className="bg-sky-500/20 text-sky-300 font-bold px-2 py-0.5 rounded text-[11px] shrink-0">Day 5</span>
                <div className="text-slate-300">
                  <strong className="text-white block">实战对弈 2 局：只练「少犯低级错误」</strong>
                  在对战中实践「顺应搭档」与「弱路先行」，严格执行出牌前 10 秒检查。
                </div>
              </div>

              <div className="pt-2 flex items-start gap-2.5">
                <span className="bg-purple-500/20 text-purple-300 font-bold px-2 py-0.5 rounded text-[11px] shrink-0">Day 6</span>
                <div className="text-slate-300">
                  <strong className="text-white block">局后复盘闭环</strong>
                  记录 2 次最纠结的出牌与配合失误点，使用复盘提示词进行反思，刷 3 道残局闯关题。
                </div>
              </div>

              <div className="pt-2 flex items-start gap-2.5">
                <span className="bg-rose-500/20 text-rose-300 font-bold px-2 py-0.5 rounded text-[11px] shrink-0">Day 7</span>
                <div className="text-slate-300">
                  <strong className="text-white block">固化 5 条检查清单 · 信心上场</strong>
                  整理属于自己的实战 Checklist，达到能稳定上场、能配合搭档的合格牌友水平！
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: 10-Second Checklist (出牌前10秒检查清单) */}
      {activeTab === 'checklist' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>实战避坑 · 出牌前 10 秒黄金检查清单</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white mt-0.5">
                每次出牌前，心中默念这 5 句话：
              </h2>
            </div>
            <span className="text-[11px] bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full font-bold border border-emerald-500/30">
              新手保命神符
            </span>
          </div>

          <div className="space-y-3">
            {/* Rule 1 */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                1
              </div>
              <div className="space-y-0.5 text-xs">
                <h4 className="font-extrabold text-white text-sm">这手出完，对门（搭档）会不会被我关死？</h4>
                <p className="text-slate-300">
                  搭档领牌顺风时不随意超车压牌；不要用大牌把搭档顺畅的牌路切断。
                </p>
                <div className="text-amber-400/90 text-[11px] font-semibold italic">
                  牌理：顺搭档之势，借对家之力；搭档主攻我助攻。
                </div>
              </div>
            </div>

            {/* Rule 2 */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                2
              </div>
              <div className="space-y-0.5 text-xs">
                <h4 className="font-extrabold text-white text-sm">是否「谁打谁收」——我能否自己接回？</h4>
                <p className="text-slate-300">
                  出了一张小牌或试探牌，手中是否有足够大的绝对回手牌（如大王、级牌、炸弹）保证能够收回发牌权。
                </p>
                <div className="text-amber-400/90 text-[11px] font-semibold italic">
                  牌理：发牌要有回收路，无回收牌莫盲目放权。
                </div>
              </div>
            </div>

            {/* Rule 3 */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                3
              </div>
              <div className="space-y-0.5 text-xs">
                <h4 className="font-extrabold text-white text-sm">小牌 / 弱单是否该先处理？</h4>
                <p className="text-slate-300">
                  开局或拿到主动权时，遵循【弱路先行】，尽早把手中难以脱手的小单张、杂牌清掉，把大牌留在中残局当安全保障。
                </p>
                <div className="text-amber-400/90 text-[11px] font-semibold italic">
                  牌理：弱路先行，强牌断后；手数要少，控制要牢。
                </div>
              </div>
            </div>

            {/* Rule 4 */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                4
              </div>
              <div className="space-y-0.5 text-xs">
                <h4 className="font-extrabold text-white text-sm">炸弹是现在抢权还是留残局？</h4>
                <p className="text-slate-300">
                  炸之前先想好：炸完之后我领出什么？能不能走顺或把牌权交给搭档？切忌“见大就炸，炸完无路”。
                </p>
                <div className="text-amber-400/90 text-[11px] font-semibold italic">
                  牌理：炸前先算炸后路，无路开炸是盲目。
                </div>
              </div>
            </div>

            {/* Rule 5 */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                5
              </div>
              <div className="space-y-0.5 text-xs">
                <h4 className="font-extrabold text-white text-sm">对手剩张数是否到了「逼炸 / 冲刺」窗口？</h4>
                <p className="text-slate-300">
                  时刻观察对手剩余张数：下家报1必封单打对，报2出单或三带二，报5谨防顺子与炸弹突围冲头游。
                </p>
                <div className="text-amber-400/90 text-[11px] font-semibold italic">
                  牌理：下家报一不出单，报二不发对；临门一脚，堵其通路。
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: AI Prompt Templates (AI提示词宝库) */}
      {activeTab === 'prompts' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-2">
            <h2 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
              <MessageSquareCode className="w-4 h-4 text-amber-400" />
              <span>给 ChatGPT / Claude / Kimi / DeepSeek 的掼蛋提示词模板</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              点击右上角即可一键复制，随时向任何大模型询问规则、理牌与局后复盘！
            </p>
          </div>

          <div className="space-y-3">
            {/* Prompt 1 */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400">模板 1：零基础规则与术语翻译</span>
                <button
                  onClick={() =>
                    handleCopyPrompt(
                      '用零基础能懂的话解释掼蛋：人数、对门、级牌、逢人配、头游二游。请重点对比：三带二和钢板有什么区别？各举2个例子。为什么不能三带一？同花顺和五张炸弹谁大？',
                      1
                    )
                  }
                  className="text-slate-400 hover:text-white text-xs flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded"
                >
                  {copiedIndex === 1 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedIndex === 1 ? '已复制' : '复制提示词'}</span>
                </button>
              </div>
              <pre className="text-xs text-slate-300 bg-slate-900 p-2.5 rounded-lg whitespace-pre-wrap font-mono">
                用零基础能懂的话解释掼蛋：人数、对门、级牌、逢人配、头游二游。请重点对比：三带二和钢板有什么区别？各举2个例子。为什么不能三带一？同花顺和五张炸弹谁大？
              </pre>
            </div>

            {/* Prompt 2 */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400">模板 2：27张手牌智能理牌助手</span>
                <button
                  onClick={() =>
                    handleCopyPrompt(
                      '我这手牌大概有：红桃2(打2逢人配)、黑桃34567、对8、三个9、4个K、单张大王。请按：炸弹 / 逢人配最佳用法 / 顺子与钢板 / 对子 / 弱单张 帮我分类规划，并标出最少手数和可能的回手牌。',
                      2
                    )
                  }
                  className="text-slate-400 hover:text-white text-xs flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded"
                >
                  {copiedIndex === 2 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedIndex === 2 ? '已复制' : '复制提示词'}</span>
                </button>
              </div>
              <pre className="text-xs text-slate-300 bg-slate-900 p-2.5 rounded-lg whitespace-pre-wrap font-mono">
                我这手牌大概有：[在此输入你的牌，如：红桃2(打2逢人配)、黑桃34567、对8、三个9、4个K、单张大王]。请按：炸弹 / 逢人配最佳用法 / 顺子与钢板 / 对子 / 弱单张 帮我分类规划，并标出最少手数和可能的回手牌。
              </pre>
            </div>

            {/* Prompt 3 */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400">模板 3：局后战术复盘与反思闭环</span>
                <button
                  onClick={() =>
                    handleCopyPrompt(
                      '我是掼蛋初学者，刚打完一局：当前打7，对方头游，我方升了0级。我最纠结的是第5手牌：对门出对Q领先，我手上有对K，我选择压了对K导致对门牌权被切断。请你：1. 指出我打法的逻辑问题；2. 给出2种更稳妥的思路对比；3. 结合出牌前检查清单帮我总结教训。',
                      3
                    )
                  }
                  className="text-slate-400 hover:text-white text-xs flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded"
                >
                  {copiedIndex === 3 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedIndex === 3 ? '已复制' : '复制提示词'}</span>
                </button>
              </div>
              <pre className="text-xs text-slate-300 bg-slate-900 p-2.5 rounded-lg whitespace-pre-wrap font-mono">
                我是掼蛋初学者，刚打完一局：当前打[7]，[对方]头游，我方升了[0]级。我最纠结的是第[5]手牌：[对门出对Q领先，我手上有对K，我选择压了对K导致对门牌权被切断]。请你：1. 指出我打法的逻辑问题；2. 给出2种更稳妥的思路对比；3. 结合出牌前检查清单帮我总结教训。
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Card Combos */}
      {activeTab === 'rules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5 shadow-xl">
            <h3 className="text-sm font-extrabold text-amber-400">基础单张与组合牌型</h3>
            <div className="space-y-2 text-xs text-slate-300 divide-y divide-slate-800">
              <div className="pt-1.5">
                <span className="font-bold text-white block">1. 单张 (Single)</span>
                大王 &gt; 小王 &gt; 级牌 &gt; A &gt; K &gt; Q &gt; J &gt; 10 &gt; 9 &gt; 8 &gt; 7 &gt; 6 &gt; 5 &gt; 4 &gt; 3 &gt; 2。
              </div>
              <div className="pt-1.5">
                <span className="font-bold text-white block">2. 对子 (Pair)</span>
                两张点数相同的牌（如 8♠8♥）。
              </div>
              <div className="pt-1.5">
                <span className="font-bold text-white block">3. 三同张 (Triple)</span>
                三张点数相同的牌（如 9♠9♥9♣）。
              </div>
              <div className="pt-1.5">
                <span className="font-bold text-white block">4. 三带二 (Triple + Pair)</span>
                三同张 + 一对子（如 888 + 33）。注意：掼蛋<strong>不可三带一</strong>！
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5 shadow-xl">
            <h3 className="text-sm font-extrabold text-emerald-400">连牌与进阶牌型</h3>
            <div className="space-y-2 text-xs text-slate-300 divide-y divide-slate-800">
              <div className="pt-1.5">
                <span className="font-bold text-white block">5. 顺子 (Straight)</span>
                任意花色的连续五张牌（如 3-4-5-6-7）。掼蛋顺子<strong>必须恰好5张</strong>！
              </div>
              <div className="pt-1.5">
                <span className="font-bold text-white block">6. 钢板 (Steel Plate)</span>
                连续两个三同张，共6张（如 333444）。
              </div>
              <div className="pt-1.5">
                <span className="font-bold text-white block">7. 三连对 (Three Consecutive Pairs)</span>
                连续三个对子，共6张（如 334455）。
              </div>
            </div>
          </div>

          <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5 shadow-xl">
            <h3 className="text-sm font-extrabold text-rose-400">炸弹级别与天梯排序 (Bomb Hierarchy)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-300">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="font-bold text-amber-400 block mb-0.5">普通四/五张炸弹</span>
                4张或5张相同点数（4-bomb &lt; 5-bomb）。
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-emerald-500/40">
                <span className="font-bold text-emerald-400 block mb-0.5">同花顺炸弹 (Straight Flush)</span>
                同一花色的5张连续牌。<strong>同花顺 &gt; 5张炸弹，且 &lt; 6张炸弹</strong>！
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-rose-500/40">
                <span className="font-bold text-rose-400 block mb-0.5">6-8张炸弹 & 天王炸</span>
                6张炸 &lt; 7张炸 &lt; 8张炸 &lt; <strong>天王炸（4张王牌，掼蛋最大牌）</strong>。
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Wildcard */}
      {activeTab === 'wildcard' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xl">
          <div className="flex items-center space-x-2 text-amber-400 font-extrabold">
            <Sparkles className="w-4 h-4" />
            <h2 className="text-base text-white">逢人配（红桃级牌）的百变神效</h2>
          </div>

          <div className="text-xs text-slate-300 leading-relaxed space-y-2.5">
            <p>
              在掼蛋中，当前打几，<strong>红桃对应的两张牌</strong>就是万能牌，俗称<strong>“逢人配”</strong>。
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <h4 className="font-bold text-emerald-400 text-xs">✅ 逢人配可以配什么？</h4>
                <ul className="list-disc list-inside text-[11px] space-y-1 text-slate-300">
                  <li>配单张形成对子、配对子形成三张。</li>
                  <li>补齐顺子中缺少的中间张或两头（如 3-4-配-6-7）。</li>
                  <li>配同花色组成超强<strong>同花顺炸弹</strong>。</li>
                  <li>与3张相同牌组成<strong>4张炸弹</strong>，与4张组成<strong>5张炸弹</strong>。</li>
                </ul>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <h4 className="font-bold text-rose-400 text-xs">❌ 逢人配的禁忌规则</h4>
                <ul className="list-disc list-inside text-[11px] space-y-1 text-slate-300">
                  <li>逢人配<strong>不可与大小王配成天王炸</strong>（天王炸必须是纯4张王牌）。</li>
                  <li>逢人配单出时，仅代表本局级牌点数。</li>
                  <li>尽量不要将逢人配浪费在普通单张或小对子上！</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Tribute */}
      {activeTab === 'tribute' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xl">
          <h2 className="text-base font-extrabold text-white">进贡、抗贡与升级机制</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <h4 className="font-bold text-amber-400 text-xs">进贡规则 (Tribute)</h4>
              <p>输家必须向赢家进贡手中<strong>除红桃逢人配以外的最大单张牌</strong>（以大王、小王为最高）。</p>
              <p>• <strong>双下</strong>：三游、末游分别向头游、二游进贡2张最大牌，赢家还贡任意小于或等于10的牌。</p>
              <p>• <strong>单下</strong>：末游向头游进贡1张最大牌。</p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <h4 className="font-bold text-emerald-400 text-xs">抗贡规则 (Anti-Tribute)</h4>
              <p>若进贡方<strong>一人独得两张大王</strong>（双大王），或双下方两人各持一张大王，则触发<strong>抗贡</strong>，无需进贡，直接由末游先出牌！</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Interactive Sandbox */}
      {activeTab === 'sandbox' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-white">🧪 掼蛋牌型即时验算沙盒</h2>
              <p className="text-[11px] text-slate-400">点击下方牌面自由组合，系统实时计算其合法牌型！</p>
            </div>
            <div className="flex items-center space-x-1.5 text-xs">
              <span className="text-slate-400">级牌：</span>
              <select
                value={sandboxLevel}
                onChange={(e) => setSandboxLevel(e.target.value as LevelRank)}
                className="bg-slate-800 border border-slate-700 text-amber-400 font-bold px-2 py-0.5 rounded-lg text-xs"
              >
                {['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'].map((r) => (
                  <option key={r} value={r}>
                    打 {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Palette */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 mb-1.5 font-bold">测试样本牌库 (点击选牌)：</div>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {samplePalette.map((card) => {
                const isSelected = sandboxSelected.some((c) => c.id === card.id);
                return (
                  <PlayingCard
                    key={card.id}
                    card={card}
                    levelRank={sandboxLevel}
                    isSelected={isSelected}
                    onClick={() => handleToggleSandboxCard(card)}
                    size="md"
                  />
                );
              })}
            </div>
          </div>

          {/* Sandbox Result Output */}
          <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-xl p-3 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block">判定结果：</span>
              <div className="text-xs sm:text-sm font-extrabold text-amber-400 mt-0.5">
                {sandboxSelected.length === 0
                  ? '请点击上方卡牌开始验牌'
                  : classifiedCombo
                  ? `✅ 构成合法牌型：【${describeCombo(classifiedCombo)}】`
                  : '❌ 不构成任何有效掼蛋牌型'}
              </div>
            </div>

            {sandboxSelected.length > 0 && (
              <button
                onClick={() => setSandboxSelected([])}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] px-2.5 py-1 rounded-lg"
              >
                清空
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
