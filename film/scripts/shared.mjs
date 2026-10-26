import {bundle} from '@remotion/bundler';
import {selectComposition} from '@remotion/renderer';
import {existsSync,mkdirSync} from 'node:fs';
import path from 'node:path';
export const output=path.resolve('../renders');
export const browser=process.env.REMOTION_BROWSER_EXECUTABLE || ['/usr/bin/chromium','/usr/bin/google-chrome','/usr/bin/google-chrome-stable'].find(existsSync);
export const prepare=async(id='BayaPrototype')=>{
 mkdirSync(output,{recursive:true});
 const serveUrl=await bundle({entryPoint:path.resolve('src/index.ts')});
 const composition=await selectComposition({serveUrl,id,browserExecutable:browser});
 return {serveUrl,composition,browserExecutable:browser};
};
