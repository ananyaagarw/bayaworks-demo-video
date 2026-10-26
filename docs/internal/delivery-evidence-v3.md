# Internal export evidence / v3

Reference: portal integration `0e7bd632f120ff79c28eef39d9b84fd686be9ec6`, inspected read-only through the existing temporary bare research store. This is a code/documentation inspection, not a fresh export-engine acceptance run or a statement about the hosted build. Both reference working trees remain unchanged.

| Film element | Repository evidence | V3 representation |
| --- | --- | --- |
| Electrical and lighting drawing previews | `baya_deliverables/drawing_set.py`, `drawing.py`, `layout_sheets.py`, `pdf_plan.py`, `lighting_package.py`; drawing/export tests are present | Two distinct thumbnails, derived from the same office. Electrical filters out the luminaire field; lighting filters out power/circuit graphics. Both retain the appropriate engineer edits. `.PDF` is presented as a review output. |
| DWG construction drawing vision | DXF generation exists (`baya_deliverables/dxf.py`); LibreDWG intake/conversion paths are not proof of DWG output acceptance | `.DWG · Planned` appears on both drawing cards. No verified DWG production/export claim. |
| Native Revit model | `docs/integrations/revit-aps.md`: Python side tested against mocks; C# AppBundle written but not built/run; nothing sent to Autodesk; disabled by default; external runtime/license/spend prerequisites remain. `integrations/revit-appbundle/README.md` records v1 limitations, including no conduit/routing | `.RVT` is visible on a **Planned model exports** card. This card remains separate while current review documents converge into the downloadable archive. No Revit process, publication or model file is produced for this video. |
| OpenBIM coordination model | Existing IFC intake and synthetic IFC fixtures do not establish an outbound IFC release artifact. `exchange.py` describes an exchange JSON boundary, explicitly not a completed integration | `.IFC` shares the planned model-export card. The preview is authored isometric geometry from the same room polygons, not a rendered or downloaded IFC. |
| Calculation report | `baya_deliverables/calc_report.py`; `release.py` adds a `calculation-report-revN.pdf` | `.PDF` report represented. No numerical result appears in the video. Calculation-workbook vision appears as `.XLSX` with the natural state **Workbook export planned**; a schedule XLSX is not re-labelled proof of a calculation workbook. |
| Fixture/equipment schedules | `schedules.py`, `xlsx.py`, drawing package builders; XLSX generation is present and carries revision/limit data | `.XLSX` schedule card. Representative UI, not a newly generated or independently validated schedule. |
| Bill of quantities | `boq.py` derives quantities from the release model; `release.py` calls `boq_xlsx` for a revision-linked workbook | `.XLSX` quantity card. No fabricated quantities, procurement sign-off or certification appears. |
| Coordinated ZIP download | Existing release/file-store model supplies review artifacts and guarded downloads | Authored package-convergence/progress/checkmark sequence for a review archive. The renderer itself downloads no real customer files and makes no production request. |

The format shelf communicates the richer BIM/CAD delivery direction while separating roadmap-native exports from review outputs. The screen uses ordinary product states, not a tiny compliance disclaimer. External use should still describe the film as an illustrative reconstruction, as recorded in earlier production documentation.

## Source-brand verification

Website `public/index.html` contains **Better engineering. Faster delivery.** and **Upload your drawings. We’ll take it from there.** These supply the revised opening and Works introduction. Supporting MEP/engineer-control copy is an adaptation, not a quotation asserted as already published copy.

Decoded website header-logo PNG SHA-256 is `6f7fff9c8293bdc861b1ab03e032714484001301b3dccfae438487805043680b`, identical to the existing `film/public/brand/bayaworks-mark.png`. The website footer has another embedded image; the header artwork is the one retained. Hue/saturation/brightness treatment remains copied from website `brand.css`.

All new text uses the already supplied, properly licensed Inter family at 400/500, matching the website's interface/body typography. No unavailable Neue Montreal file, unofficial General Sans download or new font family was introduced. The previous Fontshare access limitation remains documented; exact General Sans heading rendering is not claimed.

## Scene continuity and authority

`CustomerExperience` and `StudioScene` are reused with unchanged local narrative timings. Optional hide-content props expose their existing shells only during transitions. The main office geometry and edited meeting-room/outlet state feed the package thumbnails and isometric model. The model is an artistic extrusion of the same polygons, not a demonstration of native Revit export.

No paid tool, Autodesk API, live inference, customer account, production credential, migration or production service was used. No professional approval or compliance result is represented as completed.
