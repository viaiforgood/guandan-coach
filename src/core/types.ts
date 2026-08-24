export type Suit = 'S' | 'H' | 'C' | 'D'; // Spades, Hearts, Clubs, Diamonds
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A' | 'SJ' | 'BJ';
export type LevelRank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';
export type GameMode = '4p' | '6p'; // 4-player (2 decks) or 6-player (3 decks)

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
}

export type ComboCategory =
  | 'single'
  | 'pair'
  | 'triple'
  | 'triple_pair'
  | 'straight'
  | 'plate'           // 钢板 (2 consecutive triples: e.g., 333444)
  | 'pair_straight'   // 三连对 (3 consecutive pairs: e.g., 334455)
  | 'bomb'            // 4-12 cards bomb, straight flush, joker bomb
  ;

export interface Combo {
  category: ComboCategory;
  length: number;
  compareValue: number; // primary comparison value
  isBomb: boolean;
  bombTier?: number;   // 4..12 for n-card bomb, 10 for straight flush, 12..16 for joker bomb
  cards: Card[];
  description?: string;
}

export interface HandGroup {
  category: ComboCategory;
  cards: Card[];
  label?: string;
}

export interface HandPlan {
  name: string;
  groups: HandGroup[];
  score: number;
  deadCards: Card[];
  bombs: HandGroup[];
  details: {
    bombCount: number;
    deadCardCount: number;
    structureScore: number;
    wildcardEfficiency: number;
  };
}

export type PlayerSeat = 0 | 1 | 2 | 3 | 4 | 5; // 4p uses 0..3, 6p uses 0..5
export type Team = 0 | 1; // Team 0 (我方: 0, 2, 4), Team 1 (对方: 1, 3, 5)

export interface TrickPlay {
  seat: PlayerSeat;
  action: 'play' | 'pass';
  combo?: Combo;
  cards?: Card[];
}

export interface GameHistoryEntry {
  seat: PlayerSeat;
  action: 'play' | 'pass';
  combo?: Combo;
  cards?: Card[];
  timestamp?: number;
  handsAfter?: Card[][];
}

export interface TributeInfo {
  required: boolean;
  tributes: Array<{
    from: PlayerSeat;
    to: PlayerSeat;
    card?: Card;
  }>;
  returns: Array<{
    from: PlayerSeat;
    to: PlayerSeat;
    card?: Card;
  }>;
  antiTribute: boolean;
}

export type GamePhase = 'tribute' | 'playing' | 'round_end' | 'match_end';

export interface GameState {
  mode: GameMode;
  levelRank: LevelRank;
  teamLevels: [number, number]; // Index 0: Team 0, Index 1: Team 1 (2..14 mapping to 2..A)
  hands: Card[][];
  initialHands: Card[][];
  currentTurn: PlayerSeat;
  lastPlayerIndex: PlayerSeat | null;
  currentCombo: Combo | null;
  history: GameHistoryEntry[];
  trickPlays: Record<number, TrickPlay | null>;
  finishedOrder: PlayerSeat[];
  phase: GamePhase;
  tributeInfo?: TributeInfo;
  firstLeadSeat: PlayerSeat;
  isGodMode?: boolean; // 上帝模式 / 明牌模式
}

export interface ReplayRecord {
  version: string;
  timestamp: number;
  mode?: GameMode;
  levelRank: LevelRank;
  teamLevels: [number, number];
  initialHands: Card[][];
  history: GameHistoryEntry[];
  finishedOrder: PlayerSeat[];
  title?: string;
  notes?: string;
}

export interface CoachSuggestion {
  action: 'play' | 'pass';
  combo?: Combo;
  rationale: string;
  confidence?: 'high' | 'medium' | 'low';
  principle?: string;
  alternativeActions?: Array<{
    action: 'play' | 'pass';
    combo?: Combo;
    note: string;
  }>;
}

export interface PuzzleScenario {
  id: string;
  title: string;
  difficulty: '入门' | '进阶' | '大师';
  category: '残局攻防' | '五十定律' | '炸弹决策' | '搭档配合' | '逢人配妙用';
  description: string;
  levelRank: LevelRank;
  userHand: Card[];
  seatCounts: number[];
  currentCombo: Combo | null;
  lastPlayerIndex: PlayerSeat | null;
  playedKeyCards?: Record<string, number>;
  optimalMove: {
    action: 'play' | 'pass';
    cardIds?: string[];
  };
  explanation: string;
  principleCitation: string;
}

export interface PlayerEmoji {
  seat: PlayerSeat;
  emoji: string;
  text?: string;
  id: string;
}
