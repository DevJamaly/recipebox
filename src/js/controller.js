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

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

const init = function () {
  bookmarksView.addHandlerRender(handleBookmarksInit);
  recipeView.addHandlerRender(handleRecipeLoad);
  searchView.addHandlerSearch(handleSearchResults);
  paginationView.addHandlerPageClick(handlePageChange);
  recipeView.addHandlerServingsUpdate(handleServingsUpdate);
  recipeView.addHandlerBookmarkToggle(handleBookmarkToggle);
  addRecipeView.addHandlerUpload(handleRecipeUpload);
  bookmarksView.addHandlerBookmarkDelete(handleBookmarkDelete);
  bookmarksView.addHandlerBookmarksClear(handleBookmarksClear);
};

const handleRecipeLoad = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // 1) Spinner
    recipeView.renderSpinner();

    // 2) Update results view to mark the selected search result
    if (model?.state?.search?.query)
      resultsView.render(model.getSearchResultsPage());
    bookmarksView.render(model.state.bookmarks);

    // 3) Load recipe
    await model.loadRecipe(id);

    // 4) Render recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError(error.message);
  }
};

const handleSearchResults = async function () {
  try {
    // 1) Get search query
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
  }
};

const handlePageChange = function (gotoPageNum) {
  try {
    // 1) Render results for the requested page
    resultsView.render(model.getSearchResultsPage(gotoPageNum));

    // 2) Re-render pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    paginationView.renderError(error.message);
  }
};

const handleServingsUpdate = function (newServings) {
  try {
    // 1) Update the recipe servings in state
    model.updateServings(newServings);

    // 2) Update the recipe view
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError(error.message);
  }
};

const handleBookmarkToggle = function () {
  try {
    // 1) Add/remove bookmark
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

const handleBookmarkDelete = function (id) {
  // 1) Remove bookmark
  model.deleteBookmark(id);

  // 2) Update recipe view
  recipeView.render(model.state.recipe);

  // 3) Update bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const handleBookmarksClear = function () {
  // 1) Remove all bookmarks
  model.deleteAllBookmarks();

  // 2) Update recipe view
  recipeView.render(model.state.recipe);

  // 3) Update bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const handleBookmarksInit = function () {
  bookmarksView.render(model.state.bookmarks);
};

const handleRecipeUpload = async function (newRecipe) {
  try {
    // 1) Show loading spinner
    addRecipeView.renderSpinner();

    // 2) Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    // 3) Render recipe
    recipeView.render(model.state.recipe);

    // 4) Render the bookmark view
    bookmarksView.render(model.state.bookmarks);

    // 5) Change ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // 6) Success message
    addRecipeView.renderMsg();

    // 7) Close form window
    setTimeout(() => addRecipeView.toggleWindow(), MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    addRecipeView.renderError(error.message);
  }
};

init();
