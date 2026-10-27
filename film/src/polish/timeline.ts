// Scene order and durations for the polished film (seconds). Shared by the compositions and,
// via scripts/polish/export-timeline.mjs, by the score generator.
import {WORKS} from './scenes/Works';
import {STUDIO_TIMES} from './scenes/Studio';
import {DELIVERY} from './scenes/Delivery';

export type SceneId = 'opening' | 'worksCard' | 'works' | 'studioCard' | 'studio' | 'deliveryCard' | 'delivery' | 'ending';
const ORDER: [SceneId, string, number][] = [
	['opening', '01 · Building intelligence', 9.5],
	['worksCard', '02 · Baya Works', 4],
	['works', '03 · Works customer journey', Math.ceil(WORKS.end * 10) / 10],
	['studioCard', '04 · Inside Baya Studio', 5],
	['studio', '05 · Studio supervision', 27],
	['deliveryCard', '06 · From design to delivery', 2.5],
	['delivery', '07 · Designs ready and download', 16],
	['ending', '08 · Closing', 8],
];
let at = 0;
export const SCENES = ORDER.map(([id, name, dur]) => {
	const s = {id, name, dur, from: at};
	at += dur;
	return s;
});
export const FILM_DURATION = at;
export const sceneStart = (id: SceneId) => SCENES.find((s) => s.id === id)!.from;

// Key moments, in film seconds, used to place harmonic changes in the score.
export const EVENTS = (() => {
	const w = sceneStart('works');
	const s = sceneStart('studio');
	const d = sceneStart('delivery');
	const {T1, T2} = STUDIO_TIMES;
	return {
		lightsOn: 6.4,
		worksUpload: w + WORKS.upload,
		worksConnect: w + WORKS.connect,
		worksAsk: w + WORKS.ask,
		worksPrep: w + WORKS.prep,
		studioSend1: s + T1.send,
		studioSweep: s + T1.sweep,
		studioSwept: s + T1.swept,
		studioSend2: s + T2.send,
		studioDone2: s + T2.done,
		deliveryClick: d + DELIVERY.click,
		deliveryDone: d + DELIVERY.done,
	};
})();

// Website cut: the same footage, trimmed inside scenes. [scene, in, out, scene duration prop]
const SHORT_ORDER: [SceneId, number, number, number][] = [
	['opening', 0, 9.5, 9.5],
	['worksCard', 0, 3.2, 3.2],
	['works', WORKS.upload - 0.5, WORKS.ask - 0.25, 1000],
	['studioCard', 0, 3.6, 3.6],
	['studio', 0, 15, 15],
	['deliveryCard', 0, 2.5, 2.5],
	['delivery', 4.6, 15.5, 15.5],
	['ending', 0, 6, 6],
];
let sat = 0;
export const SHORT = SHORT_ORDER.map(([id, inT, outT, dur]) => {
	const s = {id, in: inT, out: outT, dur, at: sat, filmFrom: sceneStart(id)};
	sat += outT - inT;
	return s;
});
export const SHORT_DURATION = sat;
