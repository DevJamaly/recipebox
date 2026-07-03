import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  constructor() {
    super(document.querySelector('.pagination'));
  }

  addPagesClickHandler(handler) {
    this.parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const gotoPage = Number.parseInt(btn.dataset.goto);
      handler(gotoPage);
    });
  }

  _generateMarkup() {
    const currPage = this.data.page;
    const numPages = Math.ceil(
      this.data.results.length / this.data.resultsPerPage,
    );

    //When to show previous button ?
    const prev = currPage !== 1 && numPages > 1;
    const next = numPages > 1 && currPage !== numPages;

    const prevBtn = `
     <button data-goto="${currPage - 1}" class="btn--inline pagination__btn--prev ${prev ? '' : 'hidden'}">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currPage - 1}</span>
          </button>
    `;

    const nextBtn = `
    <button data-goto="${currPage + 1}" class="btn--inline pagination__btn--next ${next ? '' : 'hidden'}">
            <span>Page ${currPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
    `;

    return prevBtn + nextBtn;
  }
}

export default new PaginationView();
