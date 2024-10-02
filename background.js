chrome.action.onClicked.addListener(copyUrls);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "copyUrls") {
    copyUrls();
  }
});

async function copyUrls() {
  try {
    chrome.runtime.sendMessage({ action: "updateStatus", message: "Querying tabs..." });
    const tabs = await chrome.tabs.query({});
    const urls = tabs.map(tab => tab.url);
    
    chrome.runtime.sendMessage({ 
      action: "updateStatus", 
      message: `Copying ${urls.length} URLs...` 
    });
    
    const nonChromeUrls = urls.filter(url => !url.startsWith('chrome://'));
    
    if (nonChromeUrls.length === 0) {
      throw new Error('No non-chrome:// URLs found to copy');
    }
    
    const text = nonChromeUrls.join('\n');
    
    chrome.runtime.sendMessage({ 
      action: "copyText", 
      text: text,
      stats: {
        tabCount: tabs.length,
        urlCount: nonChromeUrls.length,
        characterCount: text.length
      }
    });
  } catch (err) {
    console.error('Error:', err);
    chrome.runtime.sendMessage({ 
      action: "copyError", 
      message: `Failed to copy URLs: ${err.message}` 
    });
  }
}

function copyToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  let success = false;
  try {
    success = document.execCommand('copy');
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
  document.body.removeChild(textArea);
  return success;
}