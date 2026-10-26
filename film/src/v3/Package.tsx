import React from 'react';
import {C,PROJECT,progress} from '../v2/system';
import {EngineeringCanvas} from '../v2/EngineeringCanvas';
import rooms from '../rooms.json';

const iso=(x:number,y:number,z=0)=>`${145+.27*x-.27*y},${48+.12*x+.12*y-z}`;
export const BIMPreview=()=> <svg viewBox="0 0 420 260" style={{width:'100%',height:'100%'}}>
 <polygon points={[iso(0,0),iso(966,0),iso(966,506),iso(0,506)].join(' ')} fill="#35412B" stroke={C.green} strokeWidth=".8"/>
 {rooms.map(r=><g key={r.id}>
  <polygon points={r.boundary.map(([x,y])=>iso(x*23,y*23)).join(' ')} fill={C.sage} fillOpacity=".4" stroke={C.green} strokeWidth=".45"/>
  {r.boundary.map((p,i)=>{const q=r.boundary[(i+1)%r.boundary.length];return <polygon key={i} points={[iso(p[0]*23,p[1]*23),iso(q[0]*23,q[1]*23),iso(q[0]*23,q[1]*23,32),iso(p[0]*23,p[1]*23,32)].join(' ')} fill={C.green} fillOpacity=".13" stroke={C.green} strokeOpacity=".55" strokeWidth=".65"/>})}
 </g>)}
 <path d={`M${iso(0,0,32)}L${iso(966,0,32)}L${iso(966,506,32)}L${iso(0,506,32)}Z`} fill="none" stroke={C.sand} strokeOpacity=".4" strokeWidth=".6"/>
 </svg>;

const Card:React.FC<{children:React.ReactNode;x:number;y:number;w:number;h:number;collapse:number;planned?:boolean}>=({children,x,y,w,h,collapse,planned=false})=>{
 const k=planned?0:collapse;
 return <div style={{position:'absolute',left:x,top:y,width:w,height:h,border:`1px solid ${C.line}`,borderRadius:19,background:'#201C14',padding:22,overflow:'hidden',boxSizing:'border-box',transformOrigin:'center',transform:`translate(${(560-x-w/2)*k}px,${(290-y-h/2)*k}px) scale(${1-.86*k})`,opacity:planned?1-.35*collapse:1-progress(collapse,.75,1)}}>{children}</div>;
};

