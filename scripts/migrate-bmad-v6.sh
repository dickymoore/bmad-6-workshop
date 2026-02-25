#!/usr/bin/env bash
set -euo pipefail

SCRIPT_NAME=$(basename "$0")
ROOT_DIR=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)

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
  ${SCRIPT_NAME} --apply [--all | --branch <name> ...] [options]
  ${SCRIPT_NAME} --help

Migrate workshop branches from BMAD alpha conventions to stable v6 conventions.

Required:
  --apply                Execute changes. Without this flag, script runs as dry-run.

Scope:
  --all                  Migrate all workshop branches.
  --branch <name>        Migrate specific branch (repeatable).

Options:
  --repo <path>          Target repo (default: current git root).
  --npm-tag <tag>        bmad-method npm tag (default: latest).
  --user-name <name>     BMAD installer user name (default: git user.name or Workshop).
  --log-file <path>      Execution log file path relative to repo root (default: migration-execution-log.md).
  --commit               Commit changes on each branch.
  --commit-message <msg> Commit message (default: "Migrate BMAD workshop branch to stable v6").
  --help                 Show help.

Notes:
- Script enforces clean working tree before branch switching.
- Stable BMAD install is skipped on main branch by design.
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

require_clean_tree() {
  local repo="$1"
  if [[ -n "$(git -C "$repo" status --porcelain)" ]]; then
    fail "Working tree is not clean in $repo"
  fi
}

branch_exists() {
  local repo="$1"
  local branch="$2"
  git -C "$repo" show-ref --verify --quiet "refs/heads/$branch" || \
    git -C "$repo" show-ref --verify --quiet "refs/remotes/origin/$branch"
}

checkout_branch() {
  local repo="$1"
  local branch="$2"
  git -C "$repo" checkout "$branch" >/dev/null
}

ensure_local_branch() {
  local repo="$1"
  local branch="$2"
  if git -C "$repo" show-ref --verify --quiet "refs/heads/$branch"; then
    return 0
  fi
  git -C "$repo" checkout -b "$branch" "origin/$branch" >/dev/null
}

append_log() {
  local repo="$1"
  local logfile="$2"
  local message="$3"
  printf '%s %s\n' "$(date +'%Y-%m-%d %H:%M:%S')" "$message" >> "$repo/$logfile"
}

prepare_payload() {
  local repo="$1"
  local payload_dir="$2"

  mkdir -p "$payload_dir/scripts"
  cp "$SCRIPT_DIR/audit-bmad-v6.sh" "$payload_dir/scripts/"
  cp "$SCRIPT_DIR/migrate-bmad-v6.sh" "$payload_dir/scripts/"
  cp "$SCRIPT_DIR/verify-bmad-v6.sh" "$payload_dir/scripts/"

  if [[ -f "$repo/workshop-reviewer.sh" ]]; then
    cp "$repo/workshop-reviewer.sh" "$payload_dir/workshop-reviewer.sh"
  fi
}

sync_shared_assets() {
  local repo="$1"
  local payload_dir="$2"

  mkdir -p "$repo/scripts"
  cp "$payload_dir/scripts/"*.sh "$repo/scripts/"
  chmod +x "$repo/scripts/"*.sh

  if [[ -f "$payload_dir/workshop-reviewer.sh" ]]; then
    cp "$payload_dir/workshop-reviewer.sh" "$repo/workshop-reviewer.sh"
  fi
}

replace_shared_markers() {
  local repo="$1"
  local branch="$2"
  local readme="$repo/README.md"
  [[ -f "$readme" ]] || return 0

  sed -i 's|npx bmad-method@alpha install|npx bmad-method@latest install|g' "$readme"
  sed -i 's|/prompts:bmad-bmm-agents-analyst|/bmad-agent-bmm-analyst|g' "$readme"
  sed -i 's|/prompts:bmad-bmm-agents-architect|/bmad-agent-bmm-architect|g' "$readme"
  sed -i 's|/prompts:bmad-bmm-agents-pm|/bmad-agent-bmm-pm|g' "$readme"
  sed -i 's|/prompts:bmad-bmm-agents-sm|/bmad-agent-bmm-sm|g' "$readme"
  sed -i 's|/prompts:bmad-bmm-agents-dev|/bmad-agent-bmm-dev|g' "$readme"
  sed -i 's|/prompts:bmad-bmm-agents-tea|/bmad-agent-bmm-qa|g' "$readme"
  sed -i 's|\\*workflow-init|/bmad-bmm-create-product-brief|g' "$readme"
  sed -i 's|\\*workflow-status|/bmad-bmm-sprint-status|g' "$readme"
}

