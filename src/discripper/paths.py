"""Path helpers used in tests to locate repository fixtures."""

from pathlib import Path


def get_repo_root() -> Path:
    """Return the repository root directory."""
    return Path(__file__).resolve().parents[2]
