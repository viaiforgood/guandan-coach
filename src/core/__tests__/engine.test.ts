import { describe, it, expect } from 'vitest';
import { createDeck, dealHands, isWildcard, rankValue } from '../cards';
import { classify, compare } from '../combos';
import { choosePlan } from '../optimizer';
import { analyzeCardTracker } from '../tracker';
import { initMatch, playMove, passMove, calculateRoundScore, startSwapHandsMatch, exportReplayRecord, importReplayRecord } from '../engine';
import { getReplayStep } from '../replay';
import { Card, ReplayRecord } from '../types';

describe('Cards & Deck', () => {
  it('creates 108 cards with 4 jokers for 2-deck 4p mode', () => {
    const deck = createDeck(2);
    expect(deck.length).toBe(108);
    const sj = deck.filter((c) => c.rank === 'SJ');
    const bj = deck.filter((c) => c.rank === 'BJ');
    expect(sj.length).toBe(2);
    expect(bj.length).toBe(2);
  });

  it('creates 162 cards with 6 jokers for 3-deck 6p mode', () => {
    const deck = createDeck(3);
    expect(deck.length).toBe(162);
    const sj = deck.filter((c) => c.rank === 'SJ');
    const bj = deck.filter((c) => c.rank === 'BJ');
    expect(sj.length).toBe(3);
    expect(bj.length).toBe(3);
  });

  it('deals 27 cards each to 6 players in 6p mode', () => {
    const deck = createDeck(3);
    const hands = dealHands(deck, 6);
    expect(hands.length).toBe(6);
    hands.forEach((h) => expect(h.length).toBe(27));
  });

  it('recognizes heart level rank as wildcard (逢人配)', () => {
    const cardH2: Card = { id: '1', suit: 'H', rank: '2' };
    const cardS2: Card = { id: '2', suit: 'S', rank: '2' };
    expect(isWildcard(cardH2, '2')).toBe(true);
    expect(isWildcard(cardS2, '2')).toBe(false);
  });

  it('ranks level-rank above A and jokers above level-rank', () => {
    expect(rankValue('A', '2')).toBe(14);
    expect(rankValue('2', '2')).toBe(15);
    expect(rankValue('SJ', '2')).toBe(16);
    expect(rankValue('BJ', '2')).toBe(17);
  });
});

describe('Combos Classification & Bombs', () => {
  it('classifies 6-Joker Supreme Heavenly Bomb (六王天王炸)', () => {
    const sixJokers: Card[] = [
      { id: '1', suit: 'S', rank: 'SJ' },
      { id: '2', suit: 'C', rank: 'SJ' },
      { id: '3', suit: 'D', rank: 'SJ' },
      { id: '4', suit: 'H', rank: 'BJ' },
      { id: '5', suit: 'S', rank: 'BJ' },
      { id: '6', suit: 'C', rank: 'BJ' },
    ];
    const combo = classify(sixJokers, '2')!;
    expect(combo.isBomb).toBe(true);
    expect(combo.bombTier).toBe(16);
    expect(combo.description).toBe('六王至尊天王炸');
  });

  it('classifies 8-to-12 card bombs in 3-deck mode', () => {
    const bomb9: Card[] = Array.from({ length: 9 }, (_, i) => ({
      id: `c_${i}`,
      suit: (['S', 'H', 'C', 'D'][i % 4] as any),
      rank: '8' as const,
    }));
    const combo = classify(bomb9, '2')!;
    expect(combo.isBomb).toBe(true);
    expect(combo.bombTier).toBe(9);
  });
});

describe('6-Player Mode 3v3 Engine & Scoring', () => {
  it('calculates 6p scoring: 1-2-3 sweep +4, 1-2-4 +3, 1-3-4 +2, 1-X-X +1', () => {
    // 0, 2, 4 are Team 0; 1, 3, 5 are Team 1
    // 1-2-3 all Team 0: [0, 2, 4, 1, 3, 5]
    expect(calculateRoundScore([0, 2, 4, 1, 3, 5], '6p').levelGain).toBe(4);
    // 1-2-4 same team: [0, 2, 1, 4, 3, 5]
    expect(calculateRoundScore([0, 2, 1, 4, 3, 5], '6p').levelGain).toBe(3);
    // 1-3-4 same team: [0, 1, 2, 4, 3, 5]
    expect(calculateRoundScore([0, 1, 2, 4, 3, 5], '6p').levelGain).toBe(2);
    // 1st only: [0, 1, 3, 5, 2, 4]
    expect(calculateRoundScore([0, 1, 3, 5, 2, 4], '6p').levelGain).toBe(1);
  });

  it('initializes and plays turns correctly in 6p mode', () => {
    const state = initMatch('2', '6p');
    expect(state.hands.length).toBe(6);
    expect(state.hands[0].length).toBe(27);
    expect(state.currentTurn).toBe(0);

    const firstCard = state.hands[0][0];
    const combo = classify([firstCard], '2')!;
    const { nextState, error } = playMove(state, 0, combo);
    expect(error).toBeUndefined();
    expect(nextState.hands[0].length).toBe(26);
    expect(nextState.currentTurn).toBe(1);
  });

  it('swaps hands among 6 players in 6p Rematch Mode', () => {
    const state = initMatch('2', '6p');
    const orig0 = [...state.hands[0]];
    const orig1 = [...state.hands[1]];

    const swapped = startSwapHandsMatch(state);
    expect(swapped.hands.length).toBe(6);
    expect(swapped.hands[0].map((c) => c.id).sort()).toEqual(orig1.map((c) => c.id).sort());
    expect(swapped.hands[1].map((c) => c.id).sort()).toEqual(orig0.map((c) => c.id).sort());
  });
});
