#!/usr/bin/env bash

WORKSHOP_TRACKS_LIB_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
WORKSHOP_TRACKS_ROOT=$(cd "$WORKSHOP_TRACKS_LIB_DIR/../.." && pwd)
WORKSHOP_TRACKS_PYTHON="${WORKSHOP_TRACKS_PYTHON:-}"

workshop_tracks_python() {
  if [[ -n "$WORKSHOP_TRACKS_PYTHON" ]]; then
    printf '%s\n' "$WORKSHOP_TRACKS_PYTHON"
    return 0
  fi

  if command -v python3 >/dev/null 2>&1; then
    printf '%s\n' python3
    return 0
  fi

  if command -v python >/dev/null 2>&1; then
    printf '%s\n' python
    return 0
  fi

  echo "ERROR: python3 or python is required for workshop track helpers" >&2
  return 2
}

workshop_tracks_cmd() {
  local python_cmd
  python_cmd=$(workshop_tracks_python) || return $?
  "$python_cmd" "$WORKSHOP_TRACKS_ROOT/scripts/lib/workshop_tracks.py" "$@"
}

workshop_default_track() {
  workshop_tracks_cmd default-track
}

workshop_list_branches() {
  local track="${1:-}"
  local include_main="${2:-0}"
  local args=(list-branches)

  if [[ -n "$track" ]]; then
    args+=(--track "$track")
  fi
  if [[ "$include_main" == "1" ]]; then
    args+=(--include-main)
  fi

  workshop_tracks_cmd "${args[@]}"
}

workshop_resolve_branch() {
  local track="${1:-}"
  local branch="${2:?branch is required}"
  local args=(resolve-branch --branch "$branch")

  if [[ -n "$track" ]]; then
    args+=(--track "$track")
  fi

  workshop_tracks_cmd "${args[@]}"
}

workshop_branch_field() {
  local track="${1:-}"
  local branch="${2:?branch is required}"
  local field="${3:?field is required}"
  local args=(branch-info --branch "$branch" --field "$field")

  if [[ -n "$track" ]]; then
    args+=(--track "$track")
  fi

  workshop_tracks_cmd "${args[@]}"
}

workshop_branch_candidates() {
  local track="${1:-}"
  local branch="${2:?branch is required}"
  local args=(branch-candidates --branch "$branch")

  if [[ -n "$track" ]]; then
    args+=(--track "$track")
  fi

  workshop_tracks_cmd "${args[@]}"
}

workshop_stage_branch() {
  local track="${1:-}"
  local stage_id="${2:?stage id is required}"
  local args=(stage-branch --stage-id "$stage_id")

  if [[ -n "$track" ]]; then
    args+=(--track "$track")
  fi

  workshop_tracks_cmd "${args[@]}"
}

workshop_stage_next_branch() {
  local track="${1:-}"
  local stage_id="${2:?stage id is required}"
  local args=(stage-next-branch --stage-id "$stage_id")

  if [[ -n "$track" ]]; then
    args+=(--track "$track")
  fi

  workshop_tracks_cmd "${args[@]}"
}
