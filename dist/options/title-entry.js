import { parseTitleMap } from './util.js';

export default class TitleEntry {

  constructor(editor, key, title) {
    this.editor = editor;

    // <td class="title-entry-key">

    this.keyInput = document.createElement('input');
    this.keyInput.addEventListener('focus', () => {
      this.keyInput.select();
    });
    this.keyInput.addEventListener('change', () => {
      chrome.storage.local.get('titleMap', ({ titleMap }) => {
        const map = parseTitleMap(titleMap);
        delete map[this.key];
        map[this.keyInput.value] = this.titleInput.value;
        chrome.storage.local.set({ titleMap: JSON.stringify(map) });
      });
    });

    this.keyElement = document.createElement('td');
    this.keyElement.classList.add('title-entry-key');
    this.keyElement.append(this.keyInput);

    // <td class="title-entry-title">

    this.titleInput = document.createElement('input');
    this.titleInput.addEventListener('input', () => {
      chrome.storage.local.get('titleMap', ({ titleMap }) => {
        const map = parseTitleMap(titleMap);
        map[this.key] = this.titleInput.value;
        chrome.storage.local.set({ titleMap: JSON.stringify(map) });
      });
    });

    this.titleElement = document.createElement('td');
    this.titleElement.classList.add('title-entry-title');
    this.titleElement.append(this.titleInput);

    // <tr class="title-entry">

    this.element = document.createElement('tr');
    this.element.classList.add('title-entry');
    this.element.append(this.keyElement, this.titleElement);

    this.editor.element.append(this.element);

    this.setKey(key);
    this.setTitle(title);
  }

  setKey(key) {
    this.key = key;
    this.keyInput.value = key;
  }

  setTitle(title) {
    if (document.activeElement !== this.titleInput)
      this.titleInput.value = title;
  }

  destroy() {
    this.editor.element.removeChild(this.element);
    delete this.editor.entries[this.key];
  }

}
