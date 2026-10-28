"""Audio-only finishing pass. Run from repository root; requires numpy and FFmpeg.
Reuses the approved music-only audio unchanged in gain. Never renders picture.
"""
import argparse
import hashlib
import json
import math
from pathlib import Path
import subprocess
import tempfile
import numpy as np

ROOT = Path(__file__).resolve().parents[3]
parser = argparse.ArgumentParser()
parser.add_argument('--interactions', action='store_true', help='Add quiet clicks and tonal upload tings, without airy SFX')
INTERACTIONS = parser.parse_args().interactions
LABEL = 'subtle-interactions' if INTERACTIONS else 'subtle-typing'
OUT = ROOT / 'handoff' / LABEL
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
# select.wav is purely tonal; upload.wav contains a noise slide and is excluded.
interaction_samples = {name: decode(ROOT / f'film/public/sound/polish/sfx/{name}.wav') for name in ('click', 'select')} if INTERACTIONS else {}
interaction_cues = [
    ('works', 2.0, 'click', 0.35, 'Open project'),
    ('works', tl['events']['worksUpload'] - 13.5 - 2.1, 'click', 0.30, 'Send customer scope'),
    ('studio', tl['events']['studioSend1'] - 47.2, 'click', 0.32, 'Send first engineer instruction'),
    ('studio', tl['events']['studioSend1'] - 47.2 + 0.45, 'click', 0.32, 'Select fixtures'),
    ('studio', tl['events']['studioSend2'] - 47.2, 'click', 0.32, 'Send second engineer instruction'),
    ('history', 6.6, 'click', 0.35, 'Open deliverables'),
    ('delivery', 7.0, 'click', 0.35, 'Download designs'),
]
# Last customer send is defined by the same text schedule plus the original 0.3 s hold.
std = text_of(works, 'STANDARD')
def typing_duration(text, seed):
    # A sentinel yields the accumulated duration after the original final character.
    return schedule(text + 'X', seed)[-1]
interaction_cues.append(('works', entries[1][2] + typing_duration(std, 5) + 0.3, 'click', 0.30, 'Send company standards'))
for i in range(4):
    interaction_cues.append(('works', tl['events']['worksUpload'] - 13.5 + 1.4 + i * 0.32 + 0.28, 'select', 0.26, f'File {i+1} lands'))
report = {'interaction_reduction_db': REDUCTION_DB if INTERACTIONS else None, 'typing_reduction_db': REDUCTION_DB, 'fps': FPS, 'outputs': {}}
OUT.mkdir(exist_ok=True)
for short in [False, True]:
    suffix = '-short' if short else ''
    src = ROOT / f'handoff/music-only/baya-film-revised{suffix}-music-only.mp4'
    dst = OUT / f'baya-film-revised{suffix}-{LABEL}.mp4'
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
    interaction_events = []
    if INTERACTIONS:
        for seg in segments:
            for scene, local, kind, original_gain, action in interaction_cues:
                if scene != seg['id'] or not frame(seg['in']) <= frame(local) < frame(seg['out']):
                    continue
                at = (frame(seg['at']) - frame(seg['in']) + frame(local)) / FPS
                sample = interaction_samples[kind] * original_gain * 10 ** (REDUCTION_DB / 20)
                idx = round(at * SR)
                n = min(len(sample), len(stem) - idx, round((frame(seg['at']) + frame(seg['out'] - seg['in'])) / FPS * SR) - idx)
                stem[idx:idx+n] += sample[:n]
                interaction_events.append(dict(scene=scene, at=at, sample=kind, action=action, original_gain=original_gain))
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
    report['outputs'][dst.name] = dict(duration=duration, frames=int(video['nb_frames']), video_stream_hash=after, video_stream_identical=True, integrated_lufs=float(levels['input_i']), true_peak_dbtp=float(levels['input_tp']), typing_events=events, interaction_events=interaction_events, file_sha256=hashlib.sha256(dst.read_bytes()).hexdigest())
    print(dst.name, report['outputs'][dst.name]['integrated_lufs'], report['outputs'][dst.name]['true_peak_dbtp'], len(events), flush=True)
(OUT / 'verification.json').write_text(json.dumps(report, indent=2) + '\n')
