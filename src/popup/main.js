import { resetTitle, setTitle } from '../storage';
import { getKey } from '../util';

const inputElement = document.getElementById('input');
const resetButton = document.getElementById('reset-button');
const optionsButton = document.getElementById('options-button');
const errorElement = document.getElementById('error');

syncFromActiveTab();

inputElement.addEventListener('input', () => {
  withActiveTab((tab) => {
    const key = getKey(tab.url);
    setTitle(key, inputElement.value).catch(errorHandler);
  });
});

resetButton.addEventListener('click', () => {
  withActiveTab((tab) => {
    const key = getKey(tab.url);
    resetTitle(key).then(
      () => setTimeout(syncFromActiveTab, 100),
      errorHandler
    );
  });
});

// The options button will open the options page.
// If the current tab is the new tab page, open in the current tab.
// If already in the options page, just close the popup.
// Otherwise, open in a new tab.
optionsButton.addEventListener('click', () => {
  withActiveTab((tab) => {
    const url = chrome.runtime.getURL('options/index.html');
    if (tab.url === 'chrome://newtab/')
      chrome.tabs.update(tab.id, { url }), window.close();
    else if (tab.url === url)
      window.close();
    else
      chrome.tabs.create({ url });
  });
});

// Call `callback` with the currently active tab, if there is one.
function withActiveTab(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, (activeTabs) => {
    if (activeTabs.length)
      callback(activeTabs[0]);
  });
}

// Sync the value of `inputElement` with the title of the current tab.
function syncFromActiveTab() {
  withActiveTab((tab) => {
    inputElement.value = tab.title;
  });
}

function errorHandler({ message }) {
  errorElement.hidden = false;
  errorElement.innerText = message;
}
