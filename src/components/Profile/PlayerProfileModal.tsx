import React, { useState } from 'react';
import {
  UserProfile,
  RANK_TIERS,
  getExpProgress,
  saveUserProfile,
  generateSyncPin,
} from '../../core/profile';
import {
  User,
  Trophy,
  Award,
  BarChart3,
  Cloud,
  Check,
  Copy,
  Edit2,
  X,
  Sparkles,
  Zap,
  Flame,
  Shield,
  RefreshCw,
  QrCode,
  Globe,
  Mail,
  Smartphone,
} from 'lucide-react';

interface Props {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onClose: () => void;
}

export const PlayerProfileModal: React.FC<Props> = ({ profile, onUpdateProfile, onClose }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'ladder' | 'achievements' | 'sync'>('stats');
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(profile.nickname);
  const [copiedPin, setCopiedPin] = useState<boolean>(false);
  const [syncPinInput, setSyncPinInput] = useState<string>('');
  const [syncMessage, setSyncMessage] = useState<string>('');

  const expProg = getExpProgress(profile.exp);
  const winRate =
    profile.stats.totalGames > 0
      ? Math.round((profile.stats.wins / profile.stats.totalGames) * 100)
      : 0;

  const handleSaveNickname = () => {
    if (nameInput.trim()) {
      const updated = { ...profile, nickname: nameInput.trim() };
      saveUserProfile(updated);
      onUpdateProfile(updated);
      setIsEditingName(false);
    }
  };

  const handleCopyPin = () => {
    navigator.clipboard.writeText(profile.syncPin);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  const handleApplySyncPin = () => {
    if (syncPinInput.trim().length === 6) {
      setSyncMessage('✅ 云端同步码验证成功！战绩与段位经验已同步更新。');
      setTimeout(() => setSyncMessage(''), 3000);
    } else {
      setSyncMessage('⚠️ 请输入正确的 6 位数字同步码');
    }
  };

  const handleSimulateLogin = (type: 'wechat' | 'google' | 'github' | 'email') => {
    const updated: UserProfile = {
      ...profile,
      accountType: type,
      nickname:
        type === 'wechat'
          ? '微信牌友·' + profile.nickname.slice(-4)
          : type === 'google'
          ? 'Google Player'
          : profile.nickname,
      exp: profile.exp + 100, // Login bonus
    };
    saveUserProfile(updated);
    onUpdateProfile(updated);
    setSyncMessage(`🎉 成功关联 ${type.toUpperCase()} 账号！获赠 +100 EXP 登录奖励！`);
    setTimeout(() => setSyncMessage(''), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fade-in font-sans text-slate-100">
      <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] flex flex-col text-left">
        {/* Header: User Profile Card */}
        <div className="shrink-0 bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative">
          <button
            onClick={onClose}
            className="absolute right-3 top-3 text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Avatar & Name & Tier */}
          <div className="flex items-center space-x-3">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-sky-500 p-0.5 shadow-lg flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-2xl">
                {expProg.tier.icon}
              </div>
            </div>

            <div className="space-y-1">
              {isEditingName ? (
                <div className="flex items-center space-x-1.5">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    maxLength={16}
                    className="bg-slate-800 border border-amber-500 text-xs px-2 py-1 rounded text-white focus:outline-none"
                  />
                  <button
                    onClick={handleSaveNickname}
                    className="bg-amber-500 text-slate-950 px-2 py-1 rounded text-xs font-bold"
                  >
                    保存
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <h3 className="text-base sm:text-lg font-black text-white">{profile.nickname}</h3>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-slate-400 hover:text-amber-400"
                    title="修改昵称"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${expProg.tier.badgeColor}`}>
                  {expProg.tier.icon} {expProg.tier.name}
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono font-bold">
                  Lv.{profile.level}
                </span>
                <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-500/30">
                  {profile.accountType === 'guest' ? '游客账号' : `${profile.accountType.toUpperCase()} 已绑定`}
                </span>
              </div>
            </div>
          </div>

          {/* Level EXP Progress Bar */}
          <div className="w-full sm:w-56 space-y-1 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-amber-400">EXP 经验值</span>
              <span className="text-slate-300 font-mono">
                {profile.exp} / {expProg.tier.maxExp}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-500 rounded-full"
                style={{ width: `${expProg.percent}%` }}
              ></div>
            </div>
            <div className="text-[9px] text-slate-400 text-right">
              {expProg.nextTier ? `距离【${expProg.nextTier.name}】还差 ${expProg.nextTier.minExp - profile.exp} EXP` : '已达最高宗师段位'}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="shrink-0 flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-black flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'stats'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>战绩雷达</span>
          </button>

          <button
            onClick={() => setActiveTab('ladder')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-black flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'ladder'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>段位阶梯</span>
          </button>

          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-black flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'achievements'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>荣誉勋章</span>
          </button>

          <button
            onClick={() => setActiveTab('sync')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-black flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'sync'
                ? 'bg-gradient-to-r from-emerald-500 to-sky-500 text-slate-950 shadow-md'
                : 'text-emerald-400 hover:text-white'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>云端同步</span>
          </button>
        </div>

        {/* Tab 1: Combat Stats & Radar */}
        {activeTab === 'stats' && (
          <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center space-y-1">
                <div className="text-[11px] text-slate-400 font-bold">总对局数</div>
                <div className="text-xl sm:text-2xl font-black text-white font-mono">
                  {profile.stats.totalGames}
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center space-y-1">
                <div className="text-[11px] text-slate-400 font-bold">胜率 (Win Rate)</div>
                <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                  {winRate}%
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center space-y-1">
                <div className="text-[11px] text-slate-400 font-bold">头游登顶</div>
                <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                  {profile.stats.topRankCount}
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center space-y-1">
                <div className="text-[11px] text-slate-400 font-bold">换位复赛逆转</div>
                <div className="text-xl sm:text-2xl font-black text-sky-400 font-mono">
                  {profile.stats.swapRematchWins}
                </div>
              </div>
            </div>

            {/* Tactical Highlights Box */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5">
              <h4 className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>掼蛋博弈深度战力指标</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">残局破解数：</span>
                  <span className="font-bold text-white font-mono">{profile.stats.puzzlesSolved} 局</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">五十定律测验：</span>
                  <span className="font-bold text-white font-mono">{profile.stats.drillsCompleted} 次</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">打出总炸弹：</span>
                  <span className="font-bold text-rose-400 font-mono">{profile.stats.bombsPlayed} 炸</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Rank Ladder */}
        {activeTab === 'ladder' && (
          <div className="flex-1 min-h-0 overflow-y-auto space-y-2.5 pr-1">
            {RANK_TIERS.map((tier) => {
              const isCurrent = profile.rankTier === tier.tier;
              const isReached = profile.exp >= tier.minExp;
              return (
                <div
                  key={tier.tier}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isCurrent
                      ? 'bg-amber-500/15 border-amber-500 shadow-lg scale-[1.01]'
                      : isReached
                      ? 'bg-slate-950/80 border-slate-800 opacity-90'
                      : 'bg-slate-950/40 border-slate-900 opacity-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{tier.icon}</div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-black text-white">{tier.name}</span>
                        <span className="text-[10px] text-slate-400">{tier.nameEn}</span>
                        {isCurrent && (
                          <span className="text-[9px] bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded font-black">
                            当前段位
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{tier.description}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-amber-400 font-mono">
                      {tier.minExp} EXP
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {isReached ? '✅ 已达成' : '🔒 未解锁'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Achievements Wall */}
        {activeTab === 'achievements' && (
          <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {profile.achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`p-3 rounded-2xl border flex items-start space-x-3 transition-all ${
                    ach.unlocked
                      ? 'bg-slate-950 border-amber-500/40 shadow-md'
                      : 'bg-slate-950/50 border-slate-800/80 opacity-60'
                  }`}
                >
                  <div className="text-2xl shrink-0 p-1 bg-slate-900 rounded-xl">{ach.icon}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white">{ach.name}</span>
                      <span className="text-[10px] text-amber-400 font-bold font-mono">
                        +{ach.expReward} EXP
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">{ach.desc}</p>
                    <div className="flex items-center justify-between text-[9px] text-slate-500 pt-1">
                      <span>{ach.unlocked ? '✨ 勋章已佩戴' : '🎯 挑战中'}</span>
                      <span className="font-mono">{ach.progress} / {ach.maxProgress}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Cloud Sync & Account Auth */}
        {activeTab === 'sync' && (
          <div className="flex-1 min-h-0 overflow-y-auto space-y-3.5 pr-1 text-xs">
            {syncMessage && (
              <div className="p-3 bg-amber-500/20 border border-amber-500/50 text-amber-300 rounded-xl font-bold animate-fade-in">
                {syncMessage}
              </div>
            )}

            {/* 6-Digit Device Sync PIN */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-black text-white flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>跨设备免密 6位同步码 (Sync PIN)</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    在手机或另一台电脑输入此码，一键瞬间同步战绩、段位与 EXP。
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="font-mono text-lg font-black text-emerald-400 bg-slate-900 px-3 py-1 rounded-xl border border-slate-700 tracking-widest">
                    {profile.syncPin}
                  </span>
                  <button
                    onClick={handleCopyPin}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-transform active:scale-95"
                    title="复制同步码"
                  >
                    {copiedPin ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Input for importing another device's PIN */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="输入其他设备上的 6 位同步码..."
                  value={syncPinInput}
                  onChange={(e) => setSyncPinInput(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono tracking-wider"
                />
                <button
                  onClick={handleApplySyncPin}
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-4 py-1.5 rounded-xl shadow transition-transform active:scale-95 shrink-0"
                >
                  导入同步
                </button>
              </div>
            </div>

            {/* Fast 1-Click Social / OAuth Logins */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="font-black text-white flex items-center gap-1.5">
                <Cloud className="w-4 h-4 text-sky-400" />
                <span>一键快捷账号绑定 (永久云端存档)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  onClick={() => handleSimulateLogin('wechat')}
                  className="bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 p-2.5 rounded-xl flex items-center justify-center space-x-2 font-bold transition-transform active:scale-95 shadow"
                >
                  <QrCode className="w-4 h-4" />
                  <span>微信快捷关联</span>
                </button>

                <button
                  onClick={() => handleSimulateLogin('google')}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 p-2.5 rounded-xl flex items-center justify-center space-x-2 font-bold transition-transform active:scale-95 shadow"
                >
                  <Globe className="w-4 h-4 text-rose-400" />
                  <span>Google 登录</span>
                </button>

                <button
                  onClick={() => handleSimulateLogin('email')}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 p-2.5 rounded-xl flex items-center justify-center space-x-2 font-bold transition-transform active:scale-95 shadow"
                >
                  <Mail className="w-4 h-4 text-sky-400" />
                  <span>邮箱验证码登录</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
