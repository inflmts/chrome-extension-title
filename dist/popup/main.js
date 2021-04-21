const inputElement = document.getElementById('input');
const resetButton = document.getElementById('reset-button');
const optionsButton = document.getElementById('options-button');
const errorElement = document.getElementById('error');

syncFromActiveTab();

inputElement.addEventListener('input', () => {
  withActiveTab((tab) => {
    chrome.storage.local.get('titleMap', ({ titleMap }) => {
      const map = parseTitleMap(titleMap);
      map[getKey(tab.url)] = inputElement.value;
      chrome.storage.local.set({ titleMap: JSON.stringify(map) });
    });
  });
});

resetButton.addEventListener('click', () => {
  withActiveTab((tab) => {
    chrome.storage.local.get('titleMap', ({ titleMap }) => {
      const map = parseTitleMap(titleMap);
      delete map[getKey(tab.url)];
      chrome.storage.local.set({ titleMap: JSON.stringify(map) });
      setTimeout(syncFromActiveTab, 100);
    });
  });
});

// The options button will open the options page.
// If the current tab is the new tab page, open in the current tab.
// If already in the options page, just close the popup.
// Otherwise, open in a new tab.
optionsButton.addEventListener('click', () => {
  withActiveTab((tab) => {
    const url = chrome.runtime.getURL('options/index.html');
    if (tab.url === 'chrome://newtab/') {
      chrome.tabs.update(tab.id, { url });
      window.close();
    } else if (tab.url === url) {
      window.close();
    } else {
      chrome.tabs.create({ url });
    }
  });
});

// Call `callback` with the currently active tab, if there is one.
function withActiveTab(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, (activeTabs) => {
    if (activeTabs.length)
      callback(activeTabs[0]);
  });
}

function syncFromActiveTab() {
  withActiveTab((tab) => {
    inputElement.value = tab.title;
  });
}

// Trim the hash from a URL.
function getKey(url) {
  return url.split('#')[0];
}

function parseTitleMap(map) {
  if (typeof map !== 'string') return {};
  try { map = JSON.parse(map); }
  catch (err) { return (console.warn(`Invalid 'titleMap' value: ${err.message}`), {}); }
  return typeof map === 'object' && map !== null ? map
    : (console.warn(`Invalid 'titleMap' value: Parsed JSON is not an object.`), {});
}
