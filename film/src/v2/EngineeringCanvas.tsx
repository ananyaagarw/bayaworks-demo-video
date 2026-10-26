import React from 'react';
import rooms from '../rooms.json';
import {C,progress} from './system';
export const EngineeringCanvas:React.FC<{time:number;mode?:'source'|'design'|'light';edit?:number;electricalEdit?:number;discipline?:'lighting'|'electrical'|'combined';refineEdits?:boolean}>=({time,mode='design',edit=0,electricalEdit=0,discipline='combined',refineEdits=false})=>{
 const lights=mode!=='source'; const luminaires=lights&&discipline!=='electrical'; const electrical=lights&&discipline!=='lighting'; const uid=React.useId().replace(/[^a-zA-Z0-9_-]/g,'');
 return <svg viewBox="-20 -25 1048 590" style={{width:'100%',height:'100%',overflow:'visible'}}>
 <defs><radialGradient id={`v2Light-${uid}`}><stop stopColor="#DAE2BC" stopOpacity=".6"/><stop offset="1" stopColor={C.sage} stopOpacity="0"/></radialGradient></defs>
 <g stroke={C.sand} fill="none"><path d="M0 0H966V506H0Z" fill="#191D14" strokeOpacity=".28" strokeWidth="6"/>
 {rooms.map((r,i)=>{const points=r.boundary.map(p=>p.map(v=>v*23).join(',')).join(' ');const [x,y]=r.boundary[0];const [xx,yy]=r.boundary[2];const p=progress(time,.1+i*.055,.6+i*.055);const isMeeting=r.id==='R-204';const nx=Math.max(1,Math.floor((xx-x)/3));const ny=Math.max(1,Math.floor((yy-y)/3));return <g key={r.id} opacity={p}>
 <clipPath id={`v2-${uid}-${r.id}`}><polygon points={points}/></clipPath>
 <polygon points={points} fill={isMeeting&&edit>0?C.sage:'none'} fillOpacity=".3" strokeOpacity=".7" strokeWidth="1.2"/>
 {luminaires&&r.classification.tag!=='unknown'?Array.from({length:nx*ny},(_,j)=>{const cx=(x+(j%nx+.5)*(xx-x)/nx)*23;const cy=(y+(Math.floor(j/nx)+.5)*(yy-y)/ny)*23+(isMeeting?edit*(refineEdits?((3.5+Math.floor(j/nx)*2.25)*23-(Math.floor(j/nx)+.5)*(yy-y)/ny*23):20):0);return <g key={j} opacity={progress(time,2+i*.055+j*.02,2.5+i*.055+j*.02)} clipPath={`url(#v2-${uid}-${r.id})`}>{mode==='light'?<ellipse cx={cx} cy={cy} rx="64" ry="60" fill={`url(#v2Light-${uid})`} stroke="none"/>:null}<rect x={cx-6} y={cy-2} width="12" height="4" fill={C.green} stroke="none"/></g>}):null}
 {electrical?<g stroke={C.green} strokeWidth="1" opacity={progress(time,3+i*.05,3.5+i*.05)}><circle cx={(x+.4)*23} cy={(y+1)*23} r="4"/><path d={`M${(x+.4)*23-6} ${(y+1)*23}h12`}/><rect x={(x+.4)*23-3} y={(yy-1)*23} width="6" height="6"/>
 <path d={`M${(x+.4)*23} ${(y+1)*23}v${(yy-y-2)*23}h${(xx-x-.8)*23}`} strokeDasharray="4 4" opacity=".5"/>
 </g>:null}
 <text x={(x+.35)*23} y={(yy-.35)*23} fontSize="10" stroke="none" fill={C.sand} opacity=".6">{r.name.replace('OPEN PLAN WORKSPACE','OPEN OFFICE').replace('OPEN PLAN SOUTH','SOUTH STUDIO')}</text>
 </g>})}
 {electrical?<g opacity={progress(time,4,5)} stroke={C.green} strokeWidth="1.5"><path d="M350 325H480V230H850 M350 325V400H850" strokeDasharray="800" strokeDashoffset={800*(1-progress(time,4,7))}/><rect x="334" y="310" width="30" height="38" fill={C.bg}/><text x="349" y="299" textAnchor="middle" stroke="none" fill={C.green} fontSize="11">LP-2A</text></g>:null}
 {electrical&&electricalEdit>0?<g stroke={C.green} fill={C.green} opacity={electricalEdit}>{[0,1,2,3].map(j=>refineEdits?<g key={j} transform={`translate(${650+j*60} 275)`} opacity={progress(electricalEdit,j*.15,j*.15+.1)}><circle r="5" fill="none"/><path d="M-2-6V6M2-6V6"/></g>:<circle key={j} cx={650+j*60} cy={275} r="5"/>)}<path d="M480 230V275H830" fill="none" pathLength="1" strokeDasharray={refineEdits?1:'4 4'} strokeDashoffset={refineEdits?1-electricalEdit:0}/></g>:null}
 {edit>0?<g stroke={C.green} opacity={edit}><path d="M245 25H375V65H245Z" fill={C.bg} strokeDasharray="4 4"/><text x="310" y="51" textAnchor="middle" fill={C.green} stroke="none" fontSize="10">PROJECTOR ZONE</text></g>:null}
 </g></svg>;
};
