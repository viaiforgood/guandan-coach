import { Card, GameHistoryEntry, LevelRank, PlayerSeat, Rank } from './types';
import { isWildcard } from './cards';

export interface RankTrackInfo {
  rank: Rank;
  total: number;
  played: number;
  remainingUnseen: number; // In other players' hands or deck
  heldBySelf: number;
  maxPossibleBomb: number;
}

export interface FiftyLawAnalysis {
  rank5: { played: number; remaining: number; straightPossible: boolean };
  rank10: { played: number; remaining: number; straightPossible: boolean };
  summary: string;
}

export interface TrackerState {
  playedCounts: Record<Rank, number>;
  remainingCounts: Record<Rank, number>;
  keyCards: {
    bigJoker: { total: 2; played: number; remaining: number; self: number };
    smallJoker: { total: 2; played: number; remaining: number; self: number };
    levelRankCards: { total: 8; played: number; remaining: number; self: number; wildcardsPlayed: number };
    aces: { total: 8; played: number; remaining: number; self: number };
    kings: { total: 8; played: number; remaining: number; self: number };
  };
  fiftyLaw: FiftyLawAnalysis;
  seatCardsCount: Record<PlayerSeat, number>;
  dangerAlerts: Array<{ seat: PlayerSeat; label: string; count: number; alertType: 'warning' | 'danger' }>;
}

export const TOTAL_RANKS_COUNT: Record<Rank, number> = {
  '2': 8, '3': 8, '4': 8, '5': 8, '6': 8, '7': 8, '8': 8,
  '9': 8, '10': 8, 'J': 8, 'Q': 8, 'K': 8, 'A': 8,
  'SJ': 2, 'BJ': 2,
};

export function analyzeCardTracker(
  history: GameHistoryEntry[],
  selfHand: Card[],
  seatHandCounts: [number, number, number, number],
  levelRank: LevelRank,
  selfSeat: PlayerSeat = 0
): TrackerState {
  const playedCounts: Record<Rank, number> = {
    '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0,
    '9': 0, '10': 0, 'J': 0, 'Q': 0, 'K': 0, 'A': 0,
    'SJ': 0, 'BJ': 0,
  };

  let wildcardsPlayed = 0;

  for (const entry of history) {
    if (entry.action === 'play' && entry.cards) {
      for (const c of entry.cards) {
        playedCounts[c.rank] = (playedCounts[c.rank] || 0) + 1;
        if (isWildcard(c, levelRank)) {
          wildcardsPlayed++;
        }
      }
    }
  }

  // Count self hand
  const selfCounts: Record<Rank, number> = {
    '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0,
    '9': 0, '10': 0, 'J': 0, 'Q': 0, 'K': 0, 'A': 0,
    'SJ': 0, 'BJ': 0,
  };
  for (const c of selfHand) {
    selfCounts[c.rank] = (selfCounts[c.rank] || 0) + 1;
  }

  // Calculate remaining unseen in other players' hands
  const remainingCounts: Record<Rank, number> = {} as any;
  for (const r of Object.keys(TOTAL_RANKS_COUNT) as Rank[]) {
    const total = TOTAL_RANKS_COUNT[r];
    const played = playedCounts[r] || 0;
    const self = selfCounts[r] || 0;
    remainingCounts[r] = Math.max(0, total - played - self);
  }

  // 50-Law (五十定律)
  const rem5 = remainingCounts['5'] || 0;
  const rem10 = remainingCounts['10'] || 0;
  const p5 = playedCounts['5'] || 0;
  const p10 = playedCounts['10'] || 0;

  let fiftyLawSummary = '';
  if (rem5 === 0 && rem10 === 0) {
    fiftyLawSummary = '场上未见5和10皆为0，外部绝无顺子可能！可全力主打单张与对子。';
  } else if (rem5 === 0) {
    fiftyLawSummary = '场上已无5，外部无法形成A-2-3-4-5到5-6-7-8-9等低位顺子。';
  } else if (rem10 === 0) {
    fiftyLawSummary = '场上已无10，外部无法形成10-J-Q-K-A等高位顺子。';
  } else {
    fiftyLawSummary = `五十定律监控中：剩余5(${rem5}张)、剩余10(${rem10}张)。`;
  }

  const dangerAlerts: TrackerState['dangerAlerts'] = [];
  const seatLabels: Record<PlayerSeat, string> = {
    0: '我',
    1: '右家 (下家)',
    2: '对家 (搭档)',
    3: '左家 (上家)',
  };

  ([1, 2, 3] as PlayerSeat[]).forEach((seat) => {
    const count = seatHandCounts[seat];
    if (count <= 5 && count > 0) {
      const isTeammate = seat === 2;
      dangerAlerts.push({
        seat,
        label: seatLabels[seat],
        count,
        alertType: isTeammate ? 'warning' : 'danger',
      });
    }
  });

  return {
    playedCounts,
    remainingCounts,
    keyCards: {
      bigJoker: {
        total: 2,
        played: playedCounts['BJ'],
        remaining: remainingCounts['BJ'],
        self: selfCounts['BJ'],
      },
      smallJoker: {
        total: 2,
        played: playedCounts['SJ'],
        remaining: remainingCounts['SJ'],
        self: selfCounts['SJ'],
      },
      levelRankCards: {
        total: 8,
        played: playedCounts[levelRank] || 0,
        remaining: remainingCounts[levelRank] || 0,
        self: selfCounts[levelRank] || 0,
        wildcardsPlayed,
      },
      aces: {
        total: 8,
        played: playedCounts['A'],
        remaining: remainingCounts['A'],
        self: selfCounts['A'],
      },
      kings: {
        total: 8,
        played: playedCounts['K'],
        remaining: remainingCounts['K'],
        self: selfCounts['K'],
      },
    },
    fiftyLaw: {
      rank5: { played: p5, remaining: rem5, straightPossible: rem5 > 0 },
      rank10: { played: p10, remaining: rem10, straightPossible: rem10 > 0 },
      summary: fiftyLawSummary,
    },
    seatCardsCount: {
      0: seatHandCounts[0],
      1: seatHandCounts[1],
      2: seatHandCounts[2],
      3: seatHandCounts[3],
    },
    dangerAlerts,
  };
}
