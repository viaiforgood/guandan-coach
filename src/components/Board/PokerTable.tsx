import React, { useState, useEffect } from 'react';
import { Card, GameState, PlayerSeat, TrickPlay } from '../../core/types';
import { PlayingCard } from '../Card/PlayingCard';
import { describeCombo } from '../../core/combos';
import { choosePlan } from '../../core/optimizer';
import { Sound } from '../../core/audio';
import { Voice, POPULAR_EMOJIS, POPULAR_PHRASES, VoicePhrase } from '../../core/voice';
import { sortHand } from '../../core/cards';
import { CardBackCustomizerModal } from '../Card/CardBackCustomizerModal';
import {
  Crown,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  Eye,
  EyeOff,
  Smile,
  MessageCircle,
  Zap,
  Layers,
  ArrowDownWideNarrow,
  Plus,
  RotateCcw,
  Smartphone,
  Maximize2,
  Minimize2,
  Palette,
} from 'lucide-react';

export type GroupingMode = 'natural' | 'coach' | 'manual';

interface PokerTableProps {
  gameState: GameState;
  selectedIds: Set<string>;
  onToggleCard: (cardId: string) => void;
  onClearSelection: () => void;
  onPlay: () => void;
  onPass: () => void;
  onAutoHint: () => void;
  onToggleGodMode?: () => void;
  onSendEmoji?: (seat: PlayerSeat, emoji: string, text?: string) => void;
}

