# Copy Tab URLs Browser Extension

## Overview

Copy Tab URLs is a lightweight, offline-ready WebExtensions add-on that helps you collect, copy, and reopen the URLs from your current browsing session. The extension now supports Chromium-based browsers (Chrome, Brave, Edge) and Firefox with the same MV3 codebase.

## Features

- Copy the URLs from the current window or every open browser window with one click.
- Toggle whether restored sessions open in the current window or a brand-new window.
- Automatically filter out internal pages such as `chrome://` and `about:` URLs.
- Display real-time status updates, copy statistics, and last saved timestamps in the popup.
- Save the most recent copy session and restore it later on demand.
- Open URL lists from your clipboard whether they are newline-separated text, JSON arrays, or objects with a `urls` field.
- Persist your preferences across browsers with `storage.sync` and keep the last session safe in `storage.local`.
- Work completely offline with no external network access.

## Installation

### Chrome / Brave / Edge (Chromium)
1. Clone or download this repository to your machine.
2. Open the extensions page (`chrome://extensions/`, `brave://extensions/`, or `edge://extensions/`).
3. Enable **Developer mode** in the top-right corner.
4. Click **Load unpacked** and select the project directory.

### Firefox
1. Clone or download this repository to your machine.
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
3. Click **Load Temporary Add-on…** and choose the `manifest.json` file in the project directory.
4. When you are ready to ship, build and sign an `.xpi` using your preferred tooling and install it through the same page.

## Usage

1. Open the popup from the toolbar.
2. Decide whether to copy from all browser windows and whether restored URLs should open in a new window.
3. Click **Copy URLs to Clipboard** to capture the list. The popup shows progress and writes the final list to your clipboard.
4. Use **Restore Last Saved** to reopen the most recently copied URLs, or **Open URLs from Clipboard** to parse a list you already have.
5. Review the stats panel for counts, character totals, and last saved timestamps.

### Clipboard Format Support
- Plain text with one URL per line.
- JSON arrays (e.g. `["https://example.com", "https://openai.com"]`).
- JSON objects with a `urls` property (e.g. `{ "urls": ["https://example.com"] }`).

## QA Checklist

Verify the extension on Linux and Windows with Chrome, Brave, Edge, and Firefox:

- Copy URLs from both the current window and all windows and confirm the clipboard contents update.
- Toggle the **Open in New Window** preference, copy again, and restore the session in each mode.
- Import URLs from the clipboard using newline-separated text, JSON arrays, and `{ "urls": [] }` objects.
- Confirm internal/privileged URLs such as `chrome://`, `edge://`, and `about:` are filtered out.
- Trigger copy/restore actions with the popup closed to ensure background notifications and status text remain accurate.
- Refresh the browser and reopen the popup to confirm settings persist via `storage.sync` and the last session reloads from `storage.local`.

## License

This project is open-source and available under the [MIT License](https://opensource.org/licenses/MIT).
