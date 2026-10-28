# Revised film: new footage, on-screen copy and delivery

**Status: implemented and rendered as planned below.**

Base: approved polished film, `claude/peaceful-hawking-pu76xj` @ `5bc607c` (100.7 s). The approved film, its source path (`BayaFilm`) and its deliverables in `handoff/polished/` are preserved. The revision is a separate composition, `BayaFilmRevised`.

The three messages run as one product story: Baya has already done the engineering → the engineer changes it → only what changed is updated → every step is on the project record → the updated package is ready.

## Timeline (revised film, seconds)

| Time | Scene | New or changed | On-screen copy |
| --- | --- | --- | --- |
| 0:00–0:42.2 | Opening, Baya Works card, customer journey | Unchanged | Unchanged |
| 0:42.2–0:47.2 | Inside Baya Studio card | **Subline changed** | How does Baya deliver so fast? / **Inside Baya Studio.** / **Baya does the engineering. Engineers stay in control.** (replaces "Baya designs. Engineers direct.", which said the same thing more weakly; showing both would repeat it) |
| 0:47.2–0:52.2 | Studio opens: **+4.5 s** | **New** | The finished design is on the canvas: fixtures, devices, circuits, panel, and the lighting study already calculated. Status chip: `DESIGN · READY FOR REVIEW`. Baya's first message streams into the conversation: "I’ve designed the lighting and electrical systems, placed fixtures and devices, developed the circuits, and run the engineering calculations. Your design is ready to review." |
| 0:52.2–1:18.7 | Studio walkthrough | Unchanged interactions, shifted +4.5 s | When the engineer sends the first instruction, Baya's message scrolls up out of view. The existing study now goes "stale" (dims) when the change is requested, and the recalculation sweep replaces it. Everything else is as approved. |
| 1:18.7–1:23.1 | Bridge card: **4.4 s** | **New** | Beat 1: **A design change** / **shouldn't mean starting over.** Beat 2: Designs change. / **Keeping track shouldn't be a job.** |
| 1:23.1–1:30.9 | Project History in Baya Works: **7.8 s** | **New** | Sidebar: Office floor › Conversation · **Project history** · Design package. Title: `PROJECT HISTORY` / **Every file. Every decision. Every revision.** Revision B arrives at the top of the record and the list below moves down (see entries below). The current-package panel marks the four updated files, then shows approval. The pointer clicks **Open design package**. |
| 1:30.9–1:46.9 | Designs ready + ZIP download | Unchanged | Unchanged ("Review package · Revision B" now pays off the history) |
| 1:46.9–1:54.9 | Logo ending | Unchanged | Unchanged |

**Total: 114.9 s** (approved polished film: 100.7 s; **+14.2 s**). The "From design to delivery." card (2.5 s) is removed so Project History flows directly into Designs Ready, as requested. That's why the Studio intro, bridge card and History (+16.7 s) net to +14.2 s.

## Project History entries (newest first)

| Record | Detail rows | Status |
| --- | --- | --- |
| `REVISION B` **Lighting and electrical updated** | ENGINEER: ‘Move the meeting room lights away from the projector zone…’ · ENGINEER: ‘Add outlets along the workstation wall…’ · UPDATED: Lighting layout, Electrical layout, Calculation report, Fixture schedule · DECISION: Meeting room fixtures kept clear of the projector zone. | In review → **Approved** |
| `REVISION A` **Lighting and electrical design by Baya** | DESIGN: Fixtures placed · Devices laid out · Circuits developed · Calculations run · ASSUMPTION: Ceiling heights taken from the architectural model. | Reviewed |
| `INPUT` **Specifications.pdf, version 2** | | Applied |
| `DECISION` **Company standards for fixture selection** | | |
| `PROJECT INPUTS` **Architectural model, drawings and requirements** | | |

Current package panel: `CURRENT PACKAGE` / **Revision B** / `8 FILES`, the eight approved deliverables with an `UPDATED` tag on the four files above, then "Reviewed by engineer ✓" and "Approved for issue ✓", and a primary button **Open design package**.

There are no percentages, durations, lux values or certifications; the counts shown (8 files, 4 updated) are facts within the film.

## Sound

The bridge card gets a softer version of the chapter swell (pad only, no arpeggio). In History: entry ticks, a glide as Revision B inserts, a resolve chime on approval, and a click on Open design package. The score's harmonic plan follows the new scenes, generated from the exported timeline as before.

## Website cut (`BayaFilmRevisedShort`, 75.2 s)

Opening → Baya Works card → uploads/context → Studio card → Studio intro and lighting change → Project History → Designs ready → logo.

## Before/after preview

- **Before:** approved polished film. Studio card, Studio opening (to the first instruction), end of Studio, "From design to delivery." card, start of Designs ready.
- **After:** the same points in the revised film, with the new footage.

## Delivered (`handoff/revised/`)

| File | Frames | Length | Loudness | True peak | QA |
| --- | --- | --- | --- | --- | --- |
| `baya-film-revised-master.mp4` | 3447 | 114.9 s | -17.9 LUFS | -3.4 dBFS | pass |
| `baya-film-revised-web.mp4` | 3447 | 114.9 s | -18 LUFS | -3.4 dBFS | pass |
| `baya-film-revised-short-master.mp4` | 2257 | 75.2 s | -17.9 LUFS | -3.9 dBFS | pass |
| `baya-film-revised-short-web.mp4` | 2257 | 75.2 s | -17.9 LUFS | -3.8 dBFS | pass |

The table covers the four video files. The folder also holds:
- **Poster:** `baya-film-revised-poster.png` / `.jpg`, the same frame as the approved poster.
- **QA:** `review/` (one still per scene and a contact sheet) and `verification.json`. Checks: 1920 × 1080, constant 30 fps, exact frame count, full decode, loudness, peak.
- **Before/after of the new footage only (`preview/`):**
  - `revision-before-approved.mp4` (19.4 s) is cut from the approved polished master.
  - `revision-after.mp4` (33.6 s) is the same story points in the revised film.
  - `revision-before-after.mp4` is the two back to back, labelled.

The approved polished film is untouched: `BayaFilm`, `timeline.json`, `score-film.wav` and `handoff/polished/` are byte-identical.

## Reproduce

```sh
cd film
node scripts/polish/export-timeline.mjs       # timeline.json (unchanged) + timeline-revised.json
python3 scripts/polish/sound.py               # adds score-revised*.wav; existing scores regenerate identically
node scripts/polish/deliver.mjs --revised     # render, master, web encodes, poster, QA → renders/revised/
node scripts/polish/revision-preview.mjs      # before/after preview → renders/revised/preview/
```

Rendering note: on software-GL machines a headless browser that renders many consecutive frames of the opening's 3D model can stall. `render.mjs` now renders 30-frame chunks, each in a fresh browser, retries a stalled chunk, and joins the chunks without re-encoding. That is slower on such machines (about 70 min for the full film here) but reliable. Frame counts are verified afterwards.
