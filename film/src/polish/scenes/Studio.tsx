import React from 'react';
import {C, Kicker, Logo, MONO, PROJECT, SANS} from '../brand';
import {Rise, Stream, ease, mix, p, streamEnd, typed, typingEnd, typingSchedule, useSeconds} from '../motion';
import {PlanCanvas, PLAN_ASPECT} from '../plan/PlanCanvas';
import {Activity, Composer, StatusChip, Turn} from '../ui';
import {Cue} from '../sound';

// ---- Timeline (seconds from the start of the Studio scene) ----
const I1 = 'Move the meeting room lights away from the projector zone and recalculate.';
const R1a = 'Moving the selected fixtures. The affected lighting study needs updating.';
const R1b = 'Layout updated. The lighting study is ready to review.';
const I2 = 'Add outlets along the workstation wall and update the circuit layout.';
const R2 = 'Outlets added. The circuit layout is updated.';

const T1 = (() => {
	const type = 1.0;
	const send = typingEnd(I1, type, 27, 3) + 0.3;
	const select = send + 0.45;
	const reply = send + 1.05;
	const move = send + 2.05;
	const moved = move + 1.9;
	const cloud = moved + 0.1;
	const pull = moved + 0.45;
	const sweep = pull + 0.75;
	const swept = sweep + 1.9;
	const reply2 = swept + 0.25;
	const tag = streamEnd(R1b, reply2 + 0.2, 10) + 0.15;
	return {type, send, select, reply, move, moved, cloud, pull, sweep, swept, reply2, tag};
})();
const E2 = 15; // second exchange begins
const T2 = (() => {
	const clear = E2 - 0.2;
	const type = E2 + 0.55;
	const send = typingEnd(I2, type, 27, 7) + 0.3;
	const focus = send + 0.3;
	const add = send + 1.0;
	const added = add + 1.6;
	const circuit = added - 0.3;
	const cloud = added + 0.9;
	const reply = send + 1.2;
	const done = cloud + 0.6;
	const tag = done + 0.2;
	return {clear, type, send, focus, add, added, circuit, cloud, reply, done, tag};
})();
export const STUDIO_TIMES = {T1, T2};

// Camera targets inside the plan (fractions of the drawing's view box).
const CONF_FOCUS = {x: 0.36, y: 0.294};
const WALL_FOCUS = {x: 0.74, y: 0.55};

