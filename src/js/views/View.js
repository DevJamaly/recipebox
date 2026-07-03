import icons from 'url:../../img/icons.svg';

export default class View {
  #parentElement;
  #data;
  #errorMsg = `No recipes found for your query. Please try again!`;
  #message = `Start by searching for a recipe or an ingredient. Have fun!`;

  constructor(
    parentElement,
    errorMsg = this.#errorMsg,
    sucessMsg = this.#message,
  ) {
    this.#parentElement = parentElement;
    this.#errorMsg = errorMsg;
    this.#message = sucessMsg;
  }

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this.#data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    if (data == null) return this.renderError();
    this.#data = data;
    const newMarkup = this._generateMarkup();

    ///virtualDOM
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currElements = Array.from(this.parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const currEl = currElements[i];
      if (!newEl.isEqualNode(currEl)) {
        // sync text content only on elements whose first child is a text node
        if (newEl.firstChild?.nodeValue.trim() !== '') {
          currEl.textContent = newEl.textContent;
        }
        // sync all attributes (this is what fixes the hidden class, data-goto, etc.)
        Array.from(newEl.attributes).forEach(attr =>
          currEl.setAttribute(attr.name, attr.value),
        );
      }
    });
  }

  #clear() {
    this.#parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
        <div class="spinner">
                <svg>
                  <use href="${icons}#icon-loader"></use>
                </svg>
              </div>
        `;
    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(errorMsg = this.#errorMsg) {
    console.error(errorMsg);
    errorMsg ||= this.#errorMsg;
    const markup = `
        <div class="error">
              <div>
                <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
                </svg>
              </div>
              <p>${errorMsg}</p>
            </div>
        `;
    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMsg(message = this.#message) {
    const markup = `
        <div class="message">
              <div>
                <svg>
                  <use href="${icons}#icon-smile"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>
        `;
    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  #generate;

  get data() {
    return this.#data;
  }

  get parentElement() {
    return this.#parentElement;
  }

  get errorMsg() {
    return this.#errorMsg;
  }

  get sucessMsg() {
    return this.#message;
  }
}
