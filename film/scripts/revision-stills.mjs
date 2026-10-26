import {renderStill} from '@remotion/renderer';
import {mkdirSync} from 'node:fs';
import {prepare,output} from './shared.mjs';
import path from 'node:path';
for(const [id,shots] of [
 ['CustomerWorkflow',[['01-new-project',45],['02-conversation',180],['03-uploads',360],['04-understanding',495],['05-question',645],['06-playbook',870]]],
 ['FullAnimatic',[['07-opening',200],['08-studio',1920],['09-delivery',2520]]]
]){
 const setup=await prepare(id);mkdirSync(path.join(output,'v2'),{recursive:true});
 for(const [name,frame] of shots){await renderStill({...setup,frame,imageFormat:'png',output:path.join(output,'v2',`${name}.png`)});console.log(name,frame);}
}
