import React from 'react';
import {C, Logo, SANS} from '../brand';
import {MaskLine, Rise, ease, mix, p, useSeconds} from '../motion';
import {PlanModel} from '../plan/PlanModel';
import {Cue} from '../sound';

// 0:00 — the drawing is drafted, becomes a model, is designed, and lights up. One camera move throughout.
export const Opening: React.FC<{dur: number}> = ({dur}) => {
	const t = useSeconds();
	const cam = p(t, 0, 8.2, ease.glide);
	const drift = p(t, 8.2, dur, ease.linear);
	const camera = {
		rx: mix(4, 48, cam) + 2 * drift,
		rz: mix(-2, -20, cam) - 1.2 * drift,
		scale: mix(0.9, 1.0, cam) + 0.015 * drift,
		x: mix(330, 300, cam),
		y: mix(-10, -10, cam),
	};
	const state = {
		grid: p(t, 0.1, 1.3),
		shell: p(t, 0.2, 1.7, ease.glide),
		walls: p(t, 0.45, 2.6, ease.linear),
		furniture: p(t, 1.7, 2.9),
		labels: p(t, 2.1, 3.0),
		fixtures: p(t, 3.5, 5.5, ease.linear),
		power: p(t, 4.2, 5.7, ease.linear),
		circuits: p(t, 4.7, 6.8, ease.linear),
		lit: p(t, 6.4, 8.2, ease.drift),
	};
	const extrude = p(t, 2.3, 4.2, ease.glide);
	const out = p(t, dur - 0.45, dur, ease.leave);
	return (
		<div style={{position: 'absolute', inset: 0, background: C.bg, color: C.sand, fontFamily: SANS, overflow: 'hidden'}}>
			<div style={{position: 'absolute', inset: 0, opacity: 1 - out}}>
				<PlanModel state={state} extrude={extrude} camera={camera} />
				{/* Website-style scrim keeps the headline column quiet. */}
				<div
					style={{
						position: 'absolute',
						inset: 0,
						background:
							'linear-gradient(90deg, rgba(16,12,10,.97) 0%, rgba(16,12,10,.9) 26%, rgba(16,12,10,.35) 46%, rgba(16,12,10,0) 60%), linear-gradient(0deg, rgba(16,12,10,.85) 0%, rgba(16,12,10,0) 22%), linear-gradient(180deg, rgba(16,12,10,.7) 0%, rgba(16,12,10,0) 16%)',
					}}
				/>
				<Rise t={t} at={0.1} dur={0.8} y={0} style={{position: 'absolute', left: 120, top: 92}}>
					<Logo width={150} />
				</Rise>
				<div style={{position: 'absolute', left: 120, top: 370, width: 900}}>
					<MaskLine t={t} at={0.55} dur={1.0}>
						<div style={{fontSize: 92, lineHeight: 1.04, letterSpacing: '-0.04em'}}>Better engineering.</div>
					</MaskLine>
					<MaskLine t={t} at={0.72} dur={1.0}>
						<div style={{fontSize: 92, lineHeight: 1.04, letterSpacing: '-0.04em', color: C.accent}}>Faster delivery.</div>
					</MaskLine>
					<Rise t={t} at={1.5} dur={0.9} y={10} style={{marginTop: 44}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 18}}>
							<div style={{width: 36, height: 1.5, background: C.accent, opacity: 0.85}} />
							<div style={{fontSize: 30, letterSpacing: '-0.01em', color: C.sand2}}>AI-powered MEP design</div>
						</div>
					</Rise>
				</div>
			</div>
			<Cue at={0.4} src="sfx/mark.wav" volume={0.22} />
			<Cue at={2.2} src="sfx/glide.wav" volume={0.32} />
			{[0, 1, 2, 3, 4].map((i) => (
				<Cue key={i} at={3.6 + i * 0.4} src="sfx/place.wav" volume={0.1} />
			))}
			<Cue at={6.35} src="sfx/sweep.wav" volume={0.26} />
		</div>
	);
};
