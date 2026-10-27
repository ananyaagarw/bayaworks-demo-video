// The plan as a cut-away architectural model: the drawing on the floor plane, partitions extruded
// as real 3D faces, and wall heads drawn as a second plane. Rendered at 2× and scaled down for crisp lines.
import React from 'react';
import {C} from '../brand';
import {H, K, W, WALLS} from './geometry';
import {PlanCanvas, PlanState, VIEW} from './PlanCanvas';

const R = 2; // raster scale of the floor plane
const SHELL = [
	{x1: 0, y1: 0, x2: W, y2: 0},
	{x1: 0, y1: H, x2: W, y2: H},
	{x1: 0, y1: 0, x2: 0, y2: H},
	{x1: W, y1: 0, x2: W, y2: H},
];

export type Camera = {rx: number; rz: number; scale: number; x: number; y: number};

export const PlanModel: React.FC<{state: PlanState; extrude: number; camera: Camera; wallHeight?: number}> = ({state, extrude, camera, wallHeight = 30}) => {
	const h = wallHeight * extrude * R;
	const lit = state.lit ?? 0;
	const px = (v: number) => (v * K - VIEW.x) * R;
	const py = (v: number) => (v * K - VIEW.y) * R;
	const face = (s: {x1: number; y1: number; x2: number; y2: number}, i: number, shell: boolean) => {
		const horizontal = s.y1 === s.y2;
		const len = (horizontal ? s.x2 - s.x1 : s.y2 - s.y1) * K * R;
		// Walls on the left of the sweep pick up a faint warmth once lit.
		const warm = Math.max(0, Math.min(1, (lit * (W + 7) - ((s.x1 + s.x2) / 2)) / 3));
		return (
			<div
				key={`${shell ? 's' : 'w'}${i}`}
				style={{
					position: 'absolute',
					left: px(s.x1),
					top: py(s.y1),
					width: len,
					height: h,
					transformOrigin: '0 0',
					transform: horizontal ? 'rotateX(90deg)' : 'rotateZ(90deg) rotateX(90deg)',
					background: `linear-gradient(180deg, rgba(237,233,223,${shell ? 0.05 : 0.03}) 0%, rgba(${warm > 0 ? '200,220,184' : '237,233,223'},${(shell ? 0.16 : 0.11) + 0.05 * warm}) 100%)`,
					borderBottom: `${R}px solid rgba(237,233,223,${shell ? 0.55 : 0.42})`,
					boxSizing: 'border-box',
					backfaceVisibility: 'visible',
				}}
			/>
		);
	};
	return (
		<div style={{position: 'absolute', inset: 0, perspective: 2600, perspectiveOrigin: '62% 40%'}}>
			<div
				style={{
					position: 'absolute',
					left: '50%',
					top: '50%',
					width: VIEW.w * R,
					height: VIEW.h * R,
					marginLeft: (-VIEW.w * R) / 2,
					marginTop: (-VIEW.h * R) / 2,
					transformStyle: 'preserve-3d',
					transform: `translate3d(${camera.x}px, ${camera.y}px, 0) scale(${camera.scale / R}) rotateX(${camera.rx}deg) rotateZ(${camera.rz}deg)`,
				}}
			>
				<div style={{position: 'absolute', inset: 0}}>
					<PlanCanvas id="model" state={state} strokeScale={1.15} />
				</div>
				{extrude > 0 ? (
					<>
						{WALLS.map((w, i) => face(w, i, false))}
						{SHELL.map((w, i) => face(w, i, true))}
						<svg
							viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`}
							style={{position: 'absolute', inset: 0, width: '100%', height: '100%', transform: `translateZ(${h}px)`, overflow: 'visible'}}
						>
							<g stroke={C.sand} strokeLinecap="square" fill="none" opacity={Math.min(1, extrude * 1.4)}>
								{WALLS.map((w, i) => (
									<line key={i} x1={w.x1 * K} y1={w.y1 * K} x2={w.x2 * K} y2={w.y2 * K} strokeOpacity={0.6} strokeWidth={2.4} />
								))}
								<rect x={-1.5} y={-1.5} width={W * K + 3} height={H * K + 3} strokeOpacity={0.72} strokeWidth={4.5} />
							</g>
						</svg>
					</>
				) : null}
			</div>
		</div>
	);
};
