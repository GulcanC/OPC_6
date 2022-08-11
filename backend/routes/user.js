const express = require("express");
const router = express.Router();

// Il nous faut le controlleur pour associer les fonctions aux differentes routes
const userCtrl = require("../controllers/user");

// créer deux routes post, signup et login, utilise les focntions signup() et login()
// Des routes post car le frontend envoyer des informations de l'address email et le mot de passe
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
