import { getTitleMap, onTitleMapChange } from '../storage';
import TitleEditor from './title-editor';

const editor = new TitleEditor(document.querySelector('#title-map tbody'));

// Update options on page load.
getTitleMap().then((map) => editor.update(map));

// Update options when any title changes.
onTitleMapChange((map) => editor.update(map));

window.editor = editor;
