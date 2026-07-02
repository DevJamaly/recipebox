import { API_URL } from './config';
import { getJson } from './helpers';
import { RESULTS_PER_PAGE } from './config';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJson(
      `${API_URL /* + 'YOLO' */}/${id /* + 'zzzz' */}`,
    );
    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      imageUrl: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    console.log(state.recipe);
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
    const data = await getJson(
      `${API_URL}?search=${query}` /* &key=<insert your key> */,
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
      };
    });
    // state.search.results = state.search.results.slice(1, 8);
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
