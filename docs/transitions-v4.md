# V4 editorial timeline and replacement table

The actual Endra/Baya footage comparison was completed before implementation: [timestamped reference study](reference-edit-comparison-v4.md). Endra supplied editorial lessons only. All production imagery, UI, music and animations remain Baya assets or original authored work.

## Problematic transitions replaced

| V3 encoded interval / behavior | V4 replacement / encoded time |
| --- | --- |
| 00:11.6–00:15: plan shrinks into Works while both scenes fade | Opening reaches its final camera/lighting state at 00:10 and holds. At **00:12**, cut to a four-second Works chapter. At **00:16**, cut directly to New Project. |
| 00:56–01:03: Works shell fades; plan grows/reilluminates; Studio replaces it | Finish the final acknowledgement. At **00:57**, cut to one five-second chapter: “How does Baya deliver so fast? Inside Baya Studio. Baya designs. Engineers direct.” At **01:02**, cut to Studio with the design already present. No standalone plan is mounted in this chapter. |
| 01:30–01:36: canvas scales back and becomes a fan of documents | Finish the engineer reply and hold the result. At **01:32**, cut to “From design to delivery.” At **01:34**, cut to Designs Ready. No drawing-to-document transformation. |
| 01:45–01:54: review cards converge and disappear into ZIP progress | **01:43–01:49**: closer download framing, with a compact ZIP/progress/checkmark status inside the existing view. Package cards remain mounted at full opacity and scale. **01:49–01:52**: return wide; completed status and complete shelf hold together. |
| 01:54–02:00: interface blurs and an oversized decorative line surrounds the logo | At **01:52**, cut to espresso and the actual logo. Logo and tagline use short opacity entrances; hold until **02:00**. No path, screen outline, model morph or blur is part of this ending. |

## Full edit

| Time | Framing / subject |
| --- | --- |
| 00–12 | Existing architectural/engineering opening; “Better engineering. Faster delivery.” Meaningful camera settling is retained only here. |
| 12–16 | Works chapter. Baya logo, warm negative space, “Upload your drawings. We’ll take it from there.” |
| 16–20 | Full Works composition establishes New Project and the conversation. |
| 20–24 | Fixed closer view of the actual brief input, with minimal Baya Works context. Typing and send use the same source clock. |
| 24–26 | Cut to the submitted conversation; let the complete brief read. |
| 26–33 | Fixed attachment close-up: IFC, drawings, brief and specification progress. |
| 33–42 | Return wide for building interpretation and project context. |
| 42–50 | Fixed question/answer close-up, including the customer's typed company-standards response. |
| 50–57 | Return wide for acknowledgement and Preparing the first design. |
| 57–62 | Single Studio chapter. Explanation is separated from active product text. |
| 62–65 | Full Studio establishes engineer and canvas. |
| 65–68.5 | Instruction close-up. |
| 68.5–75 | Stable close view of the same meeting room; fixtures move clear of the projector zone, then the visual light study updates. |
| 75–79 | Wide Studio response/result. |
| 79–84 | Electrical instruction close-up. |
| 84–89 | Stable drawing close-up; outlet symbols appear in sequence and the new circuit branch traces into place. |
| 89–92 | Wide final engineer response and coordinated result. |
| 92–94 | Brief delivery chapter. |
| 94–98 | Full Designs Ready view establishes the rich package. |
| 98–103 | Fixed package-detail shot; electrical/lighting thumbnails, isometric BIM, reports and workbooks become readable. |
| 103–109 | Download close-up. The shelf stays visible and populated. |
| 109–112 | Wide completed download; success gets a three-second hold. |
| 112–120 | Logo/tagline reveal and long, clean brand hold. |

22 hard editorial boundaries are declared in `film/src/v4/cuts.json`. Each change of crop is a cut, not a time-varying zoom: scale/position are constant inside a shot. The underlying Works clock remains 41 seconds; Studio's same 27 seconds of action is played over 30 seconds for more reading time. No dialogue, upload or reply is restarted by a cut.

## Content polish without a redesign

The meeting-room correction now redistributes the top row below the projector zone while keeping all luminaires inside the same room; it no longer merely shifts the array a small distance behind the zone label. The delivery thumbnails use the same refined positions. New outlet symbols use an outlined receptacle glyph and a traced branch instead of filled green disks. These are authored graphical edits, not newly verified engineering calculations.

The Works and Studio components remain the existing production components. Optional flags preserve older composition defaults. V3's rich package is reused with `retainCards` enabled; only its compact progress state changes. New chapter/crop labels use the same local Inter assets and Baya colors. No Endra asset was added.

## Review artifacts

`renders/contact-sheet-v4.jpg` is an overview of the actual-MP4 cut review. Full-size pages are in `renders/v4-cut-review/cuts-01.jpg` through `cuts-04.jpg`, with BEFORE (N−1), AT (N), AFTER (N+1) in every row. `index.json` maps rows to shot names; `decode-audit.json` records the selected frame numbers actually reported by FFmpeg. The sheets are not substituted Remotion still renders.

`renders/action-review-v4.jpg` adds 20 actual-MP4 samples within typing, fixture movement, outlet/circuit generation, package/download and the final hold. These complement the frame-adjacent cut review. Subjective sound audition remains unavailable in this runtime; encoded loudness/true-peak and cue timing are measured, not described as listened-to approval.
