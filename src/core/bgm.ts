import rawTracks from './bgm_tracks.json';

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

export const SUNO_BGM_PLAYLIST: BgmTrack[] = rawTracks as BgmTrack[];

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

  // Fallback direct pagination fetch
  try {
    const allTracks: BgmTrack[] = [];
    const seenIds = new Set<string>();

    for (let page = 1; page <= 8; page++) {
      const url = `https://studio-api.prod.suno.com/api/profiles/michaellivingai?playlists_sort_by=created_at&clips_sort_by=created_at&page=${page}`;
      const res = await fetch(url);
      if (!res.ok) break;
      const data = await res.json();
      const clips = data.clips || [];
      if (!clips.length) break;

      for (const c of clips) {
        if (!c.id || seenIds.has(c.id) || c.id.startsWith('00000')) continue;
        seenIds.add(c.id);
        const title = c.title || 'Michael Living AI Track';
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
          title.includes('無人') ||
          title.includes('无人') ||
          title.includes('述志') ||
          title.includes('史诗') ||
          title.includes('憶江南') ||
          title.includes('如夢令')
        ) {
          category = 'classical_epic';
          categoryLabel = '国风史诗';
        } else if (
          title.includes('诗') ||
          title.includes('雨霖铃') ||
          title.includes('向山') ||
          title.includes('晨登') ||
          title.includes('恩典') ||
          title.includes('喜乐') ||
          title.includes('福音')
        ) {
          category = 'worship_lyric';
          categoryLabel = '诗意抒情';
        }

        allTracks.push({
          id: c.id,
          title,
          url: c.audio_url || `https://cdn1.suno.ai/${c.id}.mp3`,
          sunoUrl: `https://suno.com/song/${c.id}`,
          imageUrl: c.image_url || '',
          tags: c.metadata?.tags || c.tags || '',
          duration: c.duration || 0,
          category,
          categoryLabel,
        });
      }
    }

    if (allTracks.length > 0) {
      return mergeTracks(SUNO_BGM_PLAYLIST, allTracks);
    }
  } catch (err) {
    console.warn('Fallback pagination fetch failed:', err);
  }

  return SUNO_BGM_PLAYLIST;
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
