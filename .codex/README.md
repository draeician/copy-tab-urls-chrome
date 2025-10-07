# Codex Control Plane

This directory contains all **ChatGPT Codex orchestration metadata** for this repository. It defines roles, workflows, quality gates, and communication patterns — enabling human and automated contributors to coordinate consistently.

> 📌 Everything inside `.codex/` is meta-infrastructure. It is not part of the runtime codebase but powers how work is defined, executed, audited, and documented.

---

## 📂 Directory Overview

| Folder / File     | Purpose                                                                                                                                              |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **AGENTS.md**     | Master coordination guide — defines roles, communication standards, status signals, and Definition of Done.                                          |
| **modes/**        | Per-role behavior guides (e.g., `CODER.md`, `REVIEWER.md`, `AUDITOR.md`, etc.). Each explains expectations, scope, and workflow for that role.       |
| **instructions/** | Templates and project-specific enforcement docs, such as `LOCAL_GATES.md` (required local checks) and `TASK_TEMPLATE.md` (task front-matter format). |
| **tasks/**        | All active and completed task files. Each maps to items in `TASKS.md` and follows the structure in `TASK_TEMPLATE.md`.                               |
| **audit/**        | Stores audit reports created by [Auditor Mode](modes/AUDITOR.md). These review deeper quality, security, and performance concerns.                   |
| **reviews/**      | Stores Reviewer notes documenting discrepancies, missing documentation, or follow-up needs.                                                          |
| **notes/**        | Long-lived reference material, preferences, and working knowledge (e.g., reviewer cheat sheets, swarm manager logs).                                 |

---

## 🧭 Workflow Summary

1. **Task Creation** – Task Masters write actionable tasks into `.codex/tasks/` following `TASK_TEMPLATE.md`.
2. **Task Execution** – Coders pick tasks, follow local gates from `LOCAL_GATES.md`, and implement work.
3. **Review & Audit** – Reviewers check documentation for drift (`.codex/reviews/`), Auditors conduct deeper technical reviews (`.codex/audit/`).
4. **Knowledge & Notes** – Long-term preferences, patterns, and automation logs are stored in `.codex/notes/`.
5. **Automation** – Swarm Managers orchestrate Codex tasks via Playwright and Codex UI, recording outcomes in `notes/`.

---

## 🪶 Best Practices

* Treat `.codex/` as **source of truth** for coordination, not runtime logic.
* Never commit runtime code here — only meta-process documentation and artifacts.
* Keep all filenames lowercase with dashes or underscores (no spaces).
* Use `openssl rand -hex 4` to generate hash prefixes for tasks, audits, and reviews.
* Update cheat sheets and instructions as processes evolve.

---

## 📌 Quick Start

* New contributor? Start with [`AGENTS.md`](./AGENTS.md).
* Writing tasks? See [`TASK_TEMPLATE.md`](./instructions/TASK_TEMPLATE.md).
* Running code locally? Follow [`LOCAL_GATES.md`](./instructions/LOCAL_GATES.md).
* Doing reviews? Begin with [`reviewer-mode-cheat-sheet.md`](./notes/reviewer-mode-cheat-sheet.md).

---

> 🧠 **Tip:** Think of `.codex/` as the "mission control" folder — it tells humans and AI agents *what to do*, *how to talk

