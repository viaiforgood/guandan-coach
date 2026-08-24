import { Card, Combo, GameHistoryEntry, GameMode, GameState, LevelRank, PlayerSeat, ReplayRecord, Team, TrickPlay } from './types';
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

export function getTeamOf(seat: PlayerSeat, mode: GameMode = '4p'): Team {
  if (mode === '6p') {
    return seat % 2 === 0 ? 0 : 1; // 0, 2, 4 -> Team 0; 1, 3, 5 -> Team 1
  }
  return seat === 0 || seat === 2 ? 0 : 1;
}

export function initMatch(startingRank: LevelRank = '2', mode: GameMode = '4p'): GameState {
  const initialLevel = rankToLevel(startingRank);
  const playerCount = mode === '6p' ? 6 : 4;
  const initialTrickPlays: Record<number, TrickPlay | null> = {};
  for (let i = 0; i < playerCount; i++) initialTrickPlays[i] = null;

  return startRound({
    mode,
    levelRank: startingRank,
    teamLevels: [initialLevel, initialLevel],
    hands: Array.from({ length: playerCount }, () => []),
    initialHands: Array.from({ length: playerCount }, () => []),
    currentTurn: 0,
    lastPlayerIndex: null,
    currentCombo: null,
    history: [],
    trickPlays: initialTrickPlays,
    finishedOrder: [],
    phase: 'playing',
    firstLeadSeat: 0,
    isGodMode: false,
  });
}

export function startRound(prevState: GameState): GameState {
  const mode = prevState.mode || '4p';
  const playerCount = mode === '6p' ? 6 : 4;
  const decksCount = mode === '6p' ? 3 : 2;

  const deck = shuffleDeck(createDeck(decksCount));
  const dealt = dealHands(deck, playerCount);

  const levelRank = prevState.levelRank;
  const sortedHands = dealt.map((hand) => sortHand(hand, levelRank, true));

  const firstLead = prevState.finishedOrder.length > 0 ? prevState.finishedOrder[0] : 0;
  const initialTrickPlays: Record<number, TrickPlay | null> = {};
  for (let i = 0; i < playerCount; i++) initialTrickPlays[i] = null;

  return {
    ...prevState,
    mode,
    hands: sortedHands,
    initialHands: sortedHands.map((h) => [...h]),
    currentTurn: firstLead,
    lastPlayerIndex: null,
    currentCombo: null,
    history: [],
    trickPlays: initialTrickPlays,
    finishedOrder: [],
    phase: 'playing',
    firstLeadSeat: firstLead,
    isGodMode: prevState.isGodMode || false,
  };
}

/**
 * Swap Hands Rematch (复赛模式 · 换牌挑战)
 */
export function startSwapHandsMatch(prevState: GameState): GameState {
  const { initialHands, levelRank, mode } = prevState;
  const playerCount = mode === '6p' ? 6 : 4;

  const swappedHands: Card[][] = [];
  if (mode === '6p') {
    // 0 <-> 1, 2 <-> 3, 4 <-> 5
    swappedHands[0] = sortHand([...initialHands[1]], levelRank, true);
    swappedHands[1] = sortHand([...initialHands[0]], levelRank, true);
    swappedHands[2] = sortHand([...initialHands[3]], levelRank, true);
    swappedHands[3] = sortHand([...initialHands[2]], levelRank, true);
    swappedHands[4] = sortHand([...initialHands[5]], levelRank, true);
    swappedHands[5] = sortHand([...initialHands[4]], levelRank, true);
  } else {
    // 0 <-> 1, 2 <-> 3
    swappedHands[0] = sortHand([...initialHands[1]], levelRank, true);
    swappedHands[1] = sortHand([...initialHands[0]], levelRank, true);
    swappedHands[2] = sortHand([...initialHands[3]], levelRank, true);
    swappedHands[3] = sortHand([...initialHands[2]], levelRank, true);
  }

  const initialTrickPlays: Record<number, TrickPlay | null> = {};
  for (let i = 0; i < playerCount; i++) initialTrickPlays[i] = null;

  return {
    ...prevState,
    hands: swappedHands,
    initialHands: swappedHands.map((h) => [...h]),
    currentTurn: 0,
    lastPlayerIndex: null,
    currentCombo: null,
    history: [],
    trickPlays: initialTrickPlays,
    finishedOrder: [],
    phase: 'playing',
    firstLeadSeat: 0,
  };
}

