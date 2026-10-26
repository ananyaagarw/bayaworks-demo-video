import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill,Sequence,interpolate,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {C,Frame,Logo,progress} from '../v2/system';
import {CustomerExperience} from '../v2/CustomerWorkflow';
import {EngineeringCanvas} from '../v2/EngineeringCanvas';
import {StudioScene} from '../v2/Animatic';
import {Delivery} from '../v3/FullDemo';
const useSeconds=()=>{const frame=useCurrentFrame();const {fps}=useVideoConfig();return frame/fps;};

/** A fixed shot composition, never an animated zoom or outgoing-scene effect. */
const CutCrop:React.FC<{children:React.ReactNode;scale?:number;x?:number;y?:number;cleanTop?:number;cleanLeft?:number;label?:string;isolateInput?:boolean}>=({children,scale=1,x=0,y=0,cleanTop=0,cleanLeft=0,label,isolateInput=false})=><AbsoluteFill style={{background:C.bg,overflow:'hidden',fontFamily:'Inter',color:C.sand}}><AbsoluteFill style={{clipPath:isolateInput?'inset(515px 470px 395px 165px round 22px)':'none'}}><div style={{position:'absolute',left:x,top:y,width:1920,height:1080,transform:`scale(${scale})`,transformOrigin:'top left'}}>{children}</div></AbsoluteFill>{cleanTop>0?<div style={{position:'absolute',inset:'0 0 auto',height:cleanTop,background:C.bg}}/>:null}{cleanLeft>0?<div style={{position:'absolute',inset:'0 auto 0 0',width:cleanLeft,background:C.bg}}/>:null}{label?<div style={{position:'absolute',left:120,top:65,display:'flex',alignItems:'center',gap:28}}><Logo width={125}/><span style={{fontSize:23,color:C.muted}}>{label}</span></div>:null}</AbsoluteFill>;

const Opening=()=>{const t=useSeconds();const cameraTime=Math.min(t,10);return <Frame>
 <div style={{position:'absolute',left:100,top:75}}><Logo/></div>
 <div style={{position:'absolute',left:100,top:235,width:650,opacity:.1+.9*progress(t,0,.8)}}><div style={{fontSize:69,lineHeight:1.12,letterSpacing:-3}}>Better engineering.<br/><span style={{color:C.green}}>Faster delivery.</span></div><div style={{fontSize:30,color:C.muted,lineHeight:1.5,marginTop:38}}>AI-powered MEP design,<br/>with engineers in control.</div></div>
 <div style={{position:'absolute',left:700,top:240,width:1100,height:650,transform:`perspective(1700px) rotateX(${24-12*progress(cameraTime,0,10)}deg) rotateZ(${-12+8*progress(cameraTime,0,10)}deg)`}}><EngineeringCanvas time={Math.min(t,10)} mode={t>7?'light':'design'}/></div>
 </Frame>};

const Chapter:React.FC<{kind:'works'|'studio'|'delivery'}>=({kind})=>{const t=useSeconds();return <Frame>
 <div style={{position:'absolute',left:100,top:75}}><Logo/></div>
 <div style={{position:'absolute',left:180,top:kind==='studio'?325:360,opacity:.15+.85*progress(t,0,.45)}}>
 {kind==='works'?<><div style={{fontSize:91,letterSpacing:-4}}>Baya <span style={{color:C.green}}>Works.</span></div><div style={{fontSize:38,lineHeight:1.5,color:C.muted,marginTop:32}}>Upload your drawings.<br/>We’ll take it from there.</div></>:null}
 {kind==='studio'?<><div style={{fontSize:32,color:C.muted,marginBottom:28}}>How does Baya deliver so fast?</div><div style={{fontSize:86,letterSpacing:-3}}>Inside <span style={{color:C.green}}>Baya Studio.</span></div><div style={{fontSize:38,color:C.muted,marginTop:35}}>Baya designs. Engineers direct.</div></>:null}
 {kind==='delivery'?<div style={{fontSize:82,lineHeight:1.15,letterSpacing:-3}}>From design<br/>to <span style={{color:C.green}}>delivery.</span></div>:null}
 </div>
 </Frame>};

const CustomerEdit=()=>{const t=useSeconds();const source=interpolate(t,[0,10,26,41],[0,9,18.5,30],{extrapolateRight:'clamp'});
 // Each crop is constant during its shot. Clock continuity survives every cut.
 const crop=t>=4&&t<8?{scale:1.5,x:-380,y:-800,isolateInput:true,label:'Baya Works · Project brief'}:t>=8&&t<10?{scale:1.45,x:-380,y:-400,cleanTop:80,cleanLeft:100}:t>=10&&t<17?{scale:1.35,x:-385,y:-100,cleanTop:150,cleanLeft:80,label:'Baya Works · Project files'}:t>=26&&t<34?{scale:1.45,x:-380,y:-400,cleanTop:80,cleanLeft:100}:{};
 return <CutCrop {...crop}><CustomerExperience time={source}/></CutCrop>;
};

const StudioEdit=()=>{const t=useSeconds();const source=t*.9;
 const crop=t>=3&&t<6.5?{scale:1.55,x:-78,y:-120}:t>=6.5&&t<13?{scale:2.8,x:-2120,y:-650}:t>=17&&t<22?{scale:1.55,x:-78,y:-120}:t>=22&&t<27?{scale:2.2,x:-2186,y:-758}:{};
 return <CutCrop {...crop}><StudioScene time={source} refineEdits/></CutCrop>;
};

const DeliveryEdit=()=>{const t=useSeconds();const crop=t>=4&&t<9?{scale:1.4,x:-786,y:-122}:t>=9&&t<15?{scale:1.25,x:0,y:-160}:{};return <CutCrop {...crop}><Delivery time={t} retainPackage refineEdits/></CutCrop>};

const Ending=()=>{const t=useSeconds();return <Frame><div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column'}}><div style={{opacity:.15+.85*progress(t,0,.65)}}><Logo width={300}/></div><div style={{fontSize:68,letterSpacing:-2,marginTop:55,opacity:progress(t,.45,1.25)}}>Engineering, at the speed of <span style={{color:C.green}}>compute.</span></div></div></Frame>};

export const FullDemoV4=()=>{const {fps}=useVideoConfig();return <>
 <Sequence from={0} durationInFrames={12*fps} name="01 · Engineering / hold"><Opening/></Sequence>
 <Sequence from={12*fps} durationInFrames={4*fps} name="02 · Works chapter / cut"><Chapter kind="works"/></Sequence>
 <Sequence from={16*fps} durationInFrames={41*fps} name="03 · Works / wide and selected details"><CustomerEdit/></Sequence>
 <Sequence from={57*fps} durationInFrames={5*fps} name="04 · Studio chapter / cut"><Chapter kind="studio"/></Sequence>
 <Sequence from={62*fps} durationInFrames={30*fps} name="05 · Studio / instruction and result"><StudioEdit/></Sequence>
 <Sequence from={92*fps} durationInFrames={2*fps} name="06 · Delivery chapter / cut"><Chapter kind="delivery"/></Sequence>
 <Sequence from={94*fps} durationInFrames={18*fps} name="07 · Designs ready / retained package"><DeliveryEdit/></Sequence>
 <Sequence from={112*fps} durationInFrames={8*fps} name="08 · Brand / clean hold"><Ending/></Sequence>
 <Audio src={staticFile('sound/full-v4.wav')} volume={1}/>
 </>};
