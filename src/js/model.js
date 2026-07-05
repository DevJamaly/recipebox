import { API_URL, KEY } from './config';
import { AJAX } from './helpers';
import { RESULTS_PER_PAGE } from './config';

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

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(
      `${API_URL /* + 'YOLO' */}/${id /* + 'zzzz' */}?key=${KEY}`,
    );
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

export const loadSearchResults = async function (query) {
  try {
    const data = await AJAX(
      `${API_URL}?search=${query}&key=${KEY}` /* &key=<insert your key> */,
    );
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
    // state.search.results = state.search.results.slice(1, 8); //TEST FOR SINGLE PAGE
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

export const getSearchResultsPage = function (pageNum = state.search.page) {
  state.search.page = pageNum;
  const start = (pageNum - 1) * state.search.resultsPerPage;
  const end = pageNum * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  if (!state?.recipe?.ingredients) throw new Error('No recipe loaded in state');
  console.log(state.recipe.ingredients);
  state.recipe.ingredients.forEach(ingredient => {
    ingredient.quantity =
      (ingredient.quantity / state.recipe.servings) * newServings;
  });
  state.recipe.servings = newServings;
};

export const addBookmark = function (recipe) {
  //TODO: Add a check to see if this exists in array already

  //Add bookmark
  state.bookmarks.push(recipe);

  //Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  saveBookmarks();
};

export const deleteBookmark = function (id) {
  //delete recipe from the bookmarked array
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  //Mark current recipe as NOT bookmark
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  saveBookmarks();
};

export const deleteAllBookmarks = function () {
  //delete all recipes from the bookmarked array
  state.bookmarks = [];
  //Mark current recipe as NOT bookmark
  state.recipe.bookmarked = false;

  clearBookmarks();
};

export const uploadRecipe = async function (newRecipe) {
  try {
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
    // console.log(recipe);

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};

const saveBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const loadBookmarks = function () {
  console.log(`LOADING BOOKMARKS`);
  const storageData = localStorage.getItem('bookmarks');
  if (storageData) state.bookmarks = JSON.parse(storageData);
};

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

const init = function () {
  loadBookmarks();
};

console.log('MODEL INIT RUNNING');
init();
