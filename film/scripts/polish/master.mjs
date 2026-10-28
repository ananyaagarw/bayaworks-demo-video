// Audio mastering for exports: two-pass EBU R128 loudness normalisation, picture stream copied untouched.
// Usage: node scripts/polish/master.mjs <in.mp4> <out.mp4> [targetLUFS=-18] [--audio music.wav] [--bitrate 320k]
//   --audio replaces the soundtrack with the given file (e.g. the score alone, without sound effects);
//   the picture stream is copied, never re-encoded.
import {execFileSync, spawnSync} from 'node:child_process';

const args = process.argv.slice(2);
const flag = (name) => {
	const i = args.indexOf(name);
	return i < 0 ? undefined : args.splice(i, 2)[1];
};
const music = flag('--audio');
const bitrate = flag('--bitrate') || '320k';
const [input, output, target = '-18'] = args;
const audioSource = music || input;
const filter = `loudnorm=I=${target}:TP=-1.5:LRA=11`;
// ffmpeg reports loudnorm measurements on stderr.
const {stderr} = spawnSync('ffmpeg', ['-hide_banner', '-i', audioSource, '-af', `${filter}:print_format=json`, '-f', 'null', '-'], {encoding: 'utf8'});
const stats = JSON.parse(stderr.slice(stderr.lastIndexOf('{'), stderr.lastIndexOf('}') + 1));
const second = `${filter}:measured_I=${stats.input_i}:measured_TP=${stats.input_tp}:measured_LRA=${stats.input_lra}:measured_thresh=${stats.input_thresh}:offset=${stats.target_offset}:linear=true`;
const inputs = music ? ['-i', input, '-i', music, '-map', '0:v', '-map', '1:a', '-shortest'] : ['-i', input, '-map', '0'];
// apad keeps the soundtrack at least as long as the picture; -shortest then trims it to the picture.
execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...inputs, '-c:v', 'copy', '-af', `${second},aresample=48000${music ? ',apad' : ''}`, '-c:a', 'aac', '-b:a', bitrate, '-movflags', '+faststart', output]);
console.log(`${output}: ${stats.input_i} LUFS → ${target} LUFS`);
