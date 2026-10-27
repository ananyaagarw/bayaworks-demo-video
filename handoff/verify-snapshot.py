"""Verify the frozen approved source/assets and original MP4, without rendering."""
from pathlib import Path
import hashlib
import json

root = Path(__file__).resolve().parents[1]
manifest = json.loads((root / 'handoff/approved/manifest.json').read_text())
for relative, expected in manifest['render_inputs_sha256'].items():
    actual = hashlib.sha256((root / relative).read_bytes()).hexdigest()
    if actual != expected:
        raise SystemExit(f'Approved render input changed: {relative}')
video = root / manifest['approved_mp4']['path']
if hashlib.sha256(video.read_bytes()).hexdigest() != manifest['approved_mp4']['sha256']:
    raise SystemExit('Approved MP4 does not match its frozen checksum')
print(f"Approved snapshot verified: {len(manifest['render_inputs_sha256'])} render inputs and exact MP4.")
