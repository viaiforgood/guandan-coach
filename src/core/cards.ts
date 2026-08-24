import { Card, LevelRank, Rank, Suit } from './types';

export const SUITS: Suit[] = ['S', 'H', 'C', 'D'];
export const NATURAL_RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export const SUIT_SYMBOLS: Record<Suit, string> = {
  S: '♠',
  H: '♥',
  C: '♣',
  D: '♦',
};

export const SUIT_NAMES: Record<Suit, string> = {
  S: '黑桃',
  H: '红桃',
  C: '梅花',
  D: '方块',
};

export function isRedSuit(suit: Suit): boolean {
  return suit === 'H' || suit === 'D';
}

/**
 * Creates standard Guandan deck:
 * - 2 decks: 108 cards (4 players)
 * - 3 decks: 162 cards (6 players)
 */
export function createDeck(decksCount: number = 2): Card[] {
  const deck: Card[] = [];
  let idCounter = 0;

  for (let set = 0; set < decksCount; set++) {
    for (const suit of SUITS) {
      for (const rank of NATURAL_RANKS) {
        deck.push({
          id: `c_${suit}_${rank}_${set}_${idCounter++}`,
          suit,
          rank,
        });
      }
    }
    // Jokers for this set
    deck.push({ id: `c_SJ_${set}_${idCounter++}`, suit: 'S', rank: 'SJ' });
    deck.push({ id: `c_BJ_${set}_${idCounter++}`, suit: 'H', rank: 'BJ' });
  }

  return deck;
}

export function isWildcard(card: Card, levelRank: LevelRank): boolean {
  return card.suit === 'H' && card.rank === levelRank;
}

/**
 * Natural value scale:
 * 2: 2, 3: 3 ... 10: 10, J: 11, Q: 12, K: 13, A: 14
 * If rank == levelRank, its value is promoted to 15.
 * SJ (Small Joker): 16
 * BJ (Big Joker): 17
 */
export function rankValue(rank: Rank, levelRank: LevelRank): number {
  if (rank === 'BJ') return 17;
  if (rank === 'SJ') return 16;
  if (rank === levelRank) return 15;

  const map: Record<string, number> = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7,
    '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14,
  };
  return map[rank] || 0;
}

export function naturalRankValue(rank: Rank): number {
  const map: Record<string, number> = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7,
    '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14,
    'SJ': 15, 'BJ': 16,
  };
  return map[rank] || 0;
}

export function naturalValueToRank(val: number): Rank {
  const map: Record<number, Rank> = {
    2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7',
    8: '8', 9: '9', 10: '10', 11: 'J', 12: 'Q', 13: 'K', 14: 'A',
  };
  return map[val];
}

export function shuffleDeck(deck: Card[], rng: () => number = Math.random): Card[] {
  const result = [...deck];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function dealHands(deck: Card[], playerCount: number = 4): Card[][] {
  const expectedTotal = playerCount === 6 ? 162 : 108;
  if (deck.length !== expectedTotal) {
    throw new Error(`Expected ${expectedTotal} cards, got ${deck.length}`);
  }
  const hands: Card[][] = Array.from({ length: playerCount }, () => []);
  for (let i = 0; i < deck.length; i++) {
    hands[i % playerCount].push(deck[i]);
  }
  return hands;
}

export function sortHand(hand: Card[], levelRank: LevelRank, ascending: boolean = true): Card[] {
  return [...hand].sort((a, b) => {
    const va = rankValue(a.rank, levelRank);
    const vb = rankValue(b.rank, levelRank);
    if (va !== vb) {
      return ascending ? va - vb : vb - va;
    }
    // Tie-breaker: wildcards first if descending or special suit order
    const isWa = isWildcard(a, levelRank) ? 1 : 0;
    const isWb = isWildcard(b, levelRank) ? 1 : 0;
    if (isWa !== isWb) {
      return ascending ? isWa - isWb : isWb - isWa;
    }
    return a.suit.localeCompare(b.suit);
  });
}

export function cardLabel(card: Card, levelRank?: LevelRank): string {
  if (card.rank === 'SJ') return '小王';
  if (card.rank === 'BJ') return '大王';
  const prefix = levelRank && isWildcard(card, levelRank) ? '★' : '';
  return `${prefix}${card.rank}${SUIT_SYMBOLS[card.suit]}`;
}

export function cardsToString(cards: Card[], levelRank?: LevelRank): string {
  return cards.map((c) => cardLabel(c, levelRank)).join(' ');
}
