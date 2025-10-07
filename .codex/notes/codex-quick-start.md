# Codex Quick-Start Cheat Sheet

A one-page reference for working with the Codex workflow.

---

## Roles & Responsibilities

- **Task Master**  
  Creates tasks in `.codex/tasks/` (hash prefix, clear deliverables, acceptance).  
  Never edits code.

- **Coder**  
  Implements tasks. Runs local gates, opens PRs, posts `[REVIEW-REQUEST]`.  
  Must pass ruff, mypy, pytest with coverage ≥80%.

- **Reviewer**  
  Checks docs, configs, READMEs. Writes notes into `.codex/reviews/`.  
  Creates follow-up TMT tasks if needed.

- **Auditor**  
  Full compliance check: code, docs, commits, tests, standards.  
  Writes reports in `.codex/audit/`. Marks PASS/FAILED.

- **Swarm Manager**  
  Orchestrates Codex UI. Always submit with **Code** button (not Ask).  
  Manages task lifecycle in Codex web UI.

- **Blogger**  
  Summarizes recent changes for community posts. Writes into `.codex/blog/`.

---

## Workflow Loop

1. **Task Master** creates `.codex/tasks/<hash>-title.md`
2. **Coder** implements code + tests + docs
   - Run local gates:
     - `uv sync`
     - `uv run ruff check .`
     - `uv run mypy src`
     - `uv run pytest --cov=src --cov-fail-under=80`
   - Open PR
   - Post `[REVIEW-REQUEST]` with evidence
3. **Reviewer** audits docs/config → saves `.codex/reviews/…`
4. **Auditor** full audit → saves `.codex/audit/…`
5. **Swarm Manager** monitors UI, archives tasks, ensures PR merged
6. **Blogger** posts summaries after merges

---

## PR Conventions

- Commit: `[TYPE] Title` (feat, fix, refactor, test, docs, chore, ci, perf, security)  
- PR: link the task file, summarize changes + risks  
- After local gates are green → open PR → `[REVIEW-REQUEST]` evidence

---

## ⚠️ Important

- **Never use triple backtick code blocks in Codex prompts.**  
  Use plain text or indentation instead. Code fences break the UI.
- Tasks are short-lived. After merge, branches can be auto-deleted.
- Branch protection is not enforced on private/personal repos; rely on Codex gates.

---

## Example Coder Prompt (safe format)

Coder, please fix the mypy union-attr error in src/aether/memory/wal.py.

Requirements:
- Replace gzip.open with raw file + gzip.GzipFile(fileobj=raw).
- Fsync the raw handle, not the gzip object.
- Add a Protocol for _SupportsFileno if needed.

Acceptance:
- uv run ruff check . : OK
- uv run mypy src : OK
- uv run pytest --cov=src --cov-fail-under=80 : OK

---

## ASCII Flow

```

┌─────────────┐
│ Task Master │
└──────┬──────┘
│ creates task
▼
┌────────┐
│ Coder  │
└───┬────┘
│ PR + \[REVIEW-REQUEST]
▼
┌────────────┐
│ Reviewer   │
└────┬───────┘
│ notes / TMT tasks
▼
┌──────────┐
│ Auditor  │
└────┬─────┘
│ PASS/FAILED
▼
┌─────────────┐
│ SwarmMgr UI │
└────┬────────┘
│ archive/merge
▼
┌─────────┐
│ Blogger │
└─────────┘

```

---

## Prompt Examples (safe formats)

- **Task Master**  
  Task Master, please fully review all feedback, docs, code, issues, linting, and testing. Then create tasks for coders.

- **Coder**  
  Coder, pick a task from `.codex/tasks/` and implement it.  
  Coder, please do step 1 of the WAL atomic rotation task.

- **Reviewer**  
  Reviewer, please review the recent changes to docs and configs. Create TMT tasks for anything missing.

- **Auditor**  
  Auditor, please fully audit the work that was done. If complete, output PASS; if not, list findings and output FAILED.

- **Swarm Manager**  
  Swarm Manager, submit this task using the **Code** button, not Ask, and monitor until it shows DONE.

- **Blogger**  
  Blogger, write a short update summarizing the Tier-1 Memory Core completion and post it into `.codex/blog/`.

