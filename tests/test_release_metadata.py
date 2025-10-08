"""Regression tests ensuring release metadata stays in sync."""

from __future__ import annotations

import json
import re
from pathlib import Path


def test_changelog_mentions_current_manifest_version() -> None:
    """The changelog must include an entry for the published manifest version."""

    repo_root = Path(__file__).resolve().parent.parent
    manifest_path = repo_root / "manifest.json"
    changelog_path = repo_root / "CHANGELOG.md"

    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    manifest_version = manifest["version"]

    changelog_text = changelog_path.read_text(encoding="utf-8")
    heading_pattern = re.compile(
        rf"^##\s+{re.escape(manifest_version)}\s+-\s+\d{{4}}-\d{{2}}-\d{{2}}$",
        re.MULTILINE,
    )

    match = heading_pattern.search(changelog_text)
    assert match is not None, "Changelog must contain a heading for the current manifest version."

    body_start = match.end()
    next_heading_index = changelog_text.find("\n## ", body_start)
    body_text = changelog_text[body_start:next_heading_index if next_heading_index != -1 else None]

    assert re.search(r"^- ", body_text, re.MULTILINE), "Release entry must include bullet highlights."
