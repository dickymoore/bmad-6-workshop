#!/usr/bin/env python3
import argparse
import json
from pathlib import Path
import sys


ROOT = Path(__file__).resolve().parents[2]
INDEX_PATH = ROOT / "workshops" / "index.json"


def load_index():
    return json.loads(INDEX_PATH.read_text())


def load_track(track_id=None):
    index = load_index()
    if track_id is None:
        track_id = index["default_track"]
    track_meta = index["tracks"].get(track_id)
    if not track_meta:
        raise SystemExit(f"Unknown track: {track_id}")
    track_path = ROOT / track_meta["path"]
    track = json.loads(track_path.read_text())
    return index, track


def iter_branch_entries(track):
    bootstrap = dict(track["bootstrap"])
    bootstrap["kind"] = "bootstrap"
    bootstrap["track"] = track["id"]
    yield bootstrap
    for stage in track["stages"]:
        entry = dict(stage)
        entry["kind"] = "stage"
        entry["track"] = track["id"]
        yield entry


def canonical_map(track):
    mapping = {}
    for entry in iter_branch_entries(track):
        canonical = entry["branch"]
        mapping[canonical] = entry
        if entry["kind"] == "stage":
            mapping[entry["old_canonical"]] = entry
            for alias in entry.get("legacy_aliases", []):
                mapping[alias] = entry
    return mapping


def resolve_entry(track, branch):
    mapping = canonical_map(track)
    entry = mapping.get(branch)
    if not entry:
        raise SystemExit(f"Unknown branch or alias for track {track['id']}: {branch}")
    return entry


def source_candidates(track, branch):
    entry = resolve_entry(track, branch)
    candidates = []

    def add_candidate(value):
        if value and value not in candidates:
            candidates.append(value)

    add_candidate(entry["branch"])
    if entry["kind"] == "stage":
        if entry.get("source_branch"):
            add_candidate(entry["source_branch"])
        if entry.get("old_canonical"):
            add_candidate(entry["old_canonical"])
        for alias in entry.get("legacy_aliases", []):
            add_candidate(alias)
    return candidates


def emit_value(value):
    if value is None:
        return
    if isinstance(value, list):
        for item in value:
            print(item)
        return
    if isinstance(value, (dict, bool, int)):
        print(json.dumps(value))
        return
    print(value)


def main():
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser("default-track")
    sub.add_parser("list-tracks")

    p_list = sub.add_parser("list-branches")
    p_list.add_argument("--track")
    p_list.add_argument("--include-main", action="store_true")

    p_resolve = sub.add_parser("resolve-branch")
    p_resolve.add_argument("--track")
    p_resolve.add_argument("--branch", required=True)

    p_info = sub.add_parser("branch-info")
    p_info.add_argument("--track")
    p_info.add_argument("--branch", required=True)
    p_info.add_argument("--field")

    p_candidates = sub.add_parser("branch-candidates")
    p_candidates.add_argument("--track")
    p_candidates.add_argument("--branch", required=True)

    args = parser.parse_args()

    if args.command == "default-track":
        print(load_index()["default_track"])
        return

    if args.command == "list-tracks":
        for track_id in load_index()["tracks"].keys():
            print(track_id)
        return

    _, track = load_track(getattr(args, "track", None))

    if args.command == "list-branches":
        if args.include_main:
            print(track["bootstrap"]["branch"])
        for stage in track["stages"]:
            print(stage["branch"])
        return

    if args.command == "resolve-branch":
        entry = resolve_entry(track, args.branch)
        print(entry["branch"])
        return

    if args.command == "branch-info":
        entry = resolve_entry(track, args.branch)
        if args.field:
            emit_value(entry.get(args.field))
        else:
            print(json.dumps(entry))
        return

    if args.command == "branch-candidates":
        for candidate in source_candidates(track, args.branch):
            print(candidate)
        return


if __name__ == "__main__":
    main()
