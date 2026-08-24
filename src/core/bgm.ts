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
    id: 'eb5aa40c-ac69-482f-a67d-ef0f5410d074',
    title: '满江红·史诗摇滚·进行曲·战灌蛋·北美高校联盟战歌',
    url: 'https://cdn1.suno.ai/eb5aa40c-ac69-482f-a67d-ef0f5410d074.mp3',
    sunoUrl: 'https://suno.com/song/eb5aa40c-ac69-482f-a67d-ef0f5410d074',
    imageUrl: 'https://cdn2.suno.ai/eb5aa40c-ac69-482f-a67d-ef0f5410d074_4e9454d4.jpeg',
    tags: '恢宏热血的中文史诗摇滚战歌，适合高校联盟牌类赛事开场与决赛现场。强劲大鼓、军鼓、铜管齐奏，齐声口号式收束。',
    duration: 227.52,
    category: 'guandan_anthem',
    categoryLabel: '掼蛋出征战歌',
  },
  {
    id: '8b206607-d80a-407a-9c30-a80603a5a741',
    title: '汉风•满江红•高校联盟•北加硅谷•掼蛋出征•壮行山河',
    url: 'https://cdn1.suno.ai/8b206607-d80a-407a-9c30-a80603a5a741.mp3',
    sunoUrl: 'https://suno.com/song/8b206607-d80a-407a-9c30-a80603a5a741',
    imageUrl: 'https://cdn2.suno.ai/image_8b206607-d80a-407a-9c30-a80603a5a741.jpeg',
    tags: '古典汉风战歌与现代史诗摇滚融合；鼓点如行军，低沉大鼓、铿锵铜管、古琴与笛子点染，气吞山河。',
    duration: 193.0,
    category: 'guandan_anthem',
    categoryLabel: '掼蛋出征战歌',
  },
  {
    id: '64d2872d-83ab-44ef-9de6-47d9395c8309',
    title: '汉风·满江红七队同阵·北美高校联盟·出征华体会掼蛋大赛',
    url: 'https://cdn1.suno.ai/64d2872d-83ab-44ef-9de6-47d9395c8309.mp3',
    sunoUrl: 'https://suno.com/song/64d2872d-83ab-44ef-9de6-47d9395c8309',
    imageUrl: 'https://cdn2.suno.ai/image_64d2872d-83ab-44ef-9de6-47d9395c8309.jpeg',
    tags: '浑厚男中音庄严叙述，第二段强烈战鼓与铜管反复，保留传统戏曲式拖腔和大会出征气势。',
    duration: 239.08,
    category: 'guandan_anthem',
    categoryLabel: '掼蛋出征战歌',
  },
  {
    id: 'da98faa2-0b08-4c34-bdb7-a435eece5681',
    title: '牌桌论道',
    url: 'https://cdn1.suno.ai/da98faa2-0b08-4c34-bdb7-a435eece5681.mp3',
    sunoUrl: 'https://suno.com/song/da98faa2-0b08-4c34-bdb7-a435eece5681',
    imageUrl: 'https://cdn2.suno.ai/image_da98faa2-0b08-4c34-bdb7-a435eece5681.jpeg',
    tags: '国风流行说唱，牌桌智慧与机智对弈，律动活泼，金句连连。',
    duration: 154.72,
    category: 'guandan_anthem',
    categoryLabel: '牌桌博弈',
  },
  {
    id: 'ca4fc554-b3c9-4fb8-a32b-42c4476c6ebf',
    title: '道兵合一',
    url: 'https://cdn1.suno.ai/ca4fc554-b3c9-4fb8-a32b-42c4476c6ebf.mp3',
    sunoUrl: 'https://suno.com/song/ca4fc554-b3c9-4fb8-a32b-42c4476c6ebf',
    imageUrl: 'https://cdn2.suno.ai/image_ca4fc554-b3c9-4fb8-a32b-42c4476c6ebf.jpeg',
    tags: '古筝与二胡交织，6/8拍华尔兹慢板，行军鼓乐与合唱渐强，大气磅礴。',
    duration: 208.88,
    category: 'classical_epic',
    categoryLabel: '国风史诗',
  },
  {
    id: '340ec300-0740-4c53-815f-596903989f46',
    title: '七绝•向山举目•半穹望岳',
    url: 'https://cdn1.suno.ai/340ec300-0740-4c53-815f-596903989f46.mp3',
    sunoUrl: 'https://suno.com/song/340ec300-0740-4c53-815f-596903989f46',
    imageUrl: 'https://cdn2.suno.ai/image_340ec300-0740-4c53-815f-596903989f46.jpeg',
    tags: '古筝琴韵，二胡对位旋律，钢琴琶音，弦乐四重奏，意境深远。',
    duration: 211.6,
    category: 'classical_epic',
    categoryLabel: '国风史诗',
  },
  {
    id: '5da46046-90d0-4086-bd6e-9c6004cdd63b',
    title: '上行之诗••向山举目•半穹望岳',
    url: 'https://cdn1.suno.ai/5da46046-90d0-4086-bd6e-9c6004cdd63b.mp3',
    sunoUrl: 'https://suno.com/song/5da46046-90d0-4086-bd6e-9c6004cdd63b',
    imageUrl: 'https://cdn2.suno.ai/image_5da46046-90d0-4086-bd6e-9c6004cdd63b.jpeg',
    tags: '诗篇意境，清晨破晓，宁静致远，虔诚庄重。',
    duration: 221.68,
    category: 'worship_lyric',
    categoryLabel: '诗意抒情',
  },
  {
    id: '87f28bcf-cd66-48b3-804d-d504e90cf2c7',
    title: '初秋傍晚的喜乐与平安',
    url: 'https://cdn1.suno.ai/87f28bcf-cd66-48b3-804d-d504e90cf2c7.mp3',
    sunoUrl: 'https://suno.com/song/87f28bcf-cd66-48b3-804d-d504e90cf2c7',
    imageUrl: 'https://cdn2.suno.ai/image_87f28bcf-cd66-48b3-804d-d504e90cf2c7.jpeg',
    tags: '温暖木吉他分解和弦与柔美钢琴，轻柔鼓点，舒缓安宁，初秋傍晚的宁静。',
    duration: 245.0,
    category: 'worship_lyric',
    categoryLabel: '诗意抒情',
  },
  {
    id: '80a50879-49fb-40d5-899e-419d3ed80e6d',
    title: '加州大道车站',
    url: 'https://cdn1.suno.ai/80a50879-49fb-40d5-899e-419d3ed80e6d.mp3',
    sunoUrl: 'https://suno.com/song/80a50879-49fb-40d5-899e-419d3ed80e6d',
    imageUrl: 'https://cdn2.suno.ai/image_80a50879-49fb-40d5-899e-419d3ed80e6d.jpeg',
    tags: '电影感流行抒情，钢琴与手鼓，旅途与思绪，温暖宽阔。',
    duration: 307.32,
    category: 'ambient_folk',
    categoryLabel: '民谣旅途',
  },
  {
    id: '614f66e5-65c6-4517-9467-f27eb8c16661',
    title: '加利福尼亚旅馆于加州大道',
    url: 'https://cdn1.suno.ai/614f66e5-65c6-4517-9467-f27eb8c16661.mp3',
    sunoUrl: 'https://suno.com/song/614f66e5-65c6-4517-9467-f27eb8c16661',
    imageUrl: 'https://cdn2.suno.ai/image_614f66e5-65c6-4517-9467-f27eb8c16661.jpeg',
    tags: '中文叙事公路摇滚，干净电吉他分解和弦，温暖木吉他铺底，黄昏余韵。',
    duration: 270.4,
    category: 'ambient_folk',
    categoryLabel: '民谣旅途',
  },
  {
    id: 'b1a8538c-3af6-4104-8566-7f2c58cf5078',
    title: '加州旅馆于加州大道',
    url: 'https://cdn1.suno.ai/b1a8538c-3af6-4104-8566-7f2c58cf5078.mp3',
    sunoUrl: 'https://suno.com/song/b1a8538c-3af6-4104-8566-7f2c58cf5078',
    imageUrl: 'https://cdn2.suno.ai/image_b1a8538c-3af6-4104-8566-7f2c58cf5078.jpeg',
    tags: '经典吉他摇滚民谣，复古悠扬，双轨电吉他与低声部和声。',
    duration: 242.28,
    category: 'ambient_folk',
    categoryLabel: '民谣旅途',
  },
  {
    id: '72eaaf0d-506e-41fd-bcfc-13686083d362',
    title: '加利福尼亚站台',
    url: 'https://cdn1.suno.ai/72eaaf0d-506e-41fd-bcfc-13686083d362.mp3',
    sunoUrl: 'https://suno.com/song/72eaaf0d-506e-41fd-bcfc-13686083d362',
    imageUrl: 'https://cdn2.suno.ai/image_72eaaf0d-506e-41fd-bcfc-13686083d362.jpeg',
    tags: '舒缓民谣吉他，火车行进律动，温暖治愈，站台离合。',
    duration: 249.6,
    category: 'ambient_folk',
    categoryLabel: '民谣旅途',
  },
  {
    id: 'a3d1af01-86b6-48ae-b65b-43df4d690d8e',
    title: '后山晨登，喜乐恩典相随',
    url: 'https://cdn1.suno.ai/a3d1af01-86b6-48ae-b65b-43df4d690d8e.mp3',
    sunoUrl: 'https://suno.com/song/a3d1af01-86b6-48ae-b65b-43df4d690d8e',
    imageUrl: 'https://cdn2.suno.ai/image_a3d1af01-86b6-48ae-b65b-43df4d690d8e.jpeg',
    tags: '清晨山间民谣，箱琴木吉他与轻柔手鼓，空灵宁静。',
    duration: 264.28,
    category: 'ambient_folk',
    categoryLabel: '民谣旅途',
  },
  {
    id: '86d63e43-fa5d-4fc3-b712-0ef5c2732871',
    title: '半百述志',
    url: 'https://cdn1.suno.ai/86d63e43-fa5d-4fc3-b712-0ef5c2732871.mp3',
    sunoUrl: 'https://suno.com/song/86d63e43-fa5d-4fc3-b712-0ef5c2732871',
    imageUrl: 'https://cdn2.suno.ai/image_86d63e43-fa5d-4fc3-b712-0ef5c2732871.jpeg',
    tags: '当代民谣赞美诗，6/8拍律动，深沉叙事，岁月沉淀与感恩。',
    duration: 215.8,
    category: 'ambient_folk',
    categoryLabel: '民谣旅途',
  },
  {
    id: '33deabfa-ce6e-44d8-b659-b1106bbd5e31',
    title: '星旗飘扬',
    url: 'https://cdn1.suno.ai/33deabfa-ce6e-44d8-b659-b1106bbd5e31.mp3',
    sunoUrl: 'https://suno.com/song/33deabfa-ce6e-44d8-b659-b1106bbd5e31',
    imageUrl: 'https://cdn2.suno.ai/image_33deabfa-ce6e-44d8-b659-b1106bbd5e31.jpeg',
    tags: '庄严军乐进行曲，交响管乐与合唱，铜管号角，气势恢宏。',
    duration: 252.12,
    category: 'classical_epic',
    categoryLabel: '国风史诗',
  },
  {
    id: 'ff632dfa-d2fc-4ed2-9cce-ec94fc937122',
    title: '我叫無人',
    url: 'https://cdn1.suno.ai/ff632dfa-d2fc-4ed2-9cce-ec94fc937122.mp3',
    sunoUrl: 'https://suno.com/song/ff632dfa-d2fc-4ed2-9cce-ec94fc937122',
    imageUrl: 'https://cdn2.suno.ai/image_ff632dfa-d2fc-4ed2-9cce-ec94fc937122.jpeg',
    tags: '电影管弦乐与国风独奏，深沉男声朗诵，大提琴与竹笛交融，苍凉辽阔。',
    duration: 190.8,
    category: 'classical_epic',
    categoryLabel: '国风史诗',
  },
  {
    id: '1a7c7ba5-708c-4abd-ac86-fc7107998e19',
    title: 'Song of Saraview Dawn',
    url: 'https://cdn1.suno.ai/1a7c7ba5-708c-4abd-ac86-fc7107998e19.mp3',
    sunoUrl: 'https://suno.com/song/1a7c7ba5-708c-4abd-ac86-fc7107998e19',
    imageUrl: 'https://cdn2.suno.ai/image_1a7c7ba5-708c-4abd-ac86-fc7107998e19.jpeg',
    tags: '双语诗意朗诵，清晨拂晓，冥想与心灵沉思，自然之声。',
    duration: 247.44,
    category: 'ambient_folk',
    categoryLabel: '民谣旅途',
  },
  {
    id: 'e2093658-03cc-4fd4-bd95-e0b9e6f4acc6',
    title: '雨霖铃•寒蝉凄切•抄底又抄錯',
    url: 'https://cdn1.suno.ai/e2093658-03cc-4fd4-bd95-e0b9e6f4acc6.mp3',
    sunoUrl: 'https://suno.com/song/e2093658-03cc-4fd4-bd95-e0b9e6f4acc6',
    imageUrl: 'https://cdn2.suno.ai/image_e2093658-03cc-4fd4-bd95-e0b9e6f4acc6.jpeg',
    tags: '宋词古典抒情与自嘲幽默，二胡与钢琴悠扬，弦乐起伏。',
    duration: 296.72,
    category: 'worship_lyric',
    categoryLabel: '诗意抒情',
  },
  {
    id: 'e50476a8-9dad-4bcd-a123-765400c90ccb',
    title: '满江红•怒发冲冠•抄的不是底(抄底不是梦)',
    url: 'https://cdn1.suno.ai/e50476a8-9dad-4bcd-a123-765400c90ccb.mp3',
    sunoUrl: 'https://suno.com/song/e50476a8-9dad-4bcd-a123-765400c90ccb',
    imageUrl: 'https://cdn2.suno.ai/image_e50476a8-9dad-4bcd-a123-765400c90ccb.jpeg',
    tags: '琵琶与太鼓说唱，慷慨激昂，行军鼓点，热血沸腾。',
    duration: 238.56,
    category: 'guandan_anthem',
    categoryLabel: '掼蛋出征战歌',
  },
  {
    id: '5545005e-9f07-4d8a-869f-6aa843f840ad',
    title: '金宝日暮（女聲）',
    url: 'https://cdn1.suno.ai/5545005e-9f07-4d8a-869f-6aa843f840ad.mp3',
    sunoUrl: 'https://suno.com/song/5545005e-9f07-4d8a-869f-6aa843f840ad',
    imageUrl: 'https://cdn2.suno.ai/image_5545005e-9f07-4d8a-869f-6aa843f840ad.jpeg',
    tags: '悠扬女声抒情，日暮夕阳，温柔缱绻。',
    duration: 246.6,
    category: 'ambient_folk',
    categoryLabel: '民谣旅途',
  },
];

/**
 * Dynamically fetches published Suno tracks from @michaellivingai in real time.
 * Merges newly published tracks seamlessly with the local curated playlist.
 */
export async function fetchLiveSunoTracks(): Promise<BgmTrack[]> {
  try {
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
