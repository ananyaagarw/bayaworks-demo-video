import {Composition} from 'remotion';
import {Film} from './Film';
import {CustomerWorkflow} from './v2/CustomerWorkflow';
import {FullAnimatic} from './v2/Animatic';
export const Root=()=> <>
 <Composition id="CustomerWorkflow" component={CustomerWorkflow} durationInFrames={900} fps={30} width={1920} height={1080}/>
 <Composition id="FullAnimatic" component={FullAnimatic} durationInFrames={2880} fps={24} width={960} height={540}/>
 <Composition id="BayaPrototype" component={Film} durationInFrames={420} fps={30} width={1920} height={1080}/>
</>;
