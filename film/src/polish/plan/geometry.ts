// Synthetic Level 02 office floor (src/rooms.json), developed into a drawing set:
// partitions with door openings, structural grid, furniture, lighting, power and circuits.
// All values are illustrative drawing geometry in metres. No calculated results are shown.
import roomsJson from '../../rooms.json';

export const K = 24; // px per metre in plan space
export const W = 42;
export const H = 22;

export type Room = {id: string; name: string; tag: string; x0: number; y0: number; x1: number; y1: number};
export const ROOMS: Room[] = roomsJson.map((r) => {
	const xs = r.boundary.map((b) => b[0]);
	const ys = r.boundary.map((b) => b[1]);
	return {id: r.id, name: r.name, tag: r.classification.tag, x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys)};
});
export const roomById = (id: string) => ROOMS.find((r) => r.id === id)!;

export const displayName = (r: Room) =>
	r.name.replace('OPEN PLAN WORKSPACE', 'OPEN OFFICE').replace('OPEN PLAN SOUTH', 'SOUTH STUDIO');

// ---------- Doors (opening on a horizontal wall, swinging into the room side s) ----------
export type Door = {x: number; y: number; w: number; s: 1 | -1};
export const DOORS: Door[] = [
	{x: 3.4, y: 9, w: 0.9, s: -1},
	{x: 8.4, y: 9, w: 0.9, s: -1},
	{x: 15.4, y: 9, w: 0.9, s: -1},
	{x: 19.4, y: 9, w: 0.9, s: -1},
	{x: 22.2, y: 9, w: 1.6, s: -1},
	{x: 6.4, y: 11, w: 0.9, s: 1},
	{x: 10.4, y: 11, w: 0.9, s: 1},
	{x: 12.9, y: 11, w: 0.9, s: 1},
	{x: 18.4, y: 11, w: 0.9, s: 1},
	{x: 21.0, y: 11, w: 1.6, s: 1},
	{x: 1.0, y: 19, w: 0.9, s: 1},
	{x: 10.4, y: 17, w: 0.9, s: 1},
	{x: 12.9, y: 15, w: 0.9, s: 1},
	{x: 12.9, y: 19, w: 0.9, s: 1},
];

// ---------- Walls: unique interior edges minus door openings ----------
export type Seg = {x1: number; y1: number; x2: number; y2: number};
const interiorSegments = (): Seg[] => {
	const set = new Map<string, Seg>();
	const onShell = (s: Seg) =>
		(s.y1 === s.y2 && (s.y1 === 0 || s.y1 === H)) || (s.x1 === s.x2 && (s.x1 === 0 || s.x1 === W));
	for (const r of ROOMS) {
		const edges: Seg[] = [
			{x1: r.x0, y1: r.y0, x2: r.x1, y2: r.y0},
			{x1: r.x0, y1: r.y1, x2: r.x1, y2: r.y1},
			{x1: r.x0, y1: r.y0, x2: r.x0, y2: r.y1},
			{x1: r.x1, y1: r.y0, x2: r.x1, y2: r.y1},
		];
		for (const e of edges) if (!onShell(e)) set.set(`${e.x1},${e.y1},${e.x2},${e.y2}`, e);
	}
	// Split horizontal edges that overlap (corridor edges span many rooms) into elementary pieces.
	const horiz = [...set.values()].filter((s) => s.y1 === s.y2);
	const vert = [...set.values()].filter((s) => s.x1 === s.x2);
	const out: Seg[] = [];
	const ys = [...new Set(horiz.map((s) => s.y1))];
	for (const y of ys) {
		const xs = [...new Set(horiz.filter((s) => s.y1 === y).flatMap((s) => [s.x1, s.x2]))].sort((a, b) => a - b);
		for (let i = 0; i < xs.length - 1; i++) {
			const a = xs[i];
			const b = xs[i + 1];
			if (horiz.some((s) => s.y1 === y && s.x1 <= a && s.x2 >= b)) out.push({x1: a, y1: y, x2: b, y2: y});
		}
	}
	const xsV = [...new Set(vert.map((s) => s.x1))];
	for (const x of xsV) {
		const pts = [...new Set(vert.filter((s) => s.x1 === x).flatMap((s) => [s.y1, s.y2]))].sort((a, b) => a - b);
		for (let i = 0; i < pts.length - 1; i++) {
			const a = pts[i];
			const b = pts[i + 1];
			if (vert.some((s) => s.x1 === x && s.y1 <= a && s.y2 >= b)) out.push({x1: x, y1: a, x2: x, y2: b});
		}
	}
	// Cut door openings.
	const cut: Seg[] = [];
	for (const s of out) {
		if (s.y1 !== s.y2) {
			cut.push(s);
			continue;
		}
		let pieces: Seg[] = [s];
		for (const d of DOORS.filter((d) => d.y === s.y1)) {
			pieces = pieces.flatMap((p) => {
				if (d.x >= p.x2 || d.x + d.w <= p.x1) return [p];
				const r: Seg[] = [];
				if (d.x > p.x1) r.push({...p, x2: d.x});
				if (d.x + d.w < p.x2) r.push({...p, x1: d.x + d.w});
				return r;
			});
		}
		cut.push(...pieces);
	}
	return cut;
};
export const WALLS = interiorSegments();

