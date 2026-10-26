"""Original procedural score. No sampled or third-party audio."""
from pathlib import Path
import math, struct, wave
rate = 48000
out = Path(__file__).resolve().parents[1] / 'public/sound/design-study.wav'
out.parent.mkdir(parents=True, exist_ok=True)
with wave.open(str(out), 'wb') as w:
    w.setparams((2, 2, rate, 0, 'NONE', 'not compressed'))
    for i in range(rate * 14):
        t = i / rate
        fade = min(1, t / 1.5, max(0, (14-t)/1.5))
        bed = sum(math.sin(2*math.pi*hz*t) * a for hz,a in [(110,.035),(164.8138,.018),(220,.009)])
        bells = 0
        for at,hz in [(0,440),(3,554.365),(6,659.255),(9,830.609),(12,880)]:
            dt = t-at
            if dt >= 0:
                bells += .065 * math.exp(-dt*2.1) * min(1,dt*70) * (math.sin(2*math.pi*hz*dt)+.22*math.sin(2*math.pi*hz*2.003*dt))
        sample = int(max(-1,min(1,(bed+bells)*fade))*32767)
        w.writeframesraw(struct.pack('<hh',sample,sample))
print(out)
