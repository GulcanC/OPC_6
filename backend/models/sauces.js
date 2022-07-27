// importer mongoose
const mongoose = require('mongoose');
// créer le schéma, utilise la fonction schema() auqel on passe un objet qui dicte les champs

const sauceSchema = mongoose.Schema({
    //_id: { type: String, required: true }, // pas nécessaire puisque automatiquement généré par mongoose
    userId: { type: String, required: true },
    manufacturer: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number },
    dislikes: { type: Number},
    usersLiked: { type: [String] },
    usersDisliked: { type: [String] },
});

module.exports = mongoose.model('Sauce', sauceSchema); 