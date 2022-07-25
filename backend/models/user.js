// 1 On va stocker des documents user dans notre base de données
// Importer mongoose

const mongoose = require('mongoose');

// 4 Les erreurs générées par défaut par MongoDB pouvant être difficiles à résoudre, nous installerons un package de validation pour prévalider les informations avant de les enregistrer :
// npm install mongoose-unique-validator, on ajoute ce validateur comme plugin à notre schema
const uniqueValidator = require('mongoose-unique-validator');

// 2 Créer le schéma, utiliser la fonction Schema() de mogoose
const userSchema = mongoose.Schema({
    // stocker l'address mail et password, le mot de passe sera un hash
    // le mot de passe crypté est aussi un string
    // Plusieurs users pourraient utiliser la même adresse mail, donc on ajoute une configuration unique:true
    // Dans ce cas les utilisateurs ne peuvent pas utiliser la meme addresse mail
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

// 5 Ce validateur, on aplique au schéma avant d'en faire un modèele
// appeller la méthode plugin() et passe uniqueValidateur comme argument
userSchema.plugin(uniqueValidator);

// 3 exporter ce schema sous forme de modèle, utlise la fonction modele() de mongoose
// La modele est 'user' et on lui passe le userSchema comme schema de données
module.exports = mongoose.model('user',userSchema);
