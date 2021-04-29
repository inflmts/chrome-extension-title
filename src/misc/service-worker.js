import { getTitle, onTitleMapChange } from '../storage';
import { isString, getKey } from '../util';

const ICON = generateIconPaths('assets/icon-{size}.png');
const ICON_OVERRIDE = generateIconPaths('assets/icon-override-{size}.png');
// const ICON_ERROR = generateIconPaths('assets/icon-error-{size}.png');

console.group('Generated icon paths:');
console.log('ICON', ICON);
console.log('ICON_OVERRIDE', ICON_OVERRIDE);
console.groupEnd();

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
    if (key === null) return; // Don't act on unusable URLs.

    getTitle(key).then((title) => {
      const isOverride = isString(title);
      console.log(`Page load detected: [${key}], using ${isOverride ? 'ICON_OVERRIDE' : 'ICON'}`);
      chrome.action.setIcon({ tabId, path: isOverride ? ICON_OVERRIDE : ICON });
    }, ({ message }) => {
      console.error(`Failed to get title for [${key}]: ${message}`);
    });
  }
});

// Update icons when any title changes.
onTitleMapChange(async (changes) => {
  console.group('Title changes detected:');

  for (const [key, title] of Object.entries(changes)) {
    const isOverride = isString(title);
    const path = isOverride ? ICON_OVERRIDE : ICON;
    const tabs = await chrome.tabs.query({}); // all tabs

    let updatedTabsCount = 0;
    for (const tab of tabs) {
      if (key === getKey(tab.url)) {
        chrome.action.setIcon({ tabId: tab.id, path });
        updatedTabsCount++;
      }
    }

    console.log(`[${key}] ${isOverride ? `set to '${title}'` : 'reset'}, updated ${updatedTabsCount} tabs.`);
  }

  console.groupEnd();
});
