This version is complete and fully wired to the three instructions files we’ve already built.

---

````markdown
# 🧭 Codex Planning Mode — `/plan` Guide (PRD-Driven, Final)

This guide describes how to execute the **/plan** step — transforming `PRD.md` into a validated, machine-readable `TASKS.md` and preparing the repo for development.

> 📌 Source of truth: `PRD.md`  
> 🧠 Control prompts:  
> - `.codex/instructions/0-work-flow.md` (Phase 0: derive identifiers)  
> - `.codex/instructions/1-seed-task-list.md` (seed generator + format contract)  
> - `.codex/instructions/3-dev_process.md` (developer loop)

---

## 🎯 Purpose

The `/plan` stage is where your PRD becomes executable. It:

- Produces the **core roadmap** (`TASKS.md`) that drives all future automation.
- Locks in the stable **phase/task ID scheme** (e.g., `[#P3-T2]`).
- Establishes the control plane agents will follow for every task thereafter.
- Ensures the repo is **Codex-ready** before code is written.

---

## 🧩 Prerequisites

- ✅ `PRD.md` exists and reflects your current product spec.  
- ✅ `.codex/instructions/` contains:
  - `0-work-flow.md`
  - `1-seed-task-list.md`
  - `3-dev_process.md`
- ✅ `.codex/instructions/LOCAL_GATES.md` describes your install/lint/test commands.  
- ✅ `.codex/` base folders exist: `tasks/`, `reviews/`, `audit/`, `notes/`.

---

## 🪜 Step 1 — Derive Tokens (Phase 0)

Run **Phase 0.1** and **0.2** from `.codex/instructions/0-work-flow.md` inside Cursor or Codex.

The agent must output the following four identifiers (exact YAML, no commentary):

```yaml
PROJECT_NAME: "<value>"
PROJECT_SLUG: "<value>"
ENTRYPOINT: "<value>"
CONFIG_PATH: "<value>"
````

These are the canonical tokens used throughout tasks, instructions, and code.
⚠️ If `PRD.md` changes later, **rerun this step** before anything else.

---

## 📋 Step 2 — Generate `TASKS.md`

From `.codex/instructions/1-seed-task-list.md`, run the **Seed Generator Prompt** (Section 2).
This produces a full `TASKS.md` containing ~40–60 tasks organized by phase.

Requirements:

* ✅ Strictly follow the **Format Contract** (see Section 1 of `1-seed-task-list.md`).
* ✅ No nested tasks.
* ✅ Each task has a **stable ID** and **acceptance check**.
* ✅ Phases are sequential (`## Phase 1`, `## Phase 2`, etc.) with no gaps.

Save the result as:

```
TASKS.md   ← (repo root)
```

---

## 🔍 Step 3 — Lint and Validate

Run the **Lint Prompt** (Section 5 of `1-seed-task-list.md`) to check formatting:

* All phases sequential and numbered.
* No nested bullets.
* Every task ends with a valid `[#P<N>-T<M>]` ID.
* All tasks include acceptance checks.

✅ Apply the minimal diff the linter proposes until the file **passes**.

---

## 🧪 Step 4 — (Optional) Create First `.codex/tasks/*`

To bootstrap development, instantiate the first 4–6 tasks as `.codex/tasks/*.md` files using the `TASK_TEMPLATE.md` structure.

* File name: `openssl rand -hex 4` → `abcd1234-short-slug.md`
* Include **acceptance** and **evidence** blocks.
* Reference the original `TASKS.md` ID inside the file.

This step lets reviewers and coders begin working immediately.

---

## 🛠️ Step 5 — Enter the Dev Loop

Hand off to `.codex/instructions/3-dev_process.md`.

From here:

> “Read `PRD.md` and `TASKS.md`. Pick the **first unchecked** task. Implement it with the smallest possible diff. Add tests and update `TASKS.md` if complete.”

* Coders follow the local verification gates before `[REVIEW-REQUEST]`.
* PRs must reference the corresponding `[#P<N>-T<M>]` ID.

---

## 🔁 When the PRD Changes

Any time `PRD.md` changes significantly:

1. Re-run **Phase 0.2** to re-derive identifiers.
2. Use the **Resync Prompt** (Section 4 in `1-seed-task-list.md`) to rebuild `TASKS.md`.

✅ Preserve IDs for unchanged tasks.
✅ Assign new IDs to new or semantically different tasks.

---

## 📜 Done When

* `TASKS.md` exists, validates, and mirrors `PRD.md`.
* Optional `.codex/tasks/*.md` created for early tasks.
* Dev loop is ready to run.
* Review and audit flows (`.codex/reviews/`, `.codex/audit/`) are documented.

---

## 🧠 Quick Reference: Prompt Locations

| Action                  | File                                      | Section         |
| ----------------------- | ----------------------------------------- | --------------- |
| Derive tokens           | `.codex/instructions/0-work-flow.md`      | Phase 0.1 & 0.2 |
| Generate `TASKS.md`     | `.codex/instructions/1-seed-task-list.md` | Section 2       |
| Lint `TASKS.md`         | `.codex/instructions/1-seed-task-list.md` | Section 5       |
| Resync after PRD change | `.codex/instructions/1-seed-task-list.md` | Section 4       |
| Execute next task       | `.codex/instructions/3-dev_process.md`    | Full file       |

---

## ✅ Definition of “/plan done”

* All checkboxes in Sections 0–5 of `.codex/FINAL_READINESS_CHECKLIST.md` are checked.
* `TASKS.md` is machine-parseable and validated.
* Optional seed tasks exist in `.codex/tasks/`.
* Dev loop in `3-dev_process.md` is unblocked.

From here, your Codex control plane is ready to execute tasks continuously. 🚀

```

---

✅ **After adding this:**

- Make sure it’s saved as `.codex/notes/plan-mode-guide.md` (not in `/instructions/`).  
- Update any README links or references in `.codex/FINAL_READINESS_CHECKLIST.md` to point to this file.  
- Double-check that the 3 instruction files exist and are named exactly as referenced here.

---
