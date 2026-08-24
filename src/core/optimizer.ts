import { Card, HandGroup, HandPlan, LevelRank, Rank } from './types';
import { cardLabel, isWildcard, naturalRankValue, rankValue } from './cards';
import { CATEGORY_LABELS } from './combos';

export function describeGroup(group: HandGroup): string {
  const label = CATEGORY_LABELS[group.category] || group.category;
  if (group.category === 'bomb') {
    return `${group.cards.length}张炸弹`;
  }
  return label;
}

export function groupSortValue(group: HandGroup, levelRank: LevelRank): number {
  return Math.min(...group.cards.map((c) => rankValue(c.rank, levelRank)));
}

/**
 * Score a hand partition plan
 */
export function scorePlan(groups: HandGroup[], levelRank: LevelRank): {
  score: number;
  deadCards: Card[];
  bombs: HandGroup[];
  details: {
    bombCount: number;
    deadCardCount: number;
    structureScore: number;
    wildcardEfficiency: number;
  };
} {
  let score = 0;
  let bombCount = 0;
  let structureScore = 0;
  let wildcardEfficiency = 0;
  const deadCards: Card[] = [];
  const bombs: HandGroup[] = [];

  for (const g of groups) {
    if (g.category === 'bomb') {
      bombCount++;
      bombs.push(g);
      // Bomb score: base 100 + 30 per card above 4 + tier bonus
      const tierBonus = g.cards.length >= 6 ? 80 : g.cards.length === 5 ? 40 : 20;
      score += 100 + tierBonus;
    } else if (g.category === 'straight' || g.category === 'plate' || g.category === 'pair_straight') {
      structureScore += 45;
      score += 45;
    } else if (g.category === 'triple' || g.category === 'triple_pair') {
      structureScore += 25;
      score += 25;
    } else if (g.category === 'pair') {
      score += 10;
    } else if (g.category === 'single') {
      const card = g.cards[0];
      const val = rankValue(card.rank, levelRank);
      // If card is single < J and not levelRank and not Joker, it is a dead card
      if (val < 11 && card.rank !== levelRank && card.rank !== 'SJ' && card.rank !== 'BJ') {
        deadCards.push(card);
        score -= 20; // Dead card penalty
      } else {
        score += 5; // High single has exit value
      }
    }

    // Check wildcard efficiency in this group
    const wCount = g.cards.filter((c) => isWildcard(c, levelRank)).length;
    if (wCount > 0) {
      if (g.category === 'bomb') wildcardEfficiency += 30 * wCount;
      else if (g.category === 'straight' || g.category === 'pair_straight' || g.category === 'plate') {
        wildcardEfficiency += 20 * wCount;
      } else if (g.category === 'single') {
        wildcardEfficiency -= 25 * wCount; // Wasted wildcard as lone single
      }
    }
  }

  score += wildcardEfficiency;

  return {
    score,
    deadCards,
    bombs,
    details: {
      bombCount,
      deadCardCount: deadCards.length,
      structureScore,
      wildcardEfficiency,
    },
  };
}

/**
 * Build Plan 1: 保炸优先 (Preserve Bombs First)
 */
export function buildBombFirstPlan(hand: Card[], levelRank: LevelRank): HandPlan {
  const remaining = [...hand];
  const groups: HandGroup[] = [];

  // 1. Extract 4 Jokers if present
  const jokers = remaining.filter((c) => c.rank === 'SJ' || c.rank === 'BJ');
  if (jokers.length === 4) {
    groups.push({ category: 'bomb', cards: jokers, label: '天王炸' });
    removeCards(remaining, jokers);
  }

  // 2. Extract same-rank bombs (4+ cards)
  const rankMap = groupCardsByRank(remaining);
  for (const [rank, cards] of rankMap.entries()) {
    if (cards.length >= 4) {
      groups.push({ category: 'bomb', cards, label: `${cards.length}张炸弹` });
      removeCards(remaining, cards);
    }
  }

  // 3. Extract Straights from remaining (natural consecutive 5)
  extractRuns(remaining, groups, levelRank);

  // 4. Extract Triples
  const rMap2 = groupCardsByRank(remaining);
  for (const [, cards] of rMap2.entries()) {
    if (cards.length === 3) {
      groups.push({ category: 'triple', cards });
      removeCards(remaining, cards);
    }
  }

  // 5. Extract Pairs
  const rMap3 = groupCardsByRank(remaining);
  for (const [, cards] of rMap3.entries()) {
    if (cards.length === 2) {
      groups.push({ category: 'pair', cards });
      removeCards(remaining, cards);
    }
  }

  // 6. Leftover Singles
  for (const c of remaining) {
    groups.push({ category: 'single', cards: [c] });
  }

  const { score, deadCards, bombs, details } = scorePlan(groups, levelRank);
  return {
    name: '保炸优先',
    groups,
    score,
    deadCards,
    bombs,
    details,
  };
}

