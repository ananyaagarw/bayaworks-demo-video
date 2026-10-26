"""Review sheets extracted from the final encoded MP4, using FFmpeg only."""
import json,subprocess,time,re
from pathlib import Path
root=Path(__file__).resolve().parents[1];out=root.parent/'renders';movie=out/'baya-full-animatic-v4.mp4'
cuts=json.loads((root/'src/v4/cuts.json').read_text());target=out/'v4-cut-review';target.mkdir(exist_ok=True)
index=[]
for number,c in enumerate(cuts,1):
 n=round(c['at']*24);index.append({**c,'cut_number':number,'before_frame':n-1,'at_frame':n,'after_frame':n+1})
(target/'index.json').write_text(json.dumps(index,indent=2)+'\n')
font=Path('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf')
if not font.exists():raise RuntimeError('Install fonts-dejavu-core for contact-sheet labels')
pages=[];audit=[]
for page in range((len(cuts)+5)//6):
 group=index[page*6:page*6+6];frames=[f for c in group for f in [c['before_frame'],c['at_frame'],c['after_frame']]]
 select='+'.join(f'eq(n,{n})' for n in frames)
 label="%{pts\\:hms}"
 filter=f"select='{select}',showinfo,scale=640:360,drawtext=fontfile={font}:text='{label}':fontcolor=white:fontsize=19:box=1:boxcolor=black@0.8:x=12:y=12,tile=3x6:padding=8:margin=8:color=0x100C0A"
 name=target/f'cuts-{page+1:02}.jpg';before=time.time()
 result=subprocess.run(['ffmpeg','-y','-v','info','-i',str(movie),'-vf',filter,'-frames:v','1',str(name)],check=True,capture_output=True,text=True)
 decoded=[round(float(t)*24) for t in re.findall(r'pts_time:([0-9.]+)',result.stderr)]
 if decoded!=frames:raise RuntimeError(f'Decoded selection mismatch: {decoded} != {frames}')
 audit.append({'page':page+1,'expected':frames,'decoded':decoded})
 if name.stat().st_mtime<before-1:raise RuntimeError('Stale review output')
 pages.append(name);print('Rendered encoded cut sheet',name)
subprocess.run(['ffmpeg','-y','-v','error','-pattern_type','glob','-i',str(target/'cuts-*.jpg'),'-vf',f'scale=972:-1,tile=1x{len(pages)}:padding=10:color=0x100C0A','-frames:v','1',str(out/'contact-sheet-v4.jpg')],check=True)
lines=['# V4 actual-MP4 cut review','',f'{len(cuts)} cuts; {len(cuts)*3} encoded frames. Each row is BEFORE (N−1), AT (N), AFTER (N+1). Timestamp labels come from the MP4 PTS. No still-render substitutions.','']
for page,name in enumerate(pages,1):
 lines.append(f'## Sheet {page}\n\n![Cut sheet {page}]({name.name})\n')
 for c in index[(page-1)*6:page*6]:lines.append(f"- {c['cut_number']:02}. {c['at']:06.2f}s — {c['name']}")
 lines.append('')
(target/'decode-audit.json').write_text(json.dumps(audit,indent=2)+'\n')
(target/'README.md').write_text('\n'.join(lines)+'\n')
print('All cut sheets:',len(pages),'review frames:',len(cuts)*3)

# Additional actual-encode samples inside moving actions, not just at cuts.
samples=[11,22.5,24.7,30,46,67,69,70.5,72,73.3,85.1,86.5,88.3,100,104,106.2,108.6,110.5,113.5,117]
selected='+'.join(f'eq(n,{round(t*24)})' for t in samples)
filter=f"select='{selected}',scale=480:270,drawtext=fontfile={font}:text='%{{pts\\:hms}}':fontcolor=white:fontsize=16:box=1:boxcolor=black@0.8:x=10:y=10,tile=4x5:padding=8:margin=8:color=0x100C0A"
subprocess.run(['ffmpeg','-y','-v','error','-i',str(movie),'-vf',filter,'-frames:v','1',str(out/'action-review-v4.jpg')],check=True)
print('Actual encoded action samples:',len(samples))
