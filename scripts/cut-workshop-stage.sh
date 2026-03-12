#!/usr/bin/env bash
set -euo pipefail

SCRIPT_NAME=$(basename "$0")
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
ROOT_DIR=$(git rev-parse --show-toplevel 2>/dev/null || pwd)

# shellcheck source=scripts/lib/workshop_tracks.sh
source "$SCRIPT_DIR/lib/workshop_tracks.sh"

TRACK=$(workshop_default_track)
COMPLETED_STAGE=""
AUTHORING_BRANCH=""
CUTS_LOG=""
PUSH_CHANGES=true
RUN_VALIDATION=true

usage() {
  cat <<USAGE
Usage:
  ./${SCRIPT_NAME} --track <id> --completed-stage <stage-id> [options]

Create the next frozen workshop branch from the current authoring branch.

Required:
  --completed-stage <id>   Stage just completed on authoring/<track>
                           Example: 10-analysis

Options:
  --track <id>             Workshop track id (default: value from workshops/index.json)
  --authoring-branch <b>   Override expected authoring branch (default: authoring/<track>)
  --cuts-log <path>        Local cut log path (default: workshop-logs/<track>/cuts.md)
  --no-push                Do not push the new branch and tag
  --skip-validate          Skip audit/verify/reviewer checks on the new branch
  -h, --help               Show help

Example:
  ./${SCRIPT_NAME} --track albemarle-pulse --completed-stage 10-analysis
USAGE
}

log() {
  printf '[%s] %s\n' "$(date +'%Y-%m-%d %H:%M:%S')" "$*"
}

fail() {
  echo "ERROR: $*" >&2
  exit 2
}

require_clean_tree() {
  if [[ -n "$(git -C "$ROOT_DIR" status --porcelain)" ]]; then
    fail "Working tree is not clean; commit or stash before cutting a stage branch"
  fi
}

local_branch_exists() {
  local branch="$1"
  git -C "$ROOT_DIR" show-ref --verify --quiet "refs/heads/$branch"
}

remote_branch_exists() {
  local branch="$1"
  git -C "$ROOT_DIR" show-ref --verify --quiet "refs/remotes/origin/$branch"
}

ensure_cuts_log() {
  local path="$1"
  mkdir -p "$(dirname "$path")"
  if [[ ! -f "$path" ]]; then
    cat > "$path" <<EOF
# Cut Log: ${TRACK}

EOF
  fi
}

append_cut_log() {
  local path="$1"
  local completed_branch="$2"
  local next_branch="$3"
  local sha="$4"
  local tag_name="$5"
  local timestamp
  timestamp=$(date -u +'%Y-%m-%dT%H:%M:%SZ')
  cat >> "$path" <<EOF
- ${timestamp} completed \`${completed_branch}\` on \`${AUTHORING_BRANCH}\`
  - sha: \`${sha}\`
  - tag: \`${tag_name}\`
  - next branch cut: \`${next_branch}\`

EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --track)
      [[ $# -ge 2 ]] || fail "Missing value for --track"
      TRACK="$2"
      shift 2
      ;;
    --completed-stage)
      [[ $# -ge 2 ]] || fail "Missing value for --completed-stage"
      COMPLETED_STAGE="$2"
      shift 2
      ;;
    --authoring-branch)
      [[ $# -ge 2 ]] || fail "Missing value for --authoring-branch"
      AUTHORING_BRANCH="$2"
      shift 2
      ;;
    --cuts-log)
      [[ $# -ge 2 ]] || fail "Missing value for --cuts-log"
      CUTS_LOG="$2"
      shift 2
      ;;
    --no-push)
      PUSH_CHANGES=false
      shift
      ;;
    --skip-validate)
      RUN_VALIDATION=false
      shift
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

[[ -n "$COMPLETED_STAGE" ]] || fail "--completed-stage is required"

if [[ -z "$AUTHORING_BRANCH" ]]; then
  AUTHORING_BRANCH="authoring/${TRACK}"
fi

if [[ -z "$CUTS_LOG" ]]; then
  CUTS_LOG="$ROOT_DIR/workshop-logs/${TRACK}/cuts.md"
fi

require_clean_tree

current_branch=$(git -C "$ROOT_DIR" branch --show-current)
[[ "$current_branch" == "$AUTHORING_BRANCH" ]] || fail "Current branch must be ${AUTHORING_BRANCH}; found ${current_branch}"

completed_branch=$(workshop_stage_branch "$TRACK" "$COMPLETED_STAGE")
next_branch=$(workshop_stage_next_branch "$TRACK" "$COMPLETED_STAGE")
[[ -n "$next_branch" ]] || fail "Stage ${COMPLETED_STAGE} has no next branch configured"

if local_branch_exists "$next_branch" || remote_branch_exists "$next_branch"; then
  fail "Next branch already exists: ${next_branch}"
fi

sha=$(git -C "$ROOT_DIR" rev-parse HEAD)
short_sha=$(git -C "$ROOT_DIR" rev-parse --short HEAD)
tag_name="cut/${TRACK}/${COMPLETED_STAGE}-complete"

if git -C "$ROOT_DIR" rev-parse -q --verify "refs/tags/${tag_name}" >/dev/null 2>&1; then
  fail "Cut tag already exists: ${tag_name}"
fi

git -C "$ROOT_DIR" tag -a "$tag_name" -m "${TRACK} ${COMPLETED_STAGE} complete" "$sha"
git -C "$ROOT_DIR" branch "$next_branch" "$sha"

ensure_cuts_log "$CUTS_LOG"
append_cut_log "$CUTS_LOG" "$completed_branch" "$next_branch" "$short_sha" "$tag_name"

log "created tag ${tag_name} at ${short_sha}"
log "created branch ${next_branch} at ${short_sha}"
log "updated cut log ${CUTS_LOG}"

if $RUN_VALIDATION; then
  "$ROOT_DIR/scripts/audit-bmad-v6.sh" --track "$TRACK" --branch "$next_branch"
  "$ROOT_DIR/scripts/verify-bmad-v6.sh" --track "$TRACK" --branch "$next_branch"
  "$ROOT_DIR/workshop-reviewer.sh" --track "$TRACK" "$next_branch"
fi

if $PUSH_CHANGES; then
  if git -C "$ROOT_DIR" remote get-url origin >/dev/null 2>&1; then
    git -C "$ROOT_DIR" push origin "$next_branch"
    git -C "$ROOT_DIR" push origin "$tag_name"
    log "pushed ${next_branch} and ${tag_name} to origin"
  else
    log "origin remote not configured; skipping push"
  fi
fi

log "stage cut complete for track=${TRACK} completed_stage=${COMPLETED_STAGE} next_branch=${next_branch}"
