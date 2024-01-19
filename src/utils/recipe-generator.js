const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_BEARER_TOKEN,
});

async function fetchRecipe(inputData, dishName) {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `generate simple delicious recipe for ${dishName} based on the following data: ${inputData}. output need to be in json format, just return ingredients and instructions as property, value of this property is list of plain texts.`,
      },
    ],
    temperature: 1,
    max_tokens: 1080,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  const quoteContent =
    response.choices &&
    response.choices[0] &&
    response.choices[0].message &&
    response.choices[0].message.content;

  if (!quoteContent) {
    throw new Error("Failed to extract quote from OpenAI response");
  }

  return quoteContent;
}

function formatForOpenAI(recipeDetails) {
  return `
${recipeDetails.title}
${recipeDetails.healthLabels}
${recipeDetails.calories}
${recipeDetails.nutrients.protein}
${recipeDetails.nutrients.fat}
${recipeDetails.nutrients.carbs}
${recipeDetails.nutrients.cholesterol}
${recipeDetails.nutrients.sodium}
  `;
}

module.exports = { fetchRecipe };
