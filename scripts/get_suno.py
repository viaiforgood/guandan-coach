import urllib.request
import re
import json

url = 'https://suno.com/@michaellivingai'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'})
content = urllib.request.urlopen(req).read().decode('utf-8')

songs = []
seen = set()

# Find all occurrences of content_id with escaped quotes
for m in re.finditer(r'\\?"content_id\\?":\\?"([a-f0-9\-]{36})\\?"', content):
    cid = m.group(1)
    if cid in seen or cid.startswith('00000'):
        continue
    seen.add(cid)
    
    idx = m.start()
    block = content[idx:min(len(content), idx + 3000)]
    
    title_m = re.search(r'\\?"title\\?":\\?"([^\\"]+)\\?"', block)
    title = title_m.group(1) if title_m else 'Michael Living AI Track'
    
    dur_m = re.search(r'\\?"duration\\?":([0-9\.]+)', block)
    duration = float(dur_m.group(1)) if dur_m else 0
    
    img_m = re.search(r'\\?"image_url\\?":\\?"([^\\"]+)\\?"', block)
    image_url = img_m.group(1) if img_m else ''
    
    tags_m = re.search(r'\\?"tags\\?":\\?"([^\\"]+)\\?"', block)
    tags = tags_m.group(1) if tags_m else ''
    
    songs.append({
        'id': cid,
        'title': title,
        'url': f'https://cdn1.suno.ai/{cid}.mp3',
        'sunoUrl': f'https://suno.com/song/{cid}',
        'imageUrl': image_url,
        'tags': tags,
        'duration': duration
    })

print(f'Total {len(songs)} tracks found:')
for i, s in enumerate(songs, 1):
    print(f"{i}. {s['title']} | Tags: {s['tags']} | URL: {s['url']}")

with open('src/core/bgm_tracks.json', 'w', encoding='utf-8') as f:
    json.dump(songs, f, ensure_ascii=False, indent=2)