// Structural grid
export const GRID_X = [0, 7, 14, 21, 28, 35, 42];
export const GRID_Y = [0, 11, 22];

// ---------- Furniture (faint reference linework) ----------
export type Furn = {kind: 'rect'; x: number; y: number; w: number; h: number; rx?: number} | {kind: 'circle'; x: number; y: number; r: number} | {kind: 'line'; x1: number; y1: number; x2: number; y2: number};
const desks = (x0: number, x1: number, y: number, pair = true): Furn[] => {
	const r: Furn[] = [];
	for (let x = x0; x + 1.6 <= x1; x += 1.9) {
		r.push({kind: 'rect', x, y, w: 1.6, h: 0.72, rx: 0.06});
		if (pair) r.push({kind: 'rect', x, y: y + 0.72, w: 1.6, h: 0.72, rx: 0.06});
	}
	return r;
};
export const FURNITURE: Furn[] = [
	...desks(23.2, 41, 2.0),
	...desks(23.2, 41, 5.6),
	...desks(23.4, 41, 11.55, false),
	...desks(23.4, 41, 15.2),
	...desks(23.4, 41, 19.2, false),
	{kind: 'rect', x: 1.6, y: 5.6, w: 1.8, h: 0.8, rx: 0.06},
	{kind: 'rect', x: 6.6, y: 5.6, w: 1.8, h: 0.8, rx: 0.06},
	{kind: 'rect', x: 16.2, y: 16.6, w: 1.8, h: 0.8, rx: 0.06},
	{kind: 'rect', x: 11.9, y: 4.2, w: 3.2, h: 3.0, rx: 0.7},
	{kind: 'line', x1: 11.9, y1: 0.32, x2: 15.1, y2: 0.32},
	{kind: 'circle', x: 19, y: 6.0, r: 0.8},
	{kind: 'rect', x: 0.3, y: 11.6, w: 0.65, h: 4.2, rx: 0.04},
	{kind: 'circle', x: 2.65, y: 16.35, r: 0.7},
	{kind: 'circle', x: 5.35, y: 13.65, r: 0.7},
];

// ---------- Lighting ----------
export type Fixture = {id: string; room: string; kind: 'lin' | 'dl'; x: number; y: number; row: number; col: number; order: number};
const grid = (r: Room, nx: number, ny: number, kind: 'lin' | 'dl', insetY = 0): Omit<Fixture, 'order'>[] => {
	const out: Omit<Fixture, 'order'>[] = [];
	const w = r.x1 - r.x0;
	const h = r.y1 - r.y0 - insetY;
	for (let j = 0; j < ny; j++)
		for (let i = 0; i < nx; i++)
			out.push({id: `${r.id}-${j}-${i}`, room: r.id, kind, x: r.x0 + (w * (i + 0.5)) / nx, y: r.y0 + insetY + (h * (j + 0.5)) / ny, row: j, col: i});
	return out;
};
export const CONF = 'R-204';
const CONF_ROWS_BEFORE = [1.5, 4.5, 7.5];
const CONF_ROWS_AFTER = [3.95, 5.85, 7.75];
const layout = (r: Room) => {
	const w = r.x1 - r.x0;
	const h = r.y1 - r.y0;
	switch (r.tag) {
		case 'office':
			return grid(r, 2, Math.round(h / 3), 'lin');
		case 'open_office':
			return grid(r, Math.round(w / 2.7), Math.round(h / 3), 'lin');
		case 'corridor':
			return grid(r, 14, 1, 'dl');
		case 'meeting_room':
			return r.id === CONF ? grid(r, 2, 3, 'dl') : grid(r, 1, 3, 'dl');
		case 'break_room':
			return grid(r, 3, 3, 'dl');
		case 'restroom':
			return grid(r, 1, 2, 'dl');
		case 'unknown':
			return [];
		case 'electrical_room':
			return [{id: `${r.id}-0-0`, room: r.id, kind: 'lin' as const, x: r.x0 + 1.05, y: r.y0 + 2.45, row: 0, col: 0}];
		default:
			return grid(r, 1, 1, 'lin');
	}
};
// Placement order sweeps west → east, the way the floor is read.
export const FIXTURES: Fixture[] = ROOMS.flatMap(layout)
	.sort((a, b) => a.x - b.x || a.y - b.y)
	.map((f, order) => ({...f, order}));
