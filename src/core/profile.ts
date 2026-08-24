export type RankTier = 'novice' | 'intermediate' | 'elite' | 'master' | 'grandmaster';

export interface RankTierInfo {
  tier: RankTier;
  name: string;
  nameEn: string;
  minExp: number;
  maxExp: number;
  icon: string;
  badgeColor: string;
  borderColor: string;
  description: string;
}

export const RANK_TIERS: RankTierInfo[] = [
  {
    tier: 'novice',
    name: '初级学徒',
    nameEn: 'Novice',
    minExp: 0,
    maxExp: 500,
    icon: '🌱',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    borderColor: 'border-emerald-500',
    description: '刚入掼门，掌握基础牌型与规则，跟随 AI 教练启航。',
  },
  {
    tier: 'intermediate',
    name: '进阶高手',
    nameEn: 'Intermediate',
    minExp: 500,
    maxExp: 2000,
    icon: '⚔️',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    borderColor: 'border-sky-500',
    description: '熟练运用保炸与去单化理牌，能准确识别搭档信号。',
  },
  {
    tier: 'elite',
    name: '联盟精英',
    nameEn: 'Elite Master',
    minExp: 2000,
    maxExp: 5000,
    icon: '🏅',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    borderColor: 'border-amber-500',
    description: '深谙「五十定律」记牌算牌，具备全局视野与控火艺术。',
  },
  {
    tier: 'master',
    name: '省级国手',
    nameEn: 'Grandmaster',
    minExp: 5000,
    maxExp: 12000,
    icon: '👑',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    borderColor: 'border-purple-500',
    description: '精通残局张数神算（五打二、六打三），换位复赛逆风翻盘。',
  },
  {
    tier: 'grandmaster',
    name: '传奇特级大师',
    nameEn: 'Legendary Master',
    minExp: 12000,
    maxExp: 999999,
    icon: '🏆',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    borderColor: 'border-rose-500',
    description: '博弈论与牌道合一，名震高校联盟与各大锦标赛榜首。',
  },
];

export interface Achievement {
  id: string;
  name: string;
  desc: string;
  icon: string;
  expReward: number;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface PlayerStats {
  totalGames: number;
  wins: number;
  losses: number;
  topRankCount: number; // 头游次数
  doubleTributesGiven: number; // 双贡吃贡
  swapRematchWins: number; // 换牌复赛逆转次数
  puzzlesSolved: number; // 残局闯关
  drillsCompleted: number; // 记牌测验
  bombsPlayed: number; // 打出炸弹数
}

export interface UserProfile {
  userId: string;
  nickname: string;
  avatarUrl: string;
  accountType: 'guest' | 'wechat' | 'google' | 'github' | 'email';
  emailOrPhone?: string;
  syncPin: string; // 6-digit sync PIN
  exp: number;
  level: number;
  rankTier: RankTier;
  createdAt: string;
  lastActiveAt: string;
  stats: PlayerStats;
  achievements: Achievement[];
}

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_win',
    name: '初战告捷',
    desc: '在人机或实战对局中赢下首场胜利',
    icon: '🎖️',
    expReward: 50,
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'king_bomb',
    name: '天王至尊',
    desc: '打出一次四大天王炸或 6-Joker 终极天王炸',
    icon: '💥',
    expReward: 150,
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'swap_master',
    name: '逆风翻盘',
    desc: '在「换位复赛」中互换手牌并成功逆转赢下对局',
    icon: '🔄',
    expReward: 200,
    unlocked: false,
    progress: 0,
    maxProgress: 3,
  },
  {
    id: 'baodian_scholar',
    name: '宝典宗师',
    desc: '研读并收藏中山大学校友会 18 条实战宝典',
    icon: '📖',
    expReward: 80,
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'fifty_law_expert',
    name: '神算五十',
    desc: '在「五十定律」记牌测验中取得 100% 满分',
    icon: '🧠',
    expReward: 120,
    unlocked: false,
    progress: 0,
    maxProgress: 5,
  },
  {
    id: 'puzzle_master',
    name: '破局奇才',
    desc: '成功攻克 10 个掼蛋绝妙残局关卡',
    icon: '🧩',
    expReward: 150,
    unlocked: false,
    progress: 0,
    maxProgress: 10,
  },
  {
    id: 'music_lover',
    name: '战歌同频',
    desc: '在 Suno 专属背景音乐播放器中收听超过 5 首战歌',
    icon: '🎵',
    expReward: 60,
    unlocked: false,
    progress: 0,
    maxProgress: 5,
  },
  {
    id: 'pass_level_a',
    name: '通关过A',
    desc: '完成从 2 级打到 A 级的整套锦标赛晋级',
    icon: '👑',
    expReward: 300,
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
];

