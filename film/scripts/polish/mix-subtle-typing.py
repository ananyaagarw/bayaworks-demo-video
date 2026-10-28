"""Audio-only finishing pass. Run from repository root; requires numpy and FFmpeg.
Reuses the approved music-only audio unchanged in gain. Never renders picture.
"""
import hashlib
import json
import math
from pathlib import Path
import subprocess
import tempfile
import numpy as np

ROOT = Path(__file__).resolve().parents[3]
OUT = ROOT / 'handoff/subtle-typing'
SR, FPS, REDUCTION_DB = 48000, 30, -14

def run(args):
    return subprocess.check_output(args, stderr=subprocess.PIPE)

def decode(path):
    return np.frombuffer(run(['ffmpeg', '-v', 'error', '-i', str(path), '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-']), dtype='<f4').reshape(-1, 2)

def schedule(text, seed):
    def h(n):
        s = math.sin(n * 127.1 + 311.7) * 43758.5453
        return s - math.floor(s)
    times, acc = [], 0
    for i, ch in enumerate(text):
        times.append(acc)
        acc += (0.7 + 0.6 * h(i + seed * 97)) / 27
        if ch == ' ':
            acc += 0.035 + 0.05 * h(i * 3 + seed)
        if ch in ',.':
            acc += 0.16
    return times

def frame(t):
    return math.floor(t * FPS + 0.5)

tl = json.loads((ROOT / 'film/scripts/polish/timeline-revised.json').read_text())
works = (ROOT / 'film/src/polish/scenes/Works.tsx').read_text()
studio = (ROOT / 'film/src/polish/scenes/Studio.tsx').read_text()
import re
def text_of(source, name):
    return re.search(r"const " + name + r" = '([^']+)';", source)[1]
entries = [
    ('works', text_of(works, 'SCOPE'), 4.3, 11),
    ('works', text_of(works, 'STANDARD'), tl['events']['worksAsk'] - 13.5 + 2.5, 5),
    ('studio', text_of(studio, 'I1'), 4.5 + 1.0, 3),
    ('studio', text_of(studio, 'I2'), 4.5 + 15.55, 7),
]
samples = [decode(ROOT / f'film/public/sound/polish/sfx/key{i}.wav') for i in range(4)]
report = {'typing_reduction_db': REDUCTION_DB, 'fps': FPS, 'outputs': {}}
OUT.mkdir(exist_ok=True)
for short in [False, True]:
    suffix = '-short' if short else ''
    src = ROOT / f'handoff/music-only/baya-film-revised{suffix}-music-only.mp4'
    dst = OUT / f'baya-film-revised{suffix}-subtle-typing.mp4'
    probe = json.loads(run(['ffprobe', '-v', 'error', '-show_streams', '-of', 'json', str(src)]))
    video = next(s for s in probe['streams'] if s['codec_type'] == 'video')
    duration = float(video['duration'])
    stem = np.zeros((round(duration * SR), 2), dtype=np.float32)
    segments = tl['short']['segments'] if short else [dict(s, at=s['from'], **{'in': 0, 'out': s['dur']}) for s in tl['scenes']]
    events = []
    for seg in segments:
        for scene, text, start, seed in entries:
            if scene != seg['id']:
                continue
            for i, tt in enumerate(schedule(text, seed)):
                if text[i] == ' ' or i % 2:
                    continue
                local_frame = frame(start + tt)
                if not frame(seg['in']) <= local_frame < frame(seg['out']):
                    continue
                at = (frame(seg['at']) - frame(seg['in']) + local_frame) / FPS
                gain = (0.16 + 0.08 * ((i * 13) % 5) / 4) * 10 ** (REDUCTION_DB / 20)
                sample = samples[(i * 7 + seed) % 4] * gain
                idx = round(at * SR)
                n = min(len(sample), len(stem) - idx, round((frame(seg['at']) + frame(seg['out'] - seg['in'])) / FPS * SR) - idx)
                stem[idx:idx+n] += sample[:n]
                events.append({'scene': scene, 'character': i, 'at': at, 'original_gain': round(gain / 10 ** (REDUCTION_DB / 20), 3)})
    music = decode(src)
    mixed = stem.copy()
    n = min(len(music), len(mixed))
    mixed[:n] += music[:n]
    assert np.max(np.abs(mixed)) < 0.85, 'Unexpected headroom; inspect rather than altering music gain'
    with tempfile.NamedTemporaryFile(suffix='.f32') as tmp:
        mixed.astype('<f4').tofile(tmp.name)
        run(['ffmpeg', '-v', 'error', '-y', '-i', str(src), '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', tmp.name, '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '320k', '-movflags', '+faststart', str(dst)])
    def video_hash(path):
        return run(['ffmpeg', '-v', 'error', '-i', str(path), '-map', '0:v:0', '-c', 'copy', '-f', 'hash', '-hash', 'sha256', '-']).decode().strip()
    before, after = video_hash(src), video_hash(dst)
    assert before == after, 'Picture stream changed'
    # Decode entire output and fail on corrupt media.
    run(['ffmpeg', '-v', 'error', '-xerror', '-i', str(dst), '-f', 'null', '-'])
    m = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(dst), '-vn', '-af', 'loudnorm=I=-18:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, check=True)
    log = m.stderr.decode()
    levels = json.loads(log[log.rfind('{'):log.rfind('}')+1])
    assert float(levels['input_tp']) <= -1.5
    report['outputs'][dst.name] = dict(duration=duration, frames=int(video['nb_frames']), video_stream_hash=after, video_stream_identical=True, integrated_lufs=float(levels['input_i']), true_peak_dbtp=float(levels['input_tp']), typing_events=events, file_sha256=hashlib.sha256(dst.read_bytes()).hexdigest())
    print(dst.name, report['outputs'][dst.name]['integrated_lufs'], report['outputs'][dst.name]['true_peak_dbtp'], len(events), flush=True)
(OUT / 'verification.json').write_text(json.dumps(report, indent=2) + '\n')
