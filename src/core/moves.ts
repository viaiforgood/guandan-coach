import { Card, Combo, LevelRank, Rank } from './types';
import { classify, compare } from './combos';
import { isWildcard, rankValue } from './cards';

/**
 * Generate all legal plays for `hand` that can beat `currentCombo`.
 * If `currentCombo` is null (leading), returns all valid combo leads.
 */
export function legalPlays(
  hand: Card[],
  currentCombo: Combo | null,
  levelRank: LevelRank
): Combo[] {
  const leads = candidateLeads(hand, levelRank);
  if (!currentCombo) {
    return leads;
  }

  const beating: Combo[] = [];
  for (const combo of leads) {
    try {
      if (compare(currentCombo, combo) < 0) {
        beating.push(combo);
      }
    } catch {
      // Different category, cannot beat unless bomb
    }
  }

  return beating;
}

/**
 * Find all possible valid combos that can be formed from a hand
 */
export function candidateLeads(hand: Card[], levelRank: LevelRank): Combo[] {
  const combos: Combo[] = [];
  const visited = new Set<string>();

  function addIfValid(cards: Card[]) {
    const key = cards
      .map((c) => c.id)
      .sort()
      .join(',');
    if (visited.has(key)) return;
    visited.add(key);

    const classified = classify(cards, levelRank);
    if (classified) {
      combos.push({
        ...classified,
        cards,
      });
    }
  }

  // Group cards by rank
  const rankMap = new Map<Rank, Card[]>();
  for (const c of hand) {
    if (!rankMap.has(c.rank)) rankMap.set(c.rank, []);
    rankMap.get(c.rank)!.push(c);
  }

  // 1. Singles
  for (const c of hand) {
    addIfValid([c]);
  }

  // 2. Same-rank multiples: Pairs, Triples, Bombs (4..8)
  for (const [, cards] of rankMap.entries()) {
    const len = cards.length;
    if (len >= 2) {
      // Pairs
      for (let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
          addIfValid([cards[i], cards[j]]);
        }
      }
    }
    if (len >= 3) {
      // Triples
      for (let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
          for (let k = j + 1; k < len; k++) {
            addIfValid([cards[i], cards[j], cards[k]]);
          }
        }
      }
    }
    if (len >= 4) {
      // Bombs (4, 5, 6, 7, 8)
      for (let size = 4; size <= len; size++) {
        generateCombinations(cards, size).forEach(addIfValid);
      }
    }
  }

  // 3. Joker Bomb
  const jokers = hand.filter((c) => c.rank === 'SJ' || c.rank === 'BJ');
  if (jokers.length === 4) {
    addIfValid(jokers);
  }

  // 4. Wildcard pairs, triples, and bombs
  const wildcards = hand.filter((c) => isWildcard(c, levelRank));
  if (wildcards.length > 0) {
    for (const [rank, cards] of rankMap.entries()) {
      if (rank === 'SJ' || rank === 'BJ') continue;
      const nonWild = cards.filter((c) => !isWildcard(c, levelRank));
      if (nonWild.length > 0) {
        // Form pairs with 1 wildcard
        if (wildcards.length >= 1 && nonWild.length >= 1) {
          addIfValid([nonWild[0], wildcards[0]]);
        }
        // Form triples with wildcards
        if (wildcards.length >= 1 && nonWild.length >= 2) {
          addIfValid([nonWild[0], nonWild[1], wildcards[0]]);
        }
        if (wildcards.length >= 2 && nonWild.length >= 1) {
          addIfValid([nonWild[0], wildcards[0], wildcards[1]]);
        }
        // Form 4+ bombs with wildcards
        for (let w = 1; w <= wildcards.length; w++) {
          if (nonWild.length + w >= 4) {
            const selectedWild = wildcards.slice(0, w);
            const neededNonWild = Math.min(nonWild.length, 8 - w);
            for (let nw = Math.max(1, 4 - w); nw <= neededNonWild; nw++) {
              generateCombinations(nonWild, nw).forEach((subset) => {
                addIfValid([...subset, ...selectedWild]);
              });
            }
          }
        }
      }
    }
  }

  // 5. Triple + Pair (三带二)
  const allTriples = combos.filter((c) => c.category === 'triple');
  const allPairs = combos.filter((c) => c.category === 'pair');
  for (const triple of allTriples) {
    for (const pair of allPairs) {
      // Must not share cards
      const tIds = new Set(triple.cards.map((c) => c.id));
      if (pair.cards.every((c) => !tIds.has(c.id))) {
        addIfValid([...triple.cards, ...pair.cards]);
      }
    }
  }

  // 6. Straights, Steel Plates, Pair Straights
  // Search runs across ranks
  findStraightsAndRuns(hand, levelRank, addIfValid);

  return combos;
}

function generateCombinations<T>(arr: T[], k: number): T[][] {
  const result: T[][] = [];
  function backtrack(start: number, current: T[]) {
    if (current.length === k) {
      result.push([...current]);
      return;
    }
    for (let i = start; i < arr.length; i++) {
      current.push(arr[i]);
      backtrack(i + 1, current);
      current.pop();
    }
  }
  backtrack(0, []);
  return result;
}

function findStraightsAndRuns(
  hand: Card[],
  levelRank: LevelRank,
  callback: (cards: Card[]) => void
) {
  // Try 5-card straights
  // Try 6-card steel plates (2 consecutive triples)
  // Try 6-card pair straights (3 consecutive pairs)
  // To keep search fast and robust, group by natural ranks
  const naturalOrder: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  
  // 5-card straights
  for (let i = 0; i <= naturalOrder.length - 5; i++) {
    const slice = naturalOrder.slice(i, i + 5);
    const candidateCards: Card[][] = slice.map((r) => hand.filter((c) => c.rank === r && !isWildcard(c, levelRank)));
    if (candidateCards.every((cards) => cards.length > 0)) {
      // Pick one from each
      for (const c0 of candidateCards[0]) {
        for (const c1 of candidateCards[1]) {
          for (const c2 of candidateCards[2]) {
            for (const c3 of candidateCards[3]) {
              for (const c4 of candidateCards[4]) {
                callback([c0, c1, c2, c3, c4]);
              }
            }
          }
        }
      }
    }
  }

  // 6-card pair straights (3 consecutive pairs)
  for (let i = 0; i <= naturalOrder.length - 3; i++) {
    const slice = naturalOrder.slice(i, i + 3);
    const candidatePairs = slice.map((r) => {
      const cards = hand.filter((c) => c.rank === r && !isWildcard(c, levelRank));
      return cards.length >= 2 ? cards.slice(0, 2) : null;
    });
    if (candidatePairs.every((p) => p !== null)) {
      callback([
        ...candidatePairs[0]!,
        ...candidatePairs[1]!,
        ...candidatePairs[2]!,
      ]);
    }
  }

  // 6-card plates (2 consecutive triples)
  for (let i = 0; i <= naturalOrder.length - 2; i++) {
    const slice = naturalOrder.slice(i, i + 2);
    const candidateTriples = slice.map((r) => {
      const cards = hand.filter((c) => c.rank === r && !isWildcard(c, levelRank));
      return cards.length >= 3 ? cards.slice(0, 3) : null;
    });
    if (candidateTriples.every((t) => t !== null)) {
      callback([
        ...candidateTriples[0]!,
        ...candidateTriples[1]!,
      ]);
    }
  }
}
