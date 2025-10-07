# Codex Control Plane — Final Readiness Checklist ✅

Use this single checklist to certify a repo is **Codex-ready**. Check every box before first use.

> Scope: structure, docs, task system, PRD-driven tokens, local gates, comms, and (optional) CI quality bars.

---

## 0) Repo Identity & PRD Contract

- [ ] **PRD.md present** at repo root and up to date.
- [ ] **Phase 0.2** (in `0-work-flow.md`) auto-extracts:
  - [ ] `{PROJECT_NAME}`
  - [ ] `{PROJECT_SLUG}`
  - [ ] `{ENTRYPOINT}`
  - [ ] `{CONFIG_PATH}`
- [ ] All prompts, docs, and tasks **reference tokens** (no hard-coded names).
- [ ] A minimal **README** at root explains how to run the project and points to `.codex/`.

---

## 1) Core `.codex/` Structure

- [ ] `.codex/README.md` explains purpose/structure/usage.
- [ ] `.codex/AGENTS.md` defines roles, status signals, DoD, and the Team Communication header.
- [ ] `.codex/modes/` exists with current role guides:
  - [ ] `CODER.md`
  - [ ] `REVIEWER.md`
  - [ ] `AUDITOR.md`
  - [ ] `TASKMASTER.md`
  - [ ] `BLOGGER.md`
  - [ ] `SWARMMANAGER.md`
- [ ] `.codex/instructions/` contains:
  - [ ] `TASK_TEMPLATE.md` (front-matter + acceptance/evidence)
  - [ ] `LOCAL_GATES.md` (repo-specific commands take precedence)
- [ ] `.codex/tasks/README.md` exists (folder may be empty initially).
- [ ] `.codex/reviews/README.md` exists and correctly describes **reviews** (not audits).
- [ ] `.codex/audit/README.md` exists and correctly describes **audits**.
- [ ] `.codex/notes/` includes at least:
  - [ ] `codex-quick-start.md`
  - [ ] `reviewer-mode-cheat-sheet.md`
  - [ ] `swarmmanager-topic.md`

---

## 2) Roles & Communication Sanity

- [ ] **Status signals** documented and adopted:
  - `[CLAIM] [START] [WIP] [BLOCKED] [NEED-INFO] [REVIEW-REQUEST] [DONE] [UNCLAIM] [ESCALATE]`
- [ ] **Regex** for status line is present and copy/pasteable:
  - `^\[(CLAIM|START|WIP|BLOCKED|NEED-INFO|REVIEW-REQUEST|DONE|UNCLAIM|ESCALATE)\]\b`
- [ ] **Team Communication Command** header is documented in `AGENTS.md`.

---

## 3) Task System Alignment

- [ ] Root `TASKS.md` exists and is **phase-ordered** (`## Phase N – Title`) with single-line checkboxes.
- [ ] Task IDs in `TASKS.md` use the format `[#P<N>-T<M>]`.
- [ ] `.codex/tasks/*` files:
  - [ ] Follow `TASK_TEMPLATE.md` front-matter and sections.
  - [ ] Use **hash-prefixed filenames**: `a1b2c3d4-short-slug.md`.
  - [ ] Include **acceptance** and **evidence** expectations.
- [ ] `AGENTS.md` explicitly states tasks must derive identifiers from Phase 0.2 tokens.

---

## 4) Local Verification Gates (Developers)

- [ ] `LOCAL_GATES.md` matches **this repo’s** toolchain (commands are correct here, not generic).
- [ ] Local commands succeed on a fresh clone:
  - [ ] Install step
  - [ ] Lint
  - [ ] Tests with coverage threshold
- [ ] Coders know to paste **trimmed transcripts** with `[REVIEW-REQUEST]`.

---

## 5) Review & Audit Flows

- [ ] **Reviewer flow** documented (notes → `.codex/reviews/`, follow-up TMT tasks).
- [ ] **Auditor flow** documented (reports → `.codex/audit/`, PASS/FAILED at end).
- [ ] Filename conventions enforced:
  - [ ] Reviews: `<8hex>-<summary>.review.md` (or similar)
  - [ ] Audits: `<8hex>-<summary>.audit.md`
- [ ] Examples exist or are referenced in the READMEs.

---

## 6) Swarm Manager & Automation (Optional but Recommended)

- [ ] `swarmmanager-topic.md` includes **current selectors**, workflows, and known issues.
- [ ] Playwright can open Codex UI, select env/branch, and submit a task with **Code** (not Ask).
- [ ] Session logs are appended to `.codex/notes/`.

---

## 7) CI & Quality Bars (Optional but Strongly Recommended)

- [ ] CI mirrors `LOCAL_GATES.md` (same tools/thresholds).
- [ ] Coverage threshold (e.g., **≥ 80%**) enforced in CI.
- [ ] PR template references `.codex/tasks/` file and **evidence** checklist.
- [ ] Commit convention `[TYPE] Title` documented and used.

---

## 8) Consistency & Drift Checks

- [ ] No contradictions between:
  - [ ] `.codex/README.md` ↔ `AGENTS.md`
  - [ ] Mode guides ↔ `LOCAL_GATES.md`
  - [ ] Reviewer/Auditor READMEs ↔ their actual roles
- [ ] All internal links resolve (paths correct).
- [ ] No hard-coded project names where tokens should be used.

---

## 9) First-Run Dry-Run

- [ ] Create a **sample task** in `.codex/tasks/` via Task Master (hash + slug).
- [ ] Coder executes it locally, passes **local gates**, and opens a PR.
- [ ] Reviewer files a review note; Auditor files an audit report.
- [ ] Close the loop with `[DONE]` and verify the Team Communication header appears in the thread.

---

### ✅ Pass Condition
All required boxes checked (Sections 0–5 & 8–9). Optional sections (6–7) recommended for production confidence.


