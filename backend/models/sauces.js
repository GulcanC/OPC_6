// importer mongoose, créer une interface avec notre bdd, c'est de créer un schema, un model de données, permettrer d'enregistrer, de lire, de modifier
const mongoose = require("mongoose");

// créer le schéma, utilise la fonction schema() auqel on passe un objet qui dicte les champs
const sauceSchema = mongoose.Schema({
  //_id: { type: String, required: true }, // pas nécessaire puisque automatiquement généré par mongoose
  // ajouter le nom de champ dans notre objet de configuration, créer un objet pour chaque champ pour configure les champ
  // ajouter le type de champ, ajouter la configuration required, sans userId on ne peut pas ajouter sauce
  userId: { type: String, required: true },
  manufacturer: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number },
  dislikes: { type: Number },
  usersLiked: { type: [String] },
  usersDisliked: { type: [String] },
});

// La méthode  model  transforme ce modèle en un modèle utilisable.
module.exports = mongoose.model("Sauce", sauceSchema);
