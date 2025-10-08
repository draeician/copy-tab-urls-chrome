"""Regression tests for the background service worker bootstrap."""

from __future__ import annotations

from pathlib import Path


def load_file(relative_path: str) -> str:
    """Return the text contents of *relative_path* from the repository root."""

    project_root = Path(__file__).resolve().parent.parent
    target_path = project_root / relative_path
    return target_path.read_text(encoding="utf-8")


def test_background_uses_shared_adapter() -> None:
    """The background worker should pull the API from the shared adapter shim."""

    background_source = load_file("background.js")
    assert "browserAdapter.getBrowser()" in background_source


def test_browser_adapter_exposes_getter() -> None:
    """The adapter shim should expose a getter for shared usage."""

    adapter_source = load_file("vendor/browser-adapter.js")
    assert "browserAdapter" in adapter_source
    assert "getBrowser" in adapter_source


def test_background_persists_last_session() -> None:
    """Copy operations should persist the last session metadata."""

    background_source = load_file("background.js")
    assert "storage.local.set({" in background_source
    assert "lastSession" in background_source
    assert "savedAt" in background_source


def test_background_restores_saved_session() -> None:
    """Restore helpers must reopen URLs via windows/tabs APIs."""

    background_source = load_file("background.js")
    assert "storage.local.get('lastSession')" in background_source
    assert "function restoreUrls" in background_source
    assert "windowsApi.create" in background_source
    assert "tabsApi.update" in background_source
    assert "tabsApi.create" in background_source


def test_background_reports_blocked_internal_urls() -> None:
    """Empty results due to blocked schemes should be explained to users."""

    background_source = load_file("background.js")
    assert "Blocked ${blockedCount} internal URL" in background_source
