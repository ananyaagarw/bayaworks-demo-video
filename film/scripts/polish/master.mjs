// Audio mastering for exports: two-pass EBU R128 loudness normalisation, picture stream copied untouched.
// Usage: node scripts/polish/master.mjs <in.mp4> <out.mp4> [targetLUFS=-18]
import {execFileSync, spawnSync} from 'node:child_process';

const [input, output, target = '-18'] = process.argv.slice(2);
const filter = `loudnorm=I=${target}:TP=-1.5:LRA=11`;
// ffmpeg reports loudnorm measurements on stderr.
const {stderr} = spawnSync('ffmpeg', ['-hide_banner', '-i', input, '-af', `${filter}:print_format=json`, '-f', 'null', '-'], {encoding: 'utf8'});
const stats = JSON.parse(stderr.slice(stderr.lastIndexOf('{'), stderr.lastIndexOf('}') + 1));
const second = `${filter}:measured_I=${stats.input_i}:measured_TP=${stats.input_tp}:measured_LRA=${stats.input_lra}:measured_thresh=${stats.input_thresh}:offset=${stats.target_offset}:linear=true`;
execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', input, '-map', '0', '-c:v', 'copy', '-af', `${second},aresample=48000`, '-c:a', 'aac', '-b:a', '320k', '-movflags', '+faststart', output]);
console.log(`${output}: ${stats.input_i} LUFS → ${target} LUFS`);
