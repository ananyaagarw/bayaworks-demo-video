# V2 incremental revision

Baseline: `restore/v2-baseline`, commit `ef080ba13c7f9d6ef113103ac14275000d237f8f`. No v3/v4 merge. Only the explicitly requested v4 chapter-card, ZIP status, and ending components were copied into the v2 implementation.

| Time | Requested change |
| --- | --- |
| 0:00–0:09.5 | Original opening composition retained. Copy now “Better engineering. Faster delivery.” with “AI-powered MEP design”; opening project label removed. Fully illuminated hold reduced from about five seconds to 2.5 seconds. Smaller, lower-opacity, less saturated light fields retain crisp fixture marks. |
| 0:09.5–0:13.5 | Centered Baya Works card: “Upload your drawings. We’ll take it from here.” |
| 0:13.5–0:54.5 | Original v2 customer walkthrough and timing retained. All three Playbook references replaced with company standards; acknowledgement reads “I’ll use your company standards wherever applicable.” |
| 0:54.5–0:59.5 | Repeated “An engineering agent at work” section removed; requested v4 Inside Baya Studio card centered. |
| 0:59.5–1:26.5 | Original v2 Studio markup and timing unchanged. Only the shared illuminated-field treatment is refined. |
| 1:26.5–1:28.5 | Requested v4 From design to delivery card centered. |
| 1:28.5–1:46.5 | V2 Designs Ready two-column screen retained. Right panel is a clean eight-file list with .pdf, .ifc, .rvt, and .xlsx extensions, without thumbnails. Button click uses v4’s retained ZIP progress/checkmark completion logic with no camera zoom. Completion holds for 3.5 seconds. |
| 1:46.5–1:54.5 | Requested v4 ending: logo first, then tagline. |

The original v2 score is retained, with an end fade to fit the shorter sequence. Resolution and frame rate remain the v2 baseline’s 960 × 540 at 24 fps. No other scenes were redesigned. Prior exports remain intact.

Output: `renders/baya-full-v2-incremental-revision.mp4`.

Validation: TypeScript and whitespace checks passed. The exported MP4 contains 2,748 H.264 frames at 24 fps, with AAC audio. Full FFmpeg decoding passed. Inspected 32 frames extracted from the actual export across all scenes, chapter boundaries, download progress/completion, and the logo-before-tagline ending; also inspected the Studio lighting and completed delivery screen at full export size. No additional exploratory renders were made.
