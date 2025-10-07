"""Regression tests ensuring the extension manifest stays cross-browser friendly."""

from __future__ import annotations

import json
from pathlib import Path

import pytest


def load_manifest() -> dict[str, object]:
    """Return the parsed ``manifest.json`` from the repository root."""

    manifest_path = Path(__file__).resolve().parent.parent / "manifest.json"
    with manifest_path.open("r", encoding="utf-8") as manifest_file:
        return json.load(manifest_file)


@pytest.fixture(scope="module")
def manifest() -> dict[str, object]:
    """Expose the parsed manifest for reuse across tests."""

    return load_manifest()


def test_manifest_metadata_is_populated(manifest: dict[str, object]) -> None:
    """Verify core metadata expected by both Chrome and Firefox stores."""

    assert manifest["manifest_version"] == 3
    assert manifest["name"] == "Copy Tab URLs"
    assert manifest["short_name"] == "Copy URLs"
    assert manifest["author"] == "Copy Tab URLs Maintainers"
    assert manifest["homepage_url"] == "https://github.com/discripper/copy-tab-urls"

    action = manifest["action"]
    assert action["default_title"] == "Copy Tab URLs"
    assert action["default_popup"] == "popup.html"


def test_manifest_declares_required_permissions(manifest: dict[str, object]) -> None:
    """The manifest must request the permissions used across the extension."""

    permissions = set(manifest["permissions"])
    assert {"tabs", "storage", "clipboardWrite", "clipboardRead"}.issubset(permissions)


def test_manifest_includes_firefox_metadata(manifest: dict[str, object]) -> None:
    """Firefox-specific settings must specify the signed add-on identifier."""

    browser_specific_settings = manifest["browser_specific_settings"]
    gecko_settings = browser_specific_settings["gecko"]

    assert gecko_settings["id"] == "copy-tab-urls@discripper.dev"
    assert gecko_settings["strict_min_version"] == "109.0"
