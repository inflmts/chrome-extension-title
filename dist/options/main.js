import TitleEditor from './title-editor.js';
import { parseTitleMap } from './util.js';

const editor = new TitleEditor(document.querySelector('#title-map tbody'));

// Update options on page load.
chrome.storage.local.get('titleMap', ({ titleMap }) => {
  editor.update(parseTitleMap(titleMap));
});

// Update options on title map change.
chrome.storage.onChanged.addListener(({ titleMap }) => {
  if (titleMap)
    editor.update(parseTitleMap(titleMap.newValue));
});

window.editor = editor;
