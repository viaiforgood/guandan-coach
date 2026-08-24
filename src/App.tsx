import React, { useState } from 'react';
import { ArenaView } from './views/ArenaView';
import { ReplayView } from './views/ReplayView';
import { OnlineView } from './views/OnlineView';
import { PuzzleView } from './views/PuzzleView';
import { AcademyView } from './views/AcademyView';
import { TrackerDrillView } from './views/TrackerDrillView';
import { HandOCRView } from './views/HandOCRView';
import { BrandLogo } from './components/Logo/BrandLogo';
import { ReplayRecord } from './core/types';
import {
  Swords,
  Trophy,
  BookOpen,
  Brain,
  Camera,
  Film,
  Globe,
  Info,
  X,
  ExternalLink,
  ShieldCheck,
  GraduationCap,
} from 'lucide-react';

type TabType = 'arena' | 'replay' | 'online' | 'puzzles' | 'drills' | 'academy' | 'ocr';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('arena');
  const [activeReplayRecord, setActiveReplayRecord] = useState<ReplayRecord | null>(null);
  const [showAboutModal, setShowAboutModal] = useState<boolean>(false);

  const handleNavigateToReplay = (record: ReplayRecord) => {
    setActiveReplayRecord(record);
    setCurrentTab('replay');
  };

  const handleLaunchSwapMatchFromReplay = () => {
    setCurrentTab('arena');
  };

  return (
    <div className="h-screen w-screen max-h-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950 font-sans">
      {/* Compact Top Navbar */}
      <header className="shrink-0 h-12 sm:h-13 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 shadow-md z-40">
        <div className="h-full max-w-7xl mx-auto px-2 sm:px-4 flex items-center justify-between">
          {/* Logo & Brand Header */}
          <div
            className="flex items-center space-x-2 cursor-pointer select-none group"
            onClick={() => setCurrentTab('arena')}
          >
            <BrandLogo size="md" />

            <div className="flex flex-col">
              <div className="text-xs sm:text-sm font-black tracking-tight text-white flex items-center gap-1.5 leading-none">
                <span>掼蛋大师教练</span>
                <span className="text-[9px] bg-gradient-to-r from-amber-500/20 to-sky-500/20 text-amber-300 px-1 py-0.2 rounded font-bold border border-amber-500/30">
                  Pro AI
                </span>
              </div>
              <div className="text-[9px] text-slate-400 font-medium leading-tight flex items-center gap-1 mt-0.5">
                <span className="text-amber-400/90 font-semibold">Via AI For Good</span>
                <span className="text-slate-600">·</span>
                <span className="hidden lg:inline text-sky-400/90">浙大智能体</span>
                <span className="hidden lg:inline text-slate-600">·</span>
                <span className="hidden sm:inline text-slate-400">北美高校联盟</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setCurrentTab('arena')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all ${
                currentTab === 'arena'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>实战对决</span>
            </button>

            <button
              onClick={() => setCurrentTab('replay')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all ${
                currentTab === 'replay'
                  ? 'bg-sky-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>牌谱复盘</span>
            </button>

            <button
              onClick={() => setCurrentTab('online')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all ${
                currentTab === 'online'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>在线联机</span>
            </button>

            <button
              onClick={() => setCurrentTab('puzzles')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all ${
                currentTab === 'puzzles'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>残局闯关</span>
            </button>

            <button
              onClick={() => setCurrentTab('drills')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all ${
                currentTab === 'drills'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>五十定律</span>
            </button>

            <button
              onClick={() => setCurrentTab('academy')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all ${
                currentTab === 'academy'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>新手学院</span>
            </button>

            <button
              onClick={() => setCurrentTab('ocr')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all ${
                currentTab === 'ocr'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>手牌诊断</span>
            </button>
          </nav>

          {/* Org & About Trigger */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setShowAboutModal(true)}
              className="bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700 text-[11px] font-bold flex items-center gap-1 transition-transform active:scale-95 shadow"
              title="关于品牌与发起机构"
            >
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">联盟背景</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Single-Window Desktop View */}
      <main className="flex-1 h-[calc(100vh-3rem)] sm:h-[calc(100vh-3.25rem)] min-h-0 w-full max-w-7xl mx-auto p-1.5 sm:p-2 lg:p-3 overflow-hidden">
        {currentTab === 'arena' && <ArenaView onNavigateToReplay={handleNavigateToReplay} />}
        {currentTab === 'replay' && (
          <ReplayView
            initialRecord={activeReplayRecord}
            onLaunchSwapMatch={handleLaunchSwapMatchFromReplay}
          />
        )}
        {currentTab === 'online' && <OnlineView />}
        {currentTab === 'puzzles' && <PuzzleView />}
        {currentTab === 'drills' && <TrackerDrillView />}
        {currentTab === 'academy' && <AcademyView />}
        {currentTab === 'ocr' && <HandOCRView />}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden shrink-0 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-2 py-1 flex justify-around z-40">
        <button
          onClick={() => setCurrentTab('arena')}
          className={`flex flex-col items-center p-1 text-[9px] font-bold ${
            currentTab === 'arena' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <Swords className="w-3.5 h-3.5 mb-0.5" />
          <span>对战</span>
        </button>
        <button
          onClick={() => setCurrentTab('replay')}
          className={`flex flex-col items-center p-1 text-[9px] font-bold ${
            currentTab === 'replay' ? 'text-sky-400' : 'text-slate-400'
          }`}
        >
          <Film className="w-3.5 h-3.5 mb-0.5" />
          <span>复盘</span>
        </button>
        <button
          onClick={() => setCurrentTab('online')}
          className={`flex flex-col items-center p-1 text-[9px] font-bold ${
            currentTab === 'online' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Globe className="w-3.5 h-3.5 mb-0.5" />
          <span>联机</span>
        </button>
        <button
          onClick={() => setCurrentTab('puzzles')}
          className={`flex flex-col items-center p-1 text-[9px] font-bold ${
            currentTab === 'puzzles' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <Trophy className="w-3.5 h-3.5 mb-0.5" />
          <span>残局</span>
        </button>
        <button
          onClick={() => setCurrentTab('drills')}
          className={`flex flex-col items-center p-1 text-[9px] font-bold ${
            currentTab === 'drills' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <Brain className="w-3.5 h-3.5 mb-0.5" />
          <span>记牌</span>
        </button>
        <button
          onClick={() => setCurrentTab('academy')}
          className={`flex flex-col items-center p-1 text-[9px] font-bold ${
            currentTab === 'academy' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 mb-0.5" />
          <span>学院</span>
        </button>
      </nav>

      {/* About & Federation Credits Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <BrandLogo size="lg" />
                <div>
                  <h3 className="text-base font-black text-white">掼蛋大师教练 · 智能体研发团队</h3>
                  <p className="text-[11px] text-amber-400 font-bold">Guandan Pro Coach by Via AI For Good</p>
                </div>
              </div>
              <button
                onClick={() => setShowAboutModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              {/* Institution 1 */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Via AI For Good 科技公益发起</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  致力于运用先进生成式 AI 与 Agentic 系统推动中华传统益智博弈文化普及，打造零门槛、零成本、高智力体验的智能化学习工具。
                </p>
              </div>

              {/* Institution 2 */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center space-x-1.5 text-sky-400 font-bold">
                  <GraduationCap className="w-4 h-4 text-sky-400" />
                  <span>浙大智能体 (Zhejiang University AI Agent) 算法支持</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  由浙江大学校友团队领衔研发，融合博弈论、启发式双向理牌规划（保炸优先 vs 去单化）与五十定律算牌推演引擎。
                </p>
              </div>

              {/* Institution 3 */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                  <Trophy className="w-4 h-4 text-emerald-400" />
                  <span>北美高校联盟 掼蛋俱乐部 (NAACU Guandan Club) 赛事标准</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  对标国际及高校掼蛋正规大赛规则体系，提供实战演练、智能复盘、换位复赛与四人在线联机能力。
                </p>
              </div>

              {/* Creator Credit */}
              <div className="text-[11px] text-slate-500 border-t border-slate-800/80 pt-2 flex items-center justify-between">
                <span>讲师与课程架构：Michael HUO</span>
                <span className="text-amber-400/80">guandan.weiai.ai</span>
              </div>
            </div>

            <button
              onClick={() => setShowAboutModal(false)}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black py-2 rounded-xl text-xs shadow transition-transform active:scale-95"
            >
              返回对战与训练
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
