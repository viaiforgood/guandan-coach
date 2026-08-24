import React, { createContext, useContext, useState } from 'react';

export type Locale = 'zh_cn' | 'zh_tw' | 'en';

export interface Translations {
  appName: string;
  appBadge: string;
  brandName: string;
  brandSub: string;
  brandFoundation: string;
  zjuAgent: string;
  naAlumni: string;
  instructor: string;

  // Tabs
  tabArena: string;
  tabReplay: string;
  tabOnline: string;
  tabPuzzles: string;
  tabDrills: string;
  tabAcademy: string;
  tabOcr: string;
  tabBaodian: string;
  aboutBtn: string;

  // Table & Arena
  levelLabel: string;
  wildcardBadge: string;
  mode4p: string;
  mode6p: string;
  godModeOn: string;
  godModeOff: string;
  checklistBtn: string;
  myTeam: string;
  oppTeam: string;
  trickMustBeat: string;
  newTrickLead: string;
  trickLeadHint: string;
  sortPlan: string;
  sortRank: string;
  clearSelection: string;
  coachHint: string;
  passBtn: string;
  playBtn: string;
  speedLabel: string;
  swapRematch: string;
  replayBtn: string;
  autoPlayOn: string;
  autoPlayOff: string;
  restartMatch: string;
  remainingCards: string;
  rankPlace: string;

  // Seats 4p
  seat0_4p: string;
  seat1_4p: string;
  seat2_4p: string;
  seat3_4p: string;

  // Seats 6p
  seat0_6p: string;
  seat1_6p: string;
  seat2_6p: string;
  seat3_6p: string;
  seat4_6p: string;
  seat5_6p: string;

  // 10s Checklist
  checklistTitle: string;
  checklistRule1: string;
  checklistRule2: string;
  checklistRule3: string;
  checklistRule4: string;
  checklistRule5: string;
  checklistClose: string;

  // Coach & Tracker
  coachTitle: string;
  coachTurnHint: string;
  coachApplyBtn: string;
  trackerTitle: string;
  dangerAlerts: string;
  bigJoker: string;
  smallJoker: string;
  levelRankCard: string;
  aceCard: string;
  kingCard: string;
  fiftyLawTitle: string;

  // Game Levels & AI Difficulty
  difficultyLabel: string;
  diffNovice: string;
  diffStandard: string;
  diffMaster: string;
  gradeLadderTitle: string;
  passAGoal: string;
  champVictory: string;
  selectGrade: string;

  // About Modal
  aboutTitle: string;
  aboutInst1Title: string;
  aboutInst1Desc: string;
  aboutInst2Title: string;
  aboutInst2Desc: string;
  aboutInst3Title: string;
  aboutInst3Desc: string;
  aboutReturn: string;
}

