# Copy Tab URLs Chrome Extension

## Overview

The Copy Tab URLs Chrome Extension is a simple and efficient tool that allows users to quickly copy the URLs of all open tabs in their Chrome browser. This extension streamlines the process of sharing or saving multiple webpage addresses at once.

## Features

- One-click functionality to copy open tab URLs
- Option to copy URLs from all windows or just the current window
- Automatically formats URLs, separating each with a new line
- Provides user feedback and statistics through the popup interface
- Lightweight and easy to use

## Installation

1. Download or clone this repository to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the directory containing the extension files.

## Usage

1. Click on the extension icon in your Chrome toolbar.
2. Select whether you want to copy URLs from all windows or just the current window.
3. Click the "Copy URLs" button.
4. The URLs of the selected tabs will be copied to your clipboard.
5. An alert will confirm that the URLs have been copied successfully, along with the number of URLs copied.

## File Structure

- `manifest.json`: Contains extension metadata and permissions
- `background.js`: Handles the core functionality of copying URLs
- `popup.html`: Provides the user interface for selecting copy options
- `popup.js`: Manages the popup functionality and user interactions
- `icons/`: Directory containing extension icons

## Permissions

This extension requires the following permissions:

- `tabs`: To access and read the URLs of open tabs
- `clipboardWrite`: To copy the URLs to the clipboard

## Contributing

Contributions to improve the extension are welcome. Please feel free to submit pull requests or open issues for any bugs or feature requests.

## License

This project is open-source and available under the [MIT License](https://opensource.org/licenses/MIT).
