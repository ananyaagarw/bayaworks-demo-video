// One motion language for the whole film: a few named curves, used everywhere.
import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export const ease = {
	// Entrances: fast departure, long soft landing.
	settle: Easing.bezier(0.16, 1, 0.3, 1),
	// Objects moving within a scene (fixtures, camera): symmetric, weighted.
	glide: Easing.bezier(0.65, 0, 0.35, 1),
	// Exits: leave gently, accelerate away.
	leave: Easing.bezier(0.5, 0, 0.75, 0),
	// Ambient/long camera drift.
	drift: Easing.bezier(0.45, 0, 0.55, 1),
	linear: Easing.linear,
};

export const p = (t: number, a: number, b: number, easing: (n: number) => number = ease.settle) =>
	interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing});

export const mix = (a: number, b: number, k: number) => a + (b - a) * k;

export const useSeconds = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return frame / fps;
};

// Entrance + optional exit: opacity with a short rise. No bounce, no scale.
export const Rise: React.FC<{
	t: number;
	at: number;
	dur?: number;
	y?: number;
	out?: number;
	outDur?: number;
	style?: React.CSSProperties;
	children: React.ReactNode;
}> = ({t, at, dur = 0.7, y = 14, out, outDur = 0.35, style, children}) => {
	const k = p(t, at, at + dur);
	const o = out === undefined ? 0 : p(t, out, out + outDur, ease.leave);
	return (
		<div style={{opacity: k * (1 - o), translate: `0 ${(1 - k) * y - o * 8}px`, ...style}}>{children}</div>
	);
};

// Typographic line reveal: the line rises into place from behind a mask.
export const MaskLine: React.FC<{
	t: number;
	at: number;
	dur?: number;
	out?: number;
	outDur?: number;
	style?: React.CSSProperties;
	children: React.ReactNode;
}> = ({t, at, dur = 0.9, out, outDur = 0.4, style, children}) => {
	const k = p(t, at, at + dur);
	const o = out === undefined ? 0 : p(t, out, out + outDur, ease.leave);
	return (
		// Extra bottom padding keeps descenders inside the mask.
		<div style={{overflow: 'hidden', paddingBottom: '0.14em', marginBottom: '-0.14em', ...style}}>
			<div style={{translate: `0 ${(1 - k) * 105 - o * 30}%`, opacity: Math.min(1, k * 2.2) * (1 - o)}}>{children}</div>
		</div>
	);
};

// Deterministic pseudo-random in [0,1).
export const hash = (n: number) => {
	const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
	return s - Math.floor(s);
};

// Human typing cadence: per-character times with word and punctuation pauses.
export const typingSchedule = (text: string, cps = 19, seed = 1) => {
	const times: number[] = [];
	let acc = 0;
	for (let i = 0; i < text.length; i++) {
		times.push(acc);
		const ch = text[i];
		let d = (1 / cps) * (0.7 + 0.6 * hash(i + seed * 97));
		if (ch === ' ') d += 0.035 + 0.05 * hash(i * 3 + seed);
		if (ch === ',' || ch === '.') d += 0.16;
		acc += d;
	}
	return {times, duration: acc};
};
export const typed = (text: string, t: number, start: number, cps = 19, seed = 1) => {
	const {times} = typingSchedule(text, cps, seed);
	const local = t - start;
	if (local < 0) return '';
	let n = 0;
	while (n < times.length && times[n] <= local) n++;
	return text.slice(0, n);
};
export const typingEnd = (text: string, start: number, cps = 19, seed = 1) => start + typingSchedule(text, cps, seed).duration;

// Assistant streaming: words fade in place, so the paragraph never reflows.
export const Stream: React.FC<{text: string; t: number; at: number; wps?: number; style?: React.CSSProperties}> = ({
	text,
	t,
	at,
	wps = 9,
	style,
}) => {
	const words = text.split(' ');
	return (
		<span style={style}>
			{words.map((w, i) => {
				const k = p(t, at + i / wps, at + i / wps + 0.32, ease.settle);
				return (
					<span key={i} style={{opacity: k}}>
						{w}
						{i < words.length - 1 ? ' ' : ''}
					</span>
				);
			})}
		</span>
	);
};
export const streamEnd = (text: string, at: number, wps = 9) => at + text.split(' ').length / wps + 0.32;
