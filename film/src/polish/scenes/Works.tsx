import React from 'react';
import {C, Kicker, Logo, MONO, PROJECT, SANS} from '../brand';
import {MaskLine, Rise, Stream, ease, p, streamEnd, typed, typingEnd, typingSchedule, useSeconds} from '../motion';
import {PlanCanvas, PLAN_ASPECT} from '../plan/PlanCanvas';
import {Activity, Composer, Icon, Pointer, Turn} from '../ui';
import {Cue} from '../sound';

// Approved copy.
const SCOPE = 'Electrical and lighting design for a new office floor.';
const STANDARD = 'Use our company standards.';
const FILES = [
	{name: 'Office-level-02.ifc', label: 'Architectural model', ext: 'IFC'},
	{name: 'Floor-plans.pdf', label: 'Architectural drawings', ext: 'PDF'},
	{name: 'Design-brief.pdf', label: 'Project requirements', ext: 'PDF'},
	{name: 'Specifications.pdf', label: 'Design specifications', ext: 'PDF'},
];
const CONTEXT = [
	{item: 'Architectural spaces', done: 'Connected'},
	{item: 'Project requirements', done: 'Connected'},
	{item: 'Company standards', done: 'Available'},
];
const A_ADD = 'Add your drawings and requirements. I’ll build the project context.';
const A_CONNECT = 'I’m connecting the building geometry with your project requirements.';
const A_ASK = 'Do you have preferred lighting manufacturers or fixture families?';
const A_ACK = 'I’ll use your company standards wherever applicable.';

// ---- Timeline (seconds from the start of the Works scene) ----
export const WORKS = (() => {
	const click = 2.0;
	const enter = 2.3;
	const q1 = 3.2;
	const type1 = 4.3;
	const send1 = typingEnd(SCOPE, type1, 27, 11) + 0.3;
	const upload = send1 + 2.1;
	const files = upload + 1.4;
	const fileAt = (i: number) => files + i * 0.32;
	const fileDone = (i: number) => fileAt(i) + 1.45 + i * 0.16;
	const connect = fileDone(3) + 1.0;
	const rowAt = (i: number) => connect + 0.55 + i * 0.45;
	const rowDone = (i: number) => connect + 1.9 + i * 0.6;
	const ask = rowDone(2) + 1.5;
	const type2 = ask + 2.5;
	const send2 = typingEnd(STANDARD, type2, 27, 5) + 0.3;
	const ack = send2 + 0.75;
	const prep = streamEnd(A_ACK, ack + 0.3, 10) + 0.35;
	const end = prep + 2.9;
	return {click, enter, q1, type1, send1, upload, files, fileAt, fileDone, connect, rowAt, rowDone, ask, type2, send2, ack, prep, end};
})();

const stageOut = (t: number, at: number) => ({
	opacity: 1 - p(t, at, at + 0.4, ease.leave),
	translate: `0 ${-24 * p(t, at, at + 0.6, ease.glide)}px`,
});

