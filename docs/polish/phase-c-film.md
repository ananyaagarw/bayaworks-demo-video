# Polished Baya film: Phase C

Built on the approved Phase B direction (`docs/polish/phase-b-proof.md`). Same story, same scene order, same approved copy; every scene re-executed with the shared brand system, motion language, drawing set and sound design.

## Composition

| Id | Entry | Size | Duration |
| --- | --- | --- | --- |
| `BayaFilm` | `film/src/polish/index.ts` | 1920 × 1080, 30 fps | 100.7 s |
| `BayaFilmShort` | same | 1920 × 1080, 30 fps | 60.8 s (same footage, trimmed inside scenes) |
| `StudioProof`, `BaselineStudioProof` | same | Phase B comparison | 20 s |

Scene order and durations live in `film/src/polish/timeline.ts`, the single source for the picture, the sound cues (placed inside each scene on the same event times) and, via `scripts/polish/export-timeline.mjs` → `timeline.json`, the score.

| # | Scene | Film time | Approved film | Notes |
| --- | --- | --- | --- | --- |
| 01 | Building intelligence | 0:00–0:09.5 | 0:00–0:09.5 | Drafted plan becomes a cut-away model (extruded partitions, wall heads) on one camera move; fixtures, power, circuits, then the lighting sweep. Headline over a website-style scrim. |
| 02 | Baya Works | 0:09.5–0:13.5 | 0:09.5–0:13.5 | Masked type reveal. |
| 03 | Customer journey | 0:13.5–0:42.2 | 0:13.5–0:54.5 | All interactions kept: New Project click, scope, uploads, context, preferences, company standards. The approved film stretched this section's clock by ~37 %; it now runs in real time with reading holds after every message. |
| 04 | Inside Baya Studio | 0:42.2–0:47.2 | 0:54.5–0:59.5 | As approved in Phase B. |
| 05 | Studio supervision | 0:47.2–1:14.2 | 0:59.5–1:26.5 | Lighting request (Phase B) and the electrical request: the thread scrolls on, the camera focuses the workstation wall, six outlets are placed, the circuit and homerun drawn, revision cloud B. |
| 06 | From design to delivery | 1:14.2–1:16.7 | 1:26.5–1:28.5 | +0.5 s so the line can be read. |
| 07 | Designs ready + download | 1:16.7–1:32.7 | 1:28.5–1:46.5 | Same two-column screen. Eight files grouped as Drawings / Models / Schedules and reports; drawings listed as `.pdf` and `.dwg`. Pointer click → button and archive progress, each file ticks as it is packaged, ring closes, check, "Design package downloaded". Holds 3.5 s. |
| 08 | Closing | 1:32.7–1:40.7 | 1:46.5–1:54.5 | Logo first (resolves from a 6 px defocus), then the tagline. Holds to the last frame. |

## What changed across the film

- **Resolution and rate:** 1920 × 1080 at 30 fps (approved: 960 × 540 at 24 fps).
- **Typography:** Inter (variable, identical build to bayaworks.ai) with em tracking and display sizes 92–116 px; JetBrains Mono for labels, kickers, drawing annotations and status. No glyph fallbacks: `↓ ✓ ＋ →` are SVG icons.
- **Motion:** three curves only (`settle`, `glide`, `leave`); masked line reveals for display type; staged window entrances without fly-ins, shrinking or morphs; human typing cadence; word-streamed replies; scenes leave through a short dip to espresso.
- **Engineering visuals:** one drawing set everywhere (opening model, Works context thumbnail, Studio) with door swings, structural grid, furniture, fixture symbols, circuit arcs and homerun tags, panel LP-2A, containment, and a banded relative-illuminance study with isolines. Changes use CAD conventions (selection, ghosted positions, leaders, revision clouds with delta B). Illumination is bounded by rooms and capped in opacity; no lux values, calculations or certifications are shown.
- **Interfaces:** real composer with send states in Works and Studio; activity indicators that resolve to checks; file cards with document badges, progress and completion; context checklist (Reading → Connected/Available).
- **Sound:** original score (pad + muted arpeggio, harmonic changes on story beats, reduced under chapter cards) and interface/engineering cues, synthesised by `film/scripts/polish/sound.py`. Mastered to −18 LUFS integrated, true peak ≤ −1.5 dBTP. The approved film measured −38.6 LUFS.

## Interface microcopy added

"Message Baya…", "Level 02 · Lighting + Power", "Lighting study · Recalculating / Updated", "Illuminance · Low / High", "Reading", "8 files", group headings (Drawings, Models, Schedules and reports), the archive percentage. Approved copy is otherwise unchanged.

## Deliverables

`node scripts/polish/deliver.mjs` (from `film/`) writes to `renders/polish/`:

- `baya-film-master.mp4`: 1920 × 1080, 30 fps, H.264 High CRF 14 (x264 slow), AAC 320 kb/s, −18 LUFS
- `baya-film-web.mp4`: web encode, CRF 21, `+faststart`, AAC 192 kb/s
- `baya-film-short-master.mp4`, `baya-film-short-web.mp4`: website cut
- `baya-film-poster.png` / `.jpg`: frame 264 (0:08.8), the lit model under the headline
- `verification.json` + `review/`: format, frame count, full decode, loudness and peak checks; scene stills and a contact sheet

The committed copies are in `handoff/polished/`.

## Reproduce

Prerequisites: Node 24, npm, FFmpeg, Chrome/Chromium (set `REMOTION_BROWSER_EXECUTABLE` if it is not found). Python 3 with NumPy and SciPy is only needed to regenerate audio; the generated WAVs are committed.

```sh
cd film
npm ci
python3 ../handoff/verify-snapshot.py         # approved baseline untouched
npx tsc --noEmit
node scripts/polish/export-timeline.mjs       # only after timing changes
python3 scripts/polish/sound.py               # only after timing or sound changes
node scripts/polish/deliver.mjs               # render, master, encode, poster, QA
npx remotion studio src/polish/index.ts       # preview
```

GitHub Actions: **Render polished Baya film** (`.github/workflows/render-polished.yml`, manual) runs the same steps and uploads `renders/polish/` as an artifact. The approved-baseline workflow is unchanged.