/**
 * Build Plan 2: 去单化优先 (Reduce Singles First)
 */
export function buildReduceSinglesPlan(hand: Card[], levelRank: LevelRank): HandPlan {
  const remaining = [...hand];
  const groups: HandGroup[] = [];

  // Extract Jokers bomb if all 4
  const jokers = remaining.filter((c) => c.rank === 'SJ' || c.rank === 'BJ');
  if (jokers.length === 4) {
    groups.push({ category: 'bomb', cards: jokers, label: '天王炸' });
    removeCards(remaining, jokers);
  }

  // Prioritize straights and runs across all cards to minimize singletons
  extractRuns(remaining, groups, levelRank);

  // Extract leftover 4+ bombs
  const rankMap = groupCardsByRank(remaining);
  for (const [, cards] of rankMap.entries()) {
    if (cards.length >= 4) {
      groups.push({ category: 'bomb', cards, label: `${cards.length}张炸弹` });
      removeCards(remaining, cards);
    } else if (cards.length === 3) {
      groups.push({ category: 'triple', cards });
      removeCards(remaining, cards);
    } else if (cards.length === 2) {
      groups.push({ category: 'pair', cards });
      removeCards(remaining, cards);
    }
  }

  // Leftover Singles
  for (const c of remaining) {
    groups.push({ category: 'single', cards: [c] });
  }

  const { score, deadCards, bombs, details } = scorePlan(groups, levelRank);
  return {
    name: '去单化优先',
    groups,
    score,
    deadCards,
    bombs,
    details,
  };
}

function removeCards(source: Card[], toRemove: Card[]) {
  const removeIds = new Set(toRemove.map((c) => c.id));
  for (let i = source.length - 1; i >= 0; i--) {
    if (removeIds.has(source[i].id)) {
      source.splice(i, 1);
    }
  }
}

function groupCardsByRank(cards: Card[]): Map<Rank, Card[]> {
  const map = new Map<Rank, Card[]>();
  for (const c of cards) {
    if (!map.has(c.rank)) map.set(c.rank, []);
    map.get(c.rank)!.push(c);
  }
  return map;
}

function extractRuns(remaining: Card[], groups: HandGroup[], levelRank: LevelRank) {
  const naturalOrder: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  // Look for 5-card straights
  let found = true;
  while (found) {
    found = false;
    for (let i = 0; i <= naturalOrder.length - 5; i++) {
      const slice = naturalOrder.slice(i, i + 5);
      const chosen: Card[] = [];
      for (const r of slice) {
        const match = remaining.find((c) => c.rank === r && !isWildcard(c, levelRank) && !chosen.includes(c));
        if (match) chosen.push(match);
      }
      if (chosen.length === 5) {
        groups.push({ category: 'straight', cards: chosen });
        removeCards(remaining, chosen);
        found = true;
        break;
      }
    }
  }
}

export function choosePlan(hand: Card[], levelRank: LevelRank): {
  best: HandPlan;
  bombFirst: HandPlan;
  reduceSingles: HandPlan;
  explanation: string;
} {
  const bombFirst = buildBombFirstPlan(hand, levelRank);
  const reduceSingles = buildReduceSinglesPlan(hand, levelRank);

  const best = bombFirst.score >= reduceSingles.score ? bombFirst : reduceSingles;

  let explanation = '';
  if (bombFirst.score >= reduceSingles.score) {
    explanation = `【理牌推荐：${bombFirst.name}】保留了${bombFirst.details.bombCount}个炸弹（死牌单张仅${bombFirst.details.deadCardCount}张）。`;
  } else {
    explanation = `【理牌推荐：${reduceSingles.name}】通过组织顺子将死牌单张减少了${bombFirst.details.deadCardCount - reduceSingles.details.deadCardCount}张，手牌更流畅。`;
  }

  return {
    best,
    bombFirst,
    reduceSingles,
    explanation,
  };
}

export function summarizePlan(groups: HandGroup[], levelRank: LevelRank): string {
  const bombs = groups.filter((g) => g.category === 'bomb');
  const weakSingles = groups.filter(
    (g) => g.category === 'single' && rankValue(g.cards[0].rank, levelRank) < 11 && g.cards[0].rank !== levelRank
  );

  const bombStr = bombs.length > 0 ? `持有${bombs.length}个炸弹` : '无炸弹';
  const weakStr = weakSingles.length > 0 ? `有${weakSingles.length}张弱单牌(${weakSingles.map((g) => g.cards[0].rank).join(',')})` : '手牌结构紧凑';

  return `【当前手牌状态】${bombStr}，${weakStr}。`;
}
