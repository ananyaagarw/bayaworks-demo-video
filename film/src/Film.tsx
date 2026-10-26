import {Audio} from '@remotion/media';
import React from 'react';
import {AbsoluteFill, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/fonts';
import rooms from './rooms.json';
import {palette as c} from './theme';

loadFont({family:'Inter',url:staticFile('brand/inter-400.woff2'),weight:'400'});
loadFont({family:'Inter',url:staticFile('brand/inter-500.woff2'),weight:'500'});
const ease=Easing.bezier(.22,1,.36,1);
const ramp=(f:number,a:number,b:number)=>interpolate(f,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:ease});
const S=23;
const labels:Record<string,string>={office:'Office',open_office:'Open studio',meeting_room:'Meeting',corridor:'Circulation',break_room:'Kitchen',restroom:'Washroom',electrical_room:'Electrical',telecom_room:'Comms',storage:'Storage',unknown:'Review needed'};
export const fixtureLayout=rooms.flatMap((r,i)=>{
 const [x0,y0]=r.boundary[0]; const [x1,y1]=r.boundary[2];
 if(r.classification.tag==='unknown')return [];
 // Cinematic lighting proposal, NOT the portal electrical device generator or a photometric solver.
 const nx=Math.max(1,Math.floor((x1-x0)/3)); const ny=Math.max(1,Math.floor((y1-y0)/3));
 return Array.from({length:nx*ny},(_,j)=>({room:r.id,x:(x0+(j%nx+.5)*(x1-x0)/nx)*S,y:(y0+(Math.floor(j/nx)+.5)*(y1-y0)/ny)*S,delay:6*30+i*3+j*1.4}));
});

const Furniture:React.FC=()=> <g stroke={c.sand} strokeWidth=".65" fill="none" opacity=".18">
 {rooms.flatMap((r,i)=>{const [x,y]=r.boundary[0];const [xx,yy]=r.boundary[2];if(['office','open_office'].includes(r.classification.tag))return Array.from({length:Math.max(1,Math.floor((xx-x)/3))},(_,j)=><g key={`${i}-${j}`} transform={`translate(${(x+1.1+j*3)*S} ${(y+3)*S})`}><rect width="35" height="60" rx="2"/><rect x="7" y="20" width="17" height="22"/><path d="M-9 16v28m53-28v28"/></g>);if(r.classification.tag==='meeting_room')return <g key={i}><rect x={(x+.9)*S} y={(y+2.4)*S} width={(xx-x-1.8)*S} height="86" rx="18"/>{[0,1,2].map(k=><path key={k} d={`M${(x+1.5+k)*S} ${(y+2.1)*S}v-8 M${(x+1.5+k)*S} ${(y+6.5)*S}v8`}/>)}</g>;return [];})}
 </g>;

