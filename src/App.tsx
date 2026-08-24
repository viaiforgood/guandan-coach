import React, { useState } from 'react';
import { I18nProvider, useI18n } from './core/i18n';
import { ArenaView } from './views/ArenaView';
import { ReplayView } from './views/ReplayView';
import { OnlineView } from './views/OnlineView';
import { PuzzleView } from './views/PuzzleView';
import { AcademyView } from './views/AcademyView';
import { TrackerDrillView } from './views/TrackerDrillView';
import { HandOCRView } from './views/HandOCRView';
import { BaodianView } from './views/BaodianView';
import { BgmPlayer } from './components/Audio/BgmPlayer';
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
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Scroll,
} from 'lucide-react';

type TabType = 'arena' | 'replay' | 'online' | 'puzzles' | 'drills' | 'baodian' | 'academy' | 'ocr';

const AppContent: React.FC = () => {
  const { locale, setLocale, t } = useI18n();
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
                <span>{t.appName}</span>
                <span className="text-[9px] bg-gradient-to-r from-amber-500/20 to-sky-500/20 text-amber-300 px-1 py-0.2 rounded font-bold border border-amber-500/30">
                  {t.appBadge}
                </span>
              </div>
              <div className="text-[9px] text-slate-400 font-medium leading-tight flex items-center gap-1 mt-0.5">
                <span className="text-amber-400/90 font-semibold">{t.brandName}</span>
                <span className="text-slate-600">·</span>
                <span className="hidden lg:inline text-sky-400/90">{t.zjuAgent}</span>
                <span className="hidden lg:inline text-slate-600">·</span>
                <span className="hidden sm:inline text-slate-400">{t.naAlumni}</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setCurrentTab('arena')}
              className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-extrabold transition-all ${
                currentTab === 'arena'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>{t.tabArena}</span>
            </button>

            <button
              onClick={() => setCurrentTab('replay')}
              className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-extrabold transition-all ${
                currentTab === 'replay'
                  ? 'bg-sky-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>{t.tabReplay}</span>
            </button>

            <button
              onClick={() => setCurrentTab('online')}
              className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-extrabold transition-all ${
                currentTab === 'online'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{t.tabOnline}</span>
            </button>

            <button
              onClick={() => setCurrentTab('baodian')}
              className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-extrabold transition-all ${
                currentTab === 'baodian'
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 shadow-sm'
                  : 'text-amber-300 hover:text-white'
              }`}
            >
              <Scroll className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.tabBaodian}</span>
            </button>

            <button
              onClick={() => setCurrentTab('puzzles')}
              className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-extrabold transition-all ${
                currentTab === 'puzzles'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>{t.tabPuzzles}</span>
            </button>

            <button
              onClick={() => setCurrentTab('drills')}
              className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-extrabold transition-all ${
                currentTab === 'drills'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>{t.tabDrills}</span>
            </button>

            <button
              onClick={() => setCurrentTab('academy')}
              className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-extrabold transition-all ${
                currentTab === 'academy'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t.tabAcademy}</span>
            </button>

            <button
              onClick={() => setCurrentTab('ocr')}
              className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-extrabold transition-all ${
                currentTab === 'ocr'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{t.tabOcr}</span>
            </button>
          </nav>

          {/* Right Controls: BgmPlayer, i18n Language Switcher & Alliance Background Modal */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* Suno BGM Player */}
            <BgmPlayer />

            {/* Language Selector */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[10px] font-bold">
              <button
                onClick={() => setLocale('zh_cn')}
                className={`px-1.5 py-0.5 rounded transition-all ${
                  locale === 'zh_cn' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="简体中文"
              >
                简
              </button>
              <button
                onClick={() => setLocale('zh_tw')}
                className={`px-1.5 py-0.5 rounded transition-all ${
                  locale === 'zh_tw' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="繁體中文"
              >
                繁
              </button>
              <button
                onClick={() => setLocale('en')}
                className={`px-1.5 py-0.5 rounded transition-all ${
                  locale === 'en' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="English"
              >
                EN
              </button>
            </div>

            <button
              onClick={() => setShowAboutModal(true)}
              className="bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white px-2 py-1 rounded-lg border border-slate-700 text-[11px] font-bold flex items-center gap-1 transition-transform active:scale-95 shadow"
              title={t.aboutBtn}
            >
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{t.aboutBtn}</span>
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
        {currentTab === 'baodian' && <BaodianView />}
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
          <span>{t.tabArena}</span>
        </button>
        <button
          onClick={() => setCurrentTab('baodian')}
          className={`flex flex-col items-center p-1 text-[9px] font-bold ${
            currentTab === 'baodian' ? 'text-amber-300 font-extrabold' : 'text-slate-400'
          }`}
        >
          <Scroll className="w-3.5 h-3.5 mb-0.5" />
          <span>宝典</span>
        </button>
        <button
          onClick={() => setCurrentTab('replay')}
          className={`flex flex-col items-center p-1 text-[9px] font-bold ${
            currentTab === 'replay' ? 'text-sky-400' : 'text-slate-400'
          }`}
        >
          <Film className="w-3.5 h-3.5 mb-0.5" />
          <span>{t.tabReplay}</span>
        </button>
        <button
          onClick={() => setCurrentTab('online')}
          className={`flex flex-col items-center p-1 text-[9px] font-bold ${
            currentTab === 'online' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Globe className="w-3.5 h-3.5 mb-0.5" />
          <span>{t.tabOnline}</span>
        </button>
        <button
          onClick={() => setCurrentTab('puzzles')}
          className={`flex flex-col items-center p-1 text-[9px] font-bold ${
            currentTab === 'puzzles' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <Trophy className="w-3.5 h-3.5 mb-0.5" />
          <span>{t.tabPuzzles}</span>
        </button>
        <button
          onClick={() => setCurrentTab('drills')}
          className={`flex flex-col items-center p-1 text-[9px] font-bold ${
            currentTab === 'drills' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <Brain className="w-3.5 h-3.5 mb-0.5" />
          <span>{t.tabDrills}</span>
        </button>
        <button
          onClick={() => setCurrentTab('academy')}
          className={`flex flex-col items-center p-1 text-[9px] font-bold ${
            currentTab === 'academy' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 mb-0.5" />
          <span>{t.tabAcademy}</span>
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
                  <h3 className="text-base font-black text-white">{t.aboutTitle}</h3>
                  <p className="text-[11px] text-amber-400 font-bold">{t.brandFoundation}</p>
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
                  <span>{t.aboutInst1Title}</span>
                </div>
                <p className="text-[11px] text-slate-400">{t.aboutInst1Desc}</p>
              </div>

              {/* Institution 2 */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center space-x-1.5 text-sky-400 font-bold">
                  <GraduationCap className="w-4 h-4 text-sky-400" />
                  <span>{t.aboutInst2Title}</span>
                </div>
                <p className="text-[11px] text-slate-400">{t.aboutInst2Desc}</p>
              </div>

              {/* Institution 3 */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                  <Trophy className="w-4 h-4 text-emerald-400" />
                  <span>{t.aboutInst3Title}</span>
                </div>
                <p className="text-[11px] text-slate-400">{t.aboutInst3Desc}</p>
              </div>

              {/* Special Credits: 中山大学校友会 & 慧姐 */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center space-x-1.5 text-amber-300 font-bold">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>经典宝典与名宿实战经验致谢</span>
                </div>
                <ul className="text-[11px] text-slate-400 space-y-0.5 list-disc list-inside">
                  <li><strong>广州市中山大学校友会</strong>：传承收录《掼蛋宝典》（18条黄金实战口诀）</li>
                  <li><strong>慧姐</strong>：口述实录《实战牌语与攻防心法》（首发小单、对子探路、牌语读人）</li>
                </ul>
              </div>

              {/* Creator Credit */}
              <div className="text-[11px] text-slate-500 border-t border-slate-800/80 pt-2 flex items-center justify-between">
                <span>{t.instructor}</span>
                <span className="text-amber-400/80">guandan.weiai.ai</span>
              </div>
            </div>

            <button
              onClick={() => setShowAboutModal(false)}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black py-2 rounded-xl text-xs shadow transition-transform active:scale-95"
            >
              {t.aboutReturn}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
};
