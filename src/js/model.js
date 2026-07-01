import { API_URL } from './config';
import { getJson } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
  },
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJson(`${API_URL + 'YOLO'}/${id /* + 'zzzz' */}`);
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
        errorMsg = `Ooops something went wrong! (${error.message})`;
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
        errorMsg = `Ooops something went wrong! (${error.message})`;
        break;
    }
    throw new Error(errorMsg);
  }
};
