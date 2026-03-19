#!/usr/bin/env bash
set -euo pipefail

SCRIPT_NAME=$(basename "$0")
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
ROOT_DIR=$(git -C "$SCRIPT_DIR/.." rev-parse --show-toplevel 2>/dev/null || pwd)

# shellcheck source=scripts/lib/workshop_tracks.sh
source "$SCRIPT_DIR/lib/workshop_tracks.sh"

TRACK=$(workshop_default_track)
DESTINATION=""
AGENT_REPLAY_URL="https://github.com/dickymoore/agent-replay"
BMB_REPO=""
BMB_MODULE=""
RESET=0
FETCH=1

usage() {
  cat <<USAGE
Usage:
  ./${SCRIPT_NAME} --destination <path> [options]

Create a clean facilitator workspace outside this repo. The workspace includes:
- files/            facilitator-friendly phase folders exported from workshop branches
- files/bmb/        optional BMB module outputs copied from another repo
- .codex/           empty Codex folder for the facilitator machine
- agent-replay/     cloned from the configured repository

Options:
  --destination <path>     Output workspace path. Must be outside this repo.
  --track <id>             Workshop track id (default: value from workshops/index.json)
  --agent-replay-url <u>   Git URL to clone into agent-replay/ (default: ${AGENT_REPLAY_URL})
  --bmb-repo <path>        Source repo containing _bmad-output and src/modules
  --bmb-module <slug>      Module slug to copy from the BMB source repo
  --reset                  Remove an existing destination before recreating it
  --no-fetch               Skip 'git fetch origin --prune' before export
  -h, --help               Show help

Example:
  ./${SCRIPT_NAME} --track albemarle-pulse --destination ../albemarle-pulse-facilitator --reset
USAGE
}

log() {
  printf '[%s] %s\n' "$(date +'%Y-%m-%d %H:%M:%S')" "$*"
}

fail() {
  echo "ERROR: $*" >&2
  exit 2
}

realpath_portable() {
  python3 - "$1" <<'PY'
import os
import sys
print(os.path.realpath(sys.argv[1]))
PY
}

safe_rm_rf() {
  local path="$1"
  [[ -n "$path" && "$path" != "/" ]] || fail "Refusing to delete unsafe path: '$path'"
  rm -rf "$path"
}

resolve_ref() {
  local branch="$1"
  if git -C "$ROOT_DIR" show-ref --verify --quiet "refs/heads/$branch"; then
    printf '%s\n' "$branch"
    return 0
  fi
  if git -C "$ROOT_DIR" show-ref --verify --quiet "refs/remotes/origin/$branch"; then
    printf 'origin/%s\n' "$branch"
    return 0
  fi
  return 1
}

