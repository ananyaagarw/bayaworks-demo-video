// Brand system for the polished film. Values mirror bayaworks.ai (public/index.html :root and brand.css).
import React from 'react';
import {Img, staticFile} from 'remotion';
import {loadFont} from '@remotion/fonts';

export const C = {
	bg: '#100C0A', // --forest (espresso)
	panel: '#19120F', // --forest-lift
	edge: '#241A15', // --forest-edge
	well: '#140F0C',
	sand: '#EDE9DF',
	sand2: 'rgba(237,233,223,.74)',
	sand3: 'rgba(237,233,223,.5)',
	rule: 'rgba(237,233,223,.12)',
	ruleStrong: 'rgba(237,233,223,.2)',
	accent: '#B8D6A1', // .hero-accent: green text accent
	leaf: '#8FAE7D', // --leaf: graphics
	lit: '#A5C48B', // .plan .fx.on
	glow: '#D7E6C9',
	sage: '#3E6B4E',
	button: '#A8C492', // primary button on dark
};

export const SANS = 'Inter';
export const MONO = 'JetBrains Mono';

// Fonts load only in the browser (the timeline exporter imports these modules in Node).
if (typeof document !== 'undefined') {
	loadFont({family: SANS, url: staticFile('brand/inter-variable.woff2'), weight: '100 900'});
	loadFont({family: MONO, url: staticFile('brand/jetbrains-mono-variable.woff2'), weight: '400 800'});
}

// The supplied mark is a 271 × 110 raster; never display it wider than that.
export const LOGO_NATIVE_WIDTH = 271;
export const Logo: React.FC<{width?: number; style?: React.CSSProperties}> = ({width = 140, style}) => (
	<Img
		src={staticFile('brand/bayaworks-mark.png')}
		style={{
			width: Math.min(width, LOGO_NATIVE_WIDTH),
			height: (Math.min(width, LOGO_NATIVE_WIDTH) * 110) / 271,
			objectFit: 'contain',
			filter: 'hue-rotate(38deg) saturate(.3) brightness(.92)', // same treatment as the website
			display: 'block',
			...style,
		}}
	/>
);

// Small-caps label in the website's mono kicker style.
export const Kicker: React.FC<{children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties}> = ({
	children,
	color = C.sand3,
	size = 15,
	style,
}) => (
	<div style={{fontFamily: MONO, fontSize: size, lineHeight: 1.4, letterSpacing: '.14em', textTransform: 'uppercase', color, ...style}}>
		{children}
	</div>
);

export const PROJECT = 'Office floor · Level 02';
