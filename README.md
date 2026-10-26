# Baya — cinematic product study

A 14-second, 1920 × 1080, 30 fps Remotion proof of concept. Architectural geometry becomes room interpretation, a proposed lighting array and an illustrative light study. Original procedural sound accompanies the motion. The full films await creative approval.

- [Research and capability map](docs/research.md)
- [Brand and motion treatment](docs/brand-treatment.md)
- [Shot-by-shot storyboard](docs/storyboard.md)
- [Source assets and provenance](docs/provenance.md)
- [Validation and handoff](docs/validation.md)

## Preview and render in the cloud

Requires Node 24, Python 3, and Chrome or Chromium. Use the existing cloud checkout; no laptop or paid rendering service is needed.

```sh
cd film
npm ci
npm run studio                    # Remotion Studio, port 3300
npm run typecheck
python3 scripts/sound.py
npm run render                    # ../renders/baya-prototype.mp4
npm run stills                    # five full-resolution frames
npm run contact-sheet             # ../renders/contact-sheet.jpg; requires ffmpeg
npm run verify-export             # assert format + decode all frames; requires ffprobe/ffmpeg
```

Rendering discovers `/usr/bin/chromium` or Google Chrome; set `REMOTION_BROWSER_EXECUTABLE` to override. Without an installed browser, Remotion may download its supported headless browser. All visual/font/audio assets are local; rendering needs no product credentials, customer data, AI inference or reference checkouts.

For GitHub cloud rendering, open Actions → **Render cinematic prototype** → **Run workflow** on this branch. Download `baya-prototype-1080p`; it contains the MP4, stills and contact sheet. Workflow runs are manual and pinned to reviewed action SHAs. The workflow itself has not yet been run on GitHub; the same project/scripts were rendered in the attached cloud machine.

## Creative and technical boundary

The room boundaries and keyword classifications are taken from the portal's synthetic office example. Lighting positions and smooth field overlays are authored motion graphics, **not** imported photometry, a Radiance result, engineering compliance, or an approved design. An unknown room remains unresolved and receives no fixtures. No lux values or fabricated pass metrics appear.

The logo is the existing Baya AI artwork; its website color filter is preserved. The final tagline is proposed film copy only. Both reference repositories remain read-only. No deployments, production migrations, customer access or paid services are part of this work.

Official [Remotion agent skills](https://github.com/remotion-dev/skills) are installed under `.agents/skills/remotion-best-practices`; the lock records their source. Remotion is governed by its own [license](https://www.remotion.dev/license). No license or rendering service was purchased.
