#!/usr/bin/env bash
set -euo pipefail

SCRIPT_NAME=$(basename "$0")
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
ROOT_DIR=$(git rev-parse --show-toplevel 2>/dev/null || pwd)

# shellcheck source=scripts/lib/workshop_tracks.sh
source "$SCRIPT_DIR/lib/workshop_tracks.sh"

declare -A TARGET_BRANCH_SET=()

usage() {
  cat <<USAGE
Usage:
  ${SCRIPT_NAME} [--all] [--branch <name>] [--track <id>] [--repo <path>] [--show-failures]
  ${SCRIPT_NAME} --help

Verify workshop branches against stable-v6 stage contracts.

Options:
  --all              Verify all canonical branches for the selected track.
  --branch <name>    Verify a specific branch (repeatable).
                     Accepts namespaced canonical names plus compatibility aliases.
  --track <id>       Workshop track id (default: value from workshops/index.json).
  --repo <path>      Target repository path (default: current git root).
  --show-failures    Print failing pattern checks.
  -h, --help         Show help.

Exit code:
  0 on full pass, 1 on verification failures.
USAGE
}

log() {
  printf '[%s] %s\n' "$(date +'%Y-%m-%d %H:%M:%S')" "$*"
}

fail() {
  echo "ERROR: $*" >&2
  exit 2
}

canonicalize_branch() {
  local branch="$1"
  workshop_resolve_branch "$TRACK" "$branch"
}

add_target_branch() {
  local input_branch="$1"
  local canonical_branch
  canonical_branch=$(canonicalize_branch "$input_branch")

  if [[ "$canonical_branch" != "$input_branch" ]]; then
    log "mapped branch '$input_branch' -> '$canonical_branch'"
  fi

  if [[ -n "${TARGET_BRANCH_SET[$canonical_branch]:-}" ]]; then
    return 0
  fi

  TARGET_BRANCH_SET[$canonical_branch]=1
  TARGET_BRANCHES+=("$canonical_branch")
}

require_git_repo() {
  local repo="$1"
  git -C "$repo" rev-parse --is-inside-work-tree >/dev/null 2>&1 || fail "Not a git repo: $repo"
}

branch_exists() {
  local repo="$1"
  local branch="$2"
  git -C "$repo" show-ref --verify --quiet "refs/heads/$branch" || \
    git -C "$repo" show-ref --verify --quiet "refs/remotes/origin/$branch"
}

resolve_ref() {
  local repo="$1"
  local branch="$2"
  if git -C "$repo" show-ref --verify --quiet "refs/heads/$branch"; then
    echo "$branch"
  elif git -C "$repo" show-ref --verify --quiet "refs/remotes/origin/$branch"; then
    echo "origin/$branch"
  else
    fail "Branch not found: $branch"
  fi
}

tree_for_branch() {
  local repo="$1"
  local ref="$2"
  git -C "$repo" ls-tree -r --name-only "$ref"
}

manifest_version() {
  local repo="$1"
  local ref="$2"
  if ! git -C "$repo" cat-file -e "$ref:_bmad/_config/manifest.yaml" 2>/dev/null; then
    echo "n/a"
    return 0
  fi
  git -C "$repo" show "$ref:_bmad/_config/manifest.yaml" | awk -F': *' '/version:/{print $2; exit}'
}

config_value() {
  local repo="$1"
  local ref="$2"
  local key="$3"
  if ! git -C "$repo" cat-file -e "$ref:_bmad/bmm/config.yaml" 2>/dev/null; then
    echo ""
    return 0
  fi
  git -C "$repo" show "$ref:_bmad/bmm/config.yaml" | awk -v k="$key" '
    $0 ~ "^[[:space:]]*" k ":[[:space:]]*" {
      sub(/^[[:space:]]*[^:]+:[[:space:]]*/, "", $0)
      gsub(/[[:space:]]+$/, "", $0)
      print $0
      exit
    }'
}

