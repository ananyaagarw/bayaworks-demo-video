# Provenance and permissions

- `film/src/rooms.json`: frozen `REVISION_A.rooms` and `classifyRoom()` outputs from portal main `325745c1b83ce929506139cfa7e1666846206788`. The source explicitly identifies this invented office as representative, not customer/imported geometry. No project/customer assets used.
- `film/public/brand/bayaworks-mark.png`: unchanged copy from portal `public/brand/bayaworks-mark.png`; website embeds the same family of woven Baya artwork. Applied color filter is from website `public/assets/brand.css`. User expressly permits reuse from these private repositories for this film; no broader redistribution license is asserted.
- `film/public/brand/inter-{400,500}.woff2`: Inter Latin normal, copied from the portal's installed `@fontsource/inter` package. `Inter-OFL.txt` accompanies it. Font choice aligns with both reference repositories.
- Lighting arrays, furniture drawing embellishments, camera, typography staging, graphic field and original procedural sound are authored for this prototype. No external images/video/music, stock footage, private IFCs or photometric files were used.
- `public/sound/design-study.wav` is reproducible with `film/scripts/sound.py`, without external libraries.
- Remotion packages are exactly `4.0.538`, recorded with integrity hashes in `film/package-lock.json`. Official agent skills were installed using `skills add remotion-dev/skills --skill remotion-best-practices --agent codex --yes`; see `skills-lock.json`. Third-party tooling retains its own license terms.
- Neither reference repository was edited, committed or pushed. No production endpoints, customer credentials, migrations or paid services were accessed.
