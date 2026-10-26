import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const run=promisify(execFile); const results=[];
for(const [name,w,h,frames,fps,seconds] of [['baya-customer-workflow-v2',1920,1080,900,30,30],['baya-full-animatic-v2',960,540,2880,24,120]]){
 const file=`../renders/${name}.mp4`;
 const p=JSON.parse((await run('ffprobe',['-v','error','-show_streams','-show_format','-of','json',file])).stdout);
 const v=p.streams.find(s=>s.codec_type==='video'), a=p.streams.find(s=>s.codec_type==='audio');
 assert.equal(v.codec_name,'h264'); assert.equal(v.width,w); assert.equal(v.height,h);assert.equal(Number(v.nb_frames),frames);assert.equal(v.r_frame_rate,`${fps}/1`);assert.equal(a.codec_name,'aac');assert.ok(Math.abs(Number(p.format.duration)-seconds)<.1);
 await run('ffmpeg',['-v','error','-i',file,'-f','null','-']);
 results.push({name,width:w,height:h,frames,fps,duration:p.format.duration,bytes:p.format.size,audio:a.codec_name,sha256:createHash('sha256').update(readFileSync(file)).digest('hex'),fullDecode:'passed'});
 console.log('PASS',name,w,h,frames,`${fps} fps`,p.format.duration,'seconds, H.264/AAC, full decode');
}
writeFileSync('../renders/verification-v2.json',JSON.stringify(results,null,2)+'\n');
