const express = require('express'); // installation du module express qui permet de coder plus facilement et rapidement en node 
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const path = require('path');

// importer le package pour utiliser les variables d'environnement
const dotenv = require('dotenv');
const result = dotenv.config();

// 🙄 after this create use.post for sauce

// 👽 importer ./routes/user.js, go to down to save routes
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauces');



// mongoose pour créer une interface avec bdd MongoDBm c'est créer un schéma qui nous permettre d'enregistrer, de lire, de modifier les objets.
// go to the models/sauce.js pour importer mongoose
// mongoose.connect('mongodb+srv://GC:projet6@cluster0.wwdoaoj.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PWD}@cluster0.wwdoaoj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  ,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

// CORS - Permet d'accéder au front - lien entre les 2 serveurs grâce aux autorisations ci-dessous

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // tout le monde peut se connecter
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // les requêtes get post put delete patch sont acceptées
  next(); // permet de passer à la lecture des autres middlewares
});


app.use(bodyParser.json());

// 👽 Afin d'enregistrer les routes ici, on ajoute app.use(), ce la route attendu par le frontend
// Ca sera la racine de tout ce qui est route liéee a l'authentification
// go to the routes/user.js to configure the router

app.use('/api/sauces', sauceRoutes);

app.use('/api/auth', userRoutes);

app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app; 