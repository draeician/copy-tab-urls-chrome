Got it. We’ll go one file at a time, no canvas. I’ll give you the exact contents to paste, plus any corrections you should make in your repo before/after adding it.

# Step 0 — Make sure the folders exist

From the repo root:

```bash
mkdir -p .codex/instructions .codex/tasks .codex/reviews .codex/audit .codex/notes
```

---

# File 1: `.codex/instructions/0-work-flow.md`

## What this file is

The authoritative, PRD-driven workflow you (or Codex/Cursor) paste into the agent to prime it and derive identifiers, then scaffold work. It must be under **`.codex/instructions/`** so it’s clearly “control plane,” not runtime code.

## Corrections/consistency to watch for (do these once pasted)

* All **links/paths** inside point to `.codex/instructions/...` (not to repo root).
* The four identifiers must be produced **exactly** as YAML with those keys: `PROJECT_NAME`, `PROJECT_SLUG`, `ENTRYPOINT`, `CONFIG_PATH`.
* This doc **never** hardcodes your project’s specific name—everything is token-based.

## Paste this exact content:

````markdown
# 📜 0-work-flow.md – PRD-Driven Development Workflow (Final)

**Purpose:** This workflow is fully generic and driven **only by `PRD.md`**. Every step derives names, identifiers, tasks, and code decisions directly from `PRD.md`, requiring no manual editing beyond copy/pasting these prompts into Cursor or Codex.

> Paste these prompts **in order**. Each phase builds on the previous one.

---

# Phase 0 — Prime the Agent

## 0.1 System guardrails (paste once at the start)

> You are an expert Linux + Python CLI engineer. Treat `PRD.md` in the repo root as the **single source of truth**. Keep everything simple (KISS), prefer stdlib and packages installable via `pip`, `pipx`, `apt`, or `.deb`. Avoid heavy frameworks. If a PRD detail is ambiguous, propose 2–3 minimal options and pick the simplest default. Use small, reviewed diffs. Add brief docstrings. Write deterministic unit tests. All names, identifiers, and config paths must be derived from `PRD.md`.

---

## 0.2 Derive identifiers (must run before anything else)

> Read `PRD.md` and output the following four values. All subsequent steps **must use these derived values** — never hardcode them. If `PRD.md` changes, re-run this step.
>
> * `{PROJECT_NAME}`: Human-readable project name from the PRD’s title or overview.
> * `{PROJECT_SLUG}`: Lowercase, machine-safe identifier (only `[a-z0-9_]`), created by slugifying `{PROJECT_NAME}`.
> * `{ENTRYPOINT}`: CLI entrypoint name. Use `{PROJECT_SLUG}`.
> * `{CONFIG_PATH}`: Default config path `~/.config/{PROJECT_SLUG}.yaml`.
>
> Output them **exactly** in this YAML format (no commentary):
>
> ```yaml
> PROJECT_NAME: "<value>"
> PROJECT_SLUG: "<value>"
> ENTRYPOINT: "<value>"
> CONFIG_PATH: "<value>"
> ```

---

# Phase 1 — Task list from the PRD

## 1.1 Derive tasks

> Read `PRD.md`. Output a numbered, dependency-ordered task list that gets `{PROJECT_NAME}` to an MVP that satisfies the Acceptance Criteria section. Group tasks by phases (scaffold → CLI → disc analysis → classification → ripping → naming/organizing → config → logging/error handling → tests → packaging → docs). Mark each task with “Est. effort (S/M/L)” and “Deliverable”.

## 1.2 Turn tasks into checkable issues (local)

> Convert the task list into a markdown checklist in `TASKS.md`. Each item should have an acceptance check (what I will run to verify). Keep it fully local (no remote PRs/Issues).

---

# Phase 2 — Project scaffold

## 2.1 Create minimal project skeleton

