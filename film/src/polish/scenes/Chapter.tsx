import React from 'react';
import {C, Logo, SANS} from '../brand';
import {MaskLine, Rise, ease, p, useSeconds} from '../motion';

type Kind = 'works' | 'studio' | 'delivery';

const display: React.CSSProperties = {fontFamily: SANS, fontWeight: 400, letterSpacing: '-0.04em', lineHeight: 1.02, color: C.sand};
const sub: React.CSSProperties = {fontFamily: SANS, fontWeight: 400, fontSize: 34, letterSpacing: '-0.012em', lineHeight: 1.4, color: C.sand2};

// Centered chapter card. Lines rise from behind masks, hold still, then leave together.
export const Chapter: React.FC<{kind: Kind; dur: number}> = ({kind, dur}) => {
	const t = useSeconds();
	const out = dur - 0.55;
	const quick = kind === 'delivery';
	const marker = p(t, 0.05, 0.85, ease.settle) * (1 - p(t, out, out + 0.4, ease.leave));
	return (
		<div style={{position: 'absolute', inset: 0, color: C.sand, background: C.bg}}>
			{/* The background lift fades with the type, so cuts never step in brightness. */}
			<div style={{position: 'absolute', inset: 0, background: `radial-gradient(1200px 700px at 50% 52%, #1A1410 0%, ${C.bg} 70%)`, opacity: p(t, 0, 0.6) * (1 - p(t, out, out + 0.45))}} />
			<Rise t={t} at={0} dur={0.6} y={0} out={out} style={{position: 'absolute', left: 96, top: 72}}>
				<Logo width={132} />
			</Rise>
			<div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
				<div style={{width: 56, height: 1.5, background: C.accent, scale: `${marker} 1`, opacity: 0.85, marginBottom: 40}} />
				{kind === 'studio' ? (
					<>
						<MaskLine t={t} at={0.12} dur={0.8} out={out} style={{marginBottom: 26}}>
							<div style={{...sub, fontSize: 30, color: C.sand3}}>How does Baya deliver so fast?</div>
						</MaskLine>
						<MaskLine t={t} at={0.42} dur={1.0} out={out + 0.04}>
							<div style={{...display, fontSize: 108}}>
								Inside <span style={{color: C.accent}}>Baya Studio.</span>
							</div>
						</MaskLine>
						<MaskLine t={t} at={1.0} dur={0.85} out={out + 0.08} style={{marginTop: 30}}>
							<div style={sub}>Baya designs. Engineers direct.</div>
						</MaskLine>
					</>
				) : null}
				{kind === 'works' ? (
					<>
						<MaskLine t={t} at={0.2} dur={1.0} out={out}>
							<div style={{...display, fontSize: 116}}>
								Baya <span style={{color: C.accent}}>Works.</span>
							</div>
						</MaskLine>
						<MaskLine t={t} at={0.8} dur={0.85} out={out + 0.06} style={{marginTop: 30}}>
							<div style={sub}>Upload your drawings. We’ll take it from here.</div>
						</MaskLine>
					</>
				) : null}
				{quick ? (
					<MaskLine t={t} at={0.08} dur={0.75} out={out}>
						<div style={{...display, fontSize: 104}}>
							From design to <span style={{color: C.accent}}>delivery.</span>
						</div>
					</MaskLine>
				) : null}
				{/* Keeps the optical centre slightly above the geometric centre. */}
				<div style={{height: 40}} />
			</div>
		</div>
	);
};
