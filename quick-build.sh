#!/bin/bash

# Quick build script for Copy Tab URLs Extension
# Simple version without verbose output

set -e

XPI_FILE="copy-tab-urls-chrome.xpi"
TEMP_DIR="temp_build"

# Clean up
rm -f "$XPI_FILE"
rm -rf "$TEMP_DIR"

# Create and populate temp directory
mkdir -p "$TEMP_DIR"
cp manifest.json background.js popup.html popup.js content.js "$TEMP_DIR/"
cp -r icons/ vendor/ "$TEMP_DIR/"

# Create XPI
cd "$TEMP_DIR"
zip -r "../$XPI_FILE" . -q
cd ..
rm -rf "$TEMP_DIR"

echo "✓ XPI created: $XPI_FILE"
echo "Install in LibreWolf: about:debugging#/runtime/this-firefox"
