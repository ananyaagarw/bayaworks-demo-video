// Product UI pieces shared by Baya Works and Baya Studio.
import React from 'react';
import {C, Kicker, MONO, SANS} from './brand';
import {ease, p} from './motion';

export const Icon = {
	Plus: ({size = 22, color = 'currentColor'}: {size?: number; color?: string}) => (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round">
			<path d="M12 5v14M5 12h14" />
		</svg>
	),
	Up: ({size = 22, color = 'currentColor'}: {size?: number; color?: string}) => (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
			<path d="M12 19V5M6.5 10.5 12 5l5.5 5.5" />
		</svg>
	),
	Down: ({size = 22, color = 'currentColor'}: {size?: number; color?: string}) => (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
			<path d="M12 4v13M6.5 11.5 12 17l5.5-5.5M5 20.5h14" />
		</svg>
	),
	Check: ({size = 22, color = 'currentColor', k = 1}: {size?: number; color?: string; k?: number}) => (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
			<path d="m5.5 12.5 4.2 4.2 8.8-9.4" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - k} />
		</svg>
	),
	Arrow: ({size = 18, color = 'currentColor'}: {size?: number; color?: string}) => (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
			<path d="M5 12h14M13.5 6.5 19 12l-5.5 5.5" />
		</svg>
	),
};

// Activity: a short arc orbiting a hairline ring; resolves into a check.
export const Activity: React.FC<{t: number; start: number; done: number; size?: number}> = ({t, start, done, size = 18}) => {
	const k = p(t, done, done + 0.35);
	const spin = (t - start) * 300;
	return (
		<svg width={size} height={size} viewBox="0 0 20 20" style={{display: 'block', opacity: p(t, start, start + 0.3)}}>
			<circle cx="10" cy="10" r="8.2" fill="none" stroke={C.accent} strokeOpacity={0.22 + 0.5 * k} strokeWidth="1.3" />
			<circle cx="10" cy="10" r="8.2" fill="none" stroke={C.accent} strokeWidth="1.3" pathLength={1} strokeDasharray={`${0.24 + 0.76 * k} 1`} transform={`rotate(${spin * (1 - k) - 90} 10 10)`} strokeLinecap="round" />
			<path d="m6.3 10.3 2.5 2.5 5-5.4" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p(t, done + 0.15, done + 0.5)} />
		</svg>
	);
};

export const TurnLabel: React.FC<{who: 'ENGINEER' | 'YOU' | 'BAYA'; children?: React.ReactNode}> = ({who, children}) => (
	<div style={{display: 'flex', alignItems: 'center', gap: 12, height: 20, marginBottom: 14}}>
		{who === 'BAYA' ? <div style={{width: 6, height: 6, borderRadius: 3, background: C.accent}} /> : null}
		<Kicker color={who === 'BAYA' ? C.accent : C.sand3}>{who}</Kicker>
		{children}
	</div>
);

export const bodyText: React.CSSProperties = {fontFamily: SANS, fontSize: 31, lineHeight: 1.42, letterSpacing: '-0.012em', color: C.sand};

// Message composer. Grows with its text, anchored to its bottom edge.
export const Composer: React.FC<{
	t: number;
	text: string;
	focus: number; // 0..1
	press?: number; // send press moment (seconds)
	width: number;
	placeholder?: string;
}> = ({t, text, focus, press = -10, width, placeholder = 'Message Baya…'}) => {
	const has = text.length > 0;
	const pr = Math.max(0, 1 - Math.abs(t - press - 0.06) / 0.14);
	const caretOn = Math.floor(t * 2.2) % 2 === 0 || has;
	return (
		<div
			style={{
				width,
				boxSizing: 'border-box',
				borderRadius: 22,
				padding: '20px 18px 20px 22px',
				background: '#1E1813',
				border: `1px solid ${focus > 0 ? `rgba(184,214,161,${0.12 + 0.38 * focus})` : C.rule}`,
				boxShadow: `0 0 0 ${4 * focus}px rgba(184,214,161,${0.05 * focus})`,
				display: 'flex',
				alignItems: 'flex-end',
				gap: 16,
			}}
		>
			<div style={{color: C.sand3, height: 44, display: 'grid', placeItems: 'center'}}>
				<Icon.Plus size={24} />
			</div>
			<div style={{flex: 1, fontFamily: SANS, fontSize: 25, lineHeight: 1.4, letterSpacing: '-0.01em', color: has ? C.sand : C.sand3, padding: '6px 0', minHeight: 35}}>
				{has ? text : focus > 0.5 ? '' : placeholder}
				{focus > 0.5 ? <span style={{display: 'inline-block', width: 2, height: 28, marginLeft: 2, translate: '0 5px', background: C.accent, opacity: caretOn ? 1 : 0}} /> : null}
			</div>
			<div
				style={{
					width: 44,
					height: 44,
					flexShrink: 0,
					borderRadius: 22,
					display: 'grid',
					placeItems: 'center',
					background: has || pr > 0 ? C.button : '#332B22',
					color: has || pr > 0 ? C.bg : C.sand3,
					scale: String(1 - 0.08 * pr),
				}}
			>
				<Icon.Up size={22} />
			</div>
		</div>
	);
};

