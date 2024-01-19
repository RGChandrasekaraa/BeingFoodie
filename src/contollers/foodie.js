const { searchRecipes } = require("../utils/search-recipes");
const { fetchRecipe } = require("../utils/recipe-generator");
const { searchGooglePlaces } = require("../utils/nearby-spots");
const { weatherLookup } = require("../utils/spot-weather");
const isJSON = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

function makeRecipe(recipe, dishCount) {
  let edamamData, openAIData;
  openAIData = {
    instructions: [],
    ingredients: [],
  };
  return searchRecipes(recipe)
    .then((recipes) => {
      edamamData = recipes;
      // console.log(recipes);
      return fetchRecipe(recipes[dishCount].servings, recipes[0].title);
    })
    .then((data) => {
      console.log(data);
      if (isJSON(data)) {
        if (JSON.parse(data).ingredients && JSON.parse(data).instructions)
          openAIData = JSON.parse(data);
      }
      return {
        nutriDataAll: edamamData,
        nutriData: edamamData[dishCount],
        instructData: openAIData,
      };
    });
}

function exploreRecipe(recipe, latitude, longitude) {
  return searchGooglePlaces(recipe + " near me", latitude, longitude)
    .then((data) => {
      console.log(data);
      return weatherLookup(data);
    })
    .then((data) => {
      return data;
    });
}

module.exports = { makeRecipe, exploreRecipe };
