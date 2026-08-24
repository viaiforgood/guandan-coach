import React, { useState, useEffect } from 'react';
import { GameState, ReplayRecord } from '../core/types';
import { initMatch, startRound, playMove, passMove, startSwapHandsMatch, exportReplayRecord } from '../core/engine';
import { chooseAIAction, getCoachSuggestion } from '../core/ai';
import { analyzeCardTracker } from '../core/tracker';
import { classify } from '../core/combos';
import { PokerTable } from '../components/Board/PokerTable';
import { CardTrackerDrawer } from '../components/HUD/CardTrackerDrawer';
import { CoachBubble } from '../components/Coach/CoachBubble';
import { RoundEndModal } from '../components/Modals/RoundEndModal';
import { Sound } from '../core/audio';
import { Play, Pause, RotateCcw, Bot, Eye, RefreshCw, Film } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ArenaViewProps {
  onNavigateToReplay?: (record: ReplayRecord) => void;
}

export const ArenaView: React.FC<ArenaViewProps> = ({ onNavigateToReplay }) => {
  const [gameState, setGameState] = useState<GameState>(() => initMatch('2'));
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [botSpeedMs, setBotSpeedMs] = useState<number>(1000);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'table' | 'coach' | 'tracker'>('table');

  const { currentTurn, hands, levelRank, phase, history, isGodMode } = gameState;
  const userHand = hands[0];
  const isMyTurn = currentTurn === 0;

  // Track cards
  const seatCounts: [number, number, number, number] = [
    hands[0].length,
    hands[1].length,
    hands[2].length,
    hands[3].length,
  ];
  const tracker = analyzeCardTracker(history, userHand, seatCounts, levelRank, 0);

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
        const botHand = hands[currentTurn];
        const aiDecision = chooseAIAction(currentTurn, botHand, gameState, 'standard');

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
  }, [currentTurn, phase, gameState, botSpeedMs, isAutoPlay]);

  // Round victory confetti & victory sound
  useEffect(() => {
    if (phase === 'round_end' || phase === 'match_end') {
      Sound.playVictory();
      confetti({
        particleCount: 100,
        spread: 80,
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
    setGameState(initMatch('2'));
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
        {/* Mobile Switcher (Table / Coach / Tracker) */}
        <div className="flex lg:hidden items-center justify-between bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setMobileTab('table')}
            className={`flex-1 py-1 rounded-lg font-bold ${
              mobileTab === 'table' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
            }`}
          >
            牌桌对局
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

        {/* Poker Felt Table (Flexible height, fits 100% inside screen) */}
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

        {/* Slim Bottom Toolbar (Speed, Auto-Play, Swap Hands, Replay, Restart) */}
        <div className="shrink-0 h-8 bg-slate-950/90 border border-slate-800/90 rounded-xl px-2.5 sm:px-3 flex items-center justify-between text-[11px] shadow-sm">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <span className="text-slate-400 font-bold hidden sm:inline">节奏:</span>
            <button
              onClick={() => setBotSpeedMs(1500)}
              className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                botSpeedMs === 1500 ? 'bg-amber-500 text-slate-950 shadow-sm' : 'bg-slate-900 text-slate-300'
              }`}
            >
              1.5s
            </button>
            <button
              onClick={() => setBotSpeedMs(800)}
              className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                botSpeedMs === 800 ? 'bg-amber-500 text-slate-950 shadow-sm' : 'bg-slate-900 text-slate-300'
              }`}
            >
              0.8s
            </button>
            <button
              onClick={() => setBotSpeedMs(200)}
              className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                botSpeedMs === 200 ? 'bg-amber-500 text-slate-950 shadow-sm' : 'bg-slate-900 text-slate-300'
              }`}
            >
              0.2s
            </button>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={handleSwapHandsRematch}
              className="text-amber-400 hover:text-amber-300 flex items-center space-x-1 font-bold text-[11px]"
              title="与对手互换手牌重打本局"
            >
              <RefreshCw className="w-3 h-3" />
              <span className="hidden sm:inline">换牌复赛</span>
            </button>

            {onNavigateToReplay && (
              <button
                onClick={handleReviewReplay}
                className="text-sky-400 hover:text-sky-300 flex items-center space-x-1 font-bold text-[11px]"
                title="复盘本局所有出牌"
              >
                <Film className="w-3 h-3" />
                <span>复盘</span>
              </button>
            )}

            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className={`px-2.5 py-0.5 rounded-lg font-black border flex items-center space-x-1 transition-transform active:scale-95 text-[11px] ${
                isAutoPlay
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              }`}
            >
              {isAutoPlay ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isAutoPlay ? '暂停' : 'AI托管'}</span>
            </button>

            <button
              onClick={handleRestartMatch}
              className="text-slate-400 hover:text-white flex items-center space-x-1 font-bold text-[11px]"
            >
              <RotateCcw className="w-3 h-3" />
              <span>重开</span>
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
