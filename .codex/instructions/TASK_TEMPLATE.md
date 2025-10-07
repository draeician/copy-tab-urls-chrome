# Task File Template

Copy this into `.codex/tasks/<hash>-<slug>.md` and fill in fields.

```markdown
---
id: <8-hex>
title: "<short imperative title>"
role: <Task Master|Coder|Reviewer|Auditor|Blogger|Swarm Manager>
priority: P2         # P0..P3
phase_id: "P<N>-T<M>"   # aligns to TASKS.md ID if applicable
depends_on: []       # optional list of IDs or hashes
acceptance:
  - "<concrete check 1>"
  - "<concrete check 2>"
evidence:
  expected:
    - "<command to run>"
  artifacts:
    - "<path or URL>"
---

## Context
<background, links, rationale>

## Plan
- <steps>
```

