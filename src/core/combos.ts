import { Card, Combo, LevelRank, Rank, Suit } from './types';
import { isWildcard, naturalRankValue, rankValue } from './cards';

export const CATEGORY_LABELS: Record<string, string> = {
  single: '单张',
  pair: '对子',
  triple: '三同张',
  triple_pair: '三带二',
  straight: '顺子',
  plate: '钢板',
  pair_straight: '三连对',
  bomb: '炸弹',
};

export function describeCombo(combo: Combo | null): string {
  if (!combo) return '过牌';
  if (combo.category === 'bomb') {
    if (combo.bombTier && combo.bombTier >= 16) return '六王至尊天王炸 (6王全齐)';
    if (combo.bombTier && combo.bombTier >= 12) return '天王炸 (四大天王)';
    if (combo.bombTier === 10) return `同花顺炸弹 (${combo.cards.length}张)`;
    return `${combo.cards.length}张炸弹`;
  }
  return CATEGORY_LABELS[combo.category] || combo.category;
}

/**
 * Check if cards form a pure single rank (ignoring wildcards or with wildcards as that rank)
 */
function getRankCounts(cards: Card[]): Record<Rank, number> {
  const counts: Partial<Record<Rank, number>> = {};
  for (const c of cards) {
    counts[c.rank] = (counts[c.rank] || 0) + 1;
  }
  return counts as Record<Rank, number>;
}

/**
 * Classify a set of cards (with optional wildcards)
 */
export function classify(cards: Card[], levelRank: LevelRank): Combo | null {
  if (!cards || cards.length === 0) return null;
  const len = cards.length;

  const wildcards = cards.filter((c) => isWildcard(c, levelRank));
  const nonWildcards = cards.filter((c) => !isWildcard(c, levelRank));

  // 1. Joker Bomb (4 to 6 jokers)
  const isAllJokers = cards.every((c) => c.rank === 'SJ' || c.rank === 'BJ');
  if (isAllJokers && len >= 4) {
    const sj = cards.filter((c) => c.rank === 'SJ').length;
    const bj = cards.filter((c) => c.rank === 'BJ').length;
    if (len === 6 && sj === 3 && bj === 3) {
      return {
        category: 'bomb',
        length: 6,
        compareValue: 99999,
        isBomb: true,
        bombTier: 16,
        cards,
        description: '六王至尊天王炸',
      };
    }
    if (len === 4 && sj >= 2 && bj >= 2) {
      return {
        category: 'bomb',
        length: 4,
        compareValue: 9999,
        isBomb: true,
        bombTier: 12,
        cards,
        description: '天王炸',
      };
    }
  }

  // 2. Straight Flush (同花顺: 5 cards, same suit, consecutive)
  if (len === 5) {
    const sfCombo = checkStraightFlush(cards, levelRank, wildcards, nonWildcards);
    if (sfCombo) return sfCombo;
  }

  // 3. Regular Bomb (4 to 12 same rank)
  if (len >= 4 && len <= 12) {
    const bombCombo = checkRegularBomb(cards, levelRank, wildcards, nonWildcards);
    if (bombCombo) return bombCombo;
  }

  // 4. Single
  if (len === 1) {
    return {
      category: 'single',
      length: 1,
      compareValue: rankValue(cards[0].rank, levelRank),
      isBomb: false,
      cards,
      description: `单张 ${cards[0].rank}`,
    };
  }

  // 5. Pair
  if (len === 2) {
    const pairCombo = checkPair(cards, levelRank, wildcards, nonWildcards);
    if (pairCombo) return pairCombo;
  }

  // 6. Triple
  if (len === 3) {
    const tripleCombo = checkTriple(cards, levelRank, wildcards, nonWildcards);
    if (tripleCombo) return tripleCombo;
  }

  // 7. Triple + Pair (三带二: 5 cards)
  if (len === 5) {
    const tpCombo = checkTriplePair(cards, levelRank, wildcards, nonWildcards);
    if (tpCombo) return tpCombo;
  }

  // 8. Straight (顺子: 5 cards)
  if (len === 5) {
    const straightCombo = checkStraight(cards, levelRank, wildcards, nonWildcards);
    if (straightCombo) return straightCombo;
  }

  // 9. Steel Plate (钢板: 6 cards, 2 consecutive triples, e.g. 333444)
  if (len === 6) {
    const plateCombo = checkPlate(cards, levelRank, wildcards, nonWildcards);
    if (plateCombo) return plateCombo;
  }

  // 10. Three Consecutive Pairs (三连对: 6 cards, e.g. 334455)
  if (len === 6) {
    const psCombo = checkPairStraight(cards, levelRank, wildcards, nonWildcards);
    if (psCombo) return psCombo;
  }

  return null;
}

