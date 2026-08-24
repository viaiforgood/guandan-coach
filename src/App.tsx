import React, { useState } from 'react';
import { ArenaView } from './views/ArenaView';
import { PuzzleView } from './views/PuzzleView';
import { AcademyView } from './views/AcademyView';
import { TrackerDrillView } from './views/TrackerDrillView';
import { HandOCRView } from './views/HandOCRView';
import { Swords, Trophy, BookOpen, Brain, Camera } from 'lucide-react';

type TabType = 'arena' | 'puzzles' | 'drills' | 'academy' | 'ocr';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('arena');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div
            className="flex items-center space-x-2.5 cursor-pointer select-none"
            onClick={() => setCurrentTab('arena')}
          >
            <div className="w-9 h-9 bg-gradient-to-tr from-amber-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black text-lg">
              🃏
            </div>
            <div>
              <div className="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
                <span>掼蛋大师教练</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-bold border border-amber-500/30">
                  Pro AI
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                Guandan Pro Coach · Via AI For Good
              </div>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setCurrentTab('arena')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                currentTab === 'arena'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Swords className="w-4 h-4" />
              <span>实战演练</span>
            </button>

            <button
              onClick={() => setCurrentTab('puzzles')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                currentTab === 'puzzles'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>残局闯关</span>
            </button>

            <button
              onClick={() => setCurrentTab('drills')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                currentTab === 'drills'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Brain className="w-4 h-4" />
              <span>五十定律特训</span>
            </button>

            <button
              onClick={() => setCurrentTab('academy')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                currentTab === 'academy'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>新手学院</span>
            </button>

            <button
              onClick={() => setCurrentTab('ocr')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                currentTab === 'ocr'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>手牌诊断</span>
            </button>
          </nav>

          {/* Org link */}
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span className="hidden sm:inline">viaiforgood</span>
          </div>
        </div>
      </header>

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {currentTab === 'arena' && <ArenaView />}
        {currentTab === 'puzzles' && <PuzzleView />}
        {currentTab === 'drills' && <TrackerDrillView />}
        {currentTab === 'academy' && <AcademyView />}
        {currentTab === 'ocr' && <HandOCRView />}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden sticky bottom-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 flex justify-around">
        <button
          onClick={() => setCurrentTab('arena')}
          className={`flex flex-col items-center p-1 text-[10px] font-bold ${
            currentTab === 'arena' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <Swords className="w-4 h-4 mb-0.5" />
          <span>对战</span>
        </button>
        <button
          onClick={() => setCurrentTab('puzzles')}
          className={`flex flex-col items-center p-1 text-[10px] font-bold ${
            currentTab === 'puzzles' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <Trophy className="w-4 h-4 mb-0.5" />
          <span>残局</span>
        </button>
        <button
          onClick={() => setCurrentTab('drills')}
          className={`flex flex-col items-center p-1 text-[10px] font-bold ${
            currentTab === 'drills' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <Brain className="w-4 h-4 mb-0.5" />
          <span>记牌</span>
        </button>
        <button
          onClick={() => setCurrentTab('academy')}
          className={`flex flex-col items-center p-1 text-[10px] font-bold ${
            currentTab === 'academy' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <BookOpen className="w-4 h-4 mb-0.5" />
          <span>学院</span>
        </button>
        <button
          onClick={() => setCurrentTab('ocr')}
          className={`flex flex-col items-center p-1 text-[10px] font-bold ${
            currentTab === 'ocr' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <Camera className="w-4 h-4 mb-0.5" />
          <span>识牌</span>
        </button>
      </nav>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 text-center text-xs text-slate-500 space-y-1">
        <div>
          🃏 掼蛋大师教练 (Guandan Pro Coach) · 由 <strong>viaiforgood</strong> 打造
        </div>
        <div className="text-[11px] text-slate-600">
          以《道德经》观势，以规则为边界，以技术为手段，以战略为方向，以决策赢得牌局。
        </div>
      </footer>
    </div>
  );
};
