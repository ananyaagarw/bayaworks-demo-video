# Baya — approved film handoff for Claude Code

> **Revised film (Baya-led engineering, revisions, project history).** [`handoff/revised/`](handoff/revised/): [master](handoff/revised/baya-film-revised-master.mp4?raw=true) · [web](handoff/revised/baya-film-revised-web.mp4?raw=true) · [website cut](handoff/revised/baya-film-revised-short-web.mp4?raw=true) · [before/after of the new footage](handoff/revised/preview/revision-before-after.mp4?raw=true). Timeline, copy and reproduction: [`docs/revision/timeline.md`](docs/revision/timeline.md).
>
> **Polished film (Claude Code finishing pass).** The polished 1920 × 1080 / 30 fps film, website cut and poster are in [`handoff/polished/`](handoff/polished/):
> [master](handoff/polished/baya-film-master.mp4?raw=true) · [web](handoff/polished/baya-film-web.mp4?raw=true) · [website cut](handoff/polished/baya-film-short-web.mp4?raw=true) · [poster](handoff/polished/baya-film-poster.jpg) · [QA report](handoff/polished/verification.json).
> Source: [`film/src/polish/`](film/src/polish/) (separate entry point; the approved baseline below is untouched). Notes and reproduction: [`docs/polish/phase-c-film.md`](docs/polish/phase-c-film.md); critique and the approved proof: [`docs/polish/phase-b-proof.md`](docs/polish/phase-b-proof.md), [`handoff/proof/`](handoff/proof/).

This branch, **`handoff/claude-polish-baseline`**, preserves the **latest user-approved full film**, including the incremental revisions approved in this conversation. It is the 1:54.5 film with centered chapter cards, company-standards wording, refined illumination, an eight-file deliverables list, retained ZIP download completion, and the logo-first ending. No scenes were changed while preparing this handoff.

The `v2` directory and the original export filename are historical names. **Do not substitute the original v2 export, v3, v4, the 30-second customer composition, or the 14-second prototype for this approved film.** The committed source on this branch is the current approved implementation. Earlier commits and exports remain part of the existing history.

## Download and visual review

- [Exact approved MP4 — download](handoff/approved/baya-approved-full.mp4?raw=true)
- [Representative stills](handoff/approved/stills/)
- [Contact sheet](handoff/approved/stills/contact-sheet.jpg)
- [Snapshot and SHA-256 manifest](handoff/approved/manifest.json)
- [Approved edit checklist and scene timings](docs/v2-incremental-revision.md)

The MP4 is a byte-for-byte copy of the approved `renders/baya-full-v2-incremental-revision.mp4`, not a new encode. It is committed directly to Git, so it remains available after temporary cloud files and Actions artifacts expire. Private-repository downloads require GitHub access.

**Approved MP4 SHA-256:** `66b88f02476579e34f77edc41167780f7929183ed1e7e77b44957b2a4082a6a5`.

| Still | Film time |
| --- | --- |
| [Opening illumination](handoff/approved/stills/01-opening.png) | 0:07.5 |
| [Baya Works chapter](handoff/approved/stills/02-works-chapter.png) | 0:10.5 |
| [Customer uploads](handoff/approved/stills/03-customer-upload.png) | 0:27 |
| [Company standards](handoff/approved/stills/04-company-standards.png) | 0:52 |
| [Inside Baya Studio](handoff/approved/stills/05-studio-chapter.png) | 0:56 |
| [Studio lighting](handoff/approved/stills/06-studio-lighting.png) | 1:11.5 |
| [From design to delivery](handoff/approved/stills/07-delivery-chapter.png) | 1:27.5 |
| [Deliverables](handoff/approved/stills/08-deliverables.png) | 1:33 |
| [ZIP downloaded](handoff/approved/stills/09-zip-downloaded.png) | 1:43.5 |
| [Ending](handoff/approved/stills/10-ending.png) | 1:50 |

These stills were extracted from the exact approved MP4. No scene was re-rendered to make the review package.

## Reproduce the approved full render

Prerequisites: Node **24**, npm, Python 3, FFmpeg/ffprobe, and Chrome or Chromium. Remotion and its packages are pinned to **4.0.538** in `film/package.json` and `film/package-lock.json`. Rendering uses local assets and requires no Baya product credentials, backend, reference repositories, or paid rendering service.

```sh
git clone --branch handoff/claude-polish-baseline https://github.com/ananyaagarw/bayaworks-demo-video.git
cd bayaworks-demo-video
python3 handoff/verify-snapshot.py
cd film
npm ci --no-audit --no-fund
npm run typecheck
# If Chrome/Chromium is not detected automatically, set its executable path:
# export REMOTION_BROWSER_EXECUTABLE=/usr/bin/chromium
npm run render:approved
npm run verify:approved
```

