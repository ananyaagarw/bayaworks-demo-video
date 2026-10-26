import {renderMedia} from '@remotion/renderer';
import {prepare,output} from './shared.mjs';
import path from 'node:path';
const setup=await prepare();
await renderMedia({...setup,codec:'h264',pixelFormat:'yuv420p',audioCodec:'aac',crf:17,concurrency:4,outputLocation:path.join(output,'baya-prototype.mp4'),onProgress:({progress})=>{if(progress===1)console.log('Render completed');}});
console.log(path.join(output,'baya-prototype.mp4'));
