import View from './View.js';
import { getMarkup } from './previewView.js';
import { html } from '../helpers.js';
import icons from 'url:../../img/icons.svg';

class BookmarksView extends View {
  constructor() {
    super(
      document.querySelector('.bookmarks'),
      `No bookmarks yet. Find a nice recipe and bookmark it :)`,
      `No bookmarks yet. Find a nice recipe and bookmark it :)`,
    );
  }

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  addHandlerBookmarkDelete(handler) {
    this.parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.preview__btn--delete');
      if (!btn) return;
      handler(btn.dataset.id);
    });
  }

  addHandlerBookmarksClear(handler) {
    this.parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--clear-bookmarks');
      if (!btn) return;
      handler();
    });
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
      .map(
        bookmark => html`
          <li class="preview">
            ${getMarkup(bookmark)}
            <button class="preview__btn--delete" data-id="${bookmark.id}">
              <svg>
                <use href="${icons}#icon-trash"></use>
              </svg>
            </button>
          </li>
        `,
      )
      .join('');
  }
}

export default new BookmarksView();
