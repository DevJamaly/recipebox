import { API_URL, KEY, RESULTS_PER_PAGE } from './config.js';
import { AJAX } from './helpers.js';
import { describeError } from './errors.js';

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

const createRecipeObject = function (recipe) {
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
    const { recipe } = data.data;
    state.recipe = createRecipeObject(recipe);
  } catch (error) {
    throw new Error(describeError(error, 'recipe'));
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
    state.search.results = data.data.recipes.map(recipe =>
      createRecipeObject(recipe),
    );
    state.search.page = 1;
  } catch (error) {
    throw new Error(describeError(error, 'search results'));
  }
};

/**
 * Returns the slice of search results for the given page.
 * @param {number} [pageNum] - defaults to the current page in state
 */
export const getSearchResultsPage = function (pageNum = state.search.page) {
  if (!state.search.results)
    throw new Error('No search results available yet.');

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
  if (!state?.recipe?.ingredients) throw new Error('No recipe loaded in state');
  if (newServings <= 0) throw new Error('Servings must be greater than 0.');

  state.recipe.ingredients.forEach(ingredient => {
    ingredient.quantity =
      (ingredient.quantity / state.recipe.servings) * newServings;
  });
  state.recipe.servings = newServings;
};

export const addBookmark = function (recipe) {
  if (state.bookmarks.some(b => b.id === recipe.id)) return; // already bookmarked

  const updated = [...state.bookmarks, recipe];
  persistBookmarks(updated); // throws before anything is mutated if storage fails

  state.bookmarks = updated;
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
};

export const deleteBookmark = function (id) {
  const exists = state.bookmarks.some(b => b.id === id);
  if (!exists) throw new Error('Bookmark not found.');

  const updated = state.bookmarks.filter(b => b.id !== id);
  persistBookmarks(updated);

  state.bookmarks = updated;
  if (id === state.recipe.id) state.recipe.bookmarked = false;
};

export const deleteAllBookmarks = function () {
  clearStoredBookmarks(); // throws before anything is mutated if storage fails

  state.bookmarks = [];
  state.recipe.bookmarked = false;
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

  try {
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (error) {
    throw new Error(describeError(error, 'recipe upload'));
  }
};

// Writes bookmarks to storage first; only throws, never mutates state itself.
const persistBookmarks = function (bookmarks) {
  try {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  } catch {
    throw new Error('Could not save bookmarks. Storage may be full.');
  }
};

const clearStoredBookmarks = function () {
  try {
    localStorage.removeItem('bookmarks');
  } catch {
    throw new Error('Could not clear bookmarks. Storage may be unavailable.');
  }
};

const loadBookmarks = function () {
  try {
    const storageData = localStorage.getItem('bookmarks');
    if (storageData) state.bookmarks = JSON.parse(storageData);
  } catch (error) {
    console.error('Saved bookmarks were corrupted, starting fresh:', error);
    state.bookmarks = [];
  }
};

// Restore any bookmarks saved from a previous session.
loadBookmarks();
