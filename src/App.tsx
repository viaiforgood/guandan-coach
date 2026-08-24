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
    <div className="h-screen w-screen max-h-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950 font-sans">
      {/* Compact Top Navbar */}
      <header className="shrink-0 h-12 sm:h-13 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 shadow-md z-40">
        <div className="h-full max-w-7xl mx-auto px-3 sm:px-4 flex items-center justify-between">
          {/* Logo & Brand */}
          <div
            className="flex items-center space-x-2 cursor-pointer select-none"
            onClick={() => setCurrentTab('arena')}
          >
            <div className="w-8 h-8 bg-gradient-to-tr from-amber-500 to-red-500 rounded-xl flex items-center justify-center shadow-md shadow-amber-500/20 text-slate-950 font-black text-base">
              🃏
            </div>
            <div>
              <div className="text-xs sm:text-sm font-black tracking-tight text-white flex items-center gap-1.5 leading-none">
                <span>掼蛋大师教练</span>
                <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded font-bold border border-amber-500/30">
                  Pro AI
                </span>
              </div>
              <div className="text-[9px] text-slate-400 font-medium leading-tight">
                guandan.weiai.ai
              </div>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setCurrentTab('arena')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-extrabold transition-all ${
                currentTab === 'arena'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>实战对战</span>
            </button>

            <button
              onClick={() => setCurrentTab('puzzles')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-extrabold transition-all ${
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
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-extrabold transition-all ${
                currentTab === 'drills'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>五十定律特训</span>
            </button>

            <button
              onClick={() => setCurrentTab('academy')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-extrabold transition-all ${
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
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-extrabold transition-all ${
                currentTab === 'ocr'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>手牌诊断</span>
            </button>
          </nav>

          {/* Org badge */}
          <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-medium">
            <span className="hidden sm:inline">viaiforgood</span>
          </div>
        </div>
      </header>

      {/* Main Single-Window Desktop View (100% viewport fit, zero page scroll) */}
      <main className="flex-1 h-[calc(100vh-3rem)] sm:h-[calc(100vh-3.25rem)] min-h-0 w-full max-w-7xl mx-auto p-1.5 sm:p-2 lg:p-3 overflow-hidden">
        {currentTab === 'arena' && <ArenaView />}
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
        <button
          onClick={() => setCurrentTab('ocr')}
          className={`flex flex-col items-center p-1 text-[9px] font-bold ${
            currentTab === 'ocr' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <Camera className="w-3.5 h-3.5 mb-0.5" />
          <span>识牌</span>
        </button>
      </nav>
    </div>
  );
};
