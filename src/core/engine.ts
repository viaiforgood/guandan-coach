import { Card, Combo, GameHistoryEntry, GameState, LevelRank, PlayerSeat, ReplayRecord, Team, TrickPlay } from './types';
import { createDeck, dealHands, shuffleDeck, sortHand } from './cards';
import { compare } from './combos';

export const LEVEL_SEQUENCE: LevelRank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export function levelToRank(level: number): LevelRank {
  const idx = Math.max(0, Math.min(LEVEL_SEQUENCE.length - 1, level - 2));
  return LEVEL_SEQUENCE[idx];
}

export function rankToLevel(rank: LevelRank): number {
  return LEVEL_SEQUENCE.indexOf(rank) + 2;
}

export function getTeamOf(seat: PlayerSeat): Team {
  return seat === 0 || seat === 2 ? 0 : 1;
}

export function initMatch(startingRank: LevelRank = '2'): GameState {
  const initialLevel = rankToLevel(startingRank);
  return startRound({
    levelRank: startingRank,
    teamLevels: [initialLevel, initialLevel],
    hands: [[], [], [], []],
    initialHands: [[], [], [], []],
    currentTurn: 0,
    lastPlayerIndex: null,
    currentCombo: null,
    history: [],
    trickPlays: { 0: null, 1: null, 2: null, 3: null },
    finishedOrder: [],
    phase: 'playing',
    firstLeadSeat: 0,
    isGodMode: false,
  });
}

export function startRound(prevState: GameState): GameState {
  const deck = shuffleDeck(createDeck());
  const dealt = dealHands(deck);

  const levelRank = prevState.levelRank;
  const sortedHands = dealt.map((hand) => sortHand(hand, levelRank, true)) as [Card[], Card[], Card[], Card[]];

  const firstLead = prevState.finishedOrder.length > 0 ? prevState.finishedOrder[0] : 0;

  return {
    ...prevState,
    hands: sortedHands,
    initialHands: [
      [...sortedHands[0]],
      [...sortedHands[1]],
      [...sortedHands[2]],
      [...sortedHands[3]],
    ],
    currentTurn: firstLead,
    lastPlayerIndex: null,
    currentCombo: null,
    history: [],
    trickPlays: { 0: null, 1: null, 2: null, 3: null },
    finishedOrder: [],
    phase: 'playing',
    firstLeadSeat: firstLead,
    isGodMode: prevState.isGodMode || false,
  };
}

/**
 * Swap Hands Rematch (复赛模式 · 换牌挑战)
 * Swaps cards between Team 0 (South/North) and Team 1 (East/West):
 * - User (Seat 0) gets Opponent (Seat 1) hand
 * - Teammate (Seat 2) gets Opponent (Seat 3) hand
 * - Opponents get User & Teammate hands
 */
export function startSwapHandsMatch(prevState: GameState): GameState {
  const { initialHands, levelRank } = prevState;

  // Swap: 0 <-> 1, 2 <-> 3
  const swappedHands: [Card[], Card[], Card[], Card[]] = [
    sortHand([...initialHands[1]], levelRank, true),
    sortHand([...initialHands[0]], levelRank, true),
    sortHand([...initialHands[3]], levelRank, true),
    sortHand([...initialHands[2]], levelRank, true),
  ];

  return {
    ...prevState,
    hands: swappedHands,
    initialHands: [
      [...swappedHands[0]],
      [...swappedHands[1]],
      [...swappedHands[2]],
      [...swappedHands[3]],
    ],
    currentTurn: 0,
    lastPlayerIndex: null,
    currentCombo: null,
    history: [],
    trickPlays: { 0: null, 1: null, 2: null, 3: null },
    finishedOrder: [],
    phase: 'playing',
    firstLeadSeat: 0,
  };
}

