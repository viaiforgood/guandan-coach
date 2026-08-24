import React, { useState, useEffect } from 'react';
import { GameState } from '../core/types';
import { initMatch, startRound, playMove, passMove } from '../core/engine';
import { chooseAIAction, getCoachSuggestion } from '../core/ai';
import { analyzeCardTracker } from '../core/tracker';
import { classify } from '../core/combos';
import { PokerTable } from '../components/Board/PokerTable';
import { CardTrackerDrawer } from '../components/HUD/CardTrackerDrawer';
import { CoachBubble } from '../components/Coach/CoachBubble';
import { RoundEndModal } from '../components/Modals/RoundEndModal';
import { Sound } from '../core/audio';
import { Play, Pause, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ArenaView: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => initMatch('2'));
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [botSpeedMs, setBotSpeedMs] = useState<number>(1000);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  const { currentTurn, hands, levelRank, phase, history } = gameState;
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
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-slate-950 font-black px-5 py-2.5 rounded-2xl shadow-2xl animate-bounce border-2 border-amber-300">
          {notification}
        </div>
      )}

      {/* Main Poker Table */}
      <PokerTable
        gameState={gameState}
        selectedIds={selectedIds}
        onToggleCard={toggleCard}
        onClearSelection={() => setSelectedIds(new Set())}
        onPlay={handlePlayUser}
        onPass={handlePassUser}
        onAutoHint={handleApplyCoachPlay}
      />

      {/* Arena Dashboard: Coach Bubble & Card Tracker HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: AI Coach Real-Time Advisor */}
        <CoachBubble
          suggestion={coachSuggestion}
          levelRank={levelRank}
          onApplyPlay={handleApplyCoachPlay}
          isMyTurn={isMyTurn}
        />

        {/* Right: Card Tracker & Fifty Law HUD */}
        <CardTrackerDrawer tracker={tracker} levelRank={levelRank} />
      </div>

      {/* Speed & Match Controls Bar */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs shadow-lg">
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 font-bold">出牌节奏：</span>
          <button
            onClick={() => setBotSpeedMs(1500)}
            className={`px-3 py-1 rounded-xl font-bold transition-all ${
              botSpeedMs === 1500 ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-900 text-slate-300'
            }`}
          >
            正常 (1.5s)
          </button>
          <button
            onClick={() => setBotSpeedMs(800)}
            className={`px-3 py-1 rounded-xl font-bold transition-all ${
              botSpeedMs === 800 ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-900 text-slate-300'
            }`}
          >
            快速 (0.8s)
          </button>
          <button
            onClick={() => setBotSpeedMs(200)}
            className={`px-3 py-1 rounded-xl font-bold transition-all ${
              botSpeedMs === 200 ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-900 text-slate-300'
            }`}
          >
            极速 (0.2s)
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className={`px-3.5 py-1.5 rounded-xl font-black border flex items-center space-x-1.5 transition-transform active:scale-95 ${
              isAutoPlay
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-rose-500/20'
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-emerald-500/20'
            }`}
          >
            {isAutoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoPlay ? '暂停托管' : 'AI 托管对战'}</span>
          </button>

          <button
            onClick={handleRestartMatch}
            className="text-slate-400 hover:text-white flex items-center space-x-1 font-bold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重新开局</span>
          </button>
        </div>
      </div>

      {/* Round End Dialog */}
      {(phase === 'round_end' || phase === 'match_end') && (
        <RoundEndModal
          gameState={gameState}
          onNextRound={handleNextRound}
          onRestartMatch={handleRestartMatch}
        />
      )}
    </div>
  );
};
