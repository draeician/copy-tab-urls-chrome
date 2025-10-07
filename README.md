# Copy Tab URLs Browser Extension

## Overview

Copy Tab URLs is a lightweight, offline-ready WebExtensions add-on that helps you collect, copy, and reopen the URLs from your current browsing session. The extension now supports Chromium-based browsers (Chrome, Brave, Edge) and Firefox with the same MV3 codebase.

## Features

- Copy the URLs from the current window or every open browser window.
- Automatically filters out internal pages such as `chrome://` and `about:`.
- Displays real-time status updates and copy statistics in the popup.
- Saves the most recent copy session so you can restore those tabs later.
- Opens URL lists from your clipboard (newline-separated or JSON array/object).
- Remembers your preferences with `storage.sync` and keeps the last session in `storage.local`.
- Requires no network access and works completely offline.

## Installation

### Chrome / Brave (Chromium)
1. Clone or download this repository to your machine.
2. Open `chrome://extensions/` (or `brave://extensions/`).
3. Enable **Developer mode** in the top-right corner.
4. Click **Load unpacked** and select the project directory.

### Firefox
1. Clone or download this repository to your machine.
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
3. Click **Load Temporary Add-on…** and choose the `manifest.json` file in the project directory.
4. To install a signed package, run your preferred build/signing process and load the resulting `.xpi` through the same page.

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

Perform these manual checks on Linux and Windows using Brave, Chrome, and Firefox:

- Copy URLs from the current window and all windows.
- Confirm the clipboard text is updated after copying.
- Restore the last saved session in both the current window and a new window.
- Open URLs from the clipboard using newline-separated text.
- Open URLs from the clipboard using a JSON array or `{ urls: [] }` object.
- Verify internal URLs such as `chrome://` and `about:` are excluded.

## License

This project is open-source and available under the [MIT License](https://opensource.org/licenses/MIT).