if (FIXTURES.some((f) => f.room === CONF && f.row > 2)) throw new Error('unexpected conference layout');

// Position of a fixture given the conference-room edit progress (rows staggered).
export const fixturePos = (f: Fixture, edit: number, ease: (n: number) => number) => {
	if (f.room !== CONF || edit <= 0) return {x: f.x, y: f.y};
	const k = ease(Math.max(0, Math.min(1, (edit - (2 - f.row) * 0.14) / 0.72)));
	return {x: f.x, y: CONF_ROWS_BEFORE[f.row] + (CONF_ROWS_AFTER[f.row] - CONF_ROWS_BEFORE[f.row]) * k};
};
export const PROJECTOR_ZONE = {x0: 11.4, y0: 1.25, x1: 15.6, y1: 3.35};

// ---------- Power ----------
export type Outlet = {x: number; y: number; wall: 'n' | 's' | 'e' | 'w'; added?: boolean};
export const OUTLETS: Outlet[] = [
	{x: 1.4, y: 0.22, wall: 'n'},
	{x: 6.4, y: 0.22, wall: 'n'},
	{x: 11.2, y: 8.78, wall: 's'},
	{x: 17.6, y: 0.22, wall: 'n'},
	{x: 23.5, y: 0.22, wall: 'n'},
	{x: 28.5, y: 0.22, wall: 'n'},
	{x: 33.5, y: 0.22, wall: 'n'},
	{x: 38.5, y: 0.22, wall: 'n'},
	{x: 1.6, y: 21.78, wall: 's'},
	{x: 4.6, y: 18.78, wall: 's'},
	{x: 17.5, y: 21.78, wall: 's'},
	{x: 24.0, y: 21.78, wall: 's'},
	{x: 30.0, y: 21.78, wall: 's'},
	{x: 36.0, y: 21.78, wall: 's'},
];
// "Add outlets along the workstation wall": the corridor-side wall of the south studio.
export const ADDED_OUTLETS: Outlet[] = [24.2, 27.0, 29.8, 32.6, 35.4, 38.2].map((x) => ({x, y: 11.22, wall: 'n', added: true}));
export const PANEL = {x: 14.42, y: 11.9, w: 0.42, h: 1.5, label: 'LP-2A'};
export const TRAY_Y = 10;

// ---------- Circuits: arcs between fixtures in a room, plus a homerun arrow ----------
export type Arc = {d: string; order: number; room: string};
export type Homerun = {x: number; y: number; dx: number; dy: number; tag: string; order: number; room: string};
const arcPath = (a: {x: number; y: number}, b: {x: number; y: number}, bow = 0.2) => {
	const mx = (a.x + b.x) / 2;
	const my = (a.y + b.y) / 2;
	const dx = b.x - a.x;
	const dy = b.y - a.y;
	return `M${a.x * K} ${a.y * K}Q${(mx - dy * bow) * K} ${(my + dx * bow) * K} ${b.x * K} ${b.y * K}`;
};
export const circuitFor = (edit: number, ease: (n: number) => number) => {
	const arcs: Arc[] = [];
	const homeruns: Homerun[] = [];
	let n = 1;
	for (const r of ROOMS) {
		const fx = FIXTURES.filter((f) => f.room === r.id);
		if (!fx.length) continue;
		const rows = [...new Set(fx.map((f) => f.row))].sort((a, b) => a - b);
		const chain = rows.flatMap((row, i) => {
			const inRow = fx.filter((f) => f.row === row).sort((a, b) => a.col - b.col);
			return i % 2 ? inRow.reverse() : inRow;
		});
		const pts = chain.map((f) => fixturePos(f, edit, ease));
		for (let i = 0; i < pts.length - 1; i++) arcs.push({d: arcPath(pts[i], pts[i + 1]), order: chain[i].order, room: r.id});
		// Homerun leaves from the fixture nearest the corridor (or the panel), pointing toward it.
		const towards = r.y1 <= 9 ? 1 : r.y0 >= 11 ? -1 : 0;
		const score = (p: {x: number; y: number}) => (towards === 0 ? -Math.abs(p.x - 16.5) : towards * p.y);
		const anchorIdx = pts.reduce((m, p, i) => (score(p) > score(pts[m]) + 1e-6 ? i : m), 0);
		const a = pts[anchorIdx];
		if (r.tag === 'electrical_room') continue; // fed directly from LP-2A beside it
		homeruns.push({x: a.x, y: a.y, dx: 0.45, dy: towards === 0 ? 0.62 : towards * 0.8, tag: `2A-${n}`, order: chain[anchorIdx].order, room: r.id});
		n += 2;
	}
	return {arcs, homeruns};
};
export const outletArcs = (list: Outlet[]) => {
	const arcs: string[] = [];
	for (let i = 0; i < list.length - 1; i++) {
		const a = list[i];
		const b = list[i + 1];
		if (Math.abs(a.y - b.y) > 0.01 || b.x - a.x > 6) continue;
		const off = a.wall === 's' ? -0.35 : 0.35;
		arcs.push(arcPath({x: a.x, y: a.y + off}, {x: b.x, y: b.y + off}, a.wall === 's' ? -0.18 : 0.18));
	}
	return arcs;
};

