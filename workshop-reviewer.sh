#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)

# shellcheck source=scripts/lib/workshop_tracks.sh
source "$SCRIPT_DIR/scripts/lib/workshop_tracks.sh"

usage() {
  cat <<'USAGE'
Usage:
  ./workshop-reviewer.sh                             # check current branch (HEAD)
  ./workshop-reviewer.sh <branch>                    # check a specific branch
  ./workshop-reviewer.sh --all                       # check all workshop branches for the selected track
  ./workshop-reviewer.sh --dev [branch]              # start the correct dev server
  ./workshop-reviewer.sh --dev --all                 # smoke-check dev server on all branches
  ./workshop-reviewer.sh --e2e [branch]              # run Playwright e2e (app stages only)
  ./workshop-reviewer.sh --e2e --all                 # run Playwright e2e on app branches
  ./workshop-reviewer.sh --track <id> [options]
  ./workshop-reviewer.sh --help

This script validates that each workshop stage branch is in the expected
"pre-artifact" state and prints a short facilitation guide for that stage.

Notes:
- Checks are based on the committed tree of the branch, not your working tree.
- --all uses the namespaced canonical branches for the selected track.
- Positional branch accepts canonical names and compatibility aliases.
- --dev/--e2e may switch branches; keep your working tree clean.
USAGE
}

TRACK=$(workshop_default_track)
branches=()
mode="check"
run_all=false
target_branch=""

require_patterns=()
forbid_patterns=()
guidance=""

canonicalize_branch() {
  local branch="$1"
  workshop_resolve_branch "$TRACK" "$branch"
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

load_track_branches() {
  mapfile -t branches < <(workshop_list_branches "$TRACK" 1)
}

set_stage_rules() {
  local stage="$1"
  mapfile -t require_patterns < <(workshop_branch_field "$TRACK" "$stage" required_patterns)
  mapfile -t forbid_patterns < <(workshop_branch_field "$TRACK" "$stage" forbidden_patterns)
  guidance=$(workshop_branch_field "$TRACK" "$stage" guidance)
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
    echo "  NOTE: alias mapped to canonical stage: $stage"
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

cleanup_e2e_artifacts() {
  local tracked_paths=(
    test-results/html-report/index.html
    test-results/html/index.html
    test-results/junit.xml
  )
  local tracked_path

  for tracked_path in "${tracked_paths[@]}"; do
    if git ls-files --error-unmatch "$tracked_path" >/dev/null 2>&1; then
      git restore --worktree --source=HEAD -- "$tracked_path" >/dev/null 2>&1 || true
    fi
  done

  rm -rf test-results/artifacts playwright-report blob-report 2>/dev/null || true
}

cleanup_runtime_artifacts() {
  rm -rf .vite 2>/dev/null || true
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

  cleanup_runtime_artifacts
  local pid
  pid=$(start_dev_server "$app_dir" "$port" "$log")

  if wait_for_server "$url" "$pid"; then
    kill "$pid" 2>/dev/null || true
    wait "$pid" 2>/dev/null || true
    cleanup_runtime_artifacts
    echo "  DEV OK ($url)"
    return 0
  fi

  kill "$pid" 2>/dev/null || true
  wait "$pid" 2>/dev/null || true
  cleanup_runtime_artifacts
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
  local status=0

  if ! has_e2e_script; then
    echo "  E2E SKIP (no test:e2e script)"
    return 0
  fi

  cleanup_e2e_artifacts
  cleanup_runtime_artifacts
  npm run dev -- --port "$port" --strictPort >"$log" 2>&1 &
  local pid=$!

  if ! wait_for_server "$url" "$pid"; then
    kill "$pid" 2>/dev/null || true
    wait "$pid" 2>/dev/null || true
    cleanup_e2e_artifacts
    cleanup_runtime_artifacts
    echo "  E2E FAIL (dev server did not start, see $log)"
    return 1
  fi

  if BASE_URL="$url" E2E_RUN=1 npm run test:e2e; then
    status=0
  else
    status=$?
  fi

  kill "$pid" 2>/dev/null || true
  wait "$pid" 2>/dev/null || true
  cleanup_e2e_artifacts
  cleanup_runtime_artifacts
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
    --track)
      [[ $# -ge 2 ]] || { echo "Missing value for --track" >&2; exit 2; }
      TRACK="$2"
      shift 2
      ;;
    *)
      target_branch="$1"
      shift
      ;;
  esac
done

load_track_branches

start_branch=$(git rev-parse --abbrev-ref HEAD)
if [[ "$start_branch" == "HEAD" ]]; then
  echo "Detached HEAD is not supported for this script." >&2
  exit 2
fi

if [[ -n "$target_branch" ]]; then
  mapped_target=$(canonicalize_branch "$target_branch")
  if [[ "$mapped_target" != "$target_branch" ]]; then
    echo "Mapped branch '$target_branch' -> '$mapped_target'"
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

    if [[ "$mode" == "check" ]]; then
      check_branch "$b"
      continue
    fi

    ensure_local_branch "$b"
    git checkout "$b" >/dev/null

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

if [[ "$mode" != "check" && "$branch" != "$start_branch" ]]; then
  ensure_local_branch "$branch"
  git checkout "$branch" >/dev/null
fi

if [[ "$mode" == "check" ]]; then
  check_branch "$branch"
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
