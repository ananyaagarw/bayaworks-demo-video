# Product research / 26 October 2026

## Sources inspected

| Source | Branch / full commit | Scope |
| --- | --- | --- |
| Website | main / `504da643af46be3ba4caa2bc244fff8b508326a9` | AGENTS, homepage, brand CSS, asset/typographic conventions, existing animated plans |
| Portal checkout | main / `325745c1b83ce929506139cfa7e1666846206788` | AGENTS, README, master plan/status, both architecture specifications, electrical geometry/classification/Playbook/design/revision modules, test results |
| Autonomous integration | integration/autonomous-studio / `52d4e42c491f0ddd40c0226575945d0ae2e647b5` | README, synthetic-pilot verification record, Radiance calculation orchestration, agent acceptance code, source-tree layout |
| Current MVP development | work/105-real-project-mvp / `4761a7865ae6e1bdd8bda9ab9eccff2bf7bfbc70` | README/current acceptance boundaries and real-project limitations |
| Release-truth work | work/100-release-truth / `f5348c4b6df889189797b953d9fa1a5b183e24a8` | Commit and engineering/release source-tree inventory |
| Radiance adapter | feat/radiance-adapter / `afecf140404e0ab0a6cd923b81573ed7514aae98` | Adapter and engine-test source-tree inventory |
| Preview branch | release/preview / `20b4d00f39fa82f1ef8a09205e911019694bdd3e` | Commit and source-tree inventory; no deployed endpoint tested |
| Video baseline | main / `05de87cd80de753d8e37394f71dba0627cbb4981` | README-only repository before this work |

Complete remote branch inventories are in `research/*-branches.tsv`. Branches move; these SHAs define the research, not latest-branch guarantees. The newer portal branches were fetched into a temporary bare research store, without switching or changing either reference checkout. We did not examine every branch's code.

## Capability and evidence map

| Capability | Evidence / state | Treatment in film |
| --- | --- | --- |
| Marketing brand/site | Existing HTML/CSS; repository records Netlify deployment. Live production not contacted | Actual identity and palette; no deployment claim |
| Room geometry | Main `sample.ts`: explicitly invented 42 × 22 m office, 15 rooms | Exact synthetic polygons; dimensions are example geometry |
| Room interpretation | Main `classify.ts`: deterministic keywords, not a connected AI service | Classification proposal, including one unknown room; no claim of live AI reasoning |
| Playbook-driven design | Main `playbook.ts`, `design.ts`, command/check/review modules; unit/browser checks passed in this environment | Design-basis relationship. Main's electrical generator places receptacles/floor boxes, not luminaires |
| Panel calculations/revision invalidation | Main TypeScript/Python unit tests and engineering HTTP golden-case check passed during setup | Grounding for future electrical sequence, not a lighting-validation claim |
| IFC/PDF intake, canonical model | Development branch source and isolated-pilot documentation describe real intake/persisted model. Not run here | Geometry reveal is an authored representation; no claim that a drawing was parsed in this render |
| Lighting proposals and AI tools | Development source includes agent proposals and engineer acceptance. Historical live-model runs and scripted CI are distinct evidence | Autonomous visual proposal is conceptual; no hidden LLM call or inference spend |
| Radiance/illuminance | Integration `calculation.py`: ies2rad, xform, oconv, rtrace; manifests, maintenance application, finite grid validation, failure/cancellation states. Browser-pilot document specifies real engine checks | Smooth visual field only, labelled illustrative. No numerical photometry was run for this film |
| Engineer corrections | Main deterministic commands/revision/locks; development tools require authenticated engineer decisions | Later full film should show an input edit → stale result → rerun → pending review, never automatic approval |
| Deliverables | Development pilot record describes revision-linked PDF/schedules and non-issuable review release | Future scene must say review package and show accurate pending state |
| End-to-end customer readiness | Development README calls local pilot candidate. A7 historical-project engineering acceptance has not passed. Earlier M10 review has limited recorded coverage | No production-ready, compliant, professionally approved or fully autonomous delivery claim |

Main's dated status file is historical and cannot erase later branch implementation. Conversely, development source and historical green checks do not prove current deployment or domain acceptance. This production task ran no product integration stack, customer project or hosted service. The prior cloud setup's local Supabase storage failure also prevents a fresh Auth/RLS claim here.

## Creative conclusion

Show the transition from architectural information to a structured, reviewable engineering proposal. Use a deliberately unresolved room as an honest visual anchor: intelligence includes knowing what requires judgement. Light becomes visible, but calculation evidence remains a separate step. This is a purpose-built cinematic interpretation, never a portal recording.
