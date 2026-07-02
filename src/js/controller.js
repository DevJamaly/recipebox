import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

// if (module.hot) module.hot.accept();

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

///////////////////////////////////////

const init = function () {
  recipeView.addRenderHandler(controlRecipes);
  searchView.addSearchHandler(controlSearchResults);
  paginationView.addPagesClickHandler(controlPagination);
  recipeView.addUpdateServingsHandler(controlServings);
};

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    //0) Spinner
    recipeView.renderSpinner();

    //0.5) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1) Loading Recipe
    await model.loadRecipe(id);

    // 2) Render recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError(error.message);
  }
};

const controlSearchResults = async function () {
  try {
    //1) Get Search query
    const query = searchView.getQuery();
    if (!query) return;
    resultsView.renderSpinner();

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    resultsView.render(model.getSearchResultsPage());

    // 4) Render the initial pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    resultsView.renderError(error.message);
    console.error(error.message);
  }
};

const controlPagination = function (gotoPageNum) {
  try {
    // 3) Render results
    resultsView.render(model.getSearchResultsPage(gotoPageNum));

    // 4) Render the initial pagination buttons
    paginationView.update(model.state.search);
  } catch (error) {
    paginationView.renderError(error.message);
    console.error(error.message);
  }
};

const controlServings = function (newServings) {
  try {
    //Update the recipe servings (in state)
    model.updateServings(newServings);

    //Update the recipe view
    recipeView.update(model.state.recipe);
  } catch (error) {
    recipeView.renderError(error.message);
  }
};

init();
