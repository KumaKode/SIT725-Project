require("dotenv").config();
const path = require("path");
const express = require("express");
const hbs = require("hbs");
const wApp = require("./utils/w-app");

const app = express();
const port = process.env.PORT || 3000;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "SkyCast",
    name: "SIT725-T2-2024",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "SkyCast",
    name: "SIT725-T2-2024",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    helpText: "This is some helpful text.",
    title: "SkyCast",
    name: "SIT725-T2-2024",
  });
});

app.get("/weather", async (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address!",
    });
  }

  const response = await wApp(req.query.address);

  if (response) {
    res.send(response);
  }
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "SIT725-T2-2024",
    errorMessage: "Help article not found.",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "SIT725-T2-2024",
    errorMessage: "Page not found.",
  });
});

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
