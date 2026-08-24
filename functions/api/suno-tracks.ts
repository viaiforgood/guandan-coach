// Cloudflare Pages Function to dynamically fetch and parse Suno tracks from @michaellivingai
export async function onRequestGet(context: any) {
  const sunoHandle = 'michaellivingai';
  const profileUrl = `https://suno.com/@${sunoHandle}`;

  try {
    const res = await fetch(profileUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch Suno profile', status: res.status }), {
        status: res.status,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const html = await res.text();
    const songs: any[] = [];
    const seen = new Set<string>();

    // Extract all occurrences of content_id
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

      // Determine category
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

    return new Response(JSON.stringify({ success: true, count: songs.length, handle: sunoHandle, tracks: songs }), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
