// Import dependencies
const express = require("express");
const mysql = require("mysql2");
const countryRoutes = require("./models/country");
const languageRoutes= require("./models/languagereport")

// Create express instance
const app = express();
const port = 3000;

// Setup database connection
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST || "localhost",
  user: "user",
  password: "password",
  database: "world",
});

// Setup middleware, view engine, etc.
app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('static'));

// Use the routes defined in countryRoutes.js, passing the app and db as arguments
countryRoutes(app, db);
languageRoutes(app,db);

// Home Page route
app.get("/", (req, res) => {
  res.render("index");
});

// Run server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
