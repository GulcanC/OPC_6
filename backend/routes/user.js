const express = require("express");
// Cette fonction est utilisée lorsque vous souhaitez créer un nouvel objet routeur dans votre programme pour gérer les requêtes.
const router = express.Router();
// Il nous faut le controlleur pour associer les fonctions aux differentes routes
const userCtrl = require("../controllers/user");

// créer deux routes post, signup et login, utilise les fonctions signup() et login()
// Des routes post car le frontend envoyer des informations de l'address email et le mot de passe
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
