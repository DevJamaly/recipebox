import View from './View.js';
import { html } from '../helpers.js';
import { getMarkup } from './previewView.js';

class ResultsView extends View {
  constructor() {
    super(
      document.querySelector('.results'),
      `No recipes found for your query. Please try again!`,
      `Start by searching for a recipe or an ingredient. Have fun!`,
    );
  }

  _generateMarkup() {
    return this.data
      .map(result => html`<li class="preview">${getMarkup(result)}</li>`)
      .join('');
  }
}

export default new ResultsView();
