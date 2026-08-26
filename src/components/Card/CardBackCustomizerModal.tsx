import React, { useState } from 'react';
import {
  CardBackSettings,
  CARDBACK_PRESETS,
  loadCardBackSettings,
  saveCardBackSettings,
} from '../../core/cardback';
import { CardBack } from './CardBack';
import { Sound } from '../../core/audio';
import {
  Sparkles,
  X,
  Check,
  Upload,
  RotateCcw,
  Palette,
  Image as ImageIcon,
  Type,
  Smile,
} from 'lucide-react';

interface CardBackCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CardBackCustomizerModal: React.FC<CardBackCustomizerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [settings, setSettings] = useState<CardBackSettings>(() => loadCardBackSettings());
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSelectPreset = (presetId: string) => {
    const preset = CARDBACK_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    const newSettings: CardBackSettings = {
      presetId: preset.id,
      themeColor: preset.themeColor,
      customTitle: preset.title,
      customSubtitle: preset.subtitle,
      customIcon: preset.icon,
      customLogoUrl: undefined,
    };
    setSettings(newSettings);
    Sound.playCardClick();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setSettings((prev) => ({
        ...prev,
        customLogoUrl: dataUrl,
      }));
      Sound.playCardPlay();
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    saveCardBackSettings(settings);
    Sound.playCardPlay();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleReset = () => {
    handleSelectPreset('naacu');
  };

  const popularIcons = ['🎓', '🏛️', '🦅', '🌟', '👑', '💎', '🏆', '🎴', '🐉', '🚀', '🎯', '🔥'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl max-w-xl w-full p-4 sm:p-6 shadow-2xl space-y-4 relative max-h-[90vh] flex flex-col text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 bg-gradient-to-tr from-amber-500 to-rose-500 rounded-2xl flex items-center justify-center text-slate-950 font-black shadow-lg">
              🎴
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-1.5">
                <span>个性化定制牌背与战队Logo</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-500/40">
                  实时生效
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                支持北美高校联盟、中大校友会等名校预设，或自由上传俱乐部专属徽标。
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: 官方名门预设 vs 自定义工坊 */}
        <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-2xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'presets'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>名门赛事与高校联盟预设 (6款)</span>
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'custom'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>自由DIY工坊 (上传图片/文字)</span>
          </button>
        </div>

        {/* Main Content Area with Live 3D Preview */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-4">
          {/* Live Interactive Preview Box */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-2 shadow-inner">
            <span className="text-[11px] font-bold text-amber-400">【牌背实时 3D 渲染效果】</span>
            <div className="flex items-center space-x-4">
              <CardBack size="md" customSettings={settings} />
              <CardBack size="lg" customSettings={settings} />
            </div>
          </div>

          {/* Tab 1: Presets Grid */}
          {activeTab === 'presets' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {CARDBACK_PRESETS.map((p) => {
                const isSelected = settings.presetId === p.id && !settings.customLogoUrl;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPreset(p.id)}
                    className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-400 ring-2 ring-amber-400/50 shadow-lg'
                        : 'bg-slate-800/60 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{p.icon}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-slate-900 text-slate-300 border border-slate-700">
                        {p.badge}
                      </span>
                    </div>

                    <div>
                      <div className="text-xs font-black text-white">{p.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{p.subtitle}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Tab 2: Custom DIY Workshop */}
          {activeTab === 'custom' && (
            <div className="space-y-3 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 text-xs">
              {/* Custom Club / Team Title */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                  <Type className="w-3.5 h-3.5 text-amber-400" />
                  <span>战队/俱乐部名称 (主标题)</span>
                </label>
                <input
                  type="text"
                  value={settings.customTitle || ''}
                  onChange={(e) => setSettings((prev) => ({ ...prev, customTitle: e.target.value }))}
                  placeholder="如：硅谷掼蛋俱乐部 / 北美浙大校友会"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-bold text-xs"
                />
              </div>

              {/* Custom Subtitle */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">副标题 / 英文缩写</label>
                <input
                  type="text"
                  value={settings.customSubtitle || ''}
                  onChange={(e) => setSettings((prev) => ({ ...prev, customSubtitle: e.target.value }))}
                  placeholder="如：GUANDAN PRO / SILICON VALLEY"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono text-xs"
                />
              </div>

              {/* Icon Picker */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                  <Smile className="w-3.5 h-3.5 text-sky-400" />
                  <span>选择徽章图标 (Emoji)</span>
                </label>
                <div className="flex flex-wrap gap-1">
                  {popularIcons.map((ic) => (
                    <button
                      key={ic}
                      onClick={() => setSettings((prev) => ({ ...prev, customIcon: ic, customLogoUrl: undefined }))}
                      className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition-all ${
                        settings.customIcon === ic && !settings.customLogoUrl
                          ? 'bg-amber-500 text-slate-950 font-black ring-2 ring-amber-300'
                          : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Logo Image Upload */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>上传专属 Logo 图片 (PNG / JPG)</span>
                </label>
                <div className="flex items-center space-x-2">
                  <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-transform active:scale-95">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>选择本地文件</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>

                  {settings.customLogoUrl && (
                    <button
                      onClick={() => setSettings((prev) => ({ ...prev, customLogoUrl: undefined }))}
                      className="text-rose-400 hover:text-rose-300 text-[11px] font-bold"
                    >
                      清除图片
                    </button>
                  )}
                </div>
              </div>

              {/* Theme Color Picker */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">底纹主题色</label>
                <div className="flex items-center space-x-2">
                  {[
                    { id: 'crimson', label: '赤金深红', color: 'bg-red-900 border-red-500' },
                    { id: 'emerald', label: '深邃墨绿', color: 'bg-emerald-900 border-emerald-500' },
                    { id: 'navy', label: '皇家藏蓝', color: 'bg-blue-900 border-blue-500' },
                    { id: 'gold', label: '尊贵赤金', color: 'bg-amber-900 border-amber-500' },
                    { id: 'obsidian', label: '曜石纯黑', color: 'bg-black border-slate-700' },
                  ].map((tc) => (
                    <button
                      key={tc.id}
                      onClick={() => setSettings((prev) => ({ ...prev, themeColor: tc.id as any }))}
                      className={`px-2.5 py-1 rounded-xl border text-[10px] font-bold flex items-center gap-1 transition-all ${tc.color} ${
                        settings.themeColor === tc.id ? 'ring-2 ring-amber-400 scale-105' : 'opacity-70'
                      }`}
                    >
                      <span>{tc.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="text-slate-400 hover:text-white text-xs font-bold flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>恢复默认</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black px-5 py-1.5 rounded-xl text-xs shadow-lg transition-transform active:scale-95 flex items-center gap-1.5"
            >
              {savedSuccess ? <Check className="w-4 h-4 text-slate-950" /> : <Sparkles className="w-4 h-4" />}
              <span>{savedSuccess ? '已保存应用！' : '保存并应用到牌桌'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
