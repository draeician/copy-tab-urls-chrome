#!/bin/bash

# Firefox/LibreWolf-specific build script
# Uses background scripts instead of service worker

set -e

XPI_FILE="copy-tab-urls-firefox.xpi"
TEMP_DIR="temp_firefox_build"

echo "🦊 Building Firefox/LibreWolf-compatible XPI..."

# Clean up
rm -f "$XPI_FILE"
rm -rf "$TEMP_DIR"

# Create temp directory
mkdir -p "$TEMP_DIR"

echo "📦 Copying files..."

# Copy and rename Firefox-specific files
cp manifest-firefox.json "$TEMP_DIR/manifest.json"
cp background-firefox.js "$TEMP_DIR/background.js"

# Copy other files normally
cp popup.html "$TEMP_DIR/"
cp popup.js "$TEMP_DIR/"
cp content.js "$TEMP_DIR/"

# Copy directories
cp -r icons/ "$TEMP_DIR/"
cp -r vendor/ "$TEMP_DIR/"

echo "🔨 Creating XPI (uncompressed for compatibility)..."
cd "$TEMP_DIR"
zip -0 -q -r "../$XPI_FILE" .
cd ..

# Clean up
rm -rf "$TEMP_DIR"

if [ -f "$XPI_FILE" ]; then
    file_size=$(du -h "$XPI_FILE" | cut -f1)
    echo "✅ Firefox/LibreWolf XPI created: $XPI_FILE ($file_size)"
    
    # Test integrity
    echo "🧪 Testing integrity..."
    if unzip -t "$XPI_FILE" > /dev/null 2>&1; then
        echo "✅ XPI integrity: PASSED"
    else
        echo "❌ XPI integrity: FAILED"
        exit 1
    fi
    
    # Verify manifest
    echo "📋 Verifying manifest..."
    if unzip -p "$XPI_FILE" manifest.json | python3 -m json.tool > /dev/null 2>&1; then
        echo "✅ Manifest: Valid JSON"
        echo ""
        echo "Key settings:"
        unzip -p "$XPI_FILE" manifest.json | python3 -c "import json, sys; m=json.load(sys.stdin); print(f\"  Background: {m['background']}\"); print(f\"  Gecko ID: {m['browser_specific_settings']['gecko']['id']}\")"
    else
        echo "❌ Manifest: Invalid JSON"
        exit 1
    fi
    
    echo ""
    echo "🦊 LibreWolf Installation:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "1. Open LibreWolf"
    echo "2. Go to: about:debugging#/runtime/this-firefox"
    echo "3. Click: 'Load Temporary Add-on...'"
    echo "4. Select: $XPI_FILE"
    echo ""
    echo "For permanent installation:"
    echo "1. about:config → xpinstall.signatures.required = false"
    echo "2. about:addons → gear icon → Install Add-on From File"
    echo "3. Select: $XPI_FILE"
    echo ""
    echo "✅ Build complete!"
else
    echo "❌ Failed to create XPI"
    exit 1
fi