export const PackagePreview:React.FC<{time:number;compact?:boolean;retainCards?:boolean;refineEdits?:boolean}>=({time:t,compact=false,retainCards=false,refineEdits=false})=>{
 const collapse=compact||retainCards?0:progress(t,9.3,11.7);
 return <div style={{width:1110,height:645,position:'relative'}}>
 <Card x={0} y={0} w={360} h={355} collapse={collapse}><div style={{fontSize:24}}>Electrical drawings</div><div style={{height:215,marginTop:10}}><EngineeringCanvas time={15} mode="design" edit={1} electricalEdit={1} discipline="electrical" refineEdits={refineEdits}/></div><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:21,color:C.green}}><span>.PDF</span><span style={{fontSize:17,color:C.muted}}>.DWG · Planned</span></div></Card>
 <Card x={377} y={0} w={360} h={355} collapse={collapse}><div style={{fontSize:24}}>Lighting drawings</div><div style={{height:215,marginTop:10}}><EngineeringCanvas time={15} mode="light" edit={1} discipline="lighting" refineEdits={refineEdits}/></div><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:21,color:C.green}}><span>.PDF</span><span style={{fontSize:17,color:C.muted}}>.DWG · Planned</span></div></Card>
 <Card x={754} y={0} w={356} h={355} collapse={collapse} planned><div style={{fontSize:24}}>BIM coordination</div><div style={{height:197}}><BIMPreview/></div><div style={{fontSize:26,color:C.green}}>.RVT / .IFC</div><div style={{fontSize:18,color:C.muted,marginTop:10}}>Planned model exports</div></Card>
 <Card x={0} y={373} w={360} h={190} collapse={collapse}><div style={{fontSize:19,color:C.green,letterSpacing:1}}>.PDF / .XLSX</div><div style={{fontSize:26,marginTop:24}}>Calculations</div><div style={{fontSize:17,color:C.muted,marginTop:12}}>Workbook export planned</div></Card>
 <Card x={377} y={373} w={360} h={190} collapse={collapse}><div style={{fontSize:19,color:C.green,letterSpacing:1}}>.XLSX</div><div style={{fontSize:25,marginTop:24,lineHeight:1.3}}>Fixture + equipment<br/>schedules</div></Card>
 <Card x={754} y={373} w={356} h={190} collapse={collapse}><div style={{fontSize:19,color:C.green,letterSpacing:1}}>.XLSX</div><div style={{fontSize:26,marginTop:24}}>Bill of quantities</div><div style={{fontSize:17,color:C.muted,marginTop:12}}>Revision-linked workbook</div></Card>
 <div style={{position:'absolute',left:0,bottom:20,color:C.muted,fontSize:18,opacity:1-collapse}}>Office floor / Revision B / Drawings · Calculations · Schedules</div>
 </div>;
};
export const DownloadArchive:React.FC<{time:number;compact?:boolean}>=({time:t,compact=false})=>{
 const show=progress(t,11.2,12); const done=progress(t,14,14.8);const amount=progress(t,11.8,14.2);
 if(compact)return <div style={{display:'flex',alignItems:'center',gap:20,padding:'22px 20px',width:455,boxSizing:'border-box',border:`1px solid ${C.line}`,borderRadius:18,background:C.panel,opacity:progress(t,9.3,9.6)}}>
 <svg width="58" height="58" viewBox="0 0 64 64" style={{flexShrink:0}}><circle cx="32" cy="32" r="27" fill="none" stroke={C.line} strokeWidth="1.5"/><circle cx="32" cy="32" r="27" fill="none" stroke={C.green} strokeWidth="1.5" pathLength="1" strokeDasharray="1" strokeDashoffset={1-progress(t,9.6,14.2)} transform="rotate(-90 32 32)"/><path d="m19 33 9 9 18-21" stroke={C.green} strokeWidth="2" fill="none" pathLength="1" strokeDasharray="1" strokeDashoffset={1-done} opacity={done}/><text x="32" y="37" textAnchor="middle" fill={C.green} fontSize="12" opacity={1-done}>ZIP</text></svg>
 <div><div style={{fontSize:18}}>Office-Level-02-Review-B.zip</div><div style={{fontSize:22,color:C.green,marginTop:9}}>{t<14.5?'Preparing download…':'Downloaded'}</div></div>
 </div>;

 return <div style={{position:'absolute',left:350,top:80,width:410,height:390,display:'flex',flexDirection:'column',alignItems:'center',opacity:show,scale:.94+.06*show}}>
 <div style={{position:'relative',width:158,height:185,border:`1px solid ${C.green}`,borderRadius:18,background:C.panel,boxShadow:'0 22px 70px #0006',display:'grid',placeItems:'center'}}>
 <svg width="115" height="115" viewBox="0 0 120 120" style={{position:'absolute'}}><circle cx="60" cy="60" r="48" fill="none" stroke={C.line} strokeWidth="2"/><circle cx="60" cy="60" r="48" fill="none" stroke={C.green} strokeWidth="2" pathLength="1" strokeDasharray="1" strokeDashoffset={1-amount} transform="rotate(-90 60 60)"/><path d="M39 61l15 15 29-32" fill="none" stroke={C.green} strokeWidth="3" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1-done} opacity={done}/></svg>
 <div style={{color:C.green,fontSize:25,opacity:1-done}}>.ZIP</div>
 </div>
 <div style={{fontSize:23,marginTop:25}}>Office-Level-02-Review-B.zip</div>
 <div style={{fontSize:25,color:C.green,marginTop:15}}>{t<14.5?'Preparing download…':'Downloaded'}</div>
 <div style={{fontSize:17,color:C.muted,marginTop:12}}>{PROJECT}</div>
 </div>;
};
