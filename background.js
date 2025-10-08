importScripts('vendor/browser-adapter.js');

const browserApi = (typeof browserAdapter !== 'undefined' && browserAdapter && typeof browserAdapter.getBrowser === 'function')
  ? browserAdapter.getBrowser()
  : (typeof browser !== 'undefined' ? browser : undefined);

if (!browserApi) {
  throw new Error('Browser adapter failed to initialize in background context.');
}

const runtime = browserApi.runtime;
const storage = browserApi.storage;
const tabsApi = browserApi.tabs;
const windowsApi = browserApi.windows;

const INTERNAL_PROTOCOLS = new Set(['chrome:', 'chrome-extension:', 'moz-extension:', 'about:', 'edge:', 'view-source:']);

runtime.onMessage.addListener((message, sender, sendResponse) => {
  const action = message && message.action;

  let handlerPromise;
  switch (action) {
    case 'copyUrls':
      handlerPromise = handleCopyUrls(Boolean(message.copyAllTabs));
      break;
    case 'restoreLastSaved':
      handlerPromise = handleRestoreLastSaved(Boolean(message.openInNewWindow));
      break;
    case 'openFromClipboard':
      handlerPromise = handleRestoreFromClipboard(Boolean(message.openInNewWindow), message.clipboardText);
      break;
    default:
      handlerPromise = Promise.resolve({ ok: false, error: 'Unknown action' });
      break;
  }

  handlerPromise
    .then(result => sendResponse(result))
    .catch(error => {
      console.error('Unhandled background error:', error);
      sendResponse({ ok: false, error: error && error.message ? error.message : 'Unexpected error' });
    });

  return true;
});

async function handleCopyUrls(copyAllTabs) {
  try {
    await safeSendMessage({ action: 'updateStatus', message: 'Querying tabs…' });

    const tabs = await getTabs(copyAllTabs);
    const urls = tabs.map(tab => tab.url).filter(url => isUrlAllowed(url));

    if (urls.length === 0) {
      throw new ExtensionError('No copyable URLs found.');
    }

    const text = urls.join('\n');

    await safeSendMessage({
      action: 'updateStatus',
      message: `Preparing ${urls.length} URL${urls.length === 1 ? '' : 's'}…`
    });

    await storage.local.set({
      lastSession: {
        savedAt: new Date().toISOString(),
        urls
      }
    });

    await safeSendMessage({
      action: 'copyComplete',
      text,
      stats: {
        tabCount: tabs.length,
        urlCount: urls.length,
        characterCount: text.length
      }
    });

    return { ok: true, count: urls.length };
  } catch (error) {
    await reportCopyError(error);
    return { ok: false, error: error.message };
  }
}

async function handleRestoreLastSaved(openInNewWindow) {
  try {
    await safeSendMessage({ action: 'updateStatus', message: 'Loading last session…' });

    const { lastSession } = await storage.local.get('lastSession');
    if (!lastSession || !Array.isArray(lastSession.urls) || lastSession.urls.length === 0) {
      throw new ExtensionError('No saved session available.');
    }

    const parsedUrls = parseUrls(lastSession.urls);
    if (parsedUrls.length === 0) {
      throw new ExtensionError('Saved session is empty or invalid.');
    }

    const openedCount = await restoreUrls(parsedUrls, openInNewWindow);

    await safeSendMessage({
      action: 'operationComplete',
      message: `Opened ${openedCount} URL${openedCount === 1 ? '' : 's'} from last session.`,
      stats: {
        openedCount,
        source: 'lastSession',
        savedAt: lastSession.savedAt || null
      }
    });

    return { ok: true, count: openedCount };
  } catch (error) {
    await reportOperationError(error);
    return { ok: false, error: error.message };
  }
}

async function handleRestoreFromClipboard(openInNewWindow, clipboardText) {
  try {
    if (typeof clipboardText !== 'string' || clipboardText.trim().length === 0) {
      throw new ExtensionError('Clipboard does not contain any text.');
    }

    await safeSendMessage({ action: 'updateStatus', message: 'Parsing clipboard content…' });

    const parsedUrls = parseUrls(clipboardText);
    if (parsedUrls.length === 0) {
      throw new ExtensionError('No valid URLs found in the clipboard.');
    }

    const openedCount = await restoreUrls(parsedUrls, openInNewWindow);

    await safeSendMessage({
      action: 'operationComplete',
      message: `Opened ${openedCount} URL${openedCount === 1 ? '' : 's'} from clipboard.`,
      stats: {
        openedCount,
        source: 'clipboard'
      }
    });

    return { ok: true, count: openedCount };
  } catch (error) {
    await reportOperationError(error);
    return { ok: false, error: error.message };
  }
}

