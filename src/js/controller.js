import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { MODAL_CLOSE_SEC } from './config.js';

import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

// if (module.hot) module.hot.accept();

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

///////////////////////////////////////

const init = function () {
  bookmarksView.addRenderHandler(controlBookmarks);
  recipeView.addRenderHandler(controlRecipes);
  searchView.addSearchHandler(controlSearchResults);
  paginationView.addPagesClickHandler(controlPagination);
  recipeView.addUpdateServingsHandler(controlServings);
  recipeView.addUpdateBookmarkHandler(controlAddBookmark);
  addRecipeView.addUploadHandler(controlAddRecipe);
};

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    //0) Spinner
    recipeView.renderSpinner();

    //0.5) Update results view to mark selected search result
    if (model?.state?.search?.query)
      resultsView.render(model.getSearchResultsPage());
    // bookmarksView.update(model.state.bookmarks);

    // 1) Loading Recipe
    await model.loadRecipe(id);

    // 2) Render recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError(error.message);
    console.error(error);
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
    paginationView.render(model.state.search);
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
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError(error.message);
  }
};

const controlAddBookmark = function () {
  try {
    // 1) Add/Remove bookmark
    if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
    else model.deleteBookmark(model.state.recipe.id);

    // 2) Update recipe view
    recipeView.render(model.state.recipe);

    // 3) Render bookmarks
    bookmarksView.render(model.state.bookmarks);
  } catch (error) {
    recipeView.renderError(error.message);
  }
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();

    //Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    //Render the bookmark view
    bookmarksView.render(model.state.bookmarks);

    //Change ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //SucessMessage
    addRecipeView.renderMsg();

    //Close form window
    setTimeout(() => addRecipeView.toggleWindow(), MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    addRecipeView.renderError(error.message);
  }
};

init();
