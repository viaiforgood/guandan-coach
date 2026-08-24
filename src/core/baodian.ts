export interface BaodianRule {
  id: number;
  phrase: string;
  category: 'opening' | 'bomb' | 'blocking' | 'endgame_counts' | 'tribute';
  categoryName: string;
  explanation: string;
  tacticalAction: string;
  pitfall: string;
}

export interface HuijieInsight {
  id: number;
  title: string;
  quote: string;
  coreRule: string;
  scenario: string;
  application: string;
}

export const HUIJIE_INSIGHTS: HuijieInsight[] = [
  {
    id: 1,
    title: '首发小单张：强牌主攻，大王收尾',
    quote: '“假设我俩一家，你首发牌。如果你是强牌（单牌是强牌，有大王收尾），你就发小单。你发小单实际上是给我示意你要主攻，发完能用大王收回去，所以我作为搭档会让你走。”',
    coreRule: '发小单 = 释放主攻强牌信号（有大王/主牌保底回收牌权），搭档应静观其变、助其冲头游。',
    scenario: '自己手中起手拥有 1~2 张大王、主级牌较多且整体手数极少。',
    application: '首发出小单张 3 或 4，既能消耗对手的大牌，又能在关键时刻用大王一锤定音回收牌权。',
  },
  {
    id: 2,
    title: '首发对子：情况不明，对子探路',
    quote: '“如果你首发牌是对子，经常讲‘情况不明，对子先行’，你可能是在探路。如果牌比较弱的话，有些时候三不带是做搅局。实际上，通过发牌是在传递攻守信号。”',
    coreRule: '情况不明，对子先行；弱牌首发三不带意在搅局试探。',
    scenario: '起手牌力中等，单张和大牌分布不均，尚未摸清全场火药分布。',
    application: '先发出小对子（如对5、对6）试探对手与搭档的对子强度，若搭档接管则转入助攻。',
  },
  {
    id: 3,
    title: '辨析对手发牌意图：牌语是打出来的，不是眨眼睛送秋波',
    quote: '“如果是对手发牌，也是理解他发牌的意图，理解他是想做主攻，还是想探路做助攻打对手。一般也是打他的主攻。牌语是看出牌看出来，而不是眨眼睛送秋波。”',
    coreRule: '通过对手首发牌型识别敌方主力，精准切断其主攻路线，逼其在弱路消耗大牌。',
    scenario: '敌方下家或上家首发某种成型大牌或反常小单张。',
    application: '一旦识破对手为主攻手，全队集中火力封堵其主攻牌型，迫使其拆炸或失去牌权。',
  },
  {
    id: 4,
    title: '强弱定位：多炸多登机牌控场主攻，单炸安心当僚机助攻',
    quote: '“强牌一般是炸弹多、登机牌（大王/主级牌）多，就是讲一个控场，这个就是强牌。如果是弱牌的话，你炸弹只有一个，好像就不靠谱了，这种就只能是助攻，看我对象需要什么，在适当时机送过去。”',
    coreRule: '手握 2 炸以上 + 大王方可定为主攻；仅有 1 炸及以下必须坚决定位为僚机助攻。',
    scenario: '理牌后评估自身实力处于全场劣势。',
    application: '放弃个人头游幻想，全力为搭档喂牌、顶下家大牌、排雷破火，在搭档需要时把牌权精准送过去。',
  },
];

