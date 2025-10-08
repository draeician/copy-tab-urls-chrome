#!/bin/bash

# Troubleshooting script for XPI installation issues in LibreWolf

set -e

XPI_FILE="copy-tab-urls-chrome.xpi"

echo "=== XPI Troubleshooting for LibreWolf ==="
echo ""

# Check if XPI file exists
if [ ! -f "$XPI_FILE" ]; then
    echo "❌ XPI file not found. Run ./build-xpi-librewolf.sh first."
    exit 1
fi

echo "✅ XPI file found: $XPI_FILE"

# Check file size
file_size=$(du -h "$XPI_FILE" | cut -f1)
echo "📏 File size: $file_size"

# Check file type
echo "🔍 File type:"
file "$XPI_FILE"

# Test ZIP integrity
echo ""
echo "🔧 Testing ZIP integrity..."
if unzip -t "$XPI_FILE" > /dev/null 2>&1; then
    echo "✅ ZIP integrity: PASSED"
else
    echo "❌ ZIP integrity: FAILED"
    exit 1
fi

# Check manifest.json
echo ""
echo "📋 Checking manifest.json..."
if unzip -p "$XPI_FILE" manifest.json | jq . > /dev/null 2>&1; then
    echo "✅ manifest.json: Valid JSON"
    
    # Extract and show key manifest fields
    echo ""
    echo "📄 Manifest details:"
    echo "   Name: $(unzip -p "$XPI_FILE" manifest.json | jq -r '.name')"
    echo "   Version: $(unzip -p "$XPI_FILE" manifest.json | jq -r '.version')"
    echo "   Manifest Version: $(unzip -p "$XPI_FILE" manifest.json | jq -r '.manifest_version')"
    echo "   Gecko ID: $(unzip -p "$XPI_FILE" manifest.json | jq -r '.browser_specific_settings.gecko.id')"
    echo "   Min Version: $(unzip -p "$XPI_FILE" manifest.json | jq -r '.browser_specific_settings.gecko.strict_min_version')"
else
    echo "❌ manifest.json: Invalid JSON"
    exit 1
fi

# List all files in XPI
echo ""
echo "📁 XPI contents:"
unzip -l "$XPI_FILE"

# Check for required files
echo ""
echo "🔍 Checking required files..."
required_files=(
    "manifest.json"
    "background.js"
    "popup.html"
    "popup.js"
    "content.js"
    "icons/icon16.png"
    "icons/icon48.png"
    "icons/icon128.png"
    "vendor/browser-adapter.js"
)

all_present=true
for file in "${required_files[@]}"; do
    if unzip -l "$XPI_FILE" | grep -q "$file"; then
        echo "✅ $file"
    else
        echo "❌ $file (MISSING)"
        all_present=false
    fi
done

if [ "$all_present" = true ]; then
    echo ""
    echo "✅ All required files present"
else
    echo ""
    echo "❌ Some required files are missing"
    exit 1
fi

# LibreWolf-specific checks
echo ""
echo "🦊 LibreWolf-specific recommendations:"
echo ""
echo "1. LibreWolf Version Check:"
echo "   - Ensure LibreWolf version is 109.0 or higher"
echo "   - Check: about:about"
echo ""
echo "2. Signature Requirements:"
echo "   - Go to: about:config"
echo "   - Search: xpinstall.signatures.required"
echo "   - Set to: false (double-click to toggle)"
echo ""
echo "3. Installation Methods:"
echo "   Method A (Temporary - Recommended):"
echo "   - about:debugging#/runtime/this-firefox"
echo "   - Click 'Load Temporary Add-on...'"
echo "   - Select: $XPI_FILE"
echo ""
echo "   Method B (Permanent):"
echo "   - about:addons"
echo "   - Gear icon → Install Add-on From File"
echo "   - Select: $XPI_FILE"
echo ""
echo "4. If still getting 'corrupted' error:"
echo "   - Try Method A (temporary installation)"
echo "   - Check LibreWolf version compatibility"
echo "   - Ensure xpinstall.signatures.required is false"
echo "   - Try restarting LibreWolf"
echo ""
echo "✅ Troubleshooting complete!"
