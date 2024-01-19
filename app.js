const express = require("express");
const hbs = require("hbs");
const path = require("path");
require("dotenv").config();
const { registerHandlebarsHelpers } = require("./src/utils/handlebarsHelpers");
const {
  updateUniqueVisitorCount,
  logRequest,
} = require("./src/utils/S3-counter");

const app = express();
const PORT = 3000;

// Set the view engine to use hbs
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the "public" directory
app.use("/public", express.static("public"));

// Set up partials directory (optional)
hbs.registerPartials(path.join(__dirname, "views/partials"));

registerHandlebarsHelpers();

app.use(async (req, res, next) => {
  const ipAddress = req.ip;
  const endpoint = req.originalUrl;
  const timestamp = new Date().toISOString();

  // Log the request
  const logEntry = {
    timestamp,
    ipAddress,
    endpoint,
  };

  await logRequest(logEntry);

  // Check and update unique visitor count
  await updateUniqueVisitorCount(ipAddress);

  next();
});

// Set up routes
const mainRouter = require("./src/routes/main");
app.use("/", mainRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
