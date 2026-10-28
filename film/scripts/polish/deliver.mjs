// Builds every polished deliverable into ../renders/polish/.
// Usage (from film/): node scripts/polish/deliver.mjs [--revised] [--skip-render]
//   baya-film-master.mp4   1920×1080 30 fps H.264 High (CRF 14, x264 slow), AAC 320k, −18 LUFS
//   baya-film-web.mp4      web encode (CRF 21, faststart), AAC 192k
//   baya-film-short-web.mp4  ~61 s website cut, same treatment
//   baya-film-poster.png/.jpg  poster frame from the master composition
import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync} from 'node:fs';
import path from 'node:path';

// --revised builds the revised film (Studio intro, project history) into ../renders/revised/.
const revised = process.argv.includes('--revised');
const out = path.resolve(revised ? '../renders/revised' : '../renders/polish');
mkdirSync(out, {recursive: true});
const skip = process.argv.includes('--skip-render');
const node = (...args) => execFileSync('node', args, {stdio: 'inherit'});
const ff = (...args) => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], {stdio: 'inherit'});

const web = (src, dst) =>
	ff('-i', src, '-c:v', 'libx264', '-preset', 'slow', '-crf', '21', '-profile:v', 'high', '-level', '4.1', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', dst);

const jobs = revised
	? [
			['BayaFilmRevised', 'baya-film-revised'],
			['BayaFilmRevisedShort', 'baya-film-revised-short'],
		]
	: [
			['BayaFilm', 'baya-film'],
			['BayaFilmShort', 'baya-film-short'],
		];
for (const [id, name] of jobs) {
	const raw = path.resolve('../renders', `${name}-raw.mp4`);
	if (!skip || !existsSync(raw)) node('scripts/polish/render.mjs', id, `${name}-raw`, '14');
	const master = path.join(out, `${name}-master.mp4`);
	node('scripts/polish/master.mjs', raw, master, '-18');
	web(master, path.join(out, `${name}-web.mp4`));
}

// Poster: the lit model under the headline, end of the opening (identical in both versions).
const browser = process.env.REMOTION_BROWSER_EXECUTABLE;
const poster = revised ? 'baya-film-revised-poster' : 'baya-film-poster';
execFileSync('npx', ['remotion', 'still', 'src/polish/index.ts', jobs[0][0], path.join(out, `${poster}.png`), '--frame=264', ...(browser ? [`--browser-executable=${browser}`] : []), '--log=error'], {stdio: 'inherit'});
ff('-i', path.join(out, `${poster}.png`), '-q:v', '2', path.join(out, `${poster}.jpg`));
node('scripts/polish/verify.mjs', out, ...(revised ? ['--revised'] : []));
