import TitleEntry from './title-entry';

export default class TitleEditor {

  constructor(element) {
    this.element = element;
    this.entries = {};
  }

  init(map) {
    for (const key of Object.keys(map))
      this.entries[key] = new TitleEntry(this, key, map[key]);
  }

  update(changes) {
    for (const key of Object.keys(changes)) {
      // If the new title is not a string, destroy the entry for the key if it exists.
      if (typeof changes[key] !== 'string')
        this.entries[key]?.destroy();
      // If an entry already exists for the key, update the title.
      else if (this.entries[key])
        this.entries[key].setTitle(changes[key]);
      // Otherwise, create a new entry.
      else
        this.entries[key] = new TitleEntry(this, key, changes[key]);
    }
  }

}
