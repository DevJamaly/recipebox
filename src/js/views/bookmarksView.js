import View from './View';
import PreviewView from './previewView';
import icons from 'url:../../img/icons.svg';

class BookmarksView extends View {
  constructor() {
    super(
      document.querySelector('.bookmarks__list'),
      `No bookmarks yet. Find a nice recipe and bookmark it :)`,
      `No bookmarks yet. Find a nice recipe and bookmark it :)`,
    );
  }

  addRenderHandler(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this.data.map(bookmark => PreviewView.getMarkup(bookmark)).join('');
  }
}

export default new BookmarksView();
