import View from './View';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  #window = document.querySelector('.add-recipe-window');
  #overlay = document.querySelector('.overlay');
  #btnOpen = document.querySelector('.nav__btn--add-recipe');
  #btnClose = document.querySelector('.btn--close-modal');
  #ingredientsList = document.querySelector('.ingredients-list');
  #btnAddIngredient = document.querySelector('.btn--add-ingredient');

  constructor() {
    super(
      document.querySelector('.upload'),
      `There was an error uploading your recipe !`,
      `Recipe was sucessfully uploaded :)`,
    );
    this.addShowWindowHandler();
    this.addHideWindowHandler();
    this.#addHandlerAddIngredient();
    this.#addHandlerDeleteIngredient();
  }

  toggleWindow() {
    this.#overlay.classList.toggle('hidden');
    this.#window.classList.toggle('hidden');
  }

  addShowWindowHandler() {
    this.#btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHideWindowHandler() {
    this.#btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this.#overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addUploadHandler(handler) {
    this.parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      console.log(dataArr, data);
      // handler(data);
    });
  }

  #addHandlerAddIngredient() {
    this.#btnAddIngredient.addEventListener('click', () => {
      const firstRow = this.#ingredientsList.querySelector('.ingredient-row');
      const newRow = firstRow.cloneNode(true);
      newRow.querySelectorAll('input').forEach(input => {
        input.value = '';
        input.classList.remove('input-error');
      });
      this.#ingredientsList.insertAdjacentElement('beforeend', newRow);
    });
  }

  #addHandlerDeleteIngredient() {
    this.#ingredientsList.addEventListener('click', e => {
      const deleteBtn = e.target.closest('.ingredient__delete');
      if (!deleteBtn) return;
      deleteBtn.closest('.ingredient-row').remove();
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
