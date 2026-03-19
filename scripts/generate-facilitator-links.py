#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
from typing import Dict, Any

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "workshops" / "index.json"


def load_default_track() -> str:
    return json.loads(INDEX.read_text())["default_track"]


def load_config(track: str, config_path: str | None) -> Dict[str, Any]:
    path = Path(config_path) if config_path else ROOT / "workshops" / track / "speaker-guide-files.json"
    if not path.exists():
        return {}
    return json.loads(path.read_text())


def iter_target_dirs(files_root: Path):
    for child in sorted(files_root.iterdir()):
        if child.is_dir() and (child.name.startswith("phase-") or child.name == "bmb"):
            yield child
            if child.name == "bmb":
                for grandchild in sorted(child.iterdir()):
                    if grandchild.is_dir():
                        yield grandchild


def resolve_matches(files_root: Path, patterns):
    matches = []
    for pattern in patterns:
        for path in sorted(files_root.glob(pattern)):
            if path not in matches:
                matches.append(path)
    return matches


def write_links_file(target_dir: Path, rel_key: str, entry: Dict[str, Any], files_root: Path):
    out = target_dir / "SPEAKER-GUIDE-LINKS.md"
    lines = [f"# Speaker Guide Links: {rel_key}", ""]
    note = entry.get("note")
    if note:
        lines.extend([note, ""])

    items = entry.get("items", [])
    if not items:
        lines.extend(["No speaker-guide links are configured for this folder.", ""])
        out.write_text("\n".join(lines))
        return

    for item in items:
        label = item["label"]
        matches = resolve_matches(files_root, item.get("patterns", []))
        lines.append(f"## {label}")
        if matches:
            for match in matches:
                rel = os.path.relpath(match, target_dir)
                lines.append(f"- [{match.name}]({Path(rel).as_posix()})")
        else:
            lines.append("- Missing")
        lines.append("")

    out.write_text("\n".join(lines))


def write_default_file(target_dir: Path, rel_key: str):
    out = target_dir / "SPEAKER-GUIDE-LINKS.md"
    out.write_text(
        f"# Speaker Guide Links: {rel_key}\n\n"
        "No speaker-guide links are configured for this folder.\n"
    )


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--track", default=load_default_track())
    parser.add_argument("--files-root", required=True)
    parser.add_argument("--config")
    args = parser.parse_args()

    files_root = Path(args.files_root).resolve()
    config = load_config(args.track, args.config)

    if not files_root.is_dir():
        raise SystemExit(f"files root does not exist: {files_root}")

    for target_dir in iter_target_dirs(files_root):
        rel_key = target_dir.relative_to(files_root).as_posix()
        entry = config.get(rel_key)
        if entry:
            write_links_file(target_dir, rel_key, entry, files_root)
        else:
            write_default_file(target_dir, rel_key)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
