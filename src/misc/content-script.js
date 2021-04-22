import { getTitle, onTitleChange } from '../storage';
import { getKey } from '../util';

let override = false;
let overrideTitle = null;
let originalTitle = document.title;

const key = getKey(location.href);

// Update title on page load.
getTitle(key).then(updateTitle, errorHandler);

// Update title on title change.
onTitleChange(key, updateTitle);

function updateTitle(title) {
  if (typeof title === 'string') {

    if (!override) {
      override = true;
      console.log('[title] Title override enabled.');
      // Save the original title.
      originalTitle = document.title;
      // Start observing.
      startObserving();
    }

    overrideTitle = title;
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

function errorHandler(err) {
  console.error(err.message);
}
