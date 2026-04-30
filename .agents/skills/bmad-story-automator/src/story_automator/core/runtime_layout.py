from __future__ import annotations

import os
from pathlib import Path, PurePosixPath

STORY_SKILL_NAME = "bmad-story-automator"
ACTIVE_MARKER_NAME = ".story-automator-active"


def _project_root(project_root: str | Path | None = None) -> Path:
    return Path(project_root or os.environ.get("PROJECT_ROOT") or os.getcwd()).expanduser().resolve()


def _configured_skills_root() -> Path | None:
    raw = os.environ.get("BMAD_SKILLS_ROOT", "").strip()
    if not raw:
        return None
    path = Path(raw).expanduser()
    if path.name == STORY_SKILL_NAME:
        return path.parent.resolve()
    return path.resolve()


def candidate_skills_roots(project_root: str | Path | None = None) -> list[Path]:
    root = _project_root(project_root)
    candidates: list[Path] = []
    explicit = _configured_skills_root()
    if explicit:
        candidates.append(explicit)
    candidates.extend(
        [
            root / ".agents" / "skills",
            root / ".claude" / "skills",
            Path.home() / ".codex" / "skills",
            Path.home() / ".claude" / "skills",
        ]
    )
    seen: set[str] = set()
    unique: list[Path] = []
    for candidate in candidates:
        key = str(candidate.expanduser().resolve())
        if key not in seen:
            seen.add(key)
            unique.append(Path(key))
    return unique


def _skill_present(skill_dir: Path, *, policy: bool = False) -> bool:
    if policy:
        return (skill_dir / "data" / "orchestration-policy.json").is_file()
    return (skill_dir / "SKILL.md").is_file() or (skill_dir / "data" / "orchestration-policy.json").is_file()


def resolve_skills_root(
    project_root: str | Path | None = None,
    *,
    skill_name: str = "",
    policy: bool = False,
) -> Path:
    explicit = _configured_skills_root()
    for candidate in candidate_skills_roots(project_root):
        if skill_name:
            skill_dir = (candidate / skill_name).resolve()
            if _skill_present(skill_dir, policy=policy):
                return candidate.resolve()
            if explicit and candidate.resolve() == explicit:
                return candidate.resolve()
            continue
        if candidate.is_dir() or (explicit and candidate.resolve() == explicit):
            return candidate.resolve()
    return (_project_root(project_root) / ".claude" / "skills").resolve()


def resolve_skill_dir(project_root: str | Path | None, skill_name: str) -> Path:
    root = resolve_skills_root(project_root, skill_name=skill_name)
    return (root / skill_name).resolve()


def bundled_story_skill_root(project_root: str | Path | None = None) -> Path:
    explicit = _configured_skills_root()
    roots = candidate_skills_roots(project_root)
    for skills_root in roots:
        candidate = (skills_root / STORY_SKILL_NAME).resolve()
        if _skill_present(candidate, policy=True):
            return candidate
        if explicit and skills_root.resolve() == explicit:
            break
    for parent in Path(__file__).resolve().parents:
        candidate = parent / "payload" / ".claude" / "skills" / STORY_SKILL_NAME
        if _skill_present(candidate, policy=True):
            return candidate
    raise FileNotFoundError("bundled story automator policy not found")


def _infer_provider_from_root(skills_root: Path | None) -> str:
    if not skills_root:
        return ""
    parts = set(skills_root.resolve().parts)
    parent = skills_root.resolve().parent.name
    if parent == ".claude" or ".claude" in parts:
        return "claude"
    if parent in {".agents", ".codex"} or ".agents" in parts or ".codex" in parts:
        return "codex"
    return ""


def runtime_provider(project_root: str | Path | None = None) -> str:
    for name in ("BMAD_RUNTIME_PROVIDER", "STORY_AUTOMATOR_RUNTIME_PROVIDER", "AI_AGENT"):
        raw = os.environ.get(name, "").strip().lower()
        if raw in {"claude", "codex"}:
            return raw
    explicit = _configured_skills_root()
    inferred = _infer_provider_from_root(explicit)
    if inferred:
        return inferred
    for parent in Path(__file__).resolve().parents:
        if parent.name == "skills":
            inferred = _infer_provider_from_root(parent)
            if inferred:
                return inferred
    return "claude"


def active_marker_path(project_root: str | Path | None = None) -> Path:
    root = _project_root(project_root)
    for name in ("BMAD_STORY_AUTOMATOR_ACTIVE_MARKER", "STORY_AUTOMATOR_ACTIVE_MARKER"):
        raw = os.environ.get(name, "").strip()
        if raw:
            marker = Path(raw).expanduser()
            return (marker if marker.is_absolute() else root / marker).resolve()

    provider = runtime_provider(root)
    skills_root = resolve_skills_root(root, skill_name=STORY_SKILL_NAME)
    try:
        skills_root.relative_to(root)
        if skills_root.parent.name in {".claude", ".agents", ".codex"}:
            return (skills_root.parent / ACTIVE_MARKER_NAME).resolve()
    except ValueError:
        pass

    if provider == "codex":
        return (root / ".agents" / ACTIVE_MARKER_NAME).resolve()
    return (root / ".claude" / ACTIVE_MARKER_NAME).resolve()


def active_marker_project_entry(project_root: str | Path | None = None) -> str:
    root = _project_root(project_root)
    marker = active_marker_path(root)
    try:
        return str(marker.relative_to(root))
    except ValueError:
        return str(marker)


def resolve_portable_path(path_value: str, project_root: str | Path | None = None) -> Path | None:
    normalized = str(path_value or "").replace("\\", "/").strip()
    for prefix in (".claude/skills/", ".agents/skills/", ".codex/skills/"):
        if not normalized.startswith(prefix):
            continue
        relative = PurePosixPath(normalized[len(prefix) :])
        parts = relative.parts
        if not parts:
            return None
        skill_name = parts[0]
        skill_dir = resolve_skill_dir(project_root, skill_name)
        candidate = (skill_dir / Path(*parts[1:])).resolve()
        candidate.relative_to(skill_dir)
        return candidate
    return None
