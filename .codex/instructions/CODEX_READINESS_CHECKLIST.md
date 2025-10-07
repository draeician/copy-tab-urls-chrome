
# Codex Control Plane — Final Readiness Checklist ✅

Use this checklist to verify that your `.codex/` directory is **fully operational and ready for automation, collaboration, and CI integration**.

---

## 📁 1. Core Structure

* [ ] `.codex/AGENTS.md` — defines roles, signals, communication standards, and DoD.
* [ ] `.codex/modes/` — contains mode guides for all active roles:

  * [ ] `CODER.md`
  * [ ] `REVIEWER.md`
  * [ ] `AUDITOR.md`
  * [ ] `TASKMASTER.md`
  * [ ] `BLOGGER.md`
  * [ ] `SWARMMANAGER.md`
* [ ] `.codex/instructions/` — templates and enforcement files exist:

  * [ ] `TASK_TEMPLATE.md`
  * [ ] `LOCAL_GATES.md`
* [ ] `.codex/tasks/README.md` — present, even if no tasks yet.
* [ ] `.codex/audit/README.md` — present.
* [ ] `.codex/reviews/README.md` — present.
* [ ] `.codex/notes/` — contains quick-start docs and reference notes:

  * [ ] `codex-quick-start.md`
  * [ ] `reviewer-mode-cheat-sheet.md`
  * [ ] `swarmmanager-topic.md`

---

## 📜 2. Role Documentation Sanity Check

* [ ] Each mode file clearly defines:

  * [ ] Purpose
  * [ ] Guidelines
  * [ ] Typical actions
  * [ ] Communication patterns
* [ ] `AGENTS.md` references Phase 0.2 identifiers (`{PROJECT_NAME}`, `{PROJECT_SLUG}`, etc.).
* [ ] `AGENTS.md` specifies the **Team Communication Command** format and regex for status lines.
* [ ] All roles map to expected output directories (e.g., Auditor → `.codex/audit/`).

---

## ✅ 3. Task System Alignment

* [ ] `TASK_TEMPLATE.md` matches the current `TASKS.md` phase IDs (`P<N>-T<M>`).
* [ ] `.codex/tasks/` is empty or contains valid task files following the template.
* [ ] Each task includes:

  * [ ] Hash-prefixed filename (`abcd1234-task-name.md`)
  * [ ] Front-matter metadata
  * [ ] Acceptance checks
  * [ ] Evidence expectations
* [ ] `TASKS.md` exists at the repo root and is phase-ordered with `- [ ]` checkboxes.

---

## 🧪 4. Local Gates & Verification

* [ ] `LOCAL_GATES.md` exists and matches the repo’s toolchain.
* [ ] Commands in `LOCAL_GATES.md` succeed locally (`pip install -e .`, `ruff check .`, `pytest …`).
* [ ] Coders know to include command transcripts in `[REVIEW-REQUEST]` evidence.

---

## 📊 5. Review & Audit Flows

* [ ] `.codex/reviews/` accepts review notes with hash-prefixed filenames.
* [ ] `.codex/audit/` accepts audit reports with clear PASS/FAILED status.
* [ ] Reviewers and Auditors know how to spawn follow-up tasks (`TMT-<hash>-<description>.md`).

---

## 🧠 6. Communication & Signals

* [ ] Status signals `[CLAIM]`, `[START]`, `[WIP]`, `[BLOCKED]`, `[NEED-INFO]`, `[REVIEW-REQUEST]`, `[DONE]`, `[UNCLAIM]`, `[ESCALATE]` are documented and consistently used.
* [ ] `[TEAM-COMM]` header is supported and understood by contributors.
* [ ] Regex for valid status lines is documented:
  `^\[(CLAIM|START|WIP|BLOCKED|NEED-INFO|REVIEW-REQUEST|DONE|UNCLAIM|ESCALATE)\]\b`

---

## 🧰 7. Automation Readiness (Optional but Recommended)

* [ ] `swarmmanager-topic.md` contains recent Playwright selectors and known issues.
* [ ] Playwright script successfully opens Codex UI, selects environment and branch, and submits a task.
* [ ] Session logs are recorded in `.codex/notes/`.

---

## 📦 8. Optional Quality Gates

* [ ] Coverage ≥ 80% enforced locally and in CI.
* [ ] Linting and tests are part of GitHub Actions (or equivalent CI).
* [ ] PR templates reference `.codex/tasks/` task files and include evidence sections.
* [ ] Commit messages follow `[TYPE] Title` convention.

---

✅ **Pass Condition:**
If **all items** above are checked, your `.codex/` control plane is considered **production-ready** and can safely coordinate both human and automated contributors.

