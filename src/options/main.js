import { getTitleMap, onTitleMapChange } from '../storage';
import TitleEditor from './title-editor';

const editor = new TitleEditor(document.querySelector('#title-map tbody'));

// Initialize the editor.
getTitleMap().then((map) => editor.init(map), ({ message }) => {
  console.error(`Failed to get title map: ${message}`);
});

// Update the editor when any title changes.
onTitleMapChange((changes) => editor.update(changes));

window.editor = editor;
