#!/bin/bash

# Manual XPI build - simplest method for LibreWolf
# Creates uncompressed XPI to avoid LibreWolf compatibility issues

set -e

XPI_FILE="copy-tab-urls-manual.xpi"

echo "Building manual XPI for LibreWolf..."

# Clean up
rm -f "$XPI_FILE"

# Create XPI using the most basic method
# This creates an uncompressed ZIP which LibreWolf handles better
zip -0 -r "$XPI_FILE" manifest.json background.js popup.html popup.js content.js icons/ vendor/ -q

if [ -f "$XPI_FILE" ]; then
    file_size=$(du -h "$XPI_FILE" | cut -f1)
    echo "✅ Manual XPI created: $XPI_FILE ($file_size)"
    echo ""
    echo "📋 Installation in LibreWolf:"
    echo "1. about:config → xpinstall.signatures.required = false"
    echo "2. about:addons → gear icon → Install Add-on From File"
    echo "3. Select: $XPI_FILE"
    echo ""
    echo "🔄 Alternative: about:debugging#/runtime/this-firefox → Load Temporary Add-on"
else
    echo "❌ Failed to create XPI"
    exit 1
fi
