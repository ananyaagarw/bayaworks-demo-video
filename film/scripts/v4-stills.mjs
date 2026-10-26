import {renderStill} from '@remotion/renderer';
import {mkdirSync} from 'node:fs';
import {prepare,output} from './shared.mjs';
import path from 'node:path';
const requested=process.argv.slice(2);
const setup=await prepare('FullDemoV4');mkdirSync(path.join(output,'v4'),{recursive:true});
for(const [name,sec] of [['01-opening-hold',11],['02-works-chapter',14],['03-brief-close',22.5],['04-upload-close',30],['05-question-close',46],['06-studio-chapter',59],['07-instruction-close',67],['08-lighting-change',72],['09-outlet-change',87],['10-package-close',100],['11-download-close',107],['12-download-wide',110.5],['13-ending',117]]){
 if(requested.length&&!requested.includes(name))continue;
 await renderStill({...setup,frame:Math.round(sec*24),imageFormat:'png',output:path.join(output,'v4',`${name}.png`)});console.log(name,sec);
}