function checkRegularBomb(
  cards: Card[],
  levelRank: LevelRank,
  wildcards: Card[],
  nonWildcards: Card[]
): Combo | null {
  const len = cards.length;
  // Cannot form bomb with jokers unless pure jokers handled above
  if (cards.some((c) => c.rank === 'SJ' || c.rank === 'BJ')) return null;

  if (nonWildcards.length === 0) {
    return null;
  }

  const targetRank = nonWildcards[0].rank;
  const allSame = nonWildcards.every((c) => c.rank === targetRank);
  if (allSame) {
    return {
      category: 'bomb',
      length: len,
      compareValue: rankValue(targetRank, levelRank),
      isBomb: true,
      bombTier: len, // 4, 5, 6, 7, 8, 9, 10, 11, 12
      cards,
      description: `${len}张炸弹 ${targetRank}`,
    };
  }
  return null;
}

function checkStraightFlush(
  cards: Card[],
  levelRank: LevelRank,
  wildcards: Card[],
  nonWildcards: Card[]
): Combo | null {
  if (cards.some((c) => c.rank === 'SJ' || c.rank === 'BJ')) return null;
  if (nonWildcards.length === 0) return null;

  const targetSuit: Suit = nonWildcards[0].suit;
  if (!nonWildcards.every((c) => c.suit === targetSuit)) return null;

  const straightVal = canFormConsecutiveRun(nonWildcards, wildcards.length, 5, 1);
  if (straightVal !== null) {
    return {
      category: 'bomb',
      length: 5,
      compareValue: straightVal,
      isBomb: true,
      bombTier: 10, // Straight flush tier = 10 (beats 5-bomb, loses to 6-bomb)
      cards,
      description: `同花顺炸弹 (${targetSuit})`,
    };
  }
  return null;
}

function checkPair(
  cards: Card[],
  levelRank: LevelRank,
  wildcards: Card[],
  nonWildcards: Card[]
): Combo | null {
  if (nonWildcards.length === 0) {
    return {
      category: 'pair',
      length: 2,
      compareValue: rankValue(levelRank, levelRank),
      isBomb: false,
      cards,
      description: `对子 ${levelRank}`,
    };
  }
  if (nonWildcards.length === 1 && wildcards.length === 1) {
    return {
      category: 'pair',
      length: 2,
      compareValue: rankValue(nonWildcards[0].rank, levelRank),
      isBomb: false,
      cards,
      description: `对子 ${nonWildcards[0].rank}`,
    };
  }
  if (nonWildcards.length === 2 && nonWildcards[0].rank === nonWildcards[1].rank) {
    return {
      category: 'pair',
      length: 2,
      compareValue: rankValue(nonWildcards[0].rank, levelRank),
      isBomb: false,
      cards,
      description: `对子 ${nonWildcards[0].rank}`,
    };
  }
  return null;
}

function checkTriple(
  cards: Card[],
  levelRank: LevelRank,
  wildcards: Card[],
  nonWildcards: Card[]
): Combo | null {
  if (cards.some((c) => c.rank === 'SJ' || c.rank === 'BJ')) return null;
  if (nonWildcards.length === 0) {
    return {
      category: 'triple',
      length: 3,
      compareValue: rankValue(levelRank, levelRank),
      isBomb: false,
      cards,
      description: `三张 ${levelRank}`,
    };
  }
  const targetRank = nonWildcards[0].rank;
  if (nonWildcards.every((c) => c.rank === targetRank)) {
    return {
      category: 'triple',
      length: 3,
      compareValue: rankValue(targetRank, levelRank),
      isBomb: false,
      cards,
      description: `三张 ${targetRank}`,
    };
  }
  return null;
}

