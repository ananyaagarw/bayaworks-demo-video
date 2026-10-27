// Writes scripts/polish/timeline.json from src/polish/timeline.ts so the score follows the picture.
import {build} from 'esbuild';
import {writeFileSync, rmSync} from 'node:fs';
import path from 'node:path';

const out = path.resolve('scripts/polish/.timeline.cjs');
await build({entryPoints: [path.resolve('src/polish/timeline.ts')], bundle: true, platform: 'node', format: 'cjs', outfile: out, loader: {'.json': 'json'}, logLevel: 'error'});
const {createRequire} = await import('node:module');
const mod = createRequire(import.meta.url)(out);
rmSync(out);
const data = {duration: mod.FILM_DURATION, scenes: mod.SCENES, events: mod.EVENTS, short: {duration: mod.SHORT_DURATION, segments: mod.SHORT}};
writeFileSync(path.resolve('scripts/polish/timeline.json'), JSON.stringify(data, null, 2) + '\n');
console.log(JSON.stringify(data, (k, v) => (typeof v === 'number' ? Math.round(v * 100) / 100 : v)));
