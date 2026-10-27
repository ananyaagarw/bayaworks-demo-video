// QA for polished exports: format, frame count, full decode, loudness, review stills and contact sheets.
// Usage: node scripts/polish/verify.mjs [dir=../renders/polish]
import {execFileSync, spawnSync} from 'node:child_process';
import {mkdirSync, readFileSync, writeFileSync, existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import path from 'node:path';

const dir = path.resolve(process.argv[2] || '../renders/polish');
const timeline = JSON.parse(readFileSync(path.resolve('scripts/polish/timeline.json'), 'utf8'));
const expect = {
	'baya-film-master.mp4': timeline.duration,
	'baya-film-web.mp4': timeline.duration,
	'baya-film-short-master.mp4': timeline.short.duration,
	'baya-film-short-web.mp4': timeline.short.duration,
};
const report = {};
for (const [file, seconds] of Object.entries(expect)) {
	const f = path.join(dir, file);
	if (!existsSync(f)) continue;
	const meta = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-count_frames', '-of', 'json', f], {encoding: 'utf8'}));
	const v = meta.streams.find((s) => s.codec_type === 'video');
	const a = meta.streams.find((s) => s.codec_type === 'audio');
	const frames = Number(v.nb_read_frames);
	const want = Math.round(seconds * 30);
	const problems = [];
	if (v.codec_name !== 'h264' || v.width !== 1920 || v.height !== 1080) problems.push('video format');
	if (v.r_frame_rate !== '30/1' || v.avg_frame_rate !== '30/1') problems.push(`frame rate ${v.r_frame_rate}/${v.avg_frame_rate}`);
	if (Math.abs(frames - want) > 1) problems.push(`frames ${frames} ≠ ${want}`);
	if (a?.codec_name !== 'aac' || Number(a.sample_rate) !== 48000) problems.push('audio format');
	const decode = spawnSync('ffmpeg', ['-v', 'error', '-i', f, '-f', 'null', '-'], {encoding: 'utf8'});
	if (decode.stderr.trim()) problems.push('decode errors');
	const loud = spawnSync('ffmpeg', ['-hide_banner', '-i', f, '-af', 'ebur128=peak=true', '-f', 'null', '-'], {encoding: 'utf8'}).stderr;
	const lufs = Number(/I:\s+(-?[\d.]+) LUFS/.exec(loud.slice(loud.lastIndexOf('Summary')))?.[1]);
	const peak = Number(/Peak:\s+(-?[\d.]+) dBFS/.exec(loud.slice(loud.lastIndexOf('Summary')))?.[1]);
	if (Math.abs(lufs + 18) > 1) problems.push(`loudness ${lufs}`);
	if (peak > -1) problems.push(`peak ${peak}`);
	report[file] = {frames, seconds: Number(meta.format.duration), bitrate_kbps: Math.round(meta.format.bit_rate / 1000), lufs, true_peak_dbfs: peak, sha256: createHash('sha256').update(readFileSync(f)).digest('hex'), problems};
}
// Review stills: one per scene midpoint plus key moments, and a contact sheet.
const review = path.join(dir, 'review');
mkdirSync(review, {recursive: true});
const master = path.join(dir, 'baya-film-master.mp4');
if (existsSync(master)) {
	const shots = timeline.scenes.map((s, i) => [`${String(i + 1).padStart(2, '0')}-${s.id}`, s.from + s.dur * 0.62]);
	for (const [name, t] of shots) execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-ss', t.toFixed(3), '-i', master, '-frames:v', '1', path.join(review, `${name}.png`)]);
	execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-pattern_type', 'glob', '-i', path.join(review, '[0-9][0-9]-*.png'), '-vf', 'scale=640:360,tile=2x4:padding=10:margin=10:color=0x100C0A', '-frames:v', '1', path.join(review, 'contact-sheet.jpg')]);
}
writeFileSync(path.join(dir, 'verification.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
const failed = Object.entries(report).filter(([, r]) => r.problems.length);
if (failed.length) {
	console.error('QA problems:', failed.map(([f, r]) => `${f}: ${r.problems.join(', ')}`).join('; '));
	process.exit(1);
}
