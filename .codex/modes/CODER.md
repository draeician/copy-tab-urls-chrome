# Coder Mode

> This guide defines how Coders work in the repo. It adds a required **Local Test Verification** gate so common CI failures are caught before PRs.

## Purpose

Coders implement tasks from `.codex/tasks/`, producing clear, maintainable code with tests and docs that pass local verification and CI.

## Scope

* Implement only what the task describes. If you discover new requirements, request a follow-up task or post a `[CHANGE-REQUEST]` in the task thread.
* Keep changes small and reviewable. Update docs alongside code.

## Tooling (Python)

* Use **uv** for environments and commands **unless this repo defines custom gates** (see below).
* Lint: **ruff**
* Types: **mypy**
* Tests: **pytest** with coverage
* Project uses **src/** layout.

---

## Local Test Verification (REQUIRED)

Before you open a PR or post `[REVIEW-REQUEST]`, you **must** run the exact CI-equivalent commands locally and ensure they pass.

If the repo defines `.codex/instructions/LOCAL_GATES.md`, follow that file instead. Otherwise, defaults:

```bash
uv sync
uv run ruff check .
uv run mypy src
uv run pytest --cov=src --cov-fail-under=80
```

If any step fails, fix it before requesting review. Do **not** rely on CI to find these issues.

### Src layout import gotcha

If tests cannot import your top-level package, ensure `pyproject.toml` contains:

```toml
[tool.pytest.ini_options]
addopts = "-q"
pythonpath = ["src"]
```

---

## Review Request Evidence (REQUIRED)

When you are ready for review, post a comment in the task thread starting with `[REVIEW-REQUEST]` and include:

* Exact command transcript (trimmed) for each local gate above (or the repo-specific gates).
* Python and tool versions:

  ```bash
  python --version
  uv --version
  ```
* A brief test summary (number of tests, coverage %).
* Any known follow-ups or limitations.

**Template:**

```
[REVIEW-REQUEST] <task-id and title>
local-gates:
- gates : OK (see transcript)
env:
- Python 3.11.x, uv <ver>
notes:
- <optional items or TODOs>
```

---

## Definition of Done (for Coders)

A task is **Done** only if:

1. Local Test Verification passes (repo gates or defaults).
2. Code + tests + docs updated together.
3. You posted a `[REVIEW-REQUEST]` with the evidence above.
4. CI passes after PR is opened.
5. Any task-specific acceptance checks are satisfied.

---

## Workflow Checklist

1. Read the task (`.codex/tasks/<hash>-...md`) and relevant spec/notes.
2. Create or update code under `src/<package>/...` and tests under `tests/...`.
3. Keep dependencies minimal; update `pyproject.toml` when needed.
4. Run **Local Test Verification** until green.
5. Open PR; link the task file in the description.
6. Post **[REVIEW-REQUEST]** with evidence.
7. Address review feedback; keep green locally and in CI.

---

## Commit & PR Conventions

* Commits: `[TYPE] Title` where TYPE ∈ {feat, fix, refactor, test, docs, chore, ci, perf, security}.
* PR must link the task file path and summarize changes, risks, and rollback.

---

## Communication

Use the status signals from `AGENTS.md` in task threads:
`[CLAIM]`, `[START]`, `[WIP]`, `[BLOCKED]`, `[NEED-INFO]`, `[REVIEW-REQUEST]`, `[DONE]`, `[UNCLAIM]`, `[ESCALATE]`.

