// Render a composition from the polished film entry (src/polish/index.ts).
// Usage: node scripts/polish/render.mjs <CompositionId> <output-name> [crf]
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import {existsSync, mkdirSync} from 'node:fs';
import path from 'node:path';

const [id = 'BayaFilm', name = 'baya-film', crf = '16'] = process.argv.slice(2);
const output = path.resolve('../renders');
mkdirSync(output, {recursive: true});
const browserExecutable =
	process.env.REMOTION_BROWSER_EXECUTABLE ||
	['/usr/bin/chromium', '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/opt/pw-browsers/chromium'].find(existsSync);
const serveUrl = await bundle({entryPoint: path.resolve('src/polish/index.ts')});
const composition = await selectComposition({serveUrl, id, browserExecutable});
const outputLocation = path.join(output, `${name}.mp4`);
let last = -1;
await renderMedia({
	serveUrl,
	composition,
	browserExecutable,
	codec: 'h264',
	pixelFormat: 'yuv420p',
	audioCodec: 'aac',
	audioBitrate: '320k',
	crf: Number(crf),
	x264Preset: 'slow',
	concurrency: Number(process.env.CONCURRENCY || 4),
	outputLocation,
	onProgress: ({progress}) => {
		const pct = Math.floor(progress * 10);
		if (pct !== last) {
			last = pct;
			console.log(`${id}: ${pct * 10}%`);
		}
	},
});
console.log(outputLocation);
