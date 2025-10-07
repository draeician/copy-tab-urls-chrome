# Swarm Manager — Automation Notes & Playbook

This file is a **living log and reference** for contributors working in [Swarm Manager Mode](../modes/SWAMMANAGER.md). It captures key automation details, common selectors, troubleshooting steps, and session notes for orchestrating tasks in the ChatGPT Codex UI using Playwright.

> 📌 Swarm Managers **never modify repository files directly** — they operate through the Codex UI and document all actions here.

---

## 🧭 Purpose

* Provide a single place for automation-related knowledge.
* Record Playwright selectors, workflows, and known issues.
* Document session logs and lessons learned.
* Help future Swarm Managers quickly adapt to UI or flow changes.

---

## 🧰 Core Workflow Reference

### 1. Launch & Auth

* Start Playwright in **headed mode** for easier debugging.
* Navigate to [https://chatgpt.com/codex](https://chatgpt.com/codex).
* Pause if manual login is required.

### 2. Environment Selection

* Use the environment selector dropdown.
* Example selector: `select[data-testid="environment-select"]`
* Choose repo (e.g., `Midori-AI-OSS/discripper`).

### 3. Branch Selection

* Selector: `select[data-testid="branch-select"]`
* Choose branch (e.g., `main` or `ver2`).

### 4. Task Creation

* Composer selector: `textarea[data-testid="task-composer"]`
* Enter task (see templates in [SWARMMANAGER.md](../modes/SWARMMANAGER.md)).
* Click the **Code** button (`button[data-testid="submit-code"]`).

### 5. Verification

* Criteria for **DOING**:

  * Task card shows “Working on your task” and spinner.
* Criteria for **DONE**:

  * Task card shows `+XX -YY` diff summary.
  * Spinner is gone.

### 6. Follow-Up

* Use task UI’s bottom-left composer to post follow-up instructions.
* Always prefix with `[CLAIM]`, `[WIP]`, `[REVIEW-REQUEST]`, etc.

---

## 🪶 Common Selectors

| Action               | Selector                                   |
| -------------------- | ------------------------------------------ |
| Task Composer        | `textarea[data-testid="task-composer"]`    |
| Code Submit Button   | `button[data-testid="submit-code"]`        |
| Environment Dropdown | `select[data-testid="environment-select"]` |
| Branch Dropdown      | `select[data-testid="branch-select"]`      |
| Go Back to Tasks     | `button[data-testid="back-to-tasks"]`      |
| Task Card Title      | `div[data-testid="task-title"]`            |
| Spinner              | `div[data-testid="spinner"]`               |

> 🧪 These selectors may change as the UI evolves — always validate them during sessions and update this file.

---

## 🧠 Troubleshooting Notes

* 🧱 **Login screen stuck:** Restart Playwright session and manually authenticate before resuming automation.
* 🔄 **Environment not loading:** Clear session cookies or run `context.clearCookies()` in Playwright before retrying.
* ⏳ **Tasks not appearing:** Refresh or poll every 5 seconds. Some delays occur with long-running Codex tasks.
* 🪲 **Selectors changed:** Inspect UI with DevTools and update selectors here immediately.

---

## 📜 Session Log (Examples)

### Session: 2025-10-05 – Initial discripper Setup

* ✅ Opened Codex UI and authenticated manually.
* ✅ Selected repo `Midori-AI-OSS/discripper` and branch `main`.
* ✅ Submitted Task: “Generate TASKS.md from PRD.md.”
* ✅ Verified spinner and `+143 -0` diff.
* 🧪 Posted follow-up: `[REVIEW-REQUEST] Initial task list ready.`
* 📓 Notes: Environment selector changed from `#env-select` → `data-testid="environment-select"`.

---

## 🧰 Tips for Future Swarm Managers

* 🧪 Always test selectors at the start of a session.
* 🪶 Keep session logs updated after each major automation run.
* 📑 Link related task hashes and audit reports for traceability.
* 🔁 Review this file before each automation session to catch recent changes.

---

> 🧠 This file is a **living document** — update it after each significant Playwright run or Codex UI change to keep autom

