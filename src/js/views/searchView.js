class SearchView {
  #parentElement = document.querySelector('.search');
  #searchField = this.#parentElement.querySelector('.search__field');
  #data;
  #errorMsg = `No recipes found for your query. Please try again!`;
  #message = `Start by searching for a recipe or an ingredient. Have fun!`;

  getQuery() {
    const query = this.#searchField.value;
    this.#clearSearchField();
    return query;
  }

  addSearchHandler(handler) {
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
