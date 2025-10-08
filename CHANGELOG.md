# Changelog

## 1.51 - 2025-10-08
- Fixed Firefox/LibreWolf compatibility by creating browser-specific builds.
- Added `manifest-firefox.json` and `background-firefox.js` for Firefox (uses `scripts` array instead of `service_worker`).
- Created `build-firefox.sh` script to generate Firefox-compatible XPI files.
- Fixed "Receiving end does not exist" error in Firefox/LibreWolf message passing.
- Updated documentation with Firefox/LibreWolf installation instructions.
- Removed XPI files from version control (build artifacts only).
- Added comprehensive Firefox compatibility documentation.

## 1.50 - 2025-10-07
- Added Firefox support by introducing a shared WebExtensions browser adapter.
- Updated the background service worker to preserve copy workflow and store the last session.
- Added session restore and clipboard import actions with URL validation.
- Refreshed the popup UI with new controls and status messaging.
- Updated documentation and permissions, keeping the extension offline-only.
- Confirmed the manifest version bump to 1.50 across Chrome- and Firefox-targeted builds.
