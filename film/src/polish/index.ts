// Separate entry for the polished film so the frozen approved baseline (src/index.ts) stays byte-identical.
import {registerRoot} from 'remotion';
import {PolishRoot} from './Root';
registerRoot(PolishRoot);
