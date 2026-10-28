"""Original sound design for the polished Baya film.

Everything is synthesised here from sine/noise sources: no samples, no third-party audio,
no paid tools. Run from film/:  python3 scripts/polish/sound.py
Writes public/sound/polish/sfx/*.wav and public/sound/polish/score-*.wav (48 kHz stereo).
"""
from pathlib import Path
import json
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000
ROOT = Path(__file__).resolve().parents[2] / 'public/sound/polish'
RNG = np.random.default_rng(7)


def t_axis(sec):
    return np.arange(int(sec * SR)) / SR


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], 'bandpass', fs=SR, output='sos'), x)


def lp(x, f, order=2):
    return sosfilt(butter(order, f, 'lowpass', fs=SR, output='sos'), x)


def hp(x, f, order=2):
    return sosfilt(butter(order, f, 'highpass', fs=SR, output='sos'), x)


def env(n, a, d, sustain=0.0, curve=4.0):
    """Attack (s) then exponential decay with time constant d (s)."""
    t = np.arange(n) / SR
    att = np.clip(t / max(a, 1e-4), 0, 1) ** 2
    dec = np.exp(-np.maximum(t - a, 0) / d)
    return att * (sustain + (1 - sustain) * dec)


def stereo(x, width=0.0, delay_ms=0.0):
    if delay_ms:
        d = int(SR * delay_ms / 1000)
        r = np.concatenate([np.zeros(d), x[:-d] if d else x])
        return np.stack([x * (1 - width / 2), r * (1 - width / 2) + x * width / 2], 1)
    return np.stack([x, x], 1)


def reverb_ir(sec=2.6, damp=5200, seed=3):
    r = np.random.default_rng(seed)
    t = t_axis(sec)
    decay = np.exp(-t * (6.9 / sec))
    ir = np.stack([lp(r.standard_normal(len(t)), damp) * decay, lp(r.standard_normal(len(t)), damp) * decay], 1)
    ir[: int(0.012 * SR)] *= np.linspace(0, 1, int(0.012 * SR))[:, None]
    return ir / np.sqrt((ir ** 2).sum(0)).max()


IR = reverb_ir()
IR_SHORT = reverb_ir(1.1, 7000, 5)


def verb(x, mix=0.25, ir=IR):
    if x.ndim == 1:
        x = stereo(x)
    wet = np.stack([fftconvolve(x[:, c], ir[:, c])[: len(x) + len(ir)] for c in range(2)], 1)
    dry = np.vstack([x, np.zeros((len(ir), 2))])[: len(wet)]
    return dry * (1 - mix) + wet * mix


def trim_tail(x, thresh=1e-4):
    idx = np.where(np.abs(x).max(1) > thresh)[0]
    return x[: (idx[-1] + 1 if len(idx) else 1)]


def write(name, x, peak_db=-6.0):
    if x.ndim == 1:
        x = stereo(x)
    x = trim_tail(x)
    fade = min(len(x), int(0.01 * SR))
    x[-fade:] *= np.linspace(1, 0, fade)[:, None]
    peak = np.abs(x).max()
    if peak > 0:
        x = x / peak * 10 ** (peak_db / 20)
    path = ROOT / name
    path.parent.mkdir(parents=True, exist_ok=True)
    import wave
    with wave.open(str(path), 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype('<i2').tobytes())
    print(path.relative_to(ROOT.parents[2]), f'{len(x) / SR:.2f}s')


def bell(f, sec=2.2, index=1.6, ratio=3.5, decay=0.9):
    t = t_axis(sec)
    mod = index * np.exp(-t / 0.35) * np.sin(2 * np.pi * f * ratio * t)
    x = np.sin(2 * np.pi * f * t + mod) + 0.25 * np.sin(2 * np.pi * f * 2.0 * t) * np.exp(-t / 0.4)
    return x * env(len(t), 0.004, decay)


def pluck(f, sec=1.2, bright=0.5):
    t = t_axis(sec)
    x = np.zeros_like(t)
    for n in range(1, 9):
        x += (1 / n ** 1.3) * np.sin(2 * np.pi * f * n * t) * np.exp(-t * (2.2 + n * (3 - 2 * bright)))
    hammer = bp(RNG.standard_normal(len(t)), 1500, 5000) * np.exp(-t / 0.006) * 0.15
    return (x + hammer) * env(len(t), 0.003, 10)


