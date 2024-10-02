chrome.action.onClicked.addListener(async () => {
  try {
    const tabs = await chrome.tabs.query({});
    const urls = tabs.map(tab => tab.url).join('\n');
    await copyToClipboard(urls);
    chrome.runtime.sendMessage({ action: "showMessage", message: "URLs copied to clipboard!" });
  } catch (err) {
    console.error('Error:', err);
    chrome.runtime.sendMessage({ action: "showMessage", message: "Failed to copy URLs." });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "copyUrls") {
    chrome.runtime.sendMessage({ action: "showMessage", message: "Copying URLs..." });
    copyUrls();
  }
});

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error('Error copying to clipboard: ', err);
    throw err;
  }
}

async function copyUrls() {
  try {
    const tabs = await chrome.tabs.query({});
    const urls = tabs.map(tab => tab.url).join('\n');
    await copyToClipboard(urls);
    chrome.runtime.sendMessage({ action: "showMessage", message: "URLs copied to clipboard!" });
  } catch (err) {
    console.error('Error:', err);
    chrome.runtime.sendMessage({ action: "showMessage", message: "Failed to copy URLs." });
  }
}