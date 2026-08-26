export interface CardBackSettings {
  presetId: string;
  themeColor: 'crimson' | 'emerald' | 'navy' | 'obsidian' | 'gold';
  customTitle?: string;
  customSubtitle?: string;
  customLogoUrl?: string;
  customIcon?: string;
}

export interface CardBackPreset {
  id: string;
  name: string;
  badge: string;
  themeColor: 'crimson' | 'emerald' | 'navy' | 'obsidian' | 'gold';
  icon: string;
  title: string;
  subtitle: string;
  bgGradient: string;
  borderColor: string;
}

export const CARDBACK_PRESETS: CardBackPreset[] = [
  {
    id: 'naacu',
    name: '北美高校联盟',
    badge: '推荐',
    themeColor: 'crimson',
    icon: '🎓',
    title: '北美高校联盟',
    subtitle: 'GUANDAN CLUB',
    bgGradient: 'from-red-950 via-rose-950 to-slate-950',
    borderColor: 'border-amber-400',
  },
  {
    id: 'sysu',
    name: '中大校友会',
    badge: '经典',
    themeColor: 'emerald',
    icon: '🏛️',
    title: '中大校友会',
    subtitle: 'SYSU ALUMNI',
    bgGradient: 'from-emerald-950 via-teal-950 to-slate-950',
    borderColor: 'border-emerald-400',
  },
  {
    id: 'zju',
    name: '浙大智能体',
    badge: 'AI实验室',
    themeColor: 'navy',
    icon: '🦅',
    title: '浙大智能体',
    subtitle: 'ZJU AI LAB',
    bgGradient: 'from-blue-950 via-indigo-950 to-slate-950',
    borderColor: 'border-sky-400',
  },
  {
    id: 'weiai',
    name: '唯爱公益',
    badge: '公益官方',
    themeColor: 'navy',
    icon: '🌟',
    title: '唯爱AI公益',
    subtitle: 'VI AI FOR GOOD',
    bgGradient: 'from-slate-900 via-indigo-950 to-slate-900',
    borderColor: 'border-amber-400',
  },
  {
    id: 'royal_gold',
    name: '赤金至尊龙纹',
    badge: '大师典藏',
    themeColor: 'gold',
    icon: '👑',
    title: '掼蛋大师赛',
    subtitle: 'GRAND MASTER',
    bgGradient: 'from-amber-950 via-yellow-950 to-slate-950',
    borderColor: 'border-amber-300',
  },
  {
    id: 'obsidian',
    name: '曜石黑金极光',
    badge: '电竞极简',
    themeColor: 'obsidian',
    icon: '💎',
    title: '竞技掼蛋',
    subtitle: 'CYBER PRO',
    bgGradient: 'from-slate-950 via-zinc-900 to-black',
    borderColor: 'border-amber-400/80',
  },
];

const CARDBACK_STORAGE_KEY = 'guandan_cardback_settings';

export function loadCardBackSettings(): CardBackSettings {
  try {
    const raw = localStorage.getItem(CARDBACK_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to load cardback settings', e);
  }
  return {
    presetId: 'naacu',
    themeColor: 'crimson',
    title: '北美高校联盟',
    subtitle: 'GUANDAN CLUB',
    icon: '🎓',
  } as CardBackSettings;
}

export function saveCardBackSettings(settings: CardBackSettings): void {
  try {
    localStorage.setItem(CARDBACK_STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event('cardback_settings_changed'));
  } catch (e) {
    console.warn('Failed to save cardback settings', e);
  }
}