export const Works: React.FC<{dur: number}> = ({dur}) => {
	const t = useSeconds();
	const T = WORKS;
	const entered = t >= T.enter;
	const draft1 = t >= T.type1 && t < T.send1 ? typed(SCOPE, t, T.type1, 27, 11) : '';
	const draft2 = t >= T.type2 && t < T.send2 ? typed(STANDARD, t, T.type2, 27, 5) : '';
	const focus = Math.max(p(t, T.type1 - 0.35, T.type1) * (1 - p(t, T.send1, T.send1 + 0.3)), p(t, T.type2 - 0.35, T.type2) * (1 - p(t, T.send2, T.send2 + 0.3)));
	const press = t < T.type2 ? T.send1 : T.send2;
	const winIn = p(t, 0, 0.8);
	const out = p(t, dur - 0.4, dur, ease.leave);
	const buttonOn = p(t, T.click, T.click + 0.12) * (1 - p(t, T.click + 0.55, T.click + 0.9));
	const projectStage = t >= T.upload - 0.3;

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
					background: 'linear-gradient(160deg,#1C1611 0%,#15100C 70%)',
					boxShadow: '0 50px 120px rgba(0,0,0,.45)',
					overflow: 'hidden',
					opacity: winIn * (1 - out),
					translate: `0 ${(1 - winIn) * 16}px`,
				}}
			>
				{/* Header */}
				<div style={{height: 100, display: 'flex', alignItems: 'center', gap: 28, padding: '0 44px', borderBottom: `1px solid ${C.rule}`}}>
					<Logo width={128} />
					<div style={{width: 1, height: 30, background: C.rule}} />
					<span style={{fontSize: 26, fontWeight: 500, letterSpacing: '-0.015em'}}>Baya Works</span>
					<span style={{marginLeft: 'auto', fontSize: 21, color: C.sand3}}>Your engineering team, in one conversation.</span>
				</div>

				{/* Sidebar */}
				<div style={{position: 'absolute', left: 0, top: 100, bottom: 0, width: 270, borderRight: `1px solid ${C.rule}`, padding: '40px 28px', boxSizing: 'border-box'}}>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 10,
							height: 54,
							padding: '0 20px',
							borderRadius: 27,
							border: `1px solid ${C.accent}`,
							background: `rgba(168,196,146,${buttonOn})`,
							color: buttonOn > 0.5 ? C.bg : C.accent,
							fontSize: 21,
							fontWeight: 500,
							scale: String(1 - 0.03 * Math.max(0, 1 - Math.abs(t - T.click - 0.05) / 0.12)),
						}}
					>
						<Icon.Plus size={20} />
						New Project
					</div>
					<Kicker size={13} style={{marginTop: 48, marginBottom: 20}}>
						Projects
					</Kicker>
					<div style={{position: 'relative'}}>
						<div style={{fontSize: 19, color: C.sand3, lineHeight: 1.55, opacity: 1 - p(t, T.enter - 0.1, T.enter + 0.2)}}>Your next project starts here.</div>
						{entered ? (
							<Rise t={t} at={T.enter + 0.1} dur={0.6} y={8} style={{position: 'absolute', top: 0, left: 0, right: 0}}>
								<div style={{borderLeft: `2px solid ${C.accent}`, paddingLeft: 16, fontSize: 21, lineHeight: 1.45}}>
									Office floor
									<div style={{fontSize: 17, color: C.sand3}}>Level 02</div>
								</div>
							</Rise>
						) : null}
					</div>
					<div style={{position: 'absolute', left: 28, bottom: 34, display: 'flex', alignItems: 'center', gap: 10, color: C.sand3, fontSize: 18}}>
						<svg width="16" height="18" viewBox="0 0 16 18" fill="none" stroke="currentColor" strokeWidth="1.3">
							<path d="M2 1.5h8l4 4v11H2Z" />
							<path d="M5 9h6M5 12h6" />
						</svg>
						Company standards
					</div>
				</div>

				{/* Main column */}
				<div style={{position: 'absolute', left: 326, top: 140, width: 840, bottom: 40}}>
					{!entered || t < T.enter + 0.5 ? (
						<div style={{position: 'absolute', top: 190, left: 60, ...stageOut(t, T.enter - 0.15)}}>
							<MaskLine t={t} at={0.35} dur={0.9}>
								<div style={{fontSize: 76, letterSpacing: '-0.04em', lineHeight: 1.04}}>What will we</div>
							</MaskLine>
							<MaskLine t={t} at={0.5} dur={0.9}>
								<div style={{fontSize: 76, letterSpacing: '-0.04em', lineHeight: 1.04, color: C.accent}}>design next?</div>
							</MaskLine>
							<Rise t={t} at={0.95} dur={0.8} style={{marginTop: 30}}>
								<div style={{fontSize: 28, color: C.sand2}}>Bring your drawings. Start a conversation.</div>
							</Rise>
						</div>
					) : null}

					{entered ? (
						<>
							{/* Title block: crossfades from new project to the named project */}
							<div style={{position: 'relative', height: 96}}>
								<Rise t={t} at={T.enter + 0.25} dur={0.7} y={10} style={{position: 'absolute', inset: 0, opacity: 1 - p(t, T.upload - 0.3, T.upload)}}>
									<Kicker color={C.accent}>New project</Kicker>
									<div style={{fontSize: 46, letterSpacing: '-0.03em', marginTop: 12}}>Let’s build your next project.</div>
								</Rise>
								{projectStage ? (
									<Rise t={t} at={T.upload - 0.1} dur={0.7} y={10} style={{position: 'absolute', inset: 0}}>
										<Kicker color={C.accent}>Electrical + Lighting</Kicker>
										<div style={{fontSize: 46, letterSpacing: '-0.03em', marginTop: 12}}>{PROJECT}</div>
									</Rise>
								) : null}
							</div>

							<div style={{position: 'absolute', top: 150, left: 0, width: 800}}>
								{/* Stage 1: scope */}
								{t < T.upload + 0.4 ? (
									<div style={{position: 'absolute', inset: 0, ...stageOut(t, T.upload - 0.45)}}>
										<Turn t={t} at={T.q1} who="BAYA" width={760}>
											<Stream text="What are we designing today?" t={t} at={T.q1 + 0.15} wps={10} />
										</Turn>
										{t >= T.send1 ? (
											<div style={{marginTop: 44}}>
												<Turn t={t} at={T.send1 + 0.04} who="YOU" width={760}>
													{SCOPE}
												</Turn>
											</div>
										) : null}
									</div>
								) : null}

								{/* Stage 2: uploads and context */}
								{t >= T.upload && t < T.ask + 0.4 ? (
									<div style={{position: 'absolute', inset: 0, ...stageOut(t, T.ask - 0.45)}}>
										<Turn t={t} at={T.upload} who="BAYA" width={760} label={t >= T.connect - 0.2 ? <Activity t={t} start={T.connect - 0.1} done={T.rowDone(2) + 0.1} size={17} /> : null}>
											<span style={{position: 'relative', display: 'block'}}>
												<span style={{display: 'block', opacity: 1 - p(t, T.connect - 0.1, T.connect + 0.15)}}>
													<Stream text={A_ADD} t={t} at={T.upload + 0.2} wps={10} />
												</span>
												<span style={{position: 'absolute', left: 0, top: 0}}>
													<Stream text={A_CONNECT} t={t} at={T.connect + 0.05} wps={10} />
												</span>
											</span>
										</Turn>
										<div style={{position: 'relative', marginTop: 36}}>
											{t < T.connect + 0.5 ? (
												<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, width: 800, ...stageOut(t, T.connect - 0.05)}}>
													{FILES.map((f, i) => (
														<FileCard key={f.name} t={t} at={T.fileAt(i)} done={T.fileDone(i)} {...f} />
													))}
												</div>
											) : null}
											{t >= T.connect + 0.3 ? (
												<div style={{position: 'absolute', top: 0, left: 0, width: 740}}>
													{CONTEXT.map((c, i) => (
														<ContextRow key={c.item} t={t} at={T.rowAt(i)} done={T.rowDone(i)} item={c.item} status={c.done} />
													))}
												</div>
											) : null}
										</div>
									</div>
								) : null}

								{/* Stage 3: preferences */}
								{t >= T.ask - 0.1 ? (
									<div style={{position: 'absolute', inset: 0}}>
										<Turn t={t} at={T.ask} who="BAYA" width={780}>
											<Stream text={A_ASK} t={t} at={T.ask + 0.2} wps={10} />
										</Turn>
										{t >= T.send2 ? (
											<div style={{marginTop: 40}}>
												<Turn t={t} at={T.send2 + 0.04} who="YOU" width={760}>
													{STANDARD}
												</Turn>
											</div>
										) : null}
										{t >= T.ack ? (
											<div style={{marginTop: 40}}>
												<Turn t={t} at={T.ack} who="BAYA" width={780} label={<Activity t={t} start={T.ack + 0.05} done={T.ack + 0.25} size={17} />}>
													<Stream text={A_ACK} t={t} at={T.ack + 0.3} wps={10} />
												</Turn>
											</div>
										) : null}
									</div>
								) : null}
							</div>

							<div style={{position: 'absolute', left: 0, bottom: 0}}>
								<Rise t={t} at={T.enter + 0.35} dur={0.7} y={10}>
									<Composer t={t} text={draft1 || draft2} focus={focus} press={press} width={800} />
								</Rise>
							</div>
						</>
					) : null}
				</div>

				{/* Project context panel */}
				{t >= T.connect - 0.6 ? <ContextPanel t={t} at={T.connect - 0.5} prep={T.prep} /> : null}

				{t < T.click + 0.8 ? (
					<Pointer
						x={680 + (150 - 680) * p(t, 0.9, 1.9, ease.glide)}
						y={560 + (166 - 560) * p(t, 0.9, 1.9, ease.glide)}
						t={t}
						click={T.click}
						opacity={p(t, 0.75, 1.0) * (1 - p(t, T.click + 0.45, T.click + 0.75))}
					/>
				) : null}
			</div>

			<Cue at={0} src="sfx/window.wav" volume={0.4} />
			<Cue at={T.click} src="sfx/click.wav" volume={0.35} />
			<Keys text={SCOPE} start={T.type1} seed={11} />
			<Cue at={T.send1} src="sfx/send.wav" volume={0.3} />
			{FILES.map((f, i) => (
				<Cue key={f.name} at={T.fileAt(i)} src="sfx/upload.wav" volume={0.26} />
			))}
			<Cue at={T.fileDone(3) + 0.05} src="sfx/select.wav" volume={0.22} />
			{CONTEXT.map((c, i) => (
				<Cue key={c.item} at={T.rowDone(i)} src="sfx/place.wav" volume={0.18} />
			))}
			<Keys text={STANDARD} start={T.type2} seed={5} />
			<Cue at={T.send2} src="sfx/send.wav" volume={0.3} />
			<Cue at={T.prep} src="sfx/resolve.wav" volume={0.18} />
		</div>
	);
};

