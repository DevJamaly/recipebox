import View from './View';
import { html } from '../helpers';
import { getMarkup } from './previewView';
import icons from 'url:../../img/icons.svg';

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
      .map(result => {
        return html` <li class="preview">${getMarkup(result)}</li> `;
      })
      .join('');
  }
}

export default new ResultsView();
