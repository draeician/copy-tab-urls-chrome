# Swarm Manager: Step-by-Step Guide for Codex System Automation

## Introduction

The Swarm Manager is responsible for orchestrating and automating task creation, monitoring, and verification in the ChatGPT Codex system only using Playwright. This guide provides a clear, repeatable process for Swarm Managers to follow, ensuring reliability, traceability, and robust automation.

> NOTE: Do not use repo files for this persona; this persona only uses this file and the files found in `.codex/notes`.
> NOTE: Do not check the repo for tasks; tasks are only found on the codex website, use Playwright to view them.

## Prerequisites

* Playwright installed and configured (headed mode recommended for UI verification).
* Access to [https://chatgpt.com/codex](https://chatgpt.com/codex) and required authentication (user handles login).
* Permissions to create and manage tasks in the target repositories.

## Swarm Manager Workflow

Follow these steps for any new task or automation cycle:

**Important:** When submitting a task to the Task Master (or any code-related or actionable development task), always click the `Code` button in the Codex UI, **not** the `Ask` button.

1. Launch Playwright and navigate to [https://chatgpt.com/codex](https://chatgpt.com/codex).
2. Select the environment and branch as required.
3. Compose and submit the task using role-specific templates (see below). Use **Code**, not Ask.
4. Verify task creation (status appears as 'Working on your task' with spinner).
5. Monitor task progress; refresh/poll as needed.
6. **Mirror artifacts back into the repo:**

   * Generated tasks → `.codex/tasks/`
   * Logs/notes → `.codex/notes/swarmmanager-*`
7. Document actions for traceability in `.codex/notes`.

### Task UI: Actionable Guide

* Use **'Go back to tasks'** to navigate.
* Verify task context (title, date, repo, branch).
* Use action buttons: Archive, Share, Create PR, git action menu, notifications.
* Submit follow-up prompts via **Request changes or ask a question** and send with **Code**.

## Role-Specific Task Templates

### Task Master

```
Task Master, fully review feedback, docs, code, issues, linting, and testing. Create actionable, non-overlapping tasks that can run in parallel.
```

### Coder

```
Coder, pick a task from the task folder and implement it. Keep the change small and testable.
```

### Auditor

```
Auditor, fully audit the work that was done. Produce a hashed audit file with PASS or FAILED at end.
```

## Team Communication Command

Use the standard header from `AGENTS.md` in any mirrored repo notes.

