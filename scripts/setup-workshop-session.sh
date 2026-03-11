#!/usr/bin/env bash
set -euo pipefail

SCRIPT_NAME=$(basename "$0")
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
DEFAULT_SOURCE_REPO=$(git -C "$SCRIPT_DIR/.." rev-parse --show-toplevel 2>/dev/null || pwd)
DEFAULT_SESSIONS_ROOT="$DEFAULT_SOURCE_REPO/workshop-sessions"

# shellcheck source=scripts/lib/workshop_tracks.sh
source "$SCRIPT_DIR/lib/workshop_tracks.sh"

MODE="all"
SESSION=""
SESSIONS_ROOT=""
SOURCE_REPO=""
TRACK=$(workshop_default_track)
INCLUDE_MAIN=1
OPEN_CODE=1
RESET=0
USE_VIRTUAL_DESKTOPS=0
MAX_BRANCHES=0
BMAD_NPM_TAG="${BMAD_NPM_TAG:-latest}"

log() {
  printf '[%s] %s\n' "$(date +'%Y-%m-%d %H:%M:%S')" "$*"
}

fail() {
  echo "ERROR: $*" >&2
  exit 2
}

usage() {
  cat <<USAGE
Usage:
  ./${SCRIPT_NAME} --mode <prepare|launch|all|teardown> --session <name> [options]

Automate one workshop session by creating branch-specific worktrees and
opening VS Code windows.

Required:
  --session <name>          Session name (examples: Wed-AM, Wed-PM).

Options:
  --mode <value>            Mode to run (default: all).
  --sessions-root <path>    Parent folder for session folders.
                            Default: ${DEFAULT_SESSIONS_ROOT}
  --source-repo <path>      Source repo used to discover origin URL.
                            Default: current repo root.
  --track <id>              Workshop track id (default: value from workshops/index.json).
  --max-branches <n>        Limit session to first n mapped branches.
  --exclude-main            Skip main branch worktree.
  --no-code                 Do not open VS Code windows in launch/all.
  --reset                   Remove existing session folder before prepare/all.
  --use-virtual-desktops    No-op in bash script (PowerShell-only feature).
  -h, --help                Show help.

Modes:
  prepare   Create/update a single session folder and branch worktrees.
  launch    Open VS Code windows for existing session worktrees.
  all       Run prepare then launch.
  teardown  Remove the entire session folder.
USAGE
}

safe_rm_rf() {
  local path="$1"
  [[ -n "$path" && "$path" != "/" ]] || fail "Refusing to delete unsafe path: '$path'"
  rm -rf "$path"
}

copy_file_if_exists() {
  local src="$1"
  local dst="$2"
  if [[ -f "$src" ]]; then
    cp "$src" "$dst"
    return 0
  fi
  return 1
}

copy_dir_if_exists() {
  local src="$1"
  local dst="$2"
  if [[ -d "$src" ]]; then
    mkdir -p "$dst"
    cp -R "$src/." "$dst/"
    return 0
  fi
  return 1
}

toml_escape_string() {
  local value="$1"
  value=${value//\\/\\\\}
  value=${value//\"/\\\"}
  printf '%s\n' "$value"
}

ensure_vscode_codex_env() {
  local branch_path="$1"
  local vscode_dir="$branch_path/.vscode"
  local settings_path="$vscode_dir/settings.json"
  local tasks_path="$vscode_dir/tasks.json"

  mkdir -p "$vscode_dir"

  cat > "$settings_path" <<'JSON'
{
  "terminal.integrated.env.linux": {
    "CODEX_HOME": "${workspaceFolder}/.codex"
  },
  "terminal.integrated.env.windows": {
    "CODEX_HOME": "${workspaceFolder}\\.codex"
  },
  "task.allowAutomaticTasks": "on",
  "terminal.integrated.hideOnStartup": "never",
  "workbench.panel.defaultLocation": "right"
}
JSON

  cat > "$tasks_path" <<'JSON'
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Workshop: Start Codex",
      "type": "shell",
      "command": "codex --yolo",
      "windows": {
        "command": "wsl.exe bash -lc 'cd \"$(wslpath -a \"${workspaceFolder}\")\" && CODEX_HOME=\"$PWD/.codex\" codex --yolo'"
      },
      "options": {
        "cwd": "${workspaceFolder}",
        "env": {
          "CODEX_HOME": "${workspaceFolder}/.codex"
        }
      },
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "focus": true,
        "panel": "dedicated",
        "clear": false,
        "showReuseMessage": false
      },
      "runOptions": {
        "runOn": "folderOpen",
        "instanceLimit": 1
      }
    }
  ]
}
JSON
}

