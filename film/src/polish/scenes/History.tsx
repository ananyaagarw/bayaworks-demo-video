import React from 'react';
import {C, Kicker, Logo, MONO, PROJECT, SANS} from '../brand';
import {MaskLine, Rise, ease, p, useSeconds} from '../motion';
import {Activity, Icon, Pointer} from '../ui';
import {Cue} from '../sound';

// Project history in Baya Works: the record Baya keeps as the project moves.
// Revision B is assembled from the two Studio requests shown earlier in the film.
export const HISTORY = {insert: 1.9, approve: 4.7, click: 6.6};

const UPDATED = ['Lighting layout', 'Electrical layout', 'Calculation report', 'Fixture schedule'];
const PACKAGE: [string, string][] = [
	['Lighting layout', '.pdf .dwg'],
	['Electrical layout', '.pdf .dwg'],
	['BIM coordination model', '.ifc'],
	['Revit model', '.rvt'],
	['Fixture schedule', '.xlsx'],
	['Equipment schedule', '.xlsx'],
	['Calculation report', '.pdf'],
	['Bill of quantities', '.xlsx'],
];
const REV_B_HEIGHT = 262;

export const History: React.FC<{dur: number}> = ({dur}) => {
	const t = useSeconds();
	const {insert, approve, click} = HISTORY;
	const winIn = p(t, 0, 0.6) * (1 - p(t, dur - 0.45, dur, ease.leave));
	const push = p(t, insert, insert + 0.7, ease.glide);
	const approved = p(t, approve, approve + 0.35);
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
					opacity: winIn,
					translate: `0 ${(1 - p(t, 0, 0.6)) * 12}px`,
				}}
			>
				{/* Header, identical to the customer journey */}
				<div style={{height: 100, display: 'flex', alignItems: 'center', gap: 28, padding: '0 44px', borderBottom: `1px solid ${C.rule}`}}>
					<Logo width={128} />
					<div style={{width: 1, height: 30, background: C.rule}} />
					<span style={{fontSize: 26, fontWeight: 500, letterSpacing: '-0.015em'}}>Baya Works</span>
					<span style={{marginLeft: 'auto', fontSize: 21, color: C.sand3}}>Your engineering team, in one conversation.</span>
				</div>

				{/* Sidebar: the project, with its history as a natural part of it */}
				<div style={{position: 'absolute', left: 0, top: 100, bottom: 0, width: 270, borderRight: `1px solid ${C.rule}`, padding: '40px 28px', boxSizing: 'border-box'}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 10, height: 54, padding: '0 20px', borderRadius: 27, border: `1px solid ${C.accent}`, color: C.accent, fontSize: 21, fontWeight: 500}}>
						<Icon.Plus size={20} />
						New Project
					</div>
					<Kicker size={13} style={{marginTop: 48, marginBottom: 20}}>
						Projects
					</Kicker>
					<div style={{borderLeft: `2px solid ${C.accent}`, paddingLeft: 16, fontSize: 21, lineHeight: 1.45}}>
						Office floor
						<div style={{fontSize: 17, color: C.sand3}}>Level 02</div>
					</div>
					<div style={{marginTop: 18, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 14, fontSize: 18}}>
						<span style={{color: C.sand3}}>Conversation</span>
						<span style={{display: 'flex', alignItems: 'center', gap: 10, marginLeft: -16}}>
							<span style={{width: 6, height: 6, borderRadius: 3, background: C.accent}} />
							Project history
						</span>
						<span style={{color: C.sand3}}>Design package</span>
					</div>
					<div style={{position: 'absolute', left: 28, bottom: 34, display: 'flex', alignItems: 'center', gap: 10, color: C.sand3, fontSize: 18}}>
						<svg width="16" height="18" viewBox="0 0 16 18" fill="none" stroke="currentColor" strokeWidth="1.3">
							<path d="M2 1.5h8l4 4v11H2Z" />
							<path d="M5 9h6M5 12h6" />
						</svg>
						Company standards
					</div>
				</div>

				{/* Record */}
				<div style={{position: 'absolute', left: 326, top: 140, width: 900, bottom: 40}}>
					<Rise t={t} at={0.25} dur={0.7} y={8}>
						<Kicker color={C.accent}>Project history · {PROJECT}</Kicker>
					</Rise>
					<MaskLine t={t} at={0.35} dur={0.9} style={{marginTop: 12}}>
						<div style={{fontSize: 46, letterSpacing: '-0.03em', lineHeight: 1.08}}>Every file. Every decision. Every revision.</div>
					</MaskLine>

					<div style={{position: 'absolute', top: 132, left: 0, right: 0}}>
						{/* Revision B arrives at the top of the record */}
						{t >= insert ? (
							<div style={{position: 'absolute', top: 0, left: 0, right: 0, opacity: p(t, insert + 0.2, insert + 0.75), translate: `0 ${(1 - p(t, insert + 0.2, insert + 0.85)) * -10}px`}}>
								<Entry
									meta="Revision B"
									revision
									title="Lighting and electrical updated"
									status={
										<Status t={t} approve={approve}>
											{approved > 0.5 ? 'Approved' : 'In review'}
										</Status>
									}
								>
									<Row t={t} at={insert + 0.55} label="Engineer">
										‘Move the meeting room lights away from the projector zone…’
									</Row>
									<Row t={t} at={insert + 0.77} label="Engineer">
										‘Add outlets along the workstation wall…’
									</Row>
									<Row t={t} at={insert + 0.99} label="Updated">
										<span style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>
											{UPDATED.map((f) => (
												<span key={f} style={{fontSize: 16, color: C.sand, padding: '3px 10px', borderRadius: 7, border: `1px solid ${C.ruleStrong}`}}>
													{f}
												</span>
											))}
										</span>
									</Row>
									<Row t={t} at={insert + 1.21} label="Decision">
										Meeting room fixtures kept clear of the projector zone.
									</Row>
								</Entry>
							</div>
						) : null}

						{/* Earlier record moves down to make room */}
						<div style={{translate: `0 ${push * REV_B_HEIGHT}px`}}>
							<Rise t={t} at={0.75} dur={0.6} y={10}>
								<Entry meta="Revision A" title="Lighting and electrical design by Baya" status={<Status t={t} approve={-1}>Reviewed</Status>}>
									<Row t={t} at={0.85} label="Design">
										Fixtures placed · Devices laid out · Circuits developed · Calculations run
									</Row>
									<Row t={t} at={0.95} label="Assumption">
										Ceiling heights taken from the architectural model.
									</Row>
								</Entry>
							</Rise>
							<Rise t={t} at={0.87} dur={0.6} y={10}>
								<Entry meta="Input" title="Specifications.pdf, version 2" status={<Status t={t} approve={-1}>Applied</Status>} />
							</Rise>
							<Rise t={t} at={0.97} dur={0.6} y={10}>
								<Entry meta="Decision" title="Company standards for fixture selection" />
							</Rise>
							<Rise t={t} at={1.07} dur={0.6} y={10}>
								<Entry meta="Project inputs" title="Architectural model, drawings and requirements" last />
							</Rise>
						</div>
					</div>
				</div>

				{/* Current package */}
				<Rise t={t} at={0.6} dur={0.8} y={12} style={{position: 'absolute', right: 44, top: 140, width: 430, bottom: 40}}>
					<div style={{position: 'absolute', left: -36, top: 0, bottom: 0, width: 1, background: C.rule}} />
					<Kicker size={13}>Current package</Kicker>
					<div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 12}}>
						<span style={{position: 'relative', fontSize: 36, letterSpacing: '-0.025em'}}>
							<span style={{opacity: 1 - p(t, insert + 0.3, insert + 0.6)}}>Revision A</span>
							<span style={{position: 'absolute', left: 0, opacity: p(t, insert + 0.45, insert + 0.8)}}>Revision B</span>
						</span>
						<Kicker size={13}>8 files</Kicker>
					</div>
					<div style={{marginTop: 20}}>
						{PACKAGE.map(([name, ext]) => {
							const u = UPDATED.indexOf(name);
							const k = u < 0 ? 0 : p(t, insert + 1.3 + u * 0.25, insert + 1.65 + u * 0.25);
							return (
								<div key={name} style={{display: 'flex', alignItems: 'center', height: 42, borderBottom: `1px solid ${C.rule}`, fontSize: 19}}>
									<span style={{flex: 1}}>{name}</span>
									{u >= 0 ? (
										<span style={{fontFamily: MONO, fontSize: 11, letterSpacing: '.1em', color: C.accent, background: 'rgba(184,214,161,.1)', padding: '3px 8px', borderRadius: 5, marginRight: 14, opacity: k, translate: `${(1 - k) * 6}px 0`}}>
											UPDATED
										</span>
									) : null}
									<span style={{fontFamily: MONO, fontSize: 13, color: C.accent, width: 74, textAlign: 'right'}}>{ext}</span>
								</div>
							);
						})}
					</div>
					<div style={{marginTop: 26, display: 'flex', flexDirection: 'column', gap: 12, fontSize: 19}}>
						<Approval t={t} at={approve + 0.1}>Reviewed by engineer</Approval>
						<Approval t={t} at={approve + 0.35}>Approved for issue</Approval>
					</div>
					<div
						style={{
							position: 'absolute',
							left: 0,
							right: 0,
							bottom: 0,
							height: 64,
							borderRadius: 32,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 12,
							background: C.button,
							color: C.bg,
							fontSize: 22,
							fontWeight: 500,
							opacity: 0.35 + 0.65 * approved,
							scale: String(1 - 0.03 * Math.max(0, 1 - Math.abs(t - click - 0.05) / 0.12)),
						}}
					>
						Open design package
						<Icon.Arrow size={20} />
					</div>
				</Rise>

				{t > 5.3 && t < click + 1.0 ? (
					<Pointer
						x={1380 + (1540 - 1380) * p(t, 5.5, 6.4, ease.glide)}
						y={640 + (902 - 640) * p(t, 5.5, 6.4, ease.glide)}
						t={t}
						click={click}
						opacity={p(t, 5.35, 5.6) * (1 - p(t, click + 0.4, click + 0.75))}
					/>
				) : null}
			</div>

			<Cue at={0} src="sfx/window.wav" volume={0.32} />
			<Cue at={insert - 0.05} src="sfx/glide.wav" volume={0.26} />
			{[0, 1, 2, 3].map((i) => (
				<Cue key={i} at={insert + 0.55 + i * 0.22} src="sfx/place.wav" volume={0.1} />
			))}
			{[0, 1, 2, 3].map((i) => (
				<Cue key={`u${i}`} at={insert + 1.3 + i * 0.25} src="sfx/key1.wav" volume={0.12} />
			))}
			<Cue at={approve} src="sfx/resolve.wav" volume={0.24} />
			<Cue at={click} src="sfx/click.wav" volume={0.35} />
		</div>
	);
};

