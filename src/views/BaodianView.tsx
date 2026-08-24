import React, { useState } from 'react';
import { BAODIAN_RULES, BaodianRule, HUIJIE_INSIGHTS, HuijieInsight } from '../core/baodian';
import { useI18n } from '../core/i18n';
import {
  BookOpen,
  Search,
  Flame,
  Shield,
  Calculator,
  Users,
  Gift,
  Copy,
  Check,
  Image as ImageIcon,
  X,
  Sparkles,
  MessageSquareQuote,
  GraduationCap,
  HeartHandshake,
} from 'lucide-react';

export const BaodianView: React.FC = () => {
  const { t } = useI18n();
  const [mainTab, setMainTab] = useState<'rules' | 'huijie'>('rules');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [copiedHuijieId, setCopiedHuijieId] = useState<number | null>(null);
  const [activeImagePreview, setActiveImagePreview] = useState<{ url: string; title: string; source: string } | null>(null);

  const categories = [
    { id: 'all', label: '全部口诀 (18条)', icon: BookOpen },
    { id: 'endgame_counts', label: '残局张数精算', icon: Calculator },
    { id: 'bomb', label: '炸弹火药决策', icon: Flame },
    { id: 'blocking', label: '顺子轮次封堵', icon: Shield },
    { id: 'opening', label: '搭档与责任定位', icon: Users },
    { id: 'tribute', label: '进贡还贡心法', icon: Gift },
  ];

  const filteredRules = BAODIAN_RULES.filter((rule) => {
    const matchCategory = selectedCategory === 'all' || rule.category === selectedCategory;
    const matchQuery =
      searchQuery === '' ||
      rule.phrase.includes(searchQuery) ||
      rule.explanation.includes(searchQuery) ||
      rule.tacticalAction.includes(searchQuery);
    return matchCategory && matchQuery;
  });

  const handleCopyRule = (rule: BaodianRule) => {
    const text = `【广州市中山大学校友会 · 掼蛋宝典第${rule.id}条】${rule.phrase}\n💡 战术精解：${rule.explanation}\n🎯 实战动作：${rule.tacticalAction}\n⚠️ 禁忌误区：${rule.pitfall}\n🏛️ 来源致谢：广州市中山大学校友会\n👉 掼蛋大师教练 (https://guandan.weiai.ai)`;
    navigator.clipboard.writeText(text);
    setCopiedId(rule.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCopyHuijie = (item: HuijieInsight) => {
    const text = `【慧姐实战牌语心法 · ${item.title}】\n💬 语音实录：${item.quote}\n🎯 核心法则：${item.coreRule}\n💡 实战应用：${item.application}\n👩‍🏫 经验贡献：慧姐\n👉 掼蛋大师教练 (https://guandan.weiai.ai)`;
    navigator.clipboard.writeText(text);
    setCopiedHuijieId(item.id);
    setTimeout(() => setCopiedHuijieId(null), 2500);
  };

  return (
    <div className="h-full w-full flex flex-col gap-2.5 min-h-0 overflow-hidden text-slate-100 font-sans">
      {/* Top Banner with Explicit Credit Attribution */}
      <div className="shrink-0 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-amber-500 via-rose-500 to-sky-500 rounded-2xl flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 text-lg">
            📖
          </div>
          <div>
            <div className="flex items-center space-x-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-black text-white">掼蛋实战宝典库</h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/40 flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-emerald-400" />
                <span>广州市中山大学校友会 授权收录</span>
              </span>
              <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-bold border border-rose-500/40 flex items-center gap-1">
                <HeartHandshake className="w-3 h-3 text-rose-400" />
                <span>慧姐 牌语心法实录</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              致谢名宿与校友会传承：严谨传承中山大学校友会 18 条经典口诀，融合慧姐实战牌语传递洞察。
            </p>
          </div>
        </div>

        {/* Sub-Navigation Tabs: 18条经典口诀 vs 慧姐心法 */}
        <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setMainTab('rules')}
            className={`px-3 py-1 rounded-lg text-xs font-black flex items-center space-x-1.5 transition-all ${
              mainTab === 'rules'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>广州市中大校友会宝典</span>
          </button>

          <button
            onClick={() => setMainTab('huijie')}
            className={`px-3 py-1 rounded-lg text-xs font-black flex items-center space-x-1.5 transition-all ${
              mainTab === 'huijie'
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>慧姐实战牌语心法</span>
          </button>
        </div>
      </div>

      {/* Main Tab 1: 广州市中山大学校友会 18条经典实战口诀 */}
      {mainTab === 'rules' && (
        <div className="flex-1 min-h-0 flex flex-col gap-2.5 overflow-hidden">
          {/* Category Pills & Search Toolbar */}
          <div className="shrink-0 flex flex-col sm:flex-row items-center justify-between gap-2 bg-slate-950/80 p-2 rounded-xl border border-slate-800">
            {/* Category Pills */}
            <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-extrabold flex items-center space-x-1 whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Bar & Original Scanned Card Modal Trigger */}
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-56">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索中大校友会口诀..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                onClick={() =>
                  setActiveImagePreview({
                    url: '/assets/baodian/guandan_baodian_sysu.jpg',
                    title: '广州市中山大学校友会 · 掼蛋宝典印制原件',
                    source: '广州市中山大学校友会 (GUANGZHOU SUN YAT-SEN UNIVERSITY ALUMNI ASSOCIATION)',
                  })
                }
                className="bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center space-x-1 shrink-0 transition-transform active:scale-95 shadow"
              >
                <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>中大宝典原图</span>
              </button>
            </div>
          </div>

          {/* Main Grid View of Baodian Rules */}
          <div className="flex-1 min-h-0 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 pb-3">
              {filteredRules.map((rule) => (
                <div
                  key={rule.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 shadow-lg flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 space-y-3 group"
                >
                  {/* Header: Rule ID, Category & Source Credit */}
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-black text-xs flex items-center justify-center">
                        {rule.id}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800">
                        {rule.categoryName}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopyRule(rule)}
                      className="text-slate-400 hover:text-amber-400 p-1 transition-transform active:scale-90"
                      title="复制口诀与精解"
                    >
                      {copiedId === rule.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Phrase Banner */}
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-amber-300 leading-snug group-hover:text-amber-200">
                      {rule.phrase}
                    </h3>
                  </div>

                  {/* Explanation & Tactical Action */}
                  <div className="space-y-2 text-xs leading-relaxed text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <div>
                      <span className="text-amber-400 font-bold">💡 战术精解：</span>
                      <span className="text-slate-300">{rule.explanation}</span>
                    </div>
                    <div>
                      <span className="text-emerald-400 font-bold">🎯 实战动作：</span>
                      <span className="text-emerald-300/90">{rule.tacticalAction}</span>
                    </div>
                    <div>
                      <span className="text-rose-400 font-bold">⚠️ 禁忌误区：</span>
                      <span className="text-rose-300/80">{rule.pitfall}</span>
                    </div>
                  </div>

                  {/* Institutional Credit Footer */}
                  <div className="text-[10px] text-slate-500 border-t border-slate-800/60 pt-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-3 h-3 text-emerald-500" />
                      <span>广州市中山大学校友会</span>
                    </span>
                    <span className="text-slate-600">GuanDan BaoDian</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Tab 2: 慧姐实战牌语心法 (Huijie's Battle Insights) */}
      {mainTab === 'huijie' && (
        <div className="flex-1 min-h-0 flex flex-col gap-2.5 overflow-hidden">
          {/* Audio Screenshot Proofs Trigger Bar */}
          <div className="shrink-0 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2 text-xs">
              <MessageSquareQuote className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-rose-300">慧姐金句：</span>
              <span className="text-slate-300">“牌语是看打牌打出来的，而不是眨眼睛送秋波。”</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() =>
                  setActiveImagePreview({
                    url: '/assets/baodian/huijie_baodian_1.png',
                    title: '慧姐实战心得原图（一）：首发牌语与对手意图',
                    source: '慧姐 牌语实录分享',
                  })
                }
                className="bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-amber-300 text-[11px] px-2.5 py-1 rounded-lg border border-slate-700 flex items-center space-x-1 transition-transform active:scale-95"
              >
                <ImageIcon className="w-3 h-3 text-amber-400" />
                <span>慧姐手稿截屏 1</span>
              </button>

              <button
                onClick={() =>
                  setActiveImagePreview({
                    url: '/assets/baodian/huijie_baodian_2.png',
                    title: '慧姐实战心得原图（二）：强弱定位与助攻控场',
                    source: '慧姐 牌语实录分享',
                  })
                }
                className="bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-amber-300 text-[11px] px-2.5 py-1 rounded-lg border border-slate-700 flex items-center space-x-1 transition-transform active:scale-95"
              >
                <ImageIcon className="w-3 h-3 text-amber-400" />
                <span>慧姐手稿截屏 2</span>
              </button>
            </div>
          </div>

          {/* Huijie Insights Cards Grid */}
          <div className="flex-1 min-h-0 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-3">
              {HUIJIE_INSIGHTS.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-rose-500/50 rounded-2xl p-4 shadow-lg flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 space-y-3 group"
                >
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 font-black text-xs flex items-center justify-center">
                        {item.id}
                      </span>
                      <h3 className="text-sm sm:text-base font-black text-amber-300 group-hover:text-amber-200">
                        {item.title}
                      </h3>
                    </div>

                    <button
                      onClick={() => handleCopyHuijie(item)}
                      className="text-slate-400 hover:text-rose-400 p-1 transition-transform active:scale-90"
                      title="复制慧姐心法"
                    >
                      {copiedHuijieId === item.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Audio Quote */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1">
                    <div className="text-[10px] text-rose-400 font-bold flex items-center gap-1">
                      <MessageSquareQuote className="w-3 h-3 text-rose-400" />
                      <span>慧姐语音实录原声：</span>
                    </div>
                    <p className="text-xs text-slate-200 italic font-serif leading-relaxed">
                      {item.quote}
                    </p>
                  </div>

                  {/* Core Rule & Application */}
                  <div className="space-y-2 text-xs leading-relaxed text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <div>
                      <span className="text-amber-400 font-bold">🎯 核心法则：</span>
                      <span className="text-slate-300">{item.coreRule}</span>
                    </div>
                    <div>
                      <span className="text-sky-400 font-bold">🔍 触发场景：</span>
                      <span className="text-slate-300">{item.scenario}</span>
                    </div>
                    <div>
                      <span className="text-emerald-400 font-bold">⚡ 实战打法：</span>
                      <span className="text-emerald-300/90">{item.application}</span>
                    </div>
                  </div>

                  {/* Personal Credit Footer */}
                  <div className="text-[10px] text-slate-500 border-t border-slate-800/60 pt-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <HeartHandshake className="w-3 h-3 text-rose-400" />
                      <span>实战经验提供：慧姐</span>
                    </span>
                    <span className="text-slate-600">Huijie Battle Insights</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: View Original Scanned Image / Screenshots */}
      {activeImagePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl max-w-2xl w-full p-4 shadow-2xl space-y-3 flex flex-col max-h-[92vh]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 shrink-0">
              <div>
                <h3 className="text-sm font-black text-white">{activeImagePreview.title}</h3>
                <p className="text-[10px] text-amber-400 font-bold mt-0.5">致谢：{activeImagePreview.source}</p>
              </div>
              <button
                onClick={() => setActiveImagePreview(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto rounded-xl border border-slate-800 flex items-center justify-center bg-black/50 p-2 min-h-0">
              <img
                src={activeImagePreview.url}
                alt={activeImagePreview.title}
                className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
              />
            </div>

            <div className="flex items-center justify-between shrink-0 pt-1">
              <span className="text-[11px] text-slate-400">传承名宿实战真言，严谨保留版权致谢。</span>
              <a
                href={activeImagePreview.url}
                download
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl shadow flex items-center space-x-1"
              >
                <span>保存原图</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
