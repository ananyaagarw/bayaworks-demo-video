# Subtle typing audio — review exports

Source: `claude/baya-music-only` at `b140d06196b8a93c030f6fe87cc9d7b05332a853`.

- Full master: `baya-film-revised-subtle-typing.mp4` (114.9 s, 3447 frames).
- Website cut: `baya-film-revised-short-subtle-typing.mp4` (75.233 s, 2257 frames).

Only the four original keyboard samples are added, using the original per-character schedule and cue gains reduced by **14 dB**. Music is decoded from the approved music-only exports and retained at unity gain. No other SFX are used. Project History's key-like upload cues are deliberately excluded: they are not customer or engineer text entry.

The full cut contains both customer entries and both engineer entries. The short cut includes only the first engineer entry; the other entries are outside its existing edit. Cues are mapped using the same 30 fps sequence rounding as the picture. The existing music-only video streams are copied with `-c:v copy`, never rendered or re-encoded. AAC audio is 48 kHz stereo, 320 kbps; MP4 faststart is enabled.

Reproduce from repository root with Python 3, NumPy, FFmpeg and ffprobe:

```sh
python film/scripts/polish/mix-subtle-typing.py
```

`verification.json` records every key event, output checksums, original/output identical compressed-video SHA-256, frame counts, and measured post-encode audio levels. Both exports decoded completely without errors. Full: −18.01 LUFS / −5.52 dBTP. Short: −18.01 LUFS / −5.92 dBTP. No normalization or limiter was necessary; the existing music level and ample headroom are preserved.

These are pending human listening approval. Website integration must wait for explicit audio approval.