export const PokerTable: React.FC<PokerTableProps> = ({
  gameState,
  selectedIds,
  onToggleCard,
  onClearSelection,
  onPlay,
  onPass,
  onAutoHint,
  onToggleGodMode,
  onSendEmoji,
}) => {
  const [groupingMode, setGroupingMode] = useState<GroupingMode>(() => {
    const saved = localStorage.getItem('guandan_grouping_mode');
    if (saved === 'natural' || saved === 'coach' || saved === 'manual') return saved;
    return 'coach';
  });
  const [isLandscapeMode, setIsLandscapeMode] = useState<boolean>(false);
  const [customGroups, setCustomGroups] = useState<Card[][]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(() => Sound.getIsMuted());
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [showVoicePicker, setShowVoicePicker] = useState<boolean>(false);
  const [showCardBackModal, setShowCardBackModal] = useState<boolean>(false);
  const [activeEmojis, setActiveEmojis] = useState<Record<number, { emoji: string; text?: string } | null>>({});
  const [countdown, setCountdown] = useState<number>(20);

  const {
    hands,
    currentTurn,
    currentCombo,
    trickPlays,
    levelRank,
    finishedOrder,
    isGodMode,
    mode = '4p',
  } = gameState;

  const is6p = mode === '6p';
  const userHand = hands[0] || [];
  const isMyTurn = currentTurn === 0;

  // Persist grouping mode preference
  const handleSelectGroupingMode = (mode: GroupingMode) => {
    setGroupingMode(mode);
    localStorage.setItem('guandan_grouping_mode', mode);
  };

  const handleToggleLandscape = () => {
    setIsLandscapeMode((prev) => !prev);
    Sound.playCardClick();
  };

  // Reset countdown on turn change
  useEffect(() => {
    setCountdown(20);
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 20));
    }, 1000);
    return () => clearInterval(interval);
  }, [currentTurn]);

  // Clean custom groups when cards are played
  useEffect(() => {
    const userHandCardIds = new Set(userHand.map((c) => c.id));
    setCustomGroups((prevGroups) =>
      prevGroups
        .map((group) => group.filter((c) => userHandCardIds.has(c.id)))
        .filter((group) => group.length > 0)
    );
  }, [userHand]);

  // Plan groups for user hand (Coach recommended)
  const planResult = choosePlan(userHand, levelRank);
  const bestGroups = planResult.best.groups;

  // Natural descending order hand (Option 1: 原始由大到小)
  const naturalSortedHand = sortHand([...userHand], levelRank, true);

  // Player Manual Grouping logic (Option 3: 玩家自由组牌)
  const activeCustomGroupCardIds = new Set(customGroups.flatMap((g) => g.map((c) => c.id)));
  const ungroupedCards = naturalSortedHand.filter((c) => !activeCustomGroupCardIds.has(c.id));

  const handleCreateCustomGroup = () => {
    if (selectedIds.size === 0) return;
    const cardsToGroup = userHand.filter((c) => selectedIds.has(c.id));
    if (cardsToGroup.length === 0) return;

    // Remove these cards from any existing custom groups first
    const cleanOldGroups = customGroups
      .map((g) => g.filter((c) => !selectedIds.has(c.id)))
      .filter((g) => g.length > 0);

    setCustomGroups([...cleanOldGroups, cardsToGroup]);
    onClearSelection();
    Sound.playCardPlay();
  };

  const handleDissolveCustomGroup = (index: number) => {
    setCustomGroups((prev) => prev.filter((_, idx) => idx !== index));
    Sound.playCardClick();
  };

  const handleResetCustomGroups = () => {
    setCustomGroups([]);
    onClearSelection();
    Sound.playCardClick();
  };

  const seatNames4p: Record<number, { name: string; pos: string; role: string }> = {
    0: { name: '我', pos: '南', role: '己方主攻' },
    1: { name: '东家', pos: '东', role: '对方下家' },
    2: { name: '搭档', pos: '北', role: '对门搭档' },
    3: { name: '西家', pos: '西', role: '对方上家' },
  };

  const seatNames6p: Record<number, { name: string; pos: string; role: string }> = {
    0: { name: '我', pos: '南', role: '主队1' },
    1: { name: '东1', pos: '东南', role: '客队1' },
    2: { name: '搭档1', pos: '西北', role: '主队2' },
    3: { name: '北家', pos: '正北', role: '客队2' },
    4: { name: '搭档2', pos: '东北', role: '主队3' },
    5: { name: '西1', pos: '西南', role: '客队3' },
  };

  const seatNames = is6p ? seatNames6p : seatNames4p;

  const handleToggleSound = () => {
    const next = Sound.toggleMute();
    setIsMuted(next);
  };

  const triggerSeatEmoji = (seat: PlayerSeat, emoji: string, text?: string) => {
    setActiveEmojis((prev) => ({ ...prev, [seat]: { emoji, text } }));
    if (text) {
      Voice.speak(text);
    } else {
      Sound.playCardPlay();
    }
    if (onSendEmoji) onSendEmoji(seat, emoji, text);

    setTimeout(() => {
      setActiveEmojis((prev) => ({ ...prev, [seat]: null }));
    }, 3500);
  };

  const handleSelectEmoji = (item: (typeof POPULAR_EMOJIS)[0]) => {
    triggerSeatEmoji(0 as PlayerSeat, item.emoji, item.label);
    setShowEmojiPicker(false);
  };

  const handleSelectPhrase = (phrase: VoicePhrase) => {
    triggerSeatEmoji(0 as PlayerSeat, '💬', phrase.text);
    Voice.triggerPhrase(phrase);
    setShowVoicePicker(false);
  };

  // Get active cards in the current trick
  const currentTrickPlaysList = Object.values(trickPlays).filter(
    (tp): tp is TrickPlay => tp !== null && tp !== undefined && tp.action === 'play'
  );
  const lastTrickPlay =
    currentTrickPlaysList.length > 0 ? currentTrickPlaysList[currentTrickPlaysList.length - 1] : null;

  // Render Seat Avatar & Info HUD
  const renderSeatAvatar = (seatIndex: number, extraClasses = '') => {
    const isCurrent = currentTurn === seatIndex;
    const isFinished = finishedOrder.includes(seatIndex as PlayerSeat);
    const finishRank = finishedOrder.indexOf(seatIndex as PlayerSeat) + 1;
    const count = hands[seatIndex]?.length || 0;
    const seatInfo = seatNames[seatIndex] || { name: `Seat ${seatIndex}`, pos: '', role: '' };
    const isPartner = seatIndex === 2 || (is6p && (seatIndex === 2 || seatIndex === 4));
    const activeMsg = activeEmojis[seatIndex];

    return (
      <div className={`relative flex flex-col items-center select-none ${extraClasses}`}>
        {/* Dynamic Speech / Emoji Bubble */}
        {activeMsg && (
          <div className="absolute -top-10 z-40 bg-white text-slate-900 px-2.5 py-1 rounded-2xl shadow-xl border border-amber-300 font-bold text-xs flex items-center space-x-1 animate-bounce whitespace-nowrap">
            <span>{activeMsg.emoji}</span>
            {activeMsg.text && <span>{activeMsg.text}</span>}
          </div>
        )}

        {/* Circular Avatar with Active Turn Glow & SVG Countdown Ring */}
        <div className="relative flex items-center justify-center">
          {isCurrent && (
            <svg className="absolute -inset-1.5 w-14 h-14 sm:w-16 sm:h-16 animate-spin-slow">
              <circle
                cx="50%"
                cy="50%"
                r="44%"
                fill="none"
                stroke={countdown <= 5 ? '#f43f5e' : '#f59e0b'}
                strokeWidth="3"
                strokeDasharray="100"
                strokeDashoffset={`${(countdown / 20) * 100}`}
                className="transition-all duration-1000"
              />
            </svg>
          )}

          <div
            className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
              isCurrent
                ? 'ring-4 ring-amber-400 bg-gradient-to-tr from-amber-500 via-amber-300 to-amber-600 scale-105 shadow-amber-500/50'
                : isPartner
                ? 'ring-2 ring-emerald-400/80 bg-gradient-to-tr from-emerald-800 to-emerald-950'
                : 'ring-2 ring-slate-600 bg-gradient-to-tr from-slate-800 to-slate-950'
            }`}
          >
            <span className="text-lg sm:text-xl filter drop-shadow">
              {seatIndex === 0 ? '😎' : isPartner ? '🤝' : '🤖'}
            </span>

            {/* Countdown Badge on Current Turn */}
            {isCurrent && (
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 font-black text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-amber-200 shadow">
                {countdown}
              </div>
            )}
          </div>

          {/* Finished Rank Trophy Badge */}
          {isFinished && (
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-black text-[10px] px-1.5 py-0.5 rounded-full shadow-lg border border-amber-200 flex items-center gap-0.5">
              <span>{finishRank === 1 ? '🥇' : finishRank === 2 ? '🥈' : '🥉'}</span>
              <span>第{finishRank}名</span>
            </div>
          )}
        </div>

        {/* Seat Label Pill */}
        <div className="mt-1 bg-slate-950/90 border border-slate-700/80 px-2 py-0.5 rounded-full text-center shadow">
          <div className="text-[11px] font-black text-white leading-none">
            {seatInfo.name}
          </div>
          <div className="text-[8px] text-amber-400/90 font-bold leading-none mt-0.5">
            {seatInfo.role}
          </div>
        </div>

        {/* Card Back Stack with Remaining Count Badge */}
        {!isFinished && seatIndex !== 0 && (
          <div className="mt-1 flex items-center space-x-1 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-full shadow">
            <span className="text-[10px] text-emerald-300 font-bold">剩余</span>
            <span className="text-xs font-black text-amber-300 font-mono">{count}</span>
            <span className="text-[10px] text-emerald-300">张</span>
          </div>
        )}
      </div>
    );
  };

  // Adaptive zero-scroll single-row card stack helper for mobile & desktop
  const renderAdaptiveCards = (cards: Card[]) => {
    const total = cards.length;
    return (
      <div className="flex items-end justify-center w-full max-w-4xl px-1 overflow-visible">
        {cards.map((c, idx) => {
          const isLast = idx === total - 1;
          const overlapStyle = isLast
            ? {}
            : {
                marginRight:
                  total > 20
                    ? 'max(-33px, calc((100% - 44px) / ' + (total - 1) + ' - 44px))'
                    : total > 12
                    ? '-26px'
                    : '-18px',
                zIndex: idx + 1,
              };

          return (
            <div key={c.id} style={overlapStyle} className="transition-all duration-150 shrink-0">
              <PlayingCard
                card={c}
                levelRank={levelRank}
                isSelected={selectedIds.has(c.id)}
                onClick={() => onToggleCard(c.id)}
                size={isLandscapeMode ? 'lg' : 'md'}
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className={`relative select-none overflow-hidden font-sans transition-all duration-300 ${
        isLandscapeMode
          ? 'fixed inset-0 z-50 w-full h-full rounded-none border-none shadow-none flex flex-col justify-between'
          : 'w-full h-full flex flex-col justify-between rounded-3xl border-4 border-[#2b1f14] shadow-[0_20px_50px_rgba(0,0,0,0.85)]'
      }`}
    >
      {/* Tournament Emerald Felt Background with Stadium Spotlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 40%, #1c664b 0%, #0f4531 45%, #082d20 80%, #041811 100%)',
          boxShadow: 'inset 0 0 100px rgba(0, 0, 0, 0.75)',
        }}
      >
        {/* Subtle Luxury Diamond Felt Texture Overlay */}
        <div
          className="absolute inset-0 opacity-8 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        ></div>

        {/* Center Golden Compass Watermark & Stadium Ring */}
        <div className="absolute inset-0 flex items-center justify-center opacity-15">
          <div className="w-64 h-64 sm:w-88 sm:h-88 rounded-full border-2 border-amber-300 flex items-center justify-center">
            <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full border border-dashed border-amber-300 flex items-center justify-center">
              <span className="text-5xl sm:text-7xl font-black text-amber-200 tracking-widest">
                掼蛋
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Bar: Seats (North/Partner), Quick Emotes, Sound & God Mode */}
      <div className="relative z-20 px-3 pt-2 sm:px-4 flex items-center justify-between">
        {/* Quick Voice & Emoji Buttons + Landscape Mode Switcher */}
        <div className="flex items-center space-x-1.5 bg-slate-950/80 backdrop-blur-md p-1 rounded-2xl border border-emerald-500/30 shadow-lg">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-xl transition-transform active:scale-95 shadow"
            title="快捷表情"
          >
            <Smile className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowVoicePicker(!showVoicePicker)}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 text-sky-400 rounded-xl transition-transform active:scale-95 shadow"
            title="实战语音交流"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
          <button
            onClick={handleToggleSound}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl transition-transform active:scale-95 shadow"
            title={isMuted ? '开启音效' : '静音'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Card Back Customizer Button */}
          <button
            onClick={() => setShowCardBackModal(true)}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-xl transition-transform active:scale-95 shadow border border-amber-500/20"
            title="定制专属牌背与Logo"
          >
            <Palette className="w-4 h-4" />
          </button>

          {/* Landscape / Fullscreen Toggle Button (腾讯横屏模式) */}
          <button
            onClick={handleToggleLandscape}
            className={`px-2 py-1 rounded-xl text-xs font-black flex items-center gap-1 transition-transform active:scale-95 shadow ${
              isLandscapeMode
                ? 'bg-amber-500 text-slate-950 shadow-amber-500/40'
                : 'bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30'
            }`}
            title="腾讯16:9横屏全屏对战"
          >
            {isLandscapeMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isLandscapeMode ? '退出横屏' : '腾讯横屏'}</span>
          </button>

          {onToggleGodMode && (
            <button
              onClick={onToggleGodMode}
              className={`p-1.5 rounded-xl transition-transform active:scale-95 shadow ${
                isGodMode
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400'
              }`}
              title="上帝视角 (全知透视)"
            >
              {isGodMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Partner Seat (North Seat 2) */}
        <div className="flex flex-col items-center">
          {renderSeatAvatar(2)}
          {isGodMode && hands[2] && (
            <div className="flex -space-x-4 mt-1 overflow-x-auto max-w-[200px] p-0.5 bg-black/40 rounded-lg">
              {hands[2].map((c) => (
                <PlayingCard key={c.id} card={c} levelRank={levelRank} size="sm" compact />
              ))}
            </div>
          )}
        </div>

        {/* Grade Indicator Pill (Top Right) */}
        <div className="bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-2xl border border-amber-500/40 shadow-lg flex items-center space-x-2 text-xs">
          <div className="flex items-center space-x-1">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-white font-black">打【{levelRank}】</span>
          </div>
          <span className="w-px h-3 bg-slate-700"></span>
          <div className="flex items-center space-x-1 text-rose-400 font-bold text-[10px]">
            <span>♥{levelRank}</span>
            <span className="text-[9px] text-amber-300">逢人配</span>
          </div>
        </div>
      </div>

      {/* Center Arena: West Seat, Trick Play Zone, East Seat */}
      <div className="relative z-10 flex-1 flex items-center justify-between px-2 sm:px-6 min-h-0">
        {/* West Opponent (Seat 3) */}
        <div className="flex flex-col items-center">
          {renderSeatAvatar(3)}
          {isGodMode && hands[3] && (
            <div className="flex flex-col -space-y-6 mt-1 max-h-[140px] overflow-y-auto p-0.5 bg-black/40 rounded-lg">
              {hands[3].map((c) => (
                <PlayingCard key={c.id} card={c} levelRank={levelRank} size="sm" compact />
              ))}
            </div>
          )}
        </div>

        {/* Center Trick Plays & Combo Announcements */}
        <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-2 min-h-0">
          {/* Active Combo Tag */}
          {currentCombo && (
            <div className="mb-2 bg-gradient-to-r from-amber-500/30 via-rose-500/30 to-amber-500/30 backdrop-blur-md px-3 py-1 rounded-full border border-amber-400/50 shadow-xl flex items-center space-x-1.5 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-black text-amber-200">
                {describeCombo(currentCombo)}
              </span>
              {currentCombo.isBomb && (
                <span className="bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider animate-bounce">
                  🔥 炸弹
                </span>
              )}
            </div>
          )}

          {/* Cards on Table Drop Zone */}
          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 min-h-[90px] p-2 bg-black/25 rounded-2xl border border-white/5 shadow-inner">
            {lastTrickPlay && lastTrickPlay.cards && lastTrickPlay.cards.length > 0 ? (
              lastTrickPlay.cards.map((c) => (
                <PlayingCard
                  key={c.id}
                  card={c}
                  levelRank={levelRank}
                  size={isLandscapeMode ? 'lg' : 'md'}
                  disabled
                />
              ))
            ) : (
              <div className="text-emerald-300/40 text-xs font-bold flex items-center gap-1.5">
                <span>等待出牌中...</span>
              </div>
            )}
          </div>
        </div>

        {/* East Opponent (Seat 1) */}
        <div className="flex flex-col items-center">
          {renderSeatAvatar(1)}
          {isGodMode && hands[1] && (
            <div className="flex flex-col -space-y-6 mt-1 max-h-[140px] overflow-y-auto p-0.5 bg-black/40 rounded-lg">
              {hands[1].map((c) => (
                <PlayingCard key={c.id} card={c} levelRank={levelRank} size="sm" compact />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Area: Tactile 3D Action Controls & User Cards */}
      <div className="relative z-20 px-2 pb-2 sm:px-4 flex flex-col items-center space-y-1.5 w-full">
        {/* iOS 3D Tactile Action Bar */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 bg-slate-950/85 backdrop-blur-xl p-1.5 rounded-2xl border border-amber-500/40 shadow-2xl">
          {/* 3-Option Grouping Mode Switcher (1.由大到小 / 2.教练组牌 / 3.玩家组牌) */}
          <div className="flex items-center bg-slate-900 p-0.5 rounded-xl border border-slate-800 text-[11px] font-black">
            <button
              onClick={() => handleSelectGroupingMode('natural')}
              className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
                groupingMode === 'natural'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="按点数由大到小依次连续排列"
            >
              <ArrowDownWideNarrow className="w-3 h-3" />
              <span>1.由大到小</span>
            </button>
            <button
              onClick={() => handleSelectGroupingMode('coach')}
              className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
                groupingMode === 'coach'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="AI教练根据掼蛋最佳策略自动成套理牌"
            >
              <Sparkles className="w-3 h-3" />
              <span>2.教练建议</span>
            </button>
            <button
              onClick={() => handleSelectGroupingMode('manual')}
              className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
                groupingMode === 'manual'
                  ? 'bg-gradient-to-r from-sky-400 to-sky-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="玩家自由选择任意手牌编组管理"
            >
              <Layers className="w-3 h-3" />
              <span>3.玩家组牌</span>
            </button>
          </div>

          {/* Manual Mode Auxiliary Buttons: 编为一组 / 还原组牌 */}
          {groupingMode === 'manual' && (
            <div className="flex items-center space-x-1 animate-fade-in">
              <button
                onClick={handleCreateCustomGroup}
                disabled={selectedIds.size === 0}
                className={`px-2.5 py-1 rounded-lg text-xs font-black flex items-center space-x-1 transition-all ${
                  selectedIds.size > 0
                    ? 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow active:scale-95'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
                title="将当前选中的牌编入一个新分组"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>编入组 ({selectedIds.size})</span>
              </button>

              {customGroups.length > 0 && (
                <button
                  onClick={handleResetCustomGroups}
                  className="px-2 py-1 rounded-lg text-xs font-bold text-rose-300 hover:text-rose-200 bg-rose-950/60 border border-rose-500/30 flex items-center space-x-0.5 transition-all"
                  title="拆解所有自定义分组，还原为散牌"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>还原</span>
                </button>
              )}
            </div>
          )}

          {/* Hint Button */}
          <button
            onClick={onAutoHint}
            disabled={!isMyTurn}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center space-x-1 transition-all shadow-md ${
              isMyTurn
                ? 'bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 text-white active:scale-95'
                : 'bg-slate-800/60 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>提示</span>
          </button>

          {/* Pass Button */}
          <button
            onClick={onPass}
            disabled={!isMyTurn || !currentCombo}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center space-x-1 transition-all shadow-md ${
              isMyTurn && currentCombo
                ? 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 text-white active:scale-95'
                : 'bg-slate-800/60 text-slate-500 cursor-not-allowed'
            }`}
          >
            <X className="w-3.5 h-3.5" />
            <span>不要 / 过</span>
          </button>

          {/* Golden 3D Play Move Button */}
          <button
            onClick={onPlay}
            disabled={!isMyTurn || selectedIds.size === 0}
            className={`px-5 py-2 rounded-xl text-sm font-black flex items-center space-x-1.5 transition-all duration-150 ${
              isMyTurn && selectedIds.size > 0
                ? 'bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 hover:from-amber-200 hover:to-amber-500 text-slate-950 shadow-[0_8px_20px_rgba(245,158,11,0.5)] active:scale-95 active:translate-y-0.5 ring-2 ring-amber-200 border-t border-amber-100'
                : 'bg-slate-800/80 text-slate-500 cursor-not-allowed shadow-none'
            }`}
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>出牌 ({selectedIds.size})</span>
          </button>

          {/* Reset Selection */}
          {selectedIds.size > 0 && (
            <button
              onClick={onClearSelection}
              className="text-slate-400 hover:text-white text-[11px] font-bold underline px-1"
            >
              取消
            </button>
          )}
        </div>

        {/* User Hand Cards View: Zero-Scroll Adaptive Layout */}
        <div className="w-full flex justify-center items-end min-h-[95px] sm:min-h-[115px] px-1 overflow-visible">
          {/* Mode 1: 原始由大到小连续排列 (Natural Rank Sort with Dynamic Overlap - No Horizontal Scrollbar!) */}
          {groupingMode === 'natural' && renderAdaptiveCards(naturalSortedHand)}

          {/* Mode 2: 教练建议组牌 (AI Optimizer Clustered Groups - Responsive Wrap) */}
          {groupingMode === 'coach' && (
            <div className="flex flex-wrap justify-center items-end gap-1.5 sm:gap-2.5 max-w-4xl">
              {bestGroups.map((group, gIdx) => (
                <div
                  key={gIdx}
                  className="flex items-end -space-x-4 sm:-space-x-5.5 p-1 bg-black/25 hover:bg-black/35 rounded-2xl transition-colors border border-amber-500/20 shrink-0"
                >
                  {group.cards.map((c) => (
                    <PlayingCard
                      key={c.id}
                      card={c}
                      levelRank={levelRank}
                      isSelected={selectedIds.has(c.id)}
                      onClick={() => onToggleCard(c.id)}
                      size={isLandscapeMode ? 'lg' : 'md'}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Mode 3: 玩家自由手动组牌 (Player Custom Groups + Ungrouped Cards) */}
          {groupingMode === 'manual' && (
            <div className="flex flex-wrap justify-center items-end gap-1.5 sm:gap-2.5 max-w-4xl">
              {/* Render player's created custom groups */}
              {customGroups.map((group, gIdx) => (
                <div
                  key={gIdx}
                  className="relative flex items-end -space-x-4 sm:-space-x-5.5 p-1 bg-sky-950/40 hover:bg-sky-950/60 rounded-2xl transition-colors border border-sky-500/30 group shrink-0"
                >
                  {/* Dissolve Group Pill */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDissolveCustomGroup(gIdx);
                    }}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sky-900 hover:bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full border border-sky-400 shadow z-30 transition-colors flex items-center gap-0.5"
                    title="拆解该组"
                  >
                    <span>组{gIdx + 1}</span>
                    <X className="w-2.5 h-2.5" />
                  </button>

                  {group.map((c) => (
                    <PlayingCard
                      key={c.id}
                      card={c}
                      levelRank={levelRank}
                      isSelected={selectedIds.has(c.id)}
                      onClick={() => onToggleCard(c.id)}
                      size={isLandscapeMode ? 'lg' : 'md'}
                    />
                  ))}
                </div>
              ))}

              {/* Ungrouped / Remaining Cards */}
              {ungroupedCards.length > 0 && (
                <div className="relative flex items-end -space-x-4 sm:-space-x-5.5 p-1 bg-black/20 rounded-2xl border border-white/10 shrink-0">
                  {customGroups.length > 0 && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-800 text-slate-400 text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-slate-600 shadow z-30 pointer-events-none">
                      散牌
                    </div>
                  )}
                  {ungroupedCards.map((c) => (
                    <PlayingCard
                      key={c.id}
                      card={c}
                      levelRank={levelRank}
                      isSelected={selectedIds.has(c.id)}
                      onClick={() => onToggleCard(c.id)}
                      size={isLandscapeMode ? 'lg' : 'md'}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Floating Emoji Picker Modal */}
      {showEmojiPicker && (
        <div className="absolute top-12 left-4 z-50 bg-slate-900/95 backdrop-blur-xl border border-amber-500/40 rounded-2xl p-2.5 shadow-2xl animate-fade-in space-y-1.5 max-w-xs text-left">
          <div className="flex items-center justify-between text-xs font-black text-amber-300">
            <span>快捷表情</span>
            <button onClick={() => setShowEmojiPicker(false)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {POPULAR_EMOJIS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectEmoji(item)}
                className="bg-slate-800 hover:bg-slate-700 p-2 rounded-xl text-xl flex items-center justify-center transition-transform active:scale-90"
              >
                {item.emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Floating Voice Phrase Picker Modal */}
      {showVoicePicker && (
        <div className="absolute top-12 left-4 z-50 bg-slate-900/95 backdrop-blur-xl border border-sky-500/40 rounded-2xl p-2.5 shadow-2xl animate-fade-in space-y-1.5 max-w-xs text-left">
          <div className="flex items-center justify-between text-xs font-black text-sky-300">
            <span>实战牌语与呼叫</span>
            <button onClick={() => setShowVoicePicker(false)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
            {POPULAR_PHRASES.map((phrase) => (
              <button
                key={phrase.id}
                onClick={() => handleSelectPhrase(phrase)}
                className="w-full text-left text-xs bg-slate-800 hover:bg-slate-700 p-1.5 rounded-lg text-slate-200 hover:text-white font-bold transition-all"
              >
                {phrase.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Card Back Customizer Modal */}
      <CardBackCustomizerModal
        isOpen={showCardBackModal}
        onClose={() => setShowCardBackModal(false)}
      />
    </div>
  );
};
