import { html } from '../helpers';
import icons from 'url:../../img/icons.svg';

export const getMarkup = function (recipe) {
  const id = window.location.hash.slice(1); //Check the URL for the ID
  return html`
    <a
      class="preview__link ${recipe.id === id ? 'preview__link--active' : ''}"
      href="#${recipe.id}"
    >
      <figure class="preview__fig">
        <img src="${recipe.imageUrl}" alt="${recipe.title}" />
      </figure>
      <div class="preview__data">
        <h4 class="preview__title">${recipe.title}</h4>
        <p class="preview__publisher">${recipe.publisher}</p>
        <div class="preview__user-generated ${recipe.key ? '' : 'hidden'}">
          <svg>
            <use href="${icons}#icon-user"></use>
          </svg>
        </div>
      </div>
    </a>
  `;
};
