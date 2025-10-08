(function initBrowserAdapter(global) {
  if (!global) {
    return;
  }

  const registerAdapter = (browserApi) => {
    if (!browserApi) {
      return;
    }

    const adapter = {
      getBrowser() {
        return browserApi;
      }
    };

    if (typeof global.browserAdapter === 'undefined' || !global.browserAdapter) {
      global.browserAdapter = adapter;
    } else if (typeof global.browserAdapter.getBrowser !== 'function') {
      global.browserAdapter.getBrowser = adapter.getBrowser;
    }
  };

  if (typeof global.browser !== 'undefined' && global.browser) {
    if (!global.browser.action && global.chrome && global.chrome.action) {
      global.browser.action = global.chrome.action;
    }
    registerAdapter(global.browser);
    return;
  }

  const chromeApi = global.chrome;
  if (!chromeApi) {
    return;
  }

  const runtime = chromeApi.runtime;
  const storage = chromeApi.storage;
  const tabs = chromeApi.tabs;
  const windows = chromeApi.windows;

  const promisify = (fn, context) => {
    return (...args) => {
      return new Promise((resolve, reject) => {
        let settled = false;
        const callback = (result) => {
          if (settled) {
            return;
          }
          settled = true;
          if (runtime && runtime.lastError) {
            reject(new Error(runtime.lastError.message));
          } else {
            resolve(result);
          }
        };

        try {
          fn.apply(context, [...args, callback]);
        } catch (error) {
          settled = true;
          reject(error);
        }
      });
    };
  };

  const browserShim = {
    action: chromeApi.action,
    runtime: {
      getURL: runtime && runtime.getURL ? runtime.getURL.bind(runtime) : undefined,
      onMessage: runtime ? runtime.onMessage : undefined,
      sendMessage: runtime ? promisify(runtime.sendMessage, runtime) : undefined,
      openOptionsPage: runtime && runtime.openOptionsPage ? promisify(runtime.openOptionsPage, runtime) : undefined
    },
    storage: {
      sync: {},
      local: {}
    },
    tabs: {},
    windows: {}
  };

  if (storage && storage.sync) {
    browserShim.storage.sync.get = promisify(storage.sync.get, storage.sync);
    browserShim.storage.sync.set = promisify(storage.sync.set, storage.sync);
    if (storage.sync.remove) {
      browserShim.storage.sync.remove = promisify(storage.sync.remove, storage.sync);
    }
  }

  if (storage && storage.local) {
    browserShim.storage.local.get = promisify(storage.local.get, storage.local);
    browserShim.storage.local.set = promisify(storage.local.set, storage.local);
    if (storage.local.remove) {
      browserShim.storage.local.remove = promisify(storage.local.remove, storage.local);
    }
  }

  if (tabs) {
    browserShim.tabs.query = promisify(tabs.query, tabs);
    browserShim.tabs.create = promisify(tabs.create, tabs);
    browserShim.tabs.update = promisify(tabs.update, tabs);
  }

  if (windows) {
    browserShim.windows.create = promisify(windows.create, windows);
    if (windows.getCurrent) {
      browserShim.windows.getCurrent = promisify(windows.getCurrent, windows);
    }
  }

  global.browser = browserShim;
  registerAdapter(browserShim);
})(typeof globalThis !== 'undefined' ? globalThis : (typeof self !== 'undefined' ? self : this));
