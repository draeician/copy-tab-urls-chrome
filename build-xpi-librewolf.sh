#!/bin/bash

# Build script for Copy Tab URLs Extension - LibreWolf Optimized
# Creates an XPI file specifically optimized for LibreWolf/Firefox installation

set -e  # Exit on any error

# Configuration
EXTENSION_NAME="copy-tab-urls-chrome"
XPI_FILE="${EXTENSION_NAME}.xpi"
TEMP_DIR="temp_build"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Building Copy Tab URLs Extension XPI for LibreWolf...${NC}"

# Clean up any existing build artifacts
if [ -f "$XPI_FILE" ]; then
    echo -e "${YELLOW}Removing existing XPI file...${NC}"
    rm -f "$XPI_FILE"
fi

if [ -d "$TEMP_DIR" ]; then
    echo -e "${YELLOW}Cleaning up temporary directory...${NC}"
    rm -rf "$TEMP_DIR"
fi

# Create temporary build directory
echo -e "${GREEN}Creating build directory...${NC}"
mkdir -p "$TEMP_DIR"

# Copy all necessary files for the extension
echo -e "${GREEN}Copying extension files...${NC}"

# Core extension files
cp manifest.json "$TEMP_DIR/"
cp background.js "$TEMP_DIR/"
cp popup.html "$TEMP_DIR/"
cp popup.js "$TEMP_DIR/"
cp content.js "$TEMP_DIR/"

# Copy icons directory
echo -e "${GREEN}Copying icons...${NC}"
cp -r icons/ "$TEMP_DIR/"

# Copy vendor directory
echo -e "${GREEN}Copying vendor files...${NC}"
cp -r vendor/ "$TEMP_DIR/"

# Verify all required files are present
echo -e "${GREEN}Verifying required files...${NC}"
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

for file in "${required_files[@]}"; do
    if [ ! -f "$TEMP_DIR/$file" ]; then
        echo -e "${RED}Error: Required file $file is missing!${NC}"
        exit 1
    fi
done

echo -e "${GREEN}All required files present.${NC}"

# Create the XPI file with specific settings for LibreWolf compatibility
echo -e "${GREEN}Creating XPI file with LibreWolf-optimized settings...${NC}"
cd "$TEMP_DIR"

# Use zip with specific compression settings for LibreWolf compatibility
# -X: don't save extra file attributes
# -9: maximum compression
# -r: recursive
zip -X -9 -r "../$XPI_FILE" . -q

cd ..

# Clean up temporary directory
echo -e "${GREEN}Cleaning up...${NC}"
rm -rf "$TEMP_DIR"

# Verify the XPI file was created and test it
if [ -f "$XPI_FILE" ]; then
    file_size=$(du -h "$XPI_FILE" | cut -f1)
    echo -e "${GREEN}✓ XPI file created successfully: $XPI_FILE ($file_size)${NC}"
    
    # Test the XPI file integrity
    echo -e "${GREEN}Testing XPI file integrity...${NC}"
    if unzip -t "$XPI_FILE" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ XPI file integrity test passed${NC}"
    else
        echo -e "${RED}✗ XPI file integrity test failed${NC}"
        exit 1
    fi
    
    # Show contents of the XPI
    echo -e "${GREEN}XPI contents:${NC}"
    unzip -l "$XPI_FILE"
    
    # Check manifest.json in the XPI
    echo -e "${GREEN}Verifying manifest.json in XPI...${NC}"
    if unzip -p "$XPI_FILE" manifest.json | jq . > /dev/null 2>&1; then
        echo -e "${GREEN}✓ manifest.json is valid JSON${NC}"
    else
        echo -e "${RED}✗ manifest.json is invalid JSON${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}LibreWolf Installation Instructions:${NC}"
    echo -e "${YELLOW}1. Temporary Installation (Recommended):${NC}"
    echo "   - Open LibreWolf"
    echo "   - Go to: about:debugging#/runtime/this-firefox"
    echo "   - Click 'Load Temporary Add-on...'"
    echo "   - Select the $XPI_FILE file"
    echo ""
    echo -e "${YELLOW}2. Permanent Installation:${NC}"
    echo "   - Open LibreWolf"
    echo "   - Go to: about:config"
    echo "   - Search for: xpinstall.signatures.required"
    echo "   - Set it to: false"
    echo "   - Go to: about:addons"
    echo "   - Click the gear icon → Install Add-on From File"
    echo "   - Select the $XPI_FILE file"
    echo ""
    echo -e "${YELLOW}3. If you get 'corrupted' error:${NC}"
    echo "   - Make sure xpinstall.signatures.required is set to false"
    echo "   - Try the temporary installation method first"
    echo "   - Check that LibreWolf version is 109.0 or higher"
    
else
    echo -e "${RED}Error: Failed to create XPI file!${NC}"
    exit 1
fi

echo -e "${GREEN}Build completed successfully!${NC}"
