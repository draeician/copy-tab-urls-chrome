# Copy Tab URLs Chrome Extension

## Overview

The Copy Tab URLs Chrome Extension is a simple and efficient tool that allows users to quickly copy the URLs of all open tabs in their Chrome browser. This extension streamlines the process of sharing or saving multiple webpage addresses at once.

## Features

- One-click functionality to copy all open tab URLs
- Automatically formats URLs, separating each with a new line
- Provides user feedback through alert messages
- Lightweight and easy to use

## Installation

1. Download or clone this repository to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the directory containing the extension files.

## Usage

1. Click on the extension icon in your Chrome toolbar.
2. The URLs of all open tabs will be copied to your clipboard automatically.
3. An alert will confirm that the URLs have been copied successfully.

## File Structure

- `manifest.json`: Contains extension metadata and permissions
- `background.js`: Handles the core functionality of copying URLs
- `popup.html`: Provides a simple user interface (currently unused)
- `icons/`: Directory containing extension icons

## Permissions

This extension requires the following permissions:

- `tabs`: To access and read the URLs of open tabs
- `clipboardWrite`: To copy the URLs to the clipboard

## Contributing

Contributions to improve the extension are welcome. Please feel free to submit pull requests or open issues for any bugs or feature requests.

## License

This project is open-source and available under the [MIT License](https://opensource.org/licenses/MIT).