const Entry: React.FC<{meta: string; title: string; status?: React.ReactNode; revision?: boolean; last?: boolean; children?: React.ReactNode}> = ({meta, title, status, revision, last, children}) => (
	<div style={{position: 'relative', paddingLeft: 44, paddingBottom: children ? 26 : 20}}>
		{!last ? <div style={{position: 'absolute', left: 8, top: 22, bottom: -4, width: 1, background: C.rule}} /> : null}
		<div style={{position: 'absolute', left: 2, top: 5, width: 13, height: 13, borderRadius: 7, boxSizing: 'border-box', border: `1.3px solid ${revision ? C.accent : C.ruleStrong}`, background: revision ? C.accent : C.bg}} />
		<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
			<Kicker size={13} color={revision ? C.accent : C.sand3}>
				{meta}
			</Kicker>
			<div style={{marginLeft: 'auto'}}>{status}</div>
		</div>
		<div style={{fontSize: 25, letterSpacing: '-0.012em', marginTop: 4}}>{title}</div>
		{children ? <div style={{marginTop: 12}}>{children}</div> : null}
	</div>
);

const Row: React.FC<{t: number; at: number; label: string; children: React.ReactNode}> = ({t, at, label, children}) => {
	const k = p(t, at, at + 0.5);
	return (
		<div style={{display: 'flex', alignItems: 'baseline', minHeight: 36, opacity: k, translate: `0 ${(1 - k) * 6}px`}}>
			<span style={{width: 132, flexShrink: 0, fontFamily: MONO, fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: C.sand3}}>{label}</span>
			<span style={{fontSize: 19, lineHeight: 1.45, color: C.sand2}}>{children}</span>
		</div>
	);
};

const Status: React.FC<{t: number; approve: number; children: React.ReactNode}> = ({t, approve, children}) => {
	const live = approve > 0;
	const k = live ? p(t, approve, approve + 0.35) : 1;
	return (
		<span style={{display: 'flex', alignItems: 'center', gap: 8, fontFamily: MONO, fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', color: live && k > 0.5 ? C.accent : C.sand3, padding: '5px 12px 5px 9px', borderRadius: 999, border: `1px solid ${live && k > 0.5 ? 'rgba(184,214,161,.35)' : C.rule}`}}>
			{live ? <Activity t={t} start={approve - 2.5} done={approve} size={14} /> : <Icon.Check size={14} />}
			{children}
		</span>
	);
};

const Approval: React.FC<{t: number; at: number; children: React.ReactNode}> = ({t, at, children}) => {
	const k = p(t, at, at + 0.45);
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: 12, opacity: 0.25 + 0.75 * k, color: k > 0.5 ? C.sand : C.sand3}}>
			<span style={{color: C.accent, opacity: k}}>
				<Icon.Check size={20} k={p(t, at + 0.05, at + 0.4)} />
			</span>
			{children}
		</div>
	);
};