// A sent/received message: settles in with a short rise.
export const Turn: React.FC<{t: number; at: number; who: 'ENGINEER' | 'YOU' | 'BAYA'; label?: React.ReactNode; children: React.ReactNode; out?: number; width?: number}> = ({
	t,
	at,
	who,
	label,
	children,
	out,
	width = 560,
}) => {
	const k = p(t, at, at + 0.55);
	const o = out === undefined ? 0 : p(t, out, out + 0.4, ease.leave);
	return (
		<div style={{width, opacity: k * (1 - o), translate: `0 ${(1 - k) * 10}px`}}>
			<TurnLabel who={who}>{label}</TurnLabel>
			<div style={bodyText}>{children}</div>
		</div>
	);
};

export const StatusChip: React.FC<{t: number; at: number; done: number; label: string; busy: string; ready: string}> = ({t, at, done, label, busy, ready}) => {
	const k = p(t, at, at + 0.45);
	const r = p(t, done, done + 0.4);
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '9px 16px 9px 12px', borderRadius: 999, background: 'rgba(16,12,10,.82)', border: `1px solid ${C.rule}`, opacity: k, translate: `0 ${(1 - k) * 6}px`}}>
			<Activity t={t} start={at} done={done} size={18} />
			<span style={{fontFamily: MONO, fontSize: 14, letterSpacing: '.1em', textTransform: 'uppercase', color: C.sand2}}>{label}</span>
			<span style={{position: 'relative', fontFamily: MONO, fontSize: 14, letterSpacing: '.1em', textTransform: 'uppercase', color: C.accent, minWidth: 128}}>
				<span style={{opacity: 1 - r}}>{busy}</span>
				<span style={{position: 'absolute', left: 0, opacity: r}}>{ready}</span>
			</span>
		</div>
	);
};

// Cursor with a restrained press: slight dip and a hairline ring.
export const Pointer: React.FC<{x: number; y: number; t: number; click: number; opacity?: number}> = ({x, y, t, click, opacity = 1}) => {
	const k = Math.max(0, Math.min(1, (t - click) / 0.45));
	const press = Math.max(0, 1 - Math.abs(t - click - 0.05) / 0.12);
	return (
		<div style={{position: 'absolute', left: x, top: y, opacity, pointerEvents: 'none'}}>
			{k > 0 && k < 1 ? (
				<div style={{position: 'absolute', left: -22 * (0.5 + k), top: -22 * (0.5 + k), width: 44 * (0.5 + k), height: 44 * (0.5 + k), borderRadius: '50%', border: `1.5px solid ${C.accent}`, opacity: 0.7 * (1 - k)}} />
			) : null}
			<svg width="28" height="36" viewBox="0 0 28 36" style={{display: 'block', scale: String(1 - 0.1 * press), transformOrigin: '2px 2px', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,.45))'}}>
				<path d="M2 2v26.5l7-7 6.2 11.6 4.4-2.4-6.1-11.2H23Z" fill={C.sand} stroke={C.bg} strokeWidth="1.6" strokeLinejoin="round" />
			</svg>
		</div>
	);
};