def place(x, offset, n):
    """x delayed by offset seconds inside a buffer of n samples."""
    out = np.zeros(n)
    s = int(offset * SR)
    out[s: s + len(x)] = x[: max(0, n - s)]
    return out


def noise(sec):
    return RNG.standard_normal(int(sec * SR))


# ---------------- UI and interaction effects ----------------
def make_sfx():
    for i in range(4):
        n = int(0.06 * SR)
        click = bp(noise(0.06), 2600 + 500 * i, 6500, 2) * env(n, 0.0005, 0.004 + 0.001 * i)
        body = np.sin(2 * np.pi * (150 + 25 * i) * t_axis(0.06)) * env(n, 0.001, 0.012) * 0.5
        write(f'sfx/key{i}.wav', verb(click + body, 0.08, IR_SHORT), -9)

    t = t_axis(0.5)
    tock = np.sin(2 * np.pi * (700 * np.exp(-t * 9) + 300) * t) * env(len(t), 0.001, 0.035)
    air = bp(noise(0.5), 1500, 7000) * env(len(t), 0.05, 0.08) * 0.25
    write('sfx/send.wav', verb(tock + air, 0.15, IR_SHORT), -7)

    t = t_axis(0.4)
    a = np.sin(2 * np.pi * 1760 * t) * env(len(t), 0.001, 0.03)
    b = place(np.sin(2 * np.pi * 2349 * t) * env(len(t), 0.001, 0.035), 0.07, len(t))
    write('sfx/select.wav', verb(a + 0.8 * b, 0.25, IR_SHORT), -10)

    t = t_axis(0.25)
    thunk = np.sin(2 * np.pi * 520 * t) * env(len(t), 0.001, 0.025) + 0.4 * bp(noise(0.25), 1800, 4000) * env(len(t), 0.0005, 0.006)
    write('sfx/place.wav', verb(thunk, 0.2, IR_SHORT), -10)

    # A slow, weighted glide for objects moving within the drawing.
    sec = 2.0
    t = t_axis(sec)
    shape = np.sin(np.pi * np.clip(t / sec, 0, 1)) ** 2
    n = noise(sec)
    sweep = np.zeros_like(t)
    for k, (lo, hi) in enumerate([(300, 700), (600, 1400), (1000, 2400)]):
        seg = bp(n, lo, hi)
        sweep += seg * (0.5 ** k)
    glide = sweep * shape * 0.35 + np.sin(2 * np.pi * 98 * t) * shape * 0.25
    write('sfx/glide.wav', verb(glide, 0.3), -14)

    t = t_axis(0.9)
    scratch = bp(noise(0.9), 2500, 8000) * (0.6 + 0.4 * np.sin(2 * np.pi * 14 * t)) * np.sin(np.pi * t / 0.9) ** 2
    write('sfx/mark.wav', verb(scratch, 0.2), -20)

    # Calculation sweep: airy rising shimmer with faint harmonic sparkle.
    sec = 2.1
    t = t_axis(sec)
    shape = np.clip(t / 0.35, 0, 1) * np.exp(-np.maximum(t - 1.7, 0) / 0.15)
    n = noise(sec)
    air = np.zeros_like(t)
    for lo in (900, 1800, 3600):
        air += bp(n, lo, lo * 1.6)
    freq = 1100 + 900 * (t / sec)
    shimmer = sum(np.sin(2 * np.pi * np.cumsum(freq * r) / SR) * (0.3 / r) for r in (1, 1.5, 2))
    sweep = air * 0.18 * shape + shimmer * 0.05 * shape
    write('sfx/sweep.wav', verb(stereo(sweep, 0.6, 9), 0.35), -12)

    # Resolution chime: two soft bell partials (A5 → D6).
    a = bell(880, 2.4, 1.1, 3.5, 0.7)
    b = place(bell(1174.66, 2.4, 1.0, 3.5, 0.8), 0.09, len(a))
    write('sfx/resolve.wav', verb(a * 0.6 + b * 0.55, 0.35), -11)

    t = t_axis(0.8)
    swell = lp(noise(0.8), 900) * np.sin(np.pi * np.clip(t / 0.8, 0, 1)) ** 2 * 0.5 + np.sin(2 * np.pi * 65 * t) * np.sin(np.pi * t / 0.8) * 0.4
    write('sfx/window.wav', verb(swell, 0.3), -16)

    # Chapter: a low swell that blooms into a single bell as the title lands.
    sec = 3.2
    t = t_axis(sec)
    rise = np.clip(t / 0.9, 0, 1) ** 2 * np.exp(-np.maximum(t - 0.9, 0) / 0.9)
    low = (np.sin(2 * np.pi * 55 * t) + 0.5 * np.sin(2 * np.pi * 82.4 * t)) * rise * 0.45 + lp(noise(sec), 500) * rise * 0.12
    b = place(bell(587.33, 2.6, 0.8, 2.0, 1.1) * 0.35, 0.55, len(t))
    write('sfx/chapter.wav', verb(low + b, 0.35), -9)

    # Upload: a soft paper-like slide with a tick when a file lands.
    t = t_axis(0.45)
    slide = bp(noise(0.45), 1200, 5000) * np.sin(np.pi * np.clip(t / 0.3, 0, 1)) ** 2 * 0.3
    tick = place(np.sin(2 * np.pi * 1320 * t_axis(0.17)) * env(int(0.17 * SR), 0.001, 0.02), 0.28, len(t))
    write('sfx/upload.wav', verb(slide + 0.5 * tick, 0.2, IR_SHORT), -12)

    t = t_axis(0.3)
    click = bp(noise(0.3), 2000, 6000) * env(len(t), 0.0003, 0.003) + np.sin(2 * np.pi * 300 * t) * env(len(t), 0.001, 0.015) * 0.6
    write('sfx/click.wav', verb(click, 0.12, IR_SHORT), -9)

    # Download complete: warm, three-note rising resolution (D5, F#5, A5).
    out = np.zeros(int(3.2 * SR))
    for i, f in enumerate((587.33, 739.99, 880.0)):
        s = int(i * 0.11 * SR)
        nb = bell(f, 2.8, 0.7, 2.0, 1.0) * (0.5 - 0.06 * i)
        out[s: s + len(nb)] += nb[: len(out) - s]
    write('sfx/complete.wav', verb(out, 0.35), -10)


