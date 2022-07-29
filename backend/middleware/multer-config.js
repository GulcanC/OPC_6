 // importer multer 
const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
  };

// créer un objet de configuration de multer
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        // appeler destination, premier argument est null signifie il y a pas erreur, deuxime argument le dossier images
        callback(null, 'images');
    },
    // filename explique au multer que quelle nom de fichier utiliser
    filename: (req, file, callback) => {
        // on va generer le nouveu nom pour le fichier
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);

    }
})

// exporter le middleware multer
module.exports = multer({storage: storage}).single('image');  