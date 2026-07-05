import View from './View';
import { getMarkup } from './previewView';
import { html } from '../helpers';
import icons from 'url:../../img/icons.svg';

class BookmarksView extends View {
  constructor() {
    super(
      document.querySelector('.bookmarks'),
      `No bookmarks yet. Find a nice recipe and bookmark it :)`,
      `No bookmarks yet. Find a nice recipe and bookmark it :)`,
    );
  }

  addRenderHandler(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return html`
      <ul class="bookmarks__list">
        ${this.#generateBookmarksList()}
      </ul>
      <div class="bookmarks__clear">
        <button class="btn--clear-bookmarks">
          <svg>
            <use href="${icons}#icon-trash"></use>
          </svg>
          Clear all
        </button>
      </div>
    `;
  }

  #generateBookmarksList() {
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
