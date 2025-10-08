from pathlib import Path


def load_popup_html() -> str:
    return Path("popup.html").read_text(encoding="utf-8")


def test_copy_buttons_present():
    html = load_popup_html()
    assert 'id="copyCurrentButton"' in html
    assert 'data-default-text="Copy Current Window"' in html
    assert 'id="copyAllButton"' in html
    assert 'data-default-text="Copy All Windows"' in html


def test_open_in_new_window_toggle_present():
    html = load_popup_html()
    assert 'id="openInNewWindowToggle"' in html
    assert 'Open in a new window' in html
    assert 'Applies to restore and clipboard actions.' in html


def test_status_regions_are_accessible():
    html = load_popup_html()
    assert 'id="message" role="status" aria-live="polite"' in html
    assert 'id="stats" aria-live="polite"' in html
