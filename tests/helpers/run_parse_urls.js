const fs = require('fs');
const path = require('path');
const vm = require('vm');

const projectRoot = path.resolve(__dirname, '..', '..');
const backgroundSource = fs.readFileSync(path.join(projectRoot, 'background.js'), 'utf8');

const stubApi = {
  runtime: {
    onMessage: { addListener: () => {} },
    sendMessage: () => Promise.resolve(),
  },
  storage: {
    local: {
      get: () => Promise.resolve({}),
      set: () => Promise.resolve(),
    },
  },
  tabs: {
    query: () => Promise.resolve([]),
    create: () => Promise.resolve({}),
    update: () => Promise.resolve({}),
  },
  windows: {
    create: () => Promise.resolve({}),
    getCurrent: () => Promise.resolve({ id: 1 }),
  },
};

const context = {
  console,
  importScripts: () => {},
  browserAdapter: { getBrowser: () => stubApi },
  setTimeout,
  clearTimeout,
  URL,
  Promise,
  Error,
};

vm.createContext(context);
vm.runInContext(backgroundSource, context, { filename: 'background.js' });

const inputJson = process.env.INPUT_JSON;
if (!inputJson) {
  throw new Error('INPUT_JSON environment variable is required');
}

const inputValue = JSON.parse(inputJson);
const result = context.parseUrls(inputValue);
process.stdout.write(JSON.stringify(result));
