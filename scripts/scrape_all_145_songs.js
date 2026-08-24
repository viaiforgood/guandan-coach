import puppeteer from 'puppeteer-core';
import fs from 'fs';

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function scrapeAll145() {
  console.log('Launching headless Chrome to scrape ALL 145 songs...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    defaultViewport: { width: 1440, height: 1200 },
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
  );

  const capturedClips = new Map();

  // Intercept all API responses from Suno
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('suno') && (url.includes('/api/') || url.includes('/feed') || url.includes('/clips') || url.includes('/playlist') || url.includes('/user'))) {
      try {
        const text = await response.text();
        const json = JSON.parse(text);
        
        const extractClips = (obj) => {
          if (!obj) return;
          if (Array.isArray(obj)) {
            obj.forEach(extractClips);
          } else if (typeof obj === 'object') {
            if (obj.id && obj.title && (obj.audio_url || obj.audioUrl || typeof obj.duration === 'number')) {
              if (obj.id.length === 36 && !obj.id.startsWith('00000')) {
                capturedClips.set(obj.id, {
                  id: obj.id,
                  title: obj.title,
                  url: obj.audio_url || obj.audioUrl || `https://cdn1.suno.ai/${obj.id}.mp3`,
                  sunoUrl: `https://suno.com/song/${obj.id}`,
                  tags: obj.metadata?.tags || obj.tags || '',
                  duration: obj.duration || 0,
                  imageUrl: obj.image_url || obj.imageUrl || '',
                  playCount: obj.play_count || 0,
                  createdAt: obj.created_at || '',
                });
              }
            }
            Object.values(obj).forEach(extractClips);
          }
        };

        extractClips(json);
      } catch (e) {}
    }
  });

  console.log('Navigating to https://suno.com/@michaellivingai ...');
  await page.goto('https://suno.com/@michaellivingai', { waitUntil: 'networkidle2', timeout: 45000 });
  await new Promise((r) => setTimeout(r, 4000));

  // Find and click 'View all Songs' or '145 songs' button
  console.log('Looking for "View all Songs" or "145 songs" button...');
  const clicked = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button, a, div'));
    const btn = buttons.find(
      (b) =>
        b.innerText &&
        (b.innerText.includes('View all Songs') ||
          b.innerText.includes('145 songs') ||
          b.innerText.includes('All Songs') ||
          b.innerText.includes('Songs'))
    );
    if (btn) {
      btn.click();
      return btn.innerText;
    }
    return null;
  });

  console.log('Clicked element:', clicked);
  await new Promise((r) => setTimeout(r, 4000));

  // Scroll down extensively to load all 145 songs
  for (let i = 0; i < 40; i++) {
    console.log(`Scroll pass ${i + 1}/40... Current captured: ${capturedClips.size} songs`);
    await page.evaluate(() => {
      window.scrollBy(0, 2000);
      const scrollables = Array.from(document.querySelectorAll('*')).filter(
        (el) => el.scrollHeight > el.clientHeight + 100
      );
      scrollables.forEach((s) => s.scrollBy(0, 3000));
    });
    await new Promise((r) => setTimeout(r, 1500));

    // If we reached >= 140 songs, we can break early
    if (capturedClips.size >= 140) {
      console.log(`Reached ${capturedClips.size} songs, breaking early!`);
      break;
    }
  }

  // Also parse from current full page DOM / content
  const pageContent = await page.content();
  const cidRegex = /\\?"content_id\\?":\\?"([a-f0-9\-]{36})\\?"/g;
  let match;
  while ((match = cidRegex.exec(pageContent)) !== null) {
    const cid = match[1];
    if (!capturedClips.has(cid) && !cid.startsWith('00000')) {
      const idx = match.index;
      const block = pageContent.slice(idx, idx + 3000);
      const titleMatch = /\\?"title\\?":\\?"([^\\"]+)\\?"/.exec(block);
      const title = titleMatch ? titleMatch[1] : 'Michael Living AI Track';
      const durMatch = /\\?"duration\\?":([0-9\.]+)/.exec(block);
      const duration = durMatch ? parseFloat(durMatch[1]) : 0;
      const tagsMatch = /\\?"tags\\?":\\?"([^\\"]+)\\?"/.exec(block);
      const tags = tagsMatch ? tagsMatch[1] : '';

      capturedClips.set(cid, {
        id: cid,
        title,
        url: `https://cdn1.suno.ai/${cid}.mp3`,
        sunoUrl: `https://suno.com/song/${cid}`,
        tags,
        duration,
      });
    }
  }

  // Extract from song links in DOM
  const domSongs = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a[href*="/song/"]'));
    return links.map((a) => {
      const href = a.href;
      const match = /\/song\/([a-f0-9\-]{36})/.exec(href);
      const id = match ? match[1] : '';
      const title = a.innerText.trim();
      return { id, title };
    }).filter((s) => s.id && s.title);
  });

  domSongs.forEach((s) => {
    if (!capturedClips.has(s.id)) {
      capturedClips.set(s.id, {
        id: s.id,
        title: s.title,
        url: `https://cdn1.suno.ai/${s.id}.mp3`,
        sunoUrl: `https://suno.com/song/${s.id}`,
      });
    } else {
      const existing = capturedClips.get(s.id);
      if (s.title && (!existing.title || existing.title === 'Michael Living AI Track')) {
        existing.title = s.title;
      }
    }
  });

  console.log(`Final captured songs count: ${capturedClips.size}`);

  const tracks = Array.from(capturedClips.values()).map((t) => {
    let category = 'ambient_folk';
    let categoryLabel = '民谣旅途';
    const title = t.title || '';
    if (
      title.includes('掼蛋') ||
      title.includes('满江红') ||
      title.includes('出征') ||
      title.includes('论道') ||
      title.includes('牌桌') ||
      title.includes('战') ||
      title.includes('牌')
    ) {
      category = 'guandan_anthem';
      categoryLabel = '掼蛋出征战歌';
    } else if (
      title.includes('七绝') ||
      title.includes('道兵') ||
      title.includes('星旗') ||
      title.includes('無人') ||
      title.includes('无人') ||
      title.includes('述志') ||
      title.includes('史诗')
    ) {
      category = 'classical_epic';
      categoryLabel = '国风史诗';
    } else if (
      title.includes('诗') ||
      title.includes('雨霖铃') ||
      title.includes('向山') ||
      title.includes('晨登') ||
      title.includes('恩典') ||
      title.includes('平安') ||
      title.includes('喜乐') ||
      title.includes('秋')
    ) {
      category = 'worship_lyric';
      categoryLabel = '诗意抒情';
    }

    return {
      ...t,
      category,
      categoryLabel,
    };
  });

  fs.writeFileSync('src/core/bgm_tracks.json', JSON.stringify(tracks, null, 2), 'utf-8');
  console.log(`Successfully written ${tracks.length} tracks to src/core/bgm_tracks.json`);

  await browser.close();
}

scrapeAll145().catch((e) => {
  console.error(e);
  process.exit(1);
});