export function nextActiveSeat(currentSeat: PlayerSeat, hands: Card[][]): PlayerSeat {
  let next = ((currentSeat + 1) % 4) as PlayerSeat;
  while (hands[next].length === 0) {
    next = ((next + 1) % 4) as PlayerSeat;
  }
  return next;
}

export function playMove(
  state: GameState,
  seat: PlayerSeat,
  combo: Combo
): { nextState: GameState; error?: string } {
  if (state.phase !== 'playing') {
    return { nextState: state, error: '当前牌局不在出牌阶段' };
  }
  if (seat !== state.currentTurn) {
    return { nextState: state, error: '未轮到该玩家出牌' };
  }

  const hand = state.hands[seat];
  const cardIds = new Set(combo.cards.map((c) => c.id));
  const hasAll = combo.cards.every((c) => hand.some((hc) => hc.id === c.id));
  if (!hasAll) {
    return { nextState: state, error: '手牌中不包含所出的牌' };
  }

  // If there is an active combo to beat
  if (state.currentCombo) {
    try {
      if (compare(state.currentCombo, combo) >= 0) {
        return { nextState: state, error: '所出牌型无法压过上家' };
      }
    } catch {
      return { nextState: state, error: '牌型与上家不匹配且非炸弹' };
    }
  }

  // Deduct cards from player hand
  const newHand = hand.filter((c) => !cardIds.has(c.id));
  const newHands: [Card[], Card[], Card[], Card[]] = [...state.hands];
  newHands[seat] = newHand;

  // Track finished order
  const finishedOrder = [...state.finishedOrder];
  if (newHand.length === 0 && !finishedOrder.includes(seat)) {
    finishedOrder.push(seat);
  }

  const newTrickPlays = { ...state.trickPlays, [seat]: { seat, action: 'play', combo, cards: combo.cards } as TrickPlay };
  const historyEntry: GameHistoryEntry = {
    seat,
    action: 'play',
    combo,
    cards: combo.cards,
    timestamp: Date.now(),
    handsAfter: [
      [...newHands[0]],
      [...newHands[1]],
      [...newHands[2]],
      [...newHands[3]],
    ],
  };

  // Check if round is over (3 players have finished)
  if (finishedOrder.length >= 3) {
    // Add 4th player
    for (let s = 0; s < 4; s++) {
      if (!finishedOrder.includes(s as PlayerSeat)) {
        finishedOrder.push(s as PlayerSeat);
      }
    }
    const endState = finalizeRound({
      ...state,
      hands: newHands,
      finishedOrder,
      trickPlays: newTrickPlays,
      history: [...state.history, historyEntry],
      phase: 'round_end',
    });
    return { nextState: endState };
  }

  // Advance turn
  const nextSeat = nextActiveSeat(seat, newHands);

  return {
    nextState: {
      ...state,
      hands: newHands,
      currentTurn: nextSeat,
      lastPlayerIndex: seat,
      currentCombo: combo,
      trickPlays: newTrickPlays,
      history: [...state.history, historyEntry],
      finishedOrder,
    },
  };
}

