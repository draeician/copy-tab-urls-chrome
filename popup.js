const browserApi = browser;

const COPY_BUTTON_DEFAULT = 'Copy URLs to Clipboard';
const COPY_BUTTON_WORKING = 'Copying…';
const RESTORE_PREP_MESSAGE = 'Preparing to restore…';
const CLIPBOARD_PREP_MESSAGE = 'Reading clipboard…';

const state = {
  copyAllTabs: true,
  openInNewWindow: true,
  busyAction: null
};

const elements = {};

document.addEventListener('DOMContentLoaded', async () => {
  cacheElements();
  attachListeners();
  await loadSettings();
  updateButtonLabels();
});

function cacheElements() {
  elements.copyButton = document.getElementById('copyButton');
  elements.restoreButton = document.getElementById('restoreButton');
  elements.clipboardButton = document.getElementById('clipboardButton');
  elements.allTabsToggle = document.getElementById('allTabsToggle');
  elements.openInNewWindowToggle = document.getElementById('openInNewWindowToggle');
  elements.message = document.getElementById('message');
  elements.stats = document.getElementById('stats');
}

function attachListeners() {
  browserApi.runtime.onMessage.addListener(handleRuntimeMessage);

  elements.allTabsToggle.addEventListener('change', async (event) => {
    state.copyAllTabs = event.target.checked;
    try {
      await browserApi.storage.sync.set({ copyAllTabs: state.copyAllTabs });
    } catch (error) {
      console.error('Failed to persist copyAllTabs setting', error);
    }
  });

  elements.openInNewWindowToggle.addEventListener('change', async (event) => {
    state.openInNewWindow = event.target.checked;
    updateButtonLabels();
    try {
      await browserApi.storage.sync.set({ openInNewWindow: state.openInNewWindow });
    } catch (error) {
      console.error('Failed to persist openInNewWindow setting', error);
    }
  });

  elements.copyButton.addEventListener('click', async () => {
    if (state.busyAction) {
      return;
    }

    setBusyState('copy');
    setMessage('Initializing…');
    clearStats();

    try {
      await browserApi.runtime.sendMessage({
        action: 'copyUrls',
        copyAllTabs: state.copyAllTabs
      });
    } catch (error) {
      handleImmediateError(`Failed to start copy: ${error.message}`);
    }
  });

  elements.restoreButton.addEventListener('click', async () => {
    if (state.busyAction) {
      return;
    }

    setBusyState('restore');
    setMessage(RESTORE_PREP_MESSAGE);
    clearStats();

    try {
      await browserApi.runtime.sendMessage({
        action: 'restoreLastSaved',
        openInNewWindow: state.openInNewWindow
      });
    } catch (error) {
      handleImmediateError(`Failed to start restore: ${error.message}`);
    }
  });

  elements.clipboardButton.addEventListener('click', async () => {
    if (state.busyAction) {
      return;
    }

    setBusyState('clipboard');
    setMessage(CLIPBOARD_PREP_MESSAGE);
    clearStats();

    try {
      const clipboardText = await navigator.clipboard.readText();
      if (!clipboardText.trim()) {
        throw new Error('Clipboard is empty.');
      }
      await browserApi.runtime.sendMessage({
        action: 'openFromClipboard',
        openInNewWindow: state.openInNewWindow,
        clipboardText
      });
    } catch (error) {
      handleImmediateError(`Clipboard error: ${error.message}`);
    }
  });
}

async function loadSettings() {
  try {
    const data = await browserApi.storage.sync.get({ copyAllTabs: true, openInNewWindow: true });
    state.copyAllTabs = data.copyAllTabs !== false;
    state.openInNewWindow = data.openInNewWindow !== false;
  } catch (error) {
    console.error('Failed to load settings', error);
    state.copyAllTabs = true;
    state.openInNewWindow = true;
  }

  elements.allTabsToggle.checked = state.copyAllTabs;
  elements.openInNewWindowToggle.checked = state.openInNewWindow;
}

