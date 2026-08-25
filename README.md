# 🃏 掼蛋大师教练 (Guandan Pro Coach)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Production](https://img.shields.io/badge/Production-guandan.weiai.ai-emerald.svg)](https://guandan.weiai.ai)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-Deployed-orange.svg)](https://aiguandan.pages.dev)
[![React 19](https://img.shields.io/badge/React-19.0-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![i18n](https://img.shields.io/badge/i18n-zh__cn%20%7C%20zh__tw%20%7C%20en-purple.svg)](https://guandan.weiai.ai)

> **以《道德经》观势，以规则为边界，以技术为手段，以战略为方向，以决策赢得牌局。**  
> 🎮 **在线畅玩与特训**：[https://guandan.weiai.ai](https://guandan.weiai.ai) (备用：[https://aiguandan.pages.dev](https://aiguandan.pages.dev))  
> 🌐 [English Documentation (README_EN.md)](./README_EN.md)

---

## 📖 项目简介 (Overview)

**掼蛋大师教练 (Guandan Pro Coach)** 是由 **唯爱AI公益基金会 (VI AI for Good Foundation)** 发起、**浙大智能体 (ZJU AI Agent Lab)** 与 **北美高校联盟 掼蛋俱乐部 (NAACU Guandan Club)** 联合研发的专业级 AI 掼蛋教学、记牌算牌（五十定律）、残局闯关、战局复盘与多人联机平台。

---

## 🌟 核心功能矩阵 (Features)

### 1. ⚔️ 实战演练与智能对弈 (AI Arena)
- **4人标准模式 (2副牌·108张)** 与 **6人3v3团战模式 (3副牌·162张)**。
- **三段位 AI 引擎**：`🌱 初级学徒`、`⚔️ 进阶高手`、`👑 国手大师`。
- **全场上帝模式 / 明牌模式 (God Mode)**：一键透视全场所有席位手牌，观察 AI 推演脉络。
- **换位复赛模式 (Swap Rematch)**：与对手互换上一局手牌，检验相同牌面下的战术决策。
- **打2至打A升级阶梯 (Grade Ladder)** 与 **「过A夺冠」** 终局结算机制。

### 2. 🎬 牌谱智能复盘系统 (Match Replay & Analyzer)
- **逐步时间轴推演**：支持任意步骤 ($0 \dots N$) 自由滑动与 1.0x / 1.5x / 3.0x 自动播放。
- **招法质量剖析与失误诊断**：即时标注压牌合理性、控权时机与战术漏洞。
- **牌谱导入与导出 (JSON)**：支持一键导出复制或导入外部 `.guandan.json` 牌谱。

### 3. 🌐 四人/六人在线 P2P 联机对战 (WebRTC Multiplayer)
- 基于 **WebRTC (PeerJS)** 的去中心化无服务器房间对战体系。
- 房间码一键创建与加入（如 `8888`），空缺席位自动由国手级 AI NPC 替补。

### 4. 🧠 五十定律记牌算牌特训营 (50-Law Tracker HUD)
- **五十定律实战监控**：实时追踪全场已出 5 与 10 的张数。5 与 10 是所有 5 张顺子的必备枢纽，当 5 或 10 绝迹时，可断定全场顺子空间归零！
- **大王、小王、主级牌与登基牌实时追踪**。
- **报单、报双、报五高危警报**。

### 5. 🧩 残局闯关与经典战术考题 (Endgame Puzzles)
- 精选残局实战题库：涵盖报1/报2防堵、逢人配同花顺抉择、弱路先行与逼炸战术。

### 6. 🎓 新手学院与实战七日路径 (Beginner Academy)
- **讲师 Michael HUO 掼蛋七天成长地图** 与 **出牌前 10 秒检查清单 (Checklist)**。
- **牌型沙盒**：自由组合卡牌，系统实时判定合法牌型与大小。

### 7. 🗣️ 热门牌桌语音与互动表情 (Voices & Emojis)
- 内置 Web Speech API 地道中文语音：*“要不起！”、“炸你没商量！”、“对家漂亮！走你！”*。
- 牌桌浮动表情动画互动。

### 8. 🌐 完整多语言国际化 (i18n)
- 简体中文 (`zh_cn` - 默认)、繁體中文 (`zh_tw`)、English (`en`) 即时无刷新切换。

---

## 🛠️ 技术栈与架构 (Tech Stack)

```text
guandan-app/
├── src/
│   ├── core/           # 纯原生 TypeScript 掼蛋规则与博弈引擎 (无第三方游戏运行时)
│   │   ├── types.ts    # 游戏状态、牌型、牌谱与多人数据契约
│   │   ├── cards.ts    # 两副牌/三副牌洗牌、发牌、逢人配与排序算法
│   │   ├── combos.ts   # 牌型分类 (单/对/三/顺/钢板/三连对/炸弹/同花顺/天王炸)
│   │   ├── optimizer.ts# 启发式双向理牌算法 (保炸优先 vs 极度去单化)
│   │   ├── tracker.ts  # 五十定律与未见牌概率计算引擎
│   │   ├── ai.ts       # 三段位 AI 智能体决策系统
│   │   ├── engine.ts   # 轮转出牌、接风、进贡还贡与升级大满贯计分
│   │   ├── replay.ts   # 牌谱状态重构与战术解说引擎
│   │   ├── online.ts   # WebRTC P2P 多人房间管理器
│   │   ├── voice.ts    # Web Speech API 语音合成与表情互动
│   │   ├── audio.ts    # Web Audio API 牌桌音效发生器
│   │   └── i18n.tsx    # 简/繁/英多语言国际化上下文
│   ├── components/     # 现代化 UI 组件库 (PokerTable, Card, Modals, Coach, HUD)
│   └── views/          # 实战、复盘、联机、残局、记牌、学院、识牌视图
```

---

## 🚀 快速上手与本地开发 (Quickstart)

```bash
# 1. 克隆仓库
git clone https://github.com/viaiforgood/guandan-app.git
cd guandan-app

# 2. 安装依赖
npm install

# 3. 启动本地开发服务器
npm run dev

# 4. 运行单元测试 (100% 通过)
npm test

# 5. 构建生产包
npm run build
```

---

## ☁️ 部署指南 (Deployment)

### Cloudflare Pages 自动化部署
1. 进入 [Cloudflare Dashboard](https://dash.cloudflare.com/) -> **Workers & Pages** -> **Create application** -> **Pages**。
2. 关联 GitHub 仓库 `viaiforgood/guandan-app`。
3. 配置构建参数：
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. 点击 **Save and Deploy** 即可全球上线并绑定自定义域名 `guandan.weiai.ai`。

---

## 🏛️ 研发与支持团队 (Credits & Acknowledgments)

- **科技公益发起**：🌟 **VI AI for Good**（唯爱AI公益基金会）
- **算法模型支持**：🦅 **浙大智能体**（Zhejiang University AI Agent Research Lab）
- **赛事规则标准**：🎓 **北美高校联盟 掼蛋俱乐部**（NAACU Guandan Club）
- **宝典口诀传承**：🏛️ **广州市中山大学校友会**（《掼蛋宝典》18条黄金实战口诀授权收录）
- **名家博弈宝典**：👑 **蒋主席**（北美高校联盟掼蛋俱乐部名誉主席 · 《掼蛋实战宝典与博弈心法》）
- **实战心法贡献**：👩‍🏫 **慧姐**（北美高校联盟北加硅谷名宿 · 《实战牌语与攻防心法》）
- **课程架构与讲师**：👨‍🏫 **Michael HUO**

---

## 📄 开源许可证 (License)

本项目采用 [MIT License](./LICENSE) 开源许可。
Copyright (c) 2026 VI AI for Good Foundation (唯爱AI公益基金会) & Contributors.
