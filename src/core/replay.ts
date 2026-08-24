import { Card, Combo, GameHistoryEntry, LevelRank, PlayerSeat, ReplayRecord, TrickPlay } from './types';
import { describeCombo } from './combos';

export interface ReplayStepState {
  stepIndex: number;
  totalSteps: number;
  currentTurn: PlayerSeat;
  actionTaken: GameHistoryEntry | null;
  hands: [Card[], Card[], Card[], Card[]];
  trickPlays: Record<PlayerSeat, TrickPlay | null>;
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

  // Initialize hands from initial hands
  let currentHands: [Card[], Card[], Card[], Card[]] = [
    [...record.initialHands[0]],
    [...record.initialHands[1]],
    [...record.initialHands[2]],
    [...record.initialHands[3]],
  ];

  let currentTrickPlays: Record<PlayerSeat, TrickPlay | null> = { 0: null, 1: null, 2: null, 3: null };
  let currentCombo: Combo | null = null;
  let lastAction: GameHistoryEntry | null = null;
  let commentary = '开局首发领牌阶段。';
  let isBlunder = false;

  const seatNames: Record<PlayerSeat, string> = {
    0: '我方 (南)',
    1: '右家 (东)',
    2: '对家 (北)',
    3: '左家 (西)',
  };

  // Replay actions up to clampedStep
  for (let i = 0; i < clampedStep; i++) {
    const entry = record.history[i];
    lastAction = entry;

    if (entry.action === 'play' && entry.combo) {
      const cardIds = new Set(entry.combo.cards.map((c) => c.id));
      currentHands[entry.seat] = currentHands[entry.seat].filter((c) => !cardIds.has(c.id));
      currentTrickPlays[entry.seat] = {
        seat: entry.seat,
        action: 'play',
        combo: entry.combo,
        cards: entry.combo.cards,
      };
      currentCombo = entry.combo;

      // Commentary
      const comboDesc = describeCombo(entry.combo);
      commentary = `${seatNames[entry.seat]} 打出【${comboDesc}】(${entry.combo.cards.length}张)。`;

      // Check if team cut teammate
      if (entry.seat === 0 && currentTrickPlays[2]?.action === 'play') {
        commentary += ' ⚠️ 注意：此处压了搭档的牌，需确认是否为超车抢权或搭档弱牌接应。';
      }
    } else {
      currentTrickPlays[entry.seat] = {
        seat: entry.seat,
        action: 'pass',
      };
      commentary = `${seatNames[entry.seat]} 选择【过牌】。`;
    }

    // Check if new trick starts (all active players passed)
    // If next step exists or current entry cleared trick
    if (entry.handsAfter) {
      currentHands = [
        [...entry.handsAfter[0]],
        [...entry.handsAfter[1]],
        [...entry.handsAfter[2]],
        [...entry.handsAfter[3]],
      ];
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
