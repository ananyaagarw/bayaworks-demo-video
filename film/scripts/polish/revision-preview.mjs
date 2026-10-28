// Before/after review of the revised footage only.
// Before: cut from the approved polished master (handoff/polished). After: the RevisionPreview composition.
// Usage (from film/): node scripts/polish/revision-preview.mjs  → ../renders/revised/preview/
import {execFileSync} from 'node:child_process';
import {mkdirSync, readFileSync} from 'node:fs';
import path from 'node:path';

const out = path.resolve('../renders/revised/preview');
mkdirSync(out, {recursive: true});
const ff = (...args) => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], {stdio: 'inherit'});
const film = JSON.parse(readFileSync(path.resolve('scripts/polish/timeline.json'), 'utf8'));
const at = (id) => film.scenes.find((s) => s.id === id).from;

// Same story points in the approved film: Studio card, Studio to the first instruction,
// end of Studio, "From design to delivery", start of Designs ready.
const approved = path.resolve('../handoff/polished/baya-film-master.mp4');
const parts = [
	[at('studioCard'), at('studio')],
	[at('studio'), at('studio') + 6.2],
	[at('deliveryCard') - 2.2, at('deliveryCard')],
	[at('deliveryCard'), at('delivery')],
	[at('delivery'), at('delivery') + 3.5],
];
const v = parts.map(([a, b], i) => `[0:v]trim=${a}:${b},setpts=PTS-STARTPTS,fade=t=in:st=0:d=${i ? 0.25 : 0}:color=0x100C0A,fade=t=out:st=${(b - a - 0.25).toFixed(3)}:d=0.25:color=0x100C0A[v${i}]`);
const a = parts.map(([s, e], i) => `[0:a]atrim=${s}:${e},asetpts=PTS-STARTPTS,afade=t=in:d=0.08,afade=t=out:st=${(e - s - 0.12).toFixed(3)}:d=0.12[a${i}]`);
const before = path.join(out, 'revision-before-approved.mp4');
ff('-i', approved, '-filter_complex', [...v, ...a, `${parts.map((_, i) => `[v${i}][a${i}]`).join('')}concat=n=${parts.length}:v=1:a=1[v][a]`].join(';'), '-map', '[v]', '-map', '[a]', '-c:v', 'libx264', '-crf', '16', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '320k', before);

// After: render and master the revised preview composition.
const raw = path.resolve('../renders/revision-preview-raw.mp4');
execFileSync('node', ['scripts/polish/render.mjs', 'RevisionPreview', 'revision-preview-raw', '14'], {stdio: 'inherit'});
const after = path.join(out, 'revision-after.mp4');
execFileSync('node', ['scripts/polish/master.mjs', raw, after, '-18'], {stdio: 'inherit'});

// Labelled A/B: before, then after.
const font = ['/usr/share/fonts/opentype/inter/Inter-Medium.otf', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'].find((f) => {
	try {
		readFileSync(f);
		return true;
	} catch {
		return false;
	}
});
const label = (text, color) => `drawbox=x=0:y=0:w=iw:h=64:color=0x100C0A@0.85:t=fill,drawtext=fontfile=${font}:text='${text}':x=40:y=20:fontsize=24:fontcolor=${color}`;
ff('-i', before, '-i', after, '-filter_complex', `[0:v]${label('BEFORE · approved polished film', '0xA7A99C')}[b];[1:v]${label('AFTER · revised film (new footage only)', '0xB8D6A1')}[c];[b][0:a][c][1:a]concat=n=2:v=1:a=1[v][a]`, '-map', '[v]', '-map', '[a]', '-c:v', 'libx264', '-crf', '18', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', path.join(out, 'revision-before-after.mp4'));
console.log(out);
