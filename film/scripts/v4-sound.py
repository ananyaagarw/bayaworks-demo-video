"""Original Baya audio; timing from this film's cut/action list, no reference samples."""
import importlib.util,json,subprocess
from pathlib import Path
root=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('score',Path(__file__).with_name('revision-sound.py'))
module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
beats=[(0,440),(6,554.365),(12,659.255),(16,440),(17.55,554.365),(23.78,659.255),(27.2,440),(28.1,554.365),(29,659.255),(29.9,830.609),(34,329.628),(42,554.365),(49.96,659.255),(52,880),(57,329.628),(62,554.365),(68.67,659.255),(72,830.609),(85.34,554.365),(88.67,659.255),(92,440),(94,880),(103.3,659.255),(108.5,880),(108.65,1108.73),(108.8,1318.51),(112,659.255)]
module.render('v4-source.wav',120,beats)
source=root/'public/sound/v4-source.wav';target=root/'public/sound/full-v4.wav'
args=['ffmpeg','-hide_banner','-i',str(source),'-af','loudnorm=I=-21:TP=-2:LRA=7:print_format=json','-f','null','-']
p=subprocess.run(args,capture_output=True,text=True,check=True)
a=p.stderr.rfind('{');stats=json.JSONDecoder().raw_decode(p.stderr[a:])[0]
filter=f"loudnorm=I=-21:TP=-2:LRA=7:measured_I={stats['input_i']}:measured_TP={stats['input_tp']}:measured_LRA={stats['input_lra']}:measured_thresh={stats['input_thresh']}:offset={stats['target_offset']}:linear=true:print_format=json"
p=subprocess.run(['ffmpeg','-y','-hide_banner','-i',str(source),'-af',filter,'-ar','48000','-ac','2',str(target)],capture_output=True,text=True,check=True)
(root.parent/'renders').mkdir(exist_ok=True)
(root.parent/'renders/audio-normalization-v4.json').write_text(json.dumps(json.JSONDecoder().raw_decode(p.stderr[p.stderr.rfind('{'):])[0],indent=2)+'\n')
source.unlink()
print(target)
