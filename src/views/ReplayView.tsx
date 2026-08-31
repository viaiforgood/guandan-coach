import React, { useState, useEffect } from 'react';
import { ReplayRecord, LevelRank, PlayerSeat } from '../core/types';
import { getReplayStep } from '../core/replay';
import { exportReplayRecord, importReplayRecord } from '../core/engine';
import { PlayingCard } from '../components/Card/PlayingCard';
import { describeCombo } from '../core/combos';
import { Sound } from '../core/audio';
import {
  Film,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  Users,
  Crown,
} from 'lucide-react';

interface ReplayViewProps {
  initialRecord?: ReplayRecord | null;
  onLaunchSwapMatch?: (record: ReplayRecord) => void;
}

// Sample built-in master game record for immediate review
const SAMPLE_REPLAY_JSON = `{"version":"1.0","timestamp":1724483000000,"levelRank":"2","teamLevels":[2,2],"initialHands":[[{"id":"c1","suit":"H","rank":"2"},{"id":"c2","suit":"S","rank":"3"},{"id":"c3","suit":"H","rank":"3"},{"id":"c4","suit":"C","rank":"3"},{"id":"c5","suit":"S","rank":"4"},{"id":"c6","suit":"H","rank":"4"},{"id":"c7","suit":"C","rank":"4"},{"id":"c8","suit":"S","rank":"5"},{"id":"c9","suit":"S","rank":"6"},{"id":"c10","suit":"S","rank":"7"},{"id":"c11","suit":"S","rank":"SJ"},{"id":"c12","suit":"H","rank":"BJ"}],[{"id":"c13","suit":"S","rank":"8"},{"id":"c14","suit":"H","rank":"8"},{"id":"c15","suit":"C","rank":"8"},{"id":"c16","suit":"D","rank":"8"},{"id":"c17","suit":"S","rank":"9"},{"id":"c18","suit":"H","rank":"9"},{"id":"c19","suit":"S","rank":"10"},{"id":"c20","suit":"H","rank":"10"}],[{"id":"c21","suit":"S","rank":"K"},{"id":"c22","suit":"H","rank":"K"},{"id":"c23","suit":"C","rank":"K"},{"id":"c24","suit":"S","rank":"A"},{"id":"c25","suit":"H","rank":"A"}],[{"id":"c26","suit":"S","rank":"Q"},{"id":"c27","suit":"H","rank":"Q"},{"id":"c28","suit":"C","rank":"Q"}]],"history":[{"seat":0,"action":"play","combo":{"category":"straight","length":5,"compareValue":7,"isBomb":false,"cards":[{"id":"c2","suit":"S","rank":"3"},{"id":"c5","suit":"S","rank":"4"},{"id":"c8","suit":"S","rank":"5"},{"id":"c9","suit":"S","rank":"6"},{"id":"c10","suit":"S","rank":"7"}]}},{"seat":1,"action":"play","combo":{"category":"bomb","length":4,"compareValue":8,"isBomb":true,"bombTier":4,"cards":[{"id":"c13","suit":"S","rank":"8"},{"id":"c14","suit":"H","rank":"8"},{"id":"c15","suit":"C","rank":"8"},{"id":"c16","suit":"D","rank":"8"}]}},{"seat":2,"action":"pass"},{"seat":3,"action":"pass"},{"seat":0,"action":"play","combo":{"category":"bomb","length":4,"compareValue":14,"isBomb":true,"bombTier":4,"cards":[{"id":"c1","suit":"H","rank":"2"},{"id":"c2","suit":"S","rank":"3"},{"id":"c3","suit":"H","rank":"3"},{"id":"c4","suit":"C","rank":"3"}]}},{"seat":1,"action":"pass"},{"seat":2,"action":"pass"},{"seat":3,"action":"pass"}],"finishedOrder":[0,2,1,3],"title":"大师对决经典局 (打2)"}`;

