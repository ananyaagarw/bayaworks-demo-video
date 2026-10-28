import React, {useMemo} from 'react';
import {C, MONO} from '../brand';
import {ease} from '../motion';
import {
	ADDED_OUTLETS,
	CONF,
	DOORS,
	FIELD_STEP,
	FIXTURES,
	FURNITURE,
	GRID_X,
	GRID_Y,
	H,
	ISO_LEVELS,
	K,
	OUTLETS,
	PANEL,
	PROJECTOR_ZONE,
	ROOMS,
	TRAY_Y,
	W,
	WALLS,
	circuitFor,
	contours,
	displayName,
	fieldFor,
	fixturePos,
	outletArcs,
	roomById,
} from './geometry';

// Everything the scenes choreograph. 0 = not yet, 1 = complete.
export type PlanState = {
	grid?: number; // structural grid + bubbles
	walls?: number; // partitions drawing on
	shell?: number;
	labels?: number;
	furniture?: number;
	fixtures?: number; // placement sweep across the floor
	circuits?: number; // circuit arcs + homeruns
	power?: number; // outlets, panel, tray
	lit?: number; // lighting study sweep (west → east)
	select?: number; // conference room selected
	projector?: number; // projector zone marked
	edit?: number; // conference fixtures relocated
	ghost?: number; // previous positions shown
	cloud?: number; // revision cloud around the lighting change
	outletsAdded?: number; // added workstation-wall outlets
	outletCircuit?: number;
	outletCloud?: number;
	dim?: number; // de-emphasise everything except the active edit
	before?: number; // the study already calculated for the original arrangement (shown ahead of a new sweep)
	stale?: number; // that study is out of date after a requested change
};

export const VIEW = {x: -78, y: -78, w: W * K + 110, h: H * K + 104};
export const PLAN_VIEWBOX = `${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`;
export const PLAN_ASPECT = VIEW.w / VIEW.h;

const BASE_POS = FIXTURES.map((f) => ({...f}));
const REF = (() => {
	const {field} = fieldFor(BASE_POS);
	const vals = Array.from(field).filter((v) => v > 0).sort((a, b) => a - b);
	return vals[Math.floor(vals.length * 0.9)];
})();

// Banded false-colour study rendered once per fixture arrangement.
const BANDS = [
	[0, 0, 0, 0],
	[143, 174, 125, 0.065],
	[160, 190, 140, 0.115],
	[190, 214, 170, 0.175],
	[215, 230, 201, 0.25],
];
const studyImage = (field: Float32Array, nx: number, ny: number) => {
	if (typeof document === 'undefined') return '';
	const canvas = document.createElement('canvas');
	canvas.width = nx;
	canvas.height = ny;
	const ctx = canvas.getContext('2d')!;
	const img = ctx.createImageData(nx, ny);
	for (let i = 0; i < nx * ny; i++) {
		const v = field[i] / REF;
		if (v <= 0) continue;
		let b = 0;
		while (b < ISO_LEVELS.length && v > ISO_LEVELS[b]) b++;
		const [r, g, bl, a] = BANDS[b];
		img.data[i * 4] = r;
		img.data[i * 4 + 1] = g;
		img.data[i * 4 + 2] = bl;
		img.data[i * 4 + 3] = Math.round(a * 255);
	}
	ctx.putImageData(img, 0, 0);
	return canvas.toDataURL('image/png');
};

const cloudPath = (x0: number, y0: number, x1: number, y1: number, chord = 0.85) => {
	const pts: [number, number][] = [];
	const side = (ax: number, ay: number, bx: number, by: number) => {
		const len = Math.hypot(bx - ax, by - ay);
		const n = Math.max(2, Math.round(len / chord));
		for (let i = 0; i < n; i++) pts.push([ax + ((bx - ax) * i) / n, ay + ((by - ay) * i) / n]);
	};
	side(x0, y0, x1, y0);
	side(x1, y0, x1, y1);
	side(x1, y1, x0, y1);
	side(x0, y1, x0, y0);
	const r = chord * 0.62 * K;
	let d = `M${pts[0][0] * K} ${pts[0][1] * K}`;
	for (let i = 1; i <= pts.length; i++) {
		const [x, y] = pts[i % pts.length];
		d += `A${r} ${r} 0 0 1 ${x * K} ${y * K}`;
	}
	return d + 'Z';
};

