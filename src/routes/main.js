const express = require("express");
const router = express.Router();
const { makeRecipe, exploreRecipe } = require("../contollers/foodie");
const { getVisitorCount } = require("../utils/S3-counter");

router.get("/", async (req, res) => {
  let recipe = req.query.recipe;
  let action = req.query.action;
  let latitude = req.query.lat;
  let longitude = req.query.lng;
  let visitorCount = await getVisitorCount();
  let dishCount = req.query.dishCount ? req.query.dishCount : 0;
  if (action === "prepare") {
    makeRecipe(recipe, dishCount).then((data) => {
      //console.log(data);
      res.render("index", {
        pageTitle: "Home",
        nutriDataAll: data.nutriDataAll,
        nutriData: data.nutriData,
        instructData: data.instructData,
        recipe: recipe,
        action: action,
        visitorCount: visitorCount,
        dishCount: dishCount,
        currentTile: parseInt(dishCount) + 1,
        totalTiles: data.nutriDataAll.length,
      });
    });
  }
  if (action === "explore") {
    exploreRecipe(recipe, latitude, longitude).then((data) => {
      res.render("index", {
        pageTitle: "Home",
        recipe: recipe,
        action: action,
        places: JSON.stringify(data),
        visitorCount: visitorCount,
      });
    });
  }

  if (!action && !recipe) {
    res.render("index", {
      pageTitle: "Home",
      recipe: recipe,
      action: action,
      visitorCount: visitorCount,
    });
  }
});

module.exports = router;
