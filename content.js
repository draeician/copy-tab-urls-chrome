chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "copyToClipboard") {
    const textArea = document.createElement("textarea");
    textArea.value = request.text;
    document.body.appendChild(textArea);
    textArea.select();
    let success = false;
    try {
      success = document.execCommand("copy");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
    document.body.removeChild(textArea);
    sendResponse({success: success});
  }
});
