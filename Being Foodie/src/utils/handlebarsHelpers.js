const { handlebars } = require("hbs");

// Define the helpers within a function
function registerHandlebarsHelpers() {
  handlebars.registerHelper("isNull", function (value, options) {
    if (value === null) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  handlebars.registerHelper("isEqual", function (value1, value2, options) {
    if (value1 === value2) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });
}

// Export the function
module.exports = { registerHandlebarsHelpers };
