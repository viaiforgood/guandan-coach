import React, { useState, useEffect } from 'react';
import { GameMode, GameState, LevelRank, PlayerSeat, ReplayRecord } from '../core/types';
import {
  initMatch,
  startRound,
  playMove,
  passMove,
  startSwapHandsMatch,
  exportReplayRecord,
  LEVEL_SEQUENCE,
} from '../core/engine';
import { AIDifficulty, chooseAIAction, getCoachSuggestion } from '../core/ai';
import { analyzeCardTracker } from '../core/tracker';
import { classify } from '../core/combos';
import { useI18n } from '../core/i18n';
import { PokerTable } from '../components/Board/PokerTable';
import { CardTrackerDrawer } from '../components/HUD/CardTrackerDrawer';
import { CoachBubble } from '../components/Coach/CoachBubble';
import { RoundEndModal } from '../components/Modals/RoundEndModal';
import { Sound } from '../core/audio';
import { loadUserProfile, saveUserProfile } from '../core/profile';
import {
  Play,
  Pause,
  RotateCcw,
  Bot,
  Eye,
  RefreshCw,
  Film,
  Users,
  Trophy,
  ChevronRight,
  Crown,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ArenaViewProps {
  onNavigateToReplay?: (record: ReplayRecord) => void;
}

export const ArenaView: React.FC<ArenaViewProps> = ({ onNavigateToReplay }) => {
  const { t } = useI18n();
  const [gameMode, setGameMode] = useState<GameMode>('4p');
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>('master');
  const [selectedRank, setSelectedRank] = useState<LevelRank>('2');
  const [showLevelPicker, setShowLevelPicker] = useState<boolean>(false);
  const [gameState, setGameState] = useState<GameState>(() => initMatch('2', '4p'));
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [botSpeedMs, setBotSpeedMs] = useState<number>(() => {
    const saved = localStorage.getItem('guandan_bot_speed_ms');
    return saved ? parseInt(saved, 10) : 1500;
  });
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'table' | 'coach' | 'tracker'>('table');

  const handleChangeBotSpeed = (speed: number) => {
    setBotSpeedMs(speed);
    localStorage.setItem('guandan_bot_speed_ms', speed.toString());
    Sound.playCardClick();
  };

  const { currentTurn, hands, levelRank, phase, history, isGodMode, teamLevels } = gameState;
  const userHand = hands[0] || [];
  const isMyTurn = currentTurn === 0;

  // Track cards
  const seatCounts = hands.map((h) => h.length);
  const tracker = analyzeCardTracker(history, userHand, seatCounts, levelRank, 0, gameMode === '6p' ? 6 : 4);

  // Coach real-time suggestion
  const coachSuggestion = getCoachSuggestion(userHand, gameState, 0);

  // Auto-trigger bot turns
  useEffect(() => {
    if (phase !== 'playing') return;

    if (currentTurn !== 0 || isAutoPlay) {
      const timer = setTimeout(() => {
        const hand = hands[currentTurn] || [];
        const action = chooseAIAction(currentTurn, hand, gameState, aiDifficulty);
        if (action.action === 'play' && action.combo) {
          triggerComboSound(action.combo.isBomb, action.combo.bombTier);
          const res = playMove(gameState, currentTurn, action.combo);
          setGameState(res.nextState);
        } else {
          Sound.playCardPlay();
          const res = passMove(gameState, currentTurn);
          setGameState(res.nextState);
        }
      }, botSpeedMs);
      return () => clearTimeout(timer);
    }
  }, [currentTurn, phase, gameState, botSpeedMs, isAutoPlay, aiDifficulty]);

  // Round victory confetti & victory sound & EXP award
  useEffect(() => {
    if (phase === 'round_end' || phase === 'match_end') {
      Sound.playVictory();
      confetti({
        particleCount: 140,
        spread: 100,
        origin: { y: 0.55 },
      });

      try {
        const profile = loadUserProfile();
        profile.stats.totalGames += 1;
        profile.stats.wins += 1;
        if (gameState.finishedOrder && gameState.finishedOrder[0] === 0) {
          profile.stats.topRankCount += 1;
        }
        profile.exp += 100; // Award 100 EXP
        saveUserProfile(profile);
      } catch (e) {
        console.warn('Profile exp update error:', e);
      }
    }
  }, [phase]);

  const toggleCard = (cardId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) next.delete(cardId);
      else next.add(cardId);
      return next;
    });
  };

  const handlePlayUser = () => {
    if (!isMyTurn || selectedIds.size === 0) return;
    const selectedCards = userHand.filter((c) => selectedIds.has(c.id));
    const combo = classify(selectedCards, levelRank);

    if (!combo) {
      showNotice('所选牌不构成任何有效掼蛋牌型！');
      return;
    }

    triggerComboSound(combo.isBomb, combo.bombTier);
    const res = playMove(gameState, 0, combo);
    if (res.error) {
      showNotice(res.error);
      return;
    }
    setGameState(res.nextState);
    setSelectedIds(new Set());
  };

  const handlePassUser = () => {
    if (!isMyTurn || !gameState.currentCombo) return;
    Sound.playCardPlay();
    const res = passMove(gameState, 0);
    setGameState(res.nextState);
    setSelectedIds(new Set());
  };

  const handleApplyCoachPlay = () => {
    if (!isMyTurn || !coachSuggestion) return;
    if (coachSuggestion.action === 'pass') {
      handlePassUser();
    } else if (coachSuggestion.combo) {
      setSelectedIds(new Set(coachSuggestion.combo.cards.map((c) => c.id)));
      triggerComboSound(coachSuggestion.combo.isBomb, coachSuggestion.combo.bombTier);
      const res = playMove(gameState, 0, coachSuggestion.combo);
      if (!res.error) {
        setGameState(res.nextState);
        setSelectedIds(new Set());
      }
    }
  };

  const triggerComboSound = (isBomb?: boolean, bombTier?: number) => {
    if (isBomb) {
      Sound.playBomb();
    } else {
      Sound.playCardPlay();
    }
  };

  const handleToggleGodMode = () => {
    setGameState((prev) => ({ ...prev, isGodMode: !prev.isGodMode }));
    showNotice(gameState.isGodMode ? '已关闭上帝全知视角' : '已开启上帝全知视角 (透视全场手牌)');
  };

  const handleSwapHandsRematch = () => {
    Sound.playCardDeal();
    const swapped = startSwapHandsMatch(gameState);
    setGameState(swapped);
    setSelectedIds(new Set());
    showNotice('🔄 换位复赛开启！你已拿到对手上一局的手牌，请逆风翻盘！');
  };

  const handleSwitchMode = (mode: GameMode) => {
    Sound.playCardDeal();
    setGameMode(mode);
    setGameState(initMatch(selectedRank, mode));
    setSelectedIds(new Set());
    showNotice(`已切换为【${mode === '6p' ? t.mode6p : t.mode4p}】！`);
  };

  const handleSelectStartingRank = (rank: LevelRank) => {
    setSelectedRank(rank);
    Sound.playCardDeal();
    setGameState(initMatch(rank, gameMode));
    setShowLevelPicker(false);
    showNotice(`已将起始级牌设为【打 ${rank}】！`);
  };

  const handleReviewReplay = () => {
    const jsonStr = exportReplayRecord(gameState);
    const record = JSON.parse(jsonStr) as ReplayRecord;
    if (onNavigateToReplay) {
      onNavigateToReplay(record);
    }
  };

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleNextRound = () => {
    Sound.playCardDeal();
    setGameState((prev) => startRound(prev));
    setSelectedIds(new Set());
  };

  const handleRestartMatch = () => {
    Sound.playCardDeal();
    setGameState(initMatch(selectedRank, gameMode));
    setSelectedIds(new Set());
  };

  return (
    <div className="h-full w-full flex flex-col md:flex-row landscape:flex-row gap-2 sm:gap-3 min-h-0 overflow-hidden relative font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black px-4 py-2 rounded-2xl shadow-2xl animate-bounce border-2 border-amber-300 text-xs sm:text-sm">
          {notification}
        </div>
      )}

      {/* Main Table Column (Left on Desktop, Full Flex) */}
      <div className="flex-1 h-full min-w-0 flex flex-col gap-1.5 min-h-0 overflow-hidden">
        {/* iOS Dynamic Island Style Top HUD */}
        <div className="shrink-0 bg-slate-950/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl px-3 py-1.5 flex items-center justify-between shadow-lg">
          {/* Left: Grade Level & Wildcard Badge */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <button
                onClick={() => setShowLevelPicker(!showLevelPicker)}
                className="bg-gradient-to-r from-amber-500/20 to-amber-600/30 hover:from-amber-500/30 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 transition-transform active:scale-95 shadow"
                title={t.selectGrade}
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>打【{levelRank}】</span>
                <span className="text-[10px] text-rose-400 font-bold bg-rose-500/20 px-1.5 py-0.2 rounded-full border border-rose-500/30">
                  ♥{levelRank} 配
                </span>
                <ChevronRight className="w-3 h-3 opacity-60" />
              </button>

              {/* Grade Picker Popover */}
              {showLevelPicker && (
                <div className="absolute top-9 left-0 w-64 bg-slate-900 border-2 border-amber-500/40 rounded-2xl p-3 shadow-2xl z-50 space-y-2 animate-fade-in text-left">
                  <div className="text-xs font-black text-slate-200 flex items-center justify-between">
                    <span>选择开局打级 (2 ~ A)</span>
                    <span className="text-[10px] text-amber-400 font-normal">点击即切</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {LEVEL_SEQUENCE.map((r) => (
                      <button
                        key={r}
                        onClick={() => handleSelectStartingRank(r)}
                        className={`py-1.5 rounded-xl text-xs font-black transition-all ${
                          r === levelRank
                            ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 scale-105'
                            : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Score Progress Meter (Team 0 vs Team 1) */}
            <div className="hidden sm:flex items-center space-x-2 text-[11px]">
              <div className="flex items-center space-x-1 bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-500/30">
                <span className="text-emerald-400 font-black">己方:</span>
                <span className="font-mono font-extrabold text-white">{teamLevels[0]}级</span>
              </div>

              <span className="text-slate-600 font-bold">VS</span>

              <div className="flex items-center space-x-1 bg-rose-950/60 px-2 py-0.5 rounded-lg border border-rose-500/30">
                <span className="text-rose-400 font-black">对方:</span>
                <span className="font-mono font-extrabold text-white">{teamLevels[1]}级</span>
              </div>
            </div>
          </div>

          {/* Right: AI Difficulty & Mode Selector */}
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] text-slate-400 font-bold hidden md:inline">AI段位:</span>
            <div className="flex items-center bg-slate-900 p-0.5 rounded-xl border border-slate-800 text-[10px] font-bold">
              <button
                onClick={() => setAiDifficulty('novice')}
                className={`px-1.5 py-0.5 rounded-lg transition-all ${
                  aiDifficulty === 'novice' ? 'bg-emerald-500 text-slate-950 font-black shadow' : 'text-slate-400'
                }`}
              >
                学徒
              </button>
              <button
                onClick={() => setAiDifficulty('standard')}
                className={`px-1.5 py-0.5 rounded-lg transition-all ${
                  aiDifficulty === 'standard' ? 'bg-amber-500 text-slate-950 font-black shadow' : 'text-slate-400'
                }`}
              >
                高手
              </button>
              <button
                onClick={() => setAiDifficulty('master')}
                className={`px-1.5 py-0.5 rounded-lg transition-all ${
                  aiDifficulty === 'master' ? 'bg-gradient-to-r from-purple-500 to-amber-500 text-white font-black shadow' : 'text-slate-400'
                }`}
              >
                大师
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Switcher Tabs (Only in Portrait mode; Hidden in Landscape/Horizontal mode) */}
        <div className="flex portrait:flex landscape:hidden md:hidden items-center justify-between bg-slate-900/90 p-1 rounded-2xl border border-slate-800 text-xs shadow-md">
          <button
            onClick={() => setMobileTab('table')}
            className={`flex-1 py-1.5 rounded-xl font-black transition-all ${
              mobileTab === 'table' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400'
            }`}
          >
            {t.tabArena}
          </button>
          <button
            onClick={() => setMobileTab('coach')}
            className={`flex-1 py-1.5 rounded-xl font-black flex items-center justify-center gap-1 transition-all ${
              mobileTab === 'coach' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI教练</span>
          </button>
          <button
            onClick={() => setMobileTab('tracker')}
            className={`flex-1 py-1.5 rounded-xl font-black flex items-center justify-center gap-1 transition-all ${
              mobileTab === 'tracker' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>记牌器</span>
          </button>
        </div>

        {/* Tournament Emerald Felt Poker Table (Always visible in Landscape, or when table tab is active in Portrait) */}
        <div className={`flex-1 min-h-0 w-full ${mobileTab !== 'table' ? 'hidden landscape:flex md:flex' : 'flex'}`}>
          <PokerTable
            gameState={gameState}
            selectedIds={selectedIds}
            onToggleCard={toggleCard}
            onClearSelection={() => setSelectedIds(new Set())}
            onPlay={handlePlayUser}
            onPass={handlePassUser}
            onAutoHint={handleApplyCoachPlay}
            onToggleGodMode={handleToggleGodMode}
          />
        </div>

        {/* Mobile View for Coach / Tracker */}
        {mobileTab === 'coach' && (
          <div className="lg:hidden flex-1 overflow-y-auto p-2">
            <CoachBubble
              suggestion={coachSuggestion}
              levelRank={levelRank}
              onApplyPlay={handleApplyCoachPlay}
              isMyTurn={isMyTurn}
            />
          </div>
        )}
        {mobileTab === 'tracker' && (
          <div className="lg:hidden flex-1 overflow-y-auto p-2">
            <CardTrackerDrawer tracker={tracker} levelRank={levelRank} />
          </div>
        )}

        {/* Slim Bottom Match Action Dock */}
        <div className="shrink-0 h-9 bg-slate-950/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl px-3 flex items-center justify-between text-[11px] shadow-md">
          {/* Mode Switcher: 4p vs 6p */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => handleSwitchMode('4p')}
              className={`px-2 py-0.5 rounded-lg font-black transition-all ${
                gameMode === '4p'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              4人标准
            </button>
            <button
              onClick={() => handleSwitchMode('6p')}
              className={`px-2 py-0.5 rounded-lg font-black transition-all flex items-center gap-0.5 ${
                gameMode === '6p'
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3 h-3" />
              <span>6人团战</span>
            </button>

            <span className="text-slate-700 mx-0.5">|</span>

            {/* Speed Buttons with Clear Timing & Pacing */}
            <span className="text-slate-500 font-bold hidden sm:inline">出牌节奏:</span>
            <button
              onClick={() => handleChangeBotSpeed(2000)}
              className={`px-1.5 py-0.5 rounded font-bold transition-all ${
                botSpeedMs === 2000
                  ? 'bg-amber-500 text-slate-950 font-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="2.0秒 慢速仔细看"
            >
              🐢 2.0s
            </button>
            <button
              onClick={() => handleChangeBotSpeed(1500)}
              className={`px-1.5 py-0.5 rounded font-bold transition-all ${
                botSpeedMs === 1500
                  ? 'bg-amber-500 text-slate-950 font-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="1.5秒 舒适标准节奏（推荐）"
            >
              🚶 1.5s
            </button>
            <button
              onClick={() => handleChangeBotSpeed(800)}
              className={`px-1.5 py-0.5 rounded font-bold transition-all ${
                botSpeedMs === 800
                  ? 'bg-amber-500 text-slate-950 font-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="0.8秒 快速"
            >
              🏃 0.8s
            </button>
            <button
              onClick={() => handleChangeBotSpeed(300)}
              className={`px-1.5 py-0.5 rounded font-bold transition-all ${
                botSpeedMs === 300
                  ? 'bg-amber-500 text-slate-950 font-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="0.3秒 极速"
            >
              ⚡ 极速
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleSwapHandsRematch}
              className="text-amber-400 hover:text-amber-300 flex items-center space-x-1 font-black transition-transform active:scale-95"
              title="与对手互换手牌重打本局"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">换位复赛</span>
            </button>

            {onNavigateToReplay && (
              <button
                onClick={handleReviewReplay}
                className="text-sky-400 hover:text-sky-300 flex items-center space-x-1 font-black transition-transform active:scale-95"
                title="复盘本局出牌"
              >
                <Film className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">牌谱复盘</span>
              </button>
            )}

            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className={`px-2.5 py-0.5 rounded-xl font-black border flex items-center space-x-1 transition-transform active:scale-95 ${
                isAutoPlay
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              }`}
            >
              {isAutoPlay ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isAutoPlay ? '暂停托管' : 'AI托管'}</span>
            </button>

            <button
              onClick={handleRestartMatch}
              className="text-slate-400 hover:text-white flex items-center space-x-1 font-bold transition-transform active:scale-95"
            >
              <RotateCcw className="w-3 h-3" />
              <span>重新发牌</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: AI Coach & 50-Law Tracker (Always visible in Landscape & Desktop, 100% in one screen) */}
      <div className="hidden landscape:flex md:flex w-64 sm:w-72 lg:w-80 xl:w-96 h-full flex-col gap-2 min-h-0 shrink-0">
        {/* Top Box: AI Coach Live Guidance */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <CoachBubble
            suggestion={coachSuggestion}
            levelRank={levelRank}
            onApplyPlay={handleApplyCoachPlay}
            isMyTurn={isMyTurn}
          />
        </div>

        {/* Bottom Box: 50-Law Tracker HUD */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <CardTrackerDrawer tracker={tracker} levelRank={levelRank} />
        </div>
      </div>

      {/* Round End Modal */}
      {(phase === 'round_end' || phase === 'match_end') && (
        <RoundEndModal
          gameState={gameState}
          onNextRound={handleNextRound}
          onRestartMatch={handleRestartMatch}
          onSwapRematch={handleSwapHandsRematch}
          onReviewReplay={handleReviewReplay}
        />
      )}
    </div>
  );
};
