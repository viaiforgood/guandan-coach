import { Card, CoachSuggestion, Combo, GameState, LevelRank, PlayerSeat } from './types';
import { legalPlays } from './moves';
import { compare, describeCombo } from './combos';
import { cardLabel, cardsToString, isWildcard, rankValue } from './cards';
import { choosePlan, summarizePlan } from './optimizer';
import { citePrinciple } from './knowledge';

export type AIDifficulty = 'novice' | 'standard' | 'master';

const TEAM_MAP: Record<number, number> = { 0: 0, 1: 1, 2: 0, 3: 1, 4: 0, 5: 1 };

export function isTeammate(seatA: PlayerSeat, seatB: PlayerSeat): boolean {
  return seatA % 2 === seatB % 2;
}

export function chooseAIAction(
  seat: PlayerSeat,
  hand: Card[],
  gameState: GameState,
  difficulty: AIDifficulty = 'standard'
): { action: 'play' | 'pass'; combo?: Combo } {
  const { currentCombo, lastPlayerIndex, levelRank, hands } = gameState;
  const options = legalPlays(hand, currentCombo, levelRank);

  // 1. Leading a new trick
  if (!currentCombo) {
    if (options.length === 0) return { action: 'pass' };

    const plan = choosePlan(hand, levelRank).best.groups;
    const nonBombs = plan.filter((g) => g.category !== 'bomb');
    const candidateGroups = nonBombs.length > 0 ? nonBombs : plan;

    // Sort by lowest rank
    const getLowRank = (cards: Card[]) =>
      Math.min(...cards.map((c) => rankValue(c.rank, levelRank)));

    candidateGroups.sort((a, b) => {
      const ra = getLowRank(a.cards);
      const rb = getLowRank(b.cards);
      if (ra !== rb) return ra - rb;
      return b.cards.length - a.cards.length; // More cards first
    });

    const chosenGroup = candidateGroups[0];
    const matchingCombo = options.find(
      (opt) =>
        opt.cards.length === chosenGroup.cards.length &&
        opt.cards.every((c) => chosenGroup.cards.some((gc) => gc.id === c.id))
    );

    if (matchingCombo) {
      return { action: 'play', combo: matchingCombo };
    }

    // Fallback: pick smallest non-bomb or smallest combo
    const nonBombOptions = options.filter((o) => !o.isBomb);
    const pool = nonBombOptions.length > 0 ? nonBombOptions : options;
    pool.sort((a, b) => {
      try {
        return compare(a, b);
      } catch {
        return 0;
      }
    });

    return { action: 'play', combo: pool[0] };
  }

  // 2. Following / Beating
  const partnerIsWinning =
    lastPlayerIndex !== null && isTeammate(seat, lastPlayerIndex);

  // If partner is already winning, pass unless we can finish our entire hand
  if (partnerIsWinning) {
    const finishingPlay = options.find((opt) => opt.cards.length === hand.length);
    if (finishingPlay) {
      return { action: 'play', combo: finishingPlay };
    }
    return { action: 'pass' };
  }

  // Opponent is winning
  const nonBombOptions = options.filter((o) => !o.isBomb);
  if (nonBombOptions.length > 0) {
    nonBombOptions.sort((a, b) => {
      try {
        return compare(a, b);
      } catch {
        return 0;
      }
    });
    return { action: 'play', combo: nonBombOptions[0] };
  }

  // Bomb options
  const bombOptions = options.filter((o) => o.isBomb);
  if (bombOptions.length > 0) {
    // Check if opponents are threatening to finish (hand <= 6) or end of round
    const nextEnemy = ((seat + 1) % 4) as PlayerSeat;
    const prevEnemy = ((seat + 3) % 4) as PlayerSeat;
    const enemyThreat = hands[nextEnemy].length <= 6 || hands[prevEnemy].length <= 6 || hand.length <= 6;

    if (difficulty === 'master' || enemyThreat || hand.length <= 7) {
      bombOptions.sort((a, b) => {
        try {
          return compare(a, b);
        } catch {
          return 0;
        }
      });
      return { action: 'play', combo: bombOptions[0] };
    }
  }

  return { action: 'pass' };
}

export function getCoachSuggestion(
  hand: Card[],
  gameState: GameState,
  selfSeat: PlayerSeat = 0
): CoachSuggestion {
  const { currentCombo, lastPlayerIndex, levelRank } = gameState;
  const partnerIsWinning =
    lastPlayerIndex !== null && isTeammate(selfSeat, lastPlayerIndex);

  const planResult = choosePlan(hand, levelRank);
  const structureSummary = summarizePlan(planResult.best.groups, levelRank);

  const aiDecision = chooseAIAction(selfSeat, hand, gameState, 'master');

  if (aiDecision.action === 'pass') {
    if (partnerIsWinning) {
      return {
        action: 'pass',
        rationale: `${structureSummary} 对家（搭档）出牌正处于全场领先位置！根据搭档配合原则，不要轻易压牌抢跑，建议主动【过牌】协助搭档控局。${citePrinciple('partner_defer')}`,
        confidence: 'high',
        principle: 'partner_defer',
      };
    }
    return {
      action: 'pass',
      rationale: `${structureSummary} 当前无法用常规手牌压过对手，且保留炸弹在残局有更大利润，建议果断【过牌】等待下一次回手时机。${citePrinciple('bomb_is_tool')}`,
      confidence: 'high',
      principle: 'bomb_is_tool',
    };
  }

  const combo = aiDecision.combo!;
  const comboLabel = describeCombo(combo);
  const cardsStr = cardsToString(combo.cards, levelRank);

  if (!currentCombo) {
    // Leading
    const planExplanation = planResult.explanation;
    if (combo.isBomb) {
      return {
        action: 'play',
        combo,
        rationale: `${structureSummary}\n${planExplanation}\n当前获得领牌权，手牌无更优弱路，以炸弹（${comboLabel}：${cardsStr}）强行开路，炸后务必尽快交还牌权。${citePrinciple('bomb_plan_ahead')}`,
        confidence: 'medium',
        principle: 'bomb_plan_ahead',
      };
    }
    return {
      action: 'play',
      combo,
      rationale: `${structureSummary}\n${planExplanation}\n新的一墩由你领出——遵循【弱路先行】原则，先出手中最小的【${comboLabel}】（${cardsStr}），把高位牌留作后续回手！${citePrinciple('weak_road_first')}`,
      confidence: 'high',
      principle: 'weak_road_first',
    };
  }

  // Following
  if (combo.isBomb) {
    return {
      action: 'play',
      combo,
      rationale: `${structureSummary}\n对手牌势凶猛或即将走完，果断使用【${comboLabel}】（${cardsStr}）夺回场上主动权！${citePrinciple('bomb_is_tool')}`,
      confidence: 'high',
      principle: 'bomb_is_tool',
    };
  }

  return {
    action: 'play',
    combo,
    rationale: `${structureSummary}\n以最小的【${comboLabel}】（${cardsStr}）拿下当前墩，既成功压制对手，又没有浪费多余的大牌。${citePrinciple('weak_road_first')}`,
    confidence: 'high',
    principle: 'weak_road_first',
  };
}
