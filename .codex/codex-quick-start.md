# Codex Quick Start — Contributor Guide

Welcome to the **Codex Control Plane** for this repository. This quick start is your guide to understanding how work is defined, executed, reviewed, and automated using the `.codex/` system.

---

## 🧭 1. Understand the Roles

Codex organizes work around distinct roles. Each has its own guide in `.codex/modes/`:

| Role              | Purpose                                                                      |
| ----------------- | ---------------------------------------------------------------------------- |
| **Task Master**   | Creates actionable tasks for contributors.                                   |
| **Coder**         | Implements tasks in code, following local gates.                             |
| **Reviewer**      | Audits documentation and creates follow-up tasks.                            |
| **Auditor**       | Performs deep technical reviews (security, perf, maintainability).           |
| **Blogger**       | Communicates recent changes externally (social posts, blog).                 |
| **Swarm Manager** | Automates task creation and orchestration using Playwright and the Codex UI. |

👉 Start by reading [`AGENTS.md`](../AGENTS.md) and your role’s mode file in `.codex/modes/`.

---

## 📋 2. Pick a Task

Tasks live in `.codex/tasks/` and follow the format defined in [`TASK_TEMPLATE.md`](../instructions/TASK_TEMPLATE.md). Each task file contains:

* A unique ID and phase reference
* Role assignment
* Acceptance checks and evidence expectations
* Context and plan

To claim a task:

1. Choose one matching your role.
2. Comment `[CLAIM]` in the task thread.
3. Post `[START]` when you begin work.

---

## 🧪 3. Run Local Gates (Coders Only)

Before requesting a review, **Coders must pass all local verification steps** defined in [`LOCAL_GATES.md`](../instructions/LOCAL_GATES.md):

```bash
pip install -e .
ruff check .
pytest -q --cov=src --cov-fail-under=80
```

Include the command results in your `[REVIEW-REQUEST]` comment.

---

## 🔍 4. Review and Audit

* **Reviewers** inspect documentation, workflows, and configs for drift. Findings go into `.codex/reviews/`.
* **Auditors** perform deep technical reviews, storing reports in `.codex/audit/`.
* Any discrepancies trigger new tasks in `.codex/tasks/`.

Start with [`reviewer-mode-cheat-sheet.md`](./reviewer-mode-cheat-sheet.md) to align with existing standards.

---

## 🪶 5. Status Signals

Use these bracketed signals at the start of any comment or update:

* `[CLAIM]` — Taking the task
* `[START]` — Work has begun
* `[WIP]` — Progress update
* `[BLOCKED]` — Waiting for input
* `[NEED-INFO]` — Asking a question
* `[REVIEW-REQUEST]` — Ready for review
* `[DONE]` — Work complete
* `[UNCLAIM]` — Releasing ownership
* `[ESCALATE]` — Needs Task Master input

---

## 🧪 6. End-to-End Flow

1. **Task Master** creates tasks → `.codex/tasks/`
2. **Coder** implements them → passes local gates
3. **Reviewer** checks docs → adds notes to `.codex/reviews/`
4. **Auditor** performs deeper review → saves to `.codex/audit/`
5. **Blogger** communicates changes → posts summaries
6. **Swarm Manager** automates orchestration → logs in `.codex/notes/`

---

## 📌 Tips for Success

* Keep tasks small and focused. Large work should be split into multiple tasks.
* Always reference the PRD and `TASKS.md` when making decisions.
* Use hash prefixes (`openssl rand -hex 4`) for tasks, audits, and review files.
* Treat `.codex/` as **mission control** — it defines *how* work happens.

---

📚 For deeper guidance, see:

* [`AGENTS.md`](../AGENTS.md)
* [`TASK_TEMPLATE.md`](../instructions/TASK_TEMPLATE.md)
* [`reviewer-mode-cheat-sheet.md`](./reviewer-mode-cheat-sheet.md)
* [`LOCAL_GATES.md`](../instructions/LOCAL_GATES.md)

> 🧠 Once you’re comfortable with this workflow, you can onboard new contributors just by pointing them to this Quick Start.

