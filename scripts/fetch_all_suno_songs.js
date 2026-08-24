import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function fetchAllSuno() {
  console.log('Launching headless Chrome to fetch all published Suno tracks...');
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
    if (url.includes('/api/') || url.includes('/feed') || url.includes('/clips') || url.includes('/playlist')) {
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
      } catch (e) {
        // Ignore non-json
      }
    }
  });

  console.log('Navigating to https://suno.com/@michaellivingai ...');
  await page.goto('https://suno.com/@michaellivingai', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 3000));

  // Extract from initial page HTML & state
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

  // Scroll down multiple times to trigger infinite scroll pagination
  console.log('Scrolling to load all paginated songs...');
  for (let i = 0; i < 15; i++) {
    console.log(`Scroll pass ${i + 1}/15... (Found ${capturedClips.size} songs so far)`);
    await page.evaluate(() => {
      window.scrollBy(0, 1500);
      const scrollable = document.querySelector('[data-scrollable="true"]') || document.querySelector('main') || document.body;
      if (scrollable) scrollable.scrollBy(0, 2000);
    });
    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log(`Finished scrolling. Total unique songs captured: ${capturedClips.size}`);

  const tracks = Array.from(capturedClips.values()).map((t) => {
    let category = 'ambient_folk';
    let categoryLabel = '民谣旅途';
    const title = t.title || '';
    if (
      title.includes('掼蛋') ||
      title.includes('满江红') ||
      title.includes('出征') ||
      title.includes('论道') ||
      title.includes('牌桌')
    ) {
      category = 'guandan_anthem';
      categoryLabel = '掼蛋出征战歌';
    } else if (
      title.includes('七绝') ||
      title.includes('道兵') ||
      title.includes('星旗') ||
      title.includes('无') ||
      title.includes('述志')
    ) {
      category = 'classical_epic';
      categoryLabel = '国风史诗';
    } else if (
      title.includes('诗') ||
      title.includes('雨霖铃') ||
      title.includes('向山') ||
      title.includes('晨登') ||
      title.includes('恩典')
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
  console.log(`Successfully saved ${tracks.length} tracks to src/core/bgm_tracks.json`);

  await browser.close();
}

fetchAllSuno().catch((e) => {
  console.error(e);
  process.exit(1);
});