function updateButtonLabels() {
  elements.restoreButton.textContent = 'Restore Last Saved (new window)';
  elements.clipboardButton.textContent = 'Open URLs from Clipboard (this window)';
  const targetDescription = state.openInNewWindow ? 'new window' : 'current window';
  elements.restoreButton.title = `Open saved URLs in a ${targetDescription}.`;
  elements.clipboardButton.title = `Open clipboard URLs in a ${targetDescription}.`;
}

function handleRuntimeMessage(request) {
  if (!request || typeof request !== 'object') {
    return false;
  }

  switch (request.action) {
    case 'updateStatus':
      setMessage(request.message || '');
      break;
    case 'copyComplete':
      handleCopyComplete(request);
      break;
    case 'copyError':
      handleCopyError(request.message);
      break;
    case 'operationComplete':
      handleOperationComplete(request);
      break;
    case 'operationError':
      handleOperationError(request.message);
      break;
    default:
      break;
  }
  return false;
}

function handleCopyComplete(payload) {
  const text = payload && payload.text ? payload.text : '';
  const stats = payload && payload.stats ? payload.stats : {};

  navigator.clipboard.writeText(text).then(() => {
    setMessage(`${stats.urlCount || 0} URL${stats.urlCount === 1 ? '' : 's'} copied to clipboard!`);
    renderCopyStats(stats);
    setBusyState(null);
  }).catch((error) => {
    handleCopyError(`Failed to write to clipboard: ${error.message}`);
  });
}

function handleCopyError(message) {
  setMessage(message || 'Failed to copy URLs.', true);
  clearStats();
  setBusyState(null);
}

function handleOperationComplete(payload) {
  const stats = payload && payload.stats ? payload.stats : {};
  setMessage(payload && payload.message ? payload.message : 'Operation completed.');
  renderOperationStats(stats);
  setBusyState(null);
}

function handleOperationError(message) {
  setMessage(message || 'Operation failed.', true);
  clearStats();
  setBusyState(null);
}

function renderCopyStats(stats) {
  const parts = [];
  if (typeof stats.tabCount === 'number') {
    parts.push(`<p>Tabs processed: ${stats.tabCount}</p>`);
  }
  if (typeof stats.urlCount === 'number') {
    parts.push(`<p>URLs copied: ${stats.urlCount}</p>`);
  }
  if (typeof stats.characterCount === 'number') {
    parts.push(`<p>Total characters: ${stats.characterCount}</p>`);
  }
  elements.stats.innerHTML = parts.join('');
}

function renderOperationStats(stats) {
  const parts = [];
  if (typeof stats.openedCount === 'number') {
    parts.push(`<p>URLs opened: ${stats.openedCount}</p>`);
  }
  if (stats.source === 'lastSession' && stats.savedAt) {
    try {
      const savedDate = new Date(stats.savedAt);
      parts.push(`<p>Last saved: ${savedDate.toLocaleString()}</p>`);
    } catch (error) {
      // ignore date parsing issues
    }
  }
  if (parts.length === 0) {
    clearStats();
    return;
  }
  elements.stats.innerHTML = parts.join('');
}

function setBusyState(action) {
  state.busyAction = action;

  const busy = Boolean(action);
  elements.copyButton.disabled = busy;
  elements.restoreButton.disabled = busy;
  elements.clipboardButton.disabled = busy;

  if (action === 'copy') {
    elements.copyButton.textContent = COPY_BUTTON_WORKING;
  } else {
    elements.copyButton.textContent = COPY_BUTTON_DEFAULT;
  }
}

function setMessage(message, isError = false) {
  elements.message.textContent = message || '';
  if (isError) {
    elements.message.classList.add('error');
  } else {
    elements.message.classList.remove('error');
  }
}

function clearStats() {
  elements.stats.textContent = '';
}

function handleImmediateError(message) {
  setMessage(message, true);
  clearStats();
  setBusyState(null);
}
