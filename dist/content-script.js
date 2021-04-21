let override = false;
let overrideTitle = null;
let originalTitle = document.title;

const key = getKey(location.href);

// Update title on page load.
chrome.storage.local.get('titleMap', ({ titleMap }) => {
  updateTitle(parseTitleMap(titleMap));
});

// Update title on title map change.
chrome.storage.onChanged.addListener(({ titleMap }) => {
  if (titleMap)
    updateTitle(parseTitleMap(titleMap.newValue));
});

// Trim the hash from a URL.
function getKey(url) {
  return url.split('#')[0];
}

function parseTitleMap(map) {
  if (typeof map !== 'string') return {};
  try { map = JSON.parse(map); }
  catch (err) { return (console.warn(`[title] Invalid 'titleMap' value: ${err.message}`), {}); }
  return typeof map === 'object' && map !== null ? map
    : (console.warn(`[title] Invalid 'titleMap' value: Parsed JSON is not an object.`), {});
}

function updateTitle(map) {
  if (typeof map[key] === 'string') {

    if (!override) {
      override = true;
      console.log('[title] Title override enabled.');
      // Save the original title.
      originalTitle = document.title;
      // Start observing.
      startObserving();
    }

    overrideTitle = map[key];
    applyOverrideTitle();

  } else if (override) {

    override = false;
    console.log('[title] Title override disabled.');
    // Stop observing.
    stopObserving();
    // Apply the original title.
    document.title = originalTitle;

  }
}

// This observer will be active while title overriding is enabled.
const observer = new MutationObserver(() => {
  originalTitle = document.title;
  console.log(`[title] MutationObserver detected change to document title: ${originalTitle}`);
  applyOverrideTitle();
});

function startObserving() {
  observer.observe(document.querySelector('title'), {
    subtree: true,
    childList: true,
    characterData: true
  });
}

function stopObserving() {
  observer.disconnect();
}

// Apply `overrideTitle` without triggering the observer.
function applyOverrideTitle() {
  stopObserving();
  console.log(`[title] Applying override title: ${overrideTitle}`);
  document.title = overrideTitle;
  startObserving();
}