> Scaffold a minimal Python project with the package name `{PROJECT_SLUG}` using `pyproject.toml` (PEP 621), `src/` layout, and a console entry point `{ENTRYPOINT}`. Include:
>
> * `src/{PROJECT_SLUG}/__init__.py`
> * `src/{PROJECT_SLUG}/cli.py`
> * `src/{PROJECT_SLUG}/core/` (for logic)
> * `tests/` (pytest)
> * `PRD.md` (already present)
> * `TASKS.md`, `README.md`, `LICENSE`, `.gitignore`
>   Add `ruff` and `pytest` config. Show the full diff.

## 2.2 Verify runnable CLI stub

> Implement a no-op CLI that prints version and `--help`. Provide commands for me to run: `pipx install -e .` or `pip install -e .`, then `{ENTRYPOINT} --help`. Update `TASKS.md` to check off this step.

---

# Phase 3 — Config & CLI options

## 3.1 Config loader

> Implement config loading per PRD. Default path: `{CONFIG_PATH}`. Fields: `output_directory`, `compression`, `naming.separator`, `naming.lowercase`, `logging.level`. CLI flags must override config. If no config file exists, proceed with defaults. Add `tests/test_config.py`. Show diff and test commands.

## 3.2 CLI arguments

> Extend CLI: `{ENTRYPOINT} [--config PATH] [--verbose] [--dry-run] <device>` where `<device>` defaults to `/dev/sr0` if omitted. Wire `--verbose` to logging level. Update `--help`. Tests for arg precedence.

---

# Phase 4 — Disc inspection abstraction

## 4.1 Design a thin inspection interface

> Create `core/inspect.py` with an interface that can: detect disc presence, read disc label, list titles/tracks, chapters, and durations. Provide `DiscInfo` and `TitleInfo` dataclasses. For MVP, implement shell-based adapters that use tools available via apt when present (e.g., `lsdvd` for DVDs, `bd_info` or similar for Blu-ray, otherwise fallback to `ffprobe` on device files). Detect tool availability at runtime; fail gracefully with actionable errors. Add unit tests that parse sample command output fixtures—no real hardware needed.

## 4.2 Mockable inspection

> Make inspectors injectable for testing. Provide a fake inspector that loads JSON fixtures from `tests/fixtures/`. Add example fixtures for (a) single-movie disc and (b) 6-episode disc with ~22–45 min tracks.

---

# Phase 5 — Classification (movie vs. series)

## 5.1 Implement heuristic classifier

> Per PRD “Classification Logic (MVP)”, implement `classify_disc(disc_info) -> {"type": "movie"|"series", "episodes": [...]}`. Use durations and similarity thresholds. For “series”, infer ordered episodes with sequential numbering starting at S01E01. Make thresholds configurable (sane defaults). Include unit tests using the fixtures. Show diff.

## 5.2 Edge cases

> Handle unclear structure by defaulting to movie. Log a warning explaining why. Add tests covering borderline durations.

---

# Phase 6 — Ripping backend

## 6.1 Minimal rip pipeline abstraction

> Create `core/rip.py` with `rip_title(device, title_info, dest_path, *, dry_run=False)` and a high-level `rip_disc(...)` orchestrator. For MVP, implement a simple approach that uses `ffmpeg` to read the selected title (document any constraints) OR shell out to open-source CLI tools if present (e.g., `dvdbackup`, others). Detect tool availability, choose the simplest working path, and emit clear logs. No compression stage—write raw/intermediate mp4 or container per PRD.

## 6.2 Dry-run mode

> Implement `--dry-run` to print what would be ripped, destinations, and durations without touching the device. Tests assert planned actions.

---

# Phase 7 — Naming, sanitization, and organization

## 7.1 Filename & folders

> Implement `core/naming.py` to enforce: no spaces, use separator from config, ASCII-safe, and PRD path patterns:
>
> * Movie: `<movieTitle>.mp4`
> * Series: `<seriesName>/<seriesName>-s01eNN_<title>.mp4`
>
> If no episode title is known, use `Episode_NN`. Ensure collision handling with `_1`, `_2`. Add tests.

## 7.2 Series directory convention

> Implement creation of `<seriesName>/` under `output_directory`. Respect `naming.lowercase` flag globally (affecting both dir and filenames). Tests included.

