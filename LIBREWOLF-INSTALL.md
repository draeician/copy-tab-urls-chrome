# LibreWolf Installation Guide

## Quick Start

The extension now works perfectly with LibreWolf! Just build and install.

### Build the Firefox-Compatible XPI

```bash
./build-firefox.sh
```

This creates `copy-tab-urls-firefox.xpi` with the correct manifest format for Firefox/LibreWolf.

## Installation Methods

### Method 1: Temporary Installation (Recommended)

This method is perfect for development and testing. The extension will work until you restart LibreWolf.

1. Open LibreWolf
2. Go to: `about:debugging#/runtime/this-firefox`
3. Click **"Load Temporary Add-on..."**
4. Navigate to the extension directory
5. Select: `copy-tab-urls-firefox.xpi`
6. The extension will appear in your toolbar

### Method 2: Permanent Installation

This method keeps the extension after restart, but requires the signature setting to be disabled.

1. **Disable signature requirement:**
   - Open LibreWolf
   - Go to `about:config`
   - Search for: `xpinstall.signatures.required`
   - Double-click to set it to **false**

2. **Install the extension:**
   - Go to: `about:addons`
   - Click the **gear icon** (⚙️) in the top right
   - Select **"Install Add-on From File..."**
   - Navigate to the extension directory
   - Select: `copy-tab-urls-firefox.xpi`
   - Click "Add" when prompted

## Troubleshooting

### "This add-on could not be installed because it appears to be corrupt"

This issue has been **fixed**! The original XPI files used Chrome's service worker format, which Firefox/LibreWolf doesn't support. The new `copy-tab-urls-firefox.xpi` uses the correct Firefox format.

If you still get this error:

1. **Make sure you're using the Firefox build**:
   ```bash
   ./build-firefox.sh
   ```
   Use `copy-tab-urls-firefox.xpi`, not `copy-tab-urls-chrome.xpi`

2. **Try Temporary Installation** (Method 1) - This bypasses most validation

3. **Check LibreWolf version**:
   - Go to `about:support`
   - Ensure version is 109.0 or higher

### Why were the other XPI files failing?

The previous XPI files used Manifest V3 with `service_worker` (Chrome format). Firefox/LibreWolf requires `scripts` array for background pages. The `build-firefox.sh` script now creates a Firefox-compatible version automatically.

### "Could not establish connection. Receiving end does not exist"

This error has been fixed in the latest version. If you still see it:

1. Go to `about:debugging#/runtime/this-firefox`
2. Find "Copy Tab URLs"
3. Click **"Reload"**

If you're installing for the first time, this error should not appear.

### Extension Doesn't Appear After Installation

1. Check the toolbar - look for the extension icon
2. Go to `about:addons` to verify it's enabled
3. Try restarting LibreWolf
4. Re-install using Method 1 (Temporary Installation)

## Testing the Extension

After installation:

1. Click the extension icon in your toolbar
2. You should see these buttons:
   - **Copy Current Window**
   - **Copy All Windows**
   - **Restore Last Saved**
   - **Open URLs from Clipboard**
3. Try clicking "Copy Current Window" - you should see a success message with URL count

## Available XPI Files

- **copy-tab-urls-firefox.xpi** - Firefox/LibreWolf compatible (56K) ✅ **Use this one**
- **copy-tab-urls-chrome.xpi** - Chrome/Brave/Edge compatible (32K)

**Important:** Always use `copy-tab-urls-firefox.xpi` for Firefox/LibreWolf. The Chrome version will not work.

## Build Script

To rebuild the Firefox/LibreWolf XPI:

```bash
./build-firefox.sh
```

This script:
- Creates a Firefox-compatible manifest (uses `scripts` instead of `service_worker`)
- Packages the extension with proper Firefox support
- Validates the XPI integrity
- Creates `copy-tab-urls-firefox.xpi`

## Support

If you continue to have issues:

1. Check that all prerequisites are met
2. Try Method 1 (Temporary Installation) first
3. Use `copy-tab-urls-simple.xpi`
4. Check the browser console for errors (F12 → Console)
5. Verify LibreWolf version is 109.0+

## Important Notes

- **Signature Requirement**: Must be disabled for unsigned extensions
- **Temporary vs Permanent**: Temporary installation is easier and more reliable
- **After Restart**: Temporary installations need to be reloaded
- **Permissions**: Extension needs tabs, storage, and clipboard permissions