export const ArchitecturalPlan:React.FC=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 const classify=ramp(f,3.1*fps,5.5*fps), photo=ramp(f,9.1*fps,10.5*fps);
 return <div style={{position:'absolute',left:744,top:325,width:1000,height:580,transformOrigin:'55% 50%',transform:`perspective(1800px) rotateX(${interpolate(f,[0,165,330],[33,17,8],{extrapolateRight:'clamp'})}deg) rotateZ(${interpolate(f,[0,165,330],[-17,-9,-4],{extrapolateRight:'clamp'})}deg) scale(${interpolate(f,[0,150,335],[1.21,1.02,1.03],{extrapolateRight:'clamp',easing:ease})})`,opacity:ramp(f,0,22)*(1-ramp(f,348,373))}}>
 <svg width="1080" height="640" viewBox="-45 -55 1080 640" style={{overflow:'visible'}}>
 <defs>
  <pattern id="grid" width={S} height={S} patternUnits="userSpaceOnUse"><path d={`M ${S} 0 H0 V${S}`} fill="none" stroke={c.sand} strokeWidth=".3" opacity=".1"/></pattern>
  <radialGradient id="field"><stop offset="0" stopColor="#E5E6B3" stopOpacity=".75"/><stop offset=".38" stopColor="#B8D6A1" stopOpacity=".48"/><stop offset="1" stopColor="#3E6B4E" stopOpacity="0"/></radialGradient>
  <linearGradient id="slab" x2="0" y2="1"><stop stopColor="#3B362C"/><stop offset="1" stopColor="#171711"/></linearGradient>
  {rooms.map(r=><clipPath key={r.id} id={r.id}><polygon points={r.boundary.map(p=>p.map(v=>v*S).join(',')).join(' ')}/></clipPath>)}
 </defs>
 <path d="M0 8H966V514H0Z" fill="url(#slab)" stroke="#514D3E"/>
 <rect width="966" height="506" fill="#171811"/>
 <rect x="-65" y="-65" width="1100" height="660" fill="url(#grid)"/>
 <g stroke={c.sand} strokeWidth=".8" fill="none" opacity=".35">
 <path d="M0-28H966 M0-38V-18 M966-38V-18 M-28 0V506 M-38 0H-18 M-38 506H-18"/>
 <text x="483" y="-36" textAnchor="middle" fill={c.sand} stroke="none" fontSize="12" letterSpacing="2">42 000</text>
 <text transform="translate(-38 253) rotate(-90)" textAnchor="middle" fill={c.sand} stroke="none" fontSize="12" letterSpacing="2">22 000</text>
 </g>
 {rooms.map((r,i)=>{const pts=r.boundary.map(p=>p.map(v=>v*S).join(',')).join(' ');const [x,y]=r.boundary[0];const [xx,yy]=r.boundary[2];const k=ramp(f,93+i*3,120+i*3);const unknown=r.classification.tag==='unknown';return <g key={r.id}>
 <polygon points={pts} fill={unknown?'#8E7454':c.sage} fillOpacity={k*.24} stroke={c.sand} strokeOpacity=".12" strokeWidth="7"/>
 <polygon points={pts} fill="none" stroke={unknown?'#C8AE83':c.sand} strokeWidth="1.3" pathLength="1" strokeDasharray="1" strokeDashoffset={1-ramp(f,8+i*1.8,55+i*1.8)}/>
 <g clipPath={`url(#${r.id})`} opacity={photo}>{fixtureLayout.filter(l=>l.room===r.id).map((l,j)=><ellipse key={j} cx={l.x} cy={l.y} rx="64" ry="63" fill="url(#field)"/>)}</g>
 <text x={(x+.4)*S} y={(yy-.5)*S} fontSize={xx-x<4?8:10} fill={unknown?'#D5BD97':c.sand} opacity={k*.8} letterSpacing="1">{labels[r.classification.tag].toUpperCase()}</text>
 <text x={(x+.4)*S} y={(y+.8)*S} fontSize="9" fill={c.sand} opacity={.28*(1-photo)}>{r.id}</text>
 </g>})}
 <Furniture/>
 <g opacity={classify*.45*(1-photo)} stroke={c.leaf} fill="none" strokeWidth=".6" strokeDasharray="3 6"><path d="M50 105H480 M50 105V230H480 M480 105H720 M480 230H720 M720 105V400"/>{[[50,105],[480,105],[480,230],[720,105],[720,400]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="4" fill={c.leaf}/>)}</g>
 {fixtureLayout.map((l,i)=>{const p=ramp(f,l.delay,l.delay+15);return <g key={i} transform={`translate(${l.x} ${l.y-14*(1-p)})`} opacity={p}>
 <circle r={10+18*(1-p)} stroke={c.leaf} fill="none" strokeWidth=".5" opacity={(1-p)*.8}/>
 <rect x="-6" y="-2" width="12" height="4" fill={c.leaf}/><path d="M-8-5H8V5H-8Z" fill="none" stroke={c.leaf} strokeWidth=".55"/>
 </g>})}
 <g transform="translate(1000 420)" opacity=".45" stroke={c.sand}><path d="M0 34V-10l-5 10M0-10l5 10" fill="none"/><text x="0" y="-18" textAnchor="middle" fill={c.sand} stroke="none" fontSize="11">N</text></g>
 </svg></div>;
};

const StoryTitle:React.FC<{index:string;eyebrow:string;line1:string;line2:string;detail:string}>=({index,eyebrow,line1,line2,detail})=>{
 const f=useCurrentFrame();return <div style={{position:'absolute',left:96,top:218,width:670,opacity:ramp(f,0,17)*(1-ramp(f,77,91)),translate:`0 ${22*(1-ramp(f,0,22))}px`}}>
 <div style={{fontSize:15,letterSpacing:4,color:c.leaf,marginBottom:32}}>{index} / {eyebrow}</div>
 <div style={{fontSize:83,lineHeight:1.04,letterSpacing:-5,fontWeight:400}}>{line1}<br/><span style={{color:c.leaf}}>{line2}</span></div>
 <div style={{marginTop:32,maxWidth:500,fontSize:22,lineHeight:1.55,color:'#B2B2A6'}}>{detail}</div>
 </div>;
};

