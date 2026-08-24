export interface BgmTrack {
  id: string;
  title: string;
  url: string;
  sunoUrl: string;
  tags?: string;
  imageUrl?: string;
  duration?: number;
  category: 'guandan_anthem' | 'classical_epic' | 'ambient_folk' | 'worship_lyric' | string;
  categoryLabel: string;
}

export const SUNO_BGM_PLAYLIST: BgmTrack[] = [
  {
    id: '8b206607-d80a-407a-9c30-a80603a5a741',
    title: '汉风•满江红•高校联盟•掼蛋出征•壮行山河',
    url: 'https://cdn1.suno.ai/8b206607-d80a-407a-9c30-a80603a5a741.mp3',
    sunoUrl: 'https://suno.com/song/8b206607-d80a-407a-9c30-a80603a5a741',
    tags: '古典汉风战歌与史诗摇滚，鼓点如行军，战鼓与铜管，气吞山河',
    category: 'guandan_anthem',
    categoryLabel: '掼蛋出征战歌',
  },
  {
    id: '64d2872d-83ab-44ef-9de6-47d9395c8309',
    title: '汉风·满江红七队同阵·北美高校联盟·出征华体会',
    url: 'https://cdn1.suno.ai/64d2872d-83ab-44ef-9de6-47d9395c8309.mp3',
    sunoUrl: 'https://suno.com/song/64d2872d-83ab-44ef-9de6-47d9395c8309',
    tags: '大会出征集体气势，浑厚男中音，传统戏曲式拖腔与战阵',
    category: 'guandan_anthem',
    categoryLabel: '掼蛋出征战歌',
  },
  {
    id: 'da98faa2-0b08-4c34-bdb7-a435eece5681',
    title: '牌桌论道',
    url: 'https://cdn1.suno.ai/da98faa2-0b08-4c34-bdb7-a435eece5681.mp3',
    sunoUrl: 'https://suno.com/song/da98faa2-0b08-4c34-bdb7-a435eece5681',
    tags: '国风潮流律动，牌桌智慧，机智风趣',
    category: 'guandan_anthem',
    categoryLabel: '牌桌博弈',
  },
  {
    id: 'ca4fc554-b3c9-4fb8-a32b-42c4476c6ebf',
    title: '道兵合一',
    url: 'https://cdn1.suno.ai/ca4fc554-b3c9-4fb8-a32b-42c4476c6ebf.mp3',
    sunoUrl: 'https://suno.com/song/ca4fc554-b3c9-4fb8-a32b-42c4476c6ebf',
    tags: '古筝与二胡，华尔兹慢板，大气磅礴，行军鼓乐',
    category: 'classical_epic',
    categoryLabel: '国风史诗',
  },
  {
    id: '340ec300-0740-4c53-815f-596903989f46',
    title: '七绝•向山举目•半穹望岳',
    url: 'https://cdn1.suno.ai/340ec300-0740-4c53-815f-596903989f46.mp3',
    sunoUrl: 'https://suno.com/song/340ec300-0740-4c53-815f-596903989f46',
    tags: '古筝琴韵，弦乐四重奏，意境深远，向山举目',
    category: 'classical_epic',
    categoryLabel: '国风史诗',
  },
  {
    id: '5da46046-90d0-4086-bd6e-9c6004cdd63b',
    title: '上行之诗•向山举目•半穹望岳',
    url: 'https://cdn1.suno.ai/5da46046-90d0-4086-bd6e-9c6004cdd63b.mp3',
    sunoUrl: 'https://suno.com/song/5da46046-90d0-4086-bd6e-9c6004cdd63b',
    tags: '二胡与钢琴琶音，清晨破晓，宁静致远',
    category: 'worship_lyric',
    categoryLabel: '诗意抒情',
  },
  {
    id: '80a50879-49fb-40d5-899e-419d3ed80e6d',
    title: '加州大道车站',
    url: 'https://cdn1.suno.ai/80a50879-49fb-40d5-899e-419d3ed80e6d.mp3',
    sunoUrl: 'https://suno.com/song/80a50879-49fb-40d5-899e-419d3ed80e6d',
    tags: '电影感流行抒情，钢琴与手鼓，旅途与思绪',
    category: 'ambient_folk',
    categoryLabel: '民谣旅途',
  },
  {
    id: 'b1a8538c-3af6-4104-8566-7f2c58cf5078',
    title: '加州旅馆于加州大道',
    url: 'https://cdn1.suno.ai/b1a8538c-3af6-4104-8566-7f2c58cf5078.mp3',
    sunoUrl: 'https://suno.com/song/b1a8538c-3af6-4104-8566-7f2c58cf5078',
    tags: '经典吉他摇滚民谣，复古悠扬',
    category: 'ambient_folk',
    categoryLabel: '民谣旅途',
  },
  {
    id: '72eaaf0d-506e-41fd-bcfc-13686083d362',
    title: '加利福尼亚站台',
    url: 'https://cdn1.suno.ai/72eaaf0d-506e-41fd-bcfc-13686083d362.mp3',
    sunoUrl: 'https://suno.com/song/72eaaf0d-506e-41fd-bcfc-13686083d362',
    tags: '舒缓民谣吉他，火车行进律动，温暖治愈',
    category: 'ambient_folk',
    categoryLabel: '民谣旅途',
  },
  {
    id: 'a3d1af01-86b6-48ae-b65b-43df4d690d8e',
    title: '后山晨登，喜乐恩典相随',
    url: 'https://cdn1.suno.ai/a3d1af01-86b6-48ae-b65b-43df4d690d8e.mp3',
    sunoUrl: 'https://suno.com/song/a3d1af01-86b6-48ae-b65b-43df4d690d8e',
    tags: '清晨山间民谣，箱琴木吉他，空灵宁静',
    category: 'ambient_folk',
    categoryLabel: '民谣旅途',
  },
  {
    id: '86d63e43-fa5d-4fc3-b712-0ef5c2732871',
    title: '半百述志',
    url: 'https://cdn1.suno.ai/86d63e43-fa5d-4fc3-b712-0ef5c2732871.mp3',
    sunoUrl: 'https://suno.com/song/86d63e43-fa5d-4fc3-b712-0ef5c2732871',
    tags: '深沉叙事民谣，岁月沉淀，感恩豁达',
    category: 'ambient_folk',
    categoryLabel: '民谣旅途',
  },
  {
    id: '33deabfa-ce6e-44d8-b659-b1106bbd5e31',
    title: '星旗飘扬',
    url: 'https://cdn1.suno.ai/33deabfa-ce6e-44d8-b659-b1106bbd5e31.mp3',
    sunoUrl: 'https://suno.com/song/33deabfa-ce6e-44d8-b659-b1106bbd5e31',
    tags: '庄严军乐进行曲，交响管乐与合唱',
    category: 'classical_epic',
    categoryLabel: '国风史诗',
  },
  {
    id: 'e2093658-03cc-4fd4-bd95-e0b9e6f4acc6',
    title: '雨霖铃•寒蝉凄切•抄底又抄錯',
    url: 'https://cdn1.suno.ai/e2093658-03cc-4fd4-bd95-e0b9e6f4acc6.mp3',
    sunoUrl: 'https://suno.com/song/e2093658-03cc-4fd4-bd95-e0b9e6f4acc6',
    tags: '宋词古典抒情与自嘲幽默，二胡与钢琴',
    category: 'worship_lyric',
    categoryLabel: '诗意抒情',
  },
  {
    id: 'e50476a8-9dad-4bcd-a123-765400c90ccb',
    title: '满江红•怒发冲冠•抄的不是底',
    url: 'https://cdn1.suno.ai/e50476a8-9dad-4bcd-a123-765400c90ccb.mp3',
    sunoUrl: 'https://suno.com/song/e50476a8-9dad-4bcd-a123-765400c90ccb',
    tags: '琵琶与太鼓说唱，慷慨激昂',
    category: 'classical_epic',
    categoryLabel: '国风史诗',
  },
];

