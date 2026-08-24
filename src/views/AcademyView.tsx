import React, { useState } from 'react';
import { Card, LevelRank } from '../core/types';
import { classify, describeCombo } from '../core/combos';
import { PlayingCard } from '../components/Card/PlayingCard';
import { BookOpen, Sparkles } from 'lucide-react';

export const AcademyView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rules' | 'wildcard' | 'tribute' | 'sandbox'>('rules');
  const [sandboxLevel, setSandboxLevel] = useState<LevelRank>('2');
  const [sandboxSelected, setSandboxSelected] = useState<Card[]>([]);

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

  const classifiedCombo = classify(sandboxSelected, sandboxLevel);

  return (
    <div className="h-full w-full overflow-y-auto pr-1 space-y-3 sm:space-y-4 max-w-5xl mx-auto">
      {/* Academy Header */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-extrabold text-xs mb-0.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>掼蛋新手学院与规则通识</span>
          </div>
          <h1 className="text-lg sm:text-xl font-black text-white">从零单排到掼蛋大师</h1>
          <p className="text-xs text-slate-300">
            掌握掼蛋牌型结构、逢人配万能牌、进贡抗贡机制与升级算分法则。
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700">
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
            进贡升级
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

      {/* Tab 1: Card Combos */}
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
                三同张 + 一对子（如 888 + 33）。
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

      {/* Tab 2: Wildcard */}
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

      {/* Tab 3: Tribute */}
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

      {/* Tab 4: Interactive Sandbox */}
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