ensure_worktree_excludes() {
  local branch_path="$1"
  local exclude_file
  exclude_file=$(git -C "$branch_path" rev-parse --git-path info/exclude 2>/dev/null || true)
  [[ -n "$exclude_file" ]] || return 0

  mkdir -p "$(dirname "$exclude_file")"
  touch "$exclude_file"

  if ! grep -Fxq '.codex/' "$exclude_file"; then
    echo '.codex/' >> "$exclude_file"
  fi
  if ! grep -Fxq '.vscode/settings.json' "$exclude_file"; then
    echo '.vscode/settings.json' >> "$exclude_file"
  fi
  if ! grep -Fxq '.vscode/tasks.json' "$exclude_file"; then
    echo '.vscode/tasks.json' >> "$exclude_file"
  fi
  if ! grep -Fxq '.agents/' "$exclude_file"; then
    echo '.agents/' >> "$exclude_file"
  fi
  if ! grep -Fxq '_bmad/' "$exclude_file"; then
    echo '_bmad/' >> "$exclude_file"
  fi
  if ! grep -Fxq '_bmad-output/' "$exclude_file"; then
    echo '_bmad-output/' >> "$exclude_file"
  fi
}

set_codex_secret_permissions() {
  local codex_dir="$1"
  local file
  for file in "$codex_dir/auth.json" "$codex_dir/config.toml"; do
    [[ -f "$file" ]] || continue
    chmod 600 "$file" 2>/dev/null || true
  done
}

