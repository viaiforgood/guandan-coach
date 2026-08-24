# 🃏 Guandan Pro Coach (掼蛋大师教练)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Production](https://img.shields.io/badge/Production-guandan.weiai.ai-emerald.svg)](https://guandan.weiai.ai)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-Deployed-orange.svg)](https://aiguandan.pages.dev)
[![React 19](https://img.shields.io/badge/React-19.0-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![i18n](https://img.shields.io/badge/i18n-zh__cn%20%7C%20zh__tw%20%7C%20en-purple.svg)](https://guandan.weiai.ai)

> **"Observe momentum with the Tao Te Ching; define boundaries with rules; employ technology as technique; set strategy as direction; win the match through decision-making."**  
> 🎮 **Play Live**: [https://guandan.weiai.ai](https://guandan.weiai.ai) (Mirror: [https://aiguandan.pages.dev](https://aiguandan.pages.dev))  
> 🇨🇳 [中文文档 (README.md)](./README.md)

---

## 📖 Overview

**Guandan Pro Coach** is an open-source, tournament-grade AI Guandan coaching, card tracking (50-Law HUD), endgame tactical puzzle, match replay analyzer, and WebRTC multiplayer platform.

Initiated by **VI AI for Good Foundation (唯爱AI公益基金会)** with algorithm research from **Zhejiang University AI Agent Lab (浙大智能体)** and tournament guidelines from **North America Chinese University Alumni Guandan Club (NAACU Guandan Club)**.

---

## 🌟 Key Features

### 1. ⚔️ AI Arena (4-Player & 6-Player 3v3 Modes)
- **4-Player Standard (2 Decks / 108 Cards)** & **6-Player Team Battle (3 Decks / 162 Cards)**.
- **3-Tier AI Engine**: `🌱 Novice`, `⚔️ Intermediate`, `👑 Grandmaster`.
- **God Mode (Open Hands)**: Real-time full visibility of all player hands for strategy observation.
- **Swap Hands Rematch Mode**: Swap dealt hands with the opponent team to test identical deal decisions.
- **Grade Progression Ladder (Grades 2 to A)** and **Official "Passing Grade A"** Championship rules.

### 2. 🎬 Match Replay & Move Analyzer
- **Interactive Scrubber Slider**: Step forward/backward through all game tricks ($0 \dots N$) with autoplay (1.0x / 1.5x / 3.0x).
- **Tactical Commentary & Blunder Detection**: Instant feedback on whether a cut was optimal.
- **JSON Import / Export**: Share and load match records across devices.

### 3. 🌐 WebRTC Serverless Multiplayer
- Peer-to-peer data channels via WebRTC (PeerJS).
- Host/Join rooms with 4-digit codes; empty seats automatically filled by Master AI bots.

### 4. 🧠 50-Law Card Tracker HUD
- Real-time monitoring of Rank 5 and Rank 10 to mathematically verify external straight possibilities.
- Live counts of Big Jokers, Small Jokers, Level Wildcards, Aces, and Kings.
- High-risk endgame alerts when opponents have 1, 2, or 5 cards left.

### 5. 🧩 Endgame Tactical Puzzles
- Curated challenges covering downstream blocking, wildcard straight flushes, and bomb timing.

### 6. 🎓 Beginner Academy & 7-Day Roadmap
- Curriculum designed by **Michael HUO** with 5 Golden Rules and 10-Second Pre-Move Checklist.

### 7. 🌐 Full Internationalization (i18n)
- Seamless real-time switching between `Simplified Chinese (zh_cn)`, `Traditional Chinese (zh_tw)`, and `English (en)`.

---

## 🚀 Quickstart

```bash
# Clone the repository
git clone https://github.com/viaiforgood/guandan-app.git
cd guandan-app

# Install dependencies
npm install

# Start development server
npm run dev

# Run unit tests
npm test

# Build production bundle
npm run build
```

---

## 🏛️ Credits & Acknowledgments

- **Philanthropic Initiative**: 🌟 **VI AI for Good Foundation (唯爱AI公益基金会)**
- **Algorithm & Game Theory**: 🦅 **Zhejiang University AI Agent Research Lab (浙大智能体)**
- **Tournament Standards**: 🎓 **North America Chinese University Alumni Guandan Club (NAACU Club)**
- **Classical Manual Heritage**: 🏛️ **Guangzhou Sun Yat-sen University Alumni Association (广州市中山大学校友会)** (18 Gold Battle Rules)
- **Battle Strategy Contribution**: 👩‍🏫 **Huijie (慧姐)** (Battle Insights & Card Signaling)
- **Curriculum Architecture**: 👨‍🏫 **Michael HUO**

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).  
Copyright (c) 2026 VI AI for Good Foundation (唯爱AI公益基金会) & Contributors.