# ---------------- Score ----------------
NOTE = {n: i for i, n in enumerate(['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'])}


def hz(name):
    pitch, octave = name[:-1], int(name[-1])
    return 440.0 * 2 ** ((NOTE[pitch] + 12 * (octave + 1) - 69) / 12)


CHORDS = {
    'Bm9': ['B1', 'F#2', 'D3', 'A3', 'C#4', 'F#4'],
    'Gmaj9': ['G1', 'D2', 'B2', 'F#3', 'A3', 'D4'],
    'D/F#': ['F#1', 'D2', 'A2', 'F#3', 'A3', 'E4'],
    'Asus2': ['A1', 'E2', 'B2', 'E3', 'A3', 'C#4'],
    'Dadd9': ['D2', 'A2', 'F#3', 'A3', 'E4', 'F#4'],
    'Em9': ['E1', 'B1', 'G2', 'D3', 'F#3', 'B3'],
}


def pad_voice(f, sec, seed):
    t = t_axis(sec)
    r = np.random.default_rng(seed)
    x = np.zeros_like(t)
    for det in (-0.004, 0.0, 0.0045):
        ph = r.uniform(0, 2 * np.pi)
        for n in range(1, 10):
            amp = (1 / n) * np.exp(-(n - 1) / 2.4)
            x += amp * np.sin(2 * np.pi * f * (1 + det) * n * t + ph * n)
    lfo = 1 + 0.12 * np.sin(2 * np.pi * (0.07 + r.uniform(0, 0.05)) * t + r.uniform(0, 6))
    return x * lfo / 3