ensure_codex_trust_entry() {
  local codex_dir="$1"
  local project_path="$2"
  local config_path="$codex_dir/config.toml"
  local escaped_path

  [[ -n "$project_path" ]] || return 0
  mkdir -p "$codex_dir"
  touch "$config_path"

  escaped_path=$(toml_escape_string "$project_path")

  if grep -Fq "[projects.\"$escaped_path\"]" "$config_path"; then
    if awk -v section="[projects.\"$escaped_path\"]" '
      $0 == section { in_section=1; next }
      /^\[/ && in_section { exit !found }
      in_section && $0 ~ /^trust_level *= *"trusted"$/ { found=1 }
      END { if (in_section && found) exit 0; if (in_section) exit 1; exit 1 }
    ' "$config_path"; then
      return 0
    fi
  fi

  printf '\n[projects."%s"]\ntrust_level = "trusted"\n' "$escaped_path" >> "$config_path"
}

sync_system_skills() {
  local codex_skills_dir="$1"
  local source_codex="$SOURCE_REPO/.codex"
  local home_codex="$HOME/.codex"
  local system_src=""

  if [[ -d "$source_codex/skills/.system" ]]; then
    system_src="$source_codex/skills/.system"
  elif [[ -d "$home_codex/skills/.system" ]]; then
    system_src="$home_codex/skills/.system"
  fi

  [[ -n "$system_src" ]] || return 0

  rm -rf "$codex_skills_dir/.system"
  mkdir -p "$codex_skills_dir/.system"
  cp -R "$system_src/." "$codex_skills_dir/.system/"
}

bmad_bundle_dir() {
  printf '%s\n' "$(session_dir)/.bmad-codex-bundle"
}

resolve_bmad_user_name() {
  local user_name
  user_name=${USER:-}
  if [[ -n "$user_name" ]]; then
    printf '%s\n' "$user_name" | tr -s '[:space:]' '-'
    return 0
  fi
  user_name=$(whoami 2>/dev/null || true)
  if [[ -n "$user_name" ]]; then
    printf '%s\n' "$user_name" | tr -s '[:space:]' '-'
    return 0
  fi
  echo "codexuser"
}

ensure_bmad_bundle() {
  local bundle_dir
  bundle_dir=$(bmad_bundle_dir)

  if [[ -d "$bundle_dir/_bmad" && -d "$bundle_dir/.agents/skills" ]]; then
    return 0
  fi

  rm -rf "$bundle_dir"
  mkdir -p "$bundle_dir"

  if [[ -d "$SOURCE_REPO/_bmad" && -d "$SOURCE_REPO/.agents/skills" ]]; then
    log "copying BMAD Codex payload from source repo into session bundle cache"
    copy_dir_if_exists "$SOURCE_REPO/_bmad" "$bundle_dir/_bmad"
    copy_dir_if_exists "$SOURCE_REPO/.agents" "$bundle_dir/.agents"
    copy_dir_if_exists "$SOURCE_REPO/_bmad-output" "$bundle_dir/_bmad-output" || true
  else
    command -v npx >/dev/null 2>&1 || fail "npx is required to provision BMAD Codex skills"
    local user_name
    user_name=$(resolve_bmad_user_name)
    log "installing BMAD stable v6 bundle into session cache via npx bmad-method@${BMAD_NPM_TAG}"
    (
      cd "$bundle_dir"
      npx "bmad-method@${BMAD_NPM_TAG}" install \
        --directory "$bundle_dir" \
        --action install \
        --yes \
        --modules bmm \
        --tools codex \
        --user-name "$user_name" \
        --output-folder _bmad-output >/dev/null </dev/null
    )
  fi

  [[ -d "$bundle_dir/_bmad" && -d "$bundle_dir/.agents/skills" ]] || \
    fail "BMAD session bundle is incomplete: expected _bmad and .agents/skills in $bundle_dir"
}

provision_bmad_payload() {
  local branch_path="$1"
  if [[ -d "$branch_path/_bmad" && -d "$branch_path/.agents/skills" ]]; then
    return 0
  fi

  ensure_bmad_bundle

  local bundle_dir
  bundle_dir=$(bmad_bundle_dir)

  if [[ ! -d "$branch_path/_bmad" ]]; then
    copy_dir_if_exists "$bundle_dir/_bmad" "$branch_path/_bmad" || \
      fail "Unable to copy _bmad payload into $branch_path"
  fi
  if [[ ! -d "$branch_path/.agents/skills" ]]; then
    mkdir -p "$branch_path/.agents"
    copy_dir_if_exists "$bundle_dir/.agents" "$branch_path/.agents" || \
      fail "Unable to copy .agents payload into $branch_path"
  fi
  if [[ ! -d "$branch_path/_bmad-output" && -d "$bundle_dir/_bmad-output" ]]; then
    copy_dir_if_exists "$bundle_dir/_bmad-output" "$branch_path/_bmad-output" || true
  fi
}

sync_bmad_skills() {
  local branch_path="$1"
  local codex_skills_dir="$branch_path/.codex/skills"
  local agents_skills_dir="$branch_path/.agents/skills"

  mkdir -p "$codex_skills_dir"

  # Keep .system intact; rebuild BMAD skills to match current branch exactly.
  find "$codex_skills_dir" -mindepth 1 -maxdepth 1 ! -name '.system' -exec rm -rf {} + 2>/dev/null || true

  if [[ ! -d "$agents_skills_dir" ]]; then
    log "no .agents/skills found in $branch_path; BMAD skills unavailable for this branch"
    return 0
  fi

  while IFS= read -r -d '' skill_dir; do
    local skill_name
    skill_name=$(basename "$skill_dir")
    cp -R "$skill_dir" "$codex_skills_dir/$skill_name"
  done < <(find "$agents_skills_dir" -mindepth 1 -maxdepth 1 -type d -print0)
}

apply_bmad_codex_compat() {
  local branch_path="$1"
  local help_task="$branch_path/_bmad/core/tasks/help.md"
  local help_skill="$branch_path/.codex/skills/bmad-help/SKILL.md"

  if [[ -f "$help_task" ]] && ! grep -q '## CODEX COMPATIBILITY OVERRIDE' "$help_task"; then
    local tmp_file
    tmp_file=$(mktemp)
    awk '
      { print }
      !inserted && /^# Task: BMAD Help$/ {
        print ""
        print "## CODEX COMPATIBILITY OVERRIDE"
        print "- This section overrides conflicting display rules below."
        print "- BMAD workflows in Codex are invoked as skills, not legacy `/bmad-*` slash commands."
        print "- When showing a workflow command from the catalog, output `$<command>` (example: `$bmad-bmm-create-prd`)."
        print "- For help itself, always show `$bmad-help` (never `/bmad-help`)."
        print "- For agent workflows, direct users to `/skills` and pick the relevant agent skill."
        print "- If legacy slash syntax appears in source docs, label it as legacy and include the `$...` equivalent."
        inserted = 1
      }
    ' "$help_task" > "$tmp_file"
    mv "$tmp_file" "$help_task"
  fi

  if [[ -f "$help_skill" ]] && ! grep -q '## CODEX COMPATIBILITY OVERRIDE' "$help_skill"; then
    cat >> "$help_skill" <<'EOF'

## CODEX COMPATIBILITY OVERRIDE

- BMAD entries that look like `/bmad-*` are legacy slash syntax.
- In Codex, invoke BMAD workflows as skills with `$bmad-*`.
- Apply this mapping when presenting next-step recommendations.
EOF
  fi
}