async function getTabs(copyAllTabs) {
  if (copyAllTabs) {
    return await tabsApi.query({});
  }

  const [activeTab] = await tabsApi.query({ active: true, currentWindow: true });
  if (!activeTab) {
    return await tabsApi.query({ currentWindow: true });
  }
  return await tabsApi.query({ windowId: activeTab.windowId });
}

async function restoreUrls(urls, openInNewWindow) {
  const uniqueUrls = urls.filter((url, index) => urls.indexOf(url) === index);

  if (openInNewWindow || !(await getCurrentWindowId())) {
    await windowsApi.create({ url: uniqueUrls });
    return uniqueUrls.length;
  }

  const [activeTab] = await tabsApi.query({ active: true, currentWindow: true });
  const targetWindowId = activeTab ? activeTab.windowId : null;

  if (!targetWindowId) {
    await windowsApi.create({ url: uniqueUrls });
    return uniqueUrls.length;
  }

  await tabsApi.update(activeTab.id, { url: uniqueUrls[0], active: true });

  for (let index = 1; index < uniqueUrls.length; index += 1) {
    await tabsApi.create({ url: uniqueUrls[index], windowId: targetWindowId, active: false });
  }

  return uniqueUrls.length;
}

async function getCurrentWindowId() {
  try {
    const currentWindow = windowsApi.getCurrent ? await windowsApi.getCurrent({ populate: false }) : null;
    return currentWindow ? currentWindow.id : null;
  } catch (error) {
    return null;
  }
}

function parseUrls(input) {
  let rawList = [];

  if (!input) {
    return [];
  }

  if (Array.isArray(input)) {
    rawList = input;
  } else if (typeof input === 'string') {
    const trimmed = input.trim();
    if (!trimmed) {
      return [];
    }

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        rawList = parsed;
      } else if (typeof parsed === 'string') {
        rawList = splitLines(parsed);
      } else if (parsed && Array.isArray(parsed.urls)) {
        rawList = parsed.urls;
      } else if (parsed && typeof parsed.urls === 'string') {
        rawList = splitLines(parsed.urls);
      } else {
        rawList = splitLines(trimmed);
      }
    } catch (_) {
      rawList = splitLines(trimmed);
    }
  } else if (typeof input === 'object' && input.urls) {
    if (Array.isArray(input.urls)) {
      rawList = input.urls;
    } else if (typeof input.urls === 'string') {
      rawList = splitLines(input.urls);
    } else {
      rawList = splitLines(String(input.urls));
    }
  }

  const validated = [];

  for (const candidate of rawList) {
    if (typeof candidate !== 'string') {
      continue;
    }
    const url = validateUrl(candidate.trim());
    if (url) {
      validated.push(url);
    }
  }

  return validated;
}

function splitLines(text) {
  return text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
}

function validateUrl(value) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    if (!isUrlAllowed(url.href)) {
      return null;
    }
    return url.href;
  } catch (error) {
    return null;
  }
}

function isUrlAllowed(url) {
  if (!url || typeof url !== 'string') {
    return false;
  }

  const lower = url.toLowerCase();
  for (const protocol of INTERNAL_PROTOCOLS) {
    if (lower.startsWith(protocol)) {
      return false;
    }
  }
  return true;
}

async function safeSendMessage(payload) {
  try {
    await runtime.sendMessage(payload);
  } catch (error) {
    if (error && error.message && error.message.includes('Receiving end does not exist')) {
      return;
    }
    console.warn('Failed to deliver message to popup:', error);
  }
}

async function reportCopyError(error) {
  console.error('Failed to copy URLs:', error);
  await safeSendMessage({
    action: 'copyError',
    message: `Failed to copy URLs: ${error && error.message ? error.message : 'Unknown error'}`
  });
}

async function reportOperationError(error) {
  console.error('Operation failed:', error);
  await safeSendMessage({
    action: 'operationError',
    message: error && error.message ? error.message : 'Operation failed.'
  });
}

function ExtensionError(message) {
  this.name = 'ExtensionError';
  this.message = message;
}
ExtensionError.prototype = Object.create(Error.prototype);
ExtensionError.prototype.constructor = ExtensionError;
