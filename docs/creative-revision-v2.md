# Revision 2 — product use comes first

The first prototype established warm architectural linework, a continuous office plan, restrained motion, the woven logo and an espresso/leaf palette. These remain the visual base. The new direction replaces advertising-style typography and internal footnotes with a legible reconstruction of Baya Works and Studio.

## Delivered for creative review

- **CustomerWorkflow**: polished 30-second, 1920×1080/30 fps customer excerpt, from New Project through typed scope, file upload, interpretation and the Playbook question/answer.
- **FullAnimatic**: deliberately rough 120-second, 960×540/24 fps cut covering all eight story beats. This is timing/layout approval material, not the polished full film.
- Six customer stills, three full-sequence stills and a customer contact sheet.
- Revised [storyboard, on-screen copy and proposed narration](storyboard-v2.md).
- Private [source/evidence map](internal/capability-map-v2.md), with exact branch SHAs, implemented vs intended behavior and typography findings.

## Visual decisions

One project: **Office floor · Level 02**. Same polygons, room identities and recognizable plan from upload processing through Studio and delivery. The meeting-room lighting change and workstation outlet additions persist into the delivered preview. Works and Studio share the website's Inter UI family, pill actions, 18–30 px corners, fine warm dividers, spacious alignment and quiet green accents.

No tiny engineering caveats, validation metadata or repeated design-basis panels appear in the new compositions. Authority is expressed naturally where needed: the deliverable is a **Review package · Revision B**. The production evidence map stays outside the film. The old 14-second composition is retained as an archived reference; it is not the revised preview.

Conversation is presented as editorially spaced text with clear speaker labels, not floating generic chat bubbles. A single click establishes New Project; typing, attachment tiles, progress bars, model reconstruction and a readable question/answer establish actual product use. There is no conventional twenty-field form or continuous cursor choreography.

The polished excerpt has an original musical bed and discrete cues at project entry, sending, document arrival and the Playbook acknowledgement. The rough full score adds a rising Designs Ready/download cue. Both are generated from authored oscillators; no stock music, paid synthesis or external audio license is involved. Narration is supplied as copy only and has not been voiced.

## Reproduce in cloud

From `film/`, with Node 24, Python 3, an installed Chromium/Chrome and FFmpeg:

```sh
npm ci
npm run typecheck
npm run sound:v2
npm run render:customer
npm run render:animatic
npm run stills:v2
npm run contact-sheet:v2
npm run verify:v2
```

The browser is discovered as before, or use `REMOTION_BROWSER_EXECUTABLE`. Sandbox environments may require permission for the local HTTP render server/browser. Source audio is regenerated with standard-library Python; generated long WAVs and rendered artifacts are ignored in Git. There are no product-service or secret dependencies.

GitHub Actions' manual render workflow has been updated to run the same revision scripts and retain the two MP4s plus review artifacts. Local cloud rendering is verified separately from GitHub Actions execution. No GitHub Actions run, professional engineering validation or product deployment is implied by a successful render.

## Approval boundary

Review the 30-second customer excerpt for UI clarity, typography, pacing and the question/answer. Use the rough animatic to assess the overall arc and Studio/delivery holds. The polished opening, engineering dive, Studio sequence and ending remain for the next stage after creative approval. The General Sans font-source restriction is recorded in the evidence map; current text uses the website's actual Inter UI/body family consistently.

## Validation completed in this cloud instance

- `npm run typecheck`: passed.
- All nine revision stills rendered; the customer contact sheet and representative upload, question/answer, Studio and delivery frames were visually inspected.
- Customer export: H.264/AAC, 1920×1080, 30 fps, 900 video frames, 30.016 s container duration, 2,248,337 bytes. SHA-256 `41aad5389bceabb6f2b0f8d13934c6076c2138dc4600b1b76a6d5b13325e7386`.
- Full animatic: H.264/AAC, 960×540, 24 fps, 2,880 frames, 120.000 s, 7,592,321 bytes. SHA-256 `e84cd16f647e61c634df7f501508c5be42a31cfc69712b84aec6d761a3f0d544`.
- `npm run verify:v2`: both exports passed metadata assertions and full FFmpeg decoding. Machine-readable results are in `renders/verification-v2.json`.
- `git diff --check`: passed. Both reference repositories retained empty `git status --porcelain` output.
- General Sans retrieval was denied by the proxy; no claim of an exact General Sans display match is made. Inter UI/body typography is supplied locally and used throughout the new compositions.
- The manual GitHub Actions workflow was updated, but not executed on GitHub during this revision. The MP4s were rendered in the attached cloud machine with the same committed Remotion scripts.