bootstrap_codex_workspace() {
  local branch_path="$1"
  local codex_dir="$branch_path/.codex"
  local source_codex="$SOURCE_REPO/.codex"
  local home_codex="$HOME/.codex"
  local copied_auth=0

  mkdir -p "$codex_dir/skills"

  if copy_file_if_exists "$source_codex/auth.json" "$codex_dir/auth.json"; then
    copied_auth=1
  elif copy_file_if_exists "$home_codex/auth.json" "$codex_dir/auth.json"; then
    copied_auth=1
  fi

  if ! copy_file_if_exists "$source_codex/config.toml" "$codex_dir/config.toml"; then
    copy_file_if_exists "$home_codex/config.toml" "$codex_dir/config.toml" || true
  fi

  sync_system_skills "$codex_dir/skills"
  provision_bmad_payload "$branch_path"
  sync_bmad_skills "$branch_path"
  apply_bmad_codex_compat "$branch_path"
  ensure_vscode_codex_env "$branch_path"
  ensure_codex_trust_entry "$codex_dir" "$branch_path"
  ensure_worktree_excludes "$branch_path"
  set_codex_secret_permissions "$codex_dir"

  if [[ "$copied_auth" -eq 1 ]]; then
    log "bootstrapped Codex workspace in $branch_path/.codex"
  else
    log "bootstrapped Codex workspace in $branch_path/.codex (no auth.json source found)"
  fi
}

folder_name_for_branch() {
  local branch="$1"
  workshop_branch_field "$TRACK" "$branch" folder
}

selected_branches() {
  local branch
  local count=0
  while IFS= read -r branch; do
    if [[ "$branch" == "main" && "$INCLUDE_MAIN" -eq 0 ]]; then
      continue
    fi
    if [[ "$MAX_BRANCHES" -gt 0 && "$count" -ge "$MAX_BRANCHES" ]]; then
      break
    fi
    printf '%s\n' "$branch"
    count=$((count + 1))
  done < <(workshop_list_branches "$TRACK" 1)
}