function checkTriplePair(
  cards: Card[],
  levelRank: LevelRank,
  wildcards: Card[],
  nonWildcards: Card[]
): Combo | null {
  if (cards.some((c) => c.rank === 'SJ' || c.rank === 'BJ')) return null;

  const counts = getRankCounts(nonWildcards);
  const ranks = Object.keys(counts) as Rank[];

  if (ranks.length > 2) return null;

  if (ranks.length === 1) {
    return null;
  }

  if (ranks.length === 2) {
    const [r1, r2] = ranks;
    const c1 = counts[r1];
    const c2 = counts[r2];
    const w = wildcards.length;

    const req1 = Math.max(0, 3 - c1) + Math.max(0, 2 - c2);
    const req2 = Math.max(0, 3 - c2) + Math.max(0, 2 - c1);

    const valid1 = req1 <= w && c1 <= 3 && c2 <= 2;
    const valid2 = req2 <= w && c2 <= 3 && c1 <= 2;

    if (valid1 && valid2) {
      const v1 = rankValue(r1, levelRank);
      const v2 = rankValue(r2, levelRank);
      const chosenRank = v1 > v2 ? r1 : r2;
      return {
        category: 'triple_pair',
        length: 5,
        compareValue: rankValue(chosenRank, levelRank),
        isBomb: false,
        cards,
        description: `三带二 (主: ${chosenRank})`,
      };
    } else if (valid1) {
      return {
        category: 'triple_pair',
        length: 5,
        compareValue: rankValue(r1, levelRank),
        isBomb: false,
        cards,
        description: `三带二 (主: ${r1})`,
      };
    } else if (valid2) {
      return {
        category: 'triple_pair',
        length: 5,
        compareValue: rankValue(r2, levelRank),
        isBomb: false,
        cards,
        description: `三带二 (主: ${r2})`,
      };
    }
  }

  return null;
}

function checkStraight(
  cards: Card[],
  levelRank: LevelRank,
  wildcards: Card[],
  nonWildcards: Card[]
): Combo | null {
  if (cards.some((c) => c.rank === 'SJ' || c.rank === 'BJ')) return null;
  const val = canFormConsecutiveRun(nonWildcards, wildcards.length, 5, 1);
  if (val !== null) {
    return {
      category: 'straight',
      length: 5,
      compareValue: val,
      isBomb: false,
      cards,
      description: `顺子 (顶牌: ${val})`,
    };
  }
  return null;
}

function checkPlate(
  cards: Card[],
  levelRank: LevelRank,
  wildcards: Card[],
  nonWildcards: Card[]
): Combo | null {
  if (cards.some((c) => c.rank === 'SJ' || c.rank === 'BJ')) return null;
  const val = canFormConsecutiveRun(nonWildcards, wildcards.length, 2, 3);
  if (val !== null) {
    return {
      category: 'plate',
      length: 6,
      compareValue: val,
      isBomb: false,
      cards,
      description: `钢板 (顶牌: ${val})`,
    };
  }
  return null;
}

function checkPairStraight(
  cards: Card[],
  levelRank: LevelRank,
  wildcards: Card[],
  nonWildcards: Card[]
): Combo | null {
  if (cards.some((c) => c.rank === 'SJ' || c.rank === 'BJ')) return null;
  const val = canFormConsecutiveRun(nonWildcards, wildcards.length, 3, 2);
  if (val !== null) {
    return {
      category: 'pair_straight',
      length: 6,
      compareValue: val,
      isBomb: false,
      cards,
      description: `三连对 (顶牌: ${val})`,
    };
  }
  return null;
}

function canFormConsecutiveRun(
  nonWildcards: Card[],
  wildcardCount: number,
  runLength: number,
  cardsPerRank: number
): number | null {
  const counts: Record<number, number> = {};
  for (const c of nonWildcards) {
    const val = naturalRankValue(c.rank);
    counts[val] = (counts[val] || 0) + 1;
    if (counts[val] > cardsPerRank) return null;
  }

  const distinctVals = Object.keys(counts).map(Number);
  if (distinctVals.length === 0) {
    return 14;
  }

  let bestHighVal: number | null = null;

  for (let start = 1; start <= 14 - runLength + 1; start++) {
    const end = start + runLength - 1;
    let neededWildcards = 0;
    let matchedCards = 0;

    for (let r = start; r <= end; r++) {
      const actualVal = r === 1 ? 14 : r;
      const count = counts[actualVal] || 0;
      if (count > cardsPerRank) {
        neededWildcards = 999;
        break;
      }
      neededWildcards += cardsPerRank - count;
      matchedCards += count;
    }

    if (matchedCards === nonWildcards.length && neededWildcards <= wildcardCount) {
      const highVal = end === 5 && start === 1 ? 5 : end;
      if (bestHighVal === null || highVal > bestHighVal) {
        bestHighVal = highVal;
      }
    }
  }

  return bestHighVal;
}

export function compare(a: Combo, b: Combo): number {
  if (a.isBomb && b.isBomb) {
    const tierA = a.bombTier || a.length;
    const tierB = b.bombTier || b.length;
    if (tierA !== tierB) {
      return tierA - tierB;
    }
    return a.compareValue - b.compareValue;
  }

  if (b.isBomb && !a.isBomb) return -1;
  if (a.isBomb && !b.isBomb) return 1;

  if (a.category !== b.category || a.length !== b.length) {
    throw new Error(`Cannot compare mismatched non-bomb combos: ${a.category} vs ${b.category}`);
  }

  return a.compareValue - b.compareValue;
}
