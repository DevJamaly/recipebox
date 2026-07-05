import View from './View';
import { getMarkup } from './previewView';
import { html } from '../helpers';
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
    return this.data
      .map(bookmark => {
        return html`
          <li class="preview">
            ${getMarkup(bookmark)}
            <button class="preview__btn--delete" data-id="123">
              <svg>
                <use href="${icons}#icon-trash"></use>
              </svg>
            </button>
          </li>
        `;
      })
      .join('');
  }
}

export default new BookmarksView();
