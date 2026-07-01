import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model.js';
import recipeView from './views/recipeView.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    console.log(id);

    if (!id) return;

    //0) Spinner
    recipeView.renderSpinner();

    // 1) Loading Recipe
    await model.loadRecipe(id);

    // 2) Render recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    alert(error);
  }
};

// showRecipe();
['hashchange', 'load'].forEach(eventType =>
  window.addEventListener(eventType, controlRecipes),
);

// window.addEventListener('hashchange', function (e) {
//   showRecipe();
// });

// window.addEventListener('load', function (e) {
//   showRecipe();
// });
