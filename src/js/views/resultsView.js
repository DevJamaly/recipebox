import View from './View';
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
    console.log(this.data);
    return this.data
      .map(result => this.#generatePreviewMarkup(result))
      .join('');
  }

  #generatePreviewMarkup(recipe) {
    return `
        <li class="preview">
            <a class="preview__link" href="#${recipe.id}">
              <figure class="preview__fig">
                <img src="${recipe.imageUrl}" alt="${recipe.title}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${recipe.title}</h4>
                <p class="preview__publisher">${recipe.publisher}</p>                
              </div>
            </a>
          </li>
      `;
  }
}

export default new ResultsView();