session_dir() {
  printf '%s\n' "$SESSIONS_ROOT/$SESSION"
}

mirror_dir() {
  printf '%s\n' "$(session_dir)/.mirror.git"
}

manifest_path() {
  printf '%s\n' "$(session_dir)/.session-manifest.tsv"
}

write_manifest() {
  local manifest
  manifest=$(manifest_path)
  mkdir -p "$(session_dir)"
  {
    printf 'branch\tfolder\tpath\n'
    while IFS= read -r branch; do
      local folder
      folder=$(folder_name_for_branch "$branch")
      printf '%s\t%s\t%s\n' "$branch" "$folder" "$(session_dir)/$folder"
    done < <(selected_branches)
  } > "$manifest"
}

sync_source_repo() {
  if git -C "$SOURCE_REPO" remote get-url origin >/dev/null 2>&1; then
    log "fetching latest refs into source repo from origin"
    git -C "$SOURCE_REPO" fetch origin --prune >/dev/null
  else
    log "source repo has no origin remote; using local refs only"
  fi
}

resolve_mirror_ref() {
  local mirror="$1"
  local branch="$2"

  while IFS= read -r candidate; do
    if git --git-dir="$mirror" show-ref --verify --quiet "refs/remotes/origin/$candidate"; then
      printf '%s\n' "refs/remotes/origin/$candidate"
      return 0
    fi
    if git --git-dir="$mirror" show-ref --verify --quiet "refs/heads/$candidate"; then
      printf '%s\n' "refs/heads/$candidate"
      return 0
    fi
  done < <(workshop_branch_candidates "$TRACK" "$branch")

  return 1
}

prepare_session() {
  local session_path
  session_path=$(session_dir)

  if [[ "$RESET" -eq 1 && -d "$session_path" ]]; then
    log "reset enabled: removing existing session folder: $session_path"
    safe_rm_rf "$session_path"
  fi

  mkdir -p "$session_path"

  local mirror
  mirror=$(mirror_dir)

  sync_source_repo

  if [[ ! -d "$mirror" ]]; then
    log "creating mirror repository: $mirror"
    git clone --mirror "$SOURCE_REPO" "$mirror" >/dev/null
  fi

  git --git-dir="$mirror" remote set-url origin "$SOURCE_REPO"
  # Avoid mirror-style fetch into refs/heads/*, which fails when a branch is
  # checked out in an attached worktree (e.g. 00-main).
  git --git-dir="$mirror" config --unset-all remote.origin.fetch >/dev/null 2>&1 || true
  git --git-dir="$mirror" config --add remote.origin.fetch '+refs/heads/*:refs/remotes/origin/*'
  git --git-dir="$mirror" config --add remote.origin.fetch '+refs/tags/*:refs/tags/*'
  git --git-dir="$mirror" fetch origin --prune >/dev/null
  git --git-dir="$mirror" worktree prune >/dev/null

  while IFS= read -r branch; do
    local source_ref
    source_ref=$(resolve_mirror_ref "$mirror" "$branch") || fail "Branch not found in source refs: $branch"

    local folder branch_path
    folder=$(folder_name_for_branch "$branch")
    branch_path="$session_path/$folder"

    if [[ -d "$branch_path" ]]; then
      git --git-dir="$mirror" worktree remove --force "$branch_path" >/dev/null 2>&1 || safe_rm_rf "$branch_path"
    fi

    git --git-dir="$mirror" update-ref "refs/heads/$branch" "$source_ref"
    git --git-dir="$mirror" worktree add --force "$branch_path" "$branch" >/dev/null
    git -C "$branch_path" reset --hard "$branch" >/dev/null
    git -C "$branch_path" clean -fd >/dev/null
    bootstrap_codex_workspace "$branch_path"

    log "prepared $branch -> $branch_path"
  done < <(selected_branches)

  write_manifest
  log "session prepared: $session_path"
}

