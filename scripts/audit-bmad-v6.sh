#!/usr/bin/env bash
set -euo pipefail

SCRIPT_NAME=$(basename "$0")
ROOT_DIR=$(git rev-parse --show-toplevel 2>/dev/null || pwd)

WORKSHOP_BRANCHES=(
  main
  workshop/10-analysis
  workshop/20-planning
  workshop/30-solutioning
  workshop/40-implementation-setup
  workshop/50-ready-for-dev
  workshop/60-implementation
  workshop/70-complete
  workshop/80-mvp
)

declare -A LEGACY_TO_CANONICAL=(
  [stage-1]=workshop/10-analysis
  [stage-2]=workshop/20-planning
  [stage-3]=workshop/30-solutioning
  [stage-4]=workshop/40-implementation-setup
  [ready-for-dev]=workshop/50-ready-for-dev
  [implementation-in-progress]=workshop/60-implementation
  [complete]=workshop/70-complete
  [mvp]=workshop/80-mvp
)

declare -A SELECTED_BRANCH_SET=()

usage() {
  cat <<USAGE
Usage:
  ${SCRIPT_NAME} [--all] [--branch <name>] [--show-hits] [--repo <path>]
  ${SCRIPT_NAME} --help

Audit workshop branches for BMAD stable-v6 alignment issues.

Options:
  --all            Audit all canonical workshop branches.
  --branch <name>  Audit a specific branch (repeatable).
                   Accepts canonical names or legacy aliases.
  --show-hits      Print matching legacy markers per branch.
  --repo <path>    Target repository path (default: current git root).
  -h, --help       Show help.

Exit code:
  0 if all audited branches are clean; 1 if any violations are found.
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
  if [[ "$branch" == "main" ]]; then
    echo "main"
    return 0
  fi
  if [[ -n "${LEGACY_TO_CANONICAL[$branch]:-}" ]]; then
    echo "${LEGACY_TO_CANONICAL[$branch]}"
    return 0
  fi
  echo "$branch"
}

add_selected_branch() {
  local input_branch="$1"
  local canonical_branch
  canonical_branch=$(canonicalize_branch "$input_branch")

  if [[ "$canonical_branch" != "$input_branch" ]]; then
    log "mapped legacy branch '$input_branch' -> '$canonical_branch'"
  fi

  if [[ -n "${SELECTED_BRANCH_SET[$canonical_branch]:-}" ]]; then
    return 0
  fi

  SELECTED_BRANCH_SET[$canonical_branch]=1
  SELECTED_BRANCHES+=("$canonical_branch")
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

branch_tree() {
  local repo="$1"
  local ref="$2"
  git -C "$repo" ls-tree -r --name-only "$ref"
}

manifest_version() {
  local repo="$1"
  local ref="$2"
  if git -C "$repo" cat-file -e "$ref:_bmad/_config/manifest.yaml" 2>/dev/null; then
    git -C "$repo" show "$ref:_bmad/_config/manifest.yaml" \
      | awk -F': *' '/version:/{print $2; exit}'
  elif git -C "$repo" cat-file -e "$ref:.bmad/_cfg/manifest.yaml" 2>/dev/null; then
    git -C "$repo" show "$ref:.bmad/_cfg/manifest.yaml" \
      | awk -F': *' '/version:/{print $2; exit}'
  else
    echo "n/a"
  fi
}

legacy_hits() {
  local repo="$1"
  local ref="$2"
  local regex='@alpha|/prompts:bmad-|\*workflow-init|\*workflow-status'
  git -C "$repo" grep -nE "$regex" "$ref" -- ':*.md' ':*.yaml' ':*.yml' 'workshop-reviewer.sh' 2>/dev/null || true
}

REPO="$ROOT_DIR"
SHOW_HITS=false
SELECTED_BRANCHES=()
AUDIT_ALL=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --all)
      AUDIT_ALL=true
      shift
      ;;
    --branch)
      [[ $# -ge 2 ]] || fail "Missing value for --branch"
      add_selected_branch "$2"
      shift 2
      ;;
    --show-hits)
      SHOW_HITS=true
      shift
      ;;
    --repo)
      [[ $# -ge 2 ]] || fail "Missing value for --repo"
      REPO="$2"
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

require_git_repo "$REPO"

if $AUDIT_ALL; then
  SELECTED_BRANCHES=("${WORKSHOP_BRANCHES[@]}")
elif [[ ${#SELECTED_BRANCHES[@]} -eq 0 ]]; then
  current_branch=$(git -C "$REPO" rev-parse --abbrev-ref HEAD)
  [[ "$current_branch" != "HEAD" ]] || fail "Detached HEAD is not supported without --branch"
  add_selected_branch "$current_branch"
fi

violations=0

for branch in "${SELECTED_BRANCHES[@]}"; do
  branch_exists "$REPO" "$branch" || fail "Branch not found: $branch"
  ref=$(resolve_ref "$REPO" "$branch")

  tree=$(branch_tree "$REPO" "$ref")
  has_legacy_dir="no"
  has_stable_dir="no"
  if grep -Eq '^\.bmad/' <<<"$tree"; then
    has_legacy_dir="yes"
  fi
  if grep -Eq '^_bmad/' <<<"$tree"; then
    has_stable_dir="yes"
  fi

  version=$(manifest_version "$REPO" "$ref")
  hits=$(legacy_hits "$REPO" "$ref")
  hit_count=0
  if [[ -n "$hits" ]]; then
    hit_count=$(wc -l <<<"$hits" | tr -d ' ')
  fi

  branch_fail=0
  if [[ "$branch" != "main" && "$has_stable_dir" != "yes" ]]; then
    branch_fail=1
  fi
  if [[ "$has_legacy_dir" == "yes" ]]; then
    branch_fail=1
  fi
  if [[ "$branch" != "main" ]]; then
    if [[ ! "$version" =~ ^6\. ]] || [[ "$version" =~ [Aa]lpha ]] || [[ "$version" =~ [Bb]eta ]]; then
      branch_fail=1
    fi
  fi
  if [[ "$hit_count" -gt 0 ]]; then
    branch_fail=1
  fi

  status="PASS"
  if [[ "$branch_fail" -eq 1 ]]; then
    status="FAIL"
    violations=$((violations + 1))
  fi

  log "branch=$branch status=$status stable_dir=$has_stable_dir legacy_dir=$has_legacy_dir manifest_version=$version legacy_hits=$hit_count"

  if $SHOW_HITS && [[ "$hit_count" -gt 0 ]]; then
    printf '%s\n' "$hits" | sed 's/^/  hit: /'
  fi

done

if [[ "$violations" -gt 0 ]]; then
  log "Audit completed with violations=$violations"
  exit 1
fi

log "Audit completed cleanly"
