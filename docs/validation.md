# Validation and handoff

Validated in the attached Linux cloud machine on 26 October 2026:

- Node 24; Remotion 4.0.538; installed Chromium; local Inter files and audio.
- `npm ci` succeeds from committed lockfile; `npm run typecheck` passes.
- Remotion Studio loaded in a headless browser. Still rendering exercised the actual composition at frames 60, 155, 246, 328 and 405; all five images were inspected directly or in the contact sheet.
- `npm run render` produced `renders/baya-prototype.mp4`: H.264, 1920 × 1080, 30 fps, exactly 420 video frames, AAC stereo at 48 kHz, container duration 14.016 s (audio padding), 6,580,908 bytes.
- `npm run verify-export` asserts dimensions, codec, rate, frame count and audio, then decodes the entire MP4 with FFmpeg. Passed. Machine-readable metadata/checksum is saved beside the export in `verification.json`.
- MP4 SHA-256: `0f6496c13d97778bd275d415cf70cfd29e3db86c09ffa39101c4f307748ff4c9`.
- `npm run contact-sheet` generated `renders/contact-sheet.jpg`. Five individual PNGs remain at full 1920 × 1080 resolution.
- Website and portal `git status --porcelain` remained empty. No product data, customer credentials, hosted services, migrations or paid rendering systems were used.

## What this does not verify

This is authored motion design. It does not exercise an IFC parser, AI model, lighting engine or approval system. Photometry is illustrative. Product capabilities on development branches are research findings with their own historical evidence, not freshly certified features.

The GitHub Actions workflow is prepared for manual cloud execution, but has not yet been run on GitHub. Its exported artifacts expire after 30 days. Render outputs remain ignored in Git to avoid large binary history; regenerate them or download the workflow artifact. The current cloud render is independent of GitHub Actions.

GitHub API access returned Forbidden during a read-only PR query; PR creation cannot be claimed. See the final handoff for Git push status and the actual source commit. A compare URL is not an opened pull request.

## Creative review

Review the MP4 with sound and the five-frame contact sheet. The intended decision is whether the palette, plan treatment, typography, motion pace and honest review state merit extending into the YC and website films. Those longer edits have not been started. The final tagline remains proposed creative copy.
