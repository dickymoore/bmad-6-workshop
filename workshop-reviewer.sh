#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage:
  ./workshop-reviewer.sh                             # check current branch (HEAD)
  ./workshop-reviewer.sh <branch>                    # check a specific branch
  ./workshop-reviewer.sh --all                       # check all workshop branches
  ./workshop-reviewer.sh --dev [branch]              # start the correct dev server
  ./workshop-reviewer.sh --dev --all                 # smoke-check dev server on all branches
  ./workshop-reviewer.sh --e2e [branch]              # run Playwright e2e (app stages only)
  ./workshop-reviewer.sh --e2e --all                 # run Playwright e2e on app branches
  ./workshop-reviewer.sh --help

This script validates that each workshop stage branch is in the expected
"pre-artifact" state and prints a short facilitation guide for that stage.

Notes:
- Checks are based on the committed tree of the branch, not your working tree.
- --all uses canonical workshop/* branch names.
- Positional branch accepts canonical names and legacy aliases.
- --dev/--e2e may switch branches; keep your working tree clean.
USAGE
}

branches=(
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

mode="check"
run_all=false
target_branch=""

require_patterns=()
forbid_patterns=()

guidance=""

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

branch_exists() {
  local branch="$1"
  git show-ref --verify --quiet "refs/heads/$branch" || \
    git show-ref --verify --quiet "refs/remotes/origin/$branch"
}

ensure_local_branch() {
  local branch="$1"
  if git show-ref --verify --quiet "refs/heads/$branch"; then
    return 0
  fi

  if git show-ref --verify --quiet "refs/remotes/origin/$branch"; then
    git checkout -b "$branch" "origin/$branch" >/dev/null
    return 0
  fi

  echo "Branch not found locally or on origin: $branch" >&2
  exit 2
}

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
        '^scripts/audit-bmad-v6\.sh$'
        '^scripts/migrate-bmad-v6\.sh$'
        '^scripts/verify-bmad-v6\.sh$'
      )
      forbid_patterns=(
        '^\.bmad/'
        '^_bmad/'
        '^\.agents/'
        '^docs/'
        '^data/'
        '^package\.json$'
        '^src/'
        '^tests/'
      )
      guidance=$'Main: verify tooling + install BMAD stable v6, then checkout workshop/10-analysis.\n- Suggested next: `git checkout workshop/10-analysis` and follow `README.md`.'
      ;;
    workshop/10-analysis)
      require_patterns=(
        '^_bmad/_config/manifest\.yaml$'
        '^_bmad/bmm/config\.yaml$'
        '^\.agents/skills/'
        '^office-floorplans/'
        '^scripts/audit-bmad-v6\.sh$'
        '^scripts/migrate-bmad-v6\.sh$'
        '^scripts/verify-bmad-v6\.sh$'
      )
      forbid_patterns=(
        '^\.bmad/'
        '^docs/'
        '^data/'
        '^package\.json$'
        '^src/'
        '^tests/'
      )
      guidance=$'Stage 1 (Analysis): use `/bmad-agent-bmm-analyst` + `/bmad-bmm-create-product-brief` and research workflows.\n- When done: stash and `git checkout workshop/20-planning`.'
      ;;
    workshop/20-planning)
      require_patterns=(
        '^_bmad/_config/manifest\.yaml$'
        '^_bmad/bmm/config\.yaml$'
        '^\.agents/skills/'
        '^docs/adr/ADR-001-tech-stack\.md$'
        '^docs/brainstorming-session-results-.*\.md$'
        '^docs/bmm-product-brief-.*\.md$'
        '^docs/bmm-research-technical-.*\.md$'
        '^scripts/audit-bmad-v6\.sh$'
      )
      forbid_patterns=(
        '^\.bmad/'
        '^docs/prd\.md$'
        '^docs/ux-design-specification\.md$'
        '^data/'
        '^package\.json$'
        '^src/'
        '^tests/'
      )
      guidance=$'Stage 2 (Planning): use `/bmad-agent-bmm-pm` + `/bmad-bmm-create-prd` and `/bmad-bmm-create-ux-design`.\n- When done: stash and `git checkout workshop/30-solutioning`.'
      ;;
    workshop/30-solutioning)
      require_patterns=(
        '^_bmad/_config/manifest\.yaml$'
        '^_bmad/bmm/config\.yaml$'
        '^\.agents/skills/'
        '^docs/prd\.md$'
        '^docs/ux-design-specification\.md$'
      )
      forbid_patterns=(
        '^\.bmad/'
        '^docs/architecture\.md$'
        '^docs/epics\.md$'
        '^docs/implementation-readiness-report-.*\.md$'
        '^docs/sprint-artifacts/'
        '^data/'
        '^package\.json$'
        '^src/'
        '^tests/'
      )
      guidance=$'Stage 3 (Solutioning): use `/bmad-agent-bmm-architect` + `/bmad-bmm-create-architecture` and `/bmad-bmm-create-epics-and-stories`.\n- When done: stash and `git checkout workshop/40-implementation-setup`.'
      ;;
    workshop/40-implementation-setup)
      require_patterns=(
        '^_bmad/_config/manifest\.yaml$'
        '^_bmad/bmm/config\.yaml$'
        '^\.agents/skills/'
        '^docs/architecture\.md$'
        '^docs/epics\.md$'
        '^docs/implementation-readiness-report-.*\.md$'
        '^docs/test-design-epic-1\.md$'
      )
      forbid_patterns=(
        '^\.bmad/'
        '^docs/sprint-artifacts/'
        '^data/'
        '^package\.json$'
        '^src/'
        '^tests/'
      )
      guidance=$'Stage 4 (Implementation setup): run `/bmad-bmm-check-implementation-readiness`, then `/bmad-bmm-sprint-planning` and `/bmad-bmm-create-story`.\n- When done: `git checkout workshop/50-ready-for-dev`.'
      ;;
    workshop/50-ready-for-dev)
      require_patterns=(
        '^_bmad/_config/manifest\.yaml$'
        '^_bmad/bmm/config\.yaml$'
        '^\.agents/skills/'
        '^docs/sprint-artifacts/sprint-status\.yaml$'
        '^docs/sprint-artifacts/1-1-.*\.md$'
      )
      forbid_patterns=(
        '^\.bmad/'
        '^data/'
        '^package\.json$'
        '^src/'
        '^tests/'
      )
      guidance=$'Ready-for-dev: use `/bmad-agent-bmm-dev` + `/bmad-bmm-dev-story` and `/bmad-bmm-code-review`.\n- When done: `git checkout workshop/60-implementation`.'
      ;;
    workshop/60-implementation)
      require_patterns=(
        '^_bmad/_config/manifest\.yaml$'
        '^_bmad/bmm/config\.yaml$'
        '^\.agents/skills/'
        '^package\.json$'
        '^src/'
        '^data/'
        '^docs/sprint-artifacts/sprint-status\.yaml$'
        '^tests/'
      )
      forbid_patterns=(
        '^\.bmad/'
      )
      guidance=$'Implementation stage: finish stories via `/bmad-bmm-dev-story`, run app/tests, and update sprint status.\n- When done: `git checkout workshop/70-complete`.'
      ;;
    workshop/70-complete)
      require_patterns=(
        '^_bmad/_config/manifest\.yaml$'
        '^_bmad/bmm/config\.yaml$'
        '^\.agents/skills/'
        '^package\.json$'
        '^src/'
        '^data/'
        '^docs/sprint-artifacts/sprint-status\.yaml$'
        '^tests/'
      )
      forbid_patterns=(
        '^\.bmad/'
      )
      guidance=$'Complete stage: run app and use `/bmad-bmm-correct-course` for any meaningful pivot.\n- When done: `git checkout workshop/80-mvp`.'
      ;;
    workshop/80-mvp)
      require_patterns=(
        '^_bmad/_config/manifest\.yaml$'
        '^_bmad/bmm/config\.yaml$'
        '^\.agents/skills/'
        '^package\.json$'
        '^src/'
        '^public/'
        '^scripts/'
        '^data/'
        '^docs/sprint-artifacts/sprint-status\.yaml$'
        '^tests/'
      )
      forbid_patterns=(
        '^\.bmad/'
      )
      guidance=$'MVP stage: final working app; run dev/e2e and demonstrate stable-v6 BMAD workflow usage.'
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
  local stage
  stage=$(canonicalize_branch "$branch")
  set_stage_rules "$stage"
  local tree
  tree=$(list_tree "$branch")

  echo "==> $branch"
  if [[ "$stage" != "$branch" ]]; then
    echo "  NOTE: legacy alias mapped to canonical stage: $stage"
  fi

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

pick_port() {
  python - <<'PY'
import socket
s = socket.socket()
s.bind(('localhost', 0))
print(s.getsockname()[1])
s.close()
PY
}

ensure_clean_tree() {
  if [[ -n "$(git status --porcelain)" ]]; then
    echo "Working tree is not clean; commit or stash before switching branches." >&2
    exit 2
  fi
}

has_root_app() {
  [[ -f package.json ]]
}

has_floorplans_app() {
  [[ -f office-floorplans/package.json ]]
}

has_e2e_script() {
  python - <<'PY'
import json
from pathlib import Path
path = Path('package.json')
if not path.exists():
  raise SystemExit(1)
data = json.loads(path.read_text())
raise SystemExit(0 if 'test:e2e' in data.get('scripts', {}) else 1)
PY
}

wait_for_server() {
  local url="$1"
  local pid="$2"
  for _ in $(seq 1 60); do
    if curl -fsS "$url" >/dev/null 2>&1; then
      return 0
    fi
    if ! kill -0 "$pid" 2>/dev/null; then
      return 1
    fi
    sleep 1
  done
  return 1
}

start_dev_server() {
  local app_dir="$1"
  local port="$2"
  local log="$3"

  if [[ "$app_dir" == "office-floorplans" ]]; then
    pushd "$app_dir" >/dev/null
    npm run dev -- --port "$port" >"$log" 2>&1 &
    local pid=$!
    popd >/dev/null
  else
    npm run dev -- --port "$port" --strictPort >"$log" 2>&1 &
    local pid=$!
  fi

  echo "$pid"
}

run_dev_check() {
  local branch="$1"
  local app_dir="$2"
  local port
  port=$(pick_port)
  local url="http://localhost:$port"
  local log="/tmp/workshop-dev-${branch//\//-}.log"

  local pid
  pid=$(start_dev_server "$app_dir" "$port" "$log")

  if wait_for_server "$url" "$pid"; then
    kill "$pid" 2>/dev/null || true
    wait "$pid" 2>/dev/null || true
    echo "  DEV OK ($url)"
    return 0
  fi

  kill "$pid" 2>/dev/null || true
  wait "$pid" 2>/dev/null || true
  echo "  DEV FAIL (see $log)"
  return 1
}

run_dev_interactive() {
  local app_dir="$1"
  local port
  port=$(pick_port)
  local url="http://localhost:$port"

  echo "Starting dev server in ${app_dir:-.} on $url"
  if [[ "$app_dir" == "office-floorplans" ]]; then
    pushd "$app_dir" >/dev/null
    npm run dev -- --port "$port"
    popd >/dev/null
  else
    npm run dev -- --port "$port" --strictPort
  fi
}

run_e2e() {
  local branch="$1"
  local port
  port=$(pick_port)
  local url="http://localhost:$port"
  local log="/tmp/workshop-e2e-${branch//\//-}.log"

  if ! has_e2e_script; then
    echo "  E2E SKIP (no test:e2e script)"
    return 0
  fi

  npm run dev -- --port "$port" --strictPort >"$log" 2>&1 &
  local pid=$!

  if ! wait_for_server "$url" "$pid"; then
    kill "$pid" 2>/dev/null || true
    wait "$pid" 2>/dev/null || true
    echo "  E2E FAIL (dev server did not start, see $log)"
    return 1
  fi

  BASE_URL="$url" E2E_RUN=1 npm run test:e2e
  local status=$?

  kill "$pid" 2>/dev/null || true
  wait "$pid" 2>/dev/null || true
  return "$status"
}

if [[ ${1:-} == "--help" || ${1:-} == "-h" ]]; then
  usage
  exit 0
fi

while [[ $# -gt 0 ]]; do
  case "$1" in
    --all)
      run_all=true
      shift
      ;;
    --dev)
      mode="dev"
      shift
      ;;
    --e2e)
      mode="e2e"
      shift
      ;;
    *)
      target_branch="$1"
      shift
      ;;
  esac
done

start_branch=$(git rev-parse --abbrev-ref HEAD)
if [[ "$start_branch" == "HEAD" ]]; then
  echo "Detached HEAD is not supported for this script." >&2
  exit 2
fi

if [[ -n "$target_branch" ]]; then
  mapped_target=$(canonicalize_branch "$target_branch")
  if [[ "$mapped_target" != "$target_branch" ]]; then
    echo "Mapped legacy branch '$target_branch' -> '$mapped_target'"
  fi
  target_branch="$mapped_target"
fi

if [[ "$mode" != "check" ]]; then
  if $run_all || [[ -n "$target_branch" && "$target_branch" != "$start_branch" ]]; then
    ensure_clean_tree
  fi
fi

if $run_all; then
  failures=0
  for b in "${branches[@]}"; do
    branch_exists "$b" || {
      echo "Branch not found: $b" >&2
      exit 2
    }
    ensure_local_branch "$b"
    git checkout "$b" >/dev/null

    if [[ "$mode" == "check" ]]; then
      check_branch "$b"
      continue
    fi

    echo "==> $b"

    app_dir=""
    if has_root_app; then
      app_dir="."
    elif has_floorplans_app; then
      app_dir="office-floorplans"
    fi

    if [[ "$mode" == "dev" ]]; then
      if [[ -z "$app_dir" ]]; then
        echo "  DEV SKIP (no app found)"
      elif ! run_dev_check "$b" "$app_dir"; then
        failures=$((failures + 1))
      fi
    elif [[ "$mode" == "e2e" ]]; then
      if [[ -z "$app_dir" || "$app_dir" == "office-floorplans" ]]; then
        echo "  E2E SKIP (no root app)"
      elif ! run_e2e "$b"; then
        failures=$((failures + 1))
      else
        echo "  E2E OK"
      fi
    fi
  done
  git checkout "$start_branch" >/dev/null
  if [[ "$failures" -gt 0 ]]; then
    exit 1
  fi
  exit 0
fi

branch="${target_branch:-$start_branch}"
branch_exists "$branch" || {
  echo "Branch not found: $branch" >&2
  exit 2
}

if [[ "$branch" != "$start_branch" ]]; then
  ensure_local_branch "$branch"
  git checkout "$branch" >/dev/null
fi

if [[ "$mode" == "check" ]]; then
  check_branch "$branch"
  if [[ "$branch" != "$start_branch" ]]; then
    git checkout "$start_branch" >/dev/null
  fi
  exit 0
fi

app_dir=""
if has_root_app; then
  app_dir="."
elif has_floorplans_app; then
  app_dir="office-floorplans"
fi

if [[ "$mode" == "dev" ]]; then
  if [[ -z "$app_dir" ]]; then
    echo "No app found for $branch." >&2
    exit 1
  fi
  run_dev_interactive "$app_dir"
else
  if [[ -z "$app_dir" || "$app_dir" == "office-floorplans" ]]; then
    echo "No root app with e2e tests for $branch." >&2
    exit 1
  fi
  run_e2e "$branch"
fi

if [[ "$branch" != "$start_branch" ]]; then
  git checkout "$start_branch" >/dev/null
fi
