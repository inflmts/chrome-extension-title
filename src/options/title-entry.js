import { resetTitle, setTitle } from '../storage';

export default class TitleEntry {

  constructor(editor, key, title) {
    this.editor = editor;

    // <td class="title-entry-key">

    this.keyText = document.createElement('div');
    this.keyText.innerText = key;

    this.keyElement = document.createElement('td');
    this.keyElement.classList.add('key');
    this.keyElement.append(this.keyText);

    // <td class="title-entry-title">

    this.titleInput = document.createElement('input');
    this.titleInput.addEventListener('input', () => {
      // TODO: handle errors
      setTitle(this.key, this.titleInput.value).catch(({ message }) => {
        console.error(`Failed to set title for [${this.key}]: ${message}`);
      });
    });

    this.titleElement = document.createElement('td');
    this.titleElement.classList.add('title');
    this.titleElement.append(this.titleInput);

    // <tr class="title-entry">

    this.element = document.createElement('tr');
    this.element.classList.add('title-entry');
    this.element.append(this.keyElement, this.titleElement);

    this.editor.element.append(this.element);

    this.key = key;
    this.setTitle(title);
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
