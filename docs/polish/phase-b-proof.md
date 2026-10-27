# Polish pass: creative diagnosis and Phase B proof

Baseline: `handoff/claude-polish-baseline` @ `2126ea8` (`FullAnimatic`, 960 × 540, 24 fps, 114.5 s). The committed source was verified against the approved MP4 (frame PSNR ≈ 36 dB at 0:07.5 and 1:11.5, i.e. encode-only differences). The approved source, assets and MP4 are untouched; `python3 handoff/verify-snapshot.py` still passes.

## Critique: the five things that keep it from feeling premium

1. **The engineering drawing is a diagram, not a drawing.** Uniform 1 px rectangles, no door openings, no structural grid, no furniture, dashes for fixtures and one generic feeder. Illumination is a soft radial blob on every fixture — it reads as glow, not as a lighting study — and the whole floor switches on in a single frame. The opening tilts the same flat graphic in 3D with no depth cue.
2. **Motion has one gesture.** Nearly everything is a 0.45 s opacity fade with a 12 px rise; chapter cards pop in from 15 % opacity; text is typed in place at a constant machine rate, and Baya's replies simply appear. Nothing has weight, and nothing anticipates or settles.
3. **The UI does not behave like software.** In Studio the engineer's instruction types itself into the transcript (no composer), Baya's reply swaps text in place, the canvas edit is a 20 px nudge plus a sage fill, and the "recalculate" moment has no visible calculation. Interaction and consequence are not choreographed together.
4. **Type is positioned, not set.** One family/weight for everything; labels like `ENGINEER`/`BAYA` are Inter caps rather than the website's JetBrains Mono kicker style; display tracking is set in px rather than em; chapter cards are a single fade. The subset Inter has no `→ ✓ ＋ ↓`, so the baseline's "✓ Design package downloaded", "↓ Download design package", "＋ New Project" and "Preparing the first design →" fall back to a system font.
5. **Finish and sound.** The master is 960 × 540 (text and hairlines go soft on any laptop), and the score is three sine tones plus decaying beeps at −38.6 LUFS with no interface sound, so the film plays as silent UI.

## Polish plan (highest impact first)

1. Rebuild the drawing set once and share it across the opening, the Customer context panel and Studio: partitions with door swings, structural grid and bubbles, faint furniture, linear/down-light symbols, circuit arcs with homerun tags, panel and containment, and a banded isophotometric study with crisp isolines revealed by a calculation sweep. Edits are drawn with CAD conventions (selection handles, ghosted previous positions, revision cloud + delta).
2. One motion language (`src/polish/motion.tsx`): `settle` for entrances, `glide` for objects moving within a scene, `leave` for exits; masked line reveals for display type; human typing cadence; word-streamed assistant replies that never reflow.
3. Product choreography: composer → send → message lands → Baya activity → canvas responds in step → result resolves. The camera moves only to focus an edit and returns for the result.
4. Type system from the website: Inter (variable, same 4.001 build as bayaworks.ai) with em tracking; JetBrains Mono for kickers, annotations and status. All icons drawn as SVG.
5. 1920 × 1080 master at 30 fps; original sound design (bed + interface cues placed on the same timeline as the picture), mastered to −18 LUFS.
6. Full-film application (Phase C): the opening as an architectural model camera move, Works upload/questions, Studio electrical edit, deliverables + ZIP, and the logo end frame — same story, sequence and copy.

## Phase B proof (this branch)

Section: **baseline 0:54.5–1:14.5** — "Inside Baya Studio" card + the Studio lighting request. It combines chapter typography, an editorial transition, product UI and the engineering canvas.

| File | What |
| --- | --- |
| `handoff/proof/proof-before-approved.mp4` | Approved film, same 20 s, rendered unmodified at 1920 × 1080 (24 fps, original score) |
| `handoff/proof/proof-after-polished.mp4` | Polished section, 1920 × 1080, 30 fps, new sound, −18 LUFS |
| `handoff/proof/proof-side-by-side.mp4` | Labelled side-by-side (polished audio) |
| `handoff/proof/still-*.png` | Matched before/after frames: card, instruction, edit, lighting study |

### What changed and why

- **Chapter card:** three lines rise from behind masks on a staggered settle curve (question → title → subline) under a short leaf-green rule taken from the website kicker; it holds completely still, then leaves together. Title set at 108 px, −0.04 em, matching the site's display setting.
- **Studio window:** settles in place (no fly-in, no scaling); header, title, viewport and composer stage in 100–200 ms steps.
- **Instruction:** typed into a real composer with variable keystroke timing and word/punctuation pauses; the send button presses, the message lands in the thread, the composer clears.
- **Baya's reply:** activity ring appears beside the label, then the reply streams word by word in place. When the study finishes, the ring resolves to a check and the message crossfades to the approved "Layout updated…" line.
- **Canvas edit:** the conference room is selected with handles, the projector zone is marked and hatched, the camera eases in on the room, fixtures glide row by row to their new positions with ghosted previous positions and leaders, circuit arcs follow, and a revision cloud with delta B marks the change (matching "Revision B" on the deliverables screen).
- **Recalculation:** the camera returns to the full floor and a scan line sweeps west → east; fixtures switch on as it passes and the banded study with isolines appears behind it. A status chip reads "Lighting study · Recalculating → Updated", followed by a quiet illuminance legend (relative, no values).
- **Sound:** restrained pad and muted arpeggio bed, soft keystrokes, send, select, glide, scan shimmer and a two-note resolve, all synthesised in `film/scripts/polish/sound.py` (no samples or licensed audio).

Approved copy is unchanged. The new interface microcopy is limited to "Message Baya…", "Level 02 · Lighting + Power", "Lighting study · Recalculating / Updated" and "Illuminance · Low / High". No calculated values, lux figures or certifications are shown.

## Reproduce

```sh
cd film
npm ci
python3 scripts/polish/sound.py                  # regenerates public/sound/polish (deterministic)
npx tsc --noEmit
node scripts/polish/render.mjs StudioProof proof-polished-raw
node scripts/polish/master.mjs ../renders/proof-polished-raw.mp4 ../renders/proof-polished.mp4 -18
node scripts/polish/render.mjs BaselineStudioProof proof-baseline
npx remotion studio src/polish/index.ts          # preview
```

Set `REMOTION_BROWSER_EXECUTABLE` if Chrome/Chromium is not found automatically. The polished film uses its own entry point (`src/polish/index.ts`), so the frozen baseline entry, compositions and scripts are untouched.
