import React from 'react';
import {Audio} from '@remotion/media';
import {Sequence,interpolate,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {C,Frame,Logo,PROJECT,progress,Turn,typed} from './system';
import {CustomerExperience} from './CustomerWorkflow';
import {EngineeringCanvas} from './EngineeringCanvas';
const LocalTime=()=>{const f=useCurrentFrame();const {fps}=useVideoConfig();return f/fps;};
const EngineeringScene:React.FC<{inside?:boolean}>=({inside=false})=>{const t=LocalTime();return <Frame>
 <div style={{position:'absolute',left:100,top:75}}><Logo/></div>
 <div style={{position:'absolute',left:100,top:235,fontSize:62,lineHeight:1.12,letterSpacing:-2,width:620}}>{inside?<>An engineering agent.<br/><span style={{color:C.green}}>At work.</span></>:<>Electrical.<br/>Lighting.<br/><span style={{color:C.green}}>One building.</span></>}</div>
 <div style={{position:'absolute',left:100,top:550,width:500,fontSize:28,color:C.muted,lineHeight:1.5}}>{inside?(t<6?'Geometry and firm requirements become a coordinated design.':t<12?'Layouts, connections and routes develop together.':'Checks and results stay connected to the design.'):PROJECT}</div>
 <div style={{position:'absolute',left:700,top:240,width:1100,height:650,transform:`perspective(1700px) rotateX(${24-12*progress(t,0,10)}deg) rotateZ(${-12+8*progress(t,0,10)}deg)`}}><EngineeringCanvas time={t} mode={t>7?'light':'design'}/></div>
 </Frame>};
const CustomerSection=()=>{const t=LocalTime();const mapped=interpolate(t,[0,10,26,41],[0,9,18.5,30],{extrapolateRight:'clamp'});return <CustomerExperience time={mapped}/>;};
export const StudioScene:React.FC<{time?:number;hideConversation?:boolean;hideCanvas?:boolean;refineEdits?:boolean}>=({time,hideConversation=false,hideCanvas=false,refineEdits=false})=>{const local=LocalTime();const t=time??local;const lighting=t<15;const instruction=lighting?'Move the meeting room lights away from the projector zone and recalculate.':'Add outlets along the workstation wall and update the circuit layout.';return <Frame>
 <div style={{position:'absolute',inset:65,border:`1px solid ${C.line}`,borderRadius:28,padding:36,background:C.panel}}>
 <div style={{display:'flex',gap:35,alignItems:'center'}}><Logo width={140}/><span style={{fontSize:28}}>Baya Studio</span><span style={{marginLeft:'auto',color:C.muted,fontSize:22}}>{PROJECT}</span></div>
 <div style={{position:'absolute',left:50,top:160,width:605,opacity:hideConversation?0:1}}>
 <div style={{fontSize:47,letterSpacing:-1.6,marginBottom:35}}>Direct the design.</div>
 <Turn who="ENGINEER" text={typed(instruction,lighting?t:t-15,1,4)} t={lighting?t:t-15} at={.4} width={570}/>
 <div style={{marginTop:45}}><Turn who="BAYA" text={lighting?(t<10?'Moving the selected fixtures. The affected lighting study needs updating.':'Layout updated. The lighting study is ready to review.'):'Outlets added. The circuit layout is updated.'} t={lighting?t:t-15} at={5.5} width={570}/></div>
 <div style={{marginTop:45,borderTop:`1px solid ${C.line}`,paddingTop:22,color:C.green,fontSize:24,opacity:progress(lighting?t:t-15,7,8)}}>{lighting?'Meeting room · Lighting':'Workstation wall · Electrical'}</div>
 </div>
 <div style={{position:'absolute',right:45,top:225,width:1035,height:605,opacity:hideCanvas?0:1}}><EngineeringCanvas time={12} mode={t>10?'light':'design'} edit={progress(t,6,9)} electricalEdit={progress(t,21,24)} refineEdits={refineEdits}/></div>
 </div>
 </Frame>};
const DeliveryScene=()=>{const t=LocalTime();return <Frame>
 <div style={{position:'absolute',left:100,top:75,display:'flex',gap:40,alignItems:'center'}}><Logo/><span style={{fontSize:27}}>Baya Works</span><span style={{fontSize:23,color:C.muted,marginLeft:700}}>{PROJECT}</span></div>
 <div style={{position:'absolute',left:100,top:250}}><div style={{fontSize:75,letterSpacing:-3,color:C.green}}>Designs ready.</div><div style={{fontSize:28,color:C.muted,marginTop:25}}>Review package · Revision B</div>
 {['Lighting layout','Electrical layout','Calculation report','Fixture schedule'].map((v,i)=><div key={v} style={{fontSize:26,marginTop:23,opacity:progress(t,1+i*.6,1.6+i*.6)}}>{v} <span style={{color:C.muted,fontSize:18}}>PDF</span></div>)}
 <div style={{display:'inline-block',fontSize:26,color:C.bg,background:C.green,padding:'21px 30px',borderRadius:36,marginTop:45,scale:1-.025*Math.sin(progress(t,9,10)*Math.PI)}}>{t>10?'↓ Design package downloaded':'↓ Download Design Package'}</div>
 </div>
 <div style={{position:'absolute',left:830,top:240,width:940,height:650,border:`1px solid ${C.line}`,borderRadius:18,padding:35,background:'#EDE9DF08'}}><div style={{fontSize:26}}>Office floor · Lighting + electrical</div><div style={{height:510,marginTop:25}}><EngineeringCanvas time={15} mode="design" edit={1} electricalEdit={1}/></div></div>
 </Frame>};
const Ending=()=>{const t=LocalTime();return <Frame><div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',opacity:progress(t,0,1)}}><Logo width={300}/><div style={{fontSize:68,letterSpacing:-2,marginTop:55}}>Engineering, at the speed of <span style={{color:C.green}}>compute.</span></div></div></Frame>};
export const FullAnimatic=()=>{const {fps}=useVideoConfig();return <>
 <div style={{width:1920,height:1080,transform:'scale(.5)',transformOrigin:'top left'}}>
 <Sequence from={0} durationInFrames={12*fps} name="01 · Building intelligence"><EngineeringScene/></Sequence>
 <Sequence from={12*fps} durationInFrames={41*fps} name="02–04 · Works customer journey"><CustomerSection/></Sequence>
 <Sequence from={53*fps} durationInFrames={17*fps} name="05 · Engineering agent"><EngineeringScene inside/></Sequence>
 <Sequence from={70*fps} durationInFrames={27*fps} name="06 · Studio supervision"><StudioScene/></Sequence>
 <Sequence from={97*fps} durationInFrames={15*fps} name="07 · Designs ready"><DeliveryScene/></Sequence>
 <Sequence from={112*fps} durationInFrames={8*fps} name="08 · Closing"><Ending/></Sequence>
 </div>
 <Audio src={staticFile('sound/full-animatic.wav')} volume={.5}/>
 </>};
