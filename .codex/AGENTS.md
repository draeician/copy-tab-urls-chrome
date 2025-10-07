# Codex Agents & Communication Guide

This file defines how contributors coordinate work in this repository using ChatGPT Codex and GitHub. It standardizes roles, status signals, and message formats so work is traceable, auditable, and parallelizable across any project.

---

## 1) Roles and source docs

Roles map to mode guides in `.codex/modes/`. Read your mode before starting. Not all modes are used every time, but all are available.

* Task Master → `.codex/modes/TASKMASTER.md`
* Coder → `.codex/modes/CODER.md`
* Reviewer → `.codex/modes/REVIEWER.md`
* Auditor → `.codex/modes/AUDITOR.md`
* Blogger → `.codex/modes/BLOGGER.md`
* Swarm Manager → `.codex/modes/SWARMMANAGER.md`

### PRD & TASKS Contract (must follow)

* Agents must derive identifiers from `0-work-flow.md` **Phase 0.2** output: `{PROJECT_NAME}`, `{PROJECT_SLUG}`, `{ENTRYPOINT}`, `{CONFIG_PATH}`. Do **not** hard-code names.
* Agents must honor the **`TASKS.md` Format Contract** (see `Tasks Seed + Prompts`):

  * Phases are level-2 headings: `## Phase N – Title` (contiguous N starting at 1)
  * Tasks are single-line checkboxes `- [ ]` / `- [x]` (no nested bullets)
  * Each task ends with a stable ID `[#P<N>-T<M>]`
  * Tasks include a brief acceptance check in parentheses

Tasks live in **`.codex/tasks/`** with random hash prefixes. Each task includes role, deliverables, and acceptance checks. Prefer the YAML front-matter template in `.codex/instructions/TASK_TEMPLATE.md`.

---

## 2) Ownership model

* **Self-selection by role:** Coders pick tasks from `.codex/tasks/` that match their role and skills.
* **Tier gating:** If a tier is active, only pick tasks from that tier. The current tier is noted in `.codex/notes/ACTIVE_TIER.md` when used.
* **One agent per task at a time:** Use `[CLAIM]` to take it. If you stop or hand off, post `[UNCLAIM]`.

---

## 3) Status signals (parseable)

Use these bracketed signals at the start of any update in Codex task threads, PRs, or issue comments.

* `[CLAIM]` I am taking this task
* `[START]` Work has begun
* `[WIP]` Progress update
* `[BLOCKED]` Waiting on something
* `[NEED-INFO]` Ask a question to proceed
* `[REVIEW-REQUEST]` Ready for review
* `[DONE]` Work is complete per acceptance checks
* `[UNCLAIM]` Releasing ownership
* `[ESCALATE]` Needs Task Master decision

**Regex (must be first line):**

```
^\[(CLAIM|START|WIP|BLOCKED|NEED-INFO|REVIEW-REQUEST|DONE|UNCLAIM|ESCALATE)\]\b
```

Keep updates concise, action oriented, and link evidence.

---

## 4) Team Communication Command (standard header)

Use this header at the top of any Codex/GitHub comment to keep automation stable.

```
[TEAM-COMM] <purpose>
task: .codex/tasks/<hash>-<slug>.md
role: <Task Master|Coder|Reviewer|Auditor|Blogger|Swarm Manager>
status: <CLAIM|START|WIP|BLOCKED|NEED-INFO|REVIEW-REQUEST|DONE|UNCLAIM|ESCALATE>
links: <PR # / commit / artifact URLs>
notes: <one-line summary>
```

---

## 5) Where to post

**In ChatGPT Codex UI**

1. Open the task.
2. Use the composer at the bottom: **“Request changes or ask a question”**.
3. Prefix your message with a status signal and submit with **Code**, not Ask.

**In GitHub**

* Use the same status signals in PR descriptions and comments.
* Reference the task file path and hash.

---

## 6) Update templates

**Claim**

```
[CLAIM] <task-title>
repo: <org/repo@branch>
actor: @handle  role: <Role>
task-file: .codex/tasks/<hash>-<slug>.md
start-window: <start → ETA>
plan:
- <step 1>
- <step 2>
```

**WIP**

```
[WIP] <task-title>
done:
- <bullets>
next:
- <bullets>
risks:
- <bullets>
```

**Blocked**

```
[BLOCKED] <task-title>
blocker:
- <what’s blocking>
ask:
- <specific question>
```

**Review request**

```
[REVIEW-REQUEST] <task-title>
evidence:
- PR #<id> (<summary>)
- Local gates: OK (see transcript)
ask:
- <what you want reviewed>
```

**Done**

```
[DONE] <task-title>
validation:
- All acceptance checks pass
links:
- PR #<id> merged
- Test report / artifacts
```

---

## 7) Global Definition of Done

A task is **Done** only if:

1. All acceptance checks in the task file pass.
2. Code, tests, and docs updated together (if applicable).
3. Local verification passes (commands defined by repo; see `.codex/instructions/LOCAL_GATES.md`).
4. CI is green on target branch after PR.
5. Reviewer or Auditor clears it if required by the task.
6. The corresponding `TASKS.md` item is checked `[x]` and the task file is updated/moved per repo rules.

---

## 8) Commit & PR conventions

* Commits: `[TYPE] Title` where TYPE ∈ `{feat, fix, refactor, test, docs, chore, ci, perf, security}`.
* PR must link the task file path and summarize changes, risks, rollback, and evidence.

---

## 9) Escalation ladder

1. Ask in the task thread with `[NEED-INFO]`.
2. If no response, post `[ESCALATE]` tagging Task Master with the specific question.
3. If still blocked, create a Reviewer or Auditor follow-up per mode guide and link it back.

---

## 10) Quick start for coders

1. Read your mode guide and spec sections relevant to your task.
2. Pick a task from `.codex/tasks/` that matches your role.
3. Post `[CLAIM]` with the task path and plan.
4. Ship small PRs tied to the task. Keep tests green.
5. Post `[REVIEW-REQUEST]` with evidence. Then `[DONE]` when accepted.

---

## 11) Interop with Swarm Manager

* Swarm Manager actions in Codex UI must mirror artifacts back into the repo:

  * Generated tasks → `.codex/tasks/`
  * Logs/notes → `.codex/notes/swarmmanager-*`
* Use the **Team Communication Command** header in any mirrored notes.

---

## 12) Safety notes for public comms

* Keep internal planning/chain-of-thought private. Publish only final conclusions.
