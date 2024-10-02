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
    
    const activeTab = tabs.find(tab => tab.active);
    if (!activeTab) {
      throw new Error('No active tab found');
    }
    
    console.log('Active tab URL:', activeTab.url);
    
    if (activeTab.url.startsWith('chrome://')) {
      console.log('Chrome URL detected, using alternative method');
      await chrome.tabs.create({ url: 'popup.html', active: false }, async (tab) => {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: copyToClipboard,
          args: [urls.join('\n')]
        });
        await chrome.tabs.remove(tab.id);
      });
    } else {
      console.log('Executing content script');
      await chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        function: copyToClipboard,
        args: [urls.join('\n')]
      });
    }
    
    chrome.runtime.sendMessage({ 
      action: "copyComplete", 
      message: `${urls.length} URLs copied to clipboard!`,
      stats: {
        tabCount: tabs.length,
        urlCount: urls.length,
        characterCount: urls.join('\n').length
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
  return new Promise((resolve, reject) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      resolve();
    } catch (err) {
      reject(err);
    } finally {
      document.body.removeChild(textArea);
    }
  });
}