export const BAODIAN_RULES: BaodianRule[] = [
  {
    id: 1,
    phrase: '牌型谁打谁负责，责任一定要明确',
    category: 'opening',
    categoryName: '搭档与责任定位',
    explanation: '谁先打出某种牌型（如三带二、顺子、钢板），说明该玩家在这一牌型上有大牌控场或计划。搭档应当顺势助攻，不可盲目乱变牌型打乱战术。',
    tacticalAction: '首发牌型的玩家负责回收牌权；搭档尽量过小牌接应，不破坏控场者的规划。',
    pitfall: '搭档刚打出顺子拿到牌权，你立即变出对子，导致搭档的后续顺子全部烂在手里。',
  },
  {
    id: 2,
    phrase: '除单慎接对门牌，只有牌好才接牌',
    category: 'opening',
    categoryName: '搭档与责任定位',
    explanation: '对门搭档打出的对子、三同张、顺子等成型牌，除非自己牌力极强要冲头游，否则应尽量让其走牌或让对手消耗大牌。只有单张通常是为了给对门喂牌才主动接应。',
    tacticalAction: '对门发牌若对手要不起，不要无谓放大牌压对门，留给对门继续走牌。',
    pitfall: '对门打出 10-J-Q-K-A 领先，你用自己的同花顺超车，不仅浪费火药还阻断了搭档头游。',
  },
  {
    id: 3,
    phrase: '炸弹要炸第一顺，否则后面还有顺',
    category: 'bomb',
    categoryName: '炸弹火药决策',
    explanation: '对手打出第一手顺子时，往往手牌顺畅、后面还有第二手或成型大牌。如果第一顺不炸断其节奏，对手极易一顺到底直接报牌。',
    tacticalAction: '发现对手领出顺子且气势凶猛，在关键档位果断开炸切断其出牌链条。',
    pitfall: '犹豫不决放过对手第一手顺子，结果对手接着打出第二套顺子直接冲头游。',
  },
  {
    id: 4,
    phrase: '封顺就要封到顶，这样封牌是要领',
    category: 'blocking',
    categoryName: '顺子与轮次封堵',
    explanation: '封堵对手顺子时，不能用半大不小的顺子（如 8-9-10-J-Q）去压，很容易被对手的 10-J-Q-K-A 反压；要封就直接封到最大顶顺（如 10-J-Q-K-A）或直接开炸。',
    tacticalAction: '压顺子力求一剑封喉，不给对手留反踩的空间。',
    pitfall: '出小顺子反被对手顶顺回收牌权，还帮对手顺走了多余杂单。',
  },
  {
    id: 5,
    phrase: '七张多为五一或五二，成型牌出为妙招',
    category: 'endgame_counts',
    categoryName: '残局张数精算',
    explanation: '当对手剩余 7 张牌时，手牌结构大概率是【1组5张顺子/同花 + 1个对子】或【1组顺子 + 2张单牌】。此时出成型牌（三带二、钢板、三连对）对手往往对不上。',
    tacticalAction: '面对 7 张残局，逼出对手无法成型的杂牌，避免打对手最舒服的顺子或单张。',
    pitfall: '对手剩 7 张还继续发顺子，直接把对手送走。',
  },
  {
    id: 6,
    phrase: '八张多为五二一，不出单双是高招',
    category: 'endgame_counts',
    categoryName: '残局张数精算',
    explanation: '对手剩余 8 张牌时，极大概率是【5张顺子 + 1个对子 + 1张单牌】。此时打单张或对子正中其下怀，改打三带二或钢板能让对手极其难受。',
    tacticalAction: '对手剩 8 张时，避开单张与对子，发三张系列牌型拆其结构。',
    pitfall: '对手剩 8 张发单张，对手顺走单张后直接 5+2 报牌秒杀。',
  },
  {
    id: 7,
    phrase: '五打二来六打三，打得对手把眼翻',
    category: 'endgame_counts',
    categoryName: '残局张数精算',
    explanation: '对手剩余 5 张牌时，防其顺子，发【对子】逼其拆牌；对手剩余 6 张牌时，防其钢板或三连对，发【三同张】打破其组合。',
    tacticalAction: '敌剩 5 张发对子（逼拆顺子）；敌剩 6 张发三张（破坏钢板与三连对）。',
    pitfall: '对手剩 5 张还打顺子，对手直接一手清空。',
  },
  {
    id: 8,
    phrase: '九张当作五张打，如打五张你就傻',
    category: 'endgame_counts',
    categoryName: '残局张数精算',
    explanation: '对手剩余 9 张牌，通常是 5+4（顺子+炸弹/三带二）。要把它当作随时可能突变为 5 张甚至秒杀的危险局势，不能按常规套路慢慢消耗。',
    tacticalAction: '对手 9 张时必须高度警惕其暗藏炸弹，加快控牌节奏，逼出其底牌。',
    pitfall: '以为 9 张还很遥远，放任其顺利过小牌。',
  },
  {
    id: 9,
    phrase: '十打二来九打一，打成八张不着急',
    category: 'endgame_counts',
    categoryName: '残局张数精算',
    explanation: '自己手握 10 张牌时优先打对子，手握 9 张牌时优先打单张，逐步理顺至 8 张以内成套牌型，从容进入残局冲刺。',
    tacticalAction: '中残局转换期合理减单，将手数控制在 2~3 手以内。',
    pitfall: '10 张时盲目打大顺子导致剩下一地杂碎死单。',
  },
  {
    id: 10,
    phrase: '对手七张或八张，可以反手打一夯',
    category: 'endgame_counts',
    categoryName: '残局张数精算',
    explanation: '当对手剩余 7~8 张牌进入警戒线时，如果自己有炸弹（夯），可果断提前开炸抢夺牌权，变被动防守为主动控盘。',
    tacticalAction: '在对手成型前先发制人，用炸弹抢下发牌权直奔胜利。',
    pitfall: '死攒炸弹不放，眼睁睁看着 7 张对手连续过牌逃跑。',
  },
  {
    id: 11,
    phrase: '牌不好时学会让，让给对门不上当',
    category: 'opening',
    categoryName: '搭档与责任定位',
    explanation: '如果起手牌力弱（杂单多、无大牌、无炸），应主动放弃争头游，安心当好僚机护航，把牌权和过牌机会全让给对门搭档。',
    tacticalAction: '主动顶对手大牌、替搭档排雷、在搭档领先时垫送小牌。',
    pitfall: '烂牌硬冲头游，不仅自己走不掉，还把好牌的搭档活活拖死。',
  },
  {
    id: 12,
    phrase: '残局没火牌较次，就要忌打整轮次',
    category: 'blocking',
    categoryName: '顺子与轮次封堵',
    explanation: '残局手牌没有炸弹且点数偏小时，切忌打出顺子、钢板等长牌型（整轮次），因为极易被对手大牌直接踩死并顺带报牌。',
    tacticalAction: '没火时拆散出单或对，一点点磨掉对手的控制力。',
    pitfall: '没炸弹还发 5 张小顺子，送给对手顶顺回收牌权。',
  },
  {
    id: 13,
    phrase: '炸弹如小提前炸，炸不了时头嫌大',
    category: 'bomb',
    categoryName: '炸弹火药决策',
    explanation: '4张3、4张4等小炸弹，到了残局完全挡不住对手的大炸和同花顺；必须在中局关键争夺牌权时尽早扔出，发挥最大威力。',
    tacticalAction: '小炸中局抢权护送弱牌；大炸/同花留作残局绝杀安全门。',
    pitfall: '把 4 张小 4 留到残局最后，被对手 6 张炸直接按死在手里。',
  },
  {
    id: 14,
    phrase: '想好出啥再开火，否则开错够窝火',
    category: 'bomb',
    categoryName: '炸弹火药决策',
    explanation: '开炸前必须明确想好：炸完之后我下一手打什么？是打成型牌冲刺，还是能精准喂给对门？如果没有明确后路，绝不开盲炸！',
    tacticalAction: '【炸后有路】原则：炸弹是通行证，必须带有一组必走或必控的关键牌。',
    pitfall: '仅仅因为能炸就开炸，炸完自己只剩一堆小烂单，白白浪费火药并送对手上家牌权。',
  },
  {
    id: 15,
    phrase: '没有枪时留轮次，轮次也能干大事',
    category: 'blocking',
    categoryName: '顺子与轮次封堵',
    explanation: '即便手中没有大牌和大枪（炸弹），如果手中保留有成套的顺子、钢板或三连对（轮次牌），在对手断牌的空档往往能一击致命。',
    tacticalAction: '合理规划牌型结构，用多张成套组合消耗对手单张大牌。',
    pitfall: '为了贪图单张大牌，把好好的顺子或钢板拆得稀烂。',
  },
  {
    id: 16,
    phrase: '首发轮次要谨慎，轮次发错徒添恨',
    category: 'opening',
    categoryName: '搭档与责任定位',
    explanation: '开局第一手牌决定全场基调与试探方向。首发应试探各家强弱，通常从小单张或小三带二开始，切忌首发就把自己的核心底牌亮底。',
    tacticalAction: '首发试探弱路，观察对门与下家反应再定主攻方向。',
    pitfall: '开局第一手就打出绝杀大顺子，把全场火药全部引到自己身上。',
  },
  {
    id: 17,
    phrase: '炸了下家出单张，这样出牌易受伤',
    category: 'bomb',
    categoryName: '炸弹火药决策',
    explanation: '自己开炸截断下家之后，如果紧接着发单张，极容易让下家借机用大王、级牌或 A 回收牌权，导致自己的炸弹白白消耗。',
    tacticalAction: '炸完下家后，打下家最难受的成型套牌（三带二、对子或钢板），封死下家回手。',
    pitfall: '开大炸抢回牌权，然后出一张小单张 3 送下家大王轻松接牌。',
  },
  {
    id: 18,
    phrase: '进贡对方要绕道，进贡对门不必绕',
    category: 'tribute',
    categoryName: '进贡还贡心法',
    explanation: '给对手进贡大牌时，尽量挑选不破坏自己手牌火药或炸弹结构的次大牌；若开局抗贡或给对门还贡，则应大大方方送出最利于搭档成型的牌。',
    tacticalAction: '进贡兼顾保炸与破炸平衡，优先保全自身核心战斗力。',
    pitfall: '为了进贡而拆散手中唯一的 6 张大炸弹。',
  },
];
