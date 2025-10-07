"""Tests verifying that the browser adapter is loaded in extension contexts."""

from discripper import get_repo_root


def read_text(relative_path: str) -> str:
    return (get_repo_root() / relative_path).read_text(encoding="utf-8")


def test_background_imports_adapter() -> None:
    background_js = read_text("background.js")
    assert "importScripts('vendor/browser-adapter.js');" in background_js
    assert "const runtime = browser.runtime;" in background_js
    assert "const storage = browser.storage;" in background_js
    assert "const tabsApi = browser.tabs;" in background_js
    assert "const windowsApi = browser.windows;" in background_js


def test_popup_loads_adapter_before_script() -> None:
    popup_html = read_text("popup.html")
    adapter_tag = '<script src="vendor/browser-adapter.js"></script>'
    popup_tag = '<script src="popup.js"></script>'
    assert adapter_tag in popup_html
    assert popup_tag in popup_html
    assert popup_html.index(adapter_tag) < popup_html.index(popup_tag)


def test_popup_uses_browser_api_directly() -> None:
    popup_js = read_text("popup.js")
    assert "const browserApi = browser;" in popup_js
    assert "typeof browser" not in popup_js
    assert " chrome" not in popup_js
