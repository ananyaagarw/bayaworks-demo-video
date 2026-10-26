# Internal product evidence / revision 2

Private production reference. None of these validation notes are burned into the film.

## Reinspection

Website main remains `504da643af46be3ba4caa2bc244fff8b508326a9`. Portal main remains `325745c1b83ce929506139cfa7e1666846206788`. Latest accessible integration moved from the first prototype's `52d4e42…` to **`0e7bd632f120ff79c28eef39d9b84fd686be9ec6`**, merge of the firm bridge work. Also fetched chat-first Studio `auto/w2-studio-ux-pr2` at `789b047cbf52d3529559c37bcdea812b8436638f` and `work/100-studio-engineer` at `4cb607c1352898eec60ae432cbd6b037ecee6061`. Branch snapshots: `research/*-branches-v2.tsv`. All reference reads used a temporary bare research store; reference working trees were untouched.

Reviewed latest integration `src/app/projects/page.tsx`, Works `works.tsx`, `works-conversation.tsx`, `works-uploads.tsx`, Studio `studio.tsx`, `src/lib/design-store/studio.ts`, and the product handoff. The latest handoff contains historical and ongoing live-model evidence and unresolved adoption/engineering gates; do not turn that history into an unconditional completion claim.

## Map to revised story

| Depiction | Source/evidence | Implemented vs production treatment |
| --- | --- | --- |
| New project and Works entry | Projects page, NewProjectForm, project link to `/projects/[id]/works` | Real routes exist. Conversation-only creation is a simplified cinematic reconstruction of the entry flow, not an exact UI clone. |
| Customer conversation and typed replies | `works-conversation.tsx`: bottom-anchored composer, Enter sends, Baya/customer roles. `works.tsx`: conversation snapshots, tasks, polling, questions and failures | Implemented interface/transport. Film copy is authored and deterministic; no live model was called. |
| Multiple document upload | `works-uploads.tsx`, `useUploads`, input accept list and drag handling | Implemented upload path. Film tiles and progress are simulated; no real file request, parsing or product backend runs during rendering. |
| Interpreted geometry and requirements | Source preview and canonical model code; latest Studio explicitly distinguishes unadopted geometry from canonical state | Implemented paths with guarded adoption. Same invented office is used for visual continuity, not a newly verified real IFC/PDF extraction. |
| Clarifying questions | Works question lifecycle, openQuestions, question/task records | Implemented question records and customer responses. Particular manufacturer question and acknowledgement are authored example dialogue. |
| Firm Playbook preference | Latest integration includes firm bridge; `Firm Playbook` route and firm/library work in source | Implemented firm infrastructure, not evidence that a particular customer's standards were approved. The film selects an intended preference, not a compliance result. |
| Chat-first Studio | Latest `studio.tsx`: conversation-led plan, composer, canvas, contextual tools. `studio.ts`: proposals, canonical-state facts, authorization and explicit adoption endpoints | Real chat-first implementation, with more gates than the elegant reconstruction. New source-preview/adoption and professional approval remain separate. |
| Natural-language engineering edits | Conversation/agent tools and command model support proposals and edits; current independent engineering acceptance is bounded | The exact instruction → immediate move → completed visual update is intended UX choreography, not a replay of verified live execution. No calculated values are asserted. |
| Electrical and lighting graphics | Device/circuit/canonical source plus Radiance modules previously inspected | Components, routes and light fields are authored illustrations, not calculated cable routing, measured photometry or certifications. No lux/current/compliance numbers appear. |
| Review-package delivery | Works release records and guarded download model; revision-linked deliverables code and earlier pilot documentation | Real package paths exist; shown filenames and download are reconstructed. “Review package · Revision B” avoids implying professionally issued design. |

External presentation should identify the finished video as an illustrative product reconstruction. Keep detailed evidence and implementation distinctions here rather than in tiny repeated on-screen disclaimers. No live customer account, production credential, migration or inference spend was used for this revision.

## Typography finding and constraint

Website `index.html` declares UI/body **Inter** (400/500/600), and the display stack `Neue Montreal, General Sans, Inter`. Its README says the licensed Neue Montreal files are absent; General Sans is loaded from Fontshare at 400/500. It also declares JetBrains Mono for technical data, and a few editorial styles have Georgia; these are not a single universal font.

For this iteration every text element uses the website's actual Inter UI/body family at 400/500, self-hosted from the existing OFL assets. No alternate family is introduced into the reconstructed UI or animatic. General Sans could not be retrieved: the official `api.fontshare.com` CSS endpoint was denied by the environment's proxy (403 CONNECT), and there is no supplied General Sans/Neue Montreal font file. The source font is therefore consistent with the website UI, but this does **not** claim an exact match to headings when the website renders General Sans. No unofficial copy or invented license was used. A later General Sans display match requires approved access to the website's Fontshare font source or a supplied licensed font file.
