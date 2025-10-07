Read `PRD.md` and `TASKS.md`. Pick the **first unchecked** item and implement it with the **smallest safe diff**. Add tests and update `TASKS.md` when done.

> Control-plane location: `.codex/instructions/`  
> Runtime code lives under `src/` (do not place runtime code in `.codex/`)

---

## 🎯 Purpose
Keep delivery fast and predictable: one task at a time, tiny diffs, tests first, proof via local gates, and machine-parseable updates to `TASKS.md`.

---

## 🚦 Rules of Engagement

1. **Follow the list order**  
   Work strictly on the **first** `- [ ]` line in `TASKS.md`. Do not resequence phases without updating the plan.
2. **Scope to the acceptance check**  
   Touch only what’s required to satisfy the task’s acceptance check.
3. **Honor stable IDs**  
   Every task ends with an ID like `[#P<N>-T<M>]`. Never change or reuse IDs.  
   When done, flip `- [ ]` → `- [x]` for **that exact line** only.
4. **Docs with code**  
   If behavior changes, update README/config docs in the **same** PR.
5. **Local gates first**  
   Run `.codex/instructions/LOCAL_GATES.md` exactly before asking for review.

---

## 🔁 Workflow (each task)

1. **Claim**
```

[CLAIM] <#P?-T?> <short task title>

````
2. **Implement minimal change**  
Keep the diff as small as possible; no drive-by refactors.
3. **Add/adjust tests**  
Tests must prove the acceptance check. Prefer deterministic unit tests.
4. **Run local gates** (from repo root; see LOCAL_GATES for the exact commands)  
- Install deps  
- Lint with ruff  
- Run pytest with coverage threshold  
5. **Open PR**  
Link the task ID in the title/description.  
6. **Request review** using the template below.  
7. **Flip the checkbox** in `TASKS.md` (same ID) after you’ve got green local gates and opened the PR.

---

## 🧪 Local Verification (must pass before review)

Use **the exact commands** in `.codex/instructions/LOCAL_GATES.md`. Typical example (your repo may differ; the gates file is the source of truth):

```bash
pip install -e .
ruff check .
pytest -q --cov=src --cov-fail-under=80
````

Include the trimmed transcripts with your review request.

---

## 🏷️ Status Signals (required prefix)

Use one of these at the **start** of any task/PR comment:

* `[CLAIM]` — taking the task
* `[START]` — work has begun
* `[WIP]` — progress update
* `[BLOCKED]` — specific blocker + your ask
* `[NEED-INFO]` — targeted question
* `[REVIEW-REQUEST]` — ready for review (include evidence)
* `[DONE]` — acceptance checks pass and PR merged
* `[UNCLAIM]` — releasing ownership
* `[ESCALATE]` — Task Master decision needed

**Regex (must match line 1):**

```
^\[(CLAIM|START|WIP|BLOCKED|NEED-INFO|REVIEW-REQUEST|DONE|UNCLAIM|ESCALATE)\]\b
```

---

## 📨 Review Request Template (paste in PR/comment)

```
[REVIEW-REQUEST] <#P?-T?> <task title>
evidence:
- local gates: OK (install/lint/tests)  ← attach trimmed transcripts
- tests: <N passed>, coverage: <XX%>
links:
- PR: <url>  (branch: <name>)
notes:
- scope kept minimal; follow-ups (if any): <bullets or “none”>
```

---

## ✅ Definition of Done (Dev)

1. Local gates pass (per `.codex/instructions/LOCAL_GATES.md`).
2. Code + tests + docs updated **together**.
3. PR opened; `[REVIEW-REQUEST]` posted with evidence.
4. CI green on target branch.
5. Task acceptance check satisfied; `TASKS.md` line flipped to `- [x]` (same ID).
6. Feedback addressed; PR merged.

---

## 🧾 Commit & PR Conventions

* **Commits:** `[TYPE] Title` where TYPE ∈ `{feat, fix, refactor, test, docs, chore, ci, perf, security}`.
* **PR title:** `<#P?-T?> <short title>` (include the stable ID).
* **PR body:** summary, risks/rollback, and link to `TASKS.md` line.

---

## 🧱 Blockers & Escalation

* If blocked ≥30 minutes, post:

  ```
  [BLOCKED] <#P?-T?> <one-line cause>
  ask:
  - <specific decision or info needed>
  ```
* If no response or requires prioritization:
  `[ESCALATE] <#P?-T?> <what needs a Task Master call>`

---

## ♻️ Out-of-scope Cleanups

* Micro-refactors allowed **only** when essential to satisfy the acceptance check and ≤ ~80 LOC touched.
* Larger refactors: create a new planning/cleanup task in `TASKS.md` (do **not** mix into this PR).

---

## 📌 After Merge

* Ensure `TASKS.md` shows `- [x]` for the completed line (same ID).
* If the work enables downstream tasks, leave a short `[DONE]` note with any follow-ups.

```

---

### Quick checks/corrections after you add it
- **Path** is exactly `.codex/instructions/3-dev_process.md`.
- **LOCAL_GATES reference** exists at `.codex/instructions/LOCAL_GATES.md` and reflects your repo’s real commands.
- **Regex** is unmodified (automation depends on it).
- **No hardcoded project names** inside—everything is generic and PRD-driven.

When this is committed, say “next file: plan-mode-guide” or tell me which file you want next.
```