const Keys: React.FC<{text: string; start: number; seed: number}> = ({text, start, seed}) => {
	const {times} = typingSchedule(text, 27, seed);
	return (
		<>
			{times.map((tt, i) =>
				text[i] === ' ' || i % 2 === 1 ? null : <Cue key={i} at={start + tt} src={`sfx/key${(i * 7 + seed) % 4}.wav`} volume={0.16 + (0.08 * ((i * 13) % 5)) / 4} />,
			)}
		</>
	);
};

const DocBadge: React.FC<{ext: string; k: number}> = ({ext, k}) => (
	<div style={{position: 'relative', width: 48, height: 58, flexShrink: 0}}>
		<svg width="48" height="58" viewBox="0 0 48 58" style={{position: 'absolute', inset: 0}}>
			<path d="M1.5 1.5h31l14 14v41h-45Z" fill="rgba(237,233,223,.03)" stroke={k >= 1 ? 'rgba(184,214,161,.6)' : C.ruleStrong} strokeWidth="1.2" />
			<path d="M32.5 1.5v14h14" fill="none" stroke={k >= 1 ? 'rgba(184,214,161,.6)' : C.ruleStrong} strokeWidth="1.2" />
		</svg>
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 11, textAlign: 'center', fontFamily: MONO, fontSize: 12, letterSpacing: '.06em', color: C.accent}}>{ext}</div>
	</div>
);