def score(duration, sections, accents, arp_spans, name, gain_db=-14):
    """sections: [(start, chord, level)], accents: [(time, note, level)], arp_spans: [(start, end, chord)]."""
    out = np.zeros((int(duration * SR) + SR * 4, 2))
    for i, (start, chord, level) in enumerate(sections):
        end = sections[i + 1][0] if i + 1 < len(sections) else duration
        sec = end - start + 3.0
        for v, note in enumerate(CHORDS[chord]):
            f = hz(note)
            x = pad_voice(f, sec, sum(map(ord, chord)) * 10 + v)
            e = np.clip(np.arange(len(x)) / SR / 1.6, 0, 1) ** 1.5 * np.clip((sec - np.arange(len(x)) / SR) / 2.6, 0, 1)
            x = x * e * level * (0.9 if f < 120 else 0.55)
            pan = (v / (len(CHORDS[chord]) - 1) - 0.5) * 0.5
            s = int(start * SR)
            seg = np.stack([x * (1 - pan), x * (1 + pan)], 1)
            out[s: s + len(seg)] += seg[: len(out) - s]
    # Soft muted arpeggio for the product sections (momentum without percussion).
    step = 60 / 104 / 2
    for (a, b, chord) in arp_spans:
        notes = [hz(n) * 2 for n in CHORDS[chord][2:]]
        k = 0
        tt = a
        while tt < b - 0.2:
            f = notes[[0, 2, 1, 3, 2, 1][k % 6] % len(notes)]
            fade = min(1, (tt - a) / 2.0, (b - tt) / 1.5)
            x = pluck(f, 1.0, 0.3) * 0.075 * fade * (1.0 if k % 2 == 0 else 0.75)
            pan = 0.3 * np.sin(k * 1.3)
            s = int(tt * SR)
            seg = np.stack([x * (1 - pan), x * (1 + pan)], 1)
            out[s: s + len(seg)] += seg[: len(out) - s]
            tt += step
            k += 1
    for (tm, note, level) in accents:
        x = bell(hz(note), 3.0, 0.7, 2.0, 1.3) * level * 0.22
        s = int(tm * SR)
        out[s: s + len(x)] += stereo(x)[: len(out) - s]
    out = lp(out.T, 7000).T
    out = verb(out, 0.38)
    out = out[: int(duration * SR)]
    fade = int(2.5 * SR)
    out[:int(0.05 * SR)] *= np.linspace(0, 1, int(0.05 * SR))[:, None]
    out[-fade:] *= np.linspace(1, 0, fade)[:, None] ** 2
    write(name, out, gain_db)


def film_plan(tl):
    """Harmonic plan for the full film, placed on the exported picture timeline."""
    sc = {x['id']: x for x in tl['scenes']}
    ev = tl['events']
    st = lambda i: sc[i]['from']
    end = lambda i: sc[i]['from'] + sc[i]['dur']
    sections = [
        (0.0, 'Bm9', 0.5), (ev['lightsOn'], 'Dadd9', 0.68),
        (st('worksCard'), 'Gmaj9', 0.52), (st('works'), 'Dadd9', 0.64), (ev['worksUpload'], 'Gmaj9', 0.68),
        (ev['worksConnect'], 'Em9', 0.68), (ev['worksAsk'], 'Asus2', 0.7), (ev['worksPrep'], 'Dadd9', 0.72),
        (st('studioCard'), 'Bm9', 0.52), (st('studio'), 'Gmaj9', 0.68), (ev['studioSend1'], 'D/F#', 0.7),
        (ev['studioSweep'], 'Asus2', 0.74), (ev['studioSwept'], 'Dadd9', 0.76), (ev['studioSend2'], 'Em9', 0.7),
        (ev['studioDone2'], 'Dadd9', 0.74), (st('deliveryCard'), 'Gmaj9', 0.58), (st('delivery'), 'Em9', 0.64),
        (ev['deliveryClick'], 'D/F#', 0.7), (ev['deliveryDone'], 'Dadd9', 0.8), (st('ending'), 'Dadd9', 0.66),
    ]
    product = [(3.4, st('worksCard') - 0.2), (st('works') + 2.3, end('works') - 0.3),
               (st('studio') + 1.0, end('studio') - 0.4), (st('delivery') + 1.4, end('delivery') - 0.4)]
    accents = [(ev['lightsOn'] + 0.05, 'F#5', 0.8), (ev['deliveryDone'] + 0.2, 'A5', 0.5), (st('ending') + 0.3, 'D5', 0.9)]
    return sections, product, accents


