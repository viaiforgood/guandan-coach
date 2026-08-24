import { Card, GameHistoryEntry, LevelRank, PlayerSeat, Rank } from './types';
import { isWildcard } from './cards';

export interface RankTrackInfo {
  rank: Rank;
  total: number;
  played: number;
  remainingUnseen: number;
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
    bigJoker: { total: number; played: number; remaining: number; self: number };
    smallJoker: { total: number; played: number; remaining: number; self: number };
    levelRankCards: { total: number; played: number; remaining: number; self: number; wildcardsPlayed: number };
    aces: { total: number; played: number; remaining: number; self: number };
    kings: { total: number; played: number; remaining: number; self: number };
  };
  fiftyLaw: FiftyLawAnalysis;
  seatCardsCount: Record<number, number>;
  dangerAlerts: Array<{ seat: PlayerSeat; label: string; count: number; alertType: 'warning' | 'danger' }>;
}

export function analyzeCardTracker(
  history: GameHistoryEntry[],
  selfHand: Card[],
  seatHandCounts: number[],
  levelRank: LevelRank,
  selfSeat: PlayerSeat = 0,
  playerCount: number = 4
): TrackerState {
  const decksCount = playerCount === 6 ? 3 : 2;
  const regularCount = decksCount * 4; // 8 for 2 decks, 12 for 3 decks
  const jokerCount = decksCount; // 2 or 3

  const totalRanksCount: Record<Rank, number> = {
    '2': regularCount, '3': regularCount, '4': regularCount, '5': regularCount,
    '6': regularCount, '7': regularCount, '8': regularCount, '9': regularCount,
    '10': regularCount, 'J': regularCount, 'Q': regularCount, 'K': regularCount,
    'A': regularCount, 'SJ': jokerCount, 'BJ': jokerCount,
  };

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
  for (const r of Object.keys(totalRanksCount) as Rank[]) {
    const total = totalRanksCount[r];
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
    fiftyLawSummary = '场上已无5，外部无法形成低位顺子。';
  } else if (rem10 === 0) {
    fiftyLawSummary = '场上已无10，外部无法形成高位顺子。';
  } else {
    fiftyLawSummary = `五十定律监控中：剩余5(${rem5}张)、剩余10(${rem10}张)。`;
  }

  const dangerAlerts: TrackerState['dangerAlerts'] = [];
  const seatLabels4p: Record<number, string> = {
    0: '我',
    1: '右家 (下家)',
    2: '对家 (搭档)',
    3: '左家 (上家)',
  };

  const seatLabels6p: Record<number, string> = {
    0: '我 (南)',
    1: '东南 (对方)',
    2: '西北 (搭档1)',
    3: '正北 (对方)',
    4: '东北 (搭档2)',
    5: '西南 (对方)',
  };

  const labels = playerCount === 6 ? seatLabels6p : seatLabels4p;

  for (let s = 1; s < playerCount; s++) {
    const count = seatHandCounts[s] || 0;
    if (count <= 5 && count > 0) {
      const isTeammate = s % 2 === 0;
      dangerAlerts.push({
        seat: s as PlayerSeat,
        label: labels[s] || `玩家${s}`,
        count,
        alertType: isTeammate ? 'warning' : 'danger',
      });
    }
  }

  const seatCardsMap: Record<number, number> = {};
  seatHandCounts.forEach((c, idx) => {
    seatCardsMap[idx] = c;
  });

  return {
    playedCounts,
    remainingCounts,
    keyCards: {
      bigJoker: {
        total: jokerCount,
        played: playedCounts['BJ'],
        remaining: remainingCounts['BJ'],
        self: selfCounts['BJ'],
      },
      smallJoker: {
        total: jokerCount,
        played: playedCounts['SJ'],
        remaining: remainingCounts['SJ'],
        self: selfCounts['SJ'],
      },
      levelRankCards: {
        total: regularCount,
        played: playedCounts[levelRank] || 0,
        remaining: remainingCounts[levelRank] || 0,
        self: selfCounts[levelRank] || 0,
        wildcardsPlayed,
      },
      aces: {
        total: regularCount,
        played: playedCounts['A'],
        remaining: remainingCounts['A'],
        self: selfCounts['A'],
      },
      kings: {
        total: regularCount,
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
    seatCardsCount: seatCardsMap,
    dangerAlerts,
  };
}
