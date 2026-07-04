import View from './View';
import PreviewView from './previewView';
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
    return this.data.map(result => PreviewView.getMarkup(result)).join('');
  }
}

export default new ResultsView();