/**
 * Dynamically fetches published Suno tracks from @michaellivingai in real time.
 * Merges newly published tracks seamlessly with the local curated playlist.
 */
export async function fetchLiveSunoTracks(): Promise<BgmTrack[]> {
  try {
    // 1. Try our direct Cloudflare Pages serverless function endpoint
    const res = await fetch('/api/suno-tracks');
    if (res.ok) {
      const data = await res.json();
      if (data.tracks && Array.isArray(data.tracks) && data.tracks.length > 0) {
        return mergeTracks(SUNO_BGM_PLAYLIST, data.tracks);
      }
    }
  } catch (err) {
    console.warn('Direct /api/suno-tracks fetch skipped or failed:', err);
  }

  // 2. Try public CORS proxy fallback if running outside Cloudflare Pages
  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent('https://suno.com/@michaellivingai')}`;
    const proxyRes = await fetch(proxyUrl);
    if (proxyRes.ok) {
      const proxyData = await proxyRes.json();
      const html = proxyData.contents;
      const parsedTracks = parseTracksFromHtml(html);
      if (parsedTracks.length > 0) {
        return mergeTracks(SUNO_BGM_PLAYLIST, parsedTracks);
      }
    }
  } catch (err) {
    console.warn('Proxy Suno live fetch skipped:', err);
  }

  return SUNO_BGM_PLAYLIST;
}

function parseTracksFromHtml(html: string): BgmTrack[] {
  const songs: BgmTrack[] = [];
  const seen = new Set<string>();
  const contentIdRegex = /\\?"content_id\\?":\\?"([a-f0-9\-]{36})\\?"/g;
  let match: RegExpExecArray | null;

  while ((match = contentIdRegex.exec(html)) !== null) {
    const cid = match[1];
    if (seen.has(cid) || cid.startsWith('00000')) continue;
    seen.add(cid);

    const idx = match.index;
    const block = html.slice(idx, idx + 3000);

    const titleMatch = /\\?"title\\?":\\?"([^\\"]+)\\?"/.exec(block);
    const title = titleMatch ? titleMatch[1] : 'Michael Living AI Track';

    const durMatch = /\\?"duration\\?":([0-9\.]+)/.exec(block);
    const duration = durMatch ? parseFloat(durMatch[1]) : 0;

    const imgMatch = /\\?"image_url\\?":\\?"([^\\"]+)\\?"/.exec(block);
    const imageUrl = imgMatch ? imgMatch[1] : '';

    const tagsMatch = /\\?"tags\\?":\\?"([^\\"]+)\\?"/.exec(block);
    const tags = tagsMatch ? tagsMatch[1] : '';

    let category = 'ambient_folk';
    let categoryLabel = '民谣旅途';
    if (title.includes('掼蛋') || title.includes('满江红') || title.includes('出征') || title.includes('论道')) {
      category = 'guandan_anthem';
      categoryLabel = '掼蛋出征战歌';
    } else if (title.includes('七绝') || title.includes('道兵') || title.includes('星旗')) {
      category = 'classical_epic';
      categoryLabel = '国风史诗';
    } else if (title.includes('诗') || title.includes('雨霖铃')) {
      category = 'worship_lyric';
      categoryLabel = '诗意抒情';
    }

    songs.push({
      id: cid,
      title,
      url: `https://cdn1.suno.ai/${cid}.mp3`,
      sunoUrl: `https://suno.com/song/${cid}`,
      imageUrl,
      tags,
      duration,
      category,
      categoryLabel,
    });
  }

  return songs;
}

function mergeTracks(baseList: BgmTrack[], liveList: BgmTrack[]): BgmTrack[] {
  const merged: BgmTrack[] = [...liveList];
  const seenIds = new Set(liveList.map((t) => t.id));

  for (const t of baseList) {
    if (!seenIds.has(t.id)) {
      merged.push(t);
      seenIds.add(t.id);
    }
  }

  return merged;
}