const DesignBasis:React.FC=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 return <div style={{position:'absolute',left:98,top:661,width:465,opacity:ramp(f,4.3*fps,5*fps)*(1-ramp(f,345,361))}}>
 <div style={{height:1,background:c.rule,marginBottom:23}}/>
 <div style={{fontSize:13,letterSpacing:3,color:c.muted}}>DESIGN BASIS / PROPOSED</div>
 {[['Source geometry','Synthetic office · Rev A'],['Room interpretation','14 proposals / 1 needs review'],['Lighting layout','Concept study · not approved']].map(([a,b],i)=><div key={a} style={{display:'flex',justifyContent:'space-between',paddingTop:18,fontSize:16,opacity:ramp(f,140+i*8,157+i*8)}}><span style={{color:c.muted}}>{a}</span><span>{b}</span></div>)}
 </div>;
};

const EndCard:React.FC=()=>{const f=useCurrentFrame();return <AbsoluteFill style={{background:c.espresso,justifyContent:'center',alignItems:'center',opacity:ramp(f,0,20)}}>
 <Img src={staticFile('brand/bayaworks-mark.png')} style={{width:270,height:110,objectFit:'contain',marginBottom:28,filter:'hue-rotate(38deg) saturate(.3) brightness(.92)'}}/>

 <div style={{fontSize:67,letterSpacing:-2,marginTop:35}}>Engineering, at the speed of <span style={{color:c.leaf}}>compute.</span></div>
 <div style={{position:'absolute',bottom:85,fontSize:16,color:c.muted,letterSpacing:2}}>CINEMATIC PRODUCT STUDY / CREATIVE PROTOTYPE</div>
 </AbsoluteFill>};

export const Film:React.FC=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 return <AbsoluteFill style={{background:c.espresso,color:c.sand,fontFamily:'Inter',overflow:'hidden'}}>
 <Audio src={staticFile('sound/design-study.wav')} volume={.6}/>
 <AbsoluteFill style={{background:'radial-gradient(ellipse at 73% 58%, #27301F88 0%, #100C0A00 60%)'}}/>
 <div style={{position:'absolute',top:66,left:96,display:'flex',alignItems:'center',gap:16}}><Img src={staticFile('brand/bayaworks-mark.png')} style={{width:148,height:60,objectFit:'contain',filter:'hue-rotate(38deg) saturate(.3) brightness(.92)'}}/></div>
 <div style={{position:'absolute',right:96,top:86,fontSize:13,letterSpacing:3,color:c.muted}}>DESIGN INTELLIGENCE / 001</div>
 <ArchitecturalPlan/>
 <Sequence from={0} durationInFrames={3*fps} name="01 — Source geometry"><StoryTitle index="01" eyebrow="READ THE BUILDING" line1="Every line." line2="A possibility." detail="Architectural geometry becomes the starting point for engineering."/></Sequence>
 <Sequence from={3*fps} durationInFrames={3*fps} name="02 — Room interpretation"><StoryTitle index="02" eyebrow="STRUCTURE THE CONTEXT" line1="A building." line2="Understood." detail="Spaces, relationships and requirements. Uncertainty stays visible."/></Sequence>
 <Sequence from={6*fps} durationInFrames={3*fps} name="03 — Lighting proposal"><StoryTitle index="03" eyebrow="FROM RULES TO DESIGN" line1="Intent becomes" line2="a layout." detail="A spatial lighting proposal, prepared for an engineer’s judgement."/></Sequence>
 <Sequence from={9*fps} durationInFrames={3*fps} name="04 — Illustrative light study"><StoryTitle index="04" eyebrow="MAKE THE WORK VISIBLE" line1="See the light." line2="Then review." detail="Illustrative light distribution. A calculation is a separate, traceable step."/></Sequence>
 <DesignBasis/>
 <div style={{position:'absolute',left:96,right:96,bottom:62,display:'flex',justifyContent:'space-between',fontSize:14,color:c.muted,letterSpacing:1}}><span>SYNTHETIC GEOMETRY · CONCEPTUAL LIGHTING STUDY</span><span>{f<270?'ENGINEER REVIEW REQUIRED':'ILLUSTRATIVE · NOT A RADIANCE RESULT'}</span></div>
 <div style={{position:'absolute',left:96,right:96,bottom:38,height:1,background:c.rule}}><div style={{height:1,width:`${Math.min(100,f/420*100)}%`,background:c.leaf}}/></div>
 <Sequence from={12*fps} durationInFrames={2*fps} name="05 — Brand resolve"><EndCard/></Sequence>
 </AbsoluteFill>;
};
