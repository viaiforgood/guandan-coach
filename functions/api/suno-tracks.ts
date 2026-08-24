// Cloudflare Pages Function to dynamically fetch ALL published Suno tracks with pagination
export async function onRequestGet(context: any) {
  const sunoHandle = 'michaellivingai';
  const headers = {
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    Accept: 'application/json, text/plain, */*',
  };

  try {
    const allTracks: any[] = [];
    const seenIds = new Set<string>();

    // Fetch across pages 1 to 10
    for (let page = 1; page <= 10; page++) {
      const url = `https://studio-api.prod.suno.com/api/profiles/${sunoHandle}?playlists_sort_by=created_at&clips_sort_by=created_at&page=${page}`;
      const res = await fetch(url, { headers });
      if (!res.ok) break;

      const data = await res.json();
      const clips = data.clips || [];
      if (!clips || clips.length === 0) break;

      for (const c of clips) {
        const cid = c.id;
        if (!cid || seenIds.has(cid) || cid.startsWith('00000')) continue;
        seenIds.add(cid);

        const title = c.title || 'Michael Living AI Track';
        const duration =
          c.duration ||
          (c.metadata && typeof c.metadata === 'object' ? c.metadata.duration : 0) ||
          0;
        const audioUrl = c.audio_url || `https://cdn1.suno.ai/${cid}.mp3`;
        const imageUrl =
          c.image_url ||
          (c.metadata && typeof c.metadata === 'object' ? c.metadata.image_url : '') ||
          '';
        const tags =
          c.tags ||
          (c.metadata && typeof c.metadata === 'object' ? c.metadata.tags : '') ||
          '';

        let category = 'ambient_folk';
        let categoryLabel = '民谣旅途';
        if (
          title.includes('掼蛋') ||
          title.includes('满江红') ||
          title.includes('出征') ||
          title.includes('论道') ||
          title.includes('牌桌') ||
          title.includes('战') ||
          title.includes('华体会')
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
          title.includes('逐鹿') ||
          title.includes('憶江南') ||
          title.includes('忆江南') ||
          title.includes('如夢令') ||
          title.includes('如梦令')
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
          title.includes('秋') ||
          title.includes('福音') ||
          title.includes('新生')
        ) {
          category = 'worship_lyric';
          categoryLabel = '诗意抒情';
        }

        allTracks.push({
          id: cid,
          title,
          url: audioUrl,
          sunoUrl: `https://suno.com/song/${cid}`,
          imageUrl,
          tags,
          duration: typeof duration === 'number' ? Math.round(duration * 100) / 100 : 0,
          category,
          categoryLabel,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        count: allTracks.length,
        handle: sunoHandle,
        tracks: allTracks,
      }),
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