export const Studio: React.FC<{dur: number}> = ({dur}) => {
	const t = useSeconds();
	const second = dur > E2 && t >= T2.clear;

	// Composer contents.
	const draft1 = t >= T1.type && t < T1.send ? typed(I1, t, T1.type, 27, 3) : '';
	const draft2 = second && t >= T2.type && t < T2.send ? typed(I2, t, T2.type, 27, 7) : '';
	const draft = draft1 || draft2;
	const focus = Math.max(p(t, T1.type - 0.35, T1.type) * (1 - p(t, T1.send, T1.send + 0.3)), second ? p(t, T2.type - 0.35, T2.type) * (1 - p(t, T2.send, T2.send + 0.3)) : 0);

	// Camera: focus on the room being edited, then return to the full floor for the study.
	const zoom1 = p(t, T1.send + 0.3, T1.move + 0.2, ease.glide) * (1 - p(t, T1.pull, T1.pull + 1.0, ease.glide));
	const zoom2 = second ? p(t, T2.focus, T2.add + 0.2, ease.glide) * (1 - p(t, T2.done + 0.4, T2.done + 1.6, ease.glide)) : 0;
	const zoom = 1 + 0.3 * zoom1 + 0.32 * zoom2;
	const origin = zoom2 > 0 ? WALL_FOCUS : CONF_FOCUS;

	const plan = {
		circuits: 1,
		power: 1,
		lit: p(t, T1.sweep, T1.swept, ease.drift),
		select: p(t, T1.select, T1.select + 0.45) * (1 - p(t, T1.moved + 0.2, T1.moved + 0.8)),
		projector: p(t, T1.select + 0.35, T1.select + 1.0),
		edit: p(t, T1.move, T1.moved, ease.linear),
		ghost: p(t, T1.move, T1.move + 0.3) * (1 - p(t, T1.swept - 0.4, T1.swept + 0.4)),
		cloud: p(t, T1.cloud, T1.cloud + 0.9, ease.glide),
		outletsAdded: second ? p(t, T2.add, T2.added, ease.linear) : 0,
		outletCircuit: second ? p(t, T2.circuit, T2.circuit + 1.0, ease.linear) : 0,
		outletCloud: second ? p(t, T2.cloud, T2.cloud + 0.8, ease.glide) : 0,
		dim: second ? 0.6 * p(t, T2.focus, T2.focus + 0.6) * (1 - p(t, T2.done + 0.4, T2.done + 1.6)) : 0,
	};

	const winIn = p(t, 0, 0.8) * (1 - p(t, dur - 0.45, dur, ease.leave));
	const thread1Out = dur > E2 ? T2.clear : undefined;

	return (
		<div style={{position: 'absolute', inset: 0, background: C.bg, color: C.sand, fontFamily: SANS}}>
			<div
				style={{
					position: 'absolute',
					left: 64,
					right: 64,
					top: 56,
					bottom: 56,
					borderRadius: 28,
					border: `1px solid ${C.rule}`,
					background: 'linear-gradient(180deg,#1B1511 0%,#16110D 100%)',
					boxShadow: '0 50px 120px rgba(0,0,0,.45)',
					overflow: 'hidden',
					opacity: winIn,
					translate: `0 ${(1 - winIn) * 16}px`,
				}}
			>
				{/* Header */}
				<div style={{height: 100, display: 'flex', alignItems: 'center', gap: 28, padding: '0 44px', borderBottom: `1px solid ${C.rule}`}}>
					<Logo width={128} />
					<div style={{width: 1, height: 30, background: C.rule}} />
					<span style={{fontFamily: SANS, fontSize: 26, fontWeight: 500, letterSpacing: '-0.015em'}}>Baya Studio</span>
					<span style={{marginLeft: 'auto', fontFamily: SANS, fontSize: 21, color: C.sand3}}>{PROJECT}</span>
				</div>

				{/* Conversation column */}
				<div style={{position: 'absolute', left: 48, top: 148, width: 600, bottom: 40}}>
					<Rise t={t} at={0.25} dur={0.8}>
						<div style={{fontFamily: SANS, fontSize: 48, letterSpacing: '-0.032em', lineHeight: 1.05}}>Direct the design.</div>
					</Rise>
					<div style={{position: 'absolute', top: 104, left: 0, right: 0}}>
						{/* Exchange 1 */}
						<div style={{opacity: thread1Out ? 1 - p(t, thread1Out, thread1Out + 0.45, ease.leave) : 1, translate: `0 ${thread1Out ? -40 * p(t, thread1Out, thread1Out + 0.6, ease.glide) : 0}px`}}>
							{t >= T1.send ? (
								<Turn t={t} at={T1.send + 0.04} who="ENGINEER">
									{I1}
								</Turn>
							) : null}
							{t >= T1.send + 0.35 ? (
								<div style={{marginTop: 44}}>
									<Turn t={t} at={T1.send + 0.35} who="BAYA" label={<Activity t={t} start={T1.send + 0.4} done={T1.reply2 - 0.15} size={17} />}>
										<span style={{position: 'relative', display: 'block'}}>
											<span style={{display: 'block', opacity: 1 - p(t, T1.reply2 - 0.05, T1.reply2 + 0.2)}}>
												<Stream text={R1a} t={t} at={T1.reply} wps={10} />
											</span>
											<span style={{position: 'absolute', left: 0, top: 0}}>
												<Stream text={R1b} t={t} at={T1.reply2 + 0.08} wps={10} />
											</span>
										</span>
									</Turn>
								</div>
							) : null}
							<ContextTag t={t} at={T1.tag} label="Meeting room · Lighting" />
						</div>
						{/* Exchange 2 */}
						{second ? (
							<div style={{position: 'absolute', top: 0, left: 0, right: 0}}>
								{t >= T2.send ? (
									<Turn t={t} at={T2.send + 0.04} who="ENGINEER">
										{I2}
									</Turn>
								) : null}
								{t >= T2.send + 0.35 ? (
									<div style={{marginTop: 44}}>
										<Turn t={t} at={T2.send + 0.35} who="BAYA" label={<Activity t={t} start={T2.send + 0.4} done={T2.done - 0.1} size={17} />}>
											<Stream text={R2} t={t} at={Math.max(T2.reply, T2.done - 0.6)} wps={10} />
										</Turn>
									</div>
								) : null}
								<ContextTag t={t} at={T2.tag} label="Workstation wall · Electrical" />
							</div>
						) : null}
					</div>
					<div style={{position: 'absolute', left: 0, bottom: 0}}>
						<Rise t={t} at={0.45} dur={0.7} y={10}>
							<Composer t={t} text={draft} focus={focus} press={draft2 || second ? T2.send : T1.send} width={600} />
						</Rise>
					</div>
				</div>

				{/* Drawing viewport */}
				<Rise t={t} at={0.35} dur={0.9} y={10} style={{position: 'absolute', left: 700, right: 40, top: 132, bottom: 40}}>
					<div style={{position: 'absolute', inset: 0, borderRadius: 18, border: `1px solid ${C.rule}`, background: '#120D0A', overflow: 'hidden'}}>
						<div style={{position: 'absolute', left: 0, right: 0, top: 64, bottom: 64, padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
							<div style={{width: '100%', aspectRatio: String(PLAN_ASPECT), scale: String(zoom), transformOrigin: `${origin.x * 100}% ${origin.y * 100}%`}}>
								<PlanCanvas id="studio" state={plan} strokeScale={1 / mix(1, zoom, 0.6)} />
							</div>
						</div>
						<div style={{position: 'absolute', left: 28, top: 26}}>
							<Kicker size={14}>Level 02 · Lighting + Power</Kicker>
						</div>
						<div style={{position: 'absolute', right: 22, top: 16}}>
							{t >= T1.sweep - 0.1 ? <StatusChip t={t} at={T1.sweep - 0.1} done={T1.swept} label="Lighting study" busy="Recalculating" ready="Updated" /> : null}
						</div>
						<Legend t={t} at={T1.swept + 0.2} />
					</div>
				</Rise>
			</div>

			{/* Sound cues tied to the same timeline */}
			<Cue at={0} src="sfx/window.wav" volume={0.5} />
			<Typing text={I1} start={T1.type} seed={3} />
			<Cue at={T1.send} src="sfx/send.wav" volume={0.32} />
			<Cue at={T1.select} src="sfx/select.wav" volume={0.32} />
			<Cue at={T1.move - 0.1} src="sfx/glide.wav" volume={0.42} />
			<Cue at={T1.cloud + 0.1} src="sfx/mark.wav" volume={0.3} />
			<Cue at={T1.sweep} src="sfx/sweep.wav" volume={0.3} />
			<Cue at={T1.swept} src="sfx/resolve.wav" volume={0.26} />
			{dur > E2 ? (
				<>
					<Typing text={I2} start={T2.type} seed={7} />
					<Cue at={T2.send} src="sfx/send.wav" volume={0.32} />
					{[0, 1, 2, 3, 4, 5].map((i) => (
						<Cue key={i} at={T2.add + (i / 8) * 1.6 * 1.33} src="sfx/place.wav" volume={0.26} />
					))}
					<Cue at={T2.done - 0.1} src="sfx/resolve.wav" volume={0.26} />
				</>
			) : null}
		</div>
	);
};

const ContextTag: React.FC<{t: number; at: number; label: string}> = ({t, at, label}) => {
	const k = p(t, at, at + 0.6);
	return (
		<div style={{marginTop: 40, width: 560, opacity: k}}>
			<div style={{height: 1, background: C.rule, scale: `${ease.settle(k)} 1`, transformOrigin: 'left'}} />
			<div style={{display: 'flex', alignItems: 'center', gap: 12, paddingTop: 20, translate: `0 ${(1 - k) * 6}px`}}>
				<svg width="14" height="14" viewBox="0 0 14 14">
					<path d="M7 1.5 12.6 11.5H1.4Z" fill="none" stroke={C.accent} strokeWidth="1.2" />
				</svg>
				<Kicker color={C.accent}>{label}</Kicker>
			</div>
		</div>
	);
};

const Legend: React.FC<{t: number; at: number}> = ({t, at}) => {
	const k = p(t, at, at + 0.6);
	const sw = ['rgba(143,174,125,.25)', 'rgba(160,190,140,.4)', 'rgba(190,214,170,.55)', 'rgba(215,230,201,.75)'];
	return (
		<div style={{position: 'absolute', right: 28, bottom: 24, display: 'flex', alignItems: 'center', gap: 14, opacity: k}}>
			<span style={{fontFamily: MONO, fontSize: 13, letterSpacing: '.12em', color: C.sand3}}>ILLUMINANCE</span>
			<span style={{fontFamily: MONO, fontSize: 13, color: C.sand3}}>LOW</span>
			<div style={{display: 'flex', gap: 3}}>
				{sw.map((c, i) => (
					<div key={i} style={{width: 26, height: 8, borderRadius: 1, background: c}} />
				))}
			</div>
			<span style={{fontFamily: MONO, fontSize: 13, color: C.sand3}}>HIGH</span>
		</div>
	);
};

// Soft key ticks following the exact typing schedule.
const Typing: React.FC<{text: string; start: number; seed: number}> = ({text, start, seed}) => {
	const {times} = typingSchedule(text, 27, seed);
	return (
		<>
			{times.map((tt, i) =>
				text[i] === ' ' || i % 2 === 1 ? null : <Cue key={i} at={start + tt} src={`sfx/key${(i * 7 + seed) % 4}.wav`} volume={0.16 + 0.08 * ((i * 13) % 5) / 4} />,
			)}
		</>
	);
};