stage_folder_name() {
  local stage_id="$1"
  if [[ "$stage_id" =~ ^([0-9]+)-(.*)$ ]]; then
    local phase_num=$((10#${BASH_REMATCH[1]} / 10))
    printf 'phase-%d-%s\n' "$phase_num" "${BASH_REMATCH[2]}"
    return 0
  fi
  printf '%s\n' "$stage_id"
}

write_workspace_readme() {
  local path="$1"
  local files_root="$2"
  cat > "$path" <<EOF
# Facilitator Workspace: ${TRACK}

This workspace is generated from the workshop branches in:

- Source repo: ${ROOT_DIR}
- Track: ${TRACK}

## Layout

- \`files/\` - stage-by-stage facilitator snapshots
- \`.codex/\` - empty per-workspace Codex folder
- \`agent-replay/\` - local checkout of ${AGENT_REPLAY_URL}

Open \`${files_root}\` to browse the workshop without live branch switching.
EOF
}

write_files_index() {
  local path="$1"
  cat > "$path" <<EOF
# Files View: ${TRACK}

These folders are exported from the frozen \`workshop/${TRACK}/*\` branches.

## Phase folders

EOF
}

write_phase_readme() {
  local path="$1"
  local folder_name="$2"
  local stage_name="$3"
  local branch="$4"
  local ref="$5"
  local commit_sha="$6"
  local subject="$7"
  local guidance="$8"
  local exported_list="$9"

  cat > "$path" <<EOF
# ${folder_name} - ${stage_name}

- Branch: ${branch}
- Source ref: ${ref}
- Commit: ${commit_sha}
- Commit subject: ${subject}
- Snapshot path: snapshot/

## Guidance

${guidance}

## Exported roots

${exported_list}
EOF
}

write_missing_phase_readme() {
  local path="$1"
  local folder_name="$2"
  local stage_name="$3"
  local branch="$4"
  local guidance="$5"

  cat > "$path" <<EOF
# ${folder_name} - ${stage_name}

- Branch: ${branch}
- Status: branch not yet cut

## Guidance

${guidance}

## Notes

This phase folder is present so the facilitator view stays stable, but there is
no frozen branch for this stage yet.
EOF
}

write_installation_readme() {
  local path="$1"
  local branch="$2"
  local ref="$3"
  local commit_sha="$4"
  local subject="$5"
  local guidance="$6"
  local exported_list="$7"

  cat > "$path" <<EOF
# installation - BMAD install view

- Branch: ${branch}
- Source ref: ${ref}
- Commit: ${commit_sha}
- Commit subject: ${subject}
- Snapshot path: snapshot/

## Guidance

${guidance}

## Exported roots

${exported_list}
EOF
}

copy_bmb_module() {
  local files_root="$1"
  local repo_root="$2"
  local module_slug="$3"
  local bmb_root="$files_root/bmb/$module_slug"
  local brief_src="$repo_root/_bmad-output/bmb-creations/modules/module-brief-${module_slug}.md"
  local validation_src
  validation_src=$(find "$repo_root/_bmad-output/bmb-creations/modules" -maxdepth 1 -type f -name "validation-report-${module_slug}-*.md" | sort | tail -n 1)
  local module_root="$repo_root/src/modules/$module_slug"

  [[ -f "$brief_src" ]] || fail "BMB brief not found: $brief_src"
  [[ -n "$validation_src" && -f "$validation_src" ]] || fail "BMB validation report not found for module: $module_slug"
  [[ -d "$module_root" ]] || fail "BMB module root not found: $module_root"

  mkdir -p "$bmb_root"
  cp "$brief_src" "$bmb_root/"
  cp "$validation_src" "$bmb_root/"
  cp -R "$module_root" "$bmb_root/module"

  local agents_count=0
  local workflows_count=0
  if [[ -d "$module_root/agents" ]]; then
    agents_count=$(find "$module_root/agents" -type f | wc -l | tr -d ' ')
  fi
  if [[ -d "$module_root/workflows" ]]; then
    workflows_count=$(find "$module_root/workflows" -type f | wc -l | tr -d ' ')
  fi

  cat > "$bmb_root/README.md" <<EOF
# BMB Module Export: ${module_slug}

- Source repo: ${repo_root}
- Brief: $(basename "$brief_src")
- Validation report: $(basename "$validation_src")
- Module root: module/
- Agent specs: ${agents_count}
- Workflow specs: ${workflows_count}

This folder is copied from a BMB module-generation run so it can be shown
alongside the workshop phase snapshots.
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --destination)
      [[ $# -ge 2 ]] || fail "Missing value for --destination"
      DESTINATION="$2"
      shift 2
      ;;
    --track)
      [[ $# -ge 2 ]] || fail "Missing value for --track"
      TRACK="$2"
      shift 2
      ;;
    --agent-replay-url)
      [[ $# -ge 2 ]] || fail "Missing value for --agent-replay-url"
      AGENT_REPLAY_URL="$2"
      shift 2
      ;;
    --bmb-repo)
      [[ $# -ge 2 ]] || fail "Missing value for --bmb-repo"
      BMB_REPO="$2"
      shift 2
      ;;
    --bmb-module)
      [[ $# -ge 2 ]] || fail "Missing value for --bmb-module"
      BMB_MODULE="$2"
      shift 2
      ;;
    --reset)
      RESET=1
      shift
      ;;
    --no-fetch)
      FETCH=0
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

[[ -n "$DESTINATION" ]] || fail "--destination is required"
if [[ -n "$BMB_REPO" || -n "$BMB_MODULE" ]]; then
  [[ -n "$BMB_REPO" && -n "$BMB_MODULE" ]] || fail "--bmb-repo and --bmb-module must be supplied together"
fi

root_real=$(realpath_portable "$ROOT_DIR")
dest_parent=$(dirname "$DESTINATION")
mkdir -p "$dest_parent"
dest_real=$(realpath_portable "$DESTINATION")

case "$dest_real" in
  "$root_real"|"$root_real"/*)
    fail "Destination must be outside the repo: $dest_real"
    ;;
esac

if [[ -e "$dest_real" ]]; then
  if [[ "$RESET" == "1" ]]; then
    safe_rm_rf "$dest_real"
  elif [[ -n "$(find "$dest_real" -mindepth 1 -maxdepth 1 -print -quit 2>/dev/null)" ]]; then
    fail "Destination exists and is not empty: $dest_real (use --reset to recreate it)"
  fi
fi

if [[ "$FETCH" == "1" ]] && git -C "$ROOT_DIR" remote get-url origin >/dev/null 2>&1; then
  log "fetching latest refs from origin"
  git -C "$ROOT_DIR" fetch origin --prune >/dev/null
fi

files_root="$dest_real/files"
agent_replay_root="$dest_real/agent-replay"

mkdir -p "$files_root"
mkdir -p "$dest_real/.codex"

if [[ -f "$ROOT_DIR/workshops/$TRACK/cut-history.md" ]]; then
  cp "$ROOT_DIR/workshops/$TRACK/cut-history.md" "$files_root/CUT-HISTORY.md"
fi

write_workspace_readme "$dest_real/README.md" "files/"
write_files_index "$files_root/README.md"

installation_branch=$(workshop_stage_branch "$TRACK" 10-analysis)
installation_guidance="BMAD install payload snapshot taken from ${installation_branch}, which is the first committed branch that contains the installed .agents and _bmad files."
installation_dir="$files_root/installation"
mkdir -p "$installation_dir/snapshot"
installation_paths=(
  .agents/skills
  _bmad/_config
  _bmad/bmm/config.yaml
  _bmad/core/config.yaml
)

if installation_ref=$(resolve_ref "$installation_branch"); then
  installation_sha=$(git -C "$ROOT_DIR" rev-parse --short "$installation_ref")
  installation_subject=$(git -C "$ROOT_DIR" log -1 --format=%s "$installation_ref")
  exported_installation=()
  for path in "${installation_paths[@]}"; do
    if git -C "$ROOT_DIR" cat-file -e "$installation_ref:$path" 2>/dev/null; then
      exported_installation+=("$path")
    fi
  done
  if ((${#exported_installation[@]} > 0)); then
    git -C "$ROOT_DIR" archive "$installation_ref" "${exported_installation[@]}" | tar -x -C "$installation_dir/snapshot"
    installation_list=$(printf -- '- %s\n' "${exported_installation[@]}")
  else
    installation_list='- none'
  fi
  write_installation_readme "$installation_dir/README.md" "$installation_branch" "$installation_ref" "$installation_sha" "$installation_subject" "$installation_guidance" "$installation_list"
  printf -- '- `installation/` -> `%s` (`%s`)\n' "$installation_branch" "$installation_sha" >> "$files_root/README.md"
fi

candidate_paths=(
  README.md
  _bmad-output
  docs
  src
  tests
  public
  data
  package.json
  package-lock.json
  pnpm-lock.yaml
  yarn.lock
  tsconfig.json
  jsconfig.json
  next.config.js
  next.config.ts
  next.config.mjs
  eslint.config.js
  eslint.config.mjs
  vite.config.js
  vite.config.ts
  vitest.config.js
  vitest.config.ts
  playwright.config.js
  playwright.config.ts
  .nvmrc
)

while IFS= read -r branch; do
  stage_id=$(workshop_branch_field "$TRACK" "$branch" id)
  stage_name=$(workshop_branch_field "$TRACK" "$branch" name)
  guidance=$(workshop_branch_field "$TRACK" "$branch" guidance)
  folder_name=$(stage_folder_name "$stage_id")
  phase_dir="$files_root/$folder_name"
  mkdir -p "$phase_dir"

  if ref=$(resolve_ref "$branch"); then
    commit_sha=$(git -C "$ROOT_DIR" rev-parse --short "$ref")
    subject=$(git -C "$ROOT_DIR" log -1 --format=%s "$ref")
    snapshot_dir="$phase_dir/snapshot"
    mkdir -p "$snapshot_dir"
    exported=()
    for path in "${candidate_paths[@]}"; do
      if git -C "$ROOT_DIR" cat-file -e "$ref:$path" 2>/dev/null; then
        exported+=("$path")
      fi
    done
    if ((${#exported[@]} > 0)); then
      git -C "$ROOT_DIR" archive "$ref" "${exported[@]}" | tar -x -C "$snapshot_dir"
      exported_list=$(printf -- '- %s\n' "${exported[@]}")
    else
      exported_list='- none'
    fi
    write_phase_readme "$phase_dir/README.md" "$folder_name" "$stage_name" "$branch" "$ref" "$commit_sha" "$subject" "$guidance" "$exported_list"
    printf -- '- `%s/` -> `%s` (`%s`)\n' "$folder_name" "$branch" "$commit_sha" >> "$files_root/README.md"
  else
    write_missing_phase_readme "$phase_dir/README.md" "$folder_name" "$stage_name" "$branch" "$guidance"
    printf -- '- `%s/` -> `%s` (not yet cut)\n' "$folder_name" "$branch" >> "$files_root/README.md"
  fi
done < <(workshop_list_branches "$TRACK" 0)

if [[ -n "$BMB_REPO" ]]; then
  log "copying BMB module export for $BMB_MODULE"
  copy_bmb_module "$files_root" "$BMB_REPO" "$BMB_MODULE"
  printf -- '\n## BMB exports\n\n- `bmb/%s/` -> copied from `%s`\n' "$BMB_MODULE" "$BMB_REPO" >> "$files_root/README.md"
fi

log "generating speaker-guide link files"
"$SCRIPT_DIR/generate-facilitator-links.py" --track "$TRACK" --files-root "$files_root"

log "cloning agent-replay into $agent_replay_root"
git clone "$AGENT_REPLAY_URL" "$agent_replay_root" >/dev/null

log "facilitator workspace created at $dest_real"