launch_session() {
  local manifest
  manifest=$(manifest_path)

  if [[ ! -f "$manifest" ]]; then
    fail "Session manifest missing: $manifest (run --mode prepare first)"
  fi

  if [[ "$USE_VIRTUAL_DESKTOPS" -eq 1 ]]; then
    log "--use-virtual-desktops is PowerShell-only; continuing without desktop control"
  fi

  if [[ "$OPEN_CODE" -eq 0 ]]; then
    log "--no-code enabled; skipping VS Code launch"
    return 0
  fi

  command -v code >/dev/null 2>&1 || fail "VS Code CLI 'code' not found in PATH"

  tail -n +2 "$manifest" | while IFS=$'\t' read -r branch folder path; do
    [[ -d "$path" ]] || fail "Missing branch folder for launch: $path"
    log "opening VS Code for $branch ($path)"
    CODEX_HOME="$path/.codex" code -n "$path" >/dev/null 2>&1 &
    sleep 0.2
  done
}

teardown_session() {
  local session_path
  session_path=$(session_dir)

  if [[ ! -d "$session_path" ]]; then
    log "nothing to teardown; session folder not found: $session_path"
    return 0
  fi

  safe_rm_rf "$session_path"
  log "session removed: $session_path"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --mode)
      [[ $# -ge 2 ]] || fail "Missing value for --mode"
      MODE="$2"
      shift 2
      ;;
    --session)
      [[ $# -ge 2 ]] || fail "Missing value for --session"
      SESSION="$2"
      shift 2
      ;;
    --sessions-root)
      [[ $# -ge 2 ]] || fail "Missing value for --sessions-root"
      SESSIONS_ROOT="$2"
      shift 2
      ;;
    --source-repo)
      [[ $# -ge 2 ]] || fail "Missing value for --source-repo"
      SOURCE_REPO="$2"
      shift 2
      ;;
    --track)
      [[ $# -ge 2 ]] || fail "Missing value for --track"
      TRACK="$2"
      shift 2
      ;;
    --exclude-main)
      INCLUDE_MAIN=0
      shift
      ;;
    --max-branches)
      [[ $# -ge 2 ]] || fail "Missing value for --max-branches"
      MAX_BRANCHES="$2"
      shift 2
      ;;
    --no-code)
      OPEN_CODE=0
      shift
      ;;
    --reset)
      RESET=1
      shift
      ;;
    --use-virtual-desktops)
      USE_VIRTUAL_DESKTOPS=1
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

[[ -n "$SESSION" ]] || fail "--session is required"

case "$MODE" in
  prepare|launch|all|teardown) ;;
  *) fail "Unsupported mode: $MODE" ;;
esac

if [[ -z "$SOURCE_REPO" ]]; then
  SOURCE_REPO="$DEFAULT_SOURCE_REPO"
fi
if [[ -z "$SESSIONS_ROOT" ]]; then
  SESSIONS_ROOT="$DEFAULT_SESSIONS_ROOT"
fi

if ! [[ "$MAX_BRANCHES" =~ ^[0-9]+$ ]]; then
  fail "--max-branches must be a non-negative integer"
fi

[[ -d "$SOURCE_REPO" ]] || fail "Source repo path does not exist: $SOURCE_REPO"
git -C "$SOURCE_REPO" rev-parse --is-inside-work-tree >/dev/null 2>&1 || fail "Not a git repo: $SOURCE_REPO"

mkdir -p "$SESSIONS_ROOT"

case "$MODE" in
  prepare)
    prepare_session
    ;;
  launch)
    launch_session
    ;;
  all)
    prepare_session
    launch_session
    ;;
  teardown)
    teardown_session
    ;;
esac
