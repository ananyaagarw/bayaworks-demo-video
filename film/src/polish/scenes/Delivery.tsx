import React from 'react';
import {C, Kicker, Logo, MONO, PROJECT, SANS} from '../brand';
import {MaskLine, Rise, ease, p, useSeconds} from '../motion';
import {Icon, Pointer} from '../ui';
import {Cue} from '../sound';

// The approved eight-file package, grouped by kind. Drawings are issued as PDF and DWG.
const GROUPS: {title: string; files: [string, string[]][]}[] = [
	{title: 'Drawings', files: [['Lighting layout', ['.pdf', '.dwg']], ['Electrical layout', ['.pdf', '.dwg']]]},
	{title: 'Models', files: [['BIM coordination model', ['.ifc']], ['Revit model', ['.rvt']]]},
	{title: 'Schedules and reports', files: [['Fixture schedule', ['.xlsx']], ['Equipment schedule', ['.xlsx']], ['Calculation report', ['.pdf']], ['Bill of quantities', ['.xlsx']]]},
];

export const DELIVERY = {click: 7.0, start: 7.4, done: 11.5};

export const Delivery: React.FC<{dur: number}> = ({dur}) => {
	const t = useSeconds();
	const {click, start, done} = DELIVERY;
	const out = p(t, dur - 0.45, dur, ease.leave);
	const preparing = p(t, click + 0.05, click + 0.35);
	const complete = p(t, done + 0.2, done + 0.55);
	const progress = p(t, start, done, ease.drift);
	let idx = 0;
	return (
		<div style={{position: 'absolute', inset: 0, background: `radial-gradient(1400px 900px at 70% 55%, #191310 0%, ${C.bg} 70%)`, color: C.sand, fontFamily: SANS}}>
			<div style={{position: 'absolute', inset: 0, opacity: 1 - out}}>
				{/* Header */}
				<Rise t={t} at={0} dur={0.7} y={0} style={{position: 'absolute', left: 120, right: 120, top: 64}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 28, height: 64}}>
						<Logo width={128} />
						<div style={{width: 1, height: 30, background: C.rule}} />
						<span style={{fontSize: 26, fontWeight: 500, letterSpacing: '-0.015em'}}>Baya Works</span>
						<span style={{marginLeft: 'auto', fontSize: 21, color: C.sand3}}>{PROJECT}</span>
					</div>
					<div style={{height: 1, background: C.rule, marginTop: 30}} />
				</Rise>

				{/* Left column */}
				<div style={{position: 'absolute', left: 120, top: 300, width: 700}}>
					<MaskLine t={t} at={0.3} dur={1.0}>
						<div style={{fontSize: 100, letterSpacing: '-0.045em', lineHeight: 1.02, color: C.accent, whiteSpace: 'nowrap'}}>Designs ready.</div>
					</MaskLine>
					<Rise t={t} at={0.85} dur={0.8} style={{marginTop: 26}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 14, fontSize: 30, letterSpacing: '-0.01em', color: C.sand2}}>
							Review package · Revision B
							<svg width="22" height="20" viewBox="0 0 22 20">
								<path d="M11 2 20 18H2Z" fill="none" stroke={C.accent} strokeWidth="1.3" />
								<text x="11" y="15.4" textAnchor="middle" fontFamily={MONO} fontSize="8.5" fill={C.accent}>
									B
								</text>
							</svg>
						</div>
					</Rise>
					<Rise t={t} at={1.6} dur={0.8} y={12} style={{marginTop: 150}}>
						<div
							style={{
								position: 'relative',
								width: 540,
								height: 84,
								borderRadius: 42,
								background: C.button,
								color: C.bg,
								fontSize: 26,
								fontWeight: 500,
								letterSpacing: '-0.01em',
								scale: String(1 - 0.025 * Math.max(0, 1 - Math.abs(t - click - 0.05) / 0.14)),
								boxShadow: `0 0 0 ${6 * complete}px rgba(168,196,146,${0.08 * complete})`,
							}}
						>
							<ButtonLabel k={(1 - preparing)}>
								<Icon.Down size={26} /> Download design package
							</ButtonLabel>
							<ButtonLabel k={preparing * (1 - complete)}>
								<Spinner t={t} /> Preparing your package…
							</ButtonLabel>
							<ButtonLabel k={complete}>
								<Icon.Check size={26} k={p(t, done + 0.3, done + 0.65)} /> Design package downloaded
							</ButtonLabel>
						</div>
					</Rise>
					{t >= click + 0.1 ? <Archive t={t} at={click + 0.15} progress={progress} done={done} /> : null}
				</div>

				{/* Package */}
				<Rise t={t} at={0.9} dur={0.9} y={14} style={{position: 'absolute', left: 860, right: 120, top: 250}}>
					<div style={{border: `1px solid ${C.rule}`, borderRadius: 22, background: 'rgba(237,233,223,.025)', padding: '34px 40px 22px'}}>
						<div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10}}>
							<span style={{fontSize: 30, letterSpacing: '-0.02em'}}>Design package</span>
							<Kicker size={14}>8 files</Kicker>
						</div>
						{GROUPS.map((g) => {
							const gi = idx++;
							return (
								<div key={g.title}>
									<Rise t={t} at={1.2 + gi * 0.13} dur={0.6} y={8} style={{marginTop: 26, marginBottom: 6}}>
										<Kicker size={13} color={C.accent}>
											{g.title}
										</Kicker>
									</Rise>
									{g.files.map(([name, exts]) => {
										const i = idx++;
										const fi = i - (GROUPS.findIndex((x) => x === g) + 1);
										const tick = p(t, start + 0.25 + fi * 0.46, start + 0.6 + fi * 0.46);
										return (
											<Rise key={name} t={t} at={1.2 + i * 0.13} dur={0.6} y={8}>
												<div style={{display: 'flex', alignItems: 'center', height: 58, borderBottom: `1px solid ${C.rule}`}}>
													<div style={{width: 34, color: C.accent, opacity: tick}}>
														<Icon.Check size={20} k={tick} />
													</div>
													<span style={{fontSize: 25, letterSpacing: '-0.01em', flex: 1}}>{name}</span>
													<div style={{display: 'flex', gap: 8}}>
														{exts.map((e) => (
															<span key={e} style={{fontFamily: MONO, fontSize: 15, letterSpacing: '.04em', color: C.accent, padding: '5px 10px', borderRadius: 8, border: '1px solid rgba(184,214,161,.22)'}}>
																{e}
															</span>
														))}
													</div>
												</div>
											</Rise>
										);
									})}
								</div>
							);
						})}
					</div>
				</Rise>

				{t > 5.4 && t < click + 1.2 ? (
					<Pointer
						x={560 + (400 - 560) * p(t, 5.6, 6.8, ease.glide)}
						y={1010 + (676 - 1010) * p(t, 5.6, 6.8, ease.glide)}
						t={t}
						click={click}
						opacity={p(t, 5.5, 5.8) * (1 - p(t, click + 0.5, click + 0.9))}
					/>
				) : null}
			</div>
			<Cue at={click} src="sfx/click.wav" volume={0.35} />
			{[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
				<Cue key={i} at={start + 0.3 + i * 0.46} src="sfx/place.wav" volume={0.11} />
			))}
			<Cue at={done + 0.15} src="sfx/complete.wav" volume={0.34} />
		</div>
	);
};