export function nextActiveSeat(currentSeat: PlayerSeat, hands: Card[][]): PlayerSeat {
  const count = hands.length;
  let next = ((currentSeat + 1) % count) as PlayerSeat;
  while (hands[next].length === 0) {
    next = ((next + 1) % count) as PlayerSeat;
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
  const newHands: Card[][] = state.hands.map((h, idx) => (idx === seat ? newHand : h));

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
    handsAfter: newHands.map((h) => [...h]),
  };

  const playerCount = state.hands.length;
  // Check if round is over (all except last player finished)
  if (finishedOrder.length >= playerCount - 1) {
    for (let s = 0; s < playerCount; s++) {
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
    handsAfter: state.hands.map((h) => [...h]),
  };

  const nextSeat = nextActiveSeat(seat, state.hands);

  // Check if trick is complete
  const isTrickComplete =
    nextSeat === state.lastPlayerIndex ||
    (state.lastPlayerIndex !== null &&
      state.hands[state.lastPlayerIndex].length === 0 &&
      nextActiveSeat(state.lastPlayerIndex, state.hands) === nextSeat);

  if (isTrickComplete) {
    let leader = state.lastPlayerIndex!;
    if (state.hands[leader].length === 0) {
      const teammate = ((leader + 2) % state.hands.length) as PlayerSeat;
      leader = state.hands[teammate].length > 0 ? teammate : nextActiveSeat(leader, state.hands);
    }

    const resetTrickPlays: Record<number, TrickPlay | null> = {};
    for (let i = 0; i < state.hands.length; i++) resetTrickPlays[i] = null;

    return {
      nextState: {
        ...state,
        currentTurn: leader,
        lastPlayerIndex: null,
        currentCombo: null,
        trickPlays: resetTrickPlays,
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

export function calculateRoundScore(
  finishedOrder: PlayerSeat[],
  mode: GameMode = '4p'
): {
  winningTeam: Team;
  levelGain: number;
  isDoubleDown: boolean;
  scoreDescription: string;
} {
  const first = finishedOrder[0];
  const winningTeam = getTeamOf(first, mode);

  if (mode === '6p') {
    // 6-Player Mode (3v3 Team Battle)
    const teamOrder = finishedOrder.map((s) => getTeamOf(s, '6p'));
    const teamWins = teamOrder.filter((t) => t === winningTeam);

    // 1st, 2nd, 3rd all same team -> +4 levels (大满贯)
    if (teamOrder[0] === winningTeam && teamOrder[1] === winningTeam && teamOrder[2] === winningTeam) {
      return {
        winningTeam,
        levelGain: 4,
        isDoubleDown: true,
        scoreDescription: `${winningTeam === 0 ? '我方' : '对方'}3v3全胜大满贯（包揽前三游），狂升 4 级！`,
      };
    } else if (teamOrder[0] === winningTeam && teamOrder[1] === winningTeam) {
      // 1st & 2nd same team -> +3 levels
      return {
        winningTeam,
        levelGain: 3,
        isDoubleDown: true,
        scoreDescription: `${winningTeam === 0 ? '我方' : '对方'}包揽一、二游，升 3 级！`,
      };
    } else if (teamOrder[0] === winningTeam && teamOrder[2] === winningTeam) {
      // 1st & 3rd same team -> +2 levels
      return {
        winningTeam,
        levelGain: 2,
        isDoubleDown: false,
        scoreDescription: `${winningTeam === 0 ? '我方' : '对方'}获一、三游，升 2 级！`,
      };
    } else {
      // 1st only -> +1 level
      return {
        winningTeam,
        levelGain: 1,
        isDoubleDown: false,
        scoreDescription: `${winningTeam === 0 ? '我方' : '对方'}获头游，升 1 级！`,
      };
    }
  }

  // 4-Player Standard Mode
  const team0Order = finishedOrder.map((s) => getTeamOf(s, '4p'));
  if (team0Order[0] === winningTeam && team0Order[1] === winningTeam) {
    return {
      winningTeam,
      levelGain: 3,
      isDoubleDown: true,
      scoreDescription: `${winningTeam === 0 ? '我方' : '对方'}双下（包揽前二），升 3 级！`,
    };
  } else if (team0Order[0] === winningTeam && team0Order[2] === winningTeam) {
    return {
      winningTeam,
      levelGain: 2,
      isDoubleDown: false,
      scoreDescription: `${winningTeam === 0 ? '我方' : '对方'}获一、三游，升 2 级！`,
    };
  } else {
    return {
      winningTeam,
      levelGain: 1,
      isDoubleDown: false,
      scoreDescription: `${winningTeam === 0 ? '我方' : '对方'}获一、四游，升 1 级！`,
    };
  }
}

function finalizeRound(state: GameState): GameState {
  const { winningTeam, levelGain } = calculateRoundScore(state.finishedOrder, state.mode);
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

export function exportReplayRecord(state: GameState, title?: string): string {
  const record: ReplayRecord = {
    version: '1.0',
    timestamp: Date.now(),
    mode: state.mode || '4p',
    levelRank: state.levelRank,
    teamLevels: state.teamLevels,
    initialHands: state.initialHands,
    history: state.history,
    finishedOrder: state.finishedOrder,
    title: title || `${state.mode === '6p' ? '六人团战牌谱' : '标准掼蛋牌谱'} (打${state.levelRank})`,
  };
  return JSON.stringify(record, null, 2);
}

export function importReplayRecord(jsonStr: string): ReplayRecord {
  const record = JSON.parse(jsonStr) as ReplayRecord;
  if (!record.initialHands || !record.history || !record.levelRank) {
    throw new Error('无效的掼蛋牌谱文件格式');
  }
  return record;
}
