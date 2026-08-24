import React, { useState } from 'react';
import { GameState, PlayerSeat } from '../../core/types';
import { PlayingCard } from '../Card/PlayingCard';
import { describeCombo } from '../../core/combos';
import { choosePlan } from '../../core/optimizer';
import { Sound } from '../../core/audio';
import { Voice, POPULAR_EMOJIS, POPULAR_PHRASES, VoicePhrase } from '../../core/voice';
import {
  Users,
  Crown,
  Sparkles,
  RefreshCw,
  Volume2,
  VolumeX,
  CheckSquare,
  X,
  Eye,
  EyeOff,
  Smile,
  MessageCircle,
} from 'lucide-react';

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
  const [groupingMode, setGroupingMode] = useState<'plan' | 'rank'>('plan');
  const [isMuted, setIsMuted] = useState<boolean>(() => Sound.getIsMuted());
  const [showChecklistModal, setShowChecklistModal] = useState<boolean>(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [showVoicePicker, setShowVoicePicker] = useState<boolean>(false);
  const [activeEmojis, setActiveEmojis] = useState<Record<number, { emoji: string; text?: string } | null>>({});

  const {
    hands,
    currentTurn,
    currentCombo,
    trickPlays,
    levelRank,
    teamLevels,
    finishedOrder,
    isGodMode,
    mode = '4p',
  } = gameState;

  const is6p = mode === '6p';
  const userHand = hands[0] || [];
  const isMyTurn = currentTurn === 0;

  // Plan groups for user hand
  const planResult = choosePlan(userHand, levelRank);
  const bestGroups = planResult.best.groups;

  const seatNames4p: Record<number, string> = {
    0: '我 (南)',
    1: '右家 (东)',
    2: '对家·搭档 (北)',
    3: '左家 (西)',
  };

  const seatNames6p: Record<number, string> = {
    0: '我 (南·主队)',
    1: '东南 (对方1)',
    2: '西北 (搭档1)',
    3: '正北 (对方2)',
    4: '东北 (搭档2)',
    5: '西南 (对方3)',
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
    }, 3000);
  };

  const handleSelectEmoji = (item: (typeof POPULAR_EMOJIS)[0]) => {
    triggerSeatEmoji(0, item.emoji, item.label);
    setShowEmojiPicker(false);
  };

  const handleSelectPhrase = (phrase: VoicePhrase) => {
    triggerSeatEmoji(0, '💬', phrase.text);
    Voice.triggerPhrase(phrase);
    setShowVoicePicker(false);
  };

  // Helper to render other player avatar & played cards
  const renderPlayerSeatNode = (seat: number) => {
    const isTurn = currentTurn === seat;
    const isTeammate = seat % 2 === 0;
    const handLen = hands[seat]?.length || 0;
    const rankIndex = finishedOrder.indexOf(seat as PlayerSeat);
    const played = trickPlays[seat];
    const emojiData = activeEmojis[seat];

    return (
      <div key={seat} className="flex flex-col items-center relative select-none">
        {/* Floating Emoji Bubble */}
        {emojiData && (
          <div className="absolute -top-7 z-30 bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full shadow-2xl text-[10px] sm:text-xs animate-bounce border border-amber-300 flex items-center gap-1">
            <span>{emojiData.emoji}</span>
            <span>{emojiData.text}</span>
          </div>
        )}

        {/* Seat Badge */}
        <div
          className={`flex items-center space-x-1 px-2 sm:px-2.5 py-0.5 rounded-full transition-all duration-300 ${
            isTurn
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black ring-2 ring-amber-400 shadow-md scale-105'
              : isTeammate
              ? 'bg-slate-950/85 text-emerald-300 border border-emerald-500/40 shadow'
              : 'bg-slate-950/85 text-rose-300 border border-rose-500/40 shadow'
          }`}
        >
          <span className="text-[10px] sm:text-[11px] font-bold">{seatNames[seat]}</span>
          <span className="text-[9px] sm:text-[10px] bg-slate-900/90 text-amber-300 px-1.5 py-0.2 rounded-full font-extrabold">
            余 {handLen}
          </span>
          {rankIndex !== -1 && (
            <span className="bg-emerald-500 text-slate-950 text-[8px] sm:text-[9px] px-1 py-0.2 rounded-full font-black">
              第{rankIndex + 1}名
            </span>
          )}
        </div>

        {/* God Mode: Show Face-up Cards */}
        {isGodMode && handLen > 0 && (
          <div className="mt-0.5 flex -space-x-5 max-w-[130px] sm:max-w-[150px] overflow-x-auto p-0.5 bg-black/40 rounded border border-amber-500/30">
            {hands[seat].map((card) => (
              <PlayingCard key={card.id} card={card} levelRank={levelRank} size="sm" compact />
            ))}
          </div>
        )}

        {/* Trick Play Slot */}
        <div className="h-8 sm:h-9 flex items-center justify-center mt-0.5">
          {played ? (
            played.action === 'pass' ? (
              <span className="text-[10px] bg-slate-900/90 text-slate-400 px-2 py-0.2 rounded-full border border-slate-700 font-bold">
                过牌
              </span>
            ) : (
              <div className="flex -space-x-5 sm:-space-x-6 drop-shadow-md animate-fade-in">
                {played.cards?.map((card) => (
                  <PlayingCard key={card.id} card={card} levelRank={levelRank} size="sm" />
                ))}
              </div>
            )
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full h-full min-h-0 rounded-2xl sm:rounded-3xl table-felt border-4 sm:border-[6px] border-amber-950/80 shadow-2xl p-2 sm:p-2.5 flex flex-col justify-between overflow-hidden ring-1 ring-amber-600/40 select-none">
      {/* Top Banner: Mode Indicator, Level Rank, God Mode, Team Scores & Controls */}
      <div className="shrink-0 flex items-center justify-between z-20">
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Level Badge */}
          <div className="flex items-center space-x-1.5 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-500/40 shadow">
            <div className="flex items-center space-x-1.5 text-amber-400 font-black text-xs">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>打【{levelRank}】</span>
              <span className="text-[10px] bg-gradient-to-r from-rose-600 to-amber-600 text-white px-1.5 py-0.2 rounded-full font-bold shadow">
                ♥{levelRank} 逢人配
              </span>
              <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-bold border border-amber-500/30">
                {is6p ? '3副牌·6人团战' : '2副牌·4人标准'}
              </span>
            </div>
          </div>

          {/* God Mode (明牌模式) Toggle */}
          {onToggleGodMode && (
            <button
              onClick={onToggleGodMode}
              className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1 transition-all shadow ${
                isGodMode
                  ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 animate-pulse'
                  : 'bg-slate-950/85 text-slate-300 border border-slate-700/80 hover:text-white'
              }`}
              title="上帝模式：透视全场所有玩家手牌"
            >
              {isGodMode ? <Eye className="w-3 h-3 text-slate-950" /> : <EyeOff className="w-3 h-3 text-slate-400" />}
              <span>{isGodMode ? '上帝模式·开' : '明牌模式'}</span>
            </button>
          )}
        </div>

        {/* Center/Right: Checklist, Scores & Audio */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          <button
            onClick={() => setShowChecklistModal(true)}
            className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 shadow transition-transform active:scale-95"
            title="出牌前10秒检查清单"
          >
            <CheckSquare className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">10秒</span>Checklist
          </button>

          <div className="flex items-center space-x-2 bg-slate-950/85 backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-full border border-slate-700/80 text-[11px] shadow">
            <div className="flex items-center space-x-1">
              <span className="text-emerald-400 font-bold">{is6p ? '我方(3人):' : '我方:'}</span>
              <span className="text-white font-extrabold">{teamLevels[0]}级</span>
            </div>
            <div className="text-slate-600">|</div>
            <div className="flex items-center space-x-1">
              <span className="text-rose-400 font-bold">{is6p ? '对方(3人):' : '对方:'}</span>
              <span className="text-white font-extrabold">{teamLevels[1]}级</span>
            </div>
          </div>

          <button
            onClick={handleToggleSound}
            className="bg-slate-950/85 hover:bg-slate-900 text-amber-400 p-1.5 rounded-full border border-slate-700 transition-transform active:scale-90 shadow"
            title={isMuted ? '开启音效' : '静音'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-500" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Dynamic Table Layout: 4-Player vs 6-Player */}
      {!is6p ? (
        /* 4-Player Standard Layout */
        <>
          {/* North (Seat 2) */}
          <div className="shrink-0 flex flex-col items-center z-10">{renderPlayerSeatNode(2)}</div>

          {/* Middle Row: West (3) + Center Trick + East (1) */}
          <div className="flex-1 grid grid-cols-3 items-center z-10 px-1 sm:px-2 min-h-0">
            <div className="flex flex-col items-start">{renderPlayerSeatNode(3)}</div>

            {/* Center Trick Podium */}
            <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-black/40 border border-emerald-500/30 backdrop-blur-md min-h-[56px] shadow-xl mx-auto w-full max-w-[210px]">
              {currentCombo ? (
                <div className="text-center space-y-0.5 animate-fade-in">
                  <div className="text-[10px] text-amber-300/80 font-bold uppercase tracking-wider">
                    需压过牌型
                  </div>
                  <div className="text-xs sm:text-sm font-black text-amber-400 flex items-center justify-center gap-1 drop-shadow">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{describeCombo(currentCombo)}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-0.5">
                  <div className="text-xs font-black text-emerald-300 drop-shadow">新一墩出牌</div>
                  <div className="text-[10px] text-slate-300">任意合法牌型皆可领出</div>
                </div>
              )}
            </div>

            <div className="flex flex-col items-end">{renderPlayerSeatNode(1)}</div>
          </div>
        </>
      ) : (
        /* 6-Player Hexagonal 3v3 Layout */
        <div className="flex-1 flex flex-col justify-between z-10 px-1 min-h-0">
          {/* Top Row: Seat 2 (NW), Seat 3 (North), Seat 4 (NE) */}
          <div className="grid grid-cols-3 items-start gap-1">
            <div className="flex flex-col items-start">{renderPlayerSeatNode(2)}</div>
            <div className="flex flex-col items-center">{renderPlayerSeatNode(3)}</div>
            <div className="flex flex-col items-end">{renderPlayerSeatNode(4)}</div>
          </div>

          {/* Middle Row: Seat 5 (SW) + Center Trick + Seat 1 (SE) */}
          <div className="grid grid-cols-3 items-center gap-1">
            <div className="flex flex-col items-start">{renderPlayerSeatNode(5)}</div>

            {/* Center Trick Podium */}
            <div className="flex flex-col items-center justify-center p-1.5 rounded-2xl bg-black/50 border border-emerald-500/30 backdrop-blur-md min-h-[50px] shadow-xl mx-auto w-full max-w-[200px]">
              {currentCombo ? (
                <div className="text-center space-y-0.5 animate-fade-in">
                  <div className="text-[9px] text-amber-300/80 font-bold uppercase">需压过</div>
                  <div className="text-xs font-black text-amber-400 flex items-center justify-center gap-1 drop-shadow">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>{describeCombo(currentCombo)}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-0.5">
                  <div className="text-xs font-black text-emerald-300 drop-shadow">新一墩出牌</div>
                  <div className="text-[9px] text-slate-300">3v3 团战首发领牌</div>
                </div>
              )}
            </div>

            <div className="flex flex-col items-end">{renderPlayerSeatNode(1)}</div>
          </div>
        </div>
      )}

      {/* User Hand Area (South: Seat 0) */}
      <div className="shrink-0 flex flex-col items-center space-y-1 z-20 relative">
        {/* Floating Emoji Bubble for User */}
        {activeEmojis[0] && (
          <div className="absolute -top-8 z-30 bg-amber-500 text-slate-950 font-black px-3 py-1 rounded-full shadow-2xl text-xs animate-bounce border-2 border-amber-300 flex items-center gap-1.5">
            <span className="text-sm">{activeEmojis[0].emoji}</span>
            <span>{activeEmojis[0].text}</span>
          </div>
        )}

        {/* User Played Cards in current trick */}
        <div className="h-8 sm:h-9 flex items-center justify-center">
          {trickPlays[0] ? (
            trickPlays[0]?.action === 'pass' ? (
              <span className="text-[11px] bg-slate-900/90 text-slate-400 px-2.5 py-0.5 rounded-full border border-slate-700 font-bold shadow">
                过牌
              </span>
            ) : (
              <div className="flex -space-x-5 sm:-space-x-6 drop-shadow-xl animate-fade-in">
                {trickPlays[0]?.cards?.map((card) => (
                  <PlayingCard key={card.id} card={card} levelRank={levelRank} size="sm" />
                ))}
              </div>
            )
          ) : null}
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-800 shadow-md">
          {/* Voice Banter Button */}
          <div className="relative">
            <button
              onClick={() => {
                setShowVoicePicker(!showVoicePicker);
                setShowEmojiPicker(false);
              }}
              className="bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-[11px] p-1.5 rounded-lg border border-slate-600 flex items-center transition-transform active:scale-95"
              title="牌桌语音"
            >
              <MessageCircle className="w-3.5 h-3.5 text-amber-400" />
            </button>

            {showVoicePicker && (
              <div className="absolute bottom-10 left-0 w-48 bg-slate-900 border border-slate-700 rounded-xl p-2 shadow-2xl z-50 space-y-1 max-h-56 overflow-y-auto">
                <div className="text-[10px] text-slate-400 font-bold px-1 mb-1">热门牌桌语音：</div>
                {POPULAR_PHRASES.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPhrase(p)}
                    className="w-full text-left text-xs text-slate-200 hover:text-amber-300 hover:bg-slate-800 px-2 py-1 rounded transition-all flex items-center justify-between"
                  >
                    <span>{p.text}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Emoji Reaction Button */}
          <div className="relative">
            <button
              onClick={() => {
                setShowEmojiPicker(!showEmojiPicker);
                setShowVoicePicker(false);
              }}
              className="bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-[11px] p-1.5 rounded-lg border border-slate-600 flex items-center transition-transform active:scale-95"
              title="互动表情"
            >
              <Smile className="w-3.5 h-3.5 text-amber-400" />
            </button>

            {showEmojiPicker && (
              <div className="absolute bottom-10 left-0 w-52 bg-slate-900 border border-slate-700 rounded-xl p-2 shadow-2xl z-50 grid grid-cols-5 gap-1.5">
                {POPULAR_EMOJIS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectEmoji(item)}
                    className="p-1 text-lg hover:bg-slate-800 rounded transition-transform active:scale-125"
                    title={item.label}
                  >
                    {item.emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              Sound.playCardDeal();
              setGroupingMode(groupingMode === 'plan' ? 'rank' : 'plan');
            }}
            className="bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-[11px] px-2.5 py-1 rounded-lg border border-slate-600 font-bold flex items-center space-x-1 transition-transform active:scale-95"
          >
            <RefreshCw className="w-3 h-3 text-amber-400" />
            <span>{groupingMode === 'plan' ? '方案分组' : '点数顺序'}</span>
          </button>

          <button
            onClick={onClearSelection}
            disabled={selectedIds.size === 0}
            className="bg-slate-800/90 hover:bg-slate-700 text-slate-300 text-[11px] px-2 py-1 rounded-lg border border-slate-600 font-bold disabled:opacity-30"
          >
            重选
          </button>

          <button
            onClick={onAutoHint}
            className="bg-gradient-to-r from-amber-500/30 to-amber-600/30 hover:from-amber-500/40 hover:to-amber-600/40 text-amber-300 border border-amber-500/50 text-[11px] px-2.5 py-1 rounded-lg font-black flex items-center space-x-1 shadow transition-transform active:scale-95"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>教练支招</span>
          </button>

          {isMyTurn && (
            <>
              <button
                onClick={onPass}
                disabled={!currentCombo}
                className="bg-slate-700 hover:bg-slate-600 text-white font-extrabold text-[11px] sm:text-xs px-3.5 py-1 rounded-lg shadow disabled:opacity-30 transition-transform active:scale-95"
              >
                过牌
              </button>

              <button
                onClick={onPlay}
                disabled={selectedIds.size === 0}
                className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-black text-[11px] sm:text-xs px-4 sm:px-5 py-1 rounded-lg shadow-lg transition-transform active:scale-95 disabled:opacity-30 flex items-center space-x-1"
              >
                <span>出牌 ({selectedIds.size}张)</span>
              </button>
            </>
          )}
        </div>

        {/* User Hand Display */}
        <div className="w-full max-w-4xl overflow-x-auto pb-1 flex justify-center items-end min-h-[75px] sm:min-h-[84px]">
          {groupingMode === 'plan' ? (
            <div className="flex space-x-1.5 sm:space-x-2 items-end">
              {bestGroups.map((group, gIdx) => (
                <div
                  key={gIdx}
                  className="bg-black/30 p-1 rounded-lg border border-white/10 flex -space-x-5 sm:-space-x-6 items-end shadow-inner"
                >
                  {group.cards.map((card) => (
                    <PlayingCard
                      key={card.id}
                      card={card}
                      levelRank={levelRank}
                      isSelected={selectedIds.has(card.id)}
                      onClick={() => onToggleCard(card.id)}
                      size="md"
                    />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex -space-x-5 sm:-space-x-6 items-end">
              {userHand.map((card) => (
                <PlayingCard
                  key={card.id}
                  card={card}
                  levelRank={levelRank}
                  isSelected={selectedIds.has(card.id)}
                  onClick={() => onToggleCard(card.id)}
                  size="md"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 10-Second Pre-Move Checklist Modal */}
      {showChecklistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border-2 border-amber-500/50 rounded-2xl max-w-md w-full p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2 text-amber-400 font-extrabold text-xs">
                <CheckSquare className="w-4 h-4" />
                <span>实战出牌前 10 秒检查清单 (Checklist)</span>
              </div>
              <button
                onClick={() => setShowChecklistModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-200">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-start gap-2">
                <span className="font-bold text-amber-400 shrink-0">1.</span>
                <span><strong>对门关死否？</strong>搭档领先绝不超车，顺搭档之势。</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-start gap-2">
                <span className="font-bold text-amber-400 shrink-0">2.</span>
                <span><strong>谁打谁收？</strong>出试探小牌，是否有大王/级牌回收牌权。</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-start gap-2">
                <span className="font-bold text-amber-400 shrink-0">3.</span>
                <span><strong>弱路先行？</strong>优先处理杂单小牌，大牌留后当安全门。</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-start gap-2">
                <span className="font-bold text-amber-400 shrink-0">4.</span>
                <span><strong>炸后有路？</strong>炸前先想炸后出什么，无路开炸是盲目。</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-start gap-2">
                <span className="font-bold text-amber-400 shrink-0">5.</span>
                <span><strong>残局封堵？</strong>下家报一不出单，报二不发对，报五防顺子。</span>
              </div>
            </div>

            <button
              onClick={() => setShowChecklistModal(false)}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black py-2 rounded-xl text-xs shadow transition-transform active:scale-95"
            >
              已检查完毕，继续出牌
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
