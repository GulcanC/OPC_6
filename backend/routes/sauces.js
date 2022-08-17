const express = require("express");

// Cette fonction est utilisée lorsque vous souhaitez créer un nouvel objet routeur dans votre programme pour gérer les requêtes.
const router = express.Router();

const multer = require("../middleware/multer-config");

const ctrlSauce = require("../controllers/sauces");

const auth = require("../middleware/auth");

//     /api/sauces yerine sadece / koy

// Les requêtes GET sont utilisées pour récupérer des données à partir de ressources spécifiées
// Les requêtes POST sont utilisées pour soumettre des données à une ressource spécifiée.

router.post("/", auth, multer, ctrlSauce.createSauce);

router.get("/:id", auth, ctrlSauce.getOneSauce);

router.get("/", auth, ctrlSauce.getAllSauces);

router.put("/:id", auth, multer, ctrlSauce.modifySauce);

router.delete("/:id", auth, ctrlSauce.deleteSauce);

router.post("/:id/like", auth, multer, ctrlSauce.likeDislike);

module.exports = router;
