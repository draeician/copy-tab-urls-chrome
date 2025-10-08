# Firefox/LibreWolf Compatibility

## Summary

This extension now supports **both Chrome and Firefox/LibreWolf** through browser-specific builds.

## The Problem

Firefox/LibreWolf doesn't support Manifest V3 service workers in the same way as Chrome. When using:

```json
"background": {
  "service_worker": "background.js"
}
```

Firefox/LibreWolf would reject the extension as "corrupted" because this format is Chrome-specific.

## The Solution

We now maintain **two versions** of the manifest and background script:

### Chrome Version (manifest.json)
```json
"background": {
  "service_worker": "background.js"
}
```
- Uses `importScripts()` to load the browser adapter
- Works with Chrome, Brave, Edge

### Firefox Version (manifest-firefox.json)
```json
"background": {
  "scripts": ["vendor/browser-adapter.js", "background.js"]
}
```
- Loads scripts as an array (Firefox format)
- No `importScripts()` needed
- Works with Firefox, LibreWolf

## Build Process

The `build-firefox.sh` script automatically:
1. Copies `manifest-firefox.json` → `manifest.json`
2. Copies `background-firefox.js` → `background.js`
3. Packages everything into `copy-tab-urls-firefox.xpi`

## File Structure

```
copy-tab-urls-chrome/
├── manifest.json                 # Chrome version (in source)
├── manifest-firefox.json         # Firefox version (template)
├── background.js                 # Chrome version (in source)
├── background-firefox.js         # Firefox version (template)
├── popup.js                      # Shared (works in both)
├── popup.html                    # Shared
├── content.js                    # Shared
├── vendor/browser-adapter.js     # Shared compatibility layer
├── build-firefox.sh              # Build script for Firefox
├── copy-tab-urls-chrome.xpi      # Chrome build (32K)
└── copy-tab-urls-firefox.xpi     # Firefox build (56K)
```

## Testing

### Chrome/Brave/Edge
- Load unpacked from source directory
- Uses original `manifest.json` and `background.js`

### Firefox/LibreWolf
- Run `./build-firefox.sh` to create XPI
- Install `copy-tab-urls-firefox.xpi`
- Uses Firefox-specific manifest and background script

## Key Differences

| Feature | Chrome | Firefox |
|---------|--------|---------|
| **Manifest background** | `service_worker` | `scripts` array |
| **Script loading** | `importScripts()` | Loaded via manifest |
| **XPI size** | 32K (compressed) | 56K (uncompressed) |
| **Build process** | Direct from source | Via `build-firefox.sh` |

## Maintenance

When updating the extension:

1. **Shared files** (popup.js, popup.html, content.js, vendor/):
   - Edit once, works in both versions

2. **Background logic**:
   - Update `background.js` for Chrome
   - Update `background-firefox.js` for Firefox
   - Keep the logic identical, only format differs

3. **Manifest changes**:
   - Update `manifest.json` for Chrome
   - Update `manifest-firefox.json` for Firefox
   - Rebuild Firefox XPI: `./build-firefox.sh`

## Error Handling

Both versions include Firefox-specific error handling for message passing:

```javascript
// Handles Firefox's "Receiving end does not exist" error
if (error && error.message && error.message.includes('Receiving end does not exist')) {
  console.log('Message sent to background script (Firefox/LibreWolf)');
  return;
}
```

This is normal Firefox behavior and doesn't indicate an actual error.
