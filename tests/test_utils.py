"""Smoke tests for the minimal discripper helpers."""

import pytest

from discripper import ensure_positive


def test_ensure_positive_accepts_non_negative_values():
    assert ensure_positive(0) == 0
    assert ensure_positive(3) == 3
    assert ensure_positive(2.5) == 2.5


def test_ensure_positive_rejects_negative_values():
    with pytest.raises(ValueError):
        ensure_positive(-1)
