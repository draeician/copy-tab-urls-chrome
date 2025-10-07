# Reviewer Mode — Cheat Sheet

This cheat sheet captures recurring preferences, rules, and quick references for reviewers. It exists to **speed up audits, unify review quality, and document evolving team standards** over time.

> 📌 Reviewers do **not** edit code or documentation — they report issues and generate follow-up tasks.

---

## 🧭 Review Workflow Quick Steps

1. **Prepare**

   * Read the relevant PRD and `TASKS.md`.
   * Skim `.codex/instructions/` and mode guides.
   * Review existing notes in `.codex/reviews/` for historical context.

2. **Audit Documents and Configs**

   * Check top-level `README.md` files for outdated info.
   * Review `.codex/` instructions, planning notes, and mode files.
   * Inspect `.github/` workflows and automation scripts.
   * Look for stale or missing references.

3. **Record Findings**

   * Create a new review note in `.codex/reviews/` with a random 8-hex prefix.
   * Include references (file paths, commit hashes, line numbers).
   * Clearly describe what’s wrong and why it matters.

4. **Escalate with Tasks**

   * For each actionable discrepancy, generate a `TMT-<hash>-<description>.md` in `.codex/tasks/`.
   * Include clear acceptance checks and evidence expectations.

5. **Close the Loop**

   * Re-review after coders address the issue.
   * Confirm that documentation or code changes resolve the original concern.

---

## ✅ Common Things to Check

* [ ] Top-level `README.md` matches current repo state.
* [ ] `.codex/instructions/` reflect the latest processes.
* [ ] `.codex/modes/` describe current agent behaviors.
* [ ] `TASKS.md` is in sync with implemented work.
* [ ] CI workflows and scripts are documented and functional.
* [ ] All referenced files and links exist and are correct.
* [ ] Documentation examples match actual CLI/API behavior.

---

## 🧪 Reviewer Tips

* 🔁 **Cross-reference**: Always compare documentation claims against code, scripts, or configs.
* 🪶 **Be concise but complete**: A good review note identifies the problem, explains why it matters, and suggests a next action.
* 📌 **Group related findings** into one note when appropriate, but split if they require different follow-up tasks.
* 🧰 **Use consistent tags** in review filenames (e.g., `-docs-`, `-config-`, `-workflow-`) for easier searching.
* 📑 **Link directly** to affected lines or commits in your review notes.

---

## 📂 Example Review Note Template

```markdown
# Review Note: Outdated Docs in CLI Usage Section

**File:** README.md
**Location:** Lines 42–67
**Issue:** CLI example references an old flag `--scan`, which was removed in v0.3.
**Impact:** Confuses new users and breaks setup instructions.
**Recommendation:** Update usage examples and link to the new `--analyze` flag.

---

Follow-up Task: `TMT-a1b2c3d4-update-readme-cli-flags.md`
```

---

## 📌 Notes

* This cheat sheet is a **living document** — reviewers should update it as new patterns, preferences, or recurring issues emerge.
* Keep the language clear and actionable.
* Reference this file in all new review notes to align with current team standards.