normalize_yaml_scalar() {
  local value="$1"
  value="${value#"${value%%[![:space:]]*}"}"
  value="${value%"${value##*[![:space:]]}"}"
  if [[ ${#value} -ge 2 ]]; then
    if [[ "${value:0:1}" == '"' && "${value: -1}" == '"' ]]; then
      value="${value:1:${#value}-2}"
    elif [[ "${value:0:1}" == "'" && "${value: -1}" == "'" ]]; then
      value="${value:1:${#value}-2}"
    fi
  fi
  echo "$value"
}

legacy_markers() {
  local repo="$1"
  local ref="$2"
  local regex='@alpha|/prompts:bmad-|\*workflow-init|\*workflow-status'
  git -C "$repo" grep -nE "$regex" "$ref" -- ':*.md' ':*.yaml' ':*.yml' 'workshop-reviewer.sh' 2>/dev/null || true
}

check_requirements() {
  local tree="$1"
  shift
  local failed=0
  local pattern
  for pattern in "$@"; do
    if ! grep -Eq "$pattern" <<<"$tree"; then
      echo "MISSING:$pattern"
      failed=1
    fi
  done
  return "$failed"
}

check_forbidden() {
  local tree="$1"
  shift
  local failed=0
  local pattern
  for pattern in "$@"; do
    if grep -Eq "$pattern" <<<"$tree"; then
      echo "UNEXPECTED:$pattern"
      failed=1
    fi
  done
  return "$failed"
}

branch_rules_require() {
  workshop_branch_field "$TRACK" "$1" required_patterns
}

branch_rules_forbid() {
  workshop_branch_field "$TRACK" "$1" forbidden_patterns
}

TRACK=$(workshop_default_track)
REPO="$ROOT_DIR"
SHOW_FAILURES=false
VERIFY_ALL=false
TARGET_BRANCHES=()
PENDING_BRANCHES=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --all)
      VERIFY_ALL=true
      shift
      ;;
    --branch)
      [[ $# -ge 2 ]] || fail "Missing value for --branch"
      PENDING_BRANCHES+=("$2")
      shift 2
      ;;
    --track)
      [[ $# -ge 2 ]] || fail "Missing value for --track"
      TRACK="$2"
      shift 2
      ;;
    --repo)
      [[ $# -ge 2 ]] || fail "Missing value for --repo"
      REPO="$2"
      shift 2
      ;;
    --show-failures)
      SHOW_FAILURES=true
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

require_git_repo "$REPO"

if $VERIFY_ALL; then
  mapfile -t TARGET_BRANCHES < <(workshop_list_branches "$TRACK" 1)
else
  for branch in "${PENDING_BRANCHES[@]}"; do
    add_target_branch "$branch"
  done
  if [[ ${#TARGET_BRANCHES[@]} -eq 0 ]]; then
    current_branch=$(git -C "$REPO" rev-parse --abbrev-ref HEAD)
    [[ "$current_branch" != "HEAD" ]] || fail "Detached HEAD is not supported without --branch"
    add_target_branch "$current_branch"
  fi
fi

failures=0

for branch in "${TARGET_BRANCHES[@]}"; do
  branch_exists "$REPO" "$branch" || fail "Branch not found: $branch"
  ref=$(resolve_ref "$REPO" "$branch")
  tree=$(tree_for_branch "$REPO" "$ref")

  mapfile -t requires < <(branch_rules_require "$branch")
  mapfile -t forbids < <(branch_rules_forbid "$branch")

  branch_failed=0
  req_result=$(check_requirements "$tree" "${requires[@]}" || true)
  if [[ -n "$req_result" ]]; then
    branch_failed=1
    $SHOW_FAILURES && printf '%s\n' "$req_result" | awk -v prefix="[$branch] " '{ print prefix $0 }'
  fi

  forbid_result=$(check_forbidden "$tree" "${forbids[@]}" || true)
  if [[ -n "$forbid_result" ]]; then
    branch_failed=1
    $SHOW_FAILURES && printf '%s\n' "$forbid_result" | awk -v prefix="[$branch] " '{ print prefix $0 }'
  fi

  marker_hits=$(legacy_markers "$REPO" "$ref")
  marker_count=0
  if [[ -n "$marker_hits" ]]; then
    marker_count=$(wc -l <<<"$marker_hits" | tr -d ' ')
    branch_failed=1
    $SHOW_FAILURES && printf '%s\n' "$marker_hits" | awk -v prefix="[$branch] LEGACY: " '{ print prefix $0 }'
  fi

  version="n/a"
  if [[ "$branch" != "main" ]]; then
    version=$(manifest_version "$REPO" "$ref")
    if [[ ! "$version" =~ ^6\. ]] || [[ "$version" =~ [Aa]lpha ]] || [[ "$version" =~ [Bb]eta ]]; then
      branch_failed=1
      $SHOW_FAILURES && echo "[$branch] BAD_VERSION:$version"
    fi

    plan_path=$(normalize_yaml_scalar "$(config_value "$REPO" "$ref" planning_artifacts)")
    impl_path=$(normalize_yaml_scalar "$(config_value "$REPO" "$ref" implementation_artifacts)")
    if [[ "$plan_path" != '{project-root}/docs' ]]; then
      branch_failed=1
      $SHOW_FAILURES && echo "[$branch] BAD_CONFIG: planning_artifacts=$plan_path"
    fi
    if [[ "$impl_path" != '{project-root}/docs/sprint-artifacts' ]]; then
      branch_failed=1
      $SHOW_FAILURES && echo "[$branch] BAD_CONFIG: implementation_artifacts=$impl_path"
    fi
  fi

  status="PASS"
  if [[ "$branch_failed" -eq 1 ]]; then
    status="FAIL"
    failures=$((failures + 1))
  fi

  log "track=$TRACK branch=$branch status=$status version=$version legacy_hits=$marker_count"
done

if [[ "$failures" -gt 0 ]]; then
  log "Verification failed branches=$failures"
  exit 1
fi

log "Verification passed"
