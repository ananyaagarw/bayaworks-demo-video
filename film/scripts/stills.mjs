import {renderStill} from '@remotion/renderer';
import {prepare,output} from './shared.mjs';
import path from 'node:path';
const setup=await prepare();
for(const [name,frame] of [['01-geometry',60],['02-interpretation',155],['03-layout',246],['04-light-study',328],['05-brand',405]]){
 await renderStill({...setup,frame,imageFormat:'png',output:path.join(output,`${name}.png`)});
 console.log(name,frame);
}