The exact Remotion composition is **`FullAnimatic`**, registered in [`film/src/Root.tsx`](film/src/Root.tsx): **2,748 frames, 24 fps, 960 × 540, 114.5 seconds**. AAC packet padding can make container duration approximately 114.517 seconds. Preserve these dimensions and timing when reproducing the baseline.

`npm run render:approved` calls the existing renderer with:

```sh
node scripts/render.mjs FullAnimatic baya-approved-full
```

Output: `renders/baya-approved-full.mp4` at the repository root. The renderer uses H.264, CRF 17, `yuv420p`, AAC audio, and concurrency 4. `npm run verify:approved` checks dimensions/frame count/codecs, decodes the entire MP4, and writes ten extracted stills, a contact sheet, and verification JSON under `renders/approved-review/`.

The committed MP4 is the exact approved encode. A fresh render reproduces the composition; byte identity is not guaranteed across browser, OS, and encoder versions. The hash above identifies the original approved encode unambiguously.

For preview only: `cd film && npm run studio` opens Remotion Studio at port 3300; select **FullAnimatic**. Older npm aliases remain for historical work and are not the approved handoff commands.

## Source, assets, and configuration

- [`film/src/v2/Animatic.tsx`](film/src/v2/Animatic.tsx): approved full-film sequencing, opening, original customer/Studio timing, delivery list, and score fade.
- [`film/src/v2/CustomerWorkflow.tsx`](film/src/v2/CustomerWorkflow.tsx): customer walkthrough, including approved company-standards wording.
- [`film/src/v2/EngineeringCanvas.tsx`](film/src/v2/EngineeringCanvas.tsx): engineering geometry presentation and approved illumination treatment.
- [`film/src/v2/RequestedFinishes.tsx`](film/src/v2/RequestedFinishes.tsx): the specifically approved centered chapter cards, ZIP status, and logo-first ending.
- [`film/src/v2/system.tsx`](film/src/v2/system.tsx): shared colors, typography, logo, pointer, and timing utilities.
- [`film/src/rooms.json`](film/src/rooms.json): local synthetic office geometry.
- [`film/public/brand/`](film/public/brand/): Baya logo, Inter 400/500 WOFF2 fonts, and font license.
- [`film/public/sound/full-animatic.wav`](film/public/sound/full-animatic.wav): **exact committed score used by the approved full film**. The composition applies its existing gain and closing fade.
- [`film/public/sound/customer-workflow.wav`](film/public/sound/customer-workflow.wav) and `design-study.wav`: audio used by the preserved standalone/historical compositions.
- [`film/scripts/`](film/scripts/): render/bundle scripts, original procedural score generators, historical checks, and the approved export verification/still-extraction script.
- [`film/package-lock.json`](film/package-lock.json), [`film/tsconfig.json`](film/tsconfig.json), and [Actions workflow](.github/workflows/render.yml): dependency, TypeScript, and cloud-render configuration.

All runtime assets are committed, including the previously ignored generated WAV files. **Do not regenerate audio to reproduce the baseline.** The original score generator is retained as provenance/reproduction tooling. No Endra graphics, audio, UI, or animation assets are included. Local `node_modules`, build caches, temporary renders, and installed agent-skill caches are excluded; `npm ci` restores dependencies.

`handoff/verify-snapshot.py` checks hashes of the frozen approved render inputs and exact MP4. It is a baseline integrity guard. If later approved polish intentionally changes rendering inputs, update the manifest deliberately as part of that future work; do not silently replace the approved MP4 snapshot.

## GitHub Actions MP4 export

Open [Actions → render workflow](https://github.com/ananyaagarw/bayaworks-demo-video/actions/workflows/render.yml), choose **Run workflow**, and select **`handoff/claude-polish-baseline`**. The workflow file on this branch is named **Render approved Baya film**; the Actions list can still show the older workflow name from the default branch.

The manually dispatched job:

1. Checks out the selected branch/commit and installs Node 24 plus locked npm dependencies.
2. Checks the runner’s Chrome executable and installs FFmpeg.
3. Verifies the frozen approved source/assets and MP4 checksum.
4. Typechecks and renders **only `FullAnimatic`** using the committed audio.
5. Fully decodes the exported MP4 and extracts the representative stills/contact sheet.
6. Uploads **`baya-approved-full-<full commit SHA>`**, containing `baya-approved-full.mp4` and `approved-review/`, retained for 90 days.

Open the completed run → **Artifacts** → download that artifact ZIP for the newly generated MP4. The workflow is manual: pushing this branch does not trigger another render. This handoff’s Actions configuration has not been executed remotely; local typechecking, full decoding, snapshot verification, and still extraction have passed. The exact approved MP4 is already downloadable from Git above, independent of an Actions run.
