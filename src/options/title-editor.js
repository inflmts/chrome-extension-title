import TitleEntry from './title-entry';

export default class TitleEditor {

  constructor(element) {
    this.element = element;
    this.entries = {};
  }

  update(map) {
    const mapKeys = Object.keys(map);
    const entryKeys = Object.keys(this.entries);

    for (const key of entryKeys)
      if (!map[key])
        this.entries[key].destroy();

    for (const key of mapKeys) {
      if (this.entries[key])
        this.entries[key].setTitle(map[key]);
      else
        this.entries[key] = new TitleEntry(this, key, map[key]);
    }
  }

}