const FileCard: React.FC<{t: number; at: number; done: number; name: string; label: string; ext: string}> = ({t, at, done, name, label, ext}) => {
	const k = p(t, at, at + 0.55);
	const prog = p(t, at + 0.15, done, ease.drift);
	const fin = p(t, done, done + 0.35);
	return (
		<div
			style={{
				opacity: k,
				translate: `0 ${(1 - k) * 14}px`,
				border: `1px solid ${C.rule}`,
				borderRadius: 16,
				padding: '20px 22px 18px',
				background: 'rgba(237,233,223,.025)',
			}}
		>
			<div style={{display: 'flex', alignItems: 'center', gap: 18}}>
				<DocBadge ext={ext} k={fin} />
				<div style={{flex: 1, minWidth: 0}}>
					<div style={{fontSize: 22, letterSpacing: '-0.01em'}}>{name}</div>
					<div style={{fontSize: 17, color: C.sand3, marginTop: 6}}>{label}</div>
				</div>
				<div style={{width: 24, color: C.accent, opacity: fin}}>
					<Icon.Check size={24} k={p(t, done + 0.05, done + 0.4)} />
				</div>
			</div>
			<div style={{height: 2, marginTop: 16, background: C.rule, borderRadius: 1, overflow: 'hidden', opacity: 1 - 0.6 * fin}}>
				<div style={{height: 2, width: `${prog * 100}%`, background: C.accent}} />
			</div>
		</div>
	);
};

