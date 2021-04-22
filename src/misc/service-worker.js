import { getTitle, onTitleMapChange } from '../storage';
import { getKey } from '../util';

const ICON = generateIconPaths('assets/icon-{size}.png');
const ICON_OVERRIDE = generateIconPaths('assets/icon-override-{size}.png');
const ICON_ERROR = generateIconPaths('assets/icon-error-{size}.png');

// Generate icon paths object by replacing '{size}' in `format` with each size.
function generateIconPaths(format) {
  const sizes = [32];
  const paths = {};
  for (const size of sizes)
    paths[size] = format.replace(/\{size\}/g, size);
  return paths;
}

// Update icons on page load.
chrome.tabs.onUpdated.addListener((tabId, { status }, tab) => {
  if (status === 'complete') {
    const key = getKey(tab.url);
    getTitle(key).then((title) => {
      chrome.action.setIcon({ tabId, path: typeof title === 'string' ? ICON_OVERRIDE : ICON });
    }, errorHandler);
  }
});

// Update icons when any title changes.
onTitleMapChange(updateIcons);

function updateIcon(tab, map) {
  const key = getKey(tab.url);
  if (typeof map[key] === 'string')
    chrome.action.setIcon({ tabId: tab.id, path: ICON_OVERRIDE });
  else
    chrome.action.setIcon({ tabId: tab.id, path: ICON });
}

async function updateIcons(map) {
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs)
    updateIcon(tab, map);
}

function errorHandler({ message }) {
  console.error(message);
}
