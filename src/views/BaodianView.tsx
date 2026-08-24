import React, { useState } from 'react';
import { BAODIAN_RULES, BaodianRule } from '../core/baodian';
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
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export const BaodianView: React.FC = () => {
  const { t } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [showOriginalImageModal, setShowOriginalImageModal] = useState<boolean>(false);
  const [selectedRule, setSelectedRule] = useState<BaodianRule | null>(null);

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
    const text = `【掼蛋宝典第${rule.id}条】${rule.phrase}\n💡 战术精解：${rule.explanation}\n🎯 实战动作：${rule.tacticalAction}\n⚠️ 禁忌误区：${rule.pitfall}\n👉 来自 掼蛋大师教练 (https://guandan.weiai.ai)`;
    navigator.clipboard.writeText(text);
    setCopiedId(rule.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="h-full w-full flex flex-col gap-2.5 min-h-0 overflow-hidden text-slate-100 font-sans">
      {/* Top Banner */}
      <div className="shrink-0 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-amber-500 to-rose-500 rounded-2xl flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 text-lg">
            📖
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-black text-white">掼蛋实战宝典库 (18条黄金实战口诀)</h2>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-500/40">
                高校校友会传承
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              源自广州市中山大学校友会等高校掼蛋俱乐部实战智慧，涵盖残局张数精算、炸弹火药控制与搭档默契。
            </p>
          </div>
        </div>

        {/* Original Scanned Card Modal Trigger */}
        <button
          onClick={() => setShowOriginalImageModal(true)}
          className="bg-slate-800 hover:bg-slate-750 text-amber-300 hover:text-amber-200 border border-amber-500/40 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-transform active:scale-95 shadow shrink-0"
        >
          <ImageIcon className="w-4 h-4 text-amber-400" />
          <span>查看原版印制宝典原图</span>
        </button>
      </div>

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

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索口诀关键词（如：七张、炸弹、顺子）..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
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
              {/* Header: Rule ID & Category */}
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
            </div>
          ))}
        </div>
      </div>

      {/* Modal: View Original Scanned Image */}
      {showOriginalImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl max-w-2xl w-full p-4 shadow-2xl space-y-3 flex flex-col max-h-[92vh]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 shrink-0">
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-black text-white">广州市中山大学校友会 · 掼蛋宝典原图</h3>
              </div>
              <button
                onClick={() => setShowOriginalImageModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto rounded-xl border border-slate-800 flex items-center justify-center bg-black/50 p-2 min-h-0">
              <img
                src="/assets/baodian/guandan_baodian_sysu.jpg"
                alt="广州市中山大学校友会 掼蛋宝典原图"
                className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
              />
            </div>

            <div className="flex items-center justify-between shrink-0 pt-1">
              <span className="text-[11px] text-slate-400">
                18条实战真言，由高校掼蛋俱乐部名宿多年实战推演归纳而成。
              </span>
              <a
                href="/assets/baodian/guandan_baodian_sysu.jpg"
                download="掼蛋宝典_中山大学校友会.jpg"
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl shadow flex items-center space-x-1"
              >
                <span>保存高清原图</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
