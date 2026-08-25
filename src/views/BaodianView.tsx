import React, { useState } from 'react';
import {
  BAODIAN_RULES,
  BaodianRule,
  HUIJIE_INSIGHTS,
  HuijieInsight,
  JIANG_INSIGHTS,
  JiangInsight,
} from '../core/baodian';
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
  Crown,
  Zap,
} from 'lucide-react';

export const BaodianView: React.FC = () => {
  const { t } = useI18n();
  const [mainTab, setMainTab] = useState<'rules' | 'jiang' | 'huijie'>('rules');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [copiedJiangId, setCopiedJiangId] = useState<number | null>(null);
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

  const filteredJiangInsights = JIANG_INSIGHTS.filter((item) => {
    return (
      searchQuery === '' ||
      item.title.includes(searchQuery) ||
      item.quote.includes(searchQuery) ||
      item.coreRule.includes(searchQuery) ||
      item.application.includes(searchQuery)
    );
  });

  const filteredHuijieInsights = HUIJIE_INSIGHTS.filter((item) => {
    return (
      searchQuery === '' ||
      item.title.includes(searchQuery) ||
      item.quote.includes(searchQuery) ||
      item.coreRule.includes(searchQuery) ||
      item.application.includes(searchQuery)
    );
  });

  const handleCopyRule = (rule: BaodianRule) => {
    const text = `【广州市中山大学校友会 · 掼蛋宝典第${rule.id}条】${rule.phrase}\n💡 战术精解：${rule.explanation}\n🎯 实战动作：${rule.tacticalAction}\n⚠️ 禁忌误区：${rule.pitfall}\n🏛️ 来源致谢：广州市中山大学校友会\n👉 掼蛋大师教练 (https://guandan.weiai.ai)`;
    navigator.clipboard.writeText(text);
    setCopiedId(rule.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCopyJiang = (item: JiangInsight) => {
    const text = `【蒋主席掼蛋实战宝典 · ${item.title}】\n💬 语音实录：${item.quote}\n🎯 核心法则：${item.coreRule}\n💡 实战应用：${item.application}\n👑 经验贡献：蒋主席\n👉 掼蛋大师教练 (https://guandan.weiai.ai)`;
    navigator.clipboard.writeText(text);
    setCopiedJiangId(item.id);
    setTimeout(() => setCopiedJiangId(null), 2500);
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
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <h2 className="text-base sm:text-lg font-black text-white">掼蛋实战宝典库</h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/40 flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-emerald-400" />
                <span>中大校友会 18条经典口诀</span>
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-500/40 flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-400" />
                <span>蒋主席 博弈与残局心法</span>
              </span>
              <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-bold border border-rose-500/40 flex items-center gap-1">
                <HeartHandshake className="w-3 h-3 text-rose-400" />
                <span>慧姐 牌语攻防实录</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              致谢名宿与校友会传承：收录中山大学校友会 18 条经典口诀、蒋主席博弈残局心法及慧姐实战牌语实录。
            </p>
          </div>
        </div>

        {/* Sub-Navigation Tabs: 中大宝典 vs 蒋主席宝典 vs 慧姐心法 */}
        <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setMainTab('rules')}
            className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-black flex items-center space-x-1.5 transition-all ${
              mainTab === 'rules'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>中大校友会宝典</span>
          </button>

          <button
            onClick={() => setMainTab('jiang')}
            className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-black flex items-center space-x-1.5 transition-all ${
              mainTab === 'jiang'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>蒋主席宝典 (7条心法)</span>
          </button>

          <button
            onClick={() => setMainTab('huijie')}
            className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-black flex items-center space-x-1.5 transition-all ${
              mainTab === 'huijie'
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>慧姐牌语心法</span>
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
                        ? 'bg-emerald-500 text-slate-950 shadow-md'
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
                  className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-4 shadow-lg flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 space-y-3 group"
                >
                  {/* Header: Rule ID, Category & Source Credit */}
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-black text-xs flex items-center justify-center">
                        {rule.id}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800">
                        {rule.categoryName}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopyRule(rule)}
                      className="text-slate-400 hover:text-emerald-400 p-1 transition-transform active:scale-90"
                      title="复制口诀与精解"
                    >
                      {copiedId === rule.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Core Rhyme Phrase */}
                  <div className="text-sm sm:text-base font-black text-white group-hover:text-emerald-300 transition-colors leading-snug">
                    {rule.phrase}
                  </div>

                  {/* Tactical Explanation */}
                  <div className="space-y-2 text-xs">
                    <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 space-y-1">
                      <div className="flex items-center space-x-1.5 text-slate-300 font-extrabold text-[11px]">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>博弈论战术精解</span>
                      </div>
                      <p className="text-slate-400 leading-relaxed">{rule.explanation}</p>
                    </div>

                    <div className="bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-500/20 space-y-1">
                      <div className="flex items-center space-x-1.5 text-emerald-300 font-extrabold text-[11px]">
                        <Zap className="w-3.5 h-3.5 text-emerald-400" />
                        <span>实战动作要领</span>
                      </div>
                      <p className="text-emerald-200/90 leading-relaxed">{rule.tacticalAction}</p>
                    </div>

                    <div className="bg-rose-950/20 p-2.5 rounded-xl border border-rose-500/20 space-y-1">
                      <div className="flex items-center space-x-1.5 text-rose-300 font-extrabold text-[11px]">
                        <Shield className="w-3.5 h-3.5 text-rose-400" />
                        <span>禁忌与新手误区</span>
                      </div>
                      <p className="text-rose-200/90 leading-relaxed">{rule.pitfall}</p>
                    </div>
                  </div>

                  {/* Footer Attribution */}
                  <div className="border-t border-slate-800/80 pt-2 flex items-center justify-between text-[10px] text-slate-500">
                    <span>来源：广州市中山大学校友会</span>
                    <span className="text-emerald-400/80">掼蛋大师教练</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Tab 2: 蒋主席 · 掼蛋实战宝典与博弈心法 (7条口述实录) */}
      {mainTab === 'jiang' && (
        <div className="flex-1 min-h-0 flex flex-col gap-2.5 overflow-hidden">
          {/* Jiang Insights Top Notice */}
          <div className="shrink-0 bg-slate-950/80 p-3 rounded-xl border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <Crown className="w-4 h-4 text-amber-400 shrink-0" />
              <p className="text-xs text-slate-300">
                <strong>蒋主席口述博弈精解</strong>：“打牌你永远把自己当作配角，好的牌去助攻对家，把对家送走自己收拾残局才是真正的高手；残局要靠逆向预设全场牌型才能绝境翻盘！”
              </p>
            </div>

            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索蒋主席心法..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Jiang Insights Cards Grid */}
          <div className="flex-1 min-h-0 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-3">
              {filteredJiangInsights.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 shadow-lg flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 space-y-3 group"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-black text-xs flex items-center justify-center">
                        {item.id}
                      </span>
                      <span className="text-xs font-black text-amber-300">{item.title}</span>
                    </div>

                    <button
                      onClick={() => handleCopyJiang(item)}
                      className="text-slate-400 hover:text-amber-400 p-1 transition-transform active:scale-90"
                      title="复制蒋主席心法"
                    >
                      {copiedJiangId === item.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Audio Transcript Quote Box */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-amber-500/20 space-y-1 relative">
                    <MessageSquareQuote className="w-4 h-4 text-amber-400 absolute right-2.5 top-2.5 opacity-40" />
                    <div className="text-[11px] font-bold text-amber-300">【蒋主席口述原声录音】</div>
                    <p className="text-xs text-slate-300 italic leading-relaxed">{item.quote}</p>
                  </div>

                  {/* Core Rule & Practical Application */}
                  <div className="space-y-2 text-xs">
                    <div className="bg-amber-950/30 p-2.5 rounded-xl border border-amber-500/30 space-y-1">
                      <div className="text-[11px] font-extrabold text-amber-300 flex items-center gap-1">
                        <Crown className="w-3 h-3 text-amber-400" />
                        <span>核心博弈定律</span>
                      </div>
                      <p className="text-amber-200/90 leading-relaxed font-bold">{item.coreRule}</p>
                    </div>

                    <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 space-y-1">
                      <div className="text-[11px] font-extrabold text-slate-300">实战情境判定</div>
                      <p className="text-slate-400 leading-relaxed">{item.scenario}</p>
                    </div>

                    <div className="bg-sky-950/20 p-2.5 rounded-xl border border-sky-500/20 space-y-1">
                      <div className="text-[11px] font-extrabold text-sky-300">操盘对策与要领</div>
                      <p className="text-sky-200/90 leading-relaxed">{item.application}</p>
                    </div>
                  </div>

                  {/* Footer Attribution */}
                  <div className="border-t border-slate-800/80 pt-2 flex items-center justify-between text-[10px] text-slate-500">
                    <span>口述经验贡献：蒋主席</span>
                    <span className="text-amber-400/80">掼蛋大师教练</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Tab 3: 慧姐 · 实战牌语与攻防心法 (4篇口述实录) */}
      {mainTab === 'huijie' && (
        <div className="flex-1 min-h-0 flex flex-col gap-2.5 overflow-hidden">
          {/* Huijie Insights Top Notice */}
          <div className="shrink-0 bg-slate-950/80 p-3 rounded-xl border border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <MessageSquareQuote className="w-4 h-4 text-rose-400 shrink-0" />
              <p className="text-xs text-slate-300">
                <strong>慧姐经验精髓</strong>：“牌语是打出来的，不是眨眼睛送秋波！首发小单是主攻强牌信号；情况不明对子先行；多炸主攻，单炸安心当僚机！”
              </p>
            </div>

            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索慧姐心法..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Huijie Insights Cards Grid */}
          <div className="flex-1 min-h-0 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-3">
              {filteredHuijieInsights.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-rose-500/50 rounded-2xl p-4 shadow-lg flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 space-y-3 group"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 font-black text-xs flex items-center justify-center">
                        {item.id}
                      </span>
                      <span className="text-xs font-black text-rose-300">{item.title}</span>
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

                  {/* Audio Transcript Quote Box */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-rose-500/20 space-y-1 relative">
                    <MessageSquareQuote className="w-4 h-4 text-rose-400 absolute right-2.5 top-2.5 opacity-40" />
                    <div className="text-[11px] font-bold text-rose-300">【慧姐口述原声录音】</div>
                    <p className="text-xs text-slate-300 italic leading-relaxed">{item.quote}</p>
                  </div>

                  {/* Core Rule & Practical Application */}
                  <div className="space-y-2 text-xs">
                    <div className="bg-rose-950/30 p-2.5 rounded-xl border border-rose-500/30 space-y-1">
                      <div className="text-[11px] font-extrabold text-rose-300">核心战术法则</div>
                      <p className="text-rose-200/90 leading-relaxed font-bold">{item.coreRule}</p>
                    </div>

                    <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 space-y-1">
                      <div className="text-[11px] font-extrabold text-slate-300">实战情境判定</div>
                      <p className="text-slate-400 leading-relaxed">{item.scenario}</p>
                    </div>

                    <div className="bg-sky-950/20 p-2.5 rounded-xl border border-sky-500/20 space-y-1">
                      <div className="text-[11px] font-extrabold text-sky-300">操盘对策与要领</div>
                      <p className="text-sky-200/90 leading-relaxed">{item.application}</p>
                    </div>
                  </div>

                  {/* Footer Attribution */}
                  <div className="border-t border-slate-800/80 pt-2 flex items-center justify-between text-[10px] text-slate-500">
                    <span>口述经验贡献：慧姐</span>
                    <span className="text-rose-400/80">掼蛋大师教练</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Original Baodian Card High-Res Image Preview */}
      {activeImagePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-4 sm:p-5 shadow-2xl space-y-3 relative max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-black text-white">{activeImagePreview.title}</h3>
                  <p className="text-[11px] text-emerald-400 font-bold">{activeImagePreview.source}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveImagePreview(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto rounded-xl bg-slate-950 p-2 border border-slate-800 flex items-center justify-center">
              <img
                src={activeImagePreview.url}
                alt={activeImagePreview.title}
                className="max-h-[65vh] w-auto object-contain rounded-lg shadow-lg"
              />
            </div>

            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>广州市中山大学校友会 官方致谢印制</span>
              <button
                onClick={() => setActiveImagePreview(null)}
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-4 py-1 rounded-lg text-xs"
              >
                关闭预览
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
