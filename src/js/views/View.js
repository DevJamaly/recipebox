import { html } from '../helpers';
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

  getMarkup(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this.#data = data;
    return this._generateMarkup();
  }

  render(data) {
    const markup = this.getMarkup(data);
    const newDOM = document.createRange().createContextualFragment(markup);

    this.#patch(newDOM, this.parentElement);
  }

  // walks two parallel node trees, patching only what actually differs
  #patch(newParent, oldParent) {
    const newNodes = Array.from(newParent.childNodes);
    const oldNodes = Array.from(oldParent.childNodes);
    const max = Math.max(newNodes.length, oldNodes.length);

    for (let i = 0; i < max; i++) {
      const newNode = newNodes[i];
      const oldNode = oldNodes[i];

      // new list is longer -> append what's missing (e.g. new search result)
      if (newNode && !oldNode) {
        oldParent.appendChild(newNode.cloneNode(true));
        continue;
      }
      // old list is longer -> remove what's gone (e.g. fewer results on last page)
      if (!newNode && oldNode) {
        oldParent.removeChild(oldNode);
        continue;
      }
      // both text nodes -> patch value directly
      if (
        newNode.nodeType === Node.TEXT_NODE &&
        oldNode.nodeType === Node.TEXT_NODE
      ) {
        if (newNode.nodeValue.trim() !== oldNode.nodeValue.trim())
          oldNode.nodeValue = newNode.nodeValue;
        continue;
      }
      // different node type or tag entirely -> can't patch in place, swap wholesale
      if (
        newNode.nodeType !== oldNode.nodeType ||
        (newNode.nodeType === Node.ELEMENT_NODE &&
          newNode.tagName !== oldNode.tagName)
      ) {
        oldParent.replaceChild(newNode.cloneNode(true), oldNode);
        continue;
      }
      // same tag -> sync attributes (this also fixes your earlier "hidden class" bug), then recurse
      if (newNode.nodeType === Node.ELEMENT_NODE) {
        Array.from(newNode.attributes).forEach(attr => {
          if (oldNode.getAttribute(attr.name) !== attr.value)
            oldNode.setAttribute(attr.name, attr.value);
        });
        Array.from(oldNode.attributes).forEach(attr => {
          if (!newNode.hasAttribute(attr.name))
            oldNode.removeAttribute(attr.name);
        });

        this.#patch(newNode, oldNode);
      }
    }
  }

  #clear() {
    this.#parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = html`
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
    const markup = html`
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
    const markup = html`
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
