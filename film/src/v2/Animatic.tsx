import React from 'react';
import {Audio} from '@remotion/media';
import {Sequence,interpolate,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {C,Frame,Logo,PROJECT,progress,Pointer,Turn,typed} from './system';
import {CustomerExperience} from './CustomerWorkflow';
import {EngineeringCanvas} from './EngineeringCanvas';
import {Chapter,DownloadArchive,Ending} from './RequestedFinishes';
const LocalTime=()=>{const f=useCurrentFrame();const {fps}=useVideoConfig();return f/fps;};
const EngineeringScene=()=>{const t=LocalTime();return <Frame>
 <div style={{position:'absolute',left:100,top:75}}><Logo/></div>
 <div style={{position:'absolute',left:100,top:235,fontSize:62,lineHeight:1.12,letterSpacing:-2,width:620}}>Better engineering.<br/><span style={{color:C.green}}>Faster delivery.</span></div>
 <div style={{position:'absolute',left:100,top:550,width:500,fontSize:28,color:C.muted,lineHeight:1.5}}>AI-powered MEP design</div>
 <div style={{position:'absolute',left:700,top:240,width:1100,height:650,transform:`perspective(1700px) rotateX(${24-12*progress(t,0,10)}deg) rotateZ(${-12+8*progress(t,0,10)}deg)`}}><EngineeringCanvas time={t} mode={t>7?'light':'design'}/></div>
 </Frame>};
const CustomerSection=()=>{const t=LocalTime();const mapped=interpolate(t,[0,10,26,41],[0,9,18.5,30],{extrapolateRight:'clamp'});return <CustomerExperience time={mapped}/>;};
const StudioScene=()=>{const t=LocalTime();const lighting=t<15;const instruction=lighting?'Move the meeting room lights away from the projector zone and recalculate.':'Add outlets along the workstation wall and update the circuit layout.';return <Frame>
 <div style={{position:'absolute',inset:65,border:`1px solid ${C.line}`,borderRadius:28,padding:36,background:C.panel}}>
 <div style={{display:'flex',gap:35,alignItems:'center'}}><Logo width={140}/><span style={{fontSize:28}}>Baya Studio</span><span style={{marginLeft:'auto',color:C.muted,fontSize:22}}>{PROJECT}</span></div>
 <div style={{position:'absolute',left:50,top:160,width:605}}>
 <div style={{fontSize:47,letterSpacing:-1.6,marginBottom:35}}>Direct the design.</div>
 <Turn who="ENGINEER" text={typed(instruction,lighting?t:t-15,1,4)} t={lighting?t:t-15} at={.4} width={570}/>
 <div style={{marginTop:45}}><Turn who="BAYA" text={lighting?(t<10?'Moving the selected fixtures. The affected lighting study needs updating.':'Layout updated. The lighting study is ready to review.'):'Outlets added. The circuit layout is updated.'} t={lighting?t:t-15} at={5.5} width={570}/></div>
 <div style={{marginTop:45,borderTop:`1px solid ${C.line}`,paddingTop:22,color:C.green,fontSize:24,opacity:progress(lighting?t:t-15,7,8)}}>{lighting?'Meeting room · Lighting':'Workstation wall · Electrical'}</div>
 </div>
 <div style={{position:'absolute',right:45,top:225,width:1035,height:605}}><EngineeringCanvas time={12} mode={t>10?'light':'design'} edit={progress(t,6,9)} electricalEdit={progress(t,21,24)}/></div>
 </div>
 </Frame>};
const DELIVERABLES=[
 ['Lighting layout','.pdf'],['Electrical layout','.pdf'],
 ['BIM coordination model','.ifc'],['Revit model','.rvt'],
 ['Fixture schedule','.xlsx'],['Equipment schedule','.xlsx'],
 ['Calculation report','.pdf'],['Bill of quantities','.xlsx'],
];
const DeliveryScene=()=>{const t=LocalTime();const clicked=t>=9.3;const complete=t>=14.5;return <Frame>
 <div style={{position:'absolute',left:100,top:75,display:'flex',gap:40,alignItems:'center'}}><Logo/><span style={{fontSize:27}}>Baya Works</span><span style={{fontSize:23,color:C.muted,marginLeft:700}}>{PROJECT}</span></div>
 <div style={{position:'absolute',left:100,top:250}}><div style={{fontSize:75,letterSpacing:-3,color:C.green}}>Designs ready.</div><div style={{fontSize:28,color:C.muted,marginTop:25}}>Review package · Revision B</div>
 <div style={{position:'absolute',left:0,top:465,width:490}}>
 <div style={{display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:26,color:C.bg,background:C.green,width:455,height:80,borderRadius:40}}>{complete?'✓ Design package downloaded':clicked?'Preparing your package…':'↓ Download design package'}</div>
 <div style={{marginTop:24}}><DownloadArchive time={t}/></div>
 </div></div>
 <div style={{position:'absolute',left:830,top:240,width:940,height:650,border:`1px solid ${C.line}`,borderRadius:18,padding:35,background:'#EDE9DF08',boxSizing:'border-box'}}><div style={{fontSize:26,marginBottom:22}}>Design package</div>
 {DELIVERABLES.map(([name,ext],i)=><div key={name} style={{display:'flex',alignItems:'center',justifyContent:'space-between',height:61,borderBottom:i<7?`1px solid ${C.line}`:'none',opacity:progress(t,1+i*.35,1.6+i*.35)}}><span style={{fontSize:26}}>{name}</span><span style={{fontSize:22,color:C.green}}>{ext}</span></div>)}
 </div>
 {t>8&&t<10?<Pointer x={450-65*progress(t,8,9)} y={785-30*progress(t,8,9)} click={progress(t,9,9.5)} opacity={1-progress(t,9.5,10)}/>:null}
 </Frame>};
const Score=()=>{const t=LocalTime();return <Audio src={staticFile('sound/full-animatic.wav')} volume={.5*(1-progress(t,112.5,114.5))}/>;};
export const FullAnimatic=()=>{const {fps}=useVideoConfig();return <>
 <div style={{width:1920,height:1080,transform:'scale(.5)',transformOrigin:'top left'}}>
 <Sequence from={0} durationInFrames={9.5*fps} name="01 · Building intelligence"><EngineeringScene/></Sequence>
 <Sequence from={9.5*fps} durationInFrames={4*fps} name="02 · Baya Works"><Chapter kind="works"/></Sequence>
 <Sequence from={13.5*fps} durationInFrames={41*fps} name="03 · Works customer journey"><CustomerSection/></Sequence>
 <Sequence from={54.5*fps} durationInFrames={5*fps} name="04 · Inside Baya Studio"><Chapter kind="studio"/></Sequence>
 <Sequence from={59.5*fps} durationInFrames={27*fps} name="05 · Studio supervision"><StudioScene/></Sequence>
 <Sequence from={86.5*fps} durationInFrames={2*fps} name="06 · From design to delivery"><Chapter kind="delivery"/></Sequence>
 <Sequence from={88.5*fps} durationInFrames={18*fps} name="07 · Designs ready and download"><DeliveryScene/></Sequence>
 <Sequence from={106.5*fps} durationInFrames={8*fps} name="08 · Closing"><Ending/></Sequence>
 </div>
 <Score/>
 </>};
