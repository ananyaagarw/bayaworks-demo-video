import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from './brand';
import {ease, p} from './motion';
import {Chapter} from './scenes/Chapter';
import {Delivery, Ending} from './scenes/Delivery';
import {Opening} from './scenes/Opening';
import {Studio} from './scenes/Studio';
import {Works} from './scenes/Works';
import {History} from './scenes/History';
import {Cue} from './sound';
import {PREVIEW, SCENES, SCENES_REVISED, SHORT, SHORT_REVISED, SceneId} from './timeline';

const Scene: React.FC<{id: SceneId; dur: number; revised?: boolean}> = ({id, dur, revised = false}) => {
	switch (id) {
		case 'opening':
			return <Opening dur={dur} />;
		case 'worksCard':
			return (
				<>
					<Chapter kind="works" dur={dur} />
					<Cue at={0} src="sfx/chapter.wav" volume={0.26} />
				</>
			);
		case 'works':
			return <Works dur={dur} />;
		case 'studioCard':
			return (
				<>
					<Chapter kind="studio" dur={dur} revised={revised} />
					<Cue at={0} src="sfx/chapter.wav" volume={0.26} />
				</>
			);
		case 'studio':
			return <Studio dur={dur} intro={revised} />;
		case 'deliveryCard':
			return (
				<>
					<Chapter kind="delivery" dur={dur} />
					<Cue at={0} src="sfx/chapter.wav" volume={0.2} />
				</>
			);
		case 'delivery':
			return <Delivery dur={dur} />;
		case 'ending':
			return <Ending dur={dur} />;
		case 'revisionCard':
			return (
				<>
					<Chapter kind="change" dur={dur} />
					<Cue at={0} src="sfx/chapter.wav" volume={0.2} />
				</>
			);
		case 'history':
			return <History dur={dur} />;
	}
};

export const BayaFilm: React.FC = () => {
	const {fps} = useVideoConfig();
	return (
		<AbsoluteFill style={{background: C.bg}}>
			{SCENES.map((s) => (
				<Sequence key={s.id} from={Math.round(s.from * fps)} durationInFrames={Math.round(s.dur * fps)} name={s.name}>
					<Scene id={s.id} dur={s.dur} />
				</Sequence>
			))}
			<Audio src={staticFile('sound/polish/score-film.wav')} volume={0.62} />
		</AbsoluteFill>
	);
};

// Fades a mid-scene cut in and out through espresso.
const CutFade: React.FC<{dur: number; fadeIn: boolean; fadeOut: boolean; children: React.ReactNode}> = ({dur, fadeIn, fadeOut, children}) => {
	const t = useCurrentFrame() / useVideoConfig().fps;
	const k = (fadeIn ? p(t, 0, 0.35) : 1) * (fadeOut ? 1 - p(t, dur - 0.35, dur, ease.leave) : 1);
	return <AbsoluteFill style={{opacity: k}}>{children}</AbsoluteFill>;
};

type Segment = {id: SceneId; in: number; out: number; dur: number; at: number};

// Plays scenes trimmed inside themselves; mid-scene cuts dip through espresso.
const Cuts: React.FC<{segments: Segment[]; revised?: boolean; score: string}> = ({segments, revised = false, score}) => {
	const {fps} = useVideoConfig();
	return (
		<AbsoluteFill style={{background: C.bg}}>
			{segments.map((s, i) => {
				const len = s.out - s.in;
				const trimmed = s.in > 0 || s.out < s.dur;
				return (
					<Sequence key={`${s.id}-${i}`} from={Math.round(s.at * fps)} durationInFrames={Math.round(len * fps)} name={s.id}>
						<CutFade dur={len} fadeIn={s.in > 0} fadeOut={trimmed && s.out < s.dur}>
							<Sequence from={-Math.round(s.in * fps)}>
								<Scene id={s.id} dur={s.dur} revised={revised} />
							</Sequence>
						</CutFade>
					</Sequence>
				);
			})}
			<Audio src={staticFile(`sound/polish/${score}`)} volume={0.62} />
		</AbsoluteFill>
	);
};

export const BayaFilmShort: React.FC = () => <Cuts segments={SHORT} score="score-short.wav" />;

export const BayaFilmRevised: React.FC = () => {
	const {fps} = useVideoConfig();
	return (
		<AbsoluteFill style={{background: C.bg}}>
			{SCENES_REVISED.map((s) => (
				<Sequence key={s.id} from={Math.round(s.from * fps)} durationInFrames={Math.round(s.dur * fps)} name={s.name}>
					<Scene id={s.id} dur={s.dur} revised />
				</Sequence>
			))}
			<Audio src={staticFile('sound/polish/score-revised.wav')} volume={0.62} />
		</AbsoluteFill>
	);
};

export const BayaFilmRevisedShort: React.FC = () => <Cuts segments={SHORT_REVISED} revised score="score-revised-short.wav" />;

// Only the new footage, for the before/after review.
export const RevisionPreview: React.FC = () => <Cuts segments={PREVIEW} revised score="score-revised-preview.wav" />;