// ---------- Photometric field (relative, unitless) ----------
// Point-source cosine-cubed model at 2.1 m above the work plane, bounded by each room.
const MOUNT = 2.1;
export const FIELD_STEP = 0.125;
export const fieldFor = (positions: {x: number; y: number; kind: 'lin' | 'dl'; room: string}[]) => {
	const nx = Math.round(W / FIELD_STEP) + 1;
	const ny = Math.round(H / FIELD_STEP) + 1;
	const field = new Float32Array(nx * ny);
	for (const r of ROOMS) {
		const srcs = positions
			.filter((f) => f.room === r.id)
			.flatMap((f) => (f.kind === 'lin' ? [-0.45, 0, 0.45].map((o) => ({x: f.x + o, y: f.y, w: 0.42})) : [{x: f.x, y: f.y, w: 1.05}]));
		if (!srcs.length) continue;
		const i0 = Math.round(r.x0 / FIELD_STEP);
		const i1 = Math.round(r.x1 / FIELD_STEP);
		const j0 = Math.round(r.y0 / FIELD_STEP);
		const j1 = Math.round(r.y1 / FIELD_STEP);
		for (let j = j0; j <= j1; j++)
			for (let i = i0; i <= i1; i++) {
				const x = i * FIELD_STEP;
				const y = j * FIELD_STEP;
				let e = 0;
				for (const s of srcs) {
					const d2 = (x - s.x) ** 2 + (y - s.y) ** 2 + MOUNT * MOUNT;
					e += (s.w * MOUNT ** 3) / (d2 * Math.sqrt(d2));
				}
				// Walls receive slightly less light (no interreflection model; keeps edges legible).
				const edge = Math.min(x - r.x0, r.x1 - x, y - r.y0, r.y1 - y);
				e *= 0.82 + 0.18 * Math.min(1, edge / 0.8);
				field[j * nx + i] = Math.max(field[j * nx + i], e);
			}
	}
	return {field, nx, ny};
};
export const ISO_LEVELS = [0.42, 0.62, 0.8, 0.97];

// Marching squares → SVG path for each iso level (segments, in plan px).
export const contours = (f: {field: Float32Array; nx: number; ny: number}, levels = ISO_LEVELS) =>
	levels.map((lv) => {
		const {field, nx, ny} = f;
		let d = '';
		const s = FIELD_STEP * K;
		const v = (i: number, j: number) => field[j * nx + i];
		const lerp = (a: number, b: number) => (lv - a) / (b - a);
		for (let j = 0; j < ny - 1; j++)
			for (let i = 0; i < nx - 1; i++) {
				const a = v(i, j);
				const b = v(i + 1, j);
				const c = v(i + 1, j + 1);
				const e = v(i, j + 1);
				if (a === 0 || b === 0 || c === 0 || e === 0) continue;
				const idx = (a > lv ? 8 : 0) | (b > lv ? 4 : 0) | (c > lv ? 2 : 0) | (e > lv ? 1 : 0);
				if (idx === 0 || idx === 15) continue;
				const top = [(i + lerp(a, b)) * s, j * s];
				const right = [(i + 1) * s, (j + lerp(b, c)) * s];
				const bottom = [(i + lerp(e, c)) * s, (j + 1) * s];
				const left = [i * s, (j + lerp(a, e)) * s];
				const seg = (p: number[], q: number[]) => {
					d += `M${p[0].toFixed(1)} ${p[1].toFixed(1)}L${q[0].toFixed(1)} ${q[1].toFixed(1)}`;
				};
				switch (idx) {
					case 1: case 14: seg(left, bottom); break;
					case 2: case 13: seg(bottom, right); break;
					case 3: case 12: seg(left, right); break;
					case 4: case 11: seg(top, right); break;
					case 5: seg(left, top); seg(bottom, right); break;
					case 6: case 9: seg(top, bottom); break;
					case 7: case 8: seg(left, top); break;
					case 10: seg(top, right); seg(left, bottom); break;
				}
			}
		return d;
	});
