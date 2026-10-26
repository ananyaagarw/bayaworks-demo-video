"""Original generated music/cues for the product demo. No samples or paid tools."""
from array import array
from pathlib import Path
import math, wave
RATE=48000
ROOT=Path(__file__).resolve().parents[1]/'public/sound'

def render(name,seconds,beats):
    target=ROOT/name
    with wave.open(str(target),'wb') as w:
        w.setparams((2,2,RATE,0,'NONE','not compressed'))
        for second in range(seconds):
            chunk=array('h')
            for j in range(RATE):
                t=second+j/RATE
                fade=min(1,t/1.5,max(0,(seconds-t)/2))
                movement=.75+.25*math.sin(t*.23)
                bed=(.027*math.sin(2*math.pi*110*t)+.014*math.sin(2*math.pi*164.8138*t)+.009*math.sin(2*math.pi*220*t))*movement
                notes=0
                for at,hz in beats:
                    dt=t-at
                    if 0<=dt<4:
                        notes+=.047*math.exp(-dt*1.5)*min(1,dt*90)*(math.sin(2*math.pi*hz*dt)+.16*math.sin(2*math.pi*hz*2.003*dt))
                value=int((bed+notes)*fade*32767)
                chunk.extend([value,value])
            w.writeframesraw(chunk.tobytes())
    print(target)
if __name__ == '__main__':
    render('customer-workflow.wav',30,[(1.5,440),(2.3,554.365),(7,659.255),(9.7,440),(10.2,554.365),(10.7,659.255),(11.2,830.609),(13.3,329.628),(18.5,554.365),(24.6,659.255),(27.8,880)])
    render('full-animatic.wav',120,[(0,440),(6,554.365),(12,659.255),(22,440),(38,554.365),(53,329.628),(60,440),(70,554.365),(79,659.255),(85,440),(94,659.255),(97,880),(107,1108.73),(112,659.255)])