const Delta: React.FC<{x: number; y: number; k: number}> = ({x, y, k}) => (
	<g transform={`translate(${x * K} ${y * K})`} opacity={k}>
		<path d="M0 -11L10.5 7H-10.5Z" fill={C.bg} stroke={C.accent} strokeWidth={1.2} />
		<text y={4.6} textAnchor="middle" fontFamily={MONO} fontSize={9.5} fill={C.accent} stroke="none">
			B
		</text>
	</g>
);

const draw = (k: number) => ({pathLength: 1, strokeDasharray: '1 1', strokeDashoffset: 1 - k});

export const PlanCanvas: React.FC<{
	id: string;
	state: PlanState;
	style?: React.CSSProperties;
	strokeScale?: number; // compensate when the drawing is shown very small
}> = ({id, state, style, strokeScale = 1}) => {
	const s = {
		grid: 1, walls: 1, shell: 1, labels: 1, furniture: 1, fixtures: 1, circuits: 0, power: 0, lit: 0,
		select: 0, projector: 0, edit: 0, ghost: 0, cloud: 0, outletsAdded: 0, outletCircuit: 0, outletCloud: 0, dim: 0, before: 0, stale: 0,
		...state,
	};
	const sw = (n: number) => n * strokeScale;
	const editKey = Math.round(s.edit * 40) / 40;
	const positions = useMemo(
		() => FIXTURES.map((f) => ({...f, ...fixturePos(f, editKey, ease.glide)})),
		[editKey],
	);
	// The study is only recomputed for settled arrangements (before/after the edit).
	const studyKey = s.edit >= 1 ? 1 : 0;
	const study = useMemo(() => studyFor(studyKey), [studyKey]);
	const original = useMemo(() => (s.before > 0 ? studyFor(0) : null), [s.before > 0]);
	const {arcs, homeruns} = useMemo(() => circuitFor(editKey, ease.glide), [editKey]);
	const sweepX = s.lit * (W * K + 160) - 80;
	const conf = roomById(CONF);
	const fixtureCount = FIXTURES.length;
	const placed = (order: number) => Math.max(0, Math.min(1, (s.fixtures * (fixtureCount + 14) - order) / 14));
	const lightOn = (x: number) => Math.max(s.before, Math.min(1, (sweepX - x * K + 10) / 40), 0);
	const wallMid = (w: (typeof WALLS)[number]) => (w.x1 + w.x2) / 2 / W;
	const fade = 1 - 0.55 * s.dim;
	const pz = PROJECTOR_ZONE;
	const roomOrder = (x: number) => x / W;

	return (
		<svg viewBox={PLAN_VIEWBOX} style={{width: '100%', height: '100%', overflow: 'visible', ...style}}>
			<defs>
				<linearGradient id={`${id}-sweep`} gradientUnits="userSpaceOnUse" x1={sweepX - 70} x2={sweepX} y1={0} y2={0}>
					<stop offset="0" stopColor="#fff" />
					<stop offset="1" stopColor="#000" />
				</linearGradient>
				<mask id={`${id}-litmask`} maskUnits="userSpaceOnUse" x={VIEW.x} y={VIEW.y} width={VIEW.w} height={VIEW.h}>
					<rect x={VIEW.x} y={VIEW.y} width={VIEW.w} height={VIEW.h} fill={`url(#${id}-sweep)`} />
				</mask>
				<linearGradient id={`${id}-ahead`} gradientUnits="userSpaceOnUse" x1={sweepX - 70} x2={sweepX} y1={0} y2={0}>
					<stop offset="0" stopColor="#000" />
					<stop offset="1" stopColor="#fff" />
				</linearGradient>
				<mask id={`${id}-aheadmask`} maskUnits="userSpaceOnUse" x={VIEW.x} y={VIEW.y} width={VIEW.w} height={VIEW.h}>
					<rect x={VIEW.x} y={VIEW.y} width={VIEW.w} height={VIEW.h} fill={`url(#${id}-ahead)`} />
				</mask>
				<linearGradient id={`${id}-scan`} gradientUnits="userSpaceOnUse" x1={sweepX - 90} x2={sweepX} y1={0} y2={0}>
					<stop offset="0" stopColor={C.glow} stopOpacity="0" />
					<stop offset="1" stopColor={C.glow} stopOpacity=".16" />
				</linearGradient>
				<pattern id={`${id}-hatch`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
					<line x1="0" y1="0" x2="0" y2="6" stroke={C.accent} strokeWidth={0.8} strokeOpacity={0.35} />
				</pattern>
			</defs>

			{/* Structural grid */}
			<g opacity={s.grid * fade}>
				{GRID_X.map((x, i) => (
					<g key={`gx${i}`}>
						<line x1={x * K} x2={x * K} y1={-42} y2={H * K + 16} stroke={C.sand} strokeOpacity={0.12} strokeWidth={sw(1)} strokeDasharray="7 7" />
						<circle cx={x * K} cy={-56} r={12} fill={C.bg} stroke={C.sand} strokeOpacity={0.38} strokeWidth={sw(1.1)} />
						<text x={x * K} y={-52} textAnchor="middle" fontFamily={MONO} fontSize={11} fill={C.sand} fillOpacity={0.6}>
							{'ABCDEFG'[i]}
						</text>
					</g>
				))}
				{GRID_Y.map((y, i) => (
					<g key={`gy${i}`}>
						<line y1={y * K} y2={y * K} x1={-42} x2={W * K + 16} stroke={C.sand} strokeOpacity={0.12} strokeWidth={sw(1)} strokeDasharray="7 7" />
						<circle cy={y * K} cx={-56} r={12} fill={C.bg} stroke={C.sand} strokeOpacity={0.38} strokeWidth={sw(1.1)} />
						<text y={y * K + 4} x={-56} textAnchor="middle" fontFamily={MONO} fontSize={11} fill={C.sand} fillOpacity={0.6}>
							{i + 1}
						</text>
					</g>
				))}
			</g>

			{/* Floor plate */}
			<rect x={0} y={0} width={W * K} height={H * K} fill="#16110D" opacity={s.shell} />

			{/* The study already on record, ahead of any new calculation sweep */}
			{original && s.before > 0 ? (
				<g mask={`url(#${id}-aheadmask)`} opacity={s.before * (1 - 0.6 * s.stale) * (1 - 0.6 * s.dim)}>
					<StudyLayer study={original} sw={sw} />
				</g>
			) : null}

			{/* Lighting study: banded field + isolines, revealed by the calculation sweep */}
			{s.lit > 0 ? (
				<g mask={`url(#${id}-litmask)`} opacity={1 - 0.6 * s.dim}>
					<StudyLayer study={study} sw={sw} />
				</g>
			) : null}

			{/* Furniture */}
			<g stroke={C.sand} strokeOpacity={0.14} strokeWidth={sw(1)} fill="none" opacity={s.furniture * fade}>
				{FURNITURE.map((f, i) =>
					f.kind === 'rect' ? (
						<rect key={i} x={f.x * K} y={f.y * K} width={f.w * K} height={f.h * K} rx={(f.rx ?? 0) * K} />
					) : f.kind === 'circle' ? (
						<circle key={i} cx={f.x * K} cy={f.y * K} r={f.r * K} />
					) : (
						<line key={i} x1={f.x1 * K} y1={f.y1 * K} x2={f.x2 * K} y2={f.y2 * K} strokeOpacity={0.4} strokeWidth={sw(2)} />
					),
				)}
			</g>

			{/* Partitions, doors, shell, columns */}
			<g fill="none" stroke={C.sand} strokeLinecap="square">
				{WALLS.map((w, i) => {
					const k = Math.max(0, Math.min(1, s.walls * 1.6 - wallMid(w) * 0.6));
					return k > 0 ? (
						<line key={i} x1={w.x1 * K} y1={w.y1 * K} x2={w.x2 * K} y2={w.y2 * K} strokeOpacity={0.46} strokeWidth={sw(2.2)} {...draw(k)} />
					) : null;
				})}
				{DOORS.map((d, i) => {
					const k = Math.max(0, Math.min(1, s.walls * 1.6 - d.x / W * 0.6 - 0.25));
					const x = d.x * K;
					const y = d.y * K;
					const r = d.w * K;
					return (
						<g key={i} opacity={k} strokeOpacity={0.3} strokeWidth={sw(1)}>
							<line x1={x} y1={y} x2={x} y2={y + d.s * r} />
							<path d={`M${x} ${y + d.s * r}A${r} ${r} 0 0 ${d.s === 1 ? 0 : 1} ${x + r} ${y}`} strokeDasharray="2 3" />
						</g>
					);
				})}
				<rect x={-3} y={-3} width={W * K + 6} height={H * K + 6} strokeOpacity={0.62} strokeWidth={sw(5)} {...draw(s.shell)} />
				{GRID_X.flatMap((x) =>
					GRID_Y.map((y) => (
						<rect key={`${x}-${y}`} x={x * K - 5} y={y * K - 5} width={10} height={10} fill={C.sand} fillOpacity={0.5} stroke="none" opacity={s.grid} />
					)),
				)}
			</g>

			{/* Power: corridor containment, panel, outlets */}
			<g opacity={s.power * fade}>
				<path d={`M${1 * K} ${(TRAY_Y - 0.16) * K}H${41 * K}M${1 * K} ${(TRAY_Y + 0.16) * K}H${41 * K}`} stroke={C.leaf} strokeOpacity={0.28} strokeWidth={sw(1)} fill="none" {...draw(s.power)} />
				<g transform={`translate(${PANEL.x * K} ${PANEL.y * K})`}>
					<rect width={PANEL.w * K} height={PANEL.h * K} fill={`url(#${id}-hatch)`} stroke={C.accent} strokeWidth={sw(1.2)} />
					<text x={-5} y={10} textAnchor="end" fontFamily={MONO} fontSize={10} fill={C.accent}>
						{PANEL.label}
					</text>
				</g>
				{OUTLETS.map((o, i) => (
					<Outlet key={i} o={o} k={Math.max(0, Math.min(1, s.power * 1.5 - (o.x / W) * 0.5))} sw={sw} color={C.sand} alpha={0.66} />
				))}
				{outletArcs(OUTLETS).map((d, i) => (
					<path key={i} d={d} fill="none" stroke={C.sand} strokeOpacity={0.3} strokeWidth={sw(0.9)} {...draw(Math.max(0, Math.min(1, s.power * 1.4 - 0.4)))} />
				))}
			</g>

			{/* Added workstation-wall outlets (Studio electrical request) */}
			{s.outletsAdded > 0 ? (
				<g>
					{ADDED_OUTLETS.map((o, i) => (
						<Outlet key={i} o={o} k={Math.max(0, Math.min(1, s.outletsAdded * (ADDED_OUTLETS.length + 2) - i))} sw={sw} color={C.accent} alpha={1} />
					))}
					{outletArcs(ADDED_OUTLETS).map((d, i) => (
						<path key={i} d={d} fill="none" stroke={C.accent} strokeOpacity={0.75} strokeWidth={sw(1.1)} {...draw(Math.max(0, Math.min(1, s.outletCircuit * ADDED_OUTLETS.length - i)))} />
					))}
					<g opacity={Math.max(0, s.outletCircuit * 3 - 2)}>
						<HomerunArrow x={ADDED_OUTLETS[0].x - 0.2} y={ADDED_OUTLETS[0].y + 0.35} dx={-0.9} dy={0} tag="2A-14" color={C.accent} sw={sw} />
					</g>
					{s.outletCloud > 0 ? (
						<g>
							<path d={cloudPath(23.4, 10.55, 39.0, 12.15, 0.72)} fill="none" stroke={C.accent} strokeOpacity={0.85} strokeWidth={sw(1.2)} {...draw(s.outletCloud)} />
							<Delta x={39.55} y={10.35} k={Math.max(0, s.outletCloud * 2 - 1)} />
						</g>
					) : null}
				</g>
			) : null}

			{/* Projector zone */}
			{s.projector > 0 ? (
				<g>
					<rect x={pz.x0 * K} y={pz.y0 * K} width={(pz.x1 - pz.x0) * K} height={(pz.y1 - pz.y0) * K} fill={`url(#${id}-hatch)`} opacity={s.projector * 0.8} />
					<rect x={pz.x0 * K} y={pz.y0 * K} width={(pz.x1 - pz.x0) * K} height={(pz.y1 - pz.y0) * K} fill="none" stroke={C.accent} strokeWidth={sw(1.1)} strokeDasharray="5 4" opacity={s.projector} />
					<g opacity={Math.max(0, s.projector * 2 - 1)}>
						<rect x={((pz.x0 + pz.x1) / 2) * K - 54} y={((pz.y0 + pz.y1) / 2) * K - 9} width={108} height={18} rx={3} fill={C.bg} />
						<text x={((pz.x0 + pz.x1) / 2) * K} y={((pz.y0 + pz.y1) / 2) * K + 3.6} textAnchor="middle" fontFamily={MONO} fontSize={9.5} letterSpacing={1} fill={C.accent}>
							PROJECTOR ZONE
						</text>
					</g>
				</g>
			) : null}

			{/* Circuits */}
			<g opacity={fade}>
				{arcs.map((a, i) => {
					const k = Math.max(0, Math.min(1, s.circuits * 1.5 - roomOrder(roomById(a.room).x0) * 0.5));
					const active = a.room === CONF && s.select > 0;
					return k > 0 ? (
						<path key={i} d={a.d} fill="none" stroke={active ? C.accent : C.leaf} strokeOpacity={active ? 0.7 : 0.42} strokeWidth={sw(0.9)} {...draw(k)} />
					) : null;
				})}
				{homeruns.map((h, i) => {
					const k = Math.max(0, Math.min(1, s.circuits * 1.5 - roomOrder(roomById(h.room).x0) * 0.5 - 0.35) * 2);
					return k > 0 ? (
						<g key={i} opacity={k}>
							<HomerunArrow {...h} color={C.leaf} sw={sw} />
						</g>
					) : null;
				})}
			</g>

			{/* Conference room selection */}
			{s.select > 0 ? (
				<g opacity={s.select}>
					<rect x={conf.x0 * K + 4} y={conf.y0 * K + 4} width={(conf.x1 - conf.x0) * K - 8} height={(conf.y1 - conf.y0) * K - 8} fill={C.accent} fillOpacity={0.045} stroke={C.accent} strokeOpacity={0.9} strokeWidth={sw(1.4)} />
					{[
						[conf.x0, conf.y0],
						[conf.x1, conf.y0],
						[conf.x0, conf.y1],
						[conf.x1, conf.y1],
					].map(([x, y], i) => (
						<rect key={i} x={x * K + (x === conf.x0 ? 4 : -4) - 3.5} y={y * K + (y === conf.y0 ? 4 : -4) - 3.5} width={7} height={7} fill={C.bg} stroke={C.accent} strokeWidth={sw(1.2)} />
					))}
				</g>
			) : null}

			{/* Previous positions + move leaders */}
			{s.ghost > 0
				? FIXTURES.filter((f) => f.room === CONF).map((f) => {
						const now = positions.find((p) => p.id === f.id)!;
						return (
							<g key={f.id} opacity={s.ghost}>
								<circle cx={f.x * K} cy={f.y * K} r={6} fill="none" stroke={C.sand} strokeOpacity={0.45} strokeWidth={sw(1)} strokeDasharray="2 2.5" />
								{now.y - f.y > 0.3 ? (
									<line x1={f.x * K} y1={f.y * K + 8} x2={f.x * K} y2={now.y * K - 8} stroke={C.accent} strokeOpacity={0.6} strokeWidth={sw(0.9)} strokeDasharray="1.5 3" />
								) : null}
							</g>
						);
					})
				: null}

			{/* Fixtures */}
			<g>
				{positions.map((f) => {
					const k = placed(f.order);
					if (k <= 0) return null;
					const on = lightOn(f.x);
					const selected = f.room === CONF && s.select > 0;
					const fill = on > 0 ? C.lit : C.bg;
					const stroke = selected ? C.accent : on > 0.5 ? C.lit : C.sand;
					const kk = ease.settle(k);
					return (
						<g key={f.id} transform={`translate(${f.x * K} ${f.y * K}) scale(${0.55 + 0.45 * kk})`} opacity={kk * (f.room === CONF ? 1 : fade)}>
							{on > 0 ? (
								f.kind === 'lin' ? (
									<rect x={-17} y={-5} width={34} height={10} rx={5} fill={C.glow} opacity={0.18 * on} />
								) : (
									<circle r={9} fill={C.glow} opacity={0.18 * on} />
								)
							) : null}
							{f.kind === 'lin' ? (
								<rect x={-14.4} y={-2.2} width={28.8} height={4.4} rx={1} fill={fill} fillOpacity={on > 0 ? 0.35 + 0.65 * on : 1} stroke={stroke} strokeOpacity={selected ? 1 : 0.6 + 0.4 * on} strokeWidth={sw(1.1)} />
							) : (
								<circle r={5} fill={fill} fillOpacity={on > 0 ? 0.35 + 0.65 * on : 1} stroke={stroke} strokeOpacity={selected ? 1 : 0.6 + 0.4 * on} strokeWidth={sw(1.1)} />
							)}
							{selected ? <rect x={-9.5} y={-9.5} width={19} height={19} fill="none" stroke={C.accent} strokeOpacity={0.55 * s.select} strokeWidth={sw(0.8)} /> : null}
						</g>
					);
				})}
			</g>

			{/* Calculation sweep line */}
			{s.lit > 0 && s.lit < 1 && sweepX > 0 && sweepX < W * K ? (
				<g opacity={Math.min(1, sweepX / 60, (W * K - sweepX) / 60)}>
					<rect x={Math.max(0, sweepX - 90)} y={0} width={Math.min(90, sweepX)} height={H * K} fill={`url(#${id}-scan)`} />
					<line x1={sweepX} x2={sweepX} y1={-14} y2={H * K + 14} stroke={C.glow} strokeOpacity={0.75} strokeWidth={sw(1.2)} />
				</g>
			) : null}

			{/* Revision cloud around the lighting change */}
			{s.cloud > 0 ? (
				<g>
					<path d={cloudPath(conf.x0 + 0.35, conf.y0 + 0.35, conf.x1 - 0.35, conf.y1 - 0.35)} fill="none" stroke={C.accent} strokeOpacity={0.85} strokeWidth={sw(1.2)} {...draw(s.cloud)} />
					<Delta x={conf.x1 - 0.75} y={conf.y1 - 0.85} k={Math.max(0, s.cloud * 2 - 1)} />
				</g>
			) : null}

			{/* Room annotations */}
			<g opacity={s.labels * fade} fontFamily={MONO}>
				{ROOMS.map((r) => {
					// Labels sit on the side away from the corridor, clear of homerun tags.
					const top = r.y1 <= 9;
					const tall = r.y1 - r.y0 > 3;
					const y = top ? r.y0 * K + 22 : r.y1 * K - (tall ? 18 : 8);
					return (
						<g key={r.id}>
							<text x={r.x0 * K + 7} y={y} fontSize={10} letterSpacing={0.6} fill={C.sand} fillOpacity={0.62}>
								{displayName(r)}
							</text>
							{tall ? (
								<text x={r.x0 * K + 7} y={y + 11} fontSize={8.5} letterSpacing={0.6} fill={C.sand} fillOpacity={0.36}>
									{r.id.replace('R-', '')}
								</text>
							) : null}
						</g>
					);
				})}
			</g>
		</svg>
	);
};

const studyFor = (key: number) => {
	const pos = FIXTURES.map((f) => ({...f, ...fixturePos(f, key, ease.glide)}));
	const f = fieldFor(pos);
	const norm = {...f, field: f.field.map((v) => v / REF) as Float32Array};
	return {href: studyImage(f.field, f.nx, f.ny), iso: contours(norm)};
};

const StudyLayer: React.FC<{study: {href: string; iso: string[]}; sw: (n: number) => number}> = ({study, sw}) => (
	<>
		<image href={study.href} x={(-FIELD_STEP * K) / 2} y={(-FIELD_STEP * K) / 2} width={(W + FIELD_STEP) * K} height={(H + FIELD_STEP) * K} preserveAspectRatio="none" />
		{study.iso.map((d, i) => (
			<path key={i} d={d} fill="none" stroke={C.glow} strokeOpacity={0.16 + i * 0.07} strokeWidth={sw(0.8)} strokeLinecap="round" />
		))}
	</>
);

const Outlet: React.FC<{o: {x: number; y: number; wall: string}; k: number; sw: (n: number) => number; color: string; alpha: number}> = ({o, k, sw, color, alpha}) => {
	if (k <= 0) return null;
	const kk = ease.settle(k);
	const vertical = o.wall === 'n' || o.wall === 's';
	return (
		<g transform={`translate(${o.x * K} ${o.y * K}) scale(${0.6 + 0.4 * kk})`} opacity={kk * alpha}>
			<circle r={4.6} fill={C.bg} stroke={color} strokeWidth={sw(1.1)} />
			<path d={vertical ? 'M-1.8 -7.5V7.5M1.8 -7.5V7.5' : 'M-7.5 -1.8H7.5M-7.5 1.8H7.5'} stroke={color} strokeWidth={sw(1)} />
		</g>
	);
};

const HomerunArrow: React.FC<{x: number; y: number; dx: number; dy: number; tag: string; color: string; sw: (n: number) => number}> = ({x, y, dx, dy, tag, color, sw}) => {
	const x1 = x * K;
	const y1 = y * K;
	const x2 = (x + dx) * K;
	const y2 = (y + dy) * K;
	const len = Math.hypot(x2 - x1, y2 - y1);
	const ux = (x2 - x1) / len;
	const uy = (y2 - y1) / len;
	return (
		<g stroke={color} strokeWidth={sw(1)} fill="none">
			<line x1={x1 + ux * 8} y1={y1 + uy * 8} x2={x2} y2={y2} strokeOpacity={0.7} />
			<path d={`M${x2} ${y2}l${-ux * 6 - uy * 3} ${-uy * 6 + ux * 3}M${x2} ${y2}l${-ux * 6 + uy * 3} ${-uy * 6 - ux * 3}`} strokeOpacity={0.7} />
			<text x={x2 + (dx < 0 ? -4 : 5)} y={y2 + (dy > 0 ? 9 : dy < 0 ? -3 : 3)} textAnchor={dx < 0 ? 'end' : 'start'} fontFamily={MONO} fontSize={8} fill={color} fillOpacity={0.8} stroke="none">
				{tag}
			</text>
		</g>
	);
};
