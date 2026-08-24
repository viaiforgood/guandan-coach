import React, { useState, useEffect } from 'react';
import { GameMode, GameState, LevelRank, ReplayRecord } from '../core/types';
import { initMatch, startRound, playMove, passMove, startSwapHandsMatch, exportReplayRecord, LEVEL_SEQUENCE } from '../core/engine';
import { AIDifficulty, chooseAIAction, getCoachSuggestion } from '../core/ai';
import { analyzeCardTracker } from '../core/tracker';
import { classify } from '../core/combos';
import { useI18n } from '../core/i18n';
import { PokerTable } from '../components/Board/PokerTable';
import { CardTrackerDrawer } from '../components/HUD/CardTrackerDrawer';
import { CoachBubble } from '../components/Coach/CoachBubble';
import { RoundEndModal } from '../components/Modals/RoundEndModal';
import { Sound } from '../core/audio';
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
  Flame,
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
  const [botSpeedMs, setBotSpeedMs] = useState<number>(1000);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'table' | 'coach' | 'tracker'>('table');

  const { currentTurn, hands, levelRank, phase, history, isGodMode, teamLevels } = gameState;
  const userHand = hands[0] || [];
  const isMyTurn = currentTurn === 0;

  // Track cards
  const seatCounts = hands.map((h) => h.length);
  const tracker = analyzeCardTracker(history, userHand, seatCounts, levelRank, 0, hands.length);

  // Coach suggestion
  const coachSuggestion = getCoachSuggestion(userHand, gameState, 0);

  // Play audio sound on combo
  const triggerComboSound = (isBomb: boolean, bombTier?: number) => {
    if (isBomb) {
      if (bombTier && bombTier >= 10) {
        Sound.playFanfare();
      } else {
        Sound.playBomb();
      }
    } else {
      Sound.playCardPlay();
    }
  };

  // Bot Turn Automation Effect
  useEffect(() => {
    if (phase !== 'playing') return;

    if (currentTurn !== 0) {
      const timer = setTimeout(() => {
        const botHand = hands[currentTurn] || [];
        const aiDecision = chooseAIAction(currentTurn, botHand, gameState, aiDifficulty);

        if (aiDecision.action === 'play' && aiDecision.combo) {
          triggerComboSound(aiDecision.combo.isBomb, aiDecision.combo.bombTier);
          const { nextState, error } = playMove(gameState, currentTurn, aiDecision.combo);
          if (!error) setGameState(nextState);
        } else {
          Sound.playPass();
          const { nextState, error } = passMove(gameState, currentTurn);
          if (!error) setGameState(nextState);
        }
      }, botSpeedMs);

      return () => clearTimeout(timer);
    } else if (isAutoPlay) {
      // Auto-play user turn
      const timer = setTimeout(() => {
        const aiDecision = chooseAIAction(0, userHand, gameState, 'master');
        if (aiDecision.action === 'play' && aiDecision.combo) {
          triggerComboSound(aiDecision.combo.isBomb, aiDecision.combo.bombTier);
          const { nextState } = playMove(gameState, 0, aiDecision.combo);
          setGameState(nextState);
        } else {
          Sound.playPass();
          const { nextState } = passMove(gameState, 0);
          setGameState(nextState);
        }
      }, botSpeedMs);

      return () => clearTimeout(timer);
    }
  }, [currentTurn, phase, gameState, botSpeedMs, isAutoPlay, aiDifficulty]);

  // Round victory confetti & victory sound
  useEffect(() => {
    if (phase === 'round_end' || phase === 'match_end') {
      Sound.playVictory();
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
      });
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
    const { nextState, error } = playMove(gameState, 0, combo);
    if (error) {
      showNotice(error);
      return;
    }

    setSelectedIds(new Set());
    setGameState(nextState);
  };

  const handlePassUser = () => {
    if (!isMyTurn) return;
    Sound.playPass();
    const { nextState, error } = passMove(gameState, 0);
    if (error) {
      showNotice(error);
      return;
    }
    setSelectedIds(new Set());
    setGameState(nextState);
  };

  const handleApplyCoachPlay = () => {
    if (coachSuggestion.action === 'play' && coachSuggestion.combo) {
      Sound.playCardDeal();
      const ids = new Set(coachSuggestion.combo.cards.map((c) => c.id));
      setSelectedIds(ids);
      showNotice('已自动为你选中教练推荐牌型，请点击【出牌】！');
    } else if (coachSuggestion.action === 'pass') {
      handlePassUser();
    }
  };

  const handleToggleGodMode = () => {
    setGameState((prev) => ({
      ...prev,
      isGodMode: !prev.isGodMode,
    }));
    showNotice(isGodMode ? '已关闭上帝模式' : '已开启上帝模式（透视全场手牌）！');
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
    <div className="h-full w-full flex flex-col lg:flex-row gap-2 sm:gap-3 min-h-0 overflow-hidden relative">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-slate-950 font-black px-4 py-2 rounded-xl shadow-2xl animate-bounce border-2 border-amber-300 text-xs sm:text-sm">
          {notification}
        </div>
      )}

      {/* Main Table Column (Left on Desktop, Full Flex) */}
      <div className="flex-1 h-full min-w-0 flex flex-col gap-1.5 min-h-0 overflow-hidden">
        {/* Top Grade Progress Ladder & AI Difficulty Bar */}
        <div className="shrink-0 bg-slate-950/90 border border-slate-800 rounded-xl px-2.5 py-1 flex items-center justify-between shadow-sm">
          {/* Level Ladder Visuals */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="relative">
              <button
                onClick={() => setShowLevelPicker(!showLevelPicker)}
                className="bg-gradient-to-r from-amber-500/20 to-amber-600/30 hover:from-amber-500/30 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-lg text-[11px] font-black flex items-center gap-1 transition-transform active:scale-95"
                title={t.selectGrade}
              >
                <Trophy className="w-3 h-3 text-amber-400" />
                <span>打【{levelRank}】</span>
                <ChevronRight className="w-2.5 h-2.5 opacity-60" />
              </button>

              {/* Grade Picker Popover */}
              {showLevelPicker && (
                <div className="absolute top-8 left-0 w-64 bg-slate-900 border-2 border-amber-500/40 rounded-2xl p-2.5 shadow-2xl z-50 space-y-2 animate-fade-in">
                  <div className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                    <span>{t.selectGrade}</span>
                    <span className="text-[10px] text-amber-400 font-normal">打2~打A</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {LEVEL_SEQUENCE.map((r) => (
                      <button
                        key={r}
                        onClick={() => handleSelectStartingRank(r)}
                        className={`py-1 rounded-lg text-xs font-black transition-all ${
                          r === levelRank
                            ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300'
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

            {/* Visual Level Trackers: Team 0 vs Team 1 */}
            <div className="hidden sm:flex items-center space-x-2 text-[10px] text-slate-300">
              <div className="flex items-center space-x-1">
                <span className="text-emerald-400 font-bold">{t.myTeam}:</span>
                <span className="font-extrabold text-white">{teamLevels[0]}级</span>
                <div className="w-12 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, ((teamLevels[0] - 2) / 12) * 100)}%` }}
                  />
                </div>
              </div>

              <span className="text-slate-600">|</span>

              <div className="flex items-center space-x-1">
                <span className="text-rose-400 font-bold">{t.oppTeam}:</span>
                <span className="font-extrabold text-white">{teamLevels[1]}级</span>
                <div className="w-12 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, ((teamLevels[1] - 2) / 12) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* AI Difficulty Selector */}
          <div className="flex items-center space-x-1">
            <span className="text-[10px] text-slate-400 font-bold hidden md:inline">{t.difficultyLabel}:</span>
            <button
              onClick={() => setAiDifficulty('novice')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                aiDifficulty === 'novice'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.diffNovice}
            </button>
            <button
              onClick={() => setAiDifficulty('standard')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                aiDifficulty === 'standard'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.diffStandard}
            </button>
            <button
              onClick={() => setAiDifficulty('master')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                aiDifficulty === 'master'
                  ? 'bg-gradient-to-r from-purple-500 to-amber-500 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.diffMaster}
            </button>
          </div>
        </div>

        {/* Mobile Switcher (Table / Coach / Tracker) */}
        <div className="flex lg:hidden items-center justify-between bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setMobileTab('table')}
            className={`flex-1 py-1 rounded-lg font-bold ${
              mobileTab === 'table' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
            }`}
          >
            {t.tabArena}
          </button>
          <button
            onClick={() => setMobileTab('coach')}
            className={`flex-1 py-1 rounded-lg font-bold flex items-center justify-center gap-1 ${
              mobileTab === 'coach' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI教练</span>
          </button>
          <button
            onClick={() => setMobileTab('tracker')}
            className={`flex-1 py-1 rounded-lg font-bold flex items-center justify-center gap-1 ${
              mobileTab === 'tracker' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>记牌器</span>
          </button>
        </div>

        {/* Poker Felt Table */}
        <div className={`flex-1 min-h-0 w-full ${mobileTab !== 'table' ? 'hidden lg:flex' : 'flex'}`}>
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

        {/* Mobile view for Coach / Tracker */}
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

        {/* Slim Bottom Toolbar */}
        <div className="shrink-0 h-8 bg-slate-950/90 border border-slate-800/90 rounded-xl px-2 sm:px-3 flex items-center justify-between text-[11px] shadow-sm">
          {/* Mode Switcher: 4p vs 6p */}
          <div className="flex items-center space-x-1 sm:space-x-1.5">
            <span className="text-slate-400 font-bold hidden md:inline">模式:</span>
            <button
              onClick={() => handleSwitchMode('4p')}
              className={`px-2 py-0.5 rounded-lg font-bold text-[10px] sm:text-[11px] transition-all ${
                gameMode === '4p'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              4人标准
            </button>
            <button
              onClick={() => handleSwitchMode('6p')}
              className={`px-2 py-0.5 rounded-lg font-bold text-[10px] sm:text-[11px] transition-all flex items-center gap-0.5 ${
                gameMode === '6p'
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-2.5 h-2.5" />
              <span>6人团战</span>
            </button>

            <span className="text-slate-700 mx-0.5">|</span>

            {/* Speed buttons */}
            <button
              onClick={() => setBotSpeedMs(1500)}
              className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                botSpeedMs === 1500 ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
              }`}
            >
              1.5s
            </button>
            <button
              onClick={() => setBotSpeedMs(800)}
              className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                botSpeedMs === 800 ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
              }`}
            >
              0.8s
            </button>
            <button
              onClick={() => setBotSpeedMs(200)}
              className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                botSpeedMs === 200 ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
              }`}
            >
              0.2s
            </button>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <button
              onClick={handleSwapHandsRematch}
              className="text-amber-400 hover:text-amber-300 flex items-center space-x-1 font-bold text-[11px]"
              title="与对手互换手牌重打本局"
            >
              <RefreshCw className="w-3 h-3" />
              <span className="hidden sm:inline">{t.swapRematch}</span>
            </button>

            {onNavigateToReplay && (
              <button
                onClick={handleReviewReplay}
                className="text-sky-400 hover:text-sky-300 flex items-center space-x-1 font-bold text-[11px]"
                title="复盘本局所有出牌"
              >
                <Film className="w-3 h-3" />
                <span>{t.replayBtn}</span>
              </button>
            )}

            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className={`px-2 py-0.5 rounded-lg font-black border flex items-center space-x-1 transition-transform active:scale-95 text-[11px] ${
                isAutoPlay
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              }`}
            >
              {isAutoPlay ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isAutoPlay ? t.autoPlayOn : t.autoPlayOff}</span>
            </button>

            <button
              onClick={handleRestartMatch}
              className="text-slate-400 hover:text-white flex items-center space-x-1 font-bold text-[11px]"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t.restartMatch}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Column on Desktop: AI Coach & 50-Law Tracker (100% in viewport) */}
      <div className="hidden lg:flex w-80 xl:w-96 h-full flex-col gap-2 min-h-0 shrink-0">
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
