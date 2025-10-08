#!/bin/bash

# LibreWolf-specific XPI build script
# Addresses common LibreWolf corruption issues

set -e

EXTENSION_NAME="copy-tab-urls-chrome"
XPI_FILE="${EXTENSION_NAME}-librewolf.xpi"
TEMP_DIR="temp_build_librewolf"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}Building LibreWolf-compatible XPI...${NC}"

# Clean up
rm -f "$XPI_FILE"
rm -rf "$TEMP_DIR"

# Create temp directory
mkdir -p "$TEMP_DIR"

# Copy files with proper permissions
echo -e "${GREEN}Copying extension files...${NC}"
cp manifest.json "$TEMP_DIR/"
cp background.js "$TEMP_DIR/"
cp popup.html "$TEMP_DIR/"
cp popup.js "$TEMP_DIR/"
cp content.js "$TEMP_DIR/"

# Copy directories
cp -r icons/ "$TEMP_DIR/"
cp -r vendor/ "$TEMP_DIR/"

# Ensure proper file permissions
find "$TEMP_DIR" -type f -exec chmod 644 {} \;
find "$TEMP_DIR" -type d -exec chmod 755 {} \;

echo -e "${GREEN}Creating LibreWolf-compatible XPI...${NC}"
cd "$TEMP_DIR"

# Use specific zip settings for LibreWolf compatibility
# -0: no compression (LibreWolf sometimes has issues with compressed files)
# -X: don't save extra file attributes
# -r: recursive
zip -0 -X -r "../$XPI_FILE" . -q

cd ..

# Clean up
rm -rf "$TEMP_DIR"

# Verify the XPI
if [ -f "$XPI_FILE" ]; then
    file_size=$(du -h "$XPI_FILE" | cut -f1)
    echo -e "${GREEN}✓ LibreWolf XPI created: $XPI_FILE ($file_size)${NC}"
    
    # Test integrity
    if unzip -t "$XPI_FILE" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ XPI integrity test passed${NC}"
    else
        echo -e "${RED}✗ XPI integrity test failed${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}LibreWolf Installation Steps:${NC}"
    echo -e "${YELLOW}1. First, disable signature requirements:${NC}"
    echo "   - Open LibreWolf"
    echo "   - Go to: about:config"
    echo "   - Search: xpinstall.signatures.required"
    echo "   - Set to: false (double-click to toggle)"
    echo ""
    echo -e "${YELLOW}2. Install the extension:${NC}"
    echo "   - Go to: about:addons"
    echo "   - Click the gear icon (⚙️)"
    echo "   - Select 'Install Add-on From File...'"
    echo "   - Choose: $XPI_FILE"
    echo ""
    echo -e "${YELLOW}3. Alternative method (if still fails):${NC}"
    echo "   - Go to: about:debugging#/runtime/this-firefox"
    echo "   - Click 'Load Temporary Add-on...'"
    echo "   - Select: $XPI_FILE"
    echo ""
    echo -e "${GREEN}Build completed successfully!${NC}"
else
    echo -e "${RED}Error: Failed to create XPI file!${NC}"
    exit 1
fi
