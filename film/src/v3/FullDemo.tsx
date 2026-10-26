import React from 'react';
import {Audio} from '@remotion/media';
import {Sequence,interpolate,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {C,Frame,Logo,PROJECT,progress,Pointer} from '../v2/system';
import {CustomerExperience} from '../v2/CustomerWorkflow';
import {StudioScene} from '../v2/Animatic';
import {EngineeringCanvas} from '../v2/EngineeringCanvas';
import {DownloadArchive,PackagePreview} from './Package';
const useTime=()=>{const f=useCurrentFrame();const {fps}=useVideoConfig();return f/fps;};

export const OpeningToWorks:React.FC=()=>{
 const t=useTime(); const morph=progress(t,11.6,14.6);
 return <Frame>
 <div style={{opacity:progress(t,12.1,14.6)}}><CustomerExperience time={0} hideWelcome/></div>
 <div style={{position:'absolute',left:100,top:75,opacity:1-progress(t,11.8,13.4)}}><Logo/></div>
 <div style={{position:'absolute',left:100,top:235,width:650,opacity:progress(t,.15,1)*(1-progress(t,11.6,12.8)),translate:`0 ${18*(1-progress(t,.15,1.2))}px`}}>
 <div style={{fontSize:69,lineHeight:1.12,letterSpacing:-3}}>Better engineering.<br/><span style={{color:C.green}}>Faster delivery.</span></div>
 <div style={{fontSize:30,color:C.muted,lineHeight:1.5,marginTop:38,width:520}}>AI-powered MEP design,<br/>with engineers in control.</div>
 </div>
 <div style={{position:'absolute',left:375,top:360,width:775,opacity:progress(t,12,12.6)*(1-progress(t,14.2,15))}}><div style={{fontSize:57,letterSpacing:-2}}>Baya Works</div><div style={{fontSize:29,color:C.green,lineHeight:1.5,marginTop:25}}>Upload your drawings.<br/>We’ll take it from there.</div></div>
 <div style={{position:'absolute',left:700+(1390-700)*morph,top:240+(360-240)*morph,width:1100+(340-1100)*morph,height:650+(300-650)*morph,opacity:1-progress(t,14.55,15),transform:`perspective(1700px) rotateX(${(24-12*progress(t,0,10))*(1-morph)}deg) rotateZ(${(-12+8*progress(t,0,10))*(1-morph)}deg)`}}><EngineeringCanvas time={Math.min(t,12)} mode={t>7?'light':'design'}/></div>
 </Frame>;
};
const CustomerSection=()=>{const t=useTime();return <CustomerExperience time={interpolate(t,[0,10,26,41],[0,9,18.5,30],{extrapolateRight:'clamp'})}/>;};
export const WorksToStudio:React.FC=()=>{
 const t=useTime(); const p=progress(t,.7,6.5);
 return <Frame>
 <div style={{opacity:1-progress(t,3,6.8)}}><CustomerExperience time={29.99} hideContent/></div>
 <div style={{opacity:1-progress(t,.25,1.6)}}><CustomerExperience time={29.99}/></div>
 <div style={{opacity:progress(t,4,6.8)}}><StudioScene time={0} hideConversation/></div>
 <div style={{position:'absolute',left:375,top:305,width:440,opacity:progress(t,1.7,2.2)*(1-progress(t,5.2,6.8))}}>
 <div style={{fontSize:29,color:C.muted,marginBottom:30}}>How is Baya so fast?</div>
 <div style={{fontSize:44,lineHeight:1.12,letterSpacing:-1.5}}>Behind Baya Works<br/>is <span style={{color:C.green}}>Baya Studio.</span></div>
 <div style={{fontSize:37,lineHeight:1.3,marginTop:38}}>Baya designs.<br/>Engineers direct.</div>
 </div>
 <div style={{position:'absolute',left:1438+(775-1438)*p,top:475+(290-475)*p,width:350+(1035-350)*p,height:180+(605-180)*p,opacity:1-progress(t,6.3,7)}}><EngineeringCanvas time={12} mode={p>.75?'light':'design'}/></div>
 </Frame>;
};
export const StudioToDelivery:React.FC=()=>{
 const t=useTime();const p=progress(t,.8,5.5);
 return <Frame>
 <div style={{opacity:1-progress(t,3.7,5.8)}}><StudioScene time={26.99} hideConversation hideCanvas/></div>
 <div style={{opacity:1-progress(t,1.2,2.2)}}><StudioScene time={26.99}/></div>
 <div style={{opacity:progress(t,3.7,6)}}><Delivery time={0} hideCopy/></div>
 <div style={{position:'absolute',left:110,top:250,width:610,fontSize:58,lineHeight:1.15,letterSpacing:-2,opacity:progress(t,2,2.6)*(1-progress(t,4.6,5.8))}}>From engineering<br/>to <span style={{color:C.green}}>delivery.</span></div>
 <div style={{position:'absolute',left:775+(660-775)*p,top:290+(260-290)*p,width:1035+(1090-1035)*p,height:605+(610-605)*p,opacity:1-progress(t,3.5,5.4),transform:`scale(${1-.13*p}) translateY(${-35*p}px)`}}><EngineeringCanvas time={15} mode="light" edit={1} electricalEdit={1}/></div>
 {[0,1,2].map(i=><div key={i} style={{position:'absolute',left:800+i*185,top:430+i*24,width:310,height:220,border:`1px solid ${C.green}`,borderRadius:14,background:C.panel,opacity:progress(t,2+i*.25,3+i*.25)*(1-progress(t,4.4,5.7)),transform:`translate(${(i-1)*p*55}px,${-p*75}px) rotate(${(i-1)*5}deg)`}}><div style={{height:150,padding:14}}><EngineeringCanvas time={15} mode={i===1?'light':'design'} edit={1} electricalEdit={1} discipline={i===1?'lighting':'electrical'}/></div><div style={{fontSize:19,paddingLeft:20,color:C.green}}>{['Electrical layout','Lighting layout','Engineering package'][i]}</div></div>)}
 </Frame>;
};
export const Delivery:React.FC<{time?:number;hideCopy?:boolean;retainPackage?:boolean;refineEdits?:boolean}>=({time,hideCopy=false,retainPackage=false,refineEdits=false})=>{
 const local=useTime();const t=time??local;const clicked=t>=9.3;const complete=t>=14.5;
 return <Frame>
 <div style={{position:'absolute',left:95,top:70,right:95,display:'flex',gap:38,alignItems:'center'}}><Logo width={148}/><span style={{fontSize:28}}>Baya Works</span><span style={{marginLeft:'auto',fontSize:24,color:C.muted}}>{PROJECT}</span></div>
 <div style={{position:'absolute',left:100,top:245,width:490,opacity:hideCopy?0:1}}>
 <div style={{fontSize:69,letterSpacing:-3,lineHeight:1.1,color:C.green}}>Designs ready.</div>
 <div style={{fontSize:27,color:C.muted,marginTop:27}}>Review package · Revision B</div>
 <div style={{fontSize:31,lineHeight:1.4,marginTop:55,width:405}}>One coordinated package.<br/><span style={{color:C.muted}}>Built around your workflow.</span></div>
 <div style={{position:'relative',display:'inline-flex',alignItems:'center',justifyContent:'center',height:85,width:455,fontSize:25,color:C.bg,background:C.green,borderRadius:45,marginTop:70,scale:1-.025*Math.sin(progress(t,9,9.5)*Math.PI)}}>
 {complete?<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.7" style={{marginRight:12}}><path d="m4 12 5 5L20 6"/></svg>:<span style={{marginRight:12}}>↓</span>}{complete?'Design package downloaded':clicked?'Preparing your package…':'Download Design Package'}
 </div>
 {!retainPackage?<div style={{marginTop:25,fontSize:20,color:C.muted,opacity:progress(t,14.5,15.3)}}>Your review files, together.</div>:<div style={{position:'absolute',left:0,top:460}}><DownloadArchive time={t} compact/></div>}
 </div>
 <div style={{position:'absolute',left:690,top:230}}><PackagePreview time={t} retainCards={retainPackage} refineEdits={refineEdits}/>{!retainPackage?<DownloadArchive time={t}/>:null}</div>
 {t>8&&t<10?<Pointer x={450-65*progress(t,8,9)} y={710-72*progress(t,8,9)} click={progress(t,9,9.5)} opacity={1-progress(t,9.5,10)}/>:null}
 </Frame>;
};
export const ConnectedEnding:React.FC=()=>{
 const t=useTime();return <Frame>
 <div style={{opacity:1-progress(t,.15,2.5),filter:`blur(${12*progress(t,.2,2.5)}px)`,scale:1-.03*progress(t,0,2.5)}}><Delivery time={17.99}/></div>
 <svg width="1920" height="1080" style={{position:'absolute',inset:0,opacity:1-progress(t,3,4.1)}}><path d="M1245 485C1450 485 1545 300 1400 250L525 250Q460 250 460 320L460 750Q460 820 530 820L1370 820Q1440 820 1440 750L1440 390Q1440 320 1370 320C1100 320 1120 560 960 495" fill="none" stroke={C.green} strokeWidth="1.6" pathLength="1" strokeDasharray="1" strokeDashoffset={1-progress(t,.15,2.9)}/></svg>
 <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',opacity:progress(t,1.7,3.2),translate:`0 ${10*(1-progress(t,1.7,3.2))}px`}}><Logo width={300}/><div style={{fontSize:68,letterSpacing:-2,marginTop:55,opacity:progress(t,2.4,3.7)}}>Engineering, at the speed of <span style={{color:C.green}}>compute.</span></div></div>
 </Frame>;
};
export const FullDemoV3=()=>{const {fps}=useVideoConfig();return <>
 <Sequence from={0} durationInFrames={15*fps} name="01 · Better engineering to Works"><OpeningToWorks/></Sequence>
 <Sequence from={15*fps} durationInFrames={41*fps} name="02 · Preserved customer workflow"><CustomerSection/></Sequence>
 <Sequence from={56*fps} durationInFrames={7*fps} name="03 · Works to Studio"><WorksToStudio/></Sequence>
 <Sequence from={63*fps} durationInFrames={27*fps} name="04 · Preserved Studio interaction"><StudioScene/></Sequence>
 <Sequence from={90*fps} durationInFrames={6*fps} name="05 · Engineering becomes delivery"><StudioToDelivery/></Sequence>
 <Sequence from={96*fps} durationInFrames={18*fps} name="06 · Package and download"><Delivery/></Sequence>
 <Sequence from={114*fps} durationInFrames={6*fps} name="07 · Package to brand"><ConnectedEnding/></Sequence>
 <Audio src={staticFile('sound/full-v3.wav')} volume={.6}/>
 </>};
