// Sound cues are placed by the same timeline that drives the picture.
import React from 'react';
import {Audio} from '@remotion/media';
import {Sequence, staticFile, useVideoConfig} from 'remotion';

export const Cue: React.FC<{at: number; src: string; volume?: number}> = ({at, src, volume = 1}) => {
	const {fps} = useVideoConfig();
	return (
		<Sequence from={Math.round(at * fps)} layout="none" name={src}>
			<Audio src={staticFile(`sound/polish/${src}`)} volume={volume} />
		</Sequence>
	);
};
