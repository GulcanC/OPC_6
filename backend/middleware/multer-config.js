const multer = require("multer");

// un dictionair mime types, les trois differents mime types
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

//  créer un objet de configuration de multer
//  la fonction diskStorage() configure le chemin et le nom de fichier pour les fichiers entrants
const storage = multer.diskStorage({
  //  passer à diskStorage l'objet de configuration qui a deux elements
  //  destination est une fonction qui explique à multer dans quel dossier enregistre les fichiers
  destination: (req, file, callback) => {
    console.log(file);
    // appeler destination, premier argument est null signifie il y a pas erreur, deuxime argument le dossier images
    callback(null, "images");
  },
  // filename explique au multer que quelle nom de fichier utiliser
  // on ne peut pas utiliser le nom d'origin car nous allons des problem quand on a les fichier avec le meme nom
  filename: (req, file, callback) => {
    //  on va generer le nouveu nom pour le fichier, acceder original name
    //  split() va créer les differents mots du nom de fichier, join() pour rejoindre ce tableau en un seul string
    const name = file.originalname.split(" ").join("_");
    //  generer l'extension du fichier
    //  nous avons le nom de fichier et extension
    const extension = MIME_TYPES[file.mimetype];

    //  appeler call back, premier argument est null, pour dire qu'il n y a pas d'erreur
    //  deuxieme argument est le nom de fichier entier au quelle on va rajouter un timestamp, un point et l'extension du fichier
    callback(null, name + Date.now() + "." + extension);
  },
});

// utiliser la methode multer  à la quelle on passe notre objet storage, appeler single() pour dire qu'il s'agit d'un fichier image unique
module.exports = multer({ storage: storage }).single("image");

// Installer multer pour faciliter la géstion de fichier envoyé avec des requêtes HTTP vers notre API
// créer les dossier images pour enregistrer les images
