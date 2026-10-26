import {renderMedia} from '@remotion/renderer';
import {prepare,output} from './shared.mjs';
import path from 'node:path';
const id=process.argv[2]||'BayaPrototype';
const name=process.argv[3]||'baya-prototype';
const setup=await prepare(id);
await renderMedia({...setup,codec:'h264',pixelFormat:'yuv420p',audioCodec:'aac',crf:17,concurrency:4,outputLocation:path.join(output,`${name}.mp4`),onProgress:({progress})=>{if(progress===1)console.log('Render completed');}});
console.log(path.join(output,`${name}.mp4`));
