# 📋 TASKS.md — Seed Generator & Format Contract (PRD-Driven, Final)

This file provides: (1) a strict **format contract** for `TASKS.md` so agents never misparse nesting, (2) a **generic seed prompt** to generate the checklist from `PRD.md`, and (3) execution prompts to keep delivery tight and repeatable.

> Prereq: Run Phase 0.2 from `.codex/instructions/0-work-flow.md` to produce the YAML tokens `{PROJECT_NAME}`, `{PROJECT_SLUG}`, `{ENTRYPOINT}`, `{CONFIG_PATH}` before generating `TASKS.md`.

---

## 1) `TASKS.md` Format Contract (machine-parseable & phased)

**Rules (must-follow):**

1. The document contains **ordered phases** as level-2 headings: `## Phase N – <Title>` where `N` is an integer starting at 1 and increasing by 1 (no gaps).
2. Under each phase, every task is a **top-level checklist** line beginning with exactly `- [ ]` or `- [x]` (lowercase `x` only).
3. **No nested bullets** under any task. If you need subtasks, create separate checklist items.
4. Every task begins with an **imperative verb**, followed by a short title, and includes a concise **acceptance check** in parentheses (how the reviewer verifies).
5. Each task line ends with a **stable ID** in the form `[#P<N>-T<M>]` (phase N, task M), e.g., `[#P3-T2]`. IDs are unique across the file and never reused.
6. Optional explanatory text appears **after** a checklist line as a new paragraph starting with `> Note:` (no code fences unless essential).
7. Keep task lines ≤ 120 chars when possible.

**Example (conformant):**
```markdown
## Phase 3 – Config & CLI
- [ ] Implement config loader (verify default path `{CONFIG_PATH}`) [#P3-T1]
- [ ] Add CLI flags: --config, --verbose, --dry-run (flags override config values) [#P3-T2]
- [ ] Tests for CLI precedence (pytest passes, coverage reported) [#P3-T3]
````

---

## 2) Seed Generator Prompt (paste into Cursor/Codex)

> Read `PRD.md` and the Phase 0.2 YAML identifiers (`{PROJECT_NAME}`, `{PROJECT_SLUG}`, `{ENTRYPOINT}`, `{CONFIG_PATH}`).
> Generate a **detailed, actionable** `TASKS.md` following the **Format Contract** above. Create **40–60** tasks across clearly named phases that reflect the PRD. Each task must:
>
> * Be a **single-line** checklist beginning with `- [ ]` (no nested bullets)
> * Start with an **imperative verb** (Implement, Create, Add, Write, Test, Refactor, Document, etc.)
> * Include a concise **acceptance check** in parentheses (what I will run/see to verify)
> * End with a unique stable **ID** like `[#P<N>-T<M>]`
>
> **Phases to include** (adapt names/contents to the PRD as needed):
>
> 1. Project Setup & Scaffolding
> 2. Config & CLI
> 3. Core Inspection / Input Acquisition
> 4. Core Classification / Processing Logic
> 5. Execution / Pipeline / Output
> 6. Naming & Organization
> 7. Orchestration, Logging, Error Handling
> 8. Tests & Fixtures
> 9. Packaging & Install
> 10. Docs & Quickstart
> 11. Simulation / E2E Dry-Run
> 12. Optional / Deferred Features
> 13. Final QA & Acceptance
> 14. Validation Against PRD
>
> **Output exactly:** the full `TASKS.md` Markdown file **contents only** (no commentary).

---

## 3) Executor Prompt — Implement the Next Task

> Read `PRD.md`, Phase 0.2 identifiers, and `TASKS.md`.
> Find the **first unchecked** task (`- [ ]`) in order (across phases). Implement **only** that task with the **smallest safe diff**.
>
> **Deliverables:**
>
> 1. **Diff** of all changed files
> 2. **Tests** added/updated (show commands + results, e.g., `pytest -q`)
> 3. **Verification** instructions that match the task’s acceptance check
> 4. **Checklist update:** change that task to `- [x]` and keep its same ID
>
> Do not pick another task. Do not refactor unrelated code. Keep the change narrowly scoped to satisfy the acceptance check.

---

## 4) Resync Prompt — When PRD or Structure Changes

> Re-run Phase 0.2 to re-derive identifiers. Then read the updated `PRD.md`.
> **Rebuild** `TASKS.md` strictly following the Format Contract while **preserving existing IDs** for tasks that are still semantically the same. For changed/new tasks, assign new IDs at the end of their phase. Include only tasks required by the new PRD. Output the **full, updated** `TASKS.md`.

---

## 5) Lint Prompt — Validate `TASKS.md` Format

> Validate that `TASKS.md` meets the **Format Contract**:
>
> * All phases are `## Phase N – Title` with contiguous N starting at 1
> * All tasks are single-line checklist items with `- [ ]` or `- [x]`
> * **No nested bullets** are present
> * Each task ends with a valid ID `[#P<N>-T<M>]` and IDs are unique
> * Each task includes an acceptance check in parentheses
>
> Output a **pass/fail** summary and a **minimal diff** to fix any violations.

---

## 6) One-shot Momentum Prompt

> Read `PRD.md`, Phase 0.2 identifiers, and `TASKS.md`. Pick the **first unchecked** `- [ ]` task. Implement it with the smallest possible diff, add/adjust tests, and update `TASKS.md`. Show: (1) diff, (2) test results, (3) exact commands to verify. Keep scope limited to that task’s ID.

