// Render a composition from the polished film entry (src/polish/index.ts).
// Usage: node scripts/polish/render.mjs <CompositionId> <output-name> [crf]
//
// Picture is rendered in chunks so that an occasional headless-Chrome stall (seen on the opening's
// software-rasterised 3D frames) costs one retried chunk instead of the whole film. Chunks are joined
// without re-encoding; audio is rendered once and muxed. QA checks the exact frame count afterwards.
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync, rmSync, writeFileSync} from 'node:fs';
import path from 'node:path';

const [id = 'BayaFilm', name = 'baya-film', crf = '16'] = process.argv.slice(2);
const output = path.resolve('../renders');
const work = path.join(output, `.chunks-${name}`);
mkdirSync(output, {recursive: true});
rmSync(work, {recursive: true, force: true});
mkdirSync(work, {recursive: true});
const browserExecutable =
	process.env.REMOTION_BROWSER_EXECUTABLE ||
	['/usr/bin/chromium', '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/opt/pw-browsers/chromium'].find(existsSync);
const CHUNK = Number(process.env.CHUNK_FRAMES || 450);
const ATTEMPTS = 3;
const serveUrl = await bundle({entryPoint: path.resolve('src/polish/index.ts')});
const composition = await selectComposition({serveUrl, id, browserExecutable, timeoutInMilliseconds: 120000});
const common = {serveUrl, composition, browserExecutable, concurrency: Number(process.env.CONCURRENCY || 4), timeoutInMilliseconds: 90000};

const chunks = [];
for (let a = 0; a < composition.durationInFrames; a += CHUNK) chunks.push([a, Math.min(a + CHUNK, composition.durationInFrames) - 1]);
for (const [i, [a, b]] of chunks.entries()) {
	const file = path.join(work, `${String(i).padStart(3, '0')}.mp4`);
	for (let attempt = 1; ; attempt++) {
		try {
			await renderMedia({...common, codec: 'h264', pixelFormat: 'yuv420p', crf: Number(crf), x264Preset: 'slow', muted: true, frameRange: [a, b], outputLocation: file});
			console.log(`${id}: frames ${a}–${b} done (${Math.round(((i + 1) / chunks.length) * 100)}%)`);
			break;
		} catch (err) {
			if (attempt >= ATTEMPTS) throw err;
			console.log(`${id}: frames ${a}–${b} failed (${String(err.message).split('\n')[0]}); retrying`);
		}
	}
}
const audio = path.join(work, 'audio.wav');
await renderMedia({...common, codec: 'wav', outputLocation: audio});

const list = path.join(work, 'list.txt');
writeFileSync(list, chunks.map((_, i) => `file '${String(i).padStart(3, '0')}.mp4'`).join('\n') + '\n');
const outputLocation = path.join(output, `${name}.mp4`);
execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-i', audio, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '320k', '-shortest', outputLocation]);
rmSync(work, {recursive: true, force: true});
console.log(`${id}: 100%`);
console.log(outputLocation);
