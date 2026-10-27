import React from 'react';
import {Composition, Sequence, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {staticFile} from 'remotion';
import {C} from './brand';
import {PlanCanvas, PlanState} from './plan/PlanCanvas';
import {Chapter} from './scenes/Chapter';
import {Studio} from './scenes/Studio';
import {Cue} from './sound';
import {FullAnimatic} from '../v2/Animatic';

const PlanTest: React.FC<{state: PlanState}> = ({state}) => (
	<div style={{width: 1920, height: 1080, background: C.bg, padding: 120, boxSizing: 'border-box'}}>
		<PlanCanvas id="test" state={state} />
	</div>
);

// Phase B proof: "Inside Baya Studio" card + the Studio lighting request (baseline 0:54.5–1:14.5).
const StudioProof: React.FC = () => {
	const {fps} = useVideoConfig();
	return (
		<div style={{position: 'absolute', inset: 0, background: C.bg}}>
			<Sequence durationInFrames={5 * fps} name="Inside Baya Studio">
				<Chapter kind="studio" dur={5} />
			</Sequence>
			<Sequence from={5 * fps} durationInFrames={15 * fps} name="Studio · lighting request">
				<Studio dur={15} />
			</Sequence>
			<Cue at={0} src="sfx/chapter.wav" volume={0.3} />
			<Audio src={staticFile('sound/polish/score-proof.wav')} volume={0.62} />
		</div>
	);
};

// The approved film, unmodified, shown at 1920 × 1080 (it is authored at 1920 and normally scaled to 50%).
const BaselineAt1080: React.FC<{from: number}> = ({from}) => {
	const {fps} = useVideoConfig();
	return (
		<Sequence from={-Math.round(from * fps)}>
			<div style={{width: 960, height: 540, transform: 'scale(2)', transformOrigin: 'top left'}}>
				<FullAnimatic />
			</div>
		</Sequence>
	);
};

export const PolishRoot = () => (
	<>
		<Composition id="StudioProof" component={StudioProof} durationInFrames={600} fps={30} width={1920} height={1080} />
		<Composition id="BaselineStudioProof" component={BaselineAt1080} durationInFrames={480} fps={24} width={1920} height={1080} defaultProps={{from: 54.5}} />
		<Composition id="PlanTest" component={PlanTest} durationInFrames={1} fps={30} width={1920} height={1080} defaultProps={{state: {circuits: 1, power: 1, lit: 1}}} />
	</>
);