export const ReplayView: React.FC<ReplayViewProps> = ({ initialRecord, onLaunchSwapMatch }) => {
  const [record, setRecord] = useState<ReplayRecord>(() => {
    if (initialRecord) return initialRecord;
    try {
      return JSON.parse(SAMPLE_REPLAY_JSON);
    } catch {
      return JSON.parse(SAMPLE_REPLAY_JSON);
    }
  });

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeedMs, setPlaySpeedMs] = useState<number>(1200);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [importText, setImportText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  const stepState = getReplayStep(record, currentStepIndex);
  const totalSteps = record.history.length;

  const is6p = record.mode === '6p' || record.initialHands.length === 6;
  const seatNames: Record<number, string> = is6p
    ? {
        0: '我方 (南)',
        1: '东南 (对方1)',
        2: '西北 (搭档1)',
        3: '正北 (对方2)',
        4: '东北 (搭档2)',
        5: '西南 (对方3)',
      }
    : {
        0: '我方 (南)',
        1: '右家 (东)',
        2: '对家 (北)',
        3: '左家 (西)',
      };

  // Autoplay effect
  useEffect(() => {
    if (!isPlaying) return;

    if (currentStepIndex >= totalSteps) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      Sound.playCardPlay();
      setCurrentStepIndex((prev) => Math.min(totalSteps, prev + 1));
    }, playSpeedMs);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, totalSteps, playSpeedMs]);

  const handleStepForward = () => {
    if (currentStepIndex < totalSteps) {
      Sound.playCardPlay();
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleStepBack = () => {
    if (currentStepIndex > 0) {
      Sound.playCardClick();
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(record, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast('牌谱 JSON 已成功复制到剪贴板！');
  };

  const handleDownloadFile = () => {
    const jsonStr = JSON.stringify(record, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guandan_replay_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('已下载牌谱文件 .json！');
  };

  const handleImportSubmit = () => {
    try {
      const imported = importReplayRecord(importText);
      setRecord(imported);
      setCurrentStepIndex(0);
      setIsPlaying(false);
      setShowImportModal(false);
      showToast('牌谱导入成功！');
    } catch (e: any) {
      showToast(`导入失败: ${e.message || '格式错误'}`);
    }
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="h-full w-full flex flex-col gap-2 min-h-0 overflow-hidden relative select-none">
      {/* Toast */}
      {notification && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-slate-950 font-black px-4 py-2 rounded-xl shadow-2xl animate-bounce border-2 border-amber-300 text-xs sm:text-sm">
          {notification}
        </div>
      )}

      {/* Replay Header & Actions */}
      <div className="shrink-0 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs shadow-md">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <div className="font-extrabold text-white flex items-center gap-1.5 leading-none">
              <span>{record.title || '对局复盘'}</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-bold">
                打【{record.levelRank}】
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              总步数: {totalSteps} 步 · 当前第 {currentStepIndex} 步
            </div>
          </div>
        </div>

        {/* Action Buttons: Swap Rematch, Export, Import */}
        <div className="flex items-center space-x-2">
          {onLaunchSwapMatch && (
            <button
              onClick={() => onLaunchSwapMatch(record)}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 px-3 py-1.5 rounded-lg font-black text-xs flex items-center gap-1 shadow transition-transform active:scale-95"
              title="以此局手牌与对手换位打，看能否逆转！"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>以此局换位复赛</span>
            </button>
          )}

          <button
            onClick={handleExportJSON}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-700 font-bold flex items-center gap-1"
            title="复制牌谱 JSON"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">复制</span>
          </button>

          <button
            onClick={handleDownloadFile}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-700 font-bold flex items-center gap-1"
            title="下载牌谱文件"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">下载</span>
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-700 font-bold flex items-center gap-1"
            title="导入其他牌谱"
          >
            <Upload className="w-3.5 h-3.5 text-sky-400" />
            <span>导入</span>
          </button>
        </div>
      </div>

      {/* Main Replay Board (Felt table with full 4-player transparency) */}
      <div className="flex-1 min-h-0 w-full rounded-2xl table-felt border-4 border-amber-950/80 p-2.5 flex flex-col justify-between overflow-hidden shadow-2xl relative">
        {/* North Player (Seat 2) */}
        <div className="shrink-0 flex flex-col items-center">
          <div className="flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-slate-950/85 text-slate-200 border border-slate-700 text-[11px] font-bold">
            <Users className="w-3 h-3 text-amber-400" />
            <span>{seatNames[2]}</span>
            <span className="text-amber-300 text-[10px]">余 {stepState.hands[2].length} 张</span>
          </div>

          {/* North Cards (Face up in replay) */}
          <div className="mt-1 flex -space-x-5 max-w-xl overflow-x-auto p-1 bg-black/40 rounded-lg border border-amber-500/30">
            {stepState.hands[2].map((card) => (
              <PlayingCard key={card.id} card={card} levelRank={record.levelRank} size="sm" compact />
            ))}
          </div>

          <div className="min-h-[40px] flex items-center justify-center">
            {stepState.trickPlays[2] ? (
              stepState.trickPlays[2]?.action === 'pass' ? (
                <span className="text-[11px] bg-rose-950/90 text-rose-300 px-2.5 py-0.5 rounded-full border border-rose-500/60 font-black shadow flex items-center gap-1">
                  <span>🛑</span>
                  <span>不要 / 过</span>
                </span>
              ) : (
                <div className="flex flex-col items-center space-y-0.5">
                  {stepState.trickPlays[2]?.combo && (
                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-black/80 text-amber-300 border border-amber-500/40 shadow">
                      {describeCombo(stepState.trickPlays[2]!.combo!)}
                    </span>
                  )}
                  <div className="flex -space-x-3.5 drop-shadow-md">
                    {stepState.trickPlays[2]?.cards?.map((card) => (
                      <PlayingCard key={card.id} card={card} levelRank={record.levelRank} size="sm" />
                    ))}
                  </div>
                </div>
              )
            ) : null}
          </div>
        </div>

        {/* Middle Row: West + Center Trick + East */}
        <div className="flex-1 grid grid-cols-3 items-center px-2 min-h-0">
          {/* West (Seat 3) */}
          <div className="flex flex-col items-start space-y-1">
            <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-slate-950/85 text-slate-200 border border-slate-700 text-[11px] font-bold">
              <span>{seatNames[3]}</span>
              <span className="text-rose-300 text-[10px]">余 {stepState.hands[3].length} 张</span>
            </div>

            <div className="flex -space-x-5 max-w-[160px] overflow-x-auto p-1 bg-black/40 rounded-lg border border-amber-500/30">
              {stepState.hands[3].map((card) => (
                <PlayingCard key={card.id} card={card} levelRank={record.levelRank} size="sm" compact />
              ))}
            </div>

            <div className="min-h-[40px] flex items-center">
              {stepState.trickPlays[3] ? (
                stepState.trickPlays[3]?.action === 'pass' ? (
                  <span className="text-[11px] bg-rose-950/90 text-rose-300 px-2.5 py-0.5 rounded-full border border-rose-500/60 font-black shadow flex items-center gap-1">
                    <span>🛑</span>
                    <span>不要 / 过</span>
                  </span>
                ) : (
                  <div className="flex flex-col items-start space-y-0.5">
                    {stepState.trickPlays[3]?.combo && (
                      <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-black/80 text-amber-300 border border-amber-500/40 shadow">
                        {describeCombo(stepState.trickPlays[3]!.combo!)}
                      </span>
                    )}
                    <div className="flex -space-x-3.5 drop-shadow-md">
                      {stepState.trickPlays[3]?.cards?.map((card) => (
                        <PlayingCard key={card.id} card={card} levelRank={record.levelRank} size="sm" />
                      ))}
                    </div>
                  </div>
                )
              ) : null}
            </div>
          </div>

          {/* Center Trick Podium */}
          <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-black/50 border border-emerald-500/30 backdrop-blur-md min-h-[60px] shadow-xl mx-auto w-full max-w-[220px]">
            {stepState.currentCombo ? (
              <div className="text-center space-y-0.5">
                <div className="text-[10px] text-amber-300/80 font-bold uppercase">当前需压过</div>
                <div className="text-xs font-black text-amber-400 flex items-center justify-center gap-1 drop-shadow">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>{describeCombo(stepState.currentCombo)}</span>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-0.5">
                <div className="text-xs font-black text-emerald-300 drop-shadow">新一墩出牌</div>
                <div className="text-[10px] text-slate-400">由领牌者首发</div>
              </div>
            )}
          </div>

          {/* East (Seat 1) */}
          <div className="flex flex-col items-end space-y-1">
            <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-slate-950/85 text-slate-200 border border-slate-700 text-[11px] font-bold">
              <span>{seatNames[1]}</span>
              <span className="text-rose-300 text-[10px]">余 {stepState.hands[1].length} 张</span>
            </div>

            <div className="flex -space-x-5 max-w-[160px] overflow-x-auto p-1 bg-black/40 rounded-lg border border-amber-500/30">
              {stepState.hands[1].map((card) => (
                <PlayingCard key={card.id} card={card} levelRank={record.levelRank} size="sm" compact />
              ))}
            </div>

            <div className="min-h-[40px] flex items-center">
              {stepState.trickPlays[1] ? (
                stepState.trickPlays[1]?.action === 'pass' ? (
                  <span className="text-[11px] bg-rose-950/90 text-rose-300 px-2.5 py-0.5 rounded-full border border-rose-500/60 font-black shadow flex items-center gap-1">
                    <span>🛑</span>
                    <span>不要 / 过</span>
                  </span>
                ) : (
                  <div className="flex flex-col items-end space-y-0.5">
                    {stepState.trickPlays[1]?.combo && (
                      <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-black/80 text-amber-300 border border-amber-500/40 shadow">
                        {describeCombo(stepState.trickPlays[1]!.combo!)}
                      </span>
                    )}
                    <div className="flex -space-x-3.5 drop-shadow-md">
                      {stepState.trickPlays[1]?.cards?.map((card) => (
                        <PlayingCard key={card.id} card={card} levelRank={record.levelRank} size="sm" />
                      ))}
                    </div>
                  </div>
                )
              ) : null}
            </div>
          </div>
        </div>

        {/* South (User / Seat 0) */}
        <div className="shrink-0 flex flex-col items-center space-y-1">
          <div className="min-h-[40px] flex items-center justify-center">
            {stepState.trickPlays[0] ? (
              stepState.trickPlays[0]?.action === 'pass' ? (
                <span className="text-[11px] bg-rose-950/90 text-rose-300 px-2.5 py-0.5 rounded-full border border-rose-500/60 font-black shadow flex items-center gap-1">
                  <span>🛑</span>
                  <span>不要 / 过</span>
                </span>
              ) : (
                <div className="flex flex-col items-center space-y-0.5">
                  {stepState.trickPlays[0]?.combo && (
                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-black/80 text-amber-300 border border-amber-500/40 shadow">
                      {describeCombo(stepState.trickPlays[0]!.combo!)}
                    </span>
                  )}
                  <div className="flex -space-x-3.5 drop-shadow-xl">
                    {stepState.trickPlays[0]?.cards?.map((card) => (
                      <PlayingCard key={card.id} card={card} levelRank={record.levelRank} size="sm" />
                    ))}
                  </div>
                </div>
              )
            ) : null}
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-slate-950/85 text-slate-200 border border-slate-700 text-[11px] font-bold">
            <span>{seatNames[0]}</span>
            <span className="text-amber-300 text-[10px]">余 {stepState.hands[0].length} 张</span>
          </div>

          <div className="flex -space-x-5 max-w-2xl overflow-x-auto p-1 bg-black/40 rounded-lg border border-amber-500/30">
            {stepState.hands[0].map((card) => (
              <PlayingCard key={card.id} card={card} levelRank={record.levelRank} size="sm" compact />
            ))}
          </div>
        </div>
      </div>

      {/* Replay Control Bar: Timeline Slider & Playback Buttons */}
      <div className="shrink-0 bg-slate-900 border border-slate-800 rounded-xl p-2.5 space-y-2 shadow-lg">
        {/* Tactical Commentary Text */}
        <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-200 font-medium flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="text-amber-400 font-bold">💬 复盘点评：</span>
            <span>{stepState.commentary}</span>
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
            第 {currentStepIndex} / {totalSteps} 步
          </span>
        </div>

        {/* Timeline Slider */}
        <div className="flex items-center space-x-3 px-1">
          <span className="text-[10px] text-slate-400 font-bold">0</span>
          <input
            type="range"
            min={0}
            max={totalSteps}
            value={currentStepIndex}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentStepIndex(Number(e.target.value));
            }}
            className="flex-1 accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <span className="text-[10px] text-slate-400 font-bold">{totalSteps}</span>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center space-x-1 text-xs">
            <span className="text-slate-400 text-[10px] mr-1">倍速:</span>
            <button
              onClick={() => setPlaySpeedMs(1500)}
              className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                playSpeedMs === 1500 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}
            >
              1.0x
            </button>
            <button
              onClick={() => setPlaySpeedMs(800)}
              className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                playSpeedMs === 800 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}
            >
              1.5x
            </button>
            <button
              onClick={() => setPlaySpeedMs(300)}
              className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                playSpeedMs === 300 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}
            >
              3.0x
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIndex(0);
              }}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
              title="跳转至开头"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleStepBack}
              disabled={currentStepIndex === 0}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg disabled:opacity-30"
              title="上一步"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-black text-xs flex items-center gap-1 shadow transition-transform active:scale-95"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? '暂停' : '自动播放'}</span>
            </button>

            <button
              onClick={handleStepForward}
              disabled={currentStepIndex >= totalSteps}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg disabled:opacity-30"
              title="下一步"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIndex(totalSteps);
              }}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
              title="跳转至结束"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-4 shadow-2xl space-y-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-amber-400" />
              <span>导入掼蛋牌谱 JSON</span>
            </h3>

            <textarea
              rows={6}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="在此粘贴 .guandan.json 牌谱代码或文本..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-xl"
              >
                取消
              </button>
              <button
                onClick={handleImportSubmit}
                disabled={!importText.trim()}
                className="px-4 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl disabled:opacity-30"
              >
                确认导入
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
