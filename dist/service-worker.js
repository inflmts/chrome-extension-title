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
chrome.tabs.onUpdated.addListener((_tabId, { status }, tab) => {
  if (status === 'complete') {
    chrome.storage.local.get('titleMap', ({ titleMap }) => {
      updateIcon(tab, parseTitleMap(titleMap));
    });
  }
});

// Update icons on title map change.
chrome.storage.onChanged.addListener(({ titleMap }) => {
  if (titleMap)
    updateIcons(parseTitleMap(titleMap.newValue));
});

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
