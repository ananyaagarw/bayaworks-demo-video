import {renderMedia} from '@remotion/renderer';
import {prepare,output} from './shared.mjs';
import path from 'node:path';
const id=process.argv[2]||'BayaPrototype';
const name=process.argv[3]||'baya-prototype';
const setup=await prepare(id);
let reported=-1;
await renderMedia({...setup,codec:'h264',pixelFormat:'yuv420p',audioCodec:'aac',crf:17,concurrency:4,outputLocation:path.join(output,`${name}.mp4`),onProgress:({progress})=>{const percent=Math.floor(progress*10)*10;if(percent>reported){reported=percent;console.log(`${id}: ${percent}%`);}}});
console.log(path.join(output,`${name}.mp4`));
