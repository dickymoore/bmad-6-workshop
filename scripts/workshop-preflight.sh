#!/usr/bin/env bash
set -euo pipefail

SCRIPT_NAME=$(basename "$0")
ROOT_DIR=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
STRICT=false

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

errors=0
warnings=0

usage() {
  cat <<USAGE
Usage:
  ./${SCRIPT_NAME} [--strict] [--help]

Checks facilitator machine and repo readiness before workshop delivery.

Options:
  --strict   Exit non-zero if warnings are found.
  --help     Show help.
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
  local missing=()
  local b

  for b in "${WORKSHOP_BRANCHES[@]}"; do
    if git -C "$ROOT_DIR" show-ref --verify --quiet "refs/heads/$b" || git -C "$ROOT_DIR" show-ref --verify --quiet "refs/remotes/origin/$b"; then
      :
    else
      missing+=("$b")
    fi
  done

  if (( ${#missing[@]} == 0 )); then
    pass "all workshop branches are present (local or origin)"
  else
    fail "missing workshop branches: ${missing[*]}"
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
    --help|-h)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 2
      ;;
  esac
done

cd "$ROOT_DIR"

echo "Workshop preflight in: $ROOT_DIR"

echo "--- required tooling ---"
require_command git
require_command node
require_command npm
require_command npx
require_command rg
require_command codex

echo "--- optional tooling ---"
optional_command gh
optional_command jq

echo "--- environment checks ---"
check_node_version
check_git_repo
check_remote
check_workshop_branches
check_network_access

echo "--- workshop payload checks ---"
check_bmad_payload
check_readme_install_hint
check_stage_app_layout

echo "--- summary ---"
printf 'Errors: %d\n' "$errors"
printf 'Warnings: %d\n' "$warnings"

if (( errors > 0 )); then
  exit 1
fi

if [[ "$STRICT" == "true" ]] && (( warnings > 0 )); then
  exit 2
fi

exit 0
