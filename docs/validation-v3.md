# V3 render validation

Completed in the attached Linux cloud machine on 26 October 2026.

- `npm run typecheck`: passed.
- `npm run sound:v3`: produced an original, stereo 48 kHz, 120-second score. Nonzero signal and sample bounds checked; normalized peak 0.1436, no clipped samples.
- `npm run stills:v3`: 11 full-resolution review frames rendered at 8, 13.5, 44, 59.5, 75, 93.5, 102, 109, 112, 116 and 119 seconds. Opening, shared-interface handoffs, package, completion, brand transition and the contact sheet were visually inspected. The BIM preview was refined into a true isometric projection of the same room boundaries before the full render.
- `npm run render:v3`: produced the requested **baya-full-animatic-v3.mp4**.
- Export: H.264 video, 1920×1080, 24 fps, 2,880 frames, AAC audio, exactly 120.000 seconds, 13,809,812 bytes.
- `npm run verify:v3`: dimensions/frame count/rate/duration/audio assertions passed, followed by a successful full FFmpeg decode. Metadata is saved beside the video in `renders/verification-v3.json`.
- MP4 SHA-256: `1ea003923c46bb3c9b50f56133c8c3af065858214ce4692b6b124e1c9c03b819`.
- `npm run contact-sheet:v3`: generated the 11-frame `renders/contact-sheet-v3.jpg`; individual PNGs remain under `renders/v3/`.
- `git diff --check`: passed. Portal and website both retained empty `git status --porcelain` results.

## Repeatability and boundaries

The manual GitHub Actions workflow now executes the same v3 sound/render/still/contact-sheet/verification scripts and uploads `baya-full-demo-v3-1080p`. This workflow has not been executed on GitHub during the task; current-instance cloud rendering is the verified result. Dependencies were not changed; the existing integrity-locked Remotion 4.0.538 installation was reused. Long WAVs and render outputs remain ignored and reproducible from source.

This work validates the video composition and encoded artifact, not the depicted live application or engineering calculations. Native RVT/IFC export and DWG drawing output are represented as planned, consistent with the scoped source inspection in [delivery evidence](internal/delivery-evidence-v3.md). No Autodesk runtime or paid service was used. No hosted service, customer account, migration, production credential or professional approval was accessed or fabricated.
