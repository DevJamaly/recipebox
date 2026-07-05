class SearchView {
  #parentElement = document.querySelector('.search');
  #searchField = this.#parentElement.querySelector('.search__field');

  getQuery() {
    const query = this.#searchField.value;
    this.#clearSearchField();
    return query;
  }

  addHandlerSearch(handler) {
    this.#parentElement.addEventListener('submit', e => {
      e.preventDefault();
      handler();
    });
  }

  #clearSearchField() {
    this.#searchField.value = '';
    this.#searchField.blur();
  }
}

export default new SearchView();
