"""Minimal utilities for repository tooling checks."""

from __future__ import annotations

__all__ = ["ensure_positive"]


def ensure_positive(value: int | float) -> int | float:
    """Return *value* if it is positive, otherwise raise ``ValueError``.

    The helper is intentionally tiny so that repository tooling commands have a
    concrete module to exercise during the automated gates.
    """

    if value < 0:
        raise ValueError("value must be non-negative")
    return value
