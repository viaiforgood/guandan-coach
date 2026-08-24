# 🃏 掼蛋大师教练 (Guandan Pro Coach)

> 以《道德经》观势，以规则为边界，以技术为手段，以战略为方向，以决策赢得牌局。  
> 🎮 **在线畅玩与特训**：[https://guandan.weiai.ai](https://guandan.weiai.ai) (备用：[https://aiguandan.pages.dev](https://aiguandan.pages.dev))  
> 一个面向初学者与资深高手的专业 AI 掼蛋教学、记牌算牌（五十定律）、残局闯关与智能对战复盘平台。

---

## 🌟 核心功能特性

### 1. ⚔️ 实战演练与智能对弈 (AI Arena)
- **专业 4 人对弈规则**：完整支持 108 张牌两副牌赛制、动态级牌（从打2到打A）、红桃逢人配、同花顺、钢板、三连对及天王炸。
- **AI 掼蛋教练实时支招**：基于手牌结构、对家领先信号与出牌风险，即时推演最佳出牌动作与备选方案。
- **一键理牌与方案切换**：自动推演 **保炸优先** vs **去单化优先** 两种理牌模型，直观展示死牌与弱路。

### 2. 🧩 残局闯关与经典战术考题 (Endgame Puzzles)
- **报1 / 报2 绝杀与封堵**：训练下家报单不出单、报双不发对等实战残局死守技巧。
- **逢人配神妙用法**：同花顺破局、配顺子 vs 留作炸弹的最佳时机抉择。
- **搭档配合与牌权接应**：顺应搭档冲头游、绝不盲目超车压牌。

### 3. 🧠 五十定律与记牌算牌特训营 (50-Law Tracker Camp)
- **五十定律实战监控**：实时追踪全场已出 5 与 10 的张数。5 与 10 是所有 5 张顺子的必备枢纽，当 5 或 10 绝迹时，可断定全场顺子空间归零！
- **大王、小王、级牌与回手牌追踪**：精准计算外部潜在最大炸弹与登基牌。
- **报牌威胁预警**：对 1、2、3、5 张手牌触发高危警报。

### 4. 🎓 掼蛋新手学院与规则通识 (Beginner Academy)
- **牌型图鉴与天梯等级**：单张、对子、三张、三带二、顺子、钢板、三连对、炸弹与同花顺详解。
- **逢人配百变教学**：可配牌型与禁忌规则（不可配天王炸）。
- **进贡、还贡与抗贡**：双下进贡规则、双大王抗贡。
- **🧪 验牌沙盒**：自由组合卡牌，系统实时判定合法牌型与大小。

### 5. 📸 智能识牌与手牌诊断 (Hand OCR / Importer)
- 支持标准文本与牌型简写（如 `H2 S3 BJ SJ S9 H9 C9 D9`）一键导入并进行 AI 结构诊断。

---

## 🛠️ 技术栈与架构

- **前端架构**：React 19 + TypeScript + Vite + Tailwind CSS + Lucide Icons
- **游戏与规则引擎**：纯 TypeScript 原生引擎，零第三方游戏运行时依赖，高鲁棒性与超低延迟
- **测试框架**：Vitest 自动化测试套件
- **部署平台**：**Cloudflare Pages** (推荐) & **GitHub Pages** (静态导出)

---

## 🚀 部署指南 (Deployment)

### 选项 A：部署至 Cloudflare Pages (推荐)
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)，进入 **Compute (Workers) -> Pages**。
2. 点击 **Connect to Git** 并关联 `viaiforgood/guandan-app` 私有仓库。
3. 构建设置：
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. 点击 **Save and Deploy**，即可获得全球极速 CDN 访问（支持一键绑定自定义域名，如 `guandan.weiai.ai`）。

### 选项 B：本地开发与构建
```bash
# 安装依赖
npm install

# 启动本地热重载开发服务器
npm run dev

# 运行自动化测试
npm test

# 构建生产版本 (输出到 dist/)
npm run build
```

### 7. 🌐 多语言国际化 (i18n) 与 6人3v3团战模式
- **三语支持**：简体中文 (zh_cn)、繁體中文 (zh_tw)、English (en)。
- **3副牌 6人团战**：支持 162 张牌 3v3 团队对抗，至尊 6 王天王炸与升级大满贯。

---

## 🏛️ 研发与支持团队
- **公益发起**：**VI AI for Good**（唯爱AI公益基金会）
- **算法支持**：**浙大智能体**（Zhejiang University AI Agent Lab）
- **赛事标准**：**北美高校联盟 掼蛋俱乐部**（NAACU Guandan Club）
- **课程架构**：**Michael HUO**

---

## 📄 开源与致谢
- 本项目由 **VI AI for Good** 维护开发。
- 牌理知识体系源自中国掼蛋实战与经典兵法博弈理论。
