import puppeteer from 'puppeteer-core';
import path from 'path';
import os from 'os';
import fs from 'fs';

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const downloadsDir = path.join(os.homedir(), 'Downloads');
const assetsDir = path.join(downloadsDir, 'Guandan_Moments_Assets');

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

async function capture() {
  console.log('Launching headless Chrome for ultra-sharp Retina screenshots...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    defaultViewport: {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2, // Retina 2x ultra HD
    },
  });

  const page = await browser.newPage();
  console.log('Navigating to https://guandan.weiai.ai ...');
  await page.goto('https://guandan.weiai.ai', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 2000));

  // 1. Capture Arena View
  console.log('1. Capturing Arena View...');
  const p1 = path.join(assetsDir, '01_App实战牌桌_AI教练与记牌器.png');
  await page.screenshot({ path: p1 });
  fs.copyFileSync(p1, path.join(downloadsDir, '01_App实战牌桌_AI教练与记牌器.png'));

  // 2. Click Baodian Tab
  console.log('2. Capturing Baodian View (SYSU Rules)...');
  const baodianBtn = await page.waitForSelector('nav button:nth-child(4)');
  if (baodianBtn) {
    await baodianBtn.click();
    await new Promise((r) => setTimeout(r, 1500));

    // Ensure Rules tab is active
    const rulesSubTab = await page.$('button ::-p-text(广州市中大校友会宝典)');
    if (rulesSubTab) await rulesSubTab.click();
    await new Promise((r) => setTimeout(r, 1000));

    const p2 = path.join(assetsDir, '02_掼蛋实战宝典_中大校友会18条.png');
    await page.screenshot({ path: p2 });
    fs.copyFileSync(p2, path.join(downloadsDir, '02_掼蛋实战宝典_中大校友会18条.png'));

    // Switch to Huijie Insights subtab
    console.log('3. Capturing Baodian View (Huijie Insights)...');
    const huijieSubTab = await page.$('button ::-p-text(慧姐实战牌语心法)');
    if (huijieSubTab) {
      await huijieSubTab.click();
      await new Promise((r) => setTimeout(r, 1000));
      const p3 = path.join(assetsDir, '03_掼蛋宝典_慧姐实战牌语心法.png');
      await page.screenshot({ path: p3 });
      fs.copyFileSync(p3, path.join(downloadsDir, '03_掼蛋宝典_慧姐实战牌语心法.png'));
    }
  }

  // 4. Click Replay Tab
  console.log('4. Capturing Replay View...');
  const replayBtn = await page.waitForSelector('nav button:nth-child(2)');
  if (replayBtn) {
    await replayBtn.click();
    await new Promise((r) => setTimeout(r, 1500));
    const p4 = path.join(assetsDir, '04_牌谱智能复盘与解说.png');
    await page.screenshot({ path: p4 });
    fs.copyFileSync(p4, path.join(downloadsDir, '04_牌谱智能复盘与解说.png'));
  }

  // 5. Mobile Phone View
  console.log('5. Capturing Mobile Phone View (iPhone 16 Pro resolution)...');
  await page.setViewport({ width: 393, height: 852, deviceScaleFactor: 3 });
  await page.goto('https://guandan.weiai.ai', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 2000));
  const p5 = path.join(assetsDir, '05_手机版实战极速对决.png');
  await page.screenshot({ path: p5 });
  fs.copyFileSync(p5, path.join(downloadsDir, '05_手机版实战极速对决.png'));

  await browser.close();
  console.log('All ultra-high-resolution screenshots generated successfully!');
}

capture().catch((err) => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
