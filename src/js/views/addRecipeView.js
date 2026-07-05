import View from './View';
import { html } from '../helpers';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  #window = document.querySelector('.add-recipe-window');
  #overlay = document.querySelector('.overlay');
  #btnOpen = document.querySelector('.nav__btn--add-recipe');
  #btnClose = document.querySelector('.btn--close-modal');
  #formMarkup = this.parentElement.innerHTML;

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
    const isOpen = !this.#window.classList.contains('hidden');
    // if (isOpen) this.#resetForm();
    this.#overlay.classList.toggle('hidden');
    this.#window.classList.toggle('hidden');
  }

  #resetForm() {
    // this.parentElement.innerHTML = this.#formMarkup;
  }

  #addHandlerAddIngredient() {
    this.parentElement.addEventListener('click', e => {
      if (!e.target.closest('.btn--add-ingredient')) return;
      const list = this.parentElement.querySelector('.ingredients-list');
      list.insertAdjacentHTML('beforeend', this.#ingredientRowMarkup());
    });
  }

  #addHandlerDeleteIngredient() {
    this.parentElement.addEventListener('click', e => {
      const deleteBtn = e.target.closest('.ingredient__delete');
      if (!deleteBtn) return;
      deleteBtn.closest('.ingredient-row').remove();
    });
  }

  addShowWindowHandler() {
    this.#btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHideWindowHandler() {
    this.#btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this.#overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addUploadHandler(handler) {
    this.parentElement.addEventListener('submit', e => {
      e.preventDefault();
      if (!this.#validate()) return;
      const dataArr = [...new FormData(this.parentElement)];
      const data = Object.fromEntries(dataArr);
      data.ingredients = [
        ...this.parentElement.querySelectorAll('.ingredient-row'),
      ].map(row => {
        return {
          quantity: row.querySelector('.ingredient__qty').value.trim(),
          unit: row.querySelector('.ingredient__unit').value.trim(),
          description: row
            .querySelector('.ingredient__description')
            .value.trim(),
        };
      });
      handler(data);
    });
  }

  #ingredientRowMarkup() {
    return html`
      <li class="ingredient-row">
        <input
          type="number"
          step="any"
          min="1"
          class="ingredient__qty"
          placeholder="Qty"
        />
        <input type="text" class="ingredient__unit" placeholder="Unit" />
        <input
          type="text"
          class="ingredient__description"
          placeholder="Description"
        />
        <div
          class="ingredient__delete"
          role="button"
          aria-label="Remove ingredient"
        >
          <svg class="ingredient__delete-icon">
            <use href="${icons}#icon-trash-2"></use>
          </svg>
        </div>
      </li>
    `;
  }

  #validate() {
    const form = this.parentElement;
    const errors = new Set();

    form
      .querySelectorAll('.input-error')
      .forEach(el => el.classList.remove('input-error'));

    const checkLength = (input, min, max, label) => {
      const len = input.value.trim().length;
      const bad = len < min || len > max;
      input.classList.toggle('input-error', bad);
      if (bad)
        errors.add(`${label} must be between ${min} and ${max} characters.`);
    };

    const checkNumber = (input, label, isRequired = true) => {
      const val = input.value.trim();
      const bad = isRequired
        ? val === '' || Number.isNaN(Number(val))
        : val !== '' && Number.isNaN(Number(val));
      input.classList.toggle('input-error', bad);
      if (bad) errors.add(`${label} must be a number.`);
    };

    checkLength(form.querySelector('[name="title"]'), 3, 150, 'Title');
    checkLength(form.querySelector('[name="sourceUrl"]'), 10, 300, 'URL');
    checkLength(form.querySelector('[name="image"]'), 10, 300, 'Image URL');
    checkLength(form.querySelector('[name="publisher"]'), 2, 100, 'Publisher');
    checkNumber(form.querySelector('[name="servings"]'), 'Servings');

    // prep time: at least one filled, both numeric if present
    const hoursInput = form.querySelector('[name="prepTimeHours"]');
    const minsInput = form.querySelector('[name="prepTimeMinutes"]');
    const bothEmpty =
      hoursInput.value.trim() === '' && minsInput.value.trim() === '';

    if (bothEmpty) {
      hoursInput.classList.add('input-error');
      minsInput.classList.add('input-error');
      errors.add('Enter a prep time in hours, minutes, or both.');
    } else {
      checkNumber(hoursInput, 'Prep time', false);
      checkNumber(minsInput, 'Prep time', false);
    }

    // ingredients
    const rows = [...form.querySelectorAll('.ingredient-row')];
    if (rows.length === 0) errors.add('Add at least one ingredient.');

    rows.forEach(row => {
      checkLength(
        row.querySelector('.ingredient__description'),
        2,
        100,
        'Ingredient description',
      );
    });

    this.#renderErrorSummary(errors);
    return errors.size === 0;
  }

  #renderErrorSummary(errors) {
    const errorEl = this.parentElement.querySelector('.upload__error');
    errorEl.textContent =
      errors.size === 0
        ? ''
        : errors.size === 1
          ? [...errors][0]
          : `Please fix the ${errors.size} highlighted fields.`;
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
