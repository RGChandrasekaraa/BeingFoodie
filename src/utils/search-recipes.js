const axios = require("axios");
require("dotenv").config();

// Fetching values from the .env file
const APP_ID = process.env.EDAMAM_APP_ID;
const APP_KEY = process.env.EDAMAM_APP_KEY;

const searchRecipes = async (userInput) => {
  const endpoint = `https://api.edamam.com/search?q=${userInput}&app_id=${APP_ID}&app_key=${APP_KEY}`;

  try {
    const response = await axios.get(endpoint);
    const hits = response.data.hits;

    // Map through the hits to extract and structure the desired details
    return hits.map((hit) => {
      const recipe = hit.recipe;

      return {
        title: recipe.label,
        healthLabels: recipe.healthLabels.join(" • "),
        servings: `${recipe.yield} servings`,
        calories: `${Math.round(recipe.calories)} kcal`,
        nutrients: {
          protein: `PROTEIN ${Math.round(
            recipe.totalNutrients.PROCNT.quantity
          )} g`,
          fat: `FAT ${Math.round(recipe.totalNutrients.FAT.quantity)} g`,
          carbs: `CARB ${Math.round(recipe.totalNutrients.CHOCDF.quantity)} g`,
          cholesterol: `Cholesterol ${Math.round(
            recipe.totalNutrients.CHOLE.quantity
          )} mg`,
          sodium: `Sodium ${Math.round(recipe.totalNutrients.NA.quantity)} mg`,
        },
        thumbnail: recipe.image,
      };
    });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
};

module.exports = { searchRecipes };
