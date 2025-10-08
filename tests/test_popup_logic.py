"""Ensure the popup wiring targets the new background workflow."""

from pathlib import Path


def load_popup_js() -> str:
    return Path("popup.js").read_text(encoding="utf-8")


def test_popup_uses_browser_adapter() -> None:
    source = load_popup_js()
    assert "browserAdapter.getBrowser()" in source


def test_popup_persists_open_in_new_window_setting() -> None:
    source = load_popup_js()
    assert "storage.sync.get({ openInNewWindow: true })" in source
    assert "storage.sync.set({ openInNewWindow: state.openInNewWindow })" in source


def test_popup_triggers_expected_background_actions() -> None:
    source = load_popup_js()
    assert "action: 'copyUrls'" in source
    assert "action: 'restoreLastSaved'" in source
    assert "action: 'openFromClipboard'" in source


def test_popup_reads_and_writes_clipboard() -> None:
    source = load_popup_js()
    assert "navigator.clipboard.readText" in source
    assert "navigator.clipboard.writeText" in source