def revised_plan(tl):
    """Harmonic plan for the revised film (Studio intro, bridge card, project history)."""
    sc = {x['id']: x for x in tl['scenes']}
    ev = tl['events']
    st = lambda i: sc[i]['from']
    end = lambda i: sc[i]['from'] + sc[i]['dur']
    sections = [
        (0.0, 'Bm9', 0.5), (ev['lightsOn'], 'Dadd9', 0.68),
        (st('worksCard'), 'Gmaj9', 0.52), (st('works'), 'Dadd9', 0.64), (ev['worksUpload'], 'Gmaj9', 0.68),
        (ev['worksConnect'], 'Em9', 0.68), (ev['worksAsk'], 'Asus2', 0.7), (ev['worksPrep'], 'Dadd9', 0.72),
        (st('studioCard'), 'Bm9', 0.52), (st('studio'), 'Gmaj9', 0.66), (ev['studioIntro'], 'Dadd9', 0.7),
        (ev['studioSend1'], 'D/F#', 0.7), (ev['studioSweep'], 'Asus2', 0.74), (ev['studioSwept'], 'Dadd9', 0.76),
        (ev['studioSend2'], 'Em9', 0.7), (ev['studioDone2'], 'Dadd9', 0.74),
        (st('revisionCard'), 'Bm9', 0.52), (st('revisionCard') + 2.2, 'Em9', 0.54),
        (st('history'), 'Gmaj9', 0.64), (ev['historyInsert'], 'D/F#', 0.68), (ev['historyApprove'], 'Dadd9', 0.74),
        (st('delivery'), 'Em9', 0.64), (ev['deliveryClick'], 'D/F#', 0.7), (ev['deliveryDone'], 'Dadd9', 0.8),
        (st('ending'), 'Dadd9', 0.66),
    ]
    product = [(3.4, st('worksCard') - 0.2), (st('works') + 2.3, end('works') - 0.3),
               (st('studio') + 1.0, end('studio') - 0.4), (st('history') + 0.8, end('history') - 0.3),
               (st('delivery') + 1.4, end('delivery') - 0.4)]
    accents = [(ev['lightsOn'] + 0.05, 'F#5', 0.8), (ev['historyApprove'] + 0.05, 'F#5', 0.45),
               (ev['deliveryDone'] + 0.2, 'A5', 0.5), (st('ending') + 0.3, 'D5', 0.9)]
    return sections, product, accents


def arps_for(sections, spans):
    out = []
    for a, b in spans:
        bounds = sorted({a, b, *[s[0] for s in sections if a < s[0] < b]})
        for x, y in zip(bounds, bounds[1:]):
            chord = [s for s in sections if s[0] <= x][-1][1]
            out.append((x, y, chord))
    return out


def to_short(tl, sections, product, accents):
    """Map film-time cues into the website cut via its segments."""
    segs = tl['short']['segments']
    def m(ft):
        for g in segs:
            a = g['filmFrom'] + g['in']
            b = g['filmFrom'] + g['out']
            if a <= ft < b:
                return g['at'] + ft - a
        return None
    ss = []
    for g in segs:
        ft = g['filmFrom'] + g['in']
        chord, level = [(c, l) for (t0, c, l) in sections if t0 <= ft][-1]
        ss.append((g['at'], chord, level))
    for t0, c, l in sections:
        s0 = m(t0)
        if s0 is not None and all(abs(s0 - x[0]) > 0.3 for x in ss):
            ss.append((s0, c, l))
    ss.sort()
    sp = []
    for a, b in product:
        for g in segs:
            fa = g['filmFrom'] + g['in']
            fb = g['filmFrom'] + g['out']
            lo, hi = max(a, fa), min(b, fb)
            if hi - lo > 1.0:
                sp.append((g['at'] + lo - fa, g['at'] + hi - fa))
    acc = [(m(t0), n, l) for (t0, n, l) in accents if m(t0) is not None]
    return ss, sp, acc


if __name__ == '__main__':
    make_sfx()
    cues = json.loads((Path(__file__).parent / 'score-cues.json').read_text())
    for name, c in cues.items():
        score(c['duration'], c['sections'], c['accents'], c['arps'], f'score-{name}.wav', c.get('gain', -14))
    tl = json.loads((Path(__file__).parent / 'timeline.json').read_text())
    sections, product, accents = film_plan(tl)
    score(tl['duration'], sections, accents, arps_for(sections, product), 'score-film.wav')
    ss, sp, acc = to_short(tl, sections, product, accents)
    score(tl['short']['duration'], ss, acc, arps_for(ss, sp), 'score-short.wav')
    rv = json.loads((Path(__file__).parent / 'timeline-revised.json').read_text())
    sections, product, accents = revised_plan(rv)
    score(rv['duration'], sections, accents, arps_for(sections, product), 'score-revised.wav')
    for key, name in (('short', 'score-revised-short.wav'), ('preview', 'score-revised-preview.wav')):
        ss, sp, acc = to_short({'short': rv[key]}, sections, product, accents)
        score(rv[key]['duration'], ss, acc, arps_for(ss, sp), name)
