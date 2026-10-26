import React from 'react';
import {Audio} from '@remotion/media';
import {staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {Arrow,C,FILES,Frame,Logo,Pointer,PROJECT,progress,Turn,typed} from './system';
import {EngineeringCanvas} from './EngineeringCanvas';
const scope='Electrical and lighting design for a new office floor.';
const standard='Use our company standards.';
export const CustomerExperience:React.FC<{time:number;hideWelcome?:boolean;hideContent?:boolean}>=({time:t,hideWelcome=false,hideContent=false})=>{
 const entered=t>=2.25;const upload=t>=9;const processing=t>=13.2;const questions=t>=18.5;
 const draft=t>=4&&t<7?typed(scope,t,4,6.65):t>=22&&t<24.6?typed(standard,t,22,24.4):'';
 return <Frame>
 <div style={{position:'absolute',inset:'55px 64px',border:`1px solid ${C.line}`,borderRadius:30,background:'linear-gradient(130deg,#19160F,#100C0A 60%)',boxShadow:'0 40px 100px #0006',overflow:'hidden'}}>
 <div style={{height:110,display:'flex',alignItems:'center',gap:34,padding:'0 45px',borderBottom:`1px solid ${C.line}`}}><Logo width={142}/><div style={{height:32,width:1,background:C.line}}/><span style={{fontSize:27,letterSpacing:-.5}}>Baya Works</span><span style={{marginLeft:'auto',fontSize:21,color:C.muted}}>Your engineering team, in one conversation.</span></div>
 <aside style={{position:'absolute',left:0,top:110,bottom:0,width:255,borderRight:`1px solid ${C.line}`,padding:'45px 28px'}}>
 <div style={{padding:'17px 15px',borderRadius:30,border:`1px solid ${C.green}`,background:t>1.4&&t<2.25?C.green:'transparent',color:t>1.4&&t<2.25?C.bg:C.green,fontSize:23}}>＋ New Project</div>
 <div style={{fontSize:17,color:C.muted,marginTop:50,marginBottom:24}}>PROJECTS</div>
 {entered?<div style={{borderLeft:`2px solid ${C.green}`,paddingLeft:15,fontSize:22,lineHeight:1.55}}>Office floor<span style={{display:'block',color:C.muted,fontSize:18}}>Level 02</span></div>:<div style={{fontSize:19,color:C.muted,lineHeight:1.6}}>Your next project starts here.</div>}
 <div style={{position:'absolute',left:32,bottom:35,fontSize:18,color:C.muted}}>Firm Playbook</div>
 </aside>
 <main style={{position:'absolute',left:310,top:155,right:45,bottom:45,opacity:hideContent?0:1}}>
 {!entered&&!hideWelcome?<div style={{position:'absolute',top:180,left:90,opacity:1-progress(t,1.8,2.25)}}><div style={{fontSize:66,letterSpacing:-3,lineHeight:1.08}}>What will we<br/><span style={{color:C.green}}>design next?</span></div><div style={{fontSize:27,color:C.muted,marginTop:28}}>Bring your drawings. Start a conversation.</div></div>:null}
 {entered?<>
 <div style={{opacity:progress(t,2.25,2.8)}}><div style={{fontSize:18,color:C.green,letterSpacing:2,marginBottom:12}}>{upload?'ELECTRICAL + LIGHTING':'NEW PROJECT'}</div><h1 style={{fontSize:43,fontWeight:400,letterSpacing:-1.9,margin:0}}>{upload?PROJECT:'Let’s build your next project.'}</h1></div>
 <div style={{position:'absolute',top:140,left:0,width:850}}>
 {!upload?<><Turn who="BAYA" text="What are we designing today?" t={t} at={2.75}/>{t>=7?<div style={{marginTop:45}}><Turn who="YOU" text={scope} t={t} at={7}/></div>:null}</>:null}
 {upload&&!questions?<>
 <Turn who="BAYA" text={processing?'I’m connecting the building geometry with your project requirements.':'Add your drawings and requirements. I’ll build the project context.'} t={t} at={9} width={755}/>
 {!processing?<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginTop:32,width:785}}>{FILES.map((file,i)=>{const p=progress(t,9.7+i*.5,10.3+i*.5);const loaded=progress(t,10.5+i*.4,12.5+i*.2);return <div key={file.name} style={{opacity:p,translate:`${(1-p)*30}px ${(1-p)*12}px`,border:`1px solid ${C.line}`,borderRadius:18,padding:23,background:'#EDE9DF05'}}><div style={{display:'flex',gap:18,alignItems:'center'}}><div style={{fontSize:16,color:C.green,border:`1px solid ${C.line}`,padding:'15px 9px',borderRadius:7}}>{file.ext}</div><div><div style={{fontSize:21}}>{file.name}</div><div style={{fontSize:16,color:C.muted,marginTop:8}}>{file.label}</div></div></div><div style={{height:2,background:C.line,marginTop:20}}><div style={{height:2,width:`${loaded*100}%`,background:C.green}}/></div></div>})}</div>:<div style={{marginTop:45,width:730}}>{['Architectural spaces','Project requirements','Firm Playbook'].map((item,i)=><div key={item} style={{display:'flex',justifyContent:'space-between',padding:'20px 0',borderBottom:`1px solid ${C.line}`,fontSize:25,opacity:progress(t,13.4+i*.7,14+i*.7)}}><span>{item}</span><span style={{color:C.green}}>{t>15.8+i*.65?(i===2?'Available':'Connected'):'Reading…'}</span></div>)}</div>}
 </>:null}
 {questions?<>
 <Turn who="BAYA" text="Do you have preferred lighting manufacturers or fixture families?" t={t} at={18.5} width={780}/>
 {t>=24.6?<div style={{marginTop:34}}><Turn who="YOU" text={standard} t={t} at={24.6}/></div>:null}
 {t>=25.8?<div style={{marginTop:32}}><Turn who="BAYA" text="I’ll use your firm’s Playbook and flag any gaps for your engineer." t={t} at={25.8} width={780}/></div>:null}
 </>:null}
 </div>
 <div style={{position:'absolute',right:0,top:132,width:405,borderLeft:`1px solid ${C.line}`,paddingLeft:32,opacity:progress(t,12.9,13.8)}}>
 <div style={{fontSize:17,color:C.muted,letterSpacing:1}}>PROJECT CONTEXT</div><div style={{fontSize:24,marginTop:18}}>Office floor · Level 02</div>
 <div style={{height:265,marginTop:28,transform:`perspective(1000px) rotateX(${12*(1-progress(t,14,18))}deg)`}}><EngineeringCanvas time={Math.max(0,t-13)} mode="source"/></div>
 <div style={{borderTop:`1px solid ${C.line}`,paddingTop:23,fontSize:20,lineHeight:1.5,color:C.muted}}>Architectural model<br/><span style={{color:C.sand}}>Drawings and requirements</span></div>
 <div style={{marginTop:35,fontSize:19,color:C.green,opacity:progress(t,27.5,28.5)}}>Preparing the first design →</div>
 </div>
 <div style={{position:'absolute',left:0,bottom:0,width:835,border:`1px solid ${draft?C.green:C.line}`,borderRadius:24,padding:'23px 25px',background:'#201B14',display:'flex',gap:20,minHeight:90,alignItems:'center'}}>
 <span style={{fontSize:32,color:C.muted}}>＋</span><span style={{fontSize:25,lineHeight:1.35,flex:1,color:draft?C.sand:C.muted}}>{draft||'Message Baya…'}{draft?<span style={{opacity:Math.floor(t*3)%2?1:.35,color:C.green}}>│</span>:null}</span><div style={{background:draft?C.green:'#38382D',borderRadius:'50%',width:46,height:46,display:'grid',placeItems:'center',color:C.bg}}><Arrow/></div>
 </div>
 </>:null}
 </main>
 {t<2.25&&!hideWelcome?<Pointer x={interpolatePointer(t,600,145)} y={interpolatePointer(t,500,201)} click={Math.max(0,Math.min(1,(t-1.35)/.5))}/>:null}
 </div>
 </Frame>;
};
const interpolatePointer=(t:number,a:number,b:number)=>a+(b-a)*progress(t,.3,1.3);
export const CustomerWorkflow:React.FC=()=>{const f=useCurrentFrame();const {fps}=useVideoConfig();return <><CustomerExperience time={f/fps}/><Audio src={staticFile('sound/customer-workflow.wav')} volume={.7}/></>};
