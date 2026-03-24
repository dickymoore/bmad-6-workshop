#!/usr/bin/env bash
set -euo pipefail

SCRIPT_NAME=$(basename "$0")
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
ROOT_DIR=$(git -C "$SCRIPT_DIR/.." rev-parse --show-toplevel 2>/dev/null || pwd)
OUTPUT_ROOT="$ROOT_DIR/showcase"

# shellcheck source=scripts/lib/workshop_tracks.sh
source "$SCRIPT_DIR/lib/workshop_tracks.sh"
TRACK=$(workshop_default_track)

usage() {
  cat <<USAGE
Usage:
  ./${SCRIPT_NAME} --track <id> [--output-root <path>]

Generate a facilitator-friendly showcase from the frozen workshop branches for a
single track. Output lands under showcase/<track>/ on the current branch.

Options:
  --track <id>          Workshop track id (default: value from workshops/index.json)
  --output-root <path>  Parent folder for showcase exports (default: ${OUTPUT_ROOT})
  -h, --help            Show help
USAGE
}

fail() {
  echo "ERROR: $*" >&2
  exit 2
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

write_stage_readme() {
  local path="$1"
  local stage_id="$2"
  local stage_name="$3"
  local branch="$4"
  local ref="$5"
  local commit_sha="$6"
  local subject="$7"
  local guidance="$8"
  local exported_csv="$9"

  cat > "$path" <<EOF2
# ${stage_id} - ${stage_name}

- Branch: ${branch}
- Source ref used for export: ${ref}
- Commit: ${commit_sha}
- Commit subject: ${subject}
- Snapshot path: snapshot/

## Guidance

${guidance}

## Exported roots

${exported_csv}
EOF2
}

write_missing_stage_readme() {
  local path="$1"
  local stage_id="$2"
  local stage_name="$3"
  local branch="$4"
  local guidance="$5"

  cat > "$path" <<EOF2
# ${stage_id} - ${stage_name}

- Branch: ${branch}
- Status: not yet cut from authoring history

## Guidance

${guidance}

## Notes

This showcase folder exists so the facilitator view stays structurally stable,
but no frozen branch exists for this stage yet.
EOF2
}

write_preinstall_readme() {
  local path="$1"
  local branch="$2"
  local ref="$3"
  local commit_sha="$4"
  local subject="$5"
  local guidance="$6"
  local exported_csv="$7"

  cat > "$path" <<EOF2
# 00-pre-install - Clean bootstrap view

- Branch: ${branch}
- Source ref used for export: ${ref}
- Commit: ${commit_sha}
- Commit subject: ${subject}
- Snapshot path: snapshot/

## Guidance

${guidance}

## Exported roots

${exported_csv}
EOF2
}

write_installation_readme() {
  local path="$1"
  local branch="$2"
  local ref="$3"
  local commit_sha="$4"
  local subject="$5"
  local guidance="$6"
  local exported_csv="$7"

  cat > "$path" <<EOF2
# installation - BMAD install view

- Branch: ${branch}
- Source ref used for export: ${ref}
- Commit: ${commit_sha}
- Commit subject: ${subject}
- Snapshot path: snapshot/

## Guidance

${guidance}

## Exported roots

${exported_csv}
EOF2
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --track)
      [[ $# -ge 2 ]] || fail "Missing value for --track"
      TRACK="$2"
      shift 2
      ;;
    --output-root)
      [[ $# -ge 2 ]] || fail "Missing value for --output-root"
      OUTPUT_ROOT="$2"
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

track_root="$OUTPUT_ROOT/$TRACK"
rm -rf "$track_root"
mkdir -p "$track_root"

root_readme="$track_root/README.md"
cat > "$root_readme" <<EOF2
# Facilitator Showcase: ${TRACK}

This folder is a generated facilitator view for workshop delivery without live
branch switching. The helper folders \`00-pre-install/\` and \`installation/\`
show the clean bootstrap state and the BMAD install payload. Each stage folder
contains a generated summary and a snapshot/ directory exported from the
corresponding frozen workshop branch.

The canonical source of truth remains the workshop branches plus the rolling
authoring/${TRACK} branch. This showcase lives on main only.

## Stage snapshots

EOF2

bootstrap_branch=$(workshop_stage_branch "$TRACK" main)
preinstall_guidance="Clean bootstrap snapshot taken from ${bootstrap_branch} before BMAD install. Use this view to show the starting repo state; the installed BMAD payload appears separately under installation/."
preinstall_dir="$track_root/00-pre-install"
mkdir -p "$preinstall_dir/snapshot"
preinstall_paths=(
  README.md
)

if preinstall_ref=$(resolve_ref "$bootstrap_branch"); then
  preinstall_sha=$(git -C "$ROOT_DIR" rev-parse --short "$preinstall_ref")
  preinstall_subject=$(git -C "$ROOT_DIR" log -1 --format=%s "$preinstall_ref")
  exported_preinstall=()
  for path in "${preinstall_paths[@]}"; do
    if git -C "$ROOT_DIR" cat-file -e "$preinstall_ref:$path" 2>/dev/null; then
      exported_preinstall+=("$path")
    fi
  done
  if ((${#exported_preinstall[@]} > 0)); then
    git -C "$ROOT_DIR" archive "$preinstall_ref" "${exported_preinstall[@]}" | tar -x -C "$preinstall_dir/snapshot"
    preinstall_list=$(printf -- '- %s\n' "${exported_preinstall[@]}")
  else
    preinstall_list='- none'
  fi
  write_preinstall_readme "$preinstall_dir/README.md" "$bootstrap_branch" "$preinstall_ref" "$preinstall_sha" "$preinstall_subject" "$preinstall_guidance" "$preinstall_list"
  printf -- '- 00-pre-install -> %s (%s)\n' "$bootstrap_branch" "$preinstall_sha" >> "$root_readme"
fi

installation_branch=$(workshop_stage_branch "$TRACK" 10-analysis)
installation_guidance="BMAD install payload snapshot taken from ${installation_branch}, which is the first committed branch that contains the installed .agents and _bmad files."
installation_dir="$track_root/installation"
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
  printf -- '- installation -> %s (%s)\n' "$installation_branch" "$installation_sha" >> "$root_readme"
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
  stage_dir="$track_root/$stage_id"
  mkdir -p "$stage_dir"

  if ref=$(resolve_ref "$branch"); then
    commit_sha=$(git -C "$ROOT_DIR" rev-parse --short "$ref")
    subject=$(git -C "$ROOT_DIR" log -1 --format=%s "$ref")
    snapshot_dir="$stage_dir/snapshot"
    mkdir -p "$snapshot_dir"
    exported=()
    for path in "${candidate_paths[@]}"; do
      if git -C "$ROOT_DIR" cat-file -e "$ref:$path" 2>/dev/null; then
        exported+=("$path")
      fi
    done
    if ((${#exported[@]} > 0)); then
      git -C "$ROOT_DIR" archive "$ref" "${exported[@]}" | tar -x -C "$snapshot_dir"
    fi
    exported_list=$(printf -- '- %s\n' "${exported[@]}")
    write_stage_readme "$stage_dir/README.md" "$stage_id" "$stage_name" "$branch" "$ref" "$commit_sha" "$subject" "$guidance" "$exported_list"
    printf -- '- %s -> %s (%s)\n' "$stage_id" "$branch" "$commit_sha" >> "$root_readme"
  else
    write_missing_stage_readme "$stage_dir/README.md" "$stage_id" "$stage_name" "$branch" "$guidance"
    printf -- '- %s -> %s (not yet cut)\n' "$stage_id" "$branch" >> "$root_readme"
  fi
done < <(workshop_list_branches "$TRACK" 0)
