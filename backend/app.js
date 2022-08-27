const express = require("express");
// mongoose pour créer une interface avec bdd MongoDB c'est créer un schéma qui nous permettre d'enregistrer, de lire, de modifier les objets.
const mongoose = require("mongoose");

const bodyParser = require("body-parser");
// ***
const path = require("path");

require("dotenv").config({ path: "./vars/.env" });

// 👽 importer ./routes/user.js, ./routes/sauces.js, go to down to save routes
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauces");

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PWD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

console.log(process.env.DB_USERNAME);

const app = express();

// CORS - Permet d'accéder au front - lien entre les 2 serveurs grâce aux autorisations ci-dessous
// CORS: cross-origin request sharing
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // tout le monde peut se connecter a notre API
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization" // On donne l'autorisation d'utiliser certains headers sur l'objet requête
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  ); // On donne l'autorisation d'utiliser certains methodes sur l'objet requête; get post put delete patch
  next(); // permet de passer à la lecture des autres middlewares
});

// transformer le corps, body, en JSON objet JS
app.use(bodyParser.json());

// Afin d'enregistrer les routes ici, on ajoute app.use(), ce la route attendu par le frontend
// Ca sera la racine de tout ce qui est route liéee a l'authentification
app.use("/api/sauces", sauceRoutes);

app.use("/api/auth", userRoutes);

// *** traiter les requêtes vers la route /image, en rendant notre dossier images statique.
// dirname est le chemin absolu vers le répertoire contenant le fichier source.
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
