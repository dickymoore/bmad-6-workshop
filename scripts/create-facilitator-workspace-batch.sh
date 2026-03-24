#!/usr/bin/env bash
set -euo pipefail

SCRIPT_NAME=$(basename "$0")
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
ROOT_DIR=$(git -C "$SCRIPT_DIR/.." rev-parse --show-toplevel 2>/dev/null || pwd)

# shellcheck source=scripts/lib/workshop_tracks.sh
source "$SCRIPT_DIR/lib/workshop_tracks.sh"

TRACK=$(workshop_default_track)
DESTINATION_ROOT=""
AGENT_REPLAY_URL=""
RESET=0
FETCH=1
SESSIONS=()

usage() {
  cat <<USAGE
Usage:
  ./${SCRIPT_NAME} --destination-root <path> [options] <session> [<session> ...]

Create multiple facilitator workspaces under one parent folder. Each session
gets its own isolated workspace with a relative-link START-HERE.md.

Options:
  --destination-root <path>  Parent folder that will contain one subfolder per session.
  --track <id>               Workshop track id (default: value from workshops/index.json)
  --agent-replay-url <u>     Override the sidecar repo cloned into each session
  --reset                    Recreate each named session folder if it already exists
  --no-fetch                 Skip a single 'git fetch origin --prune' before generation
  -h, --help                 Show help

Example:
  ./${SCRIPT_NAME} \
    --track albemarle-pulse \
    --destination-root ../facilitator-workspaces \
    --reset \
    Wed-test Wed-1 Wed-2 Wed-3 Wed-4 Thu-test Thu-1 Thu-2 Thu-3 Thu-4
USAGE
}

fail() {
  echo "ERROR: $*" >&2
  exit 2
}

log() {
  printf '[%s] %s\n' "$(date +'%Y-%m-%d %H:%M:%S')" "$*"
}

write_index() {
  local path="$1"

  cat > "$path" <<EOF
# Facilitator Sessions: ${TRACK}

This folder contains one isolated facilitator workspace per workshop run.
Open the session you want, then start from its \`START-HERE.md\`.

## Sessions

EOF

  local session
  for session in "${SESSIONS[@]}"; do
    printf -- '- [%s](%s/START-HERE.md)\n' "$session" "$session" >> "$path"
  done

  cat >> "$path" <<EOF

## Notes

- Each session folder is independent, so BMAD install state and local changes do not carry over between workshops.
- The runnable final app lives under \`<session>/files/phase-8-mvp/snapshot/\`.
- The agent replay sidecar lives under \`<session>/agent-replay/\`.
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --destination-root)
      [[ $# -ge 2 ]] || fail "Missing value for --destination-root"
      DESTINATION_ROOT="$2"
      shift 2
      ;;
    --track)
      [[ $# -ge 2 ]] || fail "Missing value for --track"
      TRACK="$2"
      shift 2
      ;;
    --agent-replay-url)
      [[ $# -ge 2 ]] || fail "Missing value for --agent-replay-url"
      AGENT_REPLAY_URL="$2"
      shift 2
      ;;
    --reset)
      RESET=1
      shift
      ;;
    --no-fetch)
      FETCH=0
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      SESSIONS+=("$1")
      shift
      ;;
  esac
done

[[ -n "$DESTINATION_ROOT" ]] || fail "--destination-root is required"
((${#SESSIONS[@]} > 0)) || fail "Supply at least one session name"

mkdir -p "$DESTINATION_ROOT"

if [[ "$FETCH" == "1" ]] && git -C "$ROOT_DIR" remote get-url origin >/dev/null 2>&1; then
  log "fetching latest refs from origin"
  git -C "$ROOT_DIR" fetch origin --prune >/dev/null
fi

session_args=()
if [[ "$RESET" == "1" ]]; then
  session_args+=(--reset)
fi
session_args+=(--no-fetch)
if [[ -n "$AGENT_REPLAY_URL" ]]; then
  session_args+=(--agent-replay-url "$AGENT_REPLAY_URL")
fi

for session in "${SESSIONS[@]}"; do
  log "creating facilitator workspace for ${session}"
  "$SCRIPT_DIR/create-facilitator-workspace.sh" \
    --track "$TRACK" \
    --destination "$DESTINATION_ROOT/$session" \
    "${session_args[@]}"
done

write_index "$DESTINATION_ROOT/README.md"
log "batch facilitator workspaces created at $DESTINATION_ROOT"
