#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage:
  ./workshop-reviewer.sh                # check current branch (HEAD)
  ./workshop-reviewer.sh <branch>       # check a specific branch
  ./workshop-reviewer.sh --all          # check all workshop branches
  ./workshop-reviewer.sh --help

This script validates that each workshop stage branch is in the expected
"pre-artifact" state and prints a short facilitation guide for that stage.

Note: checks are based on the committed tree of the branch, not your working tree.
USAGE
}

branches=(
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

require_patterns=()
forbid_patterns=()

guidance=""

set_stage_rules() {
  local stage="$1"
  require_patterns=()
  forbid_patterns=()
  guidance=""

  case "$stage" in
    main)
      require_patterns=(
        '^README\.md$'
        '^office-floorplans/'
      )
      forbid_patterns=(
        '^\.bmad/'
        '^docs/'
        '^data/'
        '^package\.json$'
        '^src/'
        '^tests/'
      )
      guidance=$'Main: verify tooling + install BMAD, then checkout stage-1.\n- Suggested next: `git checkout stage-1` and follow `README.md`.'
      ;;
    stage-1)
      require_patterns=(
        '^\.bmad/'
      )
      forbid_patterns=(
        '^docs/'
        '^docs/prd\.md$'
        '^docs/ux-design-specification\.md$'
        '^data/'
        '^package\.json$'
        '^src/'
        '^tests/'
      )
      guidance=$'Stage 1 (Analysis): run analyst workflow-init, brainstorming/research/product brief.\n- When done: stash and `git checkout stage-2`.'
      ;;
    stage-2)
      require_patterns=(
        '^docs/adr/ADR-001-tech-stack\.md$'
        '^docs/brainstorming-session-results-.*\.md$'
        '^docs/bmm-product-brief-.*\.md$'
        '^docs/bmm-research-technical-.*\.md$'
        '^docs/bmm-workflow-status\.yaml$'
      )
      forbid_patterns=(
        '^docs/prd\.md$'
        '^docs/ux-design-specification\.md$'
        '^data/'
        '^package\.json$'
        '^src/'
        '^tests/'
      )
      guidance=$'Stage 2 (Planning): continue from workflow-status to produce PRD + UX.\n- When done: stash and `git checkout stage-3`.'
      ;;
    stage-3)
      require_patterns=(
        '^docs/prd\.md$'
        '^docs/ux-design-specification\.md$'
      )
      forbid_patterns=(
        '^docs/architecture\.md$'
        '^docs/epics\.md$'
        '^docs/implementation-readiness-report-.*\.md$'
        '^docs/sprint-artifacts/'
        '^data/'
        '^package\.json$'
        '^src/'
        '^tests/'
      )
      guidance=$'Stage 3 (Solutioning): create architecture + epics/stories + implementation readiness.\n- When done: stash and `git checkout stage-4`.'
      ;;
    stage-4)
      require_patterns=(
        '^docs/architecture\.md$'
        '^docs/epics\.md$'
        '^docs/implementation-readiness-report-.*\.md$'
        '^docs/test-design-epic-1\.md$'
      )
      forbid_patterns=(
        '^docs/sprint-artifacts/'
        '^data/'
        '^package\.json$'
        '^src/'
        '^tests/'
      )
      guidance=$'Stage 4 (Implementation setup): sprint-planning + create-story/story-context.\n- When done: `git checkout ready-for-dev`.'
      ;;
    ready-for-dev)
      require_patterns=(
        '^docs/sprint-artifacts/sprint-status\.yaml$'
        '^docs/sprint-artifacts/1-1-.*\.md$'
      )
      forbid_patterns=(
        '^data/'
        '^package\.json$'
        '^src/'
        '^tests/'
      )
      guidance=$'Ready-for-dev: use dev agent to implement stories + code-review.\n- When done: `git checkout implementation-in-progress`.'
      ;;
    implementation-in-progress)
      require_patterns=(
        '^package\.json$'
        '^src/'
        '^data/'
        '^docs/sprint-artifacts/sprint-status\.yaml$'
      )
      forbid_patterns=()
      guidance=$'Implementation-in-progress: finish remaining story, run app, update sprint status.\n- When done: `git checkout complete`.'
      ;;
    complete)
      require_patterns=(
        '^package\.json$'
        '^src/'
        '^data/'
      )
      forbid_patterns=()
      guidance=$'Complete: run app, reproduce/fix any remaining bug via correct-course.\n- When done: `git checkout mvp`.'
      ;;
    mvp)
      require_patterns=(
        '^package\.json$'
        '^src/'
        '^public/'
        '^scripts/'
        '^data/'
      )
      forbid_patterns=()
      guidance=$'MVP: final working app; run, demo, and discuss learnings.'
      ;;
    *)
      echo "Unknown stage: $stage" >&2
      exit 2
      ;;
  esac
}

list_tree() {
  local branch="$1"
  git ls-tree -r --name-only "$branch"
}

check_branch() {
  local branch="$1"
  set_stage_rules "$branch"
  local tree
  tree=$(list_tree "$branch")

  echo "==> $branch"

  local missing=0
  for pattern in "${require_patterns[@]}"; do
    if ! grep -Eq "$pattern" <<<"$tree"; then
      echo "  MISSING: $pattern"
      missing=1
    fi
  done

  local unexpected=0
  for pattern in "${forbid_patterns[@]}"; do
    if grep -Eq "$pattern" <<<"$tree"; then
      echo "  UNEXPECTED: $pattern"
      unexpected=1
    fi
  done

  if [[ $missing -eq 0 && $unexpected -eq 0 ]]; then
    echo "  OK"
  fi

  echo "$guidance" | sed 's/^/  /'
  echo
}

if [[ ${1:-} == "--help" || ${1:-} == "-h" ]]; then
  usage
  exit 0
fi

if [[ ${1:-} == "--all" ]]; then
  for b in "${branches[@]}"; do
    check_branch "$b"
  done
  exit 0
fi

branch="${1:-}"
if [[ -z "$branch" ]]; then
  branch=$(git rev-parse --abbrev-ref HEAD)
fi

check_branch "$branch"
