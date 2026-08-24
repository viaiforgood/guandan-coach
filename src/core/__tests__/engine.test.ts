import { describe, it, expect } from 'vitest';
import { createDeck, dealHands, isWildcard, rankValue } from '../cards';
import { classify, compare } from '../combos';
import { choosePlan } from '../optimizer';
import { analyzeCardTracker } from '../tracker';
import { initMatch, playMove, passMove, calculateRoundScore, startSwapHandsMatch, exportReplayRecord, importReplayRecord } from '../engine';
import { getReplayStep } from '../replay';
import { Card, ReplayRecord } from '../types';

describe('Cards & Deck', () => {
  it('creates 108 cards with 4 jokers', () => {
    const deck = createDeck();
    expect(deck.length).toBe(108);
    const sj = deck.filter((c) => c.rank === 'SJ');
    const bj = deck.filter((c) => c.rank === 'BJ');
    expect(sj.length).toBe(2);
    expect(bj.length).toBe(2);
  });

  it('deals 27 cards to 4 hands', () => {
    const deck = createDeck();
    const hands = dealHands(deck);
    expect(hands.length).toBe(4);
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

describe('Combos Classification', () => {
  it('classifies single, pair, triple, and triple_pair', () => {
    const single: Card[] = [{ id: '1', suit: 'S', rank: '3' }];
    const pair: Card[] = [{ id: '1', suit: 'S', rank: '3' }, { id: '2', suit: 'H', rank: '3' }];
    const triple: Card[] = [
      { id: '1', suit: 'S', rank: '3' },
      { id: '2', suit: 'H', rank: '3' },
      { id: '3', suit: 'C', rank: '3' },
    ];
    const tp: Card[] = [
      { id: '1', suit: 'S', rank: '3' },
      { id: '2', suit: 'H', rank: '3' },
      { id: '3', suit: 'C', rank: '3' },
      { id: '4', suit: 'S', rank: '8' },
      { id: '5', suit: 'D', rank: '8' },
    ];

    expect(classify(single, '2')?.category).toBe('single');
    expect(classify(pair, '2')?.category).toBe('pair');
    expect(classify(triple, '2')?.category).toBe('triple');
    expect(classify(tp, '2')?.category).toBe('triple_pair');
  });

  it('classifies straight, steel plate (钢板), and 3-pair straight', () => {
    const straight: Card[] = [
      { id: '1', suit: 'S', rank: '3' },
      { id: '2', suit: 'H', rank: '4' },
      { id: '3', suit: 'C', rank: '5' },
      { id: '4', suit: 'D', rank: '6' },
      { id: '5', suit: 'S', rank: '7' },
    ];
    const plate: Card[] = [
      { id: '1', suit: 'S', rank: '3' },
      { id: '2', suit: 'H', rank: '3' },
      { id: '3', suit: 'C', rank: '3' },
      { id: '4', suit: 'S', rank: '4' },
      { id: '5', suit: 'H', rank: '4' },
      { id: '6', suit: 'C', rank: '4' },
    ];
    const ps: Card[] = [
      { id: '1', suit: 'S', rank: '3' },
      { id: '2', suit: 'H', rank: '3' },
      { id: '3', suit: 'S', rank: '4' },
      { id: '4', suit: 'H', rank: '4' },
      { id: '5', suit: 'S', rank: '5' },
      { id: '6', suit: 'H', rank: '5' },
    ];

    expect(classify(straight, '2')?.category).toBe('straight');
    expect(classify(plate, '2')?.category).toBe('plate');
    expect(classify(ps, '2')?.category).toBe('pair_straight');
  });

  it('classifies 4-to-8 bombs, straight flushes, and joker bombs', () => {
    const bomb4: Card[] = [
      { id: '1', suit: 'S', rank: '9' },
      { id: '2', suit: 'H', rank: '9' },
      { id: '3', suit: 'C', rank: '9' },
      { id: '4', suit: 'D', rank: '9' },
    ];
    const sf: Card[] = [
      { id: '1', suit: 'S', rank: '3' },
      { id: '2', suit: 'S', rank: '4' },
      { id: '3', suit: 'S', rank: '5' },
      { id: '4', suit: 'S', rank: '6' },
      { id: '5', suit: 'S', rank: '7' },
    ];
    const jokerBomb: Card[] = [
      { id: '1', suit: 'S', rank: 'SJ' },
      { id: '2', suit: 'C', rank: 'SJ' },
      { id: '3', suit: 'H', rank: 'BJ' },
      { id: '4', suit: 'D', rank: 'BJ' },
    ];

    const cBomb4 = classify(bomb4, '2')!;
    const cSf = classify(sf, '2')!;
    const cJoker = classify(jokerBomb, '2')!;

    expect(cBomb4.isBomb).toBe(true);
    expect(cSf.isBomb).toBe(true);
    expect(cJoker.isBomb).toBe(true);
    expect(cJoker.bombTier).toBe(12);

    expect(compare(cBomb4, cSf)).toBeLessThan(0); // cSf > cBomb4
    expect(compare(cSf, cJoker)).toBeLessThan(0); // cJoker > cSf
  });
});

describe('Hand Optimizer & 50-Law Tracker', () => {
  it('evaluates hand optimizer and scores plans', () => {
    const hand: Card[] = [
      { id: '1', suit: 'S', rank: '3' },
      { id: '2', suit: 'H', rank: '3' },
      { id: '3', suit: 'C', rank: '3' },
      { id: '4', suit: 'D', rank: '3' }, // 4 of 3
      { id: '5', suit: 'S', rank: '8' },
      { id: '6', suit: 'H', rank: '8' },
    ];
    const result = choosePlan(hand, '2');
    expect(result.best).toBeDefined();
    expect(result.best.groups.length).toBeGreaterThan(0);
  });

  it('tracks 50-Law status accurately', () => {
    const history = [
      {
        seat: 0 as const,
        action: 'play' as const,
        cards: [
          { id: '1', suit: 'S' as const, rank: '5' as const },
          { id: '2', suit: 'H' as const, rank: '5' as const },
        ],
      },
    ];
    const tracker = analyzeCardTracker(history, [], [25, 27, 27, 27], '2');
    expect(tracker.playedCounts['5']).toBe(2);
    expect(tracker.remainingCounts['5']).toBe(6);
  });
});

describe('Engine Match Progression & Scoring', () => {
  it('calculates round scores: double-down +3, 1st&3rd +2, 1st&4th +1', () => {
    expect(calculateRoundScore([0, 2, 1, 3]).levelGain).toBe(3);
    expect(calculateRoundScore([0, 1, 2, 3]).levelGain).toBe(2);
    expect(calculateRoundScore([0, 1, 3, 2]).levelGain).toBe(1);
  });

  it('plays a valid trick and rotates turns', () => {
    const state = initMatch('2');
    expect(state.currentTurn).toBe(0);
    const userHand = state.hands[0];
    const firstCard = userHand[0];
    const singleCombo = classify([firstCard], '2')!;

    const { nextState, error } = playMove(state, 0, singleCombo);
    expect(error).toBeUndefined();
    expect(nextState.hands[0].length).toBe(26);
    expect(nextState.currentTurn).toBe(1);
  });

  it('swaps hands between teams for Rematch Mode (复赛模式)', () => {
    const state = initMatch('2');
    const hand0 = [...state.hands[0]];
    const hand1 = [...state.hands[1]];

    const swapped = startSwapHandsMatch(state);
    expect(swapped.hands[0].length).toBe(hand1.length);
    expect(swapped.hands[1].length).toBe(hand0.length);
    // User hand IDs match opponent's original hand IDs
    expect(swapped.hands[0].map((c) => c.id).sort()).toEqual(hand1.map((c) => c.id).sort());
  });

  it('exports and imports replay records correctly', () => {
    const state = initMatch('2');
    const jsonStr = exportReplayRecord(state, '测试牌谱');
    const imported = importReplayRecord(jsonStr);

    expect(imported.levelRank).toBe('2');
    expect(imported.initialHands.length).toBe(4);
    expect(imported.title).toBe('测试牌谱');
  });

  it('reconstructs replay steps with getReplayStep', () => {
    const sampleRecord: ReplayRecord = {
      version: '1.0',
      timestamp: Date.now(),
      levelRank: '2',
      teamLevels: [2, 2],
      initialHands: [
        [{ id: '1', suit: 'S', rank: '3' }],
        [{ id: '2', suit: 'H', rank: '3' }],
        [{ id: '3', suit: 'C', rank: '3' }],
        [{ id: '4', suit: 'D', rank: '3' }],
      ],
      history: [
        {
          seat: 0,
          action: 'play',
          combo: { category: 'single', length: 1, compareValue: 3, isBomb: false, cards: [{ id: '1', suit: 'S', rank: '3' }] },
        },
      ],
      finishedOrder: [0, 1, 2, 3],
    };

    const step0 = getReplayStep(sampleRecord, 0);
    expect(step0.hands[0].length).toBe(1);

    const step1 = getReplayStep(sampleRecord, 1);
    expect(step1.hands[0].length).toBe(0);
    expect(step1.actionTaken?.action).toBe('play');
  });
});
