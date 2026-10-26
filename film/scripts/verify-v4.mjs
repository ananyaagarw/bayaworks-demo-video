import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const run=promisify(execFile);const file='../renders/baya-full-animatic-v4.mp4';
const p=JSON.parse((await run('ffprobe',['-v','error','-show_streams','-show_format','-of','json',file])).stdout);
const v=p.streams.find(s=>s.codec_type==='video'),a=p.streams.find(s=>s.codec_type==='audio');
assert.equal(v.codec_name,'h264');assert.equal(v.width,1920);assert.equal(v.height,1080);assert.equal(v.r_frame_rate,'24/1');assert.equal(Number(v.nb_frames),2880);assert.equal(a.codec_name,'aac');assert.ok(Math.abs(Number(p.format.duration)-120)<.1);
await run('ffmpeg',['-v','error','-i',file,'-f','null','-']);
const loud=(await run('ffmpeg',['-hide_banner','-i',file,'-af','loudnorm=I=-21:TP=-2:LRA=7:print_format=json','-f','null','-'])).stderr;
const start=loud.lastIndexOf('{');const end=loud.indexOf('}',start)+1;const audio=JSON.parse(loud.slice(start,end));
assert.ok(Number(audio.input_i)>-23&&Number(audio.input_i)<-19,'Encoded loudness outside review range');assert.ok(Number(audio.input_tp)<-1,'True peak exceeds headroom');
const cuts=JSON.parse(readFileSync('src/v4/cuts.json','utf8'));const index=JSON.parse(readFileSync('../renders/v4-cut-review/index.json','utf8'));
assert.equal(index.length,cuts.length);for(let i=0;i<cuts.length;i++){assert.equal(index[i].at_frame,Math.round(cuts[i].at*24));assert.equal(index[i].before_frame,index[i].at_frame-1);assert.equal(index[i].after_frame,index[i].at_frame+1);}
const audit=JSON.parse(readFileSync('../renders/v4-cut-review/decode-audit.json','utf8'));assert.equal(audit.flatMap(p=>p.decoded).length,cuts.length*3);for(const page of audit)assert.deepEqual(page.decoded,page.expected);
const result={file,width:v.width,height:v.height,frames:v.nb_frames,fps:v.r_frame_rate,duration:p.format.duration,bytes:p.format.size,fullDecode:'passed',encodedIntegratedLufs:audio.input_i,encodedTruePeakDbtp:audio.input_tp,cuts:index.length,cutReviewFrames:index.length*3,sha256:createHash('sha256').update(readFileSync(file)).digest('hex')};
writeFileSync('../renders/verification-v4.json',JSON.stringify(result,null,2)+'\n');console.log('PASS',JSON.stringify(result));
