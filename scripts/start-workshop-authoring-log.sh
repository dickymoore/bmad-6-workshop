#!/usr/bin/env bash
set -euo pipefail

SCRIPT_NAME=$(basename "$0")
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
ROOT_DIR=$(git rev-parse --show-toplevel 2>/dev/null || pwd)

# shellcheck source=scripts/lib/workshop_tracks.sh
source "$SCRIPT_DIR/lib/workshop_tracks.sh"

TRACK=$(workshop_default_track)
STAGE=""
LOGS_ROOT="$ROOT_DIR/workshop-logs"

usage() {
  cat <<USAGE
Usage:
  ./${SCRIPT_NAME} --track <id> --stage <stage-id> [--logs-root <path>]

Start a local terminal transcript for workshop authoring with the Unix `script`
command. The transcript is stored under workshop-logs/ and is ignored by Git.

Example:
  ./${SCRIPT_NAME} --track albemarle-pulse --stage 10-analysis
USAGE
}

fail() {
  echo "ERROR: $*" >&2
  exit 2
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --track)
      [[ $# -ge 2 ]] || fail "Missing value for --track"
      TRACK="$2"
      shift 2
      ;;
    --stage)
      [[ $# -ge 2 ]] || fail "Missing value for --stage"
      STAGE="$2"
      shift 2
      ;;
    --logs-root)
      [[ $# -ge 2 ]] || fail "Missing value for --logs-root"
      LOGS_ROOT="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      fail "Unknown argument: $1"
      ;;
  esac
done

[[ -n "$STAGE" ]] || fail "--stage is required"
command -v script >/dev/null 2>&1 || fail "The 'script' command is required"

mkdir -p "$LOGS_ROOT/$TRACK"
logfile="$LOGS_ROOT/$TRACK/${STAGE}.$(date +%F-%H%M%S).log"

echo "Starting transcript: $logfile"
echo "Exit the subshell normally when you want to stop recording."

exec script -q -f "$logfile"
