# V4 actual-render quality review

## Evidence reviewed

The supplied Endra video and Baya v3 were examined before implementation; see [actual-footage comparison](reference-edit-comparison-v4.md). This is a scoped frame-based analysis, with measured audio, not a claim of subjective audio audition. Endra derivatives stayed in `/tmp`/the supplied attachment area and are absent from the production source/assets.

V4 was then rendered and reviewed **from the actual encoded MP4**, not just from React code or Remotion stills:

- 22 boundaries × BEFORE/AT/AFTER = **66 decoded review frames**, in four full-size sheets. FFmpeg's reported PTS/frame selections were checked against every requested frame index and saved to `decode-audit.json`.
- **20 additional encoded samples** within brief entry, the submitted message, uploads, the clarification, instruction, fixture relocation, light-study update, outlet/branch generation, package/download and final hold.
- All four cut sheets and the action sheet were visually inspected. Separate full-resolution Remotion preview stills helped catch framing problems before the final export, but were not substituted for the encoded-frame review.

## Findings by edit

| Check | Actual result |
| --- | --- |
| Opening exit, 11.958 / 12.000 / 12.042 | Plan is still full-size immediately before the edit. The next frame is the Works chapter, not a shrinking thumbnail. Final engineering state holds before the cut. |
| Customer framing, 20 / 24 / 26 / 33 / 42 / 50 | Distinct fixed crops; source conversation and upload progress continue. Input close-up removes irrelevant chrome. Question/answer is larger; the wider shot restores the complete acknowledgement. |
| Works→Studio, 56.958 / 57 / 61.958 / 62 | Final customer state completes, then a single chapter, then Studio. No standalone reilluminating plan, fading application shell or growing drawing is mounted in the bridge. |
| Engineer direction/result, 65 / 68.5 / 75 and 79 / 84 / 89 | Cut to readable instruction, cut to the same geometry, return wide. Interior samples at 69, 70.5, 72 and 73.292 show the meeting-room fixtures moving below the projector zone, then the light field resolving. Samples at 85.083, 86.5 and 88.292 show precise outlet symbols and the branch appearing. No camera movement covers either edit. |
| Studio→delivery, 91.958 / 92 / 93.958 / 94 | Final response/result, short chapter, package. No model-to-document fan or outgoing scene scale-down. |
| Package/download, 98 / 103 / 109; interior 104 / 106.208 / 108.583 / 110.5 | The format shelf remains populated. ZIP progress/checkmark is a compact status within the same view. No review cards converge, fade out, or vanish to clear the screen. |
| Closing, 111.958 / 112 / 112.042, then 113.5 and 117 | A clean cut into the Baya logo, short type fade and long hold. No decorative outline, rounded rectangle animation, morph or outgoing blur. |

A drawing naturally extends past the frame during an intentionally tight canvas crop; this is a **constant framing choice**, not an animated zoom to disappearance. Close-ups are direct cuts and keep a readable anchor (instruction, projector zone, panel/branch, package, or download). Meaningful camera settling occurs only in the opening; semantic fixture/route/upload/progress movement remains.

## Technical validation

- `npm run typecheck`: passed.
- `npm run render:v4`: completed in the attached cloud machine.
- Export: H.264/AAC, **1920×1080**, **24 fps**, **2,880 frames**, **120.000 seconds**, **9,967,891 bytes**.
- `npm run review:v4`: four actual-MP4 cut sheets, 66 audited frame selections, one 20-sample action sheet, and an overview contact sheet generated successfully.
- `npm run verify:v4`: metadata/frame count/duration/audio assertions, full FFmpeg decoding and the exact cut-selection audit passed.
- Encoded audio: **−21.01 LUFS integrated**, **−5.96 dBTP true peak**. Original music/cues were normalized independently; no Endra audio was sampled. These are technical measurements; subjective listening could not be performed in this runtime.
- SHA-256: `608c06a9763a967bcc5aad091ede40689bf4051e6ea983d1210cf7e67940544e`.
- `git diff --check`: passed. Both reference repositories retained clean `git status --porcelain` results.

## Reproduce and review

From `film/`: `npm ci`, `npm run sound:v4`, `npm run typecheck`, `npm run render:v4`, `npm run review:v4`, `npm run verify:v4`. Preview stills are optional via `npm run stills:v4`. Requires installed Chrome/Chromium, FFmpeg with loudnorm/drawtext, and DejaVu Sans for review annotations. All Python production scripts use the standard library; temporary numerical/reference-analysis tools are not production dependencies.

The manual GitHub Actions workflow has been updated to these steps, but was **not executed on GitHub** during this task. The MP4 and cut review were produced in the attached cloud instance. Local files/processes do not establish new-task snapshot restoration.

## Product and rights boundaries

The film is an illustrative reconstruction. It does not execute a live customer upload, engineering calculation, professional approval or Revit export. Planned native/CAD formats retain their natural product states; [v3 delivery evidence](internal/delivery-evidence-v3.md) still applies. All models are based on Baya's same invented office floor. The supplied Endra media was used only for editorial analysis, never as a production asset. Baya's fonts, logo, UI, palette and original sound remain its own.
