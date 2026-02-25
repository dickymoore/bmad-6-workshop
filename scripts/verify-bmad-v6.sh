#!/usr/bin/env bash
set -euo pipefail

SCRIPT_NAME=$(basename "$0")
ROOT_DIR=$(git rev-parse --show-toplevel 2>/dev/null || pwd)

WORKSHOP_BRANCHES=(
  main
  stage-1
  stage-2
  stage-3
  stage-4
  ready-for-dev
  implementation-in-progress
  complete
  mvp
)

usage() {
  cat <<USAGE
Usage:
  ${SCRIPT_NAME} [--all] [--branch <name>] [--repo <path>] [--show-failures]
  ${SCRIPT_NAME} --help

Verify workshop branches against stable-v6 stage contracts.

Options:
  --all              Verify all workshop branches.
  --branch <name>    Verify a specific branch (repeatable).
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
  git -C "$repo" show "$ref:_bmad/bmm/config.yaml" | awk -F': *' -v k="$key" '$1==k {print $2; exit}'
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
  case "$1" in
    main)
      printf '%s\n' '^README\.md$' '^office-floorplans/' '^scripts/audit-bmad-v6\.sh$' '^scripts/migrate-bmad-v6\.sh$' '^scripts/verify-bmad-v6\.sh$'
      ;;
    stage-1)
      printf '%s\n' '^_bmad/_config/manifest\.yaml$' '^_bmad/bmm/config\.yaml$' '^\.agents/skills/' '^office-floorplans/' '^scripts/audit-bmad-v6\.sh$'
      ;;
    stage-2)
      printf '%s\n' '^_bmad/_config/manifest\.yaml$' '^\.agents/skills/' '^docs/adr/ADR-001-tech-stack\.md$' '^docs/bmm-product-brief-.*\.md$' '^docs/bmm-research-technical-.*\.md$' '^docs/brainstorming-session-results-.*\.md$'
      ;;
    stage-3)
      printf '%s\n' '^_bmad/_config/manifest\.yaml$' '^\.agents/skills/' '^docs/prd\.md$' '^docs/ux-design-specification\.md$'
      ;;
    stage-4)
      printf '%s\n' '^_bmad/_config/manifest\.yaml$' '^\.agents/skills/' '^docs/architecture\.md$' '^docs/epics\.md$' '^docs/implementation-readiness-report-.*\.md$'
      ;;
    ready-for-dev)
      printf '%s\n' '^_bmad/_config/manifest\.yaml$' '^\.agents/skills/' '^docs/sprint-artifacts/sprint-status\.yaml$' '^docs/sprint-artifacts/1-1-.*\.md$'
      ;;
    implementation-in-progress)
      printf '%s\n' '^_bmad/_config/manifest\.yaml$' '^\.agents/skills/' '^package\.json$' '^src/' '^tests/' '^data/' '^docs/sprint-artifacts/sprint-status\.yaml$'
      ;;
    complete)
      printf '%s\n' '^_bmad/_config/manifest\.yaml$' '^\.agents/skills/' '^package\.json$' '^src/' '^tests/' '^data/' '^docs/sprint-artifacts/sprint-status\.yaml$'
      ;;
    mvp)
      printf '%s\n' '^_bmad/_config/manifest\.yaml$' '^\.agents/skills/' '^package\.json$' '^src/' '^tests/' '^data/' '^docs/sprint-artifacts/sprint-status\.yaml$'
      ;;
    *)
      fail "Unknown branch rules: $1"
      ;;
  esac
}

branch_rules_forbid() {
  case "$1" in
    main)
      printf '%s\n' '^\.bmad/' '^_bmad/' '^\.agents/' '^src/' '^tests/' '^data/'
      ;;
    stage-1)
      printf '%s\n' '^\.bmad/' '^docs/prd\.md$' '^docs/ux-design-specification\.md$' '^src/' '^tests/' '^data/'
      ;;
    stage-2)
      printf '%s\n' '^\.bmad/' '^docs/prd\.md$' '^docs/ux-design-specification\.md$' '^src/' '^tests/' '^data/'
      ;;
    stage-3)
      printf '%s\n' '^\.bmad/' '^docs/architecture\.md$' '^docs/epics\.md$' '^docs/implementation-readiness-report-.*\.md$' '^docs/sprint-artifacts/' '^src/' '^tests/' '^data/'
      ;;
    stage-4)
      printf '%s\n' '^\.bmad/' '^docs/sprint-artifacts/' '^src/' '^tests/' '^data/'
      ;;
    ready-for-dev)
      printf '%s\n' '^\.bmad/' '^src/' '^tests/' '^data/'
      ;;
    implementation-in-progress|complete|mvp)
      printf '%s\n' '^\.bmad/'
      ;;
    *)
      fail "Unknown branch rules: $1"
      ;;
  esac
}

REPO="$ROOT_DIR"
SHOW_FAILURES=false
VERIFY_ALL=false
TARGET_BRANCHES=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --all)
      VERIFY_ALL=true
      shift
      ;;
    --branch)
      [[ $# -ge 2 ]] || fail "Missing value for --branch"
      TARGET_BRANCHES+=("$2")
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
  TARGET_BRANCHES=("${WORKSHOP_BRANCHES[@]}")
elif [[ ${#TARGET_BRANCHES[@]} -eq 0 ]]; then
  TARGET_BRANCHES=("$(git -C "$REPO" rev-parse --abbrev-ref HEAD)")
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
    $SHOW_FAILURES && printf '%s\n' "$req_result" | sed "s/^/[$branch] /"
  fi

  forbid_result=$(check_forbidden "$tree" "${forbids[@]}" || true)
  if [[ -n "$forbid_result" ]]; then
    branch_failed=1
    $SHOW_FAILURES && printf '%s\n' "$forbid_result" | sed "s/^/[$branch] /"
  fi

  marker_hits=$(legacy_markers "$REPO" "$ref")
  marker_count=0
  if [[ -n "$marker_hits" ]]; then
    marker_count=$(wc -l <<<"$marker_hits" | tr -d ' ')
    branch_failed=1
    $SHOW_FAILURES && printf '%s\n' "$marker_hits" | sed "s/^/[$branch] LEGACY: /"
  fi

  version="n/a"
  if [[ "$branch" != "main" ]]; then
    version=$(manifest_version "$REPO" "$ref")
    if [[ "$version" != 6.* ]] || [[ "$version" == *alpha* ]] || [[ "$version" == *Beta* ]] || [[ "$version" == *beta* ]]; then
      branch_failed=1
      $SHOW_FAILURES && echo "[$branch] BAD_VERSION:$version"
    fi

    plan_path=$(config_value "$REPO" "$ref" planning_artifacts)
    impl_path=$(config_value "$REPO" "$ref" implementation_artifacts)
    if [[ "$plan_path" != '"{project-root}/docs"' ]]; then
      branch_failed=1
      $SHOW_FAILURES && echo "[$branch] BAD_CONFIG: planning_artifacts=$plan_path"
    fi
    if [[ "$impl_path" != '"{project-root}/docs/sprint-artifacts"' ]]; then
      branch_failed=1
      $SHOW_FAILURES && echo "[$branch] BAD_CONFIG: implementation_artifacts=$impl_path"
    fi
  fi

  status="PASS"
  if [[ "$branch_failed" -eq 1 ]]; then
    status="FAIL"
    failures=$((failures + 1))
  fi

  log "branch=$branch status=$status version=$version legacy_hits=$marker_count"
done

if [[ "$failures" -gt 0 ]]; then
  log "Verification failed branches=$failures"
  exit 1
fi

log "Verification passed"