install_stable_bmad() {
  local repo="$1"
  local npm_tag="$2"
  local user_name="$3"

  rm -rf "$repo/.bmad" "$repo/_bmad" "$repo/.agents"

  (
    cd "$repo"
    npx "bmad-method@${npm_tag}" install \
      --directory "$repo" \
      --action install \
      --yes \
      --modules bmm \
      --tools codex \
      --user-name "$user_name" \
      --output-folder _bmad-output
  )
}

configure_bmm_paths_for_workshop() {
  local repo="$1"
  local config="$repo/_bmad/bmm/config.yaml"
  [[ -f "$config" ]] || return 0

  sed -i 's|^planning_artifacts:.*|planning_artifacts: "{project-root}/docs"|' "$config"
  sed -i 's|^implementation_artifacts:.*|implementation_artifacts: "{project-root}/docs/sprint-artifacts"|' "$config"
  sed -i 's|^project_knowledge:.*|project_knowledge: "{project-root}/docs"|' "$config"
}

prepare_stage_directories() {
  local repo="$1"
  mkdir -p "$repo/docs"

  if [[ ! -e "$repo/docs/sprint-artifacts" ]]; then
    mkdir -p "$repo/docs/sprint-artifacts"
  fi
}

cleanup_legacy_files() {
  local repo="$1"
  rm -f "$repo/docs/bmm-workflow-status.yaml"
}

commit_if_requested() {
  local repo="$1"
  local branch="$2"
  local do_commit="$3"
  local commit_message="$4"

  if [[ "$do_commit" != "true" ]]; then
    return 0
  fi

  if [[ -z "$(git -C "$repo" status --porcelain)" ]]; then
    log "branch=$branch no changes to commit"
    return 0
  fi

  git -C "$repo" add -A
  git -C "$repo" commit -m "$commit_message"
  log "branch=$branch committed"
}

REPO="$ROOT_DIR"
NPM_TAG="latest"
USER_NAME="$(git config user.name 2>/dev/null || echo Workshop)"
LOG_FILE="migration-execution-log.md"
DO_COMMIT=false
COMMIT_MESSAGE="Migrate BMAD workshop branch to stable v6"
APPLY=false
MIGRATE_ALL=false
TARGET_BRANCHES=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --apply)
      APPLY=true
      shift
      ;;
    --all)
      MIGRATE_ALL=true
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
    --npm-tag)
      [[ $# -ge 2 ]] || fail "Missing value for --npm-tag"
      NPM_TAG="$2"
      shift 2
      ;;
    --user-name)
      [[ $# -ge 2 ]] || fail "Missing value for --user-name"
      USER_NAME="$2"
      shift 2
      ;;
    --log-file)
      [[ $# -ge 2 ]] || fail "Missing value for --log-file"
      LOG_FILE="$2"
      shift 2
      ;;
    --commit)
      DO_COMMIT=true
      shift
      ;;
    --commit-message)
      [[ $# -ge 2 ]] || fail "Missing value for --commit-message"
      COMMIT_MESSAGE="$2"
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

if $MIGRATE_ALL; then
  TARGET_BRANCHES=("${WORKSHOP_BRANCHES[@]}")
elif [[ ${#TARGET_BRANCHES[@]} -eq 0 ]]; then
  TARGET_BRANCHES=("$(git -C "$REPO" rev-parse --abbrev-ref HEAD)")
fi

if [[ "$APPLY" != "true" ]]; then
  log "Dry-run mode. Use --apply to execute."
  for branch in "${TARGET_BRANCHES[@]}"; do
    log "Would migrate branch=$branch"
  done
  exit 0
fi

require_clean_tree "$REPO"

START_BRANCH=$(git -C "$REPO" rev-parse --abbrev-ref HEAD)
PAYLOAD_DIR=$(mktemp -d)
trap 'git -C "$REPO" checkout "$START_BRANCH" >/dev/null 2>&1 || true; rm -rf "$PAYLOAD_DIR"' EXIT

prepare_payload "$REPO" "$PAYLOAD_DIR"

for branch in "${TARGET_BRANCHES[@]}"; do
  branch_exists "$REPO" "$branch" || fail "Branch not found: $branch"
  ensure_local_branch "$REPO" "$branch"
  checkout_branch "$REPO" "$branch"

  log "Migrating branch=$branch"
  append_log "$REPO" "$LOG_FILE" "START branch=$branch"

  sync_shared_assets "$REPO" "$PAYLOAD_DIR"
  replace_shared_markers "$REPO" "$branch"

  if [[ "$branch" != "main" ]]; then
    install_stable_bmad "$REPO" "$NPM_TAG" "$USER_NAME"
    configure_bmm_paths_for_workshop "$REPO"
    prepare_stage_directories "$REPO"
  fi

  cleanup_legacy_files "$REPO"

  append_log "$REPO" "$LOG_FILE" "DONE branch=$branch"
  commit_if_requested "$REPO" "$branch" "$DO_COMMIT" "$COMMIT_MESSAGE"
done

log "Migration script completed"