export function passMove(
  state: GameState,
  seat: PlayerSeat
): { nextState: GameState; error?: string } {
  if (state.phase !== 'playing') {
    return { nextState: state, error: '当前牌局不在出牌阶段' };
  }
  if (seat !== state.currentTurn) {
    return { nextState: state, error: '未轮到该玩家出牌' };
  }
  if (!state.currentCombo) {
    return { nextState: state, error: '新的一墩必须领出牌，不可过牌' };
  }

  const newTrickPlays = { ...state.trickPlays, [seat]: { seat, action: 'pass' } as TrickPlay };
  const historyEntry: GameHistoryEntry = {
    seat,
    action: 'pass',
    timestamp: Date.now(),
    handsAfter: [
      [...state.hands[0]],
      [...state.hands[1]],
      [...state.hands[2]],
      [...state.hands[3]],
    ],
  };

  const nextSeat = nextActiveSeat(seat, state.hands);

  // Check if trick is won (all other active players passed back to the last player who played)
  const isTrickComplete = nextSeat === state.lastPlayerIndex || (
    state.lastPlayerIndex !== null && state.hands[state.lastPlayerIndex].length === 0 && nextActiveSeat(state.lastPlayerIndex, state.hands) === nextSeat
  );

  if (isTrickComplete) {
    // Determine who leads next trick: if trick winner already finished, teammate (接风) leads
    let leader = state.lastPlayerIndex!;
    if (state.hands[leader].length === 0) {
      const teammate = ((leader + 2) % 4) as PlayerSeat;
      leader = state.hands[teammate].length > 0 ? teammate : nextActiveSeat(leader, state.hands);
    }

    return {
      nextState: {
        ...state,
        currentTurn: leader,
        lastPlayerIndex: null,
        currentCombo: null,
        trickPlays: { 0: null, 1: null, 2: null, 3: null },
        history: [...state.history, historyEntry],
      },
    };
  }

  return {
    nextState: {
      ...state,
      currentTurn: nextSeat,
      trickPlays: newTrickPlays,
      history: [...state.history, historyEntry],
    },
  };
}

export function calculateRoundScore(finishedOrder: PlayerSeat[]): {
  winningTeam: Team;
  levelGain: number;
  isDoubleDown: boolean;
  scoreDescription: string;
} {
  const first = finishedOrder[0];
  const winningTeam = getTeamOf(first);

  const team0Order = finishedOrder.map(getTeamOf);
  if (team0Order[0] === winningTeam && team0Order[1] === winningTeam) {
    // 1st & 2nd same team: Double Down (双下) -> +3
    return {
      winningTeam,
      levelGain: 3,
      isDoubleDown: true,
      scoreDescription: `${winningTeam === 0 ? '我方' : '对方'}双下（包揽前二），升 3 级！`,
    };
  } else if (team0Order[0] === winningTeam && team0Order[2] === winningTeam) {
    // 1st & 3rd same team -> +2
    return {
      winningTeam,
      levelGain: 2,
      isDoubleDown: false,
      scoreDescription: `${winningTeam === 0 ? '我方' : '对方'}获一、三游，升 2 级！`,
    };
  } else {
    // 1st & 4th same team -> +1
    return {
      winningTeam,
      levelGain: 1,
      isDoubleDown: false,
      scoreDescription: `${winningTeam === 0 ? '我方' : '对方'}获一、四游，升 1 级！`,
    };
  }
}

function finalizeRound(state: GameState): GameState {
  const { winningTeam, levelGain } = calculateRoundScore(state.finishedOrder);
  const newTeamLevels: [number, number] = [...state.teamLevels];
  newTeamLevels[winningTeam] += levelGain;

  const nextLevel = newTeamLevels[winningTeam];
  const nextRank = levelToRank(nextLevel);

  return {
    ...state,
    teamLevels: newTeamLevels,
    levelRank: nextRank,
    phase: nextLevel > 14 ? 'match_end' : 'round_end',
  };
}

/**
 * Export replay record to JSON string
 */
export function exportReplayRecord(state: GameState, title?: string): string {
  const record: ReplayRecord = {
    version: '1.0',
    timestamp: Date.now(),
    levelRank: state.levelRank,
    teamLevels: state.teamLevels,
    initialHands: state.initialHands,
    history: state.history,
    finishedOrder: state.finishedOrder,
    title: title || `掼蛋对战牌谱 (打${state.levelRank})`,
  };
  return JSON.stringify(record, null, 2);
}

/**
 * Import replay record from JSON string
 */
export function importReplayRecord(jsonStr: string): ReplayRecord {
  const record = JSON.parse(jsonStr) as ReplayRecord;
  if (!record.initialHands || !record.history || !record.levelRank) {
    throw new Error('无效的掼蛋牌谱文件格式');
  }
  return record;
}