const PROFILE_STORAGE_KEY = 'guandan_user_profile_v1';

export function getRankTierFromExp(exp: number): RankTierInfo {
  for (let i = RANK_TIERS.length - 1; i >= 0; i--) {
    if (exp >= RANK_TIERS[i].minExp) {
      return RANK_TIERS[i];
    }
  }
  return RANK_TIERS[0];
}

export function getLevelFromExp(exp: number): number {
  return Math.floor(Math.sqrt(exp / 50)) + 1;
}

export function getExpProgress(exp: number) {
  const tier = getRankTierFromExp(exp);
  const currentTierExp = exp - tier.minExp;
  const tierTotalSpan = Math.max(1, tier.maxExp - tier.minExp);
  const percent = Math.min(100, Math.round((currentTierExp / tierTotalSpan) * 100));
  return {
    tier,
    currentTierExp,
    tierTotalSpan,
    percent,
    nextTier: RANK_TIERS.find((t) => t.minExp > exp) || null,
  };
}

export function generateSyncPin(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function loadUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure all fields & achievements exist
      const mergedAchievements = INITIAL_ACHIEVEMENTS.map((initAch) => {
        const found = parsed.achievements?.find((a: Achievement) => a.id === initAch.id);
        return found ? { ...initAch, ...found } : initAch;
      });
      return {
        ...parsed,
        level: getLevelFromExp(parsed.exp || 0),
        rankTier: getRankTierFromExp(parsed.exp || 0).tier,
        achievements: mergedAchievements,
      };
    }
  } catch (e) {
    console.warn('Error loading user profile from storage:', e);
  }

  // Create default guest profile
  const defaultProfile: UserProfile = {
    userId: 'user_' + Math.random().toString(36).substring(2, 9),
    nickname: '掼蛋大师 ' + Math.floor(1000 + Math.random() * 9000),
    avatarUrl: '',
    accountType: 'guest',
    syncPin: generateSyncPin(),
    exp: 120, // Starting bonus
    level: 1,
    rankTier: 'novice',
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    stats: {
      totalGames: 0,
      wins: 0,
      losses: 0,
      topRankCount: 0,
      doubleTributesGiven: 0,
      swapRematchWins: 0,
      puzzlesSolved: 0,
      drillsCompleted: 0,
      bombsPlayed: 0,
    },
    achievements: INITIAL_ACHIEVEMENTS,
  };

  saveUserProfile(defaultProfile);
  return defaultProfile;
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    profile.lastActiveAt = new Date().toISOString();
    profile.level = getLevelFromExp(profile.exp);
    profile.rankTier = getRankTierFromExp(profile.exp).tier;
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.warn('Error saving user profile:', e);
  }
}

export function awardExp(
  amount: number,
  reason: string,
  onLevelUp?: (newLevel: number, newTier: RankTierInfo) => void
): UserProfile {
  const profile = loadUserProfile();
  const oldLevel = profile.level;
  const oldTier = profile.rankTier;

  profile.exp += amount;
  profile.level = getLevelFromExp(profile.exp);
  profile.rankTier = getRankTierFromExp(profile.exp).tier;

  saveUserProfile(profile);

  if (profile.level > oldLevel && onLevelUp) {
    onLevelUp(profile.level, getRankTierFromExp(profile.exp));
  }

  return profile;
}
