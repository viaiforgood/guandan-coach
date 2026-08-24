export interface Principle {
  key: string;
  name: string;
  source: string;
  level: 'L0' | 'L1' | 'L2' | 'L3' | 'L4';
  text: string;
  quote: string;
}

export const PRINCIPLES: Record<string, Principle> = {
  weak_road_first: {
    key: 'weak_road_first',
    name: '弱路先行',
    source: '01_核心牌理',
    level: 'L2',
    text: '先清弱路（单张、杂牌），留强牌作回手控制，避免残局被卡死。',
    quote: '《核心牌理》：“弱路先行，强牌断后；手数要少，控制要牢。”',
  },
  bomb_plan_ahead: {
    key: 'bomb_plan_ahead',
    name: '炸前有谋',
    source: '04_炸弹决策',
    level: 'L3',
    text: '炸之前先想好炸完领出什么牌、能不能走顺或把牌权交给搭档。',
    quote: '《炸弹决策》：“炸前先算炸后路，无路开炸是盲目。”',
  },
  bomb_is_tool: {
    key: 'bomb_is_tool',
    name: '炸弹是工具',
    source: '04_炸弹决策',
    level: 'L3',
    text: '炸弹是夺取牌权或打断对手节奏的手段，不是收藏品，亦不可见大就炸。',
    quote: '《炸弹决策》：“炸弹用于控场与解围，不可贪大恋战。”',
  },
  partner_defer: {
    key: 'partner_defer',
    name: '顺应搭档',
    source: '05_搭档与牌型判断',
    level: 'L3',
    text: '搭档领牌顺风时不随意超车压牌；若搭档需要接力，果断用中大牌接应并转回搭档弱路。',
    quote: '《搭档配合》：“顺搭档之势，借对家之力；搭档主攻我助攻。”',
  },
  fifty_law: {
    key: 'fifty_law',
    name: '五十定律',
    source: '03_记牌与算牌',
    level: 'L2',
    text: '5和10是所有5张顺子的枢纽桥梁，掌握5和10的已出张数即可断定全场顺子空间。',
    quote: '《记牌算牌》：“逢五必看，逢十必算；五十一清，顺子归零。”',
  },
  endgame_guard: {
    key: 'endgame_guard',
    name: '残局防线',
    source: '06_残局与心理',
    level: 'L4',
    text: '下家报1必封单打对，报2出单或三带二，报5谨防顺子与炸弹突围。',
    quote: '《残局与心理》：“下家报一不出单，报二不发对；临门一脚，堵其通路。”',
  },
  dao_flow: {
    key: 'dao_flow',
    name: '顺势而为',
    source: '道德经与牌道',
    level: 'L0',
    text: '善胜者不争，知止不殆。牌势弱时避锋蓄力，牌势强时势如破竹。',
    quote: '《道德经》：“天下之至柔，驰骋天下之至坚。”',
  },
  sun_tzu: {
    key: 'sun_tzu',
    name: '虚实相生',
    source: '孙子兵法与战术',
    level: 'L0',
    text: '出其所不趋，趋其所不意。以小牌试探虚实，以大牌一击定乾坤。',
    quote: '《孙子兵法》：“兵者，诡道也。故能而示之不能，用而示之不用。”',
  },
};

export function citePrinciple(key: string): string {
  const p = PRINCIPLES[key];
  if (!p) return '';
  return `\n💡【牌理指引】${p.name}：${p.text}`;
}