---

# Phase 8 — Orchestration, logging, and errors

## 8.1 Main flow

> In `cli.py`, implement the full flow: load config → inspect disc → classify → plan outputs → optionally prompt only if a destructive overwrite would occur (default to safe) → rip each target → finalize. Logging to console at INFO (or DEBUG with `--verbose`). Use non-zero exit codes per PRD table.

## 8.2 Structured logs

> Add structured log lines that will let me grep outcomes: `EVENT=CLASSIFIED TYPE=series EPISODES=6`, `EVENT=RIP_DONE FILE=... BYTES=...`. Add tests for critical error paths.

---

# Phase 9 — Tests & fixtures

## 9.1 Test matrix

> Create pytest matrix: config precedence, classification fixtures (movie/series/borderline), naming sanitization, dry-run planning, and error codes. Ensure `pytest -q` passes. Output coverage summary (even if no gate).

---

# Phase 10 — Packaging & install

## 10.1 Packaging

> Finalize `pyproject.toml` with `console_scripts = "{ENTRYPOINT}={PROJECT_SLUG}.cli:main"`. Provide `pipx install -e .` and `pip install -e .` instructions in `README.md`. Add a `Makefile` with `make install`, `make test`, `make lint`, `make format`.

---

# Phase 11 — Docs & quickstart

## 11.1 README Quickstart

> Update `README.md` with: prerequisites (apt packages for optional inspectors), install steps, usage examples for movie and series discs, dry-run, config schema, and troubleshooting. Keep it short and practical.

---

# Phase 12 — End-to-end dry run (no hardware)

## 12.1 Simulation mode

> Add a hidden flag `--simulate FIXTURE.json` to bypass hardware and drive the full pipeline from a `DiscInfo` JSON (for CI/local demo). Provide two sample JSONs. Add a demo script in `scripts/demo.sh` that shows planning, naming, and “pretend rip” with `--dry-run --simulate`.

---

# Phase 13 — Optional (deferred)

## 13.1 HandBrake integration hook (off by default)

> Add a post-rip hook function that, if `compression=true` in config, queues a HandBrakeCLI command (documented only; not default). Keep this behind a feature flag, covered with a unit test that only checks command assembly, not execution.

---

# Phase 14 — Final QA & acceptance

## 14.1 Acceptance script

> Write `scripts/acceptance.sh` that runs the simulation test cases and asserts the expected file plans and exit codes. Ensure it matches PRD Acceptance Criteria.

---

# Phase 15 — Validation Against PRD

## 15.1 Implementation validation

> Read `PRD.md` and verify that the implementation satisfies:
>
> * All Acceptance Criteria
> * Output naming and directory conventions
> * CLI options and defaults
> * Config structure
> * Classification logic behavior
> * Error handling and exit codes
>
> Produce a checklist of ✅/❌ for each requirement, and suggest fixes for any ❌ items. Do not generate code in this step — just the validation report.

---

## Quick “fix-it” prompts you’ll reuse

### A. Propose options for an ambiguous PRD point

> Identify where the PRD is ambiguous for the current task. Propose up to 3 simple options with tradeoffs. Recommend one default and proceed, leaving TODO comments that reference the alternative choices.

### B. Small, safe refactor

> Show me a minimal refactor to improve readability/testability for module X. Keep the diff under 80 lines. Preserve behavior. Update tests.

### C. Add missing tests

> List untested behaviors in module X. Add unit tests with fixtures as needed. Show diff and final `pytest` output.

### D. Troubleshoot a failure

> Given this failing command/output (paste block), diagnose the likely cause, map to the module/function, propose a small patch, and show the diff + new tests.

---

## One-shot “do the next thing” prompt

When you just want momentum:

> Read `PRD.md` and `TASKS.md`. Pick the top unchecked item. Implement it with the smallest possible diff, add/adjust tests, and update `TASKS.md`. Show me: (1) diff, (2) test results, (3) the exact commands I should run to verify locally.
````
