# TASKS

## Phase 1 – Cross-browser foundation
- [x] Add the WebExtensions browser adapter and ensure it loads in the service worker and popup (adapter active in both contexts). [#P1-T1]
- [x] Update Manifest V3 metadata, permissions, and Firefox-specific settings (manifest validates in Chrome & Firefox). [#P1-T2]

## Phase 2 – Background capabilities
- [x] Refactor the background service worker to use the shared adapter and maintain existing copy/status flow (copy action mirrors current UX). [#P2-T1]
- [x] Persist the last copied session in `storage.local` and implement restore helpers for current/new windows (restore reopens saved URLs). [#P2-T2]
- [x] Implement clipboard import handling with newline and JSON parsing plus internal URL filtering (invalid lines ignored gracefully). [#P2-T3]

## Phase 3 – Popup experience
- [x] Redesign the popup UI with new buttons, open-in-new-window toggle, and status messaging (UI matches spec and remains accessible). [#P3-T1]
- [x] Wire popup logic to new background actions, including settings persistence and clipboard interactions (all buttons trigger expected behavior). [#P3-T2]

## Phase 4 – Quality & resilience
- [x] Add comprehensive error handling for empty results, clipboard failures, and blocked schemes (errors reported without crashes). [#P4-T1]
- [x] Verify async flows resolve cleanly with no unhandled promise rejections (console remains clear during manual testing). [#P4-T2]

## Phase 5 – Documentation & release
- [x] Update README with multi-browser setup, feature overview, and QA checklist (docs reflect new workflow). [#P5-T1]
- [ ] Record the 1.50 release in CHANGELOG and confirm version bump (changelog and manifest show 1.50). [#P5-T2]
