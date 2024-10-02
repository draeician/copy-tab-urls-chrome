document.addEventListener('DOMContentLoaded', () => {
  const copyButton = document.getElementById('copyButton');
  const messageDiv = document.getElementById('message');

  copyButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "copyUrls" });
    copyButton.disabled = true;
    copyButton.textContent = 'Copying...';
  });

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "showMessage") {
      messageDiv.textContent = request.message;
      if (request.message === "URLs copied to clipboard!") {
        copyButton.disabled = false;
        copyButton.textContent = 'Copy URLs to Clipboard';
      }
    }
  });
});
