# Subtle typing, clicks and upload tings — audio review v2

Built directly from the approved music-only exports, preserving their music at unity gain and copying video with `-c:v copy`. No Remotion render or video re-encoding.

The previous typing mix is retained. Added quiet clicks for opening the project, sending customer and engineer instructions, selecting fixtures, opening deliverables and downloading designs. Four quiet tonal tings follow the files landing in the customer upload sequence. All effects use original cue gains reduced by 14 dB.

Only `key0.wav` through `key3.wav`, `click.wav`, and purely tonal `select.wav` are used. The original `upload.wav` contains a noise slide, so it is deliberately excluded along with send, window, chapter, glide, sweep, mark, resolve and completion effects. No whooshes or generation sounds are added.

Run from repository root (Python 3, NumPy, FFmpeg and ffprobe):

```sh
python film/scripts/polish/mix-subtle-typing.py --interactions
```

Both MP4s use faststart, 48 kHz stereo AAC at 320 kbps. `verification.json` records all typing and interaction timestamps, measured post-encode loudness and true peak, file checksums and identical source/output compressed-video hashes. Full-stream decode checks must pass before this report is written.

Pending explicit listening approval. Do not integrate into the website until approved.
