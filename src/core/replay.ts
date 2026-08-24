import { Card, Combo, GameHistoryEntry, LevelRank, PlayerSeat, ReplayRecord, TrickPlay } from './types';
import { describeCombo } from './combos';

export interface ReplayStepState {
  stepIndex: number;
  totalSteps: number;
  currentTurn: PlayerSeat;
  actionTaken: GameHistoryEntry | null;
  hands: Card[][];
  trickPlays: Record<number, TrickPlay | null>;
  currentCombo: Combo | null;
  commentary: string;
  isBlunder?: boolean;
}

/**
 * Reconstruct game state at step k from a ReplayRecord
 */
export function getReplayStep(record: ReplayRecord, stepIndex: number): ReplayStepState {
  const totalSteps = record.history.length;
  const clampedStep = Math.max(0, Math.min(totalSteps, stepIndex));
  const is6p = record.mode === '6p' || record.initialHands.length === 6;
  const playerCount = is6p ? 6 : 4;

  // Initialize hands from initial hands
  let currentHands: Card[][] = record.initialHands.map((h) => [...h]);

  let currentTrickPlays: Record<number, TrickPlay | null> = {};
  for (let i = 0; i < playerCount; i++) currentTrickPlays[i] = null;

  let currentCombo: Combo | null = null;
  let lastAction: GameHistoryEntry | null = null;
  let commentary = '开局首发领牌阶段。';
  let isBlunder = false;

  const seatNames4p: Record<number, string> = {
    0: '我方 (南)',
    1: '右家 (东)',
    2: '对家 (北)',
    3: '左家 (西)',
  };

  const seatNames6p: Record<number, string> = {
    0: '我方 (南)',
    1: '东南 (对方1)',
    2: '西北 (搭档1)',
    3: '正北 (对方2)',
    4: '东北 (搭档2)',
    5: '西南 (对方3)',
  };

  const seatNames = is6p ? seatNames6p : seatNames4p;

  // Replay actions up to clampedStep
  for (let i = 0; i < clampedStep; i++) {
    const entry = record.history[i];
    lastAction = entry;

    if (entry.action === 'play' && entry.combo) {
      const cardIds = new Set(entry.combo.cards.map((c) => c.id));
      if (currentHands[entry.seat]) {
        currentHands[entry.seat] = currentHands[entry.seat].filter((c) => !cardIds.has(c.id));
      }
      currentTrickPlays[entry.seat] = {
        seat: entry.seat,
        action: 'play',
        combo: entry.combo,
        cards: entry.combo.cards,
      };
      currentCombo = entry.combo;

      // Commentary
      const comboDesc = describeCombo(entry.combo);
      commentary = `${seatNames[entry.seat] || `玩家${entry.seat}`} 打出【${comboDesc}】(${entry.combo.cards.length}张)。`;

      // Check if team cut teammate
      if (entry.seat === 0 && currentTrickPlays[2]?.action === 'play') {
        commentary += ' ⚠️ 注意：此处压了搭档的牌，需确认是否为超车抢权或搭档弱牌接应。';
      }
    } else {
      currentTrickPlays[entry.seat] = {
        seat: entry.seat,
        action: 'pass',
      };
      commentary = `${seatNames[entry.seat] || `玩家${entry.seat}`} 选择【过牌】。`;
    }

    // Check if new trick starts (all active players passed)
    if (entry.handsAfter) {
      currentHands = entry.handsAfter.map((h) => [...h]);
    }
  }

  const nextTurn = clampedStep < totalSteps ? record.history[clampedStep].seat : 0;

  return {
    stepIndex: clampedStep,
    totalSteps,
    currentTurn: nextTurn,
    actionTaken: lastAction,
    hands: currentHands,
    trickPlays: currentTrickPlays,
    currentCombo,
    commentary,
    isBlunder,
  };
}
