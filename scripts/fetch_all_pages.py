import urllib.request
import json
import time

headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'}

all_tracks = []
seen_ids = set()

for page in range(1, 15):
    url = f'https://studio-api.prod.suno.com/api/profiles/michaellivingai?playlists_sort_by=created_at&clips_sort_by=created_at&page={page}'
    print(f'Fetching page {page}...')
    try:
        req = urllib.request.Request(url, headers=headers)
        res = urllib.request.urlopen(req, timeout=10)
        data = json.loads(res.read().decode('utf-8'))
        clips = data.get('clips', [])
        if not clips:
            print(f'No more clips found at page {page}. Done.')
            break
        
        for c in clips:
            cid = c.get('id')
            if not cid or cid in seen_ids or cid.startswith('00000'):
                continue
            seen_ids.add(cid)
            
            title = c.get('title') or 'Michael Living AI Track'
            duration = c.get('duration') or (c.get('metadata', {}).get('duration') if isinstance(c.get('metadata'), dict) else 0) or 0
            audio_url = c.get('audio_url') or f'https://cdn1.suno.ai/{cid}.mp3'
            image_url = c.get('image_url') or (c.get('metadata', {}).get('image_url') if isinstance(c.get('metadata'), dict) else '') or ''
            tags = c.get('metadata', {}).get('tags', '') if isinstance(c.get('metadata'), dict) else (c.get('tags') or '')
            
            # Classification
            category = 'ambient_folk'
            categoryLabel = '民谣旅途'
            if any(k in title for k in ['掼蛋', '满江红', '出征', '论道', '牌桌', '战', '牌', '华体会']):
                category = 'guandan_anthem'
                categoryLabel = '掼蛋出征战歌'
            elif any(k in title for k in ['七绝', '道兵', '星旗', '無人', '无人', '述志', '史诗', '逐鹿', '憶江南', '忆江南', '如夢令', '如梦令', '宋词']):
                category = 'classical_epic'
                categoryLabel = '国风史诗'
            elif any(k in title for k in ['诗', '雨霖铃', '向山', '晨登', '恩典', '平安', '喜乐', '秋', '福音', '新生', '山巔', '山巅']):
                category = 'worship_lyric'
                categoryLabel = '诗意抒情'
            elif any(k in title for k in ['跑', '登山', '坡', '晨', '加州', '旅馆', '车站', '站台']):
                category = 'ambient_folk'
                categoryLabel = '民谣旅途'

            all_tracks.append({
                'id': cid,
                'title': title,
                'url': audio_url,
                'sunoUrl': f'https://suno.com/song/{cid}',
                'imageUrl': image_url,
                'tags': tags,
                'duration': round(float(duration), 2) if duration else 0,
                'category': category,
                'categoryLabel': categoryLabel
            })
            
        time.sleep(0.3)
    except Exception as e:
        print(f'Error on page {page}:', e)
        break

print(f'Successfully fetched {len(all_tracks)} total tracks across all pages!')

with open('src/core/bgm_tracks.json', 'w', encoding='utf-8') as f:
    json.dump(all_tracks, f, ensure_ascii=False, indent=2)

print('Saved to src/core/bgm_tracks.json')