export const TRANSLATIONS: Record<Locale, Translations> = {
  zh_cn: {
    appName: '掼蛋大师教练',
    appBadge: 'Pro AI',
    brandName: 'VI AI for Good',
    brandSub: '唯爱AI公益基金会',
    brandFoundation: '唯爱AI公益基金会 (VI AI for Good)',
    zjuAgent: '浙大智能体',
    naAlumni: '北美高校联盟',
    instructor: '讲师与课程架构：Michael HUO',

    tabArena: '实战对决',
    tabReplay: '牌谱复盘',
    tabOnline: '在线联机',
    tabPuzzles: '残局闯关',
    tabDrills: '五十定律',
    tabAcademy: '新手学院',
    tabOcr: '手牌诊断',
    tabBaodian: '掼蛋宝典',
    aboutBtn: '联盟背景',

    levelLabel: '打',
    wildcardBadge: '逢人配',
    mode4p: '4人标准 (2副牌)',
    mode6p: '6人团战 (3副牌)',
    godModeOn: '上帝模式·开',
    godModeOff: '明牌模式',
    checklistBtn: '10秒Checklist',
    myTeam: '我方',
    oppTeam: '对方',
    trickMustBeat: '需压过牌型',
    newTrickLead: '新一墩出牌',
    trickLeadHint: '任意合法牌型皆可领出',
    sortPlan: '方案分组',
    sortRank: '点数顺序',
    clearSelection: '重选',
    coachHint: '教练支招',
    passBtn: '过牌',
    playBtn: '出牌',
    speedLabel: '出牌节奏',
    swapRematch: '换牌复赛',
    replayBtn: '复盘',
    autoPlayOn: '暂停',
    autoPlayOff: 'AI托管',
    restartMatch: '重开',
    remainingCards: '余',
    rankPlace: '第',

    seat0_4p: '我 (南·主队)',
    seat1_4p: '右家 (东·对方)',
    seat2_4p: '对家·搭档 (北)',
    seat3_4p: '左家 (西·对方)',

    seat0_6p: '我 (南·主队)',
    seat1_6p: '东南 (对方1)',
    seat2_6p: '西北 (搭档1)',
    seat3_6p: '正北 (对方2)',
    seat4_6p: '东北 (搭档2)',
    seat5_6p: '西南 (对方3)',

    checklistTitle: '实战出牌前 10 秒检查清单 (Checklist)',
    checklistRule1: '对门关死否？搭档领先绝不超车，顺搭档之势。',
    checklistRule2: '谁打谁收？出试探小牌，是否有大王/级牌回收牌权。',
    checklistRule3: '弱路先行？优先处理杂单小牌，大牌留后当安全门。',
    checklistRule4: '炸后有路？炸前先想炸后出什么，无路开炸是盲目。',
    checklistRule5: '残局封堵？下家报一不出单，报二不发对，报五防顺子。',
    checklistClose: '已检查完毕，继续出牌',

    coachTitle: 'AI 掼蛋大师教练',
    coachTurnHint: '轮到你出牌，教练已推演最佳出牌策略',
    coachApplyBtn: '一键选牌',
    trackerTitle: '记牌算牌 (五十定律)',
    dangerAlerts: '家报牌',
    bigJoker: '大王',
    smallJoker: '小王',
    levelRankCard: '级牌',
    aceCard: 'A',
    kingCard: 'K',
    fiftyLawTitle: '五十定律顺子监测：',

    difficultyLabel: 'AI段位',
    diffNovice: '🌱 初级学徒',
    diffStandard: '⚔️ 进阶高手',
    diffMaster: '👑 国手大师',
    gradeLadderTitle: '升级阶梯',
    passAGoal: '过A决胜局',
    champVictory: '🏆 恭喜过A成功，斩获总冠军！',
    selectGrade: '选择起始打几',

    aboutTitle: '掼蛋大师教练 · 智能体研发团队',
    aboutInst1Title: '唯爱AI公益基金会 (VI AI for Good) 科技公益发起',
    aboutInst1Desc: '致力于运用先进生成式 AI 与 Agentic 系统推动中华传统益智博弈文化普及，打造零门槛、零成本、高智力体验的智能化学习工具。',
    aboutInst2Title: '浙大智能体 (ZJU AI Agent) 算法支持',
    aboutInst2Desc: '由浙江大学校友团队领衔研发，融合博弈论、启发式双向理牌规划（保炸优先 vs 去单化）与五十定律算牌推演引擎。',
    aboutInst3Title: '北美高校联盟 掼蛋俱乐部 (NAACU Guandan Club) 赛事标准',
    aboutInst3Desc: '对标国际及高校掼蛋正规大赛规则体系，提供实战演练、智能复盘、换位复赛与多人在机联机能力。',
    aboutReturn: '返回对战与训练',
  },

  zh_tw: {
    appName: '掼蛋大師教練',
    appBadge: 'Pro AI',
    brandName: 'VI AI for Good',
    brandSub: '唯愛AI公益基金會',
    brandFoundation: '唯愛AI公益基金會 (VI AI for Good)',
    zjuAgent: '浙大智能體',
    naAlumni: '北美高校聯盟',
    instructor: '講師與課程架構：Michael HUO',

    tabArena: '實戰對決',
    tabReplay: '牌譜復盤',
    tabOnline: '在線聯機',
    tabPuzzles: '殘局闖關',
    tabDrills: '五十定律',
    tabAcademy: '新手學院',
    tabOcr: '手牌診斷',
    tabBaodian: '掼蛋寶典',
    aboutBtn: '聯盟背景',

    levelLabel: '打',
    wildcardBadge: '逢人配',
    mode4p: '4人標準 (2副牌)',
    mode6p: '6人團戰 (3副牌)',
    godModeOn: '上帝模式·開',
    godModeOff: '明牌模式',
    checklistBtn: '10秒Checklist',
    myTeam: '我方',
    oppTeam: '對方',
    trickMustBeat: '需壓過牌型',
    newTrickLead: '新一墩出牌',
    trickLeadHint: '任意合法牌型皆可領出',
    sortPlan: '方案分組',
    sortRank: '點數順序',
    clearSelection: '重選',
    coachHint: '教練支招',
    passBtn: '過牌',
    playBtn: '出牌',
    speedLabel: '出牌節奏',
    swapRematch: '換牌復賽',
    replayBtn: '復盤',
    autoPlayOn: '暫停',
    autoPlayOff: 'AI託管',
    restartMatch: '重開',
    remainingCards: '餘',
    rankPlace: '第',

    seat0_4p: '我 (南·主隊)',
    seat1_4p: '右家 (東·對方)',
    seat2_4p: '對家·搭檔 (北)',
    seat3_4p: '左家 (西·對方)',

    seat0_6p: '我 (南·主隊)',
    seat1_6p: '東南 (對方1)',
    seat2_6p: '西北 (搭檔1)',
    seat3_6p: '正北 (對方2)',
    seat4_6p: '東北 (搭檔2)',
    seat5_6p: '西南 (對方3)',

    checklistTitle: '實戰出牌前 10 秒檢查清單 (Checklist)',
    checklistRule1: '對門關死否？搭檔領先絕不超車，順搭檔之勢。',
    checklistRule2: '誰打誰收？出試探小牌，是否有大王/級牌回收牌權。',
    checklistRule3: '弱路先行？優先處理雜單小牌，大牌留後當安全門。',
    checklistRule4: '炸後有路？炸前先想炸後出什麼，無路開炸是盲目。',
    checklistRule5: '殘局封堵？下家報一不出單，報二不發對，報五防順子。',
    checklistClose: '已檢查完畢，繼續出牌',

    coachTitle: 'AI 掼蛋大師教練',
    coachTurnHint: '輪到你出牌，教練已推演最佳出牌策略',
    coachApplyBtn: '一鍵選牌',
    trackerTitle: '記牌算牌 (五十定律)',
    dangerAlerts: '家報牌',
    bigJoker: '大王',
    smallJoker: '小王',
    levelRankCard: '級牌',
    aceCard: 'A',
    kingCard: 'K',
    fiftyLawTitle: '五十定律順子監測：',

    difficultyLabel: 'AI段位',
    diffNovice: '🌱 初級學徒',
    diffStandard: '⚔️ 進階高手',
    diffMaster: '👑 國手大師',
    gradeLadderTitle: '升級階梯',
    passAGoal: '過A決勝局',
    champVictory: '🏆 恭喜過A成功，斬獲總冠軍！',
    selectGrade: '選擇起始打幾',

    aboutTitle: '掼蛋大師教練 · 智能體研發團隊',
    aboutInst1Title: '唯愛AI公益基金會 (VI AI for Good) 科技公益發起',
    aboutInst1Desc: '致力於運用先進生成式 AI 與 Agentic 系統推動中華傳統益智博弈文化普及，打造零門檻、零成本、高智力體驗的智能化學習工具。',
    aboutInst2Title: '浙大智能體 (ZJU AI Agent) 算法支持',
    aboutInst2Desc: '由浙江大學校友團隊領銜研發，融合博弈論、啟發式雙向理牌規劃（保炸優先 vs 去單化）與五十定律算牌推演引擎。',
    aboutInst3Title: '北美高校聯盟 掼蛋俱樂部 (NAACU Guandan Club) 賽事標準',
    aboutInst3Desc: '對標國際及高校掼蛋正規大賽規則體系，提供實戰演練、智能復盤、換位復賽與多人聯機能力。',
    aboutReturn: '返回對戰與訓練',
  },

  en: {
    appName: 'Guandan Pro Coach',
    appBadge: 'Pro AI',
    brandName: 'VI AI for Good',
    brandSub: 'VI AI for Good Foundation',
    brandFoundation: 'VI AI for Good Foundation',
    zjuAgent: 'ZJU AI Agent',
    naAlumni: 'NAACU Club',
    instructor: 'Curriculum & Architect: Michael HUO',

    tabArena: 'Arena Battle',
    tabReplay: 'Replay Review',
    tabOnline: 'Online Match',
    tabPuzzles: 'Puzzles',
    tabDrills: '50-Law Drills',
    tabAcademy: 'Academy',
    tabOcr: 'Hand Diagnosis',
    tabBaodian: 'Strategy Vault',
    aboutBtn: 'About Alliance',

    levelLabel: 'Grade',
    wildcardBadge: 'Wildcard',
    mode4p: '4-Player (2 Decks)',
    mode6p: '6-Player 3v3 (3 Decks)',
    godModeOn: 'God Mode: ON',
    godModeOff: 'Open Hands',
    checklistBtn: '10s Checklist',
    myTeam: 'Our Team',
    oppTeam: 'Opponents',
    trickMustBeat: 'Current Combo to Beat',
    newTrickLead: 'New Trick Lead',
    trickLeadHint: 'Any valid combo can be led',
    sortPlan: 'Plan Groups',
    sortRank: 'Rank Order',
    clearSelection: 'Clear',
    coachHint: 'Coach Hint',
    passBtn: 'Pass',
    playBtn: 'Play',
    speedLabel: 'Speed',
    swapRematch: 'Swap Rematch',
    replayBtn: 'Replay',
    autoPlayOn: 'Pause',
    autoPlayOff: 'Auto Play',
    restartMatch: 'Restart',
    remainingCards: 'Left',
    rankPlace: 'Rank #',

    seat0_4p: 'Me (South)',
    seat1_4p: 'East (Opponent)',
    seat2_4p: 'North (Teammate)',
    seat3_4p: 'West (Opponent)',

    seat0_6p: 'Me (South)',
    seat1_6p: 'SE (Opponent 1)',
    seat2_6p: 'NW (Teammate 1)',
    seat3_6p: 'North (Opponent 2)',
    seat4_6p: 'NE (Teammate 2)',
    seat5_6p: 'SW (Opponent 3)',

    checklistTitle: '10-Second Pre-Move Checklist',
    checklistRule1: 'Block Partner? Never cut your leading teammate\'s winning suit.',
    checklistRule2: 'Retrieve Control? Ensure you have aces/jokers to win back lead.',
    checklistRule3: 'Clear Weak First? Dispose of small loose singles early on.',
    checklistRule4: 'Bomb Route? Decide what to lead after blowing your bomb.',
    checklistRule5: 'Threat Alert? Never lead singles when downstream reports 1 left.',
    checklistClose: 'Check Complete, Continue',

    coachTitle: 'AI Guandan Pro Coach',
    coachTurnHint: 'Your turn to move. Coach calculated the optimal strategy.',
    coachApplyBtn: 'Auto Select',
    trackerTitle: 'Card Tracker (50-Law HUD)',
    dangerAlerts: 'Players on Alert',
    bigJoker: 'Big Joker',
    smallJoker: 'Small Joker',
    levelRankCard: 'Grade',
    aceCard: 'A',
    kingCard: 'K',
    fiftyLawTitle: '50-Law Straight Monitor:',

    difficultyLabel: 'AI Level',
    diffNovice: '🌱 Novice',
    diffStandard: '⚔️ Intermediate',
    diffMaster: '👑 Grandmaster',
    gradeLadderTitle: 'Grade Ladder',
    passAGoal: 'Pass Level A Finale',
    champVictory: '🏆 Passed Grade A! Grand Champion!',
    selectGrade: 'Select Starting Grade',

    aboutTitle: 'Guandan Pro Coach · AI Research Team',
    aboutInst1Title: 'VI AI for Good Foundation (Tech Philanthropy)',
    aboutInst1Desc: 'Dedicated to applying advanced generative AI and agentic systems to traditional mind sports, offering zero-cost, high-intelligence tactical tools.',
    aboutInst2Title: 'ZJU AI Agent Research Lab',
    aboutInst2Desc: 'Led by Zhejiang University alumni, integrating game theory, dual heuristic hand planning, and 50-law straight deduction engines.',
    aboutInst3Title: 'North America Chinese University Alumni Guandan Club (NAACU)',
    aboutInst3Desc: 'Aligned with official tournament standards, providing tactical drills, replay analytics, swap-hands rematches, and online multiplayer rooms.',
    aboutReturn: 'Return to Arena',
  },
};

interface I18nContextType {
  locale: Locale;
  setLocale: (loc: Locale) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType>({
  locale: 'zh_cn',
  setLocale: () => {},
  t: TRANSLATIONS.zh_cn,
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('guandan_locale') as Locale;
      if (saved && (saved === 'zh_cn' || saved === 'zh_tw' || saved === 'en')) {
        return saved;
      }
    }
    return 'zh_cn';
  });

  const setLocale = (loc: Locale) => {
    setLocaleState(loc);
    localStorage.setItem('guandan_locale', loc);
  };

  const t = TRANSLATIONS[locale] || TRANSLATIONS.zh_cn;

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>;
};

export const useI18n = () => useContext(I18nContext);
