#!/bin/bash

# Build script for Copy Tab URLs Chrome Extension
# Creates an XPI file for Firefox/LibreWolf installation

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

echo -e "${GREEN}Building Copy Tab URLs Extension XPI...${NC}"

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

# Create the XPI file (ZIP with .xpi extension)
echo -e "${GREEN}Creating XPI file...${NC}"
cd "$TEMP_DIR"
zip -r "../$XPI_FILE" . -q
cd ..

# Clean up temporary directory
echo -e "${GREEN}Cleaning up...${NC}"
rm -rf "$TEMP_DIR"

# Verify the XPI file was created
if [ -f "$XPI_FILE" ]; then
    file_size=$(du -h "$XPI_FILE" | cut -f1)
    echo -e "${GREEN}✓ XPI file created successfully: $XPI_FILE ($file_size)${NC}"
    
    # Show contents of the XPI
    echo -e "${GREEN}XPI contents:${NC}"
    unzip -l "$XPI_FILE"
    
    echo -e "${GREEN}Installation instructions:${NC}"
    echo -e "${YELLOW}1. For LibreWolf/Firefox:${NC}"
    echo "   - Go to about:debugging#/runtime/this-firefox"
    echo "   - Click 'Load Temporary Add-on...'"
    echo "   - Select the $XPI_FILE file"
    echo ""
    echo -e "${YELLOW}2. For permanent installation:${NC}"
    echo "   - Disable signature requirement in about:config"
    echo "   - Set xpinstall.signatures.required to false"
    echo "   - Install the XPI through add-ons manager"
    
else
    echo -e "${RED}Error: Failed to create XPI file!${NC}"
    exit 1
fi

echo -e "${GREEN}Build completed successfully!${NC}"
