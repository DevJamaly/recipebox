import View from './View';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  #window = document.querySelector('.add-recipe-window');
  #overlay = document.querySelector('.overlay');
  #btnOpen = document.querySelector('.nav__btn--add-recipe');
  #btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super(
      document.querySelector('.upload'),
      `There was an error uploading your recipe !`,
      `Recipe was sucessfully uploaded :)`,
    );
    this.addShowWindowHandler();
    this.addHideWindowHandler();
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
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
