// 1 Importer mongoose On va stocker des documents user dans notre base de données
const mongoose = require("mongoose");

// 5 Les erreurs générées par défaut par MongoDB pouvant être difficiles à résoudre,
// Pour ameliorer ces messages d'erreur lors de l'enregistrement de données uniques
const uniqueValidator = require("mongoose-unique-validator");

// 2 Créer le schéma, utiliser la fonction Schema() de mogoose
const userSchema = mongoose.Schema({
  // 3 stocker l'address email et password, le mot de passe sera un hash
  // 4 Plusieurs users pourraient utiliser la même adresse mail, donc on ajoute une configuration unique:true
  // 4 Dans ce cas les utilisateurs ne peuvent pas utiliser la meme addresse mail
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Ce validateur, on aplique au schéma avant d'en faire un modèele
// appeller la méthode plugin() et passe uniqueValidateur comme argument
userSchema.plugin(uniqueValidator);

// 6 exporter ce schema sous forme de modèle, utlise la fonction modele() de mongoose
// La modele est 'user' et on lui passe le userSchema comme schema de données
module.exports = mongoose.model("user", userSchema);