const ContextRow: React.FC<{t: number; at: number; done: number; item: string; status: string}> = ({t, at, done, item, status}) => {
	const k = p(t, at, at + 0.5);
	const r = p(t, done, done + 0.35);
	return (
		<div style={{display: 'flex', alignItems: 'center', padding: '22px 0', borderBottom: `1px solid ${C.rule}`, opacity: k, translate: `0 ${(1 - k) * 8}px`}}>
			<span style={{fontSize: 26, letterSpacing: '-0.01em', flex: 1}}>{item}</span>
			<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
				<Activity t={t} start={at} done={done} size={18} />
				<span style={{position: 'relative', fontFamily: MONO, fontSize: 15, letterSpacing: '.1em', textTransform: 'uppercase', width: 124}}>
					<span style={{color: C.sand3, opacity: 1 - r}}>Reading</span>
					<span style={{position: 'absolute', left: 0, color: C.accent, opacity: r}}>{status}</span>
				</span>
			</div>
		</div>
	);
};

const ContextPanel: React.FC<{t: number; at: number; prep: number}> = ({t, at, prep}) => {
	const k = p(t, at, at + 0.8);
	const draw = p(t, at + 0.3, at + 2.6, ease.linear);
	return (
		<div style={{position: 'absolute', right: 44, top: 140, width: 410, bottom: 40, opacity: k, translate: `${(1 - k) * 16}px 0`}}>
			<div style={{position: 'absolute', left: -36, top: 0, bottom: 0, width: 1, background: C.rule}} />
			<Kicker size={13}>Project context</Kicker>
			<div style={{fontSize: 24, marginTop: 12, letterSpacing: '-0.01em'}}>{PROJECT}</div>
			<div style={{marginTop: 26, borderRadius: 14, border: `1px solid ${C.rule}`, background: '#120D0A', padding: '18px 14px'}}>
				<div style={{width: '100%', aspectRatio: String(PLAN_ASPECT)}}>
					<PlanCanvas
						id="context"
						strokeScale={1.7}
						state={{grid: draw, shell: p(t, at + 0.2, at + 1.4, ease.glide), walls: draw, labels: 0, furniture: p(t, at + 1.8, at + 2.8), fixtures: 0}}
					/>
				</div>
			</div>
			<div style={{marginTop: 26, paddingTop: 22, borderTop: `1px solid ${C.rule}`, fontSize: 20, lineHeight: 1.55, color: C.sand3}}>
				Architectural model
				<div style={{color: C.sand}}>Drawings and requirements</div>
			</div>
			{t >= prep ? (
				<Rise t={t} at={prep} dur={0.6} y={8} style={{marginTop: 34}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 12, color: C.accent, fontSize: 20}}>
						<Activity t={t} start={prep} done={prep + 100} size={17} />
						Preparing the first design
						<Icon.Arrow size={18} />
					</div>
				</Rise>
			) : null}
		</div>
	);
};
