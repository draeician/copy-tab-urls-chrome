document.addEventListener('DOMContentLoaded', () => {
  const copyButton = document.getElementById('copyButton');
  const messageDiv = document.getElementById('message');
  const statsDiv = document.getElementById('stats');

  copyButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "copyUrls" });
    copyButton.disabled = true;
    copyButton.textContent = 'Copying...';
    messageDiv.textContent = 'Initializing...';
    statsDiv.textContent = '';
  });

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch(request.action) {
      case "updateStatus":
        messageDiv.textContent = request.message;
        break;
      case "copyComplete":
        navigator.clipboard.writeText(request.text).then(() => {
          messageDiv.textContent = `${request.stats.urlCount} URLs copied to clipboard!`;
          statsDiv.innerHTML = `
            <p>Tabs processed: ${request.stats.tabCount}</p>
            <p>URLs copied: ${request.stats.urlCount}</p>
            <p>Total characters: ${request.stats.characterCount}</p>
          `;
          copyButton.disabled = false;
          copyButton.textContent = 'Copy URLs to Clipboard';
        }).catch(err => {
          messageDiv.textContent = `Failed to copy URLs: ${err.message}`;
          statsDiv.textContent = '';
          copyButton.disabled = false;
          copyButton.textContent = 'Try Again';
        });
        break;
      case "copyError":
        messageDiv.textContent = request.message;
        statsDiv.textContent = '';
        copyButton.disabled = false;
        copyButton.textContent = 'Try Again';
        break;
    }
  });
});
