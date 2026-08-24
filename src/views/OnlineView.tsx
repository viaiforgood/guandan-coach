import React, { useState, useEffect } from 'react';
import { onlineManager, RoomPlayer } from '../core/online';
import { GameState, PlayerSeat } from '../core/types';
import { PokerTable } from '../components/Board/PokerTable';
import { classify } from '../core/combos';
import { Sound } from '../core/audio';
import { Globe, Users, PlusCircle, LogIn, Wifi, Copy, Check, Bot, Crown, ArrowRight } from 'lucide-react';

export const OnlineView: React.FC = () => {
  const [isInRoom, setIsInRoom] = useState<boolean>(false);
  const [roomCode, setRoomCode] = useState<string>('8888');
  const [joinCode, setJoinCode] = useState<string>('');
  const [playerName, setPlayerName] = useState<string>('大杀四方');
  const [players, setPlayers] = useState<RoomPlayer[]>([]);
  const [gameState, setGameState] = useState<GameState>(onlineManager.gameState);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    onlineManager.onStateUpdate = (newGameState, newPlayers) => {
      setGameState({ ...newGameState });
      setPlayers([...newPlayers]);
    };

    onlineManager.onError = (msg) => {
      showToast(msg);
    };

    return () => {
      onlineManager.disconnect();
    };
  }, []);

  const handleCreateRoom = async () => {
    try {
      showToast('正在创建在线房间...');
      const code = await onlineManager.createRoom(roomCode || '8888', playerName);
      setRoomCode(code);
      setPlayers([...onlineManager.players]);
      setGameState({ ...onlineManager.gameState });
      setIsInRoom(true);
      showToast(`房间【${code}】创建成功！等待好友加入...`);
    } catch (e: any) {
      showToast(`创建失败: ${e.message}`);
    }
  };

  const handleJoinRoom = async () => {
    try {
      showToast(`正在连接房间【${joinCode}】...`);
      await onlineManager.joinRoom(joinCode, playerName);
      setIsInRoom(true);
      showToast(`成功加入房间【${joinCode}】！`);
    } catch (e: any) {
      showToast(`加入失败: ${e.message || '请检查房间码'}`);
    }
  };

  const handleCopyRoomLink = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast(`房间码 ${roomCode} 已复制！发送给好友即可联机。`);
  };

  const toggleCard = (cardId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) next.delete(cardId);
      else next.add(cardId);
      return next;
    });
  };

  const handlePlayMove = () => {
    const myHand = gameState.hands[onlineManager.mySeat];
    const selectedCards = myHand.filter((c) => selectedIds.has(c.id));
    const combo = classify(selectedCards, gameState.levelRank);

    if (!combo) {
      showToast('所选牌不构成任何有效掼蛋牌型！');
      return;
    }

    Sound.playCardPlay();
    onlineManager.submitMove('play', combo);
    setSelectedIds(new Set());
  };

  const handlePassMove = () => {
    Sound.playPass();
    onlineManager.submitMove('pass');
    setSelectedIds(new Set());
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="h-full w-full flex flex-col min-h-0 overflow-hidden relative select-none">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-slate-950 font-black px-4 py-2 rounded-xl shadow-2xl animate-bounce border-2 border-amber-300 text-xs sm:text-sm">
          {notification}
        </div>
      )}

      {!isInRoom ? (
        /* Lobby View */
        <div className="flex-1 overflow-y-auto p-3 flex flex-col items-center justify-center max-w-xl mx-auto w-full space-y-4">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-red-500 flex items-center justify-center mx-auto text-2xl shadow-xl shadow-amber-500/20">
              🌐
            </div>
            <h2 className="text-xl font-black text-white">掼蛋在线多人联机对战</h2>
            <p className="text-xs text-slate-400">
              支持 1 至 4 人实时跨设备联机，未坐满位置自动由大师 AI NPC 替补补齐！
            </p>
          </div>

          {/* Nickname input */}
          <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-xl">
            <label className="text-xs font-bold text-slate-300">你的牌手昵称：</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="输入你的昵称..."
            />
          </div>

          {/* Create or Join Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            {/* Create Room Card */}
            <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-4 space-y-3 shadow-xl flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-1.5 text-amber-400 font-bold text-xs">
                  <PlusCircle className="w-4 h-4" />
                  <span>创建专属房间</span>
                </div>
                <p className="text-[11px] text-slate-400">自定义4位房间码，邀请好友加入</p>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  maxLength={6}
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-center font-mono text-base font-black text-amber-400"
                  placeholder="如: 8888"
                />

                <button
                  onClick={handleCreateRoom}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black py-2 rounded-xl text-xs shadow transition-transform active:scale-95 flex items-center justify-center gap-1"
                >
                  <span>一键创建房间</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Join Room Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-1.5 text-emerald-400 font-bold text-xs">
                  <LogIn className="w-4 h-4" />
                  <span>输入房间码加入</span>
                </div>
                <p className="text-[11px] text-slate-400">输入好友分享的房间码直接入局</p>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  maxLength={6}
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-center font-mono text-base font-black text-emerald-400 uppercase"
                  placeholder="输入4位房间码"
                />

                <button
                  onClick={handleJoinRoom}
                  disabled={!joinCode.trim()}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-black py-2 rounded-xl text-xs shadow transition-transform active:scale-95 disabled:opacity-30 flex items-center justify-center gap-1"
                >
                  <span>立即加入对局</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* In-Room Table Game View */
        <div className="h-full w-full flex flex-col gap-1.5 min-h-0 overflow-hidden">
          {/* Room Topbar */}
          <div className="shrink-0 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center justify-between text-xs shadow-md">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1.5 text-amber-400 font-black">
                <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>房间: {roomCode}</span>
                <button
                  onClick={handleCopyRoomLink}
                  className="text-slate-400 hover:text-white p-0.5 rounded"
                  title="复制房间码"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>

              {/* Player Seats List */}
              <div className="hidden sm:flex items-center space-x-2">
                {players.map((p) => (
                  <span
                    key={p.seat}
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                      p.seat === onlineManager.mySeat
                        ? 'bg-amber-500 text-slate-950'
                        : p.isAI
                        ? 'bg-slate-800 text-slate-400'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {p.isAI ? <Bot className="w-2.5 h-2.5" /> : <Users className="w-2.5 h-2.5" />}
                    <span>{p.name}</span>
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                onlineManager.disconnect();
                setIsInRoom(false);
              }}
              className="text-rose-400 hover:text-rose-300 text-xs font-bold px-2 py-0.5 bg-rose-500/10 rounded-lg border border-rose-500/20"
            >
              退出房间
            </button>
          </div>

          {/* Table */}
          <div className="flex-1 min-h-0 w-full">
            <PokerTable
              gameState={gameState}
              selectedIds={selectedIds}
              onToggleCard={toggleCard}
              onClearSelection={() => setSelectedIds(new Set())}
              onPlay={handlePlayMove}
              onPass={handlePassMove}
              onAutoHint={() => {}}
              onSendEmoji={(seat, emoji, text) => onlineManager.sendEmoji(emoji, text)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
