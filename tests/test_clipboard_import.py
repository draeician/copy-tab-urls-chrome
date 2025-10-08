"""Tests for clipboard parsing behaviour in the background worker."""

from __future__ import annotations

import json
import os
import subprocess
from pathlib import Path
from typing import Any, Iterable

PROJECT_ROOT = Path(__file__).resolve().parent.parent
RUNNER_PATH = PROJECT_ROOT / "tests" / "helpers" / "run_parse_urls.js"


def parse_urls(value: Any) -> list[str]:
    """Invoke the background worker's ``parseUrls`` helper via Node.js."""

    env = os.environ.copy()
    env["INPUT_JSON"] = json.dumps(value)

    result = subprocess.run(
        ["node", str(RUNNER_PATH)],
        check=True,
        capture_output=True,
        text=True,
        env=env,
    )

    output = result.stdout.strip()
    return [] if not output else json.loads(output)


def assert_urls(parsed: Iterable[str], expected: Iterable[str]) -> None:
    assert list(parsed) == list(expected)


def test_newline_separated_text_filters_internal_protocols() -> None:
    parsed = parse_urls("https://example.com\nchrome://extensions\nhttps://openai.com")
    assert_urls(parsed, ["https://example.com/", "https://openai.com/"])


def test_json_array_input_filters_invalid_urls() -> None:
    parsed = parse_urls([
        "https://valid.test/one",
        "not a url",
        "about:blank",
        "https://valid.test/two",
    ])
    assert_urls(parsed, ["https://valid.test/one", "https://valid.test/two"])


def test_json_object_string_field_splits_lines() -> None:
    parsed = parse_urls({"urls": "https://a.test\nhttps://b.test"})
    assert_urls(parsed, ["https://a.test/", "https://b.test/"])


def test_json_string_input_is_treated_as_multiline_text() -> None:
    parsed = parse_urls("https://a.test\nhttps://b.test")
    assert_urls(parsed, ["https://a.test/", "https://b.test/"])


def test_serialised_json_string_is_split_into_multiple_urls() -> None:
    parsed = parse_urls('"https://a.test\\nhttps://b.test"')
    assert_urls(parsed, ["https://a.test/", "https://b.test/"])