const ButtonLabel: React.FC<{k: number; children: React.ReactNode}> = ({k, children}) => (
	<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, opacity: k, translate: `0 ${(1 - k) * 4}px`}}>{children}</div>
);

const Spinner: React.FC<{t: number}> = ({t}) => (
	<svg width="24" height="24" viewBox="0 0 24 24">
		<circle cx="12" cy="12" r="9" fill="none" stroke="rgba(16,12,10,.25)" strokeWidth="2" />
		<circle cx="12" cy="12" r="9" fill="none" stroke={C.bg} strokeWidth="2" pathLength={1} strokeDasharray="0.26 1" strokeLinecap="round" transform={`rotate(${t * 320} 12 12)`} />
	</svg>
);

const Archive: React.FC<{t: number; at: number; progress: number; done: number}> = ({t, at, progress, done}) => {
	const k = p(t, at, at + 0.6);
	const fin = p(t, done + 0.15, done + 0.5);
	return (
		<div
			style={{
				marginTop: 22,
				width: 540,
				boxSizing: 'border-box',
				display: 'flex',
				alignItems: 'center',
				gap: 22,
				padding: '20px 24px',
				border: `1px solid ${C.rule}`,
				borderRadius: 18,
				background: C.panel,
				opacity: k,
				translate: `0 ${(1 - k) * 10}px`,
			}}
		>
			<svg width="60" height="60" viewBox="0 0 64 64" style={{flexShrink: 0}}>
				<circle cx="32" cy="32" r="27" fill="none" stroke={C.rule} strokeWidth="1.6" />
				<circle cx="32" cy="32" r="27" fill="none" stroke={C.accent} strokeWidth="1.6" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - progress} transform="rotate(-90 32 32)" strokeLinecap="round" />
				<text x="32" y="36.5" textAnchor="middle" fontFamily={MONO} fontSize="11.5" letterSpacing="1" fill={C.accent} opacity={1 - fin}>
					ZIP
				</text>
				<path d="m21 33 8 8 15-17" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p(t, done + 0.2, done + 0.6)} />
			</svg>
			<div style={{flex: 1}}>
				<div style={{fontSize: 21, letterSpacing: '-0.01em'}}>Office-Level-02-Review-B.zip</div>
				<div style={{position: 'relative', height: 26, marginTop: 8, fontSize: 20}}>
					<span style={{position: 'absolute', left: 0, color: C.sand3, opacity: 1 - fin}}>Preparing download…</span>
					<span style={{position: 'absolute', left: 0, color: C.accent, opacity: fin}}>Downloaded</span>
				</div>
			</div>
			<span style={{fontFamily: MONO, fontSize: 15, color: C.sand3, opacity: 1 - fin, width: 52, textAlign: 'right'}}>{Math.round(progress * 100)}%</span>
		</div>
	);
};

// Logo first, then the line. Holds still to the last frame.
export const Ending: React.FC<{dur: number}> = () => {
	const t = useSeconds();
	const k = p(t, 0.25, 1.6, ease.settle);
	return (
		<div style={{position: 'absolute', inset: 0, background: `radial-gradient(1100px 700px at 50% 48%, #1A1410 0%, ${C.bg} 72%)`, color: C.sand, fontFamily: SANS}}>
			<div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
				<div style={{opacity: k, filter: `blur(${(1 - k) * 6}px)`, scale: String(0.985 + 0.015 * k)}}>
					<Logo width={260} />
				</div>
				<MaskLine t={t} at={1.45} dur={1.0} style={{marginTop: 64}}>
					<div style={{fontSize: 66, letterSpacing: '-0.035em', lineHeight: 1.1}}>
						Engineering, at the speed of <span style={{color: C.accent}}>compute.</span>
					</div>
				</MaskLine>
				<div style={{height: 50}} />
			</div>
			<Cue at={0.2} src="sfx/chapter.wav" volume={0.2} />
		</div>
	);
};
