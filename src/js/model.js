import { API_URL, KEY, RESULTS_PER_PAGE } from './config.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    imageUrl: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    bookmarked: state.bookmarks.some(bookmark => bookmark.id === recipe.id),
    ...(recipe.key && { key: recipe.key }),
  };
};

/**
 * Loads a single recipe by ID into state.
 * @param {string} id
 */
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);
  } catch (error) {
    let errorMsg = '';
    switch (Number.parseInt(error.message)) {
      case 400:
        errorMsg = `Could not find recipe! Invalid ID (${error.message})`;
        break;

      case 404:
        errorMsg = `Could not find server! Malformed URL (${error.message})`;
        break;

      default:
        errorMsg = undefined;
        break;
    }
    throw new Error(errorMsg);
  }
};

/**
 * Searches recipes by query and stores the full result set in state.
 * @param {string} query
 */
export const loadSearchResults = async function (query) {
  try {
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.query = query;
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        imageUrl: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    state.search.page = 1;
  } catch (error) {
    let errorMsg = '';
    switch (Number.parseInt(error.message)) {
      case 400:
        errorMsg = `Could not find recipe! Invalid ID (${error.message})`;
        break;

      case 404:
        errorMsg = `Could not find server! Malformed URL (${error.message})`;
        break;

      default:
        errorMsg = undefined;
        break;
    }
    throw new Error(errorMsg);
  }
};

/**
 * Returns the slice of search results for the given page.
 * @param {number} [pageNum] - defaults to the current page in state
 */
export const getSearchResultsPage = function (pageNum = state.search.page) {
  state.search.page = pageNum;
  const start = (pageNum - 1) * state.search.resultsPerPage;
  const end = pageNum * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

/**
 * Recalculates every ingredient's quantity for a new serving size.
 * @param {number} newServings
 */
export const updateServings = function (newServings) {
  if (!state?.recipe?.ingredients)
    throw new Error('No recipe loaded in state');

  state.recipe.ingredients.forEach(ingredient => {
    ingredient.quantity =
      (ingredient.quantity / state.recipe.servings) * newServings;
  });
  state.recipe.servings = newServings;
};

export const addBookmark = function (recipe) {
  // TODO: Add a check to see if this exists in array already
  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  saveBookmarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;

  saveBookmarks();
};

export const deleteAllBookmarks = function () {
  state.bookmarks = [];
  state.recipe.bookmarked = false;

  clearBookmarks();
};

/**
 * Uploads a user-submitted recipe and bookmarks it automatically.
 * @param {Object} newRecipe - raw form data from the add-recipe form
 */
export const uploadRecipe = async function (newRecipe) {
  const prepHours = isFinite(+newRecipe.prepTimeHours)
    ? +newRecipe.prepTimeHours * 60
    : 0;
  const prepMins = isFinite(+newRecipe.prepTimeMinutes)
    ? +newRecipe.prepTimeMinutes
    : 0;

  const recipe = {
    title: newRecipe.title,
    source_url: newRecipe.sourceUrl,
    image_url: newRecipe.image,
    publisher: newRecipe.publisher,
    cooking_time: prepHours + prepMins,
    servings: +newRecipe.servings,
    ingredients: newRecipe.ingredients,
  };

  const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
  state.recipe = createRecipeObject(data);
  addBookmark(state.recipe);
};

const saveBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const loadBookmarks = function () {
  const storageData = localStorage.getItem('bookmarks');
  if (storageData) state.bookmarks = JSON.parse(storageData);
};

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

// Restore any bookmarks saved from a previous session.
loadBookmarks();
