#!/usr/bin/env bash
set -euo pipefail

SCRIPT_NAME=$(basename "$0")
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
ROOT_DIR=$(git rev-parse --show-toplevel 2>/dev/null || pwd)

# shellcheck source=scripts/lib/workshop_tracks.sh
source "$SCRIPT_DIR/lib/workshop_tracks.sh"

STRICT=false
TRACK=$(workshop_default_track)
errors=0
warnings=0

usage() {
  cat <<USAGE
Usage:
  ./${SCRIPT_NAME} [--strict] [--track <id>] [--help]

Checks facilitator machine and repo readiness before workshop delivery.

Options:
  --strict      Exit non-zero if warnings are found.
  --track <id>  Workshop track id (default: value from workshops/index.json).
  --help        Show help.
USAGE
}

pass() {
  printf 'PASS  %s\n' "$*"
}

warn() {
  warnings=$((warnings + 1))
  printf 'WARN  %s\n' "$*"
}

fail() {
  errors=$((errors + 1))
  printf 'FAIL  %s\n' "$*"
}

require_command() {
  local cmd="$1"
  if command -v "$cmd" >/dev/null 2>&1; then
    pass "command available: $cmd"
  else
    fail "missing command: $cmd"
  fi
}

optional_command() {
  local cmd="$1"
  if command -v "$cmd" >/dev/null 2>&1; then
    pass "optional command available: $cmd"
  else
    warn "optional command missing: $cmd"
  fi
}

check_node_version() {
  if ! command -v node >/dev/null 2>&1; then
    fail "node not installed"
    return
  fi

  local major
  major=$(node -p "process.versions.node.split('.')[0]" 2>/dev/null || echo "0")
  if [[ "$major" =~ ^[0-9]+$ ]] && (( major >= 20 )); then
    pass "node version is supported (>=20)"
  else
    fail "node version must be >=20 for current BMAD CLI"
  fi
}

check_git_repo() {
  if git -C "$ROOT_DIR" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    pass "inside git repository: $ROOT_DIR"
  else
    fail "not inside a git repository"
    return
  fi

  local current_branch
  current_branch=$(git -C "$ROOT_DIR" rev-parse --abbrev-ref HEAD)
  pass "current branch: $current_branch"

  if [[ -n "$(git -C "$ROOT_DIR" status --porcelain)" ]]; then
    warn "working tree is not clean (stash or commit before live branch switching)"
  else
    pass "working tree is clean"
  fi
}

check_workshop_branches() {
  local canonical_branches=()
  local compatibility_branches=()
  local missing=()
  local missing_compat=()
  local branch

  mapfile -t canonical_branches < <(workshop_list_branches "$TRACK" 1)

  for branch in "${canonical_branches[@]}"; do
    if git -C "$ROOT_DIR" show-ref --verify --quiet "refs/heads/$branch" || git -C "$ROOT_DIR" show-ref --verify --quiet "refs/remotes/origin/$branch"; then
      :
    else
      missing+=("$branch")
    fi
  done

  if (( ${#missing[@]} == 0 )); then
    pass "all canonical workshop branches are present for track '$TRACK' (local or origin)"
  else
    fail "missing canonical workshop branches for track '$TRACK': ${missing[*]}"
  fi

  for branch in "${canonical_branches[@]}"; do
    [[ "$branch" == "main" ]] && continue
    while IFS= read -r candidate; do
      [[ "$candidate" == "$branch" ]] && continue
      compatibility_branches+=("$candidate")
    done < <(workshop_branch_candidates "$TRACK" "$branch")
  done

  if (( ${#compatibility_branches[@]} > 0 )); then
    mapfile -t compatibility_branches < <(printf '%s\n' "${compatibility_branches[@]}" | awk '!seen[$0]++')
  fi

  for branch in "${compatibility_branches[@]}"; do
    if git -C "$ROOT_DIR" show-ref --verify --quiet "refs/heads/$branch" || git -C "$ROOT_DIR" show-ref --verify --quiet "refs/remotes/origin/$branch"; then
      :
    else
      missing_compat+=("$branch")
    fi
  done

  if (( ${#missing_compat[@]} == 0 )); then
    pass "compatibility branch names are present for track '$TRACK'"
  else
    warn "missing compatibility branch names for track '$TRACK': ${missing_compat[*]}"
  fi
}

check_remote() {
  if git -C "$ROOT_DIR" remote get-url origin >/dev/null 2>&1; then
    pass "origin remote is configured"
  else
    fail "origin remote is not configured"
  fi
}

check_bmad_payload() {
  if [[ -d "$ROOT_DIR/_bmad" && -d "$ROOT_DIR/.agents/skills" ]]; then
    pass "stable BMAD payload detected (_bmad + .agents/skills)"

    local manifest="$ROOT_DIR/_bmad/_config/manifest.yaml"
    if [[ -f "$manifest" ]]; then
      local version
      version=$(awk -F': *' '/^version:/{print $2; exit}' "$manifest" | tr -d '"')
      if [[ "$version" =~ ^6\. ]] && [[ ! "$version" =~ [Aa]lpha|[Bb]eta ]]; then
        pass "manifest version is stable v6 ($version)"
      else
        warn "manifest version is not stable-v6: ${version:-unknown}"
      fi
    else
      warn "manifest not found at _bmad/_config/manifest.yaml"
    fi
  else
    warn "stable BMAD payload not detected. Run: npx bmad-method@latest install --modules bmm --tools codex --yes"
  fi
}

check_readme_install_hint() {
  local readme="$ROOT_DIR/README.md"
  if [[ ! -f "$readme" ]]; then
    warn "README.md not found"
    return
  fi

  if rg -n "bmad-method@alpha" "$readme" >/dev/null 2>&1; then
    warn "README still references @alpha install command"
  else
    pass "README install command does not reference @alpha"
  fi
}

check_network_access() {
  if npm view bmad-method version --silent >/dev/null 2>&1; then
    pass "npm registry reachable for bmad-method"
  else
    warn "unable to query npm registry (network/proxy issue)"
  fi
}

check_stage_app_layout() {
  if [[ -f "$ROOT_DIR/package.json" ]]; then
    pass "root app package.json present"
  else
    warn "root app package.json missing on this branch (expected for early stages)"
  fi

  if [[ -f "$ROOT_DIR/office-floorplans/package.json" ]]; then
    pass "office-floorplans app package.json present"
  else
    warn "office-floorplans package.json missing"
  fi
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --strict)
      STRICT=true
      shift
      ;;
    --track)
      [[ $# -ge 2 ]] || { echo "Missing value for --track" >&2; exit 2; }
      TRACK="$2"
      shift 2
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 2
      ;;
  esac
done

require_command git
require_command node
require_command npm
optional_command npx
optional_command codex
optional_command code
optional_command rg

check_node_version
check_git_repo
check_workshop_branches
check_remote
check_bmad_payload
check_readme_install_hint
check_network_access
check_stage_app_layout

printf '\n'
if (( errors > 0 )); then
  echo "Preflight failed with errors=$errors warnings=$warnings"
  exit 1
fi

if $STRICT && (( warnings > 0 )); then
  echo "Preflight warnings encountered under --strict (warnings=$warnings)"
  exit 1
fi

echo "Preflight passed with warnings=$warnings"
