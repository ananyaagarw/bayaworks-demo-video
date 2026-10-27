import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import {C,Frame,Logo,progress} from './system';
const useSeconds=()=>{const frame=useCurrentFrame();const {fps}=useVideoConfig();return frame/fps;};

// Only the chapter cards, retained ZIP status, and ending requested from v4.
export const Chapter:React.FC<{kind:'works'|'studio'|'delivery'}>=({kind})=>{const t=useSeconds();return <Frame>
 <div style={{position:'absolute',left:100,top:75}}><Logo/></div>
 <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',opacity:.15+.85*progress(t,0,.45)}}>
 {kind==='works'?<><div style={{fontSize:91,letterSpacing:-4}}>Baya <span style={{color:C.green}}>Works.</span></div><div style={{fontSize:38,lineHeight:1.5,color:C.muted,marginTop:32}}>Upload your drawings. We’ll take it from here.</div></>:null}
 {kind==='studio'?<><div style={{fontSize:32,color:C.muted,marginBottom:28}}>How does Baya deliver so fast?</div><div style={{fontSize:86,letterSpacing:-3}}>Inside <span style={{color:C.green}}>Baya Studio.</span></div><div style={{fontSize:38,color:C.muted,marginTop:35}}>Baya designs. Engineers direct.</div></>:null}
 {kind==='delivery'?<div style={{fontSize:82,lineHeight:1.15,letterSpacing:-3}}>From design to <span style={{color:C.green}}>delivery.</span></div>:null}
 </div>
 </Frame>};

export const DownloadArchive:React.FC<{time:number}>=({time:t})=>{
 const done=progress(t,14,14.8);
 return <div style={{display:'flex',alignItems:'center',gap:20,padding:'22px 20px',width:455,boxSizing:'border-box',border:`1px solid ${C.line}`,borderRadius:18,background:C.panel,opacity:progress(t,9.3,9.6)}}>
 <svg width="58" height="58" viewBox="0 0 64 64" style={{flexShrink:0}}><circle cx="32" cy="32" r="27" fill="none" stroke={C.line} strokeWidth="1.5"/><circle cx="32" cy="32" r="27" fill="none" stroke={C.green} strokeWidth="1.5" pathLength="1" strokeDasharray="1" strokeDashoffset={1-progress(t,9.6,14.2)} transform="rotate(-90 32 32)"/><path d="m19 33 9 9 18-21" stroke={C.green} strokeWidth="2" fill="none" pathLength="1" strokeDasharray="1" strokeDashoffset={1-done} opacity={done}/><text x="32" y="37" textAnchor="middle" fill={C.green} fontSize="12" opacity={1-done}>ZIP</text></svg>
 <div><div style={{fontSize:18}}>Office-Level-02-Review-B.zip</div><div style={{fontSize:22,color:C.green,marginTop:9}}>{t<14.5?'Preparing download…':'Downloaded'}</div></div>
 </div>;

};

export const Ending=()=>{const t=useSeconds();return <Frame><div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column'}}><div style={{opacity:.15+.85*progress(t,0,.65)}}><Logo width={300}/></div><div style={{fontSize:68,letterSpacing:-2,marginTop:55,opacity:progress(t,.45,1.25)}}>Engineering, at the speed of <span style={{color:C.green}}>compute.</span></div></div></Frame>};
