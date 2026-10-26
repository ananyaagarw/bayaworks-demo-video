import {renderStill} from '@remotion/renderer';
import {mkdirSync} from 'node:fs';
import {prepare,output} from './shared.mjs';
import path from 'node:path';
const setup=await prepare('FullDemoV3'); mkdirSync(path.join(output,'v3'),{recursive:true});
for(const [name,second] of [['01-opening',8],['02-enter-works',13.5],['03-works',44],['04-enter-studio',59.5],['05-studio',75],['06-handoff',93.5],['07-package',102],['08-download',109],['09-complete',112],['10-brand-transition',116],['11-ending',119]]){
 await renderStill({...setup,frame:Math.round(second*24),imageFormat:'png',output:path.join(output,'v3',`${name}.png`)}); console.log(name,second);
}
