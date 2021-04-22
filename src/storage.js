// This module assumes access to the chrome.storage API.

// Returns a promise that resolves to the title corresponding to the provided key
// or rejects with chrome.runtime.lastError
export function getTitle(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, _handler((map) => resolve(map[key]), reject));
  });
}

// Returns a promise that resolves after setting the title corresponding to the provided key
// or rejects with chrome.runtime.lastError
export function setTitle(key, title) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [key]: title }, _handler(resolve, reject));
  });
}

// Returns a promise that resolves after resetting the title corresponding to the provided key
// or rejects with chrome.runtime.lastError
export function resetTitle(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.remove(key, _handler(resolve, reject));
  });
}

// Returns a promise that resolves to the entire title map
// or rejects with chrome.runtime.lastError
export function getTitleMap() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(_handler(resolve, reject));
  });
}

// When the title of the provided key changes, call `callback` with the new title.
export function onTitleChange(key, callback) {
  chrome.storage.onChanged.addListener((changes) => {
    if (changes[key])
      callback(changes[key].newValue);
  });
}

// When any title changes, call `callback` with a map of changed titles.
export function onTitleMapChange(callback) {
  chrome.storage.onChanged.addListener((changes) => {
    const out = {};
    for (const key of Object.keys(changes))
      out[key] = changes[key].newValue;
    callback(out);
  });
}

function _handler(resolve, reject, x) {
  return (x) => {
    if (chrome.runtime.lastError)
      reject(chrome.runtime.lastError);
    else
      resolve(x);
  };
}

/** @deprecated */
export function parseTitleMap(map) {
  if (map === undefined)
    return {};
  if (typeof map !== 'string')
    return (console.warn(`Invalid 'titleMap' value: Stored value is not a string:`, map), {});
  try { map = JSON.parse(map); }
  catch (err) { return (console.warn(`Invalid 'titleMap' value: ${err.message}`), {}); }
  return (typeof map === 'object' && map !== null) ? map
    : (console.warn(`Invalid 'titleMap' value: Parsed JSON is not an object:`, map), {});
}